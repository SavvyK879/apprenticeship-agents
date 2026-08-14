# Goal

Given a company and a role, research both thoroughly and produce a single, finished fact file that makes it easy to tailor a job or apprenticeship application.

## Rules

1. Never fabricate statistics, quotes, dates, or sources.
2. Every factual claim must carry an inline citation marker (e.g. `[1]`) linking to the Sources section.
3. If a claim can't be sourced but is still useful context (e.g. a reasonable inference about interview style), include it but flag it clearly as unverified opinion — do not attach a citation to it.
4. If a claim can't be sourced and can't be reasonably inferred, leave it out entirely.
5. Do not produce a separate "draft" file. Research fully before writing, write the finished report directly, and edit that same file in place if feedback is given.

## Fact File Structure

Every fact file has these sections, in this order:

1. **Company Overview** — what they do, sector, size, mission
2. **Values** - what to they value from employees
3. **Recent News & Culture Signals** — recent press coverage, LinkedIn company/employee activity, anything showing direction or values in practice
4. **Role Requirements** — responsibilities and required skills/qualifications, taken from the official job listing
5. **Application Process Steps** — the actual application stages (online form, assessment/testing, interview rounds, etc.), as far as findable
6. **Application Tailoring Tips** — concrete suggestions: which skills to emphasize, language to mirror from the company's own materials, likely interview questions to prepare for
7. **Sources** — numbered list of every source used, with links, matching the inline citation markers used throughout sections 1-6

## Sources Used for Research

* Company website
* Official job/apprenticeship listing
* News articles
* LinkedIn (company page and employee posts)

Do not use employee review sites (e.g. Glassdoor, Indeed) — not part of this workflow's approved source list.

## Step-By-Step Process

**Step 1 - Receive company and role**

* Accept a company name and a specific role/job title.
* If multiple companies are given, split them up and run this workflow separately for each.
* Only one role is tracked per company, so only one fact file per company.

**Step 2 - Check for an existing fact file**

* Check `/output/{company}/` for `{company}-fact-file.md`. Use a lowercase, hyphenated version of the company name for the folder (see File Naming).
* If the company folder doesn't exist yet, there's no existing fact file for this company — skip straight to Step 3.
* If the file exists, tell the user and ask whether to update it or leave it as is, rather than silently overwriting it. If the role given is different from the role in the existing file, say so and ask which role to keep — don't create a second file for the same company.

**Step 3 - Full research pass**

* Research all four content sections (Company Overview, Recent News & Culture Signals, Role Requirements, Application Process Steps) using only the approved sources.
* Do this before writing anything — the goal is a finished report on the first write, not a rough pass to be redone later.

**Step 4 - Write the fact file**

* Each company gets its own folder under `/output/`. If `/output/{company}/` doesn't exist yet, create it now — don't pre-create folders for companies that don't have a fact file yet.
* Write the complete report directly to `/output/{company}/{company}-fact-file.md` using the structure above.
* Add inline citation markers (`[1]`, `[2]`, ...) next to claims as they're written.
* Build the Application Tailoring Tips section from the research gathered, not from generic advice.
* Add the Sources section at the bottom with the full list of links, numbered to match the inline markers.

**Step 5 - Deliver and revise**

* Tell the user the fact file is ready and where to find it.
* If the user gives feedback, edit the same file in place. Never create a second, near-duplicate file for the same company.

**Step 6 - Attach to the tracker**

Only start this once the user has confirmed in Step 5 that they are happy with the fact file. Never attach a draft.

* Base: "Apprenticeship Tracker" — `appGa8FIDwREZf4Vr`
* Table: "Table 1" — `tblNtjoCUrKBM9g3Y`
* Attachments field: `fldeCMjs1DOQ2dJYY`

Find the record first. Search the Company field for the company name. If no record exists, say so and stop. The tracker row has to exist before a fact file can hang off it, and creating that row is the other workflow's job.

Airtable will not take a file upload through the MCP tools. It takes a URL and fetches the file itself, so the file has to be publicly reachable for a moment. The repo is private, so a GitHub link will not work.

*Preferred path, via Google Drive*

1. Upload `/output/{company}/{company}-fact-file.md` to Google Drive.
2. Turn on link sharing so anyone with the link can view.
3. Build the direct download URL: `https://drive.google.com/uc?export=download&id={fileId}`.
4. Write it to the Attachments field as `[{"url": "<that URL>", "filename": "{company}-fact-file.md"}]`.
5. Read the record back and check the attachment landed. Airtable copies the file into its own storage, so the Drive copy is only a courier. Delete it once the attachment shows.

*Fallback, manual*

If the upload fails, the link will not fetch, or Airtable rejects it, stop after one retry. Tell the user the full file path and ask them to drag it into the Attachments cell. Say which step failed so they know what broke.

*Then commit*

Commit and push the fact file to git once the attachment is sorted, not before.

## File Naming

* Lowercase, hyphens instead of spaces, no special characters, per workspace file naming rules.
* Each company has its own folder: `/output/{company}/`. Create it only when the first file for that company is written — never pre-create folders for companies without one. Anything else company-specific written later goes in the same folder.
* File pattern: `/output/{company}/{company}-fact-file.md`. The role is not in the file name — only one role is tracked per company. The role itself is named inside the file, in the Role Requirements section.
* Example: `/output/revolut/revolut-fact-file.md`
