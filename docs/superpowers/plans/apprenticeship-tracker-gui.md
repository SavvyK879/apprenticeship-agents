# Apprenticeship Tracker GUI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Airtable-backed tracker with a self-hosted GUI, split into a public read-only directory (deployable, safe to open-source) and a private local tool for the user's own application progress.

**Architecture:** Two independent apps sharing one data folder. `/site` is a static Next.js app that reads `/data/companies.json` at build time and deploys with no server or write path. `/personal-tracker` is a small standalone Node HTTP server + vanilla-JS page, run only on the user's machine, that reads and writes `/data/my-tracker.local.json`. Neither app depends on the other; they never share code.

**Tech Stack:** Next.js (TypeScript, App Router, static export) for `/site`; plain Node.js (`node:http`, no framework) for `/personal-tracker`; Vitest for `/site` unit tests; Node's built-in test runner (`node:test`) for `/personal-tracker` tests.

**Spec:** [docs/superpowers/specs/apprenticeship-tracker-gui-design.md](../specs/apprenticeship-tracker-gui-design.md)

## Global Constraints

- No accounts or auth anywhere in the system.
- The public site (`/site`) is read-only. It must never ship stage/notes data or any write endpoint.
- `/cv/master-cv.md`, `output/*/*-cv.md`, and `output/*/*-cv.docx` are never committed to git.
- `/data/companies.json` is the single public source of truth. Agents edit it directly via file edits — no GUI edits it.
- `/data/my-tracker.local.json` is private, gitignored, and only ever read/written by `/personal-tracker`.
- `hasFactFile` is computed at build/read time by checking the filesystem — never hand-maintained in `companies.json`.

---

## Task 1: Gitignore and folder-structure documentation

**Files:**
- Modify: `.gitignore`
- Modify: `CLAUDE.md`

**Interfaces:**
- Produces: the `.gitignore` rules and `CLAUDE.md` entries every later task assumes are already in place.

- [ ] **Step 1: Add CV and personal-data ignore rules**

Append to `.gitignore`:

```
# Personal CV content (never public)
/cv/master-cv.md
output/*/*-cv.md
output/*/*-cv.docx
```

(`/data/my-tracker.local.json` is already covered by the existing `*.local` pattern — verify this by confirming `*.local` is present in `.gitignore` before moving on.)

- [ ] **Step 2: Document the new top-level folders in CLAUDE.md**

In `CLAUDE.md`, under `# Folder Structure`, add two new entries following the existing style (each folder gets a heading and 1-3 lines):

```
/data
Holds the tracker data. companies.json is the public source of truth (git-tracked) —
agents write to it directly. my-tracker.local.json is the user's private stage/notes
file (gitignored), used only by /personal-tracker.

/site
The public-facing Next.js site. Reads /data/companies.json and /output/{company}/{company}-fact-file.md
at build time. Read-only — no write path, no personal data.

/personal-tracker
A standalone local tool (not deployed) for editing /data/my-tracker.local.json. Run with
`npm start` inside this folder.
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore CLAUDE.md
git commit -m "docs: document /data, /site, /personal-tracker and ignore personal CV files"
```

---

## Task 2: Migrate existing Airtable data into companies.json

**Files:**
- Create: `data/companies.json`

**Interfaces:**
- Consumes: the live Airtable base (id redacted, table id redacted) via the Airtable MCP tools.
- Produces: `data/companies.json` — an array of objects matching the `Company` shape defined in Task 4, minus `hasFactFile` (computed later, not stored).

This task requires an Airtable MCP connection. It's a one-time data migration, not reusable code, so there's no test cycle — verification is a row-count and spot-check instead.

- [ ] **Step 1: Fetch all records**

Call the Airtable MCP tool to list all records in the base and table (ids redacted). Note the total record count returned — you'll check against it in Step 3.

- [ ] **Step 2: Transform each record**

For every Airtable record, map fields to this JSON shape:

```json
{
  "id": "acme",
  "company": "Acme",
  "role": "Software Engineer Degree Apprentice (Level 6)",
  "location": "London",
  "length": "4 years",
  "trainingProvider": "Acme University",
  "grades": "BBB",
  "salary": "£24,000",
  "openDate": "2026-09-01",
  "closeDate": "2026-11-30",
  "dateNotes": "",
  "link": "https://acme.example.com/apprenticeships"
}
```

