# September Open Date Check

Checked 2026-08-31 against the Airtable tracker (85 records).

16 records carry an Open Date in September 2026. Not one of them is confirmed open today.

## Headline finding

12 of the 16 have an Open Date of exactly `2026-09-01`. That is not a published date. It is a
placeholder standing in for "autumn", "September", or nothing at all. Every source checked that
gave a real answer said the same thing: the 2027 cycle opens across autumn 2026, and most of these
employers are currently running register-your-interest pages, not live applications.

The tracker is presenting guesses in a date field with no marker distinguishing them from
confirmed dates. Sorting or filtering by Open Date treats a placeholder and a published date
identically.

## Confirmed not open (employer's own site)

| Company | Evidence |
| --- | --- |
| Goldman Sachs | "Applications for our 2027 Apprenticeships will open Autumn 2026". Sept 2027 start. |
| MBDA | "We are now closed for applications for our September 2026 programme, register your interest ... for our 2027 programme." |
| QinetiQ | Apprentice vacancy board: "we don't have any vacancies in the area you have selected." |

## Strong evidence not open (register-interest or autumn opening)

| Company | Evidence |
| --- | --- |
| RSM | 2027 opportunities "go live in autumn"; register interest. Tracker note says "Open: Rolling" — that is wrong. |
| National Grid | Degree apprenticeships open autumn 2026; taking registrations of interest for 2027 L6. |
| KPMG | Degree apprenticeships open autumn 2026; talent community for 2027. |
| EY | 2027 opening date TBC; talent community. |
| HSBC | 2026 cohort closed 31 Oct 2025. Register interest for the next window. |
| Shell | Sept 2026 DTS apprenticeship closed 28 Feb 2026. No 2027 listing found. |
| Marston Holdings | Software Developer listed as "coming soon" on their apprenticeships page. |

## Not verifiable remotely

Careers sites are JS-rendered or return 403 to automated fetches. These need a manual look:

Barclays, IBM, Capgemini, Deloitte, Stantec, Mace.

**Deloitte is the priority.** Evidence is genuinely mixed and it is the one plausibly open right now:
its BrightStart 2027 intake appears live for other business areas (Enabling Functions, Autumn 2027,
rolling close), while the Technology stream's last confirmed cycle closed 10 Nov 2025 and no 2027
Technology listing surfaced. Deloitte closes on a rolling basis once enough applications arrive, so
a late check costs the application. The tracker has it opening 2026-09-28, which may already be late.

## Separate problems found in the data

These come from the tracker itself, no research needed.

* **Leeds City Council** — Close Date 2026-08-31. Closes today. Record note already flagged
  "check now, a 2026 cycle may be live" and nobody did.
* **JP Morgan** — Open Date and Close Date are both 2026-10-01. A zero-day window is a data error.
* **No Open Date at all, 2026 cycle closed, no 2027 date recorded** — Roke, Royal Mail, GCHQ,
  Bank of England, Bank of England, Sellafield, DWP Digital, Thales, Arm, BP, Experian, CGI, Citi,
  GSK, Frazer-Nash, AESSEAL, Vigence, Arup, Neptune North, Sheffield College, DE&S.
  These are invisible to any Open Date sort.

## Recommendation

Add a field distinguishing a confirmed date from an estimate. The Date Notes field already carries
this information in prose ("est. from 2026 cycle", "month only", "exact date TBC") but it cannot be
filtered on, so the distinction is lost exactly when it matters.
