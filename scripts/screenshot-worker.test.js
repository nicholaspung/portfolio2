import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const code = await readFile(new URL('./screenshot-worker.js', import.meta.url), 'utf8');
const origin = 'https://portfolio.example';
const url = number => `${origin}/assets/screenshots/${number.toString(16).padStart(20, '0')}.webp`;

function worker({ blocked = false, status = 200, type = 'image/webp' } = {}) {
  const handlers = {}, entries = new Map();
  let calls = 0, claims = 0;
  const names = new Set(['portfolio-screenshots-v0', 'other-app']);
  const cache = {
    match: async request => entries.get(typeof request === 'string' ? request : request.url)?.clone(),
    put: async (request, response) => { entries.set(typeof request === 'string' ? request : request.url, response); },
    keys: async () => [...entries.keys()].map(key => new Request(key)),
    delete: async request => entries.delete(typeof request === 'string' ? request : request.url)
  };
  runInNewContext(code, {
    self: { location: { origin }, addEventListener: (name, handler) => handlers[name] = handler, skipWaiting: async () => {}, clients: { claim: async () => claims++ } },
    caches: { open: async name => { if (blocked) throw new Error('Storage disabled'); names.add(name); return cache; }, keys: async () => [...names], delete: async name => names.delete(name) },
    fetch: async () => { calls++; return new Response('screenshot', { status, headers: { 'content-type': type } }); },
    URL
  });
  return {
    entries, names, calls: () => calls, claims: () => claims,
    async activate() { let done; handlers.activate({ waitUntil: task => done = task }); await done; },
    async request(target, method = 'GET') {
      let response;
      handlers.fetch({ request: new Request(target, { method }), respondWith: task => response = task });
      return response;
    },
    async message(urls) { let done; handlers.message({ data: { type: 'SAVE_SCREENSHOTS', urls }, waitUntil: task => done = task }); await done; }
  };
}

test('viewed screenshots persist, cache hits avoid network, and changed URLs fetch new pixels', async () => {
  const instance = worker();
  const [first, concurrent] = await Promise.all([instance.request(url(1)), instance.request(url(1))]);
  assert.equal(await first.text(), 'screenshot');
  assert.equal(await concurrent.text(), 'screenshot');
  assert.equal(instance.calls(), 1, 'Coalesce simultaneous viewer/preload requests');
  assert.equal(await (await instance.request(url(1))).text(), 'screenshot');
  assert.equal(instance.calls(), 1, 'Repeat view must not fetch from network');
  await instance.request(url(2));
  assert.equal(instance.calls(), 2, 'A new content hash must bypass the old entry');
});

test('cache excludes HTML, editor APIs, errors, external URLs, and unversioned images', async () => {
  const instance = worker();
  for (const target of [origin + '/', origin + '/style.css', origin + '/image-editor/api', origin + '/images/test.png', url(1) + '?v=1', url(1).replace(origin, 'https://external.example')]) {
    assert.equal(await instance.request(target), undefined);
  }
  assert.equal(await instance.request(url(1), 'POST'), undefined);
  assert.equal(instance.calls(), 0);
  for (const options of [{ status: 404 }, { type: 'text/html' }, { blocked: true }]) {
    const unavailable = worker(options);
    const result = await unavailable.request(url(1));
    assert.equal(result.status, options.status || 200);
    assert.equal(unavailable.entries.size, 0);
  }
});

test('first-visit warmup is limited to viewed screenshots; cache remains bounded under concurrent loads', async () => {
  const instance = worker();
  await instance.activate();
  assert.equal(instance.names.has('portfolio-screenshots-v0'), false);
  assert.equal(instance.names.has('other-app'), true);
  assert.equal(instance.claims(), 1);
  await instance.message([url(1), url(1), origin + '/', 'not a URL', null]);
  assert.equal(instance.calls(), 1);
  await Promise.all(Array.from({ length: 130 }, (_, i) => instance.request(url(i + 2))));
  assert.equal(instance.entries.size, 120);
  assert.equal(instance.entries.has(url(1)), false);
});
