import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './server.mjs';

const PUBLIC_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

function makeTempDataDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'personal-tracker-test-'));
  const companiesPath = path.join(dir, 'companies.json');
  const personalPath = path.join(dir, 'my-tracker.local.json');
  fs.writeFileSync(companiesPath, JSON.stringify([
    { id: 'acme', company: 'Acme', role: 'Software Engineer Apprentice', location: 'London' },
  ]));
  return { companiesPath, personalPath };
}

async function withServer(fn) {
  const { companiesPath, personalPath } = makeTempDataDir();
  const server = createServer({ companiesPath, personalPath });
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  try {
    await fn(`http://localhost:${port}`, personalPath);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('GET /api/companies returns id, company, role only', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/companies`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.deepEqual(body, [{ id: 'acme', company: 'Acme', role: 'Software Engineer Apprentice' }]);
  });
});

test('GET /api/personal returns an empty object when no file exists yet', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/personal`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.deepEqual(body, {});
  });
});

test('POST /api/personal writes an entry, and it is readable afterwards', async () => {
  await withServer(async (base, personalPath) => {
    const entry = {
      currentStage: 'Applied',
      nextStage: 'Online assessment',
      nextStageDone: false,
      registeredForUpdates: true,
      notes: 'Applied via careers site',
    };
    const postRes = await fetch(`${base}/api/personal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'acme', entry }),
    });
    assert.equal(postRes.status, 200);

    const getRes = await fetch(`${base}/api/personal`);
    const body = await getRes.json();
    assert.deepEqual(body, { acme: entry });

    const onDisk = JSON.parse(fs.readFileSync(personalPath, 'utf-8'));
    assert.deepEqual(onDisk, { acme: entry });
  });
});

test('POST /api/personal with malformed JSON body responds 400 and leaves the server alive', async () => {
  await withServer(async (base) => {
    const postRes = await fetch(`${base}/api/personal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json {{{',
    });
    assert.equal(postRes.status, 400);

    // The server must still be alive and answering requests after a malformed body.
    const getRes = await fetch(`${base}/api/personal`);
    assert.equal(getRes.status, 200);
    const body = await getRes.json();
    assert.deepEqual(body, {});
  });
});

test('POST /api/personal with missing id/entry responds 400 and writes nothing', async () => {
  await withServer(async (base, personalPath) => {
    const postRes = await fetch(`${base}/api/personal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.equal(postRes.status, 400);
    assert.equal(fs.existsSync(personalPath), false);
  });
});

test('GET /api/personal against a corrupt personal file responds 500 and leaves the file untouched', async () => {
  await withServer(async (base, personalPath) => {
    const corrupt = '{ broken';
    fs.writeFileSync(personalPath, corrupt);

    const res = await fetch(`${base}/api/personal`);
    assert.equal(res.status, 500);

    const onDisk = fs.readFileSync(personalPath, 'utf-8');
    assert.equal(onDisk, corrupt);
  });
});

test('POST /api/personal with a null body responds 400 and leaves the server alive', async () => {
  await withServer(async (base) => {
    const postRes = await fetch(`${base}/api/personal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'null',
    });
    assert.equal(postRes.status, 400);

    // The server must still be alive and answering requests after a null body.
    const getRes = await fetch(`${base}/api/personal`);
    assert.equal(getRes.status, 200);
    const body = await getRes.json();
    assert.deepEqual(body, {});
  });
});

test('POST /api/personal with a JSON array body responds 400 and leaves the server alive', async () => {
  await withServer(async (base) => {
    const postRes = await fetch(`${base}/api/personal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '[1,2,3]',
    });
    assert.equal(postRes.status, 400);

    const getRes = await fetch(`${base}/api/personal`);
    assert.equal(getRes.status, 200);
    const body = await getRes.json();
    assert.deepEqual(body, {});
  });
});

test('POST /api/personal against a corrupt personal file responds 500, survives, and leaves the file untouched', async () => {
  await withServer(async (base, personalPath) => {
    const corrupt = '{ broken';
    fs.writeFileSync(personalPath, corrupt);

    const postRes = await fetch(`${base}/api/personal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'acme', entry: { currentStage: 'Applied' } }),
    });
    assert.equal(postRes.status, 500);

    const onDisk = fs.readFileSync(personalPath, 'utf-8');
    assert.equal(onDisk, corrupt);

    // The server must still be alive after this failure too.
    const getRes = await fetch(`${base}/api/companies`);
    assert.equal(getRes.status, 200);
  });
});

test('GET a path resolving to a directory inside public/ responds without crashing, and the server survives', async () => {
  await withServer(async (base) => {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    const dirPath = path.join(PUBLIC_DIR, 'test-dir-tmp');
    fs.mkdirSync(dirPath, { recursive: true });
    try {
      const res = await fetch(`${base}/test-dir-tmp`);
      assert.equal(res.status, 404);

      // A follow-up request proves the server process is still alive.
      const followUp = await fetch(`${base}/api/companies`);
      assert.equal(followUp.status, 200);
    } finally {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  });
});

test('GET a nonexistent static file responds 404 and the server survives', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/does-not-exist-at-all.html`);
    assert.equal(res.status, 404);

    const followUp = await fetch(`${base}/api/companies`);
    assert.equal(followUp.status, 200);
  });
});
