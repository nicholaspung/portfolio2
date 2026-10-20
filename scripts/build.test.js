import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { buildSite } from './build.js';

test('build preserves native screenshot detail in previews and viewer without changing authoring files', async t => {
  const temp = await mkdtemp(join(tmpdir(), 'portfolio-build-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const source = join(temp, 'site'), output = join(temp, 'public');
  await mkdir(join(source, 'images'), { recursive: true });
  const pixels = await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800"><defs><pattern id="detail" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#678975"/><path d="M0 0h7M0 3h5M0 6h3" stroke="#123456" stroke-width="1"/></pattern></defs><rect width="1280" height="800" fill="url(#detail)"/></svg>')).png().toBuffer();
  const imageFile = join(source, 'images/saved.png');
  await writeFile(imageFile, pixels);
  const html = '<html><head></head><body><a href="/images/saved.png"><img src="/images/saved.png" alt="Saved screenshot" width="1280" height="800" loading="lazy"></a></body></html>';
  await writeFile(join(source, 'index.html'), html);
  const build = () => buildSite({ source: source + '/', output: output + '/' });
  const report = await build();
  assert.equal(report.images, 1);
  const page = await readFile(join(output, 'index.html'), 'utf8');
  assert.doesNotMatch(page, /\b(?:srcset|sizes)=/, 'Do not offer downsampled screenshot variants');
  assert.match(page, /decoding="async"/);
  assert.match(page, /<script src="\/cache.js" defer>/);
  assert.doesNotMatch(page, /(?:src|href)="\/images\//);
  const href = page.match(/href="([^"]+)"/)[1];
  assert.ok(page.includes(`data-full="${href}"`), 'Images inserted without links need their full-size viewer target too');
  const full = await readFile(join(output, href));
  const fullPixels = await sharp(full).ensureAlpha().raw().toBuffer();
  const sourcePixels = await sharp(pixels).ensureAlpha().raw().toBuffer();
  assert.ok(fullPixels.equals(sourcePixels), 'Full-size image must preserve screenshot pixels');
  const src = page.match(/<img src="([^"]+)"/)[1];
  assert.equal(src, href, 'Preview must load the full-resolution screenshot');
  const metadata = await sharp(join(output, src)).metadata();
  assert.equal(metadata.width, 1280);
  assert.equal(metadata.height, 800);
  assert.match(src, /^\/assets\/screenshots\/[a-f0-9]{20}\.(webp|png)$/);
  assert.equal(await readFile(join(source, 'index.html'), 'utf8'), html);
  assert.deepEqual(await readFile(imageFile), pixels);
  assert.match(await readFile(join(output, '_headers'), 'utf8'), /immutable/);
  assert.match(await readFile(join(output, 'sw.js'), 'utf8'), /portfolio-screenshots-v1/);
  const firstAssets = await readdir(join(output, 'assets/screenshots'));
  await build();
  assert.equal(await readFile(join(output, 'index.html'), 'utf8'), page, 'Identical builds must preserve cache keys');

  // A blur save replaces the bytes at the original source path. All generated
  // URLs must change, with no manual cache version bump or editor changes.
  await writeFile(imageFile, await sharp(pixels).negate().png().toBuffer());
  await build();
  const changed = await readFile(join(output, 'index.html'), 'utf8');
  assert.notEqual(changed.match(/href="([^"]+)"/)[1], href);
  const nextAssets = await readdir(join(output, 'assets/screenshots'));
  assert.ok(nextAssets.every(file => !firstAssets.includes(file)), 'Changed screenshots must bypass every previous cached variant');
});

test('small images keep native dimensions and pages without images still build', async t => {
  const temp = await mkdtemp(join(tmpdir(), 'portfolio-small-build-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const source = join(temp, 'site'), output = join(temp, 'public');
  await mkdir(join(source, 'images'), { recursive: true });
  await writeFile(join(source, 'images/tiny.png'), await sharp({ create: { width: 16, height: 8, channels: 3, background: 'red' } }).png().toBuffer());
  await writeFile(join(source, 'index.html'), '<head></head><img src="/images/tiny.png" alt="Tiny image" width="16" height="8">');
  await writeFile(join(source, 'about.html'), '<head></head><p>No images.</p>');
  await buildSite({ source, output });
  const html = await readFile(join(output, 'index.html'), 'utf8');
  const src = html.match(/<img src="([^"]+)"/)[1];
  const metadata = await sharp(join(output, src)).metadata();
  assert.equal(metadata.width, 16);
  assert.equal(metadata.height, 8);
  assert.match(await readFile(join(output, 'about.html'), 'utf8'), /No images/);
});
