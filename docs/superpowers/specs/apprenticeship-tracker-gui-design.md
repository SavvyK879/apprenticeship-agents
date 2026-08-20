# Apprenticeship Tracker GUI — Design

Date: 2026-08-21

## Goal

Replace Airtable as the home of the apprenticeship tracker with a self-hosted GUI, so the repo can go public without depending on a private third-party service. The public part becomes a directory other apprenticeship-seekers can browse. The user's own application progress stays private.

## Context

Today the tracker is an Airtable base (`ai-apprenticeship-agent-workflow.md`), fed by a discovery workflow (`apprenticeship-company-discovery-workflow.md`) and linked to two per-company outputs: a fact file (`company-role-fact-file-workflow.md`) and a tailored CV (`cv-tailoring-workflow.md`). All four workflows currently read/write Airtable via its MCP tools.

The repo is going public. Two things cannot go public as-is:
- Airtable credentials/base as the system of record — the whole point of this change.
- Personal content: `/cv/master-cv.md` (real name, contact details) and the per-company tailored CVs, which are derived from it.

Fact files are not personal — they're company/role research — and stay in the repo.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Audience | Public directory, shared by anyone who visits | User wants other apprenticeship-seekers to be able to use it, not just themselves. |
| Accounts/auth | None | No multi-tenant requirement was found strong enough to justify the build/maintenance cost. |
| Public data store | `/data/companies.json`, git-tracked | Replaces the Airtable base. Free version history via git. Agents write to it directly with file edits instead of MCP calls. |
| Private data store | `/data/my-tracker.local.json`, gitignored (`*.local` already matched) | Holds the fields that were "manual" in Airtable: Current Stage, Next Stage, Next Stage Done, Registered for Updates, notes. Single-user, so a local file is enough — no database needed. |
| Where stage lives | Local only, never shipped to the public site | First draft explored per-visitor stage via browser localStorage on the public site; user reversed this — stage is private to the user alone, not a feature offered to visitors. |
| Public site interactivity | Read-only: browse, search, filter | No visitor accounts means no visitor-owned data to write. Search/filter is the "read/write" that matters here; editing the directory itself is an agent job, not a site feature. |
| Personal editing | Local dev only (`npm run dev`), separate view merging directory + personal file | Full read/write on stage etc. happens here, on the user's machine, never in the public build. |
| Fact files | Stay in the repo, linked from each directory entry when present | Not personal data — useful context, and already company/role research the public directory benefits from. |
| CVs | Gitignored: `/cv/master-cv.md`, `/output/*/*-cv.md`, `/output/*/*-cv.docx` | Personal, derived from the user's real name/experience. |
| Tech stack | Next.js, static export | One framework covers both the public static site and the local personal-mode dev server. Common enough stack to double as a portfolio-relevant build. |
| Hosting | Vercel or GitHub Pages, free tier | Static site, no server to run or pay for. Redeploy on push to `main` (or whenever `companies.json` changes). |

## Data model

### `/data/companies.json` (public, git-tracked)

One array of objects, one per company. Fields map directly from the current Airtable schema (`ai-apprenticeship-agent-workflow.md`), minus anything manual/personal:

```json
{
  "id": "revolut",
  "company": "Revolut",
  "role": "Software Engineer Degree Apprentice (Level 6)",
  "location": "London",
  "length": "4 years",
  "trainingProvider": "...",
  "grades": "BBB",
  "salary": "£24,000",
  "openDate": "2026-09-01",
  "closeDate": "2026-11-30",
  "dateNotes": "",
  "link": "https://...",
  "hasFactFile": true
}
```

- `id` is the lowercase-hyphenated company slug already used for `/output/{company}/` — reused as the join key to the fact file path and as a stable key for the personal file.
- `hasFactFile` is computed at build time by checking whether `/output/{id}/{id}-fact-file.md` exists — not hand-maintained.
- No `attachments` field — CVs aren't public, so there's nothing to attach here.

### `/data/my-tracker.local.json` (private, gitignored)

Keyed by the same `id`, holding only what's genuinely personal:

```json
{
  "revolut": {
    "currentStage": "Applied",
    "nextStage": "Online assessment",
    "nextStageDone": false,
    "registeredForUpdates": true,
    "notes": ""
  }
}
```

Entries are created on first edit in personal mode — no need to pre-populate for every company in the directory.

## The public site

- Static Next.js build reading `companies.json` at build time.
- List/grid of companies with: text search (company/role), location filter, open/close date range filter.
- Each card links to the fact file (rendered from markdown) when `hasFactFile` is true; no link shown otherwise.
- No stage, no notes, no edit controls anywhere in this build.

## Personal mode (local only)

- Running `npm run dev` adds a second view that merges `companies.json` with `my-tracker.local.json` by `id`.
- Lets the user set/edit Current Stage, Next Stage, Next Stage Done, Registered for Updates, and notes per company, saving back to `my-tracker.local.json`.
- This view and its write path do not exist in the static export used for deployment — enforced by only including that route/component in the dev build, not by a runtime check.

## Workflow file changes

All four files in `/workflows/` currently reference Airtable. Changes needed:

- `ai-apprenticeship-agent-workflow.md` — replace "Airtable base/table" and MCP tool instructions with: read/write `/data/companies.json` directly (file edit), matching the same field set minus the manual-only fields. Duplicate check becomes a lookup by `company` (or slug) in the JSON array instead of an Airtable search.
- `apprenticeship-company-discovery-workflow.md` — the cache file (`apprenticeship-search-log.md`) exists to avoid re-reading Airtable every run. Once the source of truth is a git-tracked JSON file that's cheap to read directly, this cache may no longer be needed — flagged here as a likely simplification, not decided in this spec.
- `company-role-fact-file-workflow.md` — Step 6 currently "adds the file to the attachment column in Airtable." Since there's no attachments field anymore, this step becomes: nothing to do beyond the existing "push and commit the file to git" — `hasFactFile` picks it up automatically at build time.
- `cv-tailoring-workflow.md` — already never touches Airtable (rule 8). No change needed beyond confirming its outputs stay covered by the new `.gitignore` entries.

## `.gitignore` additions

```
/cv/master-cv.md
output/*/*-cv.md
output/*/*-cv.docx
```

`/data/my-tracker.local.json` is already covered by the existing `*.local` pattern.

## Folder structure changes

Add to `CLAUDE.md`'s Folder Structure list:

```
/data
Holds the tracker data. companies.json is the public source of truth (git-tracked).
my-tracker.local.json is the user's private stage/notes (gitignored).
```

## Out of scope

- Accounts, auth, or any per-visitor personal data on the public site (explicitly reversed during design).
- A hosted database — not needed without multi-tenant data.
- Editing the public directory from the deployed site — the directory is agent-maintained, not visitor-editable.
- Deciding the fate of `apprenticeship-search-log.md` — flagged above, left for the implementation plan or a follow-up.
