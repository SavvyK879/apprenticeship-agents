# CV Tailoring Workflow — Design

## Goal

Given a company that already has a fact file, produce a CV tailored to that company/role, built only from content that already exists in a single master CV. Output is a reviewable markdown draft and, once approved, a clean docx.

## Context

This composes with two existing workflows:

- [company-role-fact-file-workflow.md](../../../workflows/company-role-fact-file-workflow.md) — produces `/output/{company}/{company}-fact-file.md`, including an "Application Tailoring Tips" section this workflow consumes directly.
- [ai-apprenticeship-agent-workflow.md](../../../workflows/ai-apprenticeship-agent-workflow.md) — populates the Airtable tracker. This workflow never touches Airtable.

No master CV exists in the repo yet. The user has one as a Word/Google Doc outside the repo. A one-time conversion step brings it in as markdown, which then becomes the permanent source of truth (the user edits it directly as their real experience changes).

## New top-level folder

`/cv/` — holds `master-cv.md`. Add to the Folder Structure list in `CLAUDE.md`.

## Prerequisite: master CV conversion (one-time, manual trigger)

- User provides their existing Word/Google Doc CV content.
- Agent converts it to plain markdown (sections + bullets, mirroring the original structure — no tagging, no metadata).
- Written to `/cv/master-cv.md`.
- Agent asks the user to review before treating it as final. This is a one-time setup step, not part of the per-company workflow, but the per-company workflow depends on this file existing.

## New workflow file

`/workflows/cv-tailoring-workflow.md`, matching the structure of the existing workflow docs (Goal, Rules, Step-By-Step Process, File Naming).

### Rules

1. Every fact in the tailored CV (employer, dates, grades, skills, achievements) must trace back to something already in `/cv/master-cv.md`. Never invent new experience, skills, or metrics.
2. Reordering, cutting less-relevant bullets, rewording to mirror the company's language, and light inference on emphasis are allowed (e.g. "Python" → "hands-on Python development" if reasonable).
3. Every time the agent adds phrasing or infers emphasis not verbatim in the master CV, it must be listed explicitly for the user when the draft is presented — a short "Inferred/added" callout, not folded silently into the draft.
4. Name, contact info, and education always appear in the tailored CV, regardless of relevance filtering.
5. Every section present in the master CV keeps at least one item in the tailored version. Never trim a section to zero.
6. Target max 2 pages. Enforced at the docx stage (see Step 5).
7. Manual trigger only — the user asks per company, any time after that company's fact file exists.
8. This workflow only reads the fact file and master CV. It never writes to them, and never touches the Airtable tracker.

### Step-By-Step Process

**Step 1 — Receive company name**
Accept a company name. If multiple are given, run the workflow separately for each.

**Step 2 — Check prerequisites**
- Check `/output/{company}/{company}-fact-file.md` exists. If not, stop and tell the user to run the fact-file workflow first.
- Check `/cv/master-cv.md` exists. If not, stop and tell the user to do the one-time conversion first.

**Step 3 — Read inputs**
Read the full fact file (especially "Application Tailoring Tips," but also Company Overview, Values, and Role Requirements for context) and the full master CV.

**Step 4 — Produce tailored markdown draft**
- Reorder sections/bullets, cut less-relevant bullets, reword to mirror the company's language, apply light inference where reasonable — per the Rules above.
- Keep name, contact info, and education always present; keep every section non-empty.
- Write to `/output/{company}/{company}-cv.md`.
- Present the draft to the user along with an explicit "Inferred/added" list of anything not verbatim from the master CV.

**Step 5 — Review and generate docx**
- User reviews the markdown draft and gives feedback; edit in place (never a second near-duplicate file), same pattern as the fact-file workflow.
- Once approved, generate `/output/{company}/{company}-cv.docx` using the docx skill — a clean, simple, ATS-friendly layout, not matched to the user's original Word template.
- Check the generated docx's page count. If it exceeds 2 pages, trim least-relevant bullets first (never the never-cut fields, never a section to zero) and regenerate.

**Step 6 — Deliver**
Tell the user both files are ready and where to find them.

## File Naming

- `/cv/master-cv.md` — the single master CV, one per user, no company-specific version.
- `/output/{company}/{company}-cv.md` and `/output/{company}/{company}-cv.docx` — consistent with the existing `{company}-fact-file.md` convention.

## Out of scope

- Cover letters.
- Auto-chaining after the fact-file workflow (this stays a separate, manually-triggered step).
- Matching the user's original Word template styling.
- Tagging/structuring the master CV with keywords or skill metadata.
