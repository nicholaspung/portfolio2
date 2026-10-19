// Local-only image authoring. The static build copies none of these routes or originals.
import { readFile, writeFile, mkdir, rename, readdir, realpath, unlink } from 'node:fs/promises';
import { resolve, relative, extname, sep } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';

const hash = value => createHash('sha256').update(value).digest('hex');
const problem = (status, message) => Object.assign(new Error(message), { status });
const formats = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif' };
const assets = { '/image-editor/': ['index.html', 'text/html'], '/image-editor/editor.js': ['editor.js', 'text/javascript'], '/image-editor/editor.css': ['editor.css', 'text/css'], '/image-editor/dev.css': ['dev.css', 'text/css'] };
const imageLimit = 512000;

export function createImageEditor({ root, localRoot }) {
  const token = randomBytes(32).toString('hex');
  let pending = Promise.resolve();
  const locked = action => {
    const result = pending.then(action);
    pending = result.catch(() => {});
    return result;
  };
  async function images(dir = resolve(root, 'images')) {
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); }
    catch (error) { if (error.code === 'ENOENT') return []; throw error; }
    return (await Promise.all(entries.map(async entry => {
      const file = resolve(dir, entry.name);
      if (entry.isDirectory()) return images(file);
      if (entry.isFile() && formats[extname(file).toLowerCase()]) return '/' + relative(root, file).split(sep).join('/');
      return [];
    }))).flat().sort();
  }
  async function fileFor(path) {
    if (typeof path !== 'string' || !(await images()).includes(path)) throw problem(404, 'Choose an image from site/images/.');
    const file = await realpath(resolve(root, '.' + path));
    const base = await realpath(resolve(root, 'images'));
    if (!file.startsWith(base + sep)) throw problem(403, 'Image must be inside site/images/.');
    return file;
  }
  const stateFile = path => resolve(localRoot, 'states', hash(path) + '.json');
  async function load(path) {
    const file = await fileFor(path);
    const image = await readFile(file);
    const revision = hash(image);
    let state;
    try { state = JSON.parse(await readFile(stateFile(path), 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    // An external edit starts a fresh source rather than applying an old recipe to new pixels.
    if (state?.revision !== revision) state = null;
    return { file, image, source: state ? Buffer.from(state.original, 'base64') : image, data: {
      path, revision, type: formats[extname(path).toLowerCase()],
      boxes: state?.boxes || [], strength: state?.strength || 24, bytes: image.length,
      editable: extname(path).toLowerCase() !== '.avif',
    } };
  }
  async function save(data) {
    const current = await load(data.path);
    if (data.revision !== current.data.revision) throw problem(409, 'This image changed on disk. Reload the image before saving again.');
    if (!current.data.editable) throw problem(400, 'Convert AVIF to PNG, JPEG, or WebP before editing.');
    if (!Array.isArray(data.boxes) || data.boxes.length > 100 || data.boxes.some(box =>
      !box || !['x', 'y', 'width', 'height'].every(key => Number.isFinite(box[key])) ||
      box.x < 0 || box.y < 0 || box.width <= 0 || box.height <= 0 || box.x + box.width > 1.000001 || box.y + box.height > 1.000001
    )) throw problem(400, 'Use up to 100 boxes inside the image.');
    if (!Number.isInteger(data.strength) || data.strength < 8 || data.strength > 80) throw problem(400, 'Choose a blur strength between 8 and 80.');
    let output;
    if (!data.boxes.length) output = current.source; // Clearing every box restores the original bytes.
    else {
      const prefix = `data:${current.data.type};base64,`;
      if (typeof data.image !== 'string' || !data.image.startsWith(prefix) || !/^[A-Za-z0-9+/]+={0,2}$/.test(data.image.slice(prefix.length))) throw problem(400, 'The browser could not encode this image in its original format.');
      output = Buffer.from(data.image.slice(prefix.length), 'base64');
      const type = current.data.type;
      const valid = type === 'image/png' ? output.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))
        : type === 'image/jpeg' ? output[0] === 0xff && output[1] === 0xd8 && output.at(-2) === 0xff && output.at(-1) === 0xd9
          : output.toString('ascii', 0, 4) === 'RIFF' && output.toString('ascii', 8, 12) === 'WEBP' && output.readUInt32LE(4) + 8 === output.length;
      if (!valid) throw problem(400, 'Invalid encoded image.');
    }
    if (output.length > imageLimit) throw problem(400, 'The edited image exceeds 500 kB. Lower the export quality or optimize the source first.');
    const paths = await images();
    const total = (await Promise.all(paths.map(async path => path === data.path ? output.length : (await readFile(await fileFor(path))).length))).reduce((a, b) => a + b, 0);
    if (total > 3 * 1024 * 1024) throw problem(400, 'Site images would exceed the 3 MB budget. Optimize images first.');
    const state = JSON.stringify({ ...current.data, boxes: data.boxes, strength: data.strength, revision: hash(output), original: current.source.toString('base64') });
    await mkdir(resolve(localRoot, 'states'), { recursive: true });
    const backup = resolve(localRoot, 'backups', `${new Date().toISOString().replaceAll(':', '-')}-${randomBytes(4).toString('hex')}`);
    await mkdir(backup, { recursive: true });
    const previousState = await readFile(stateFile(data.path)).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
    await writeFile(resolve(backup, 'image' + extname(data.path)), current.image);
    await writeFile(resolve(backup, 'metadata.json'), JSON.stringify({ path: data.path, previousState: previousState?.toString() || null }, null, 2));
    const imageTemp = current.file + '.blur-tmp';
    const stateTemp = stateFile(data.path) + '.tmp';
    try {
      await writeFile(imageTemp, output);
      await writeFile(stateTemp, state);
      // Catch external changes that occurred during encoding/backup as well.
      if (hash(await readFile(current.file)) !== current.data.revision) throw problem(409, 'This image changed on disk. Reload it before saving.');
      await rename(imageTemp, current.file);
      try { await rename(stateTemp, stateFile(data.path)); }
      catch (error) { await writeFile(current.file, current.image); throw error; }
    } finally { await Promise.allSettled([unlink(imageTemp), unlink(stateTemp)]); }
    return { ...(await load(data.path)).data, backup: relative(resolve(root, '..'), backup) };
  }
  const json = (res, status, value) => res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }).end(JSON.stringify(value));
  return async (req, res, url) => {
    if (url.pathname !== '/image-editor' && !url.pathname.startsWith('/image-editor/')) return false;
    try {
      if (!/^(localhost|127\.0\.0\.1):\d+$/.test(req.headers.host || '')) throw problem(403, 'Open the editor on localhost.');
      if (url.pathname === '/image-editor' && req.method === 'GET') { res.writeHead(302, { Location: '/image-editor/' }).end(); return true; }
      if (assets[url.pathname] && req.method === 'GET') {
        const [name, type] = assets[url.pathname];
        res.writeHead(200, { 'Content-Type': type + '; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'" }).end(await readFile(new URL('./image-editor/' + name, import.meta.url)));
      } else if (url.pathname === '/image-editor/api' && req.method === 'GET') {
        json(res, 200, { token, images: await images() });
      } else if (url.pathname === '/image-editor/api/image' && req.method === 'GET') {
        json(res, 200, (await locked(() => load(url.searchParams.get('path')))).data);
      } else if (url.pathname === '/image-editor/api/source' && req.method === 'GET') {
        // Originals are only returned to the authorized local editor, never under /images/.
        if (req.headers['x-image-token'] !== token) throw problem(403, 'Load originals from the local editor.');
        const current = await locked(() => load(url.searchParams.get('path')));
        res.writeHead(200, { 'Content-Type': current.data.type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }).end(current.source);
      } else if (url.pathname === '/image-editor/api/image' && req.method === 'PUT') {
        if (req.headers.origin !== `http://${req.headers.host}` || req.headers['x-image-token'] !== token || req.headers['content-type'] !== 'application/json') throw problem(403, 'Save from the local editor. Reload it if the server restarted.');
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 800000) throw problem(413, 'The edited image is too large. Lower the export quality.');
          chunks.push(chunk);
        }
        let data;
        try { data = JSON.parse(Buffer.concat(chunks).toString()); } catch { throw problem(400, 'Invalid JSON.'); }
        if (!data || typeof data !== 'object') throw problem(400, 'Invalid image data.');
        json(res, 200, await locked(() => save(data)));
      } else throw problem(404, 'Image editor route not found.');
    } catch (error) {
      if (!error.status) console.error('Local image editor:', error);
      json(res, error.status || 500, { error: error.status ? error.message : 'Unable to save the image. Your boxes are still in this tab; check the server output.' });
    }
    return true;
  };
}
