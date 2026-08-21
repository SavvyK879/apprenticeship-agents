# Goal

Find companies offering apprenticeships that suit me and feed them into the tracker. This is the
discovery step that sits in front of `ai-apprenticeship-agent-workflow.md`, which already takes a
company name and does the deep research. Nothing else in the workspace finds the companies.

## Rules

1. Never fabricate companies, roles, dates or links.
2. A company only qualifies if a real, findable listing or scheme page exists.
3. The role filter and the qualification rule must stay identical to `ai-apprenticeship-agent-workflow.md` Step 3. If one changes, change both.
4. Do not read Airtable except to seed the cache, or when a re-sync is asked for.
5. Keep cache entries short. A few words, not sentences.

## The Cache File

Lives at `/output/apprenticeship-search-log.md`. Four tables.

```markdown
## In Tracker

| Company | Role | Date added |
| --- | --- | --- |

## Revisit

| Company | Role | Date checked | Why it was pulled | Revisit from |
| --- | --- | --- | --- | --- |

## Unverified

| Company | Date checked | What blocked the check | Recheck from |
| --- | --- | --- | --- |

## Rejected

| Company | Date checked | Reason |
| --- | --- | --- |
```

Rules that govern it:

* If the file does not exist, do one full Airtable read of the Company and Role fields to build the In Tracker table, say that this was done, and do not read Airtable again unless asked.
* Append to In Tracker immediately after each successful Airtable write. This is what allows the cache to be trusted without re-reading Airtable.
* A Rejected row is only binding for a month from its Date checked. Once it is a month or more old, screen the company again and overwrite the row with the new date and reason. Never let the Rejected table become a permanent blocklist.
* A Revisit row is binding until its Revisit from date. On or after that date, screen the company again and delete the Revisit row. Revisit is for a company that passes the role filter but whose timing is wrong, not one that failed it.
* An Unverified row is binding for one week from its Date checked. Unverified is for a company you could not finish screening, not one that failed. Use it when the careers page was unreachable, the listing was behind a login, or the scheme exists at the right level but the software pathway could not be confirmed either way. A confirmed "they do not run one" goes to Rejected, not here. On or after the Recheck from date, screen again and delete the Unverified row.
* Dates are written `YYYY-MM-DD`.

### Revisit row detail

The Revisit table alone does not hold enough to rebuild an Airtable row. Every Revisit row also
gets a subsection below the table, so the research is not lost:

```markdown
### {Company} row detail

Kept so the Airtable row can be rebuilt. Removed from the tracker on {YYYY-MM-DD}.

* Role:
* Location:
* Length:
* Training Provider:
* Grades:
* Salary:
* Open Date / Close Date / Date Notes:
* Current Stage:

{One short paragraph on why the Revisit from date was chosen and what to check when it arrives.}
```

Leave out any field that was blank in Airtable. Delete the whole subsection when its Revisit
row is deleted.

## Step-By-Step Process

**Step 1 - Receive a quota**

* The quota is the number of new qualifying companies to find.
* If no number is given, use 10.

**Step 2 - Load the cache**

* Read `/output/apprenticeship-search-log.md`.
* If it does not exist, seed the In Tracker table from one full Airtable read, then say that you did so.
* Do not read Airtable again during this run.

**Step 3 - Discover candidates**

Use both sources together. One alone leaves gaps.

* Apprenticeship listing sites: GOV.UK Find an Apprenticeship, RateMyApprenticeship, UCAS, Not Going To Uni.
* Open web search for employers running schemes, to catch those advertising only on their own careers page.

Apply no filter on location, sector, company size or entry grades. The one exception is the
qualification rule in Step 4, which is about eligibility rather than competitiveness. Collect
company names into a working list.

**Step 4 - Screen each candidate**

Check the cache first. Skip with no research if the company is:

* In the In Tracker table.
* In the Revisit table with a Revisit from date still in the future.
* In the Unverified table with a Recheck from date still in the future.
* In the Rejected table with a Date checked less than a month old.

Everything else gets screened, including rejections a month or more old, Revisit rows whose date has arrived, and Unverified rows whose week is up.

To screen, apply the role filter:

* Research whether the company offers a level 6 Digital Technology Solutions apprenticeship. If they have multiple options, choose the one most aligned to the role of a Software Engineer. Do not include network engineering or cybersecurity apprenticeships.
* If no level 6 role exists, check whether the company offers a level 4 apprenticeship in software engineering, AI engineering, or similar.
* If neither exists, the company fails.

Then apply the qualification rule:

* I am studying A levels in England. A role fails if its entry requirements are qualifications I cannot hold, whatever its level or title. The clearest case is a Scottish Graduate Apprenticeship, which requires Scottish Highers.
* This is not a grades filter. Do not reject a role for asking high grades, a specific subject, or grades above what I expect. Reject it only when the qualification itself is unobtainable for an England-based A level student.
* When rejecting on this rule, say which qualification is the blocker.

Then record the outcome:

* Passes go on the shortlist with role and link. Prefer the company's own page over a job board.
* Fails go into the Rejected table with a one line reason and today's date, overwriting any existing row for that company.
* A screen you could not finish goes into the Unverified table with what blocked it, today's date, and a Recheck from date one week out. Do not write a Rejected row for a company you could not actually check.
* Delete the Revisit or Unverified row for any company you screened again, whatever the outcome.

**Step 5 - Repeat until the quota is met**

* Only new qualifying companies count towards the quota.
* Duplicates and rejections do not.

**Step 6 - Stop rule**

* If three times the quota has been screened without filling it, stop and report what was found.
* This prevents an endless search when there is nothing left to find.

**Step 7 - Print the shortlist**

* Print it in chat: Company, Role, Link.
* Write no file for the shortlist.

**Step 8 - Hand off to the tracker workflow**

* Run `ai-apprenticeship-agent-workflow.md` for each shortlisted company, one at a time. Do not pause for approval.
* That workflow runs its own duplicate check in its Step 2. That check still applies.
* After each successful Airtable write, append the company to the In Tracker table.
* Finish with counts: added, skipped as duplicates, rejected.

## Manual Overrides

* **Re-sync the cache.** One full Airtable read rebuilds the In Tracker table. Never touches Revisit or Rejected.
* **Name a company directly.** Forces a re-check even if the company was rejected within the last month, or sits in Revisit or Unverified with a future date. This is the escape hatch for anything that cannot wait.
* **Park a company.** Moves it out of the tracker into Revisit with a date to come back on. Write its row detail subsection before deleting the Airtable row, so the row can be rebuilt.

## Where Things Live

* Tracker base and table IDs: see `/workflows/airtable-ids.local.md` (gitignored)
* Cache file: `/output/apprenticeship-search-log.md`
* This file: `/workflows/apprenticeship-company-discovery-workflow.md`

## File Naming

Follow the workspace rules in CLAUDE.md: lowercase, hyphens instead of spaces, descriptive, no special characters.

## Out Of Scope

* Writing fact files. That stays in `company-role-fact-file-workflow.md`.
* Filtering by location, sector, company size or entry grades.
* Tracking application deadlines or stages. The tracker workflow handles those.
