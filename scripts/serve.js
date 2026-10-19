import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { createWriter } from './writer-server.js';

const root = fileURLToPath(new URL('../site/', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.xml': 'application/xml', '.txt': 'text/plain' };
const port = Number(process.env.PORT || 8000);
const writer = createWriter({ root, backupRoot: fileURLToPath(new URL('../.local/writer/backups/', import.meta.url)) });
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (await writer(req, res, url)) return;
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
    const body = await readFile(file);
    const type = types[extname(file)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type + (type.startsWith('text/') ? '; charset=utf-8' : '') });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400 : ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500;
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : status === 404 ? await readFile(resolve(root, '404.html')) : 'Unable to serve request');
  }
}).listen(port, '127.0.0.1', () => console.log(`Portfolio: http://localhost:${port}`));
