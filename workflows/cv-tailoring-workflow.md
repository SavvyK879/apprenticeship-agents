# Goal

Given a company that already has a fact file, produce a CV tailored to that company/role, built only from content that already exists in a single master CV.

## Rules

1. Every fact in the tailored CV (employer, dates, grades, skills, achievements) must trace back to something already in `/cv/master-cv.md`. Never invent new experience, skills, or metrics.
2. Reordering, cutting less-relevant bullets, rewording to mirror the company's language, and light inference on emphasis are allowed (e.g. "Python" → "hands-on Python development" if reasonable).
3. Every time phrasing is added or emphasis is inferred beyond what's verbatim in the master CV, list it explicitly for the user when the draft is presented — a short "Inferred/added" callout, not folded silently into the draft.
4. Name, contact info, and education always appear in the tailored CV, regardless of relevance filtering.
5. Every section present in the master CV keeps at least one item in the tailored version. Never trim a section to zero.
6. Target max 2 pages. Enforced at the docx stage (Step 7).
7. Manual trigger only — the user asks per company, any time after that company's fact file exists.
8. This workflow only reads the fact file and master CV. It never writes to them, and never touches the tracker data (`/data/companies.json` or `/data/my-tracker.local.json`).
9. Before the draft is shown to the user, an independent subagent verifies every claim in it traces back to the master CV. Anything it can't verify gets fixed before the user sees it.

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
* Keep a running note of anything added or inferred beyond what's verbatim in the master CV — this becomes the "Inferred/added" list in Step 6.

**Step 5 - Verify against the master CV**

* Dispatch a fresh subagent with no context on how the draft was written. Give it only the tailored draft and `/cv/master-cv.md`.
* Task it with checking every factual claim in the draft (employer, dates, grades, skills, achievements) against the master CV, line by line, and flagging anything that isn't traceable back to it.
* If it flags anything, fix the draft — correct or remove the flagged content — and re-run the check before continuing.
* This check is independent of, not a replacement for, the "Inferred/added" callout: reasonable inference that's disclosed to the user in Step 6 is fine; unverifiable content that goes undisclosed is not.

**Step 6 - Present the draft**

* Present the verified draft to the user along with the explicit "Inferred/added" list from Step 4.

**Step 7 - Review and generate docx**

* User reviews the markdown draft and gives feedback. Edit the same file in place — never create a second, near-duplicate file for the same company.
* Once approved, generate `/output/{company}/{company}-cv.docx` using the docx skill: a clean, simple, ATS-friendly layout, not matched to the user's original Word template.
* Check the generated docx's page count. If it exceeds 2 pages, trim least-relevant bullets first (never the never-cut fields, never a section to zero) and regenerate.

**Step 8 - Deliver**

* Tell the user both files are ready and where to find them.

## File Naming

* `/cv/master-cv.md` — the single master CV, one per user, no company-specific version.
* `/output/{company}/{company}-cv.md` and `/output/{company}/{company}-cv.docx` — lowercase, hyphens instead of spaces, matching the existing `{company}-fact-file.md` convention.
