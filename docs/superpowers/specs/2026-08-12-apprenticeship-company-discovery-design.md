# Apprenticeship Company Discovery Workflow

Date: 2026-08-12

## Purpose

Find companies offering apprenticeships that suit me, and feed them into the existing
tracker workflow automatically. This is the discovery step that sits in front of
`/workflows/ai-apprenticeship-agent-workflow.md`, which already takes company names as
input and does the deep research per company.

## Context

The workspace already has two workflows:

* `ai-apprenticeship-agent-workflow.md` populates the Airtable tracker for a named company.
* `company-role-fact-file-workflow.md` writes an application fact file for a named company and role.

Both start from a company name I supply by hand. Nothing currently finds the companies.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Where candidates come from | Apprenticeship listing sites plus open web search | Listing sites give real, current openings. Open search catches employers who only advertise on their own careers page. |
| Filters beyond role type | None | Keeping location, sector, size and grades open avoids ruling out good options early. I filter by hand later. |
| Role filter | Identical to the tracker workflow | Anything this workflow passes forward must be accepted by the tracker workflow, otherwise the handoff wastes research. |
| Handoff format | Shortlist printed in chat | I want to see what was found without opening a file. |
| Handover | Runs the tracker workflow straight away, no approval pause | The role filter is strict enough that a manual gate adds little. |
| Duplicate handling | Skipped, and the quota tops up to replace them | A request for 10 should return 10 new companies, not 10 minus whatever is already tracked. |
| Airtable reads | One seed read, then never again unless I ask | Reading the tracker through the MCP on every run is slow and burns tokens. |
| Cache freshness | Trusted during runs, re-synced only on request | Chosen over re-reading Airtable each run, which would defeat the point of the cache. |
| Rejections | Permanent unless I say otherwise | Re-checking companies that had nothing is wasted effort. Naming a company forces a re-check. |
| Repeat-run efficiency | Not pursued | Saving leftover unscreened candidates for the next run was considered and dropped. Listings change month to month, so a saved list goes stale. |

## The cache file

Lives at `/output/apprenticeship-search-log.md`. Two tables.

**In Tracker**

| Company | Role | Date added |

**Rejected**

| Company | Date checked | Reason |

The cache is what makes the trusted-cache decision work. Because the workflow does not
re-read Airtable, it must append to the In Tracker table every time the tracker workflow
successfully writes a row. Without that, the same companies would be rediscovered on the
next run.

On the first ever run the file will not exist. The workflow does one full Airtable read to
seed the In Tracker table, says that it did so, and does not read Airtable again unless asked.

## How a run works

1. Receive a quota. Defaults to 10 if not given.
2. Load the cache, seeding it from Airtable if the file is missing.
3. Discover candidate companies from listing sites and open web search.
4. Screen each candidate:
   * If the company appears in either cache table, skip it with no research.
   * Otherwise check for a level 6 Digital Technology Solutions apprenticeship aligned to
     software engineering. Failing that, a level 4 apprenticeship in software or AI
     engineering. Never networking or cybersecurity.
   * Passes go on the shortlist with role and link. Fails go into the Rejected table with a
     one line reason and today's date.
5. Continue until the quota of new qualifying companies is met.
6. Stop early if three times the quota has been screened without filling it, and report what
   was found. This prevents an endless search when there is nothing left to find.
7. Print the shortlist in chat: company, role, link.
8. Run `ai-apprenticeship-agent-workflow.md` for each shortlisted company, one at a time.
9. After each successful Airtable write, append the company to the In Tracker table.
10. Report counts: added, skipped as duplicates, rejected.

## Manual overrides

* **Re-sync the cache.** One full Airtable read rebuilds the In Tracker table. The Rejected
  table is never touched by a re-sync.
* **Name a company directly.** Forces a re-check even if the company sits in the Rejected
  table. This is the escape hatch, since rejections are otherwise permanent.

## Rules carried over

* Never fabricate companies, roles, dates or links.
* A company only qualifies if a real, findable listing or scheme page exists.
* The role filter must stay identical to the tracker workflow. If one changes, change both.

## Out of scope

* Writing fact files. That stays in `company-role-fact-file-workflow.md`.
* Filtering by location, sector, company size or entry grades.
* Tracking application deadlines or stages, which the tracker already handles.
