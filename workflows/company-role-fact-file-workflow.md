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

1. **Company Overview** — what they do, sector, size, mission/values
2. **Recent News & Culture Signals** — recent press coverage, LinkedIn company/employee activity, anything showing direction or values in practice
3. **Role Requirements** — responsibilities and required skills/qualifications, taken from the official job listing
4. **Application Process Steps** — the actual application stages (online form, assessment/testing, interview rounds, etc.), as far as findable
5. **Application Tailoring Tips** — concrete suggestions: which skills to emphasize, language to mirror from the company's own materials, likely interview questions to prepare for
6. **Sources** — numbered list of every source used, with links, matching the inline citation markers used throughout sections 1-5

## Sources Used for Research

* Company website
* Official job/apprenticeship listing
* News articles
* LinkedIn (company page and employee posts)

Do not use employee review sites (e.g. Glassdoor, Indeed) — not part of this workflow's approved source list.

## Step-By-Step Process

**Step 1 - Receive company and role**

* Accept a company name and a specific role/job title.
* If multiple companies or roles are given, split them up and run this workflow separately for each.

**Step 2 - Check for an existing fact file**

* Check `/output/fact-files/` for a file matching this company and role.
* If one exists, tell the user and ask whether to update it or leave it as is, rather than silently overwriting it.

**Step 3 - Full research pass**

* Research all four content sections (Company Overview, Recent News & Culture Signals, Role Requirements, Application Process Steps) using only the approved sources.
* Do this before writing anything — the goal is a finished report on the first write, not a rough pass to be redone later.

**Step 4 - Write the fact file**

* Write the complete report directly to `/output/fact-files/{company}-{role}-fact-file.md` using the structure above.
* Add inline citation markers (`[1]`, `[2]`, ...) next to claims as they're written.
* Build the Application Tailoring Tips section from the research gathered, not from generic advice.
* Add the Sources section at the bottom with the full list of links, numbered to match the inline markers.

**Step 5 - Deliver and revise**

* Tell the user the fact file is ready and where to find it.
* If the user gives feedback, edit the same file in place. Never create a second, near-duplicate file for the same company/role.

## File Naming

* Lowercase, hyphens instead of spaces, no special characters, per workspace file naming rules.
* Pattern: `{company}-{role}-fact-file.md`
* Example: `revolut-software-engineering-apprentice-fact-file.md`
