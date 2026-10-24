import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { createWriter } from './writer-server.js';
import { createImageEditor } from './image-editor-server.js';

const production = process.argv.includes('--production');
const root = fileURLToPath(new URL(production ? '../public/' : '../site/', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain' };
const port = Number(process.env.PORT || (production ? 8001 : 8000));
const writer = !production && createWriter({ root, backupRoot: fileURLToPath(new URL('../.local/writer/backups/', import.meta.url)) });
const imageEditor = !production && createImageEditor({ root, localRoot: fileURLToPath(new URL('../.local/images/', import.meta.url)) });
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (writer && await writer(req, res, url)) return;
    if (imageEditor && await imageEditor(req, res, url)) return;
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end('Method not allowed'); return; }
    const path = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (path !== root.slice(0, -1) && !path.startsWith(root.endsWith(sep) ? root : root + sep)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    let file = path;
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { Location: url.pathname + '/' + url.search }).end();
        return;
      }
      file = resolve(file, 'index.html');
    }
    let body = await readFile(file);
    const type = types[extname(file)] || 'application/octet-stream';
    if (!production && type === 'text/html') body = Buffer.from(body.toString().replace('</body>', '<link rel="stylesheet" href="/image-editor/dev.css"><nav class="local-tools" aria-label="Local editing"><span>Local</span><a href="/image-editor/">Blur screenshots</a><a href="/write/">Write case studies</a></nav></body>'));
    const cacheControl = !production ? 'no-store' : /^\/assets\/screenshots\//.test(url.pathname) ? 'public, max-age=31536000, immutable' : 'no-cache';
    res.writeHead(200, { 'Content-Type': type + (type.startsWith('text/') ? '; charset=utf-8' : ''), 'Cache-Control': cacheControl });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400 : ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500;
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : status === 404 ? await readFile(resolve(root, '404.html')) : 'Unable to serve request');
  }
}).listen(port, '127.0.0.1', () => console.log(`Portfolio: http://localhost:${port}`));
