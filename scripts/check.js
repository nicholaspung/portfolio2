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
let caseStudyTotal = 0;
const editableCases = new Set(['productivity', 'yummy-recs', 'data-desktop'].map(slug => resolve(root, 'blog', slug, 'index.html')));
const imageTypes = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
for (const file of files) {
  const size = (await stat(file)).size;
  if (imageTypes.has(extname(file))) {
    assert.ok(size <= 512000, `${file}: screenshot exceeds 500 kB budget`);
    imageTotal += size;
  } else if (editableCases.has(file)) {
    assert.ok(size < 70000, `${file}: case study exceeds 70 kB budget`);
    caseStudyTotal += size;
  } else total += size;
}
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${file}: expected one h1`);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<main id="main">/);
  assert.match(html, /<script src="\/theme.js"><\/script>[\s\S]*?<link rel="stylesheet" href="\/style.css">/, `${file}: apply saved appearance before styles load`);
  assert.doesNotMatch(html, /@import/i);
  for (const [tag] of html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)) {
    if (tag === '<script src="/theme.js"></script>') continue;
    if (tag === '<script src="/data-desktop.js" defer></script>') {
      assert.equal(file, resolve(root, 'blog/data-desktop/index.html'), 'App showcase belongs on the Data Desktop case study');
      continue;
    }
    if (tag === '<script src="/section-nav.js" defer></script>') {
      assert.match(html, /<nav class="section-nav"/, `${file}: section navigation script needs navigation markup`);
      assert.ok([resolve(root, 'index.html'), resolve(root, 'about/index.html')].includes(file) || (file.startsWith(resolve(root, 'blog') + '/') && file !== resolve(root, 'blog/index.html')), 'Section navigation belongs on Portfolio, About, and blog articles');
      continue;
    }
    assert.ok(file === resolve(root, 'index.html') || (file.startsWith(resolve(root, 'blog') + '/') && file !== resolve(root, 'blog/index.html')), 'Screenshot viewing belongs on the homepage and blog articles');
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
const theme = await readFile(resolve(root, 'theme.js'));
assert.ok(theme.length < 4000, 'Theme JavaScript exceeds 4 kB budget');
// Includes featured galleries, viewer styling, appearance controls, and section navigation.
assert.ok(home.length + css.length < 34000, 'Homepage + CSS exceeds 34 kB budget');
// Keep the fixed site small while allowing each editable case study room for a full article.
assert.ok(total < 126000, 'Fixed site assets exceed 126 kB budget');
assert.ok(imageTotal <= 3 * 1024 * 1024, 'Screenshots exceed 3 MB budget');
console.log(`Checked ${pages.length} HTML pages and all local links.`);
console.log(`Fixed site assets: ${total} bytes. Editable case studies: ${caseStudyTotal} bytes. Screenshots: ${imageTotal} bytes. Homepage + CSS: ${home.length + css.length} bytes (${gzipSync(home).length + gzipSync(css).length} bytes gzipped). Gallery JavaScript: ${gallery.length} bytes (${gzipSync(gallery).length} bytes gzipped).`);