Mapping:
- `id` — lowercase, hyphenated slug of the Company field, matching the existing `/output/{company}/` naming convention (e.g. "AtkinsRéalis" → `atkinsrealis`).
- `company` ← Company field, verbatim.
- `role` ← Role field, verbatim.
- `location`, `length`, `trainingProvider`, `grades`, `salary`, `dateNotes` ← the matching Airtable field, verbatim, or `""` if blank.
- `openDate`, `closeDate` ← the matching Airtable date field, already `YYYY-MM-DD` in Airtable's stored value; `""` if blank.
- `link` ← Link field, verbatim.
- Do **not** carry over Attachments, Registered for Updates, Current Stage, Next Stage, or Next Stage Done — those are either personal (handled in Task 9) or no longer needed (Attachments; see Task 11).

- [ ] **Step 3: Write and verify**

Write the full array to `data/companies.json`, pretty-printed (2-space indent).

Verify:
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('data/companies.json')).length)"
```
Confirm the printed count matches the Airtable record count from Step 1. Then open the file and spot-check 3 records against their Airtable rows for field accuracy.

- [ ] **Step 4: Commit**

```bash
git add data/companies.json
git commit -m "data: migrate existing Airtable tracker records to companies.json"
```

---

## Task 3: Scaffold the Next.js site

**Files:**
- Create: `site/` (via `create-next-app`)
- Modify: `site/next.config.mjs`
- Modify: `site/package.json`

**Interfaces:**
- Produces: a working Next.js app skeleton at `/site` that later tasks add to.

- [ ] **Step 1: Generate the app**

From the repo root:

```bash
npx create-next-app@latest site --typescript --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

If prompted, answer: Tailwind CSS → No, Turbopack → No (default is fine either way, but No keeps the build simpler for static export).

- [ ] **Step 2: Configure static export**

Replace the contents of `site/next.config.mjs` with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
};

export default nextConfig;
```

- [ ] **Step 3: Pin Next.js to a version with synchronous route params**

Next.js 15 made route `params` an async `Promise` instead of a plain object. This plan uses the Next 14 synchronous form throughout (see Task 7). Pin to Next 14 explicitly so `npx create-next-app@latest` picking up a newer major version later doesn't break Task 7:

```bash
cd site
npm install next@^14.2.0 react@^18.3.0 react-dom@^18.3.0
```

- [ ] **Step 4: Add dependencies used by later tasks**

```bash
npm install marked
npm install --save-dev vitest
cd ..
```

- [ ] **Step 5: Add a test script**

In `site/package.json`, add to `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 6: Verify the scaffold builds**

```bash
cd site
npm run build
cd ..
```

Expected: build succeeds and produces `site/out/`.

- [ ] **Step 7: Commit**

```bash
git add site
git commit -m "chore: scaffold Next.js site with static export"
```

---

## Task 4: Company data loader

**Files:**
- Create: `site/lib/types.ts`
- Create: `site/lib/companies.ts`
- Create: `site/lib/companies.test.ts`
- Create: `site/lib/__fixtures__/companies.json`
- Create: `site/lib/__fixtures__/output/acme/acme-fact-file.md`

**Interfaces:**
- Produces: `Company` type and `loadCompanies(dataPath?: string, outputDir?: string): Company[]` — used by Task 6's `app/page.tsx` and Task 7's `app/company/[id]/page.tsx`.

- [ ] **Step 1: Define the Company type**

`site/lib/types.ts`:

```ts
export interface Company {
  id: string;
  company: string;
  role: string;
  location: string;
  length: string;
  trainingProvider: string;
  grades: string;
  salary: string;
  openDate: string;
  closeDate: string;
  dateNotes: string;
  link: string;
  hasFactFile: boolean;
}
```

- [ ] **Step 2: Write fixtures**

`site/lib/__fixtures__/companies.json`:

```json
[
  {
    "id": "acme",
    "company": "Acme",
    "role": "Software Engineer Apprentice",
    "location": "London",
    "length": "4 years",
    "trainingProvider": "Acme University",
    "grades": "BBB",
    "salary": "£24,000",
    "openDate": "2026-09-01",
    "closeDate": "2026-11-30",
    "dateNotes": "",
    "link": "https://acme.example.com/apprenticeships"
  },
  {
    "id": "beta-corp",
    "company": "Beta Corp",
    "role": "AI Engineer Apprentice",
    "location": "Manchester",
    "length": "5 years",
    "trainingProvider": "",
    "grades": "",
    "salary": "",
    "openDate": "",
    "closeDate": "",
    "dateNotes": "Open: not yet published",
    "link": "https://betacorp.example.com"
  }
]
```

