# Apprenticeship Company Discovery Workflow Implementation Plan

> **Status, 2026-08-14:** Task 1 done. The workflow exists at
> `/workflows/apprenticeship-company-discovery-workflow.md` and passes the Step 6 constraint
> checklist. Tasks 2 and 3 were skipped by choice, so the workflow has not been checked line by
> line against the spec and has never been run. Do Task 3 before trusting it on a real search.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write the agent instruction document that finds companies offering suitable apprenticeships and feeds them into the existing tracker workflow.

**Architecture:** One markdown instruction file in `/workflows`, following the shape of the two workflows already there. It reads and writes a local markdown cache at `/output/apprenticeship-search-log.md` so it can avoid re-reading Airtable, and it hands off by invoking `ai-apprenticeship-agent-workflow.md` directly.

**Tech Stack:** Markdown instruction documents. Web search for discovery. Airtable MCP for the one-off cache seed and for the tracker handoff.

## Global Constraints

Copied from the spec and from CLAUDE.md. Every task must respect these.

* Spec of record: `docs/superpowers/specs/apprenticeship-company-discovery-design.md`.
* File naming: lowercase, hyphens instead of spaces, no special characters.
* Workflow file path: `/workflows/apprenticeship-company-discovery-workflow.md`.
* Cache file path: `/output/apprenticeship-search-log.md`.
* Tracker base: "Apprenticeship Tracker" `appGa8FIDwREZf4Vr`, table "Table 1" `tblNtjoCUrKBM9g3Y`.
* Role filter wording must match `ai-apprenticeship-agent-workflow.md` Step 3 exactly: level 6 Digital Technology Solutions aligned to Software Engineer, else level 4 in software engineering, AI engineering or similar, never network engineering or cybersecurity.
* Default quota: 10. Stop rule: give up after screening 3x the quota.
* Rejections expire after one month. Anything rejected a month or more ago gets screened again.
* Revisit rows are binding until their Revisit from date, then the company is screened again.
* No em dashes anywhere in written output.
* No filler. Short, direct instructions, matching the tone of the existing two workflow files.

---

### Task 1: Write the workflow document

**Files:**
- Create: `workflows/apprenticeship-company-discovery-workflow.md`
- Read first: `workflows/ai-apprenticeship-agent-workflow.md` (tone, structure, the role filter wording to copy)
- Read first: `docs/superpowers/specs/apprenticeship-company-discovery-design.md` (source of truth)

**Interfaces:**
- Consumes: nothing. This is the first task.
- Produces: the workflow file that Tasks 2 and 3 review and test. Section headings produced here and relied on later: `# Goal`, `## Rules`, `## The Cache File`, `## Step-By-Step Process`, `## Manual Overrides`, `## File Naming`.

- [ ] **Step 1: Read the two reference files**

Read `workflows/ai-apprenticeship-agent-workflow.md` end to end, then the spec. Match the existing file's structure: `# Goal`, `## Rules` as a numbered list, then `## Step-By-Step Process` with bold `**Step N - Name**` headings and bullet points underneath.

- [ ] **Step 2: Write the Goal and Rules sections**

Goal is two or three sentences: find companies offering apprenticeships that suit me and feed them into the tracker, sitting in front of `ai-apprenticeship-agent-workflow.md`.

Rules, as a numbered list:
1. Never fabricate companies, roles, dates or links.
2. A company only qualifies if a real, findable listing or scheme page exists.
3. The role filter must stay identical to `ai-apprenticeship-agent-workflow.md`. If one changes, change both.
4. Do not read Airtable except to seed the cache or when a re-sync is asked for.
5. Keep entries in the cache short. A few words, not sentences.

- [ ] **Step 3: Write the Cache File section**

State the path `/output/apprenticeship-search-log.md` and give both tables with these exact columns:

```markdown
## In Tracker

| Company | Role | Date added |
| --- | --- | --- |

## Revisit

| Company | Role | Date checked | Why it was pulled | Revisit from |
| --- | --- | --- | --- | --- |

## Rejected

| Company | Date checked | Reason |
| --- | --- | --- |
```

Then state the rules that govern it:
* If the file does not exist, do one full Airtable read of the Company and Role fields to build the In Tracker table, say that this was done, and do not read Airtable again unless asked.
* Append to In Tracker immediately after each successful Airtable write. This is what allows the cache to be trusted without re-reading Airtable.
* A Rejected row is only binding for a month from its Date checked. Once it is a month or more old, screen the company again and overwrite the row with the new date and reason. Never let the Rejected table become a permanent blocklist.
* A Revisit row is binding until its Revisit from date. On or after that date, screen the company again and delete the Revisit row. Revisit is for a company that passes the role filter but whose timing is wrong, not for one that failed. It keeps the role and enough detail to rebuild an Airtable row.
* Dates are written `YYYY-MM-DD`.

- [ ] **Step 4: Write the Step-By-Step Process section**

Eight steps, in this order, using the `**Step N - Name**` heading style:

