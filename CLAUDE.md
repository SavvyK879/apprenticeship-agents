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
Archived. companies.json is a stale August 2026 snapshot of the Airtable base, kept only so the
archived /site folder still builds. Airtable is the source of truth. Do not read or write this file.

/site
Archived, not in use. A Next.js site that rendered a public directory from data/companies.json.
See site/ARCHIVED.md.

/personal-tracker
Archived, not in use. A local tool for editing stage and notes outside Airtable.
See personal-tracker/ARCHIVED.md.

When a new top-level folder is created, add it to this list.

# The Tracker Lives in Airtable

The apprenticeship tracker is an Airtable base, read and written through the Airtable MCP tools.
The base and table IDs are in /workflows/airtable-ids.local.md, which is gitignored so they stay
out of this public repository.

A self-hosted replacement was built and then archived in August 2026. Airtable suited the way the
tracker is actually used. Ignore /site and /personal-tracker unless that decision is revisited.
