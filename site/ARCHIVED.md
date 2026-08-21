# Archived

This folder is not in use. The tracker went back to Airtable.

`/site` was a Next.js static site that rendered a public, searchable directory of apprenticeships
from `data/companies.json`. It works, and it is kept here in case the idea is picked up again.

## State when it was archived

* 78 companies in `data/companies.json`, migrated from Airtable on 2026-08-21.
* Search and filter by company, role, location, and opening or closing date.
* A page per company at `/company/{id}`, showing the fact file when one exists.
* 13 passing tests covering the data loader and the filter logic.

## Why it was archived

Airtable turned out to be the better fit for how the tracker is actually used day to day.

## If you come back to it

* `npm run dev` inside this folder, then open http://localhost:3000
* `data/companies.json` is a point-in-time copy from August 2026. It is stale, and Airtable is the
  source of truth again, so re-migrate before trusting anything in it.
* Automatic deployment to GitHub Pages was removed when this was archived. The design notes are in
  `docs/superpowers/specs/apprenticeship-tracker-gui-design.md`.
