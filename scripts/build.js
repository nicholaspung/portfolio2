import { cp, mkdir, rm, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const hash = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 20);
const imageTypes = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(resolve(dir, entry.name)) : resolve(dir, entry.name)))).flat().sort();
}

export async function buildSite({ source = fileURLToPath(new URL('../site/', import.meta.url)), output = fileURLToPath(new URL('../public/', import.meta.url)) } = {}) {
  source = resolve(source);
  output = resolve(output);
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(source, output, { recursive: true });
  const assets = resolve(output, 'assets/screenshots');
  await mkdir(assets, { recursive: true });
  const files = await walk(source);
  const pages = files.filter(file => file.endsWith('.html'));
  const html = await Promise.all(pages.map(file => readFile(file, 'utf8')));
  const images = new Map();
  let originalBytes = 0, fullBytes = 0;

  async function emit(bytes, extension) {
    const url = `/assets/screenshots/${hash(bytes)}${extension}`;
    await writeFile(resolve(output, '.' + url), bytes);
    return url;
  }

  // Process each referenced source once. The author's screenshots and private blur
  // originals remain untouched; every build reads the latest saved pixels.
  for (const file of files.filter(file => imageTypes.has(extname(file).toLowerCase()))) {
    const url = '/' + file.slice(source.length + 1).split('\\').join('/');
    if (!html.some(page => page.includes(`src="${url}"`))) continue;
    const original = await readFile(file);
    const pipeline = sharp(original).autoOrient();
    const lossless = await pipeline.clone().webp({ lossless: true, effort: 6 }).toBuffer();
    const full = lossless.length < original.length ? lossless : original;
    const fullUrl = await emit(full, full === lossless ? '.webp' : extname(file));
    images.set(url, { fullUrl });
    originalBytes += original.length;
    fullBytes += full.length;
  }

  for (let i = 0; i < pages.length; i++) {
    let page = html[i].replace(/<img\b[^>]*>/g, tag => {
      const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
      const image = images.get(src);
      if (!image) return tag;
      // UI screenshots need their original detail, even in smaller cards. Serve
      // the same lossless, native-resolution image in previews and the viewer.
      return tag.replace(/\s(?:srcset|sizes|decoding|data-full)="[^"]*"/g, '')
        .replace(`src="${src}"`, `src="${image.fullUrl}" decoding="async" data-full="${image.fullUrl}"`);
    });
    page = page.replace(/(<a\b[^>]*\bhref=")([^"]+)(")/g, (match, start, url, end) => images.has(url) ? start + images.get(url).fullUrl + end : match);
    page = page.replace('</head>', '<script src="/cache.js" defer></script>\n</head>');
    await writeFile(resolve(output, pages[i].slice(source.length + 1)), page);
  }
  await cp(new URL('./screenshot-cache.js', import.meta.url), resolve(output, 'cache.js'));
  await cp(new URL('./screenshot-worker.js', import.meta.url), resolve(output, 'sw.js'));
  // Hosts that support _headers can also keep immutable images in their HTTP
  // cache. The service worker supplies persistence on GitHub Pages as well.
  await writeFile(resolve(output, '_headers'), '/assets/screenshots/*\n  Cache-Control: public, max-age=31536000, immutable\n/sw.js\n  Cache-Control: no-cache\n/cache.js\n  Cache-Control: no-cache\n');
  return { images: images.size, originalBytes, fullBytes };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await buildSite();
  console.log(`Built public/: ${report.images} full-resolution screenshots; lossless optimization ${report.originalBytes} → ${report.fullBytes} bytes. Ready for static hosting.`);
}
