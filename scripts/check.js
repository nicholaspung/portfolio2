import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = resolve(fileURLToPath(new URL('../site/', import.meta.url)));
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(resolve(dir, e.name)) : resolve(dir, e.name)))).flat();
}
const files = await walk(root);
const pages = files.filter(f => f.endsWith('.html'));
let total = 0;
let imageTotal = 0;
const imageTypes = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
for (const file of files) {
  const size = (await stat(file)).size;
  if (imageTypes.has(extname(file))) {
    assert.ok(size <= 512000, `${file}: screenshot exceeds 500 kB budget`);
    imageTotal += size;
  } else total += size;
}
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${file}: expected one h1`);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<main id="main">/);
  assert.doesNotMatch(html, /@import/i);
  for (const [tag] of html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)) {
    assert.equal(file, resolve(root, 'index.html'), 'Only the homepage needs browser JavaScript');
    assert.equal(tag, '<script src="/gallery.js" defer></script>', 'Use the local gallery enhancement only');
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    assert.match(tag, /\balt="[^"]+"/, `${file}: screenshots need descriptive alt text`);
    assert.match(tag, /\bsrc="\/(?!\/)[^"]+"/, `${file}: screenshots must use local assets`);
  }
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(href)) continue;
    const [path, fragment] = href.split('#');
    const base = path.startsWith('/') ? root : dirname(file);
    let target = path ? resolve(base, '.' + (path.startsWith('/') ? path : '/' + path)) : file;
    assert.ok(target === root || target.startsWith(root + '/'), `Outside site: ${href}`);
    if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
    const text = await readFile(target, 'utf8');
    if (fragment) assert.ok(text.includes(`id="${fragment}"`), `Missing anchor: ${href}`);
  }
}
const home = await readFile(resolve(root, 'index.html'));
const stylesheets = [...home.toString().matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(([, href]) => href);
const css = Buffer.concat(await Promise.all(stylesheets.map(href => readFile(resolve(root, '.' + href)))));
const gallery = await readFile(resolve(root, 'gallery.js'));
assert.ok(gallery.length < 5000, 'Gallery JavaScript exceeds 5 kB budget');
// Includes seven linked iPhone screenshots and the fullscreen viewer styling.
assert.ok(home.length + css.length < 20000, 'Homepage + CSS exceeds 20 kB budget');
// Includes three full homepage layout studies and the gallery enhancement.
assert.ok(total < 110000, 'Site exceeds 110 kB budget');
assert.ok(imageTotal <= 3 * 1024 * 1024, 'Screenshots exceed 3 MB budget');
console.log(`Checked ${pages.length} HTML pages and all local links.`);
console.log(`Site without screenshots: ${total} bytes. Screenshots: ${imageTotal} bytes. Homepage + CSS: ${home.length + css.length} bytes (${gzipSync(home).length + gzipSync(css).length} bytes gzipped). Gallery JavaScript: ${gallery.length} bytes (${gzipSync(gallery).length} bytes gzipped).`);
