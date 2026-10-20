// Image URLs contain a hash of the actual output bytes. Changed/blurred pixels
// always get a new URL, while unchanged screenshots survive later deployments.
const CACHE = 'portfolio-screenshots-v1';
const LIMIT = 120;
const pending = new Map();
let writes = Promise.resolve();

const isScreenshot = url => url.origin === self.location.origin && /^\/assets\/screenshots\/[a-f0-9]{20}\.(webp|png|jpg|jpeg|avif)$/.test(url.pathname) && !url.search;

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const names = await caches.keys();
  await Promise.all(names.filter(name => name.startsWith('portfolio-screenshots-') && name !== CACHE).map(name => caches.delete(name)));
  await self.clients.claim();
})()));

function save(cache, request, response) {
  // Serialize writes so simultaneous lazy images still respect the entry limit.
  writes = writes.catch(() => {}).then(async () => {
    await cache.put(request, response);
    const keys = await cache.keys();
    await Promise.all(keys.slice(0, Math.max(0, keys.length - LIMIT)).map(key => cache.delete(key)));
  });
  return writes;
}

async function screenshot(request) {
  let cache;
  try {
    cache = await caches.open(CACHE);
    const hit = await cache.match(request);
    if (hit) return hit;
  } catch { /* Storage may be unavailable; normal network loading still works. */ }
  const key = typeof request === 'string' ? request : request.url;
  if (!pending.has(key)) {
    pending.set(key, (async () => {
      const response = await fetch(request);
      if (cache && response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        await save(cache, request, response.clone()).catch(() => {});
      }
      return response;
    })().finally(() => pending.delete(key)));
  }
  return (await pending.get(key)).clone();
}

self.addEventListener('fetch', event => {
  // HTML, styles, scripts, local editor APIs, and external links always use the
  // browser's normal loading behavior. No cached pages can hide content updates.
  if (event.request.method === 'GET' && isScreenshot(new URL(event.request.url))) event.respondWith(screenshot(event.request));
});

self.addEventListener('message', event => {
  if (event.data?.type !== 'SAVE_SCREENSHOTS' || !Array.isArray(event.data.urls)) return;
  const urls = [...new Set(event.data.urls)].filter(value => {
    try { return typeof value === 'string' && isScreenshot(new URL(value)); } catch { return false; }
  }).slice(0, LIMIT);
  event.waitUntil(Promise.allSettled(urls.map(url => screenshot(url))));
});
