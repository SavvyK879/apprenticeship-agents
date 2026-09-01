# September Open Date Check

Re-run 2026-09-01 against the Airtable tracker (85 records). First run was 2026-08-31.

16 records carry an Open Date in September 2026. None is confirmed open. September starting has
changed nothing so far.

## Headline finding

12 of the 16 have an Open Date of exactly `2026-09-01`. That is not a published date. It is a
placeholder standing in for "autumn", "September", or nothing at all. Every source that gave a real
answer said the same thing: the 2027 cycle opens across autumn 2026, and most of these employers are
running register-your-interest pages, not live applications.

The tracker stores guesses in a date field with no marker separating them from confirmed dates.
Sorting or filtering by Open Date treats a placeholder and a published date identically.

## Confirmed not open (employer's own site, checked 2026-09-01)

| Company | Evidence |
| --- | --- |
| Goldman Sachs | "Applications for our 2027 Apprenticeships will open Autumn 2026". Sept 2027 start. |
| MBDA | "We are now closed for applications for our September 2026 programme, register your interest ... for our 2027 programme." |
| QinetiQ | Apprentice vacancy board: "we don't have any vacancies in the area you have selected." |
| Barclays | Own job board returns "0 results for apprentice". |

Barclays moved into this table on the re-run. Third-party guides claim a Barclays 2027 intake opens
in September with Technology closing mid-November. Their own board contradicts that today.

## Strong evidence not open (register-interest or autumn opening)

| Company | Evidence |
| --- | --- |
| RSM | 2027 opportunities "go live in autumn"; register interest. Tracker note says "Open: Rolling" — wrong. |
| National Grid | Degree apprenticeships open autumn 2026; taking registrations of interest for 2027 L6. |
| KPMG | Degree apprenticeships open autumn 2026; talent community for 2027. |
| EY | 2027 opening date TBC; talent community. |
| HSBC | 2026 cohort closed 31 Oct 2025. No live 2027 listing found. |
| Shell | Sept 2026 DTS apprenticeship closed 28 Feb 2026. No 2027 listing. |
| Marston Holdings | Software Developer listed as "coming soon". |

An "applications now open" claim for HSBC surfaced in search. It traces to a social post from
October 2024. It is not evidence about today.

## Still unverified

Careers sites are JS-rendered or return 403 to automated fetches. These need a manual look:

* **Deloitte — check this one today.** BrightStart's Autumn 2027 intake is live for at least one
  business area (Enabling Functions, no fixed deadline, rolling close). The Technology stream's last
  confirmed cycle closed 10 Nov 2025 and no 2027 Technology listing surfaced either run. Deloitte
  closes on a rolling basis once enough applications arrive, so a late check costs the application.
  The tracker has it opening 2026-09-28, which may already be late.
* **IBM** — ibm.com blocks fetches. The listing that does surface is register-your-interest, which
  points to not open.
* **Capgemini** — "Apply now" link present but no dates published; runs intakes year round.
* **Mace** — careers site blocks fetches.

## Stantec may be in the tracker wrongly

No Digital & Technology Solutions or software apprenticeship could be found at Stantec on either run.
Their live apprenticeships are Civil Engineer, Mechanical/Electrical Engineer, and Digital Designer
(CAD) — construction and engineering, not software. The Digital Designer role is Level 4 CAD work.

The tracker record says "Digital and Technology Solutions Degree Apprenticeship" with no link. That
role could not be confirmed to exist. This is a role-filter problem, not a date problem, and it
should be re-screened before it is treated as a live target.

## Leeds City Council: closed

The Close Date of 2026-08-31 has passed. The 2026 Level 4 Digital (Software Developer) vacancy was
posted 22 June 2026, with candidates told they would be contacted in August 2026 if shortlisted, so
that cycle ran and closed over the summer. The 2025 equivalent closed 1 September 2025, which is the
same pattern.

Next opening is expected around June 2027 on that pattern. Nothing to do now.

## Other problems found in the data

No research needed, these come from the tracker itself.

* **JP Morgan** — Open Date and Close Date are both 2026-10-01. A zero-day window is a data error.
* **No Open Date at all, 2026 cycle closed, no 2027 date recorded** — Roke, Royal Mail, GCHQ,
  Bank of England, Sellafield, DWP Digital, Thales, Arm, BP, Experian, CGI, Citi, GSK, Frazer-Nash,
  AESSEAL, Vigence, Arup, Neptune North, Sheffield College, DE&S. Invisible to any Open Date sort.

## Recommendation

Add a field distinguishing a confirmed date from an estimate. Date Notes already carries this in
prose ("est. from 2026 cycle", "month only", "exact date TBC") but cannot be filtered on, so the
distinction is lost exactly when it matters.

The autumn window is the one that counts. Most of these employers open between now and November,
several close on a rolling basis, and the tracker cannot currently tell you which dates it actually
knows. Re-check the eleven "not open" entries weekly through to December.
