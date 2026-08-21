# Archived

This folder is not in use. The tracker went back to Airtable, where stage and notes live again.

`/personal-tracker` was a local-only tool for recording application progress (current stage, next
step, notes) against each company, saved to `data/my-tracker.local.json`. It never deployed
anywhere and never held anything publicly.

## State when it was archived

* Small Node HTTP server plus a plain HTML and JavaScript page, no framework.
* 11 passing tests covering the API, malformed input, and a corrupt data file.
* Never populated with real data. Stage and notes stayed in Airtable throughout.

## Why it was archived

Airtable already does this well, and keeping progress in two places was not worth it.

## If you come back to it

* `npm start` inside this folder, then open http://localhost:4321
* It reads company names from `data/companies.json`, which is a stale August 2026 copy of Airtable.