1. **Receive a quota.** A number of new companies to find. Default 10 if not given.
2. **Load the cache.** Seed it from Airtable if the file is missing, per the Cache File section.
3. **Discover candidates.** Two sources: the listing sites GOV.UK Find an Apprenticeship, RateMyApprenticeship, UCAS and Not Going To Uni, plus open web search for employers running schemes on their own careers pages. No location, sector, size or grade filter. Collect names into a working list.
4. **Screen each candidate.** Skip with no research if the company is in In Tracker, in Revisit with a Revisit from date still in the future, or in Rejected with a Date checked less than a month old. Everything else gets screened, including rejections a month or more old and Revisit rows whose date has arrived. Apply the role filter copied verbatim from the tracker workflow. Passes go to the shortlist with role and link, preferring the company's own page over a job board. Fails go to the Rejected table with a one line reason and today's date, overwriting any existing row for that company. Delete a Revisit row once its company has been screened again.
5. **Repeat until the quota of new qualifying companies is met.** Duplicates and rejections do not count towards it.
6. **Stop rule.** If 3x the quota has been screened without filling it, stop and report what was found.
7. **Print the shortlist in chat.** Company, Role, Link. No file is written for the shortlist.
8. **Run the tracker workflow for each shortlisted company,** one at a time, with no pause for approval. After each successful Airtable write, append the company to the In Tracker table. Finish with counts: added, skipped as duplicates, rejected.

- [ ] **Step 5: Write the Manual Overrides and File Naming sections**

Manual Overrides, three bullets:
* Re-sync the cache: one full Airtable read rebuilds In Tracker. Never touches Revisit or Rejected.
* Naming a company directly forces a re-check even if it was rejected within the last month or is in Revisit with a future date.
* Parking a company moves it from the tracker into Revisit with a date to come back on. Write its details into the Revisit entry before deleting the Airtable row, so the row can be rebuilt.

File Naming: one line pointing at the workspace rules in CLAUDE.md, plus the two fixed paths.

- [ ] **Step 6: Check the constraints before committing**

Run this checklist against the file you just wrote:
* No em dashes. Search the file for the character.
* The role filter wording matches `ai-apprenticeship-agent-workflow.md` Step 3.
* All three cache table column sets match Step 3 above exactly.
* The quota default is 10 and the stop rule is 3x.
* Rejections expire after one month, and the Rejected row is overwritten on a re-screen.
* Revisit rows are skipped until their date, then re-screened and deleted. Revisit is distinct from Rejected: right role, wrong timing.
* No sentence longer than it needs to be.

- [ ] **Step 7: Commit**

```bash
git add workflows/apprenticeship-company-discovery-workflow.md
git commit -m "Add apprenticeship company discovery workflow"
```

---

### Task 2: Check it against the spec and the tracker workflow

**Files:**
- Modify: `workflows/apprenticeship-company-discovery-workflow.md`
- Read: `docs/superpowers/specs/apprenticeship-company-discovery-design.md`
- Read: `workflows/ai-apprenticeship-agent-workflow.md`

**Interfaces:**
- Consumes: the workflow file from Task 1, including its section headings.
- Produces: the same file, corrected. Task 3 tests whatever this task signs off.

- [ ] **Step 1: Walk the spec line by line**

For each row in the spec's Decisions table and each numbered item in its "How a run works" section, find the sentence in the workflow file that implements it. Write the list of anything with no match.

- [ ] **Step 2: Check the two handoff points**

The workflow hands off in two directions, and both are places where a mismatch silently wastes work:
* Anything passing the role filter here must be accepted by `ai-apprenticeship-agent-workflow.md` Step 3. If this file's filter is looser, the tracker agent will reject companies this one promised.
* The tracker workflow's own Step 2 duplicate check still runs. Confirm the discovery file does not claim that check is skipped.

- [ ] **Step 3: Fix any gaps inline**

Edit the workflow file directly. Do not write a second file.

- [ ] **Step 4: Commit**

```bash
git add workflows/apprenticeship-company-discovery-workflow.md
git commit -m "Align discovery workflow with spec and tracker handoff"
```

---

### Task 3: Dry run it

**Files:**
- Modify: `workflows/apprenticeship-company-discovery-workflow.md` (only if the dry run exposes unclear instructions)
- Modify: `CLAUDE.md` (add plans to the /docs entry)

**Interfaces:**
- Consumes: the finished workflow file from Task 2.
- Produces: nothing downstream. This is the last task.

- [ ] **Step 1: Run the workflow with a quota of 3, writing nothing**

Follow the file as written, literally, as though you had never seen this plan. Do the discovery and the screening for real. Stop before Step 8. Do not write to Airtable and do not create the cache file.

- [ ] **Step 2: Record where the instructions were ambiguous**

Note every point where you had to guess, invent a rule, or re-read a step to understand it. Ambiguity found here is the actual output of this task. If nothing was ambiguous, say so plainly rather than inventing findings.

- [ ] **Step 3: Fix the ambiguities**

Edit the workflow file. Prefer deleting a confusing sentence over adding an explaining one.

- [ ] **Step 4: Register plans in CLAUDE.md**

The `/docs` entry currently mentions specs only. Add that plans live in `/docs/superpowers/plans/` and are named `topic.md`, no date, matching the spec naming rule.

- [ ] **Step 5: Report the dry run result to the user**

Tell them the quota of 3 result: which companies passed, which were rejected and why. This is the evidence the workflow works. Do not claim it works without showing this.

- [ ] **Step 6: Commit and push**

```bash
git add workflows/apprenticeship-company-discovery-workflow.md CLAUDE.md
git commit -m "Fix ambiguities found in discovery workflow dry run"
git push origin main
```
