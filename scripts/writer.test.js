import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, request as httpRequest } from 'node:http';
import { mkdtemp, cp, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createWriter } from './writer-server.js';

test('local writer round-trips HTML, updates only the selected listing, and protects files', async t => {
  const temp = await mkdtemp(join(tmpdir(), 'portfolio-writer-'));
  const root = join(temp, 'site');
  const backupRoot = join(temp, 'backups');
  await cp(new URL('../site/', import.meta.url), root, { recursive: true });
  const writer = createWriter({ root, backupRoot });
  const server = createServer(async (req, res) => {
    if (!await writer(req, res, new URL(req.url, 'http://localhost'))) res.writeHead(404).end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await rm(temp, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = async path => (await fetch(base + path)).json();
  const config = await get('/write/api');
  const headers = { 'Content-Type': 'application/json', 'X-Writer-Token': config.token, Origin: base };
  const put = (slug, data, overrides = {}) => fetch(`${base}/write/api/${slug}`, { method: 'PUT', headers: { ...headers, ...overrides }, body: JSON.stringify(data) });
  const original = await get('/write/api/yummy-recs');
  const articleBefore = await readFile(join(root, 'blog/yummy-recs/index.html'), 'utf8');
  const blogBefore = await readFile(join(root, 'blog/index.html'), 'utf8');
  const otherPage = await readFile(join(root, 'blog/productivity/index.html'), 'utf8');
  const image = config.images[0];
  const draft = { ...original, title: 'Yummy & Recs: "a case study"', summary: 'A summary with <angles>, & symbols, and $& replacement tokens.', comingSoon: false, body: `<h2>The problem</h2><p>A <strong>useful</strong> <em>app</em> &amp; its lessons.</p><ul><li>A decision</li></ul><p><a href="https://example.com/?a=1&amp;b=2">Source</a></p><figure><img src="${image}" alt="A ratings screen" width="923" height="2000" loading="lazy"><figcaption>A caption</figcaption></figure>` };
  await t.test('requires loopback Host, same-origin JSON, token, and a fixed project slug', async () => {
    assert.equal((await put('yummy-recs', draft, { Origin: 'https://other.example' })).status, 403);
    assert.equal((await put('yummy-recs', draft, { 'X-Writer-Token': 'wrong' })).status, 403);
    const foreignHost = await new Promise((resolve, reject) => {
      const req = httpRequest(base + '/write/api/yummy-recs', { method: 'PUT', headers: { ...headers, Host: 'other.example:8000' } }, response => { response.resume(); resolve(response.statusCode); });
      req.on('error', reject); req.end(JSON.stringify(draft));
    });
    assert.equal(foreignHost, 403);
    assert.equal((await put('unknown', draft)).status, 404);
    assert.equal((await put('yummy-recs', draft, { 'Content-Type': 'text/plain' })).status, 403);
    assert.equal(await readFile(join(root, 'blog/yummy-recs/index.html'), 'utf8'), articleBefore);
  });
  await t.test('rejects active markup, malformed markup, missing images, and invalid fields', async () => {
    for (const body of ['<script>alert(1)</script>', '<p onclick="alert(1)">Text</p>', '<a href="javascript:alert(1)">Link</a>', '<p><strong>Bad</p>', '<iframe></iframe>', '<img src="/images/missing.webp" alt="Missing" width="1" height="1" loading="lazy">']) {
      assert.equal((await put('yummy-recs', { ...draft, body })).status, 400, body);
    }
    assert.equal((await put('yummy-recs', { ...draft, title: '' })).status, 400);
    assert.equal((await put('yummy-recs', { ...draft, body: 'x'.repeat(60001) })).status, 400);
    assert.equal(await readFile(join(root, 'blog/index.html'), 'utf8'), blogBefore);
  });
  let saved;
  await t.test('saves semantic HTML, metadata and Blog listing, with a recoverable backup', async () => {
    const response = await put('yummy-recs', draft);
    assert.equal(response.status, 200, await response.clone().text());
    saved = await response.json();
    assert.equal(saved.title, draft.title);
    assert.equal(saved.summary, draft.summary);
    assert.equal(saved.body, draft.body);
    assert.equal(saved.comingSoon, false);
    const html = await readFile(join(root, 'blog/yummy-recs/index.html'), 'utf8');
    const blog = await readFile(join(root, 'blog/index.html'), 'utf8');
    assert.match(html, /<h1>Yummy &amp; Recs: &quot;a case study&quot;<\/h1>/);
    assert.ok(html.includes('<meta name="description" content="A summary with &lt;angles&gt;, &amp; symbols, and $&amp; replacement tokens.">'));
    assert.ok(html.includes('href="https://github.com/nicholaspung/food-tracker-app"'));
    assert.ok(html.includes('href="/#portfolio"'));
    assert.equal(blog.split('Case study coming soon').length - 1, blogBefore.split('Case study coming soon').length - 1 - Number(original.comingSoon));
    assert.ok(blog.includes(draft.summary.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')));
    assert.equal(await readFile(join(root, 'blog/productivity/index.html'), 'utf8'), otherPage);
    const backups = await readdir(backupRoot);
    assert.equal(backups.length, 1);
    const backup = JSON.parse(await readFile(join(backupRoot, backups[0]), 'utf8'));
    assert.equal(backup.article, articleBefore);
    assert.equal(backup.blog, blogBefore);
  });
  await t.test('rejects stale saves and detects external file edits', async () => {
    assert.equal((await put('yummy-recs', original)).status, 409);
    const file = join(root, 'blog/yummy-recs/index.html');
    await writeFile(file, (await readFile(file, 'utf8')) + '\n<!-- external edit -->\n');
    assert.equal((await put('yummy-recs', saved)).status, 409);
    assert.ok((await readFile(file, 'utf8')).includes('external edit'));
  });
  await t.test('serializes concurrent saves without losing a different project’s listing', async () => {
    const productivity = await get('/write/api/productivity');
    const desktop = await get('/write/api/data-desktop');
    const responses = await Promise.all([
      put('productivity', { ...productivity, summary: 'Updated Productivity summary.' }),
      put('data-desktop', { ...desktop, summary: 'Updated Data Desktop summary.' }),
    ]);
    assert.deepEqual(responses.map(response => response.status), [200, 200]);
    const blog = await readFile(join(root, 'blog/index.html'), 'utf8');
    assert.ok(blog.includes('Updated Productivity summary.'));
    assert.ok(blog.includes('Updated Data Desktop summary.'));
    const latest = await get('/write/api/productivity');
    const sameProject = await Promise.all([put('productivity', { ...latest, summary: 'First save.' }), put('productivity', { ...latest, summary: 'Second save.' })]);
    assert.deepEqual(sameProject.map(response => response.status).sort(), [200, 409]);
  });
});
