# CV Tailoring Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the CV tailoring workflow — a new `/cv/` folder holding a master CV as the source of truth, and a new workflow document (`cv-tailoring-workflow.md`) that tells the agent how to turn that master CV plus an existing company fact file into a tailored `.md` draft and `.docx` per company.

**Architecture:** This is a content/instructions system, not application code — there is no test suite to run. "Verification" for each task means checking the written markdown against the spec's explicit requirements (every rule and step present, correct file paths, correct format matching the existing `company-role-fact-file-workflow.md`) rather than running automated tests. The workflow document itself is the deliverable; it will be *followed* by a future agent run, not executed now.

**Tech Stack:** Markdown files, git. Word-doc generation (Task 4, out of this plan's scope) will use the existing `docx` skill when the workflow is actually run.

**Spec:** [docs/superpowers/specs/cv-tailoring-workflow-design.md](../specs/cv-tailoring-workflow-design.md)

## Global Constraints

- Every fact in a tailored CV must trace back to something already in `/cv/master-cv.md`. Never invent new experience, skills, or metrics.
- Any added phrasing or inferred emphasis not verbatim in the master CV must be called out explicitly to the user when a draft is presented.
- Name, contact info, and education always appear in a tailored CV, regardless of relevance filtering.
- Every section present in the master CV keeps at least one item in a tailored version — never trimmed to zero.
- Target max 2 pages, enforced at the docx generation stage.
- The workflow is manually triggered per company, only after that company's fact file exists at `/output/{company}/{company}-fact-file.md`.
- This workflow only reads the fact file and master CV — it never writes to them and never touches the Airtable tracker.
- File naming: `/cv/master-cv.md`, `/output/{company}/{company}-cv.md`, `/output/{company}/{company}-cv.docx` — lowercase, hyphenated, matching the existing `{company}-fact-file.md` convention.

---

### Task 1: Register the `/cv/` folder in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (Folder Structure section)

**Interfaces:**
- Produces: an entry in CLAUDE.md's Folder Structure section documenting `/cv/`, which Task 2's workflow file and Task 3's master CV both rely on being a recognized, documented location.

- [ ] **Step 1: Add the `/cv/` entry**

Open `CLAUDE.md` and find the `# Folder Structure` section (currently lists `/workflows`, `/output`, `/docs`). Add a new entry immediately after `/docs` and before the "When a new top-level folder is created..." line:

```markdown
/cv
Contains the master CV (master-cv.md), the single source of truth for the user's experience. Tailored per-company versions do not live here — those go in /output/{company}/.
```

- [ ] **Step 2: Verify**

Read the Folder Structure section back and confirm it now lists four folders in order: `/workflows`, `/output`, `/docs`, `/cv`, each with its description intact and unchanged from before except for the new addition.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Document /cv/ folder in CLAUDE.md ahead of CV tailoring workflow"
```

---

### Task 2: Write the CV tailoring workflow document

**Files:**
- Create: `workflows/cv-tailoring-workflow.md`

**Interfaces:**
- Consumes: the folder documented in Task 1 (`/cv/master-cv.md` as a path referenced in this file's own text — the file itself does not need to exist yet for this task, since this task only writes the *instructions*, not the CV).
- Produces: the complete workflow document that a future agent run will follow. No other task in this plan depends on its internal content, but Task 3's manual conversion should follow the same file-naming conventions this document specifies (`/cv/master-cv.md`).

- [ ] **Step 1: Write the workflow file**

Create `workflows/cv-tailoring-workflow.md` with this exact content:

```markdown
# Goal

Given a company that already has a fact file, produce a CV tailored to that company/role, built only from content that already exists in a single master CV.

## Rules

1. Every fact in the tailored CV (employer, dates, grades, skills, achievements) must trace back to something already in `/cv/master-cv.md`. Never invent new experience, skills, or metrics.
2. Reordering, cutting less-relevant bullets, rewording to mirror the company's language, and light inference on emphasis are allowed (e.g. "Python" → "hands-on Python development" if reasonable).
3. Every time phrasing is added or emphasis is inferred beyond what's verbatim in the master CV, list it explicitly for the user when the draft is presented — a short "Inferred/added" callout, not folded silently into the draft.
4. Name, contact info, and education always appear in the tailored CV, regardless of relevance filtering.
5. Every section present in the master CV keeps at least one item in the tailored version. Never trim a section to zero.
6. Target max 2 pages. Enforced at the docx stage (Step 5).
7. Manual trigger only — the user asks per company, any time after that company's fact file exists.
8. This workflow only reads the fact file and master CV. It never writes to them, and never touches the Airtable tracker.

## Step-By-Step Process

**Step 1 - Receive company name**

* Accept a company name. If multiple are given, run this workflow separately for each.

**Step 2 - Check prerequisites**

* Check `/output/{company}/{company}-fact-file.md` exists. If not, stop and tell the user to run the fact-file workflow first.
* Check `/cv/master-cv.md` exists. If not, don't stop — ask the user to paste or attach their current CV, then do the one-time conversion inline: transcribe it faithfully into markdown (same structure as the source, no rewording, no tagging), present it for review, and save it to `/cv/master-cv.md` once approved. Then continue with Step 3.

**Step 3 - Read inputs**

* Read the full fact file — especially the "Application Tailoring Tips" section, but also Company Overview, Values, and Role Requirements for context.
* Read the full master CV.

**Step 4 - Produce tailored markdown draft**

* Reorder sections/bullets, cut less-relevant bullets, reword to mirror the company's language, and apply light inference where reasonable — per the Rules above.
* Keep name, contact info, and education always present. Keep every section non-empty.
* Write the result to `/output/{company}/{company}-cv.md`.
* Present the draft to the user along with an explicit "Inferred/added" list of anything not verbatim from the master CV.

**Step 5 - Review and generate docx**

* User reviews the markdown draft and gives feedback. Edit the same file in place — never create a second, near-duplicate file for the same company.
* Once approved, generate `/output/{company}/{company}-cv.docx` using the docx skill: a clean, simple, ATS-friendly layout, not matched to the user's original Word template.
* Check the generated docx's page count. If it exceeds 2 pages, trim least-relevant bullets first (never the never-cut fields, never a section to zero) and regenerate.

**Step 6 - Deliver**

* Tell the user both files are ready and where to find them.

## File Naming

* `/cv/master-cv.md` — the single master CV, one per user, no company-specific version.
* `/output/{company}/{company}-cv.md` and `/output/{company}/{company}-cv.docx` — lowercase, hyphens instead of spaces, matching the existing `{company}-fact-file.md` convention.
```

- [ ] **Step 2: Verify against the spec**

Check off each of these against the file you just wrote — all eight must be true:

1. All 8 numbered rules from the spec's "Rules" section are present and unchanged in meaning.
2. All 6 steps from the spec's "Step-By-Step Process" are present in the same order.
3. File paths match the spec exactly: `/cv/master-cv.md`, `/output/{company}/{company}-fact-file.md`, `/output/{company}/{company}-cv.md`, `/output/{company}/{company}-cv.docx`.
4. The document's overall shape (Goal → Rules → Step-By-Step Process → File Naming) matches `workflows/company-role-fact-file-workflow.md`'s structure.
5. No placeholder text (no "TBD", no "TODO", no "similar to fact-file workflow" without spelling it out).

If any check fails, fix the file directly and re-check.

- [ ] **Step 3: Commit**

```bash
git add workflows/cv-tailoring-workflow.md
git commit -m "Add CV tailoring workflow"
```

---

### Task 3: Convert the master CV to markdown (blocked on user-supplied content)

**Files:**
- Create: `cv/master-cv.md`

**Interfaces:**
- Consumes: the folder convention from Task 1 and the path (`/cv/master-cv.md`) referenced throughout Task 2's workflow document.
- Produces: the actual master CV content that every future run of `cv-tailoring-workflow.md` (Task 2) reads from. Nothing in this plan depends on this task's content, but the CV tailoring workflow is non-functional until this file exists.

**This task cannot be completed without the user's actual CV.** Do not invent, template, or placeholder-fill CV content — that would violate Global Constraint 1 the moment the workflow tries to use it.

- [ ] **Step 1: Request the CV content**

Ask the user to paste their current CV text, or attach/upload the Word or Google Doc file, in chat.

- [ ] **Step 2: Convert to markdown**

Once received, transcribe it into plain markdown: section headings matching the original CV's own section names (e.g. Education, Experience, Skills, Extracurriculars — whatever the user's actual CV uses), bullets under each, in the same order as the source document. No tagging, no metadata, no rewording — this is a faithful transcription, not a tailoring pass. Preserve every fact exactly: employer names, dates, grades, and figures must match the source document verbatim.

- [ ] **Step 3: Present for review**

Show the converted markdown to the user and ask them to confirm it's accurate and complete before treating it as final — this file becomes the single source of truth every future tailored CV is built from, so errors here propagate everywhere.

- [ ] **Step 4: Save and commit**

Once the user confirms, write the final version to `cv/master-cv.md`.

```bash
git add cv/master-cv.md
git commit -m "Add master CV as source of truth for CV tailoring workflow"
```

---

## Out of Scope (per spec)

- Cover letters.
- Auto-chaining CV tailoring after the fact-file workflow.
- Matching the user's original Word template styling in generated docx files.
- Tagging/structuring the master CV with keywords or skill metadata.
