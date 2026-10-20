// Local authoring only. Nothing in this module is copied to public/.
import { readFile, writeFile, mkdir, rename, readdir, stat, unlink } from 'node:fs/promises';
import { resolve, extname, relative } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';

export const projects = [
  { slug: 'productivity', name: 'Productivity' },
  { slug: 'yummy-recs', name: 'Yummy Recs' },
  { slug: 'data-desktop', name: 'Data Desktop' },
];
const assets = new Map([['/write/', ['index.html', 'text/html']], ['/write/writer.css', ['writer.css', 'text/css']], ['/write/writer.js', ['writer.js', 'text/javascript']]]);
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const unescape = value => value.replace(/&(amp|lt|gt|quot|#39|#x27);/g, (_, entity) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", '#x27': "'" })[entity]);
const digest = value => createHash('sha256').update(value).digest('hex');
function problem(status, message) { return Object.assign(new Error(message), { status }); }
function section(html, name) {
  const pattern = new RegExp(`<!-- case-study:${name} -->([\\s\\S]*?)<!-- /case-study:${name} -->`);
  const match = html.match(pattern);
  if (!match) throw problem(409, 'This page’s editing markers are missing. Check the HTML file before saving.');
  return { pattern, value: match[1] };
}
function listing(html, slug) {
  const entry = [...html.matchAll(/<article>[\s\S]*?<\/article>/g)].find(([entry]) => entry.includes(`href="/blog/${slug}/"`));
  if (!entry) throw problem(409, 'The project’s Blog listing is missing. Check site/blog/index.html.');
  return entry[0];
}

export function createWriter({ root, backupRoot, assetRoot = new URL('./writer/', import.meta.url) }) {
  const token = randomBytes(32).toString('hex');
  let pending = Promise.resolve();
  const locked = action => {
    const result = pending.then(action);
    pending = result.catch(() => {});
    return result;
  };
  const fileFor = slug => resolve(root, 'blog', slug, 'index.html');
  const blogFile = resolve(root, 'blog/index.html');
  async function load(slug) {
    const [html, blog] = await Promise.all([readFile(fileFor(slug), 'utf8'), readFile(blogFile, 'utf8')]);
    const entry = listing(blog, slug);
    return { html, blog, entry, data: {
      slug,
      title: unescape(html.match(/<h1>([\s\S]*?)<\/h1>/)[1]),
      summary: unescape(html.match(/<meta name="description" content="([^"]*)">/)[1]),
      comingSoon: section(html, 'status').value.includes('Case study coming soon'),
      body: section(html, 'body').value.trim(),
      revision: digest(html + entry),
    } };
  }
  async function images(dir = resolve(root, 'images')) {
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); } catch (error) { if (error.code === 'ENOENT') return []; throw error; }
    return (await Promise.all(entries.map(async entry => {
      const file = resolve(dir, entry.name);
      if (entry.isDirectory()) return images(file);
      if (entry.isFile() && /\.(png|jpe?g|webp|avif)$/i.test(entry.name)) return '/' + relative(root, file).split('\\').join('/');
      return [];
    }))).flat().sort();
  }
  async function validateBody(body) {
    if (typeof body !== 'string' || Buffer.byteLength(body) > 60000) throw problem(400, 'Keep the article body under 60 kB.');
    const allowed = new Set(['p', 'h2', 'h3', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'blockquote', 'pre', 'code', 'br', 'hr', 'figure', 'figcaption', 'img']);
    const voidTags = new Set(['br', 'hr', 'img']);
    const stack = [];
    const localImages = new Set(await images());
    // Accept only the editor’s small HTML vocabulary; no scripts, styles, or event handlers.
    for (const token of body.match(/<[^>]*>|[^<]+|</g) || []) {
      if (!token.startsWith('<')) continue;
      const match = token.match(/^<(\/)?([a-z][a-z0-9]*)([^<>]*)>$/);
      if (!match || !allowed.has(match[2])) throw problem(400, 'The article contains unsupported HTML. Paste plain text and use the formatting buttons.');
      const [, closing, tag, raw] = match;
      if (closing) {
        if (raw || stack.pop() !== tag) throw problem(400, 'The article has unbalanced HTML.');
        continue;
      }
      const attrs = {};
      const rest = raw.replace(/ ([a-z]+)="([^"<>]*)"/g, (_, key, value) => {
        if (Object.hasOwn(attrs, key)) throw problem(400, 'Duplicate image or link attribute.');
        attrs[key] = unescape(value);
        return '';
      });
      const permitted = tag === 'a' ? ['href'] : tag === 'img' ? ['src', 'alt', 'width', 'height', 'loading'] : [];
      if (rest || Object.keys(attrs).some(key => !permitted.includes(key))) throw problem(400, 'Unsupported formatting. Paste plain text and format it in the editor.');
      if (tag === 'a' && (!attrs.href || !/^(https?:\/\/|mailto:|\/(?!\/)|#)[^\s<>"`]*$/i.test(attrs.href))) throw problem(400, 'Links must use https://, http://, mailto:, /, or #.');
      if (tag === 'img') {
        if (!localImages.has(attrs.src) || !attrs.alt?.trim() || !/^\d{1,5}$/.test(attrs.width || '') || !/^\d{1,5}$/.test(attrs.height || '') || attrs.loading !== 'lazy') throw problem(400, 'Use the image picker and add a description for each image.');
      }
      if (!voidTags.has(tag)) stack.push(tag);
    }
    if (stack.length) throw problem(400, 'The article has unbalanced HTML.');
  }
  async function save(slug, data) {
    if (typeof data.title !== 'string' || !data.title.trim() || data.title.length > 160) throw problem(400, 'Add a title of 160 characters or fewer.');
    if (typeof data.summary !== 'string' || !data.summary.trim() || data.summary.length > 500) throw problem(400, 'Add a summary of 500 characters or fewer.');
    if (typeof data.comingSoon !== 'boolean') throw problem(400, 'Choose the coming soon status.');
    await validateBody(data.body);
    const current = await load(slug);
    if (data.revision !== current.data.revision) throw problem(409, 'This project changed on disk. Copy your draft, then reload the saved version before saving again.');
    const title = escape(data.title.trim());
    const summary = escape(data.summary.trim());
    const status = data.comingSoon ? '<p class="meta">Case study coming soon</p>' : '';
    let html = current.html
      .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title} | Nicholas Pung</title>`)
      .replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${summary}">`)
      .replace(/<meta property="og:title" content="[^"]*">/, () => `<meta property="og:title" content="${title} | Nicholas Pung">`)
      .replace(/<meta property="og:description" content="[^"]*">/, () => `<meta property="og:description" content="${summary}">`)
      .replace(/<h1>[\s\S]*?<\/h1>/, () => `<h1>${title}</h1>`);
    html = html.replace(section(html, 'status').pattern, () => `<!-- case-study:status -->${status}<!-- /case-study:status -->`)
      .replace(section(html, 'body').pattern, () => `<!-- case-study:body -->\n${data.body.trim()}\n<!-- /case-study:body -->`);
    const entry = `<article>${status}<h2><a href="/blog/${slug}/">${title}</a></h2><p>${summary}</p></article>`;
    const blog = current.blog.replace(current.entry, () => entry);
    await mkdir(backupRoot, { recursive: true });
    const stamp = `${new Date().toISOString().replaceAll(':', '-')}-${randomBytes(4).toString('hex')}`;
    const backup = resolve(backupRoot, `${slug}-${stamp}.json`);
    await writeFile(backup, JSON.stringify({ slug, savedAt: new Date().toISOString(), article: current.html, blog: current.blog }, null, 2), { flag: 'wx' });
    const articleTemp = fileFor(slug) + '.writer-tmp';
    const blogTemp = blogFile + '.writer-tmp';
    try {
      await Promise.all([writeFile(articleTemp, html), writeFile(blogTemp, blog)]);
      await rename(articleTemp, fileFor(slug));
      await rename(blogTemp, blogFile);
    } catch (error) {
      await Promise.all([writeFile(fileFor(slug), current.html), writeFile(blogFile, current.blog)]);
      throw error;
    } finally {
      await Promise.allSettled([unlink(articleTemp), unlink(blogTemp)]);
    }
    return { ...(await load(slug)).data, backup: relative(resolve(root, '..'), backup) };
  }
  async function readJson(req) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 100000) throw problem(413, 'The article is too large. Keep text under 60 kB.');
      chunks.push(chunk);
    }
    try { return JSON.parse(Buffer.concat(chunks).toString()); } catch { throw problem(400, 'Invalid JSON.'); }
  }
  function json(res, status, value) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }).end(JSON.stringify(value));
  }
  return async (req, res, url) => {
    if (url.pathname !== '/write' && !url.pathname.startsWith('/write/')) return false;
    // Loopback Host and same-origin writes keep other websites from editing local files.
    if (!/^(localhost|127\.0\.0\.1):\d+$/.test(req.headers.host || '')) { json(res, 403, { error: 'Use localhost to open the editor.' }); return true; }
    try {
      if (url.pathname === '/write' && req.method === 'GET') { res.writeHead(302, { Location: '/write/' }).end(); return true; }
      if (assets.has(url.pathname) && req.method === 'GET') {
        const [name, type] = assets.get(url.pathname);
        res.writeHead(200, { 'Content-Type': type + '; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'" }).end(await readFile(new URL(name, assetRoot)));
        return true;
      }
      if (url.pathname === '/write/api' && req.method === 'GET') {
        json(res, 200, { projects, images: await images(), token }); return true;
      }
      const match = url.pathname.match(/^\/write\/api\/([a-z-]+)$/);
      if (!match || !projects.some(project => project.slug === match[1])) throw problem(404, 'Case study not found.');
      if (req.method === 'GET') { json(res, 200, (await locked(() => load(match[1]))).data); return true; }
      if (req.method !== 'PUT') throw problem(405, 'Use GET or PUT.');
      if (req.headers.origin !== `http://${req.headers.host}` || req.headers['x-writer-token'] !== token || req.headers['content-type'] !== 'application/json') throw problem(403, 'Save from the local editor tab. Reload it if the server restarted.');
      const data = await readJson(req);
      if (!data || typeof data !== 'object') throw problem(400, 'Invalid article data.');
      json(res, 200, await locked(() => save(match[1], data)));
    } catch (error) {
      if (!error.status) console.error('Local writer:', error);
      json(res, error.status || 500, { error: error.status ? error.message : 'Unable to save. Your draft is still in the editor; check the server output.' });
    }
    return true;
  };
}