`site/lib/__fixtures__/output/acme/acme-fact-file.md`:

```markdown
# Acme Fact File

Acme is a fictional company used for testing.
```

(No fact file directory is created for `beta-corp` — that absence is what Step 4's test checks.)

- [ ] **Step 3: Write the failing test**

`site/lib/companies.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { loadCompanies } from './companies';

const FIXTURE_DATA = path.join(__dirname, '__fixtures__', 'companies.json');
const FIXTURE_OUTPUT = path.join(__dirname, '__fixtures__', 'output');

describe('loadCompanies', () => {
  it('loads every company from the data file', () => {
    const companies = loadCompanies(FIXTURE_DATA, FIXTURE_OUTPUT);
    expect(companies).toHaveLength(2);
  });

  it('marks hasFactFile true only when the fact file exists on disk', () => {
    const companies = loadCompanies(FIXTURE_DATA, FIXTURE_OUTPUT);
    const acme = companies.find((c) => c.id === 'acme');
    const beta = companies.find((c) => c.id === 'beta-corp');
    expect(acme?.hasFactFile).toBe(true);
    expect(beta?.hasFactFile).toBe(false);
  });
});
```

- [ ] **Step 4: Run the test and confirm it fails**

```bash
cd site && npx vitest run lib/companies.test.ts
```

Expected: FAIL — `./companies` has no exported member `loadCompanies` (module doesn't exist yet).

- [ ] **Step 5: Implement loadCompanies**

`site/lib/companies.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';
import type { Company } from './types';

const DEFAULT_DATA_PATH = path.join(process.cwd(), '..', 'data', 'companies.json');
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), '..', 'output');

type RawCompany = Omit<Company, 'hasFactFile'>;

export function loadCompanies(
  dataPath: string = DEFAULT_DATA_PATH,
  outputDir: string = DEFAULT_OUTPUT_DIR
): Company[] {
  const raw: RawCompany[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  return raw.map((c) => ({
    ...c,
    hasFactFile: fs.existsSync(path.join(outputDir, c.id, `${c.id}-fact-file.md`)),
  }));
}
```

- [ ] **Step 6: Run the test and confirm it passes**

```bash
cd site && npx vitest run lib/companies.test.ts
```

Expected: PASS, both tests.

- [ ] **Step 7: Commit**

```bash
git add site/lib
git commit -m "feat(site): add company data loader with fact-file detection"
```

---

## Task 5: Search and filter logic

**Files:**
- Create: `site/lib/filters.ts`
- Create: `site/lib/filters.test.ts`

**Interfaces:**
- Consumes: `Company` from `site/lib/types.ts` (Task 4).
- Produces: `FilterCriteria` type, `EMPTY_FILTERS` constant, `filterCompanies(companies: Company[], criteria: FilterCriteria): Company[]` — used by Task 6's `DirectoryBrowser` client component.

- [ ] **Step 1: Write the failing tests**

`site/lib/filters.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { filterCompanies, EMPTY_FILTERS } from './filters';
import type { Company } from './types';

const companies: Company[] = [
  {
    id: 'acme', company: 'Acme', role: 'Software Engineer Apprentice', location: 'London',
    length: '4 years', trainingProvider: '', grades: '', salary: '',
    openDate: '2026-09-01', closeDate: '2026-11-30', dateNotes: '', link: '', hasFactFile: false,
  },
  {
    id: 'beta-corp', company: 'Beta Corp', role: 'AI Engineer Apprentice', location: 'Manchester',
    length: '5 years', trainingProvider: '', grades: '', salary: '',
    openDate: '2026-01-01', closeDate: '2026-03-01', dateNotes: '', link: '', hasFactFile: false,
  },
];

describe('filterCompanies', () => {
  it('returns everything when criteria are empty', () => {
    expect(filterCompanies(companies, EMPTY_FILTERS)).toHaveLength(2);
  });

  it('matches query against company name, case-insensitive', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, query: 'acme' });
    expect(result.map((c) => c.id)).toEqual(['acme']);
  });

  it('matches query against role', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, query: 'AI Engineer' });
    expect(result.map((c) => c.id)).toEqual(['beta-corp']);
  });

  it('filters by location, case-insensitive', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, location: 'london' });
    expect(result.map((c) => c.id)).toEqual(['acme']);
  });

  it('filters out companies opening before openAfter', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, openAfter: '2026-06-01' });
    expect(result.map((c) => c.id)).toEqual(['acme']);
  });

  it('filters out companies closing after closeBefore', () => {
    const result = filterCompanies(companies, { ...EMPTY_FILTERS, closeBefore: '2026-06-01' });
    expect(result.map((c) => c.id)).toEqual(['beta-corp']);
  });
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

```bash
cd site && npx vitest run lib/filters.test.ts
```

Expected: FAIL — `./filters` doesn't exist yet.

- [ ] **Step 3: Implement filterCompanies**

`site/lib/filters.ts`:

```ts
import type { Company } from './types';

export interface FilterCriteria {
  query: string;
  location: string;
  openAfter: string;
  closeBefore: string;
}

export const EMPTY_FILTERS: FilterCriteria = {
  query: '',
  location: '',
  openAfter: '',
  closeBefore: '',
};

export function filterCompanies(companies: Company[], criteria: FilterCriteria): Company[] {
  return companies.filter((c) => {
    if (criteria.query) {
      const q = criteria.query.toLowerCase();
      const matchesCompany = c.company.toLowerCase().includes(q);
      const matchesRole = c.role.toLowerCase().includes(q);
      if (!matchesCompany && !matchesRole) return false;
    }
    if (criteria.location && c.location.toLowerCase() !== criteria.location.toLowerCase()) {
      return false;
    }
    if (criteria.openAfter && c.openDate && c.openDate < criteria.openAfter) {
      return false;
    }
    if (criteria.closeBefore && c.closeDate && c.closeDate > criteria.closeBefore) {
      return false;
    }
    return true;
  });
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

```bash
cd site && npx vitest run lib/filters.test.ts
```

Expected: PASS, all 6 tests.

- [ ] **Step 5: Commit**

```bash
git add site/lib/filters.ts site/lib/filters.test.ts
git commit -m "feat(site): add company search/filter logic"
```

---

## Task 6: Directory listing page

**Files:**
- Create: `site/components/CompanyCard.tsx`
- Create: `site/components/FilterBar.tsx`
- Create: `site/components/DirectoryBrowser.tsx`
- Modify: `site/app/page.tsx`

**Interfaces:**
- Consumes: `loadCompanies` (Task 4), `filterCompanies`/`FilterCriteria`/`EMPTY_FILTERS` (Task 5).
- Produces: the `/` route rendering the full directory with working search/filter.

No automated test here — React Testing Library/jsdom is more tooling than this project needs for a handful of display components. Verified manually in Step 5 with exact checks.

- [ ] **Step 1: Company card component**

`site/components/CompanyCard.tsx`:

```tsx
import Link from 'next/link';
import type { Company } from '@/lib/types';

export function CompanyCard({ company }: { company: Company }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 6, padding: '1rem', marginBottom: '1rem' }}>
      <h2>{company.company} — {company.role}</h2>
      <p>{company.location} · {company.length}</p>
      <p>Opens: {company.openDate || 'unknown'} · Closes: {company.closeDate || 'unknown'}</p>
      {company.dateNotes && <p><em>{company.dateNotes}</em></p>}
      <p>
        <a href={company.link} target="_blank" rel="noreferrer">Listing</a>
        {company.hasFactFile && (
          <>
            {' · '}
            <Link href={`/company/${company.id}`}>Fact file</Link>
          </>
        )}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Filter bar component**

`site/components/FilterBar.tsx`:

```tsx
'use client';

import type { FilterCriteria } from '@/lib/filters';

export function FilterBar({
  criteria,
  onChange,
}: {
  criteria: FilterCriteria;
  onChange: (next: FilterCriteria) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <input
        type="text"
        placeholder="Search company or role"
        value={criteria.query}
        onChange={(e) => onChange({ ...criteria, query: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        value={criteria.location}
        onChange={(e) => onChange({ ...criteria, location: e.target.value })}
      />
      <label>
        Opens after
        <input
          type="date"
          value={criteria.openAfter}
          onChange={(e) => onChange({ ...criteria, openAfter: e.target.value })}
        />
      </label>
      <label>
        Closes before
        <input
          type="date"
          value={criteria.closeBefore}
          onChange={(e) => onChange({ ...criteria, closeBefore: e.target.value })}
        />
      </label>
    </div>
  );
}
```

- [ ] **Step 3: Directory browser (client component holding filter state)**

`site/components/DirectoryBrowser.tsx`:

```tsx
'use client';

import { useState } from 'react';
import type { Company } from '@/lib/types';
import { filterCompanies, EMPTY_FILTERS } from '@/lib/filters';
import { FilterBar } from './FilterBar';
import { CompanyCard } from './CompanyCard';

export function DirectoryBrowser({ companies }: { companies: Company[] }) {
  const [criteria, setCriteria] = useState(EMPTY_FILTERS);
  const filtered = filterCompanies(companies, criteria);

  return (
    <div>
      <FilterBar criteria={criteria} onChange={setCriteria} />
      <p>{filtered.length} of {companies.length} companies</p>
      {filtered.map((c) => (
        <CompanyCard key={c.id} company={c} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Wire up the page**

Replace the contents of `site/app/page.tsx`:

```tsx
import { loadCompanies } from '@/lib/companies';
import { DirectoryBrowser } from '@/components/DirectoryBrowser';

export default function Home() {
  const companies = loadCompanies();
  return (
    <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Apprenticeship Directory</h1>
      <DirectoryBrowser companies={companies} />
    </main>
  );
}
```

- [ ] **Step 5: Manual verification**

```bash
cd site && npm run dev
```

Open `http://localhost:3000`. Confirm:
- Every company from `data/companies.json` is listed.
- Typing a company name into the search box narrows the list to matching entries only.
- Typing a location filters correctly (case-insensitive).
- Setting "Opens after" to a future date hides companies with earlier open dates.
- A company with a fact file on disk shows a "Fact file" link; one without does not.

- [ ] **Step 6: Commit**

```bash
git add site/components site/app/page.tsx
git commit -m "feat(site): add directory listing page with search and filter"
```

---

## Task 7: Fact file detail page

**Files:**
- Create: `site/app/company/[id]/page.tsx`

**Interfaces:**
- Consumes: `loadCompanies` (Task 4), `marked` (installed in Task 3).
- Produces: the `/company/[id]` route, statically generated for every company with `hasFactFile: true`.

- [ ] **Step 1: Implement the page**

`site/app/company/[id]/page.tsx`:

```tsx
import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { loadCompanies } from '@/lib/companies';

export function generateStaticParams() {
  return loadCompanies()
    .filter((c) => c.hasFactFile)
    .map((c) => ({ id: c.id }));
}

export default function FactFilePage({ params }: { params: { id: string } }) {
  const companies = loadCompanies();
  const company = companies.find((c) => c.id === params.id);
  if (!company || !company.hasFactFile) notFound();

  const factFilePath = path.join(process.cwd(), '..', 'output', company.id, `${company.id}-fact-file.md`);
  const markdown = fs.readFileSync(factFilePath, 'utf-8');
  const html = marked.parse(markdown) as string;

  return (
    <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <p><a href="/">← Back to directory</a></p>
      <h1>{company.company} — {company.role}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
```

- [ ] **Step 2: Manual verification**

With `npm run dev` still running (or restart it), visit `http://localhost:3000/company/acme` for a company that has a fact file. Confirm:
- The fact file's markdown renders as formatted HTML (headings, lists).
- Visiting `/company/{id}` for a company with no fact file returns a 404.

- [ ] **Step 3: Commit**

```bash
git add site/app/company
git commit -m "feat(site): add fact file detail page"
```

---

## Task 8: Verify the static export end-to-end

**Files:** none created — verification only.

- [ ] **Step 1: Build the static export**

```bash
cd site && npm run build
```

Expected: build succeeds, no errors about API routes or server actions (there are none — confirms the site really is static).

- [ ] **Step 2: Serve the export and check it**

```bash
npx serve out
```

Open the printed local URL. Confirm the directory page and at least one fact file page both render correctly from the static files (no dev server, no Node process other than the static file server).

- [ ] **Step 3: Confirm no personal data or write paths are present**

```bash
grep -ril "my-tracker.local" out || echo "clean"
```

Expected: `clean` — nothing in the exported output references the personal tracker file.

- [ ] **Step 4: Run the full test suite**

```bash
npx vitest run
cd ..
```

Expected: all tests from Tasks 4 and 5 pass.

(Nothing to commit — this task only verifies prior work.)

---

## Task 9: Personal tracker server

**Files:**
- Create: `personal-tracker/package.json`
- Create: `personal-tracker/lib/server.mjs`
- Create: `personal-tracker/lib/server.test.mjs`
- Create: `personal-tracker/index.mjs`

**Interfaces:**
- Produces: `createServer({ companiesPath, personalPath }): http.Server` with routes `GET /api/companies`, `GET /api/personal`, `POST /api/personal` — used by Task 10's frontend.

- [ ] **Step 1: package.json**

`personal-tracker/package.json`:

```json
{
  "name": "personal-tracker",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node index.mjs",
    "test": "node --test lib/*.test.mjs"
  }
}
```

- [ ] **Step 2: Write the failing tests**

`personal-tracker/lib/server.test.mjs`:

```js
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
```

- [ ] **Step 3: Run the tests and confirm they fail**

```bash
cd personal-tracker && node --test lib/*.test.mjs
```

Expected: FAIL — `./server.mjs` doesn't exist yet.

- [ ] **Step 4: Implement the server**

`personal-tracker/lib/server.mjs`:

```js
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function createServer({ companiesPath, personalPath }) {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/companies') {
      const companies = readJson(companiesPath, []).map(({ id, company, role }) => ({ id, company, role }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(companies));
      return;
    }

    if (req.method === 'GET' && req.url === '/api/personal') {
      const personal = readJson(personalPath, {});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(personal));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/personal') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        const { id, entry } = JSON.parse(body);
        const personal = readJson(personalPath, {});
        personal[id] = entry;
        fs.writeFileSync(personalPath, JSON.stringify(personal, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(personal));
      });
      return;
    }

    const requestedPath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(PUBLIC_DIR, requestedPath);
    if (!fullPath.startsWith(PUBLIC_DIR) || !fs.existsSync(fullPath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(fullPath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(fullPath));
  });
}
```

- [ ] **Step 5: Run the tests and confirm they pass**

```bash
cd personal-tracker && node --test lib/*.test.mjs
```

Expected: PASS, all 3 tests.

- [ ] **Step 6: Add the entry point**

`personal-tracker/index.mjs`:

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from './lib/server.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4321;

const server = createServer({
  companiesPath: path.join(__dirname, '..', 'data', 'companies.json'),
  personalPath: path.join(__dirname, '..', 'data', 'my-tracker.local.json'),
});

server.listen(PORT, () => {
  console.log(`Personal tracker running at http://localhost:${PORT}`);
});
```

- [ ] **Step 7: Commit**

```bash
git add personal-tracker/package.json personal-tracker/lib personal-tracker/index.mjs
git commit -m "feat(personal-tracker): add local server for personal stage tracking"
```

---

## Task 10: Personal tracker frontend

**Files:**
- Create: `personal-tracker/public/index.html`
- Create: `personal-tracker/public/app.js`

**Interfaces:**
- Consumes: `GET /api/companies`, `GET /api/personal`, `POST /api/personal` (Task 9).

- [ ] **Step 1: HTML shell**

`personal-tracker/public/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>My Apprenticeship Tracker</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .company { border: 1px solid #ccc; border-radius: 6px; padding: 1rem; margin-bottom: 1rem; }
    .company h2 { margin: 0 0 0.5rem; font-size: 1.1rem; }
    label { display: block; margin-top: 0.5rem; font-size: 0.9rem; }
    select, textarea, input[type="text"] { width: 100%; margin-top: 0.25rem; box-sizing: border-box; }
    button { margin-top: 0.75rem; }
  </style>
</head>
<body>
  <h1>My Apprenticeship Tracker</h1>
  <div id="companies">Loading…</div>
  <script src="/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Frontend logic**

`personal-tracker/public/app.js`:

```js
const STAGES = ['Not applied', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

async function load() {
  const [companies, personal] = await Promise.all([
    fetch('/api/companies').then((r) => r.json()),
    fetch('/api/personal').then((r) => r.json()),
  ]);
  render(companies, personal);
}

function render(companies, personal) {
  const container = document.getElementById('companies');
  container.innerHTML = '';
  for (const c of companies) {
    const entry = personal[c.id] || {
      currentStage: 'Not applied',
      nextStage: '',
      nextStageDone: false,
      registeredForUpdates: false,
      notes: '',
    };
    const div = document.createElement('div');
    div.className = 'company';
    div.innerHTML = `
      <h2>${c.company} — ${c.role}</h2>
      <label>Current Stage
        <select data-field="currentStage">
          ${STAGES.map((s) => `<option value="${s}" ${s === entry.currentStage ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </label>
      <label>Next Stage
        <input type="text" data-field="nextStage" value="${entry.nextStage}" />
      </label>
      <label><input type="checkbox" data-field="nextStageDone" ${entry.nextStageDone ? 'checked' : ''} /> Next Stage Done</label>
      <label><input type="checkbox" data-field="registeredForUpdates" ${entry.registeredForUpdates ? 'checked' : ''} /> Registered for Updates</label>
      <label>Notes
        <textarea data-field="notes">${entry.notes}</textarea>
      </label>
      <button type="button">Save</button>
    `;
    div.querySelector('button').addEventListener('click', () => save(c.id, div));
    container.appendChild(div);
  }
}

async function save(id, div) {
  const entry = {
    currentStage: div.querySelector('[data-field="currentStage"]').value,
    nextStage: div.querySelector('[data-field="nextStage"]').value,
    nextStageDone: div.querySelector('[data-field="nextStageDone"]').checked,
    registeredForUpdates: div.querySelector('[data-field="registeredForUpdates"]').checked,
    notes: div.querySelector('[data-field="notes"]').value,
  };
  await fetch('/api/personal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, entry }),
  });
}

load();
```

- [ ] **Step 3: Manual verification**

```bash
cd personal-tracker && npm start
```

Open `http://localhost:4321`. Confirm:
- Every company from `data/companies.json` appears with a form.
- Changing Current Stage, filling Next Stage, ticking the checkboxes, and clicking Save persists.
- Reloading the page shows the saved values (round-trip through `data/my-tracker.local.json`).
- `data/my-tracker.local.json` now exists on disk and is **not** tracked by git (`git status` shows it as ignored, not untracked-and-visible).

- [ ] **Step 4: Commit**

```bash
git add personal-tracker/public
git commit -m "feat(personal-tracker): add frontend for editing personal stage and notes"
```

---

## Task 11: Update workflow docs to use companies.json instead of Airtable

**Files:**
- Modify: `workflows/ai-apprenticeship-agent-workflow.md`
- Modify: `workflows/apprenticeship-company-discovery-workflow.md`
- Modify: `workflows/company-role-fact-file-workflow.md`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Update ai-apprenticeship-agent-workflow.md**

Replace the `## Where The Tracker Lives` section:

Old:
```
The tracker is an Airtable base, not a spreadsheet.

* Base: "Apprenticeship Tracker" (id redacted)
* Table: "Table 1" (id redacted)

Use the Airtable MCP tools to read and write. Do not go through Google Sheets.
```

New:
```
The tracker is `/data/companies.json`, a git-tracked JSON array — not Airtable, not a spreadsheet.

Read and write it directly as a file. Each entry has: id, company, role, location, length,
trainingProvider, grades, salary, openDate, closeDate, dateNotes, link. There is no
attachments field and no Current Stage field in this file — those are either handled
automatically (fact file presence, computed by the site) or live in the user's private,
gitignored `/data/my-tracker.local.json`, which this workflow never touches.
```

Update the schema table's rule 4 ("Never create a new field in Airtable...") to:
```
4. Never add a new field to a companies.json entry. Work only with the fields listed below.
```

Update Step 2 ("Check tracker"):

Old:
```
* Search the Airtable table for the company name in the Company field.
* If a record already exists for that company, skip it. Do not create a duplicate.
```

New:
```
* Search `/data/companies.json` for an entry whose `company` field matches.
* If an entry already exists for that company, skip it. Do not create a duplicate.
```

Update Step 3's "create a new record" line to say "append a new entry to `/data/companies.json`" instead of "create a new record", and drop "Current Stage set to `Not applied`" (Current Stage no longer lives in this file).

Update the Table Schema section: remove the rows for Attachments, Registered for Updates, Current Stage, Next Stage, and Next Stage Done entirely (they no longer live in `companies.json`). Remove the "Allowed single select values: Current Stage..." line.

- [ ] **Step 2: Update apprenticeship-company-discovery-workflow.md**

Replace every "Airtable" reference in this file's rules and cache-freshness sections with "companies.json". Specifically:

Old rule 4: `4. Do not read Airtable except to seed the cache, or when a re-sync is asked for.`
New rule 4: `4. Do not read companies.json except to seed the cache, or when a re-sync is asked for.`

Old: `* If the file does not exist, do one full Airtable read of the Company and Role fields to build the In Tracker table, say that this was done, and do not read Airtable again unless asked.`
New: `* If the file does not exist, read companies.json once to build the In Tracker table from its company and role fields, say that this was done, and do not read companies.json again unless asked.`

Old: `* Append to In Tracker immediately after each successful Airtable write. This is what allows the cache to be trusted without re-reading Airtable.`
New: `* Append to In Tracker immediately after each successful write to companies.json. This is what allows the cache to be trusted without re-reading companies.json.`

Apply the same "Airtable" → "companies.json" substitution to Step 2 ("Load the cache"), Step 4's "After each successful Airtable write" line, and the "Re-sync the cache" manual override description. Where the text says "One full Airtable read rebuilds..." change to "One full companies.json read rebuilds...".

Update the Revisit row detail note: "Kept so the Airtable row can be rebuilt" → "Kept so the companies.json entry can be rebuilt", and "Write its row detail subsection before deleting the Airtable row" → "before deleting the companies.json entry".

- [ ] **Step 3: Update company-role-fact-file-workflow.md**

Replace Step 6 ("Update"):

Old:
```
**Step 6 - Update**
* Once the user is happy with the end result, add the file to the attachment column in the Airtable Apprenticeship tracker
* Base: "Apprenticeship Tracker" (id redacted)
* Table: "Table 1" (id redacted)
* push and commit the file to git after
```

New:
```
**Step 6 - Update**
* Once the user is happy with the end result, push and commit the fact file to git.
* Nothing else to update — the site detects the fact file automatically from its location
  on disk (`/output/{company}/{company}-fact-file.md`) at build time.
```

- [ ] **Step 4: Commit**

```bash
git add workflows/ai-apprenticeship-agent-workflow.md workflows/apprenticeship-company-discovery-workflow.md workflows/company-role-fact-file-workflow.md
git commit -m "docs: point workflows at companies.json instead of Airtable"
```

---

## Task 12: Deploy the public site to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy-site.yml`
- Modify: `site/next.config.mjs`
- Create: `site/public/.nojekyll`

**Interfaces:** none — CI/deployment configuration only.

- [ ] **Step 1: Add basePath support for project pages**

GitHub Pages serves a project (non-root) repo at `https://{user}.github.io/{repo}/`, so the site needs a matching `basePath`. Replace `site/next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_PAGES === 'true' ? '/apprenticeship-agents' : '',
};

export default nextConfig;
```

(Replace `/apprenticeship-agents` with the actual repo name if it differs.)

- [ ] **Step 2: Prevent GitHub Pages from mangling the `_next` folder**

```bash
touch site/public/.nojekyll
```

- [ ] **Step 3: Add the deploy workflow**

`.github/workflows/deploy-site.yml`:

```yaml
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'site/**'
      - 'data/companies.json'
      - 'output/**'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
        working-directory: site
      - run: npm run build
        working-directory: site
        env:
          GITHUB_PAGES: 'true'
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site/out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Verify the build works with GITHUB_PAGES set**

```bash
cd site && GITHUB_PAGES=true npm run build
cd ..
```

Expected: build succeeds, and files inside `site/out/_next/` reference paths prefixed with the repo name.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy-site.yml site/next.config.mjs site/public/.nojekyll
git commit -m "ci: deploy the public site to GitHub Pages on push to main"
```

- [ ] **Step 6: Enable Pages in the repo settings**

In the GitHub repo's Settings → Pages, set Source to "GitHub Actions". This is a one-time manual step in the GitHub UI, not something committed to the repo. Confirm the workflow run succeeds and the printed Pages URL loads the directory.

---

## Post-plan check

Once all tasks are done, confirm the repo is safe to make public:

```bash
git status --ignored
```

Confirm `cv/master-cv.md`, every `output/*/*-cv.md`, every `output/*/*-cv.docx`, and `data/my-tracker.local.json` all appear under "Ignored files" — not tracked, not staged.
