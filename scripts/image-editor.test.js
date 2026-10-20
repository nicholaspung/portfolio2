import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, request as httpRequest } from 'node:http';
import { mkdtemp, cp, readFile, writeFile, readdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createImageEditor } from './image-editor-server.js';

// Actual 1×1 PNGs: request tests use tiny images without depending on a native image library.
const original = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2jGAAAAAASUVORK5CYII=', 'base64');
const edited = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==', 'base64');

test('image editor preserves originals, recipes, backups, and website paths with protected local writes', async t => {
  const temp = await mkdtemp(join(tmpdir(), 'portfolio-images-'));
  const root = join(temp, 'site'), localRoot = join(temp, '.local/images');
  await cp(new URL('../site/', import.meta.url), root, { recursive: true });
  const imagePath = '/images/editor-test.png', file = join(root, imagePath);
  await writeFile(file, original);
  const editor = createImageEditor({ root, localRoot });
  const server = createServer(async (req, res) => {
    if (!await editor(req, res, new URL(req.url, 'http://localhost'))) res.writeHead(404).end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(temp, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const api = base + '/image-editor/api';
  const config = await (await fetch(api)).json();
  const headers = { 'Content-Type': 'application/json', 'X-Image-Token': config.token, Origin: base };
  const get = async (path = imagePath) => (await fetch(api + '/image?path=' + encodeURIComponent(path))).json();
  const put = (data, overrides = {}) => fetch(api + '/image', { method: 'PUT', headers: { ...headers, ...overrides }, body: JSON.stringify(data) });
  const initial = await get();
  const draft = { ...initial, boxes: [{ x: 0, y: 0, width: 1, height: 1 }], strength: 24, image: 'data:image/png;base64,' + edited.toString('base64') };
  assert.ok(config.images.includes(imagePath));
  assert.equal((await fetch(base + '/image-editor/')).status, 200);
  assert.match(await (await fetch(base + '/image-editor/editor.js')).text(), /toBlob/);

  await t.test('rejects foreign Host, origin, token, paths, symlinks, malformed boxes, format and size', async () => {
    assert.equal((await put(draft, { Origin: 'https://other.example' })).status, 403);
    assert.equal((await put(draft, { 'X-Image-Token': 'wrong' })).status, 403);
    assert.equal((await put(draft, { 'Content-Type': 'text/plain' })).status, 403);
    const foreign = await new Promise((resolve, reject) => {
      const req = httpRequest(api, { headers: { Host: 'other.example:8000' } }, res => { res.resume(); resolve(res.statusCode); });
      req.on('error', reject); req.end();
    });
    assert.equal(foreign, 403);
    assert.equal((await fetch(api + '/source?path=' + imagePath)).status, 403);
    for (const path of ['/../README.md', '/images/../index.html', '/images/missing.png']) assert.equal((await put({ ...draft, path })).status, 404);
    await symlink(join(temp, 'outside.png'), join(root, 'images/link.png'));
    assert.equal((await put({ ...draft, path: '/images/link.png' })).status, 404);
    for (const boxes of [null, [{ x: -1, y: 0, width: 1, height: 1 }], [{ x: 0.5, y: 0, width: 1, height: 1 }], [{ x: 0, y: 0, width: 0, height: 1 }], Array(101).fill(draft.boxes[0])]) assert.equal((await put({ ...draft, boxes })).status, 400);
    assert.equal((await put({ ...draft, strength: 0 })).status, 400);
    assert.equal((await put({ ...draft, image: 'data:image/webp;base64,' + edited.toString('base64') })).status, 400);
    assert.equal((await put({ ...draft, image: 'data:image/png;base64,YmFk' })).status, 400);
    const tooLarge = Buffer.concat([edited, Buffer.alloc(512001)]);
    assert.equal((await put({ ...draft, image: 'data:image/png;base64,' + tooLarge.toString('base64') })).status, 400);
    assert.equal((await put({ ...draft, image: 'x'.repeat(800001) })).status, 413);
    assert.deepEqual(await readFile(file), original);
  });
  let saved;
  await t.test('saves pixels at the same path with a private original and persistent editable boxes', async () => {
    const response = await put(draft);
    assert.equal(response.status, 200, await response.clone().text());
    saved = await response.json();
    assert.deepEqual(await readFile(file), edited);
    assert.deepEqual((await get()).boxes, draft.boxes);
    const source = await fetch(api + '/source?path=' + imagePath, { headers: { 'X-Image-Token': config.token } });
    assert.deepEqual(Buffer.from(await source.arrayBuffer()), original);
    const backups = await readdir(join(localRoot, 'backups'));
    assert.equal(backups.length, 1);
    assert.deepEqual(await readFile(join(localRoot, 'backups', backups[0], 'image.png')), original);
    const persisted = JSON.parse(await readFile(join(localRoot, 'states', (await readdir(join(localRoot, 'states')))[0]), 'utf8'));
    assert.equal(persisted.original, original.toString('base64'));
  });
  await t.test('stale and concurrent saves cannot overwrite a newer edit', async () => {
    assert.equal((await put(draft)).status, 409);
    const responses = await Promise.all([put({ ...draft, revision: saved.revision, boxes: [] }), put({ ...draft, revision: saved.revision, boxes: [] })]);
    assert.deepEqual(responses.map(response => response.status).sort(), [200, 409]);
    assert.deepEqual(await readFile(file), original);
    assert.deepEqual((await get()).boxes, []);
  });
  await t.test('externally changed files block old saves and become a new editing source', async () => {
    const before = await get();
    await writeFile(file, edited);
    assert.equal((await put({ ...draft, revision: before.revision })).status, 409);
    assert.deepEqual((await get()).boxes, []);
    const source = await fetch(api + '/source?path=' + imagePath, { headers: { 'X-Image-Token': config.token } });
    assert.deepEqual(Buffer.from(await source.arrayBuffer()), edited);
  });
});
