# CLAUDE.md
This file provides guidance to Claude Code when working in this repository (apprenticeship-agents).

General rules that apply across all of my agent sections (communication style, planning rules, file naming, etc.) live in the CLAUDE.md one level up, at the root of Agent Workspace.

# Goal
This repo runs the agents that find and apply to software/AI engineering apprenticeships:

- Discover apprenticeship listings at target companies (apprenticeship-company-discovery-workflow.md).
- Build a fact file on a specific company and role before applying (company-role-fact-file-workflow.md).
- Tailor the master CV to a specific role (cv-tailoring-workflow.md).
- Coordinate the above end to end (ai-apprenticeship-agent-workflow.md).

# Folder Structure

/workflows
Contains workflow instructions, agent definitions, and process documents.

/output
Contains completed work and generated deliverables.
Anything specific to one company goes in a per-company subfolder, e.g. /output/revolut/.
Create a company folder only when the first file for that company is written. Never pre-create folders for companies with no files yet.

/docs
Contains design documents and specs written before a workflow is built.
Specs live in /docs/superpowers/specs/ and are named topic-design.md.
Implementation plans live in /docs/superpowers/plans/ and are named topic.md.
Neither carries a date in the file name.

/cv
Contains the master CV (master-cv.md), the single source of truth for the user's experience. Tailored per-company versions do not live here - those go in /output/{company}/.

/data
Holds the tracker data. companies.json is the public source of truth (git-tracked),
and agents write to it directly. my-tracker.local.json is the user's private stage/notes
file (gitignored), used only by /personal-tracker.

/site
The public-facing Next.js site. Reads /data/companies.json and /output/{company}/{company}-fact-file.md
at build time. Read-only, with no write path and no personal data.

/personal-tracker
A standalone local tool (not deployed) for editing /data/my-tracker.local.json. Run with
`npm start` inside this folder.

When a new top-level folder is created, add it to this list.
