import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createServer } from './server.mjs';

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
