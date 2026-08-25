# Apprenticeship Agents

A set of AI agent workflows for finding and applying to UK software and AI engineering
apprenticeships. Built for my own search, shared in case it saves someone else the same work.

These are not scripts you run. They are instruction files written for a coding agent such as Claude
Code. You point the agent at a workflow, give it a company name, and it does the research and the
writing.

## The tracker

The apprenticeships these workflows have found so far are viewable here, read only:

**https://airtable.com/appGa8FIDwREZf4Vr/shrV40PTrr4Zpzj1y**

Around 78 UK software and AI engineering apprenticeships, with role, location, length, training
provider, grades, salary, opening and closing dates, and a link to each listing. It is a live view,
so it updates as the workflows add to it.

Check any deadline against the employer's own page before relying on it. Dates change, listings get
pulled, and some entries are estimated from a previous cycle rather than published for this one. The
Date Notes column says which is which.

## What each workflow does

**`workflows/apprenticeship-company-discovery-workflow.md`**
Finds companies running apprenticeships that fit. Searches listing sites and the open web, screens
each one against the role filter, and hands the ones that pass to the tracker workflow. Keeps a
cache so it does not rescreen the same companies every run.

**`workflows/ai-apprenticeship-agent-workflow.md`**
Takes a company name, researches the scheme, and adds a row to the tracker: role, location, length,
training provider, grades, salary, opening and closing dates, and the listing link. Dates get the
most attention, because a missed deadline is the failure mode that actually costs you a place.

**`workflows/company-role-fact-file-workflow.md`**
Produces a researched fact file on one company: what they do, what they value, recent news, the role
requirements, the application stages, and concrete tailoring tips. Every claim carries a citation.
Anything it cannot source is either flagged as opinion or left out.

**`workflows/cv-tailoring-workflow.md`**
Rewrites a master CV for one company, using only content that already exists in the master. It
reorders, cuts and rewords, but never invents experience. A separate agent checks every claim traces
back to the master CV before you see the draft.

## The role filter

The workflows screen for Level 6 Digital and Technology Solutions apprenticeships, preferring the
software engineering pathway, and fall back to Level 4 software or AI apprenticeships. They skip
network engineering and cybersecurity.

They also skip anything requiring qualifications an England based A level student cannot hold, such
as Scottish Graduate Apprenticeships that need Highers. That is not a grades filter. High grade
requirements are fine, unobtainable qualifications are not.

If your situation differs, that logic is in Step 3 of `ai-apprenticeship-agent-workflow.md` and in
the discovery workflow. Change both, they are meant to stay identical.

## Using this for your own search

The tracker lives in Airtable. To point these at your own base:

1. Duplicate or build a base with the fields listed in the Table Schema section of
   `workflows/ai-apprenticeship-agent-workflow.md`. Field names and types need to match.
2. Create `workflows/airtable-ids.local.md` with your own IDs:

   ```markdown
   * Base: "Apprenticeship Tracker" — appXXXXXXXXXXXXXX
   * Table: "Table 1" — tblXXXXXXXXXXXXXX
   * Attachments field — fldXXXXXXXXXXXXXX
   ```

   That file is gitignored, so your IDs stay out of git. You can read all three from the Airtable
   URL when the base is open in a browser.
3. Connect the Airtable MCP server to your agent.
4. Put your CV at `cv/master-cv.md` before using the CV tailoring workflow. That path is gitignored,
   as are any tailored CVs it generates, so nothing personal is committed.

## What is in this repo

```
workflows/   the four agent workflows
output/      generated work, one folder per company, plus the discovery search log
docs/        design notes written before each workflow was built
CLAUDE.md    project rules the agent reads on every run
```

`output/apprenticeship-search-log.md` is the discovery cache. It records which companies were
screened, which were rejected and why, and which are worth revisiting later. Useful on its own if
you want to skip some dead ends.

## A note on what is not here

`docs/superpowers/` includes the design for a self hosted replacement for Airtable, a public
directory site plus a local progress tracker. It was built in August 2026 and then removed. Airtable
already did the job better for daily use, especially on a phone. The notes are kept because the
reasoning may be useful, but the code is gone. It is recoverable from git history if anyone wants it.

## Caveats

Everything here is written for one person's search, so it carries my assumptions: England based,
A levels, software and AI roles, 2026 and 2027 intakes. Read a workflow before running it rather
than trusting it blindly, and check anything an agent writes about a deadline against the employer's
own page. Agents get dates wrong, and a wrong date is worse than no date.
