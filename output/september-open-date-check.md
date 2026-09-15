# September Open Date Check

Re-run 2026-09-01 against the Airtable tracker (85 records). First run was 2026-08-31.

> **Correction added 2026-09-14 — Barclays opened on 9 September.** The "Barclays | Own job board
> returns 0 results for apprentice" line below was accurate on 1 September and is now stale. The
> 2027 Technology Developer Degree Apprenticeship (Northampton, Pavilion Drive) posted on
> **9 September 2026** and **closes 25 September 2026**. The third-party guides flagged as
> "unconfirmed by Barclays" in this document turned out to be roughly right about a September
> opening, though the close is September rather than mid-November.
> This is the one finding in this document known to have changed. The rest has not been re-checked
> since 1 September, so treat the other rows as a 1 September snapshot, not as current.

> ## Re-check run 2026-09-15 — full sweep
>
> Every company below was re-checked against employer sites, job boards and the Government's Find an
> Apprenticeship service. **Two things are open. Nothing else is.**
>
> | Company | Status on 2026-09-15 | Close |
> | --- | --- | --- |
> | **Barclays** | **OPEN** — 2027 Technology Developer, Northampton | **25 Sept 2026** |
> | **American Express** | **OPEN** — Technology Software Engineering, Burgess Hill 2027 (req 25022282) | **9 Oct 2026** |
> | Deloitte | **Closed.** BrightStart Technology 2026 listing now reads "no longer available". No 2027 listing posted. | — |
> | Goldman Sachs | Not open. 2027 opens Autumn 2026. Warns it closes early once enough candidates apply. | — |
> | HSBC | Not open. 2027 Degree Apprenticeship listed with opening date TBC. | — |
> | EY | Not open. Sept 2026 intake closed 24 April 2026; says it will reopen "later this year". | — |
> | KPMG | Not open. Sept 2026 intake closed 24 April 2026. | — |
> | MBDA | Not open. Closed for Sept 2026; register interest for 2027. | — |
> | QinetiQ | No 2027 listing surfaced. | — |
> | Capgemini | No 2027 listing surfaced. | — |
> | RSM | No 2027 listing surfaced. | — |
> | National Grid | **Unverified.** Careers board returns nothing to automated fetch. Needs a manual look. | — |
> | IBM | Not open. DTS cycle expected around Feb 2027. The Full Stack listing Savya saw has closed. | — |
>
> **Cross-check:** the Government's Find an Apprenticeship service returns **0 results** for Level 6 Digital
> software engineering vacancies, which supports the conclusion that nothing else is live right now.
>
> **The Deloitte worry from 1 September is resolved.** It was flagged as a rolling close that might already be
> late. The 2026 listing has since closed outright and no 2027 listing exists yet, so nothing was missed.


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
