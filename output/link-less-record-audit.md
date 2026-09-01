# Link-less Record Audit

Audited 2026-09-01. 34 of the 85 tracker records have an empty Link field. Every one of them was
created on 2026-08-11. Every record added in the later batches (14 and 25 August) has a link.

The 11 August seed batch was written without verified sources, and it shows. Four roles could not be
confirmed to exist at all, one is recorded under a name the employer does not use, one has the wrong
level, and several name a programme whose wrong pathway would fail the role filter.

## Roles that could not be confirmed to exist

| Company | Tracker role | What the employer actually runs |
| --- | --- | --- |
| Stantec | Digital and Technology Solutions Degree Apprenticeship | Civil Engineer, Mechanical/Electrical Engineer, Level 4 Digital Designer (CAD). No DTS or software route found. |
| Mace | Digital and Technology Solutions Degree Apprenticeship (Level 6) | Apprenticeships in project management and construction engineering. No DTS route found. |
| Mondelez | Digital & Technology Solutions Degree Apprenticeship | Sales, R&D and Supply Chain apprenticeships. The nearest match is a People (HR) Technology Solutions degree apprenticeship, which is HR, not software. |
| Marston Holdings | Digital Apprentice | Software Developer is listed as "coming soon". "Digital Apprentice" does not correspond to a named programme. |

These four should be re-screened against the role filter before they are treated as targets. Three of
the four are construction, engineering or FMCG employers, which is where this failure concentrates.

## Recorded wrongly, real programme underneath

**Shell** — tracker says "Digital Leadership Accelerator Programme". No Shell programme by that name
could be found. Shell's actual route is the **Digital and Technology Solutions Degree Apprenticeship**:
BSc (Hons) DTS Professional, London, 2.5 years, placing apprentices as Software Engineer, Data Analyst
or IT Operations Analyst. Strong match under the right name, invisible under the recorded one.

**Deutsche Bank** — tracker says Level 4. The TDI Apprenticeship awards a BSc (Hons) Digital and
Technology Solutions from the University of Exeter, so it is Level 6. It also requires a British or EU
passport and three years' EU residency, which is not recorded anywhere.

## Right employer, wrong pathway risk

These name a real programme, but the employer runs several pathways under it and the tracker does not
say which. Picking the wrong one fails the role filter, which excludes network engineering and cyber.

| Company | Pathways offered | Problem |
| --- | --- | --- |
| JLR | Software Engineering, Software with Data, Data Analytics, Cyber Security | Record says only "Level 6 DTS". Cyber fails the filter. |
| BAE Systems | Software Engineering, Data Analysis, Business Analysis, Cyber Security | Record names no pathway. Two of the four fail. |
| Rolls-Royce | DTS Derby (BSc Software Engineering, Univ of Derby) | Also runs a separate Software Engineering Degree Apprenticeship (Derby/Solihull) that is a closer match than the one recorded. |
| Thames Water | Digital IT Apprentice, Level 6 DTS Professional | Sits in the Operational Technology team maintaining communication networks. That reads as network engineering, which the filter excludes. |

## Eligibility blockers not recorded

**JP Morgan** — the record says "London/Bournemouth". Software engineering is the **London** stream.
Bournemouth offers cybersecurity, infrastructure engineering and IT consultancy/project management,
all of which fail the role filter. JP Morgan's Glasgow route is a Scottish Graduate Apprenticeship
requiring 4 Bs at Scottish Highers — the exact disqualifier named in the workflow's qualification rule.

**BBC** — the Software Engineering Degree Apprenticeship (Level 6) is real, with listings at Glasgow,
Bristol and Salford. One route's academic element is delivered by a Scottish university and is
restricted to candidates resident in Scotland. The right listing needs picking deliberately.

## Time-critical

**JBA Consulting** is the strongest match in the whole batch — Level 6 DTS Software Engineer pathway,
Skipton, Peterborough and Wallingford, studying with Nottingham Trent or QA/Roehampton, building
software for asset management, hydrological modelling and geospatial data.

Its stated application window was **by the end of August 2026**. That has passed. The tracker has it
opening 2026-11-01 and closing 2027-03-03, which is wrong in both directions. Worth contacting them
directly to ask whether the window is genuinely shut.

## Confirmed real and correctly described

Goldman Sachs, Barclays, HSBC, Deloitte, RSM, IBM, Capgemini, KPMG, EY, National Grid, MBDA, Amazon,
TfL, Airbus, Network Rail, E.ON, Bentley, AtkinsRéalis, Apple, Google, Bank of America.

Strongest of these on role match: E.ON (BSc DTS software engineering, Nottingham Trent), Amazon (DTS
Software Pathway, 48 months, London), Apple (Level 4 Software Engineering with Makers, London, £35k),
AtkinsRéalis (L6 DTS Professional, Software Engineer pathway).

Minor corrections: Bank of America is Bromley only, not "Bromley / Chester". Barclays is the
Northampton campus, not "Hybrid". E.ON is Nottingham; Coventry unconfirmed. Stantec and Capgemini have
no location recorded at all.

## What this means for the tracker

The link field is not cosmetic. It is the difference between a record that can be re-verified and one
that cannot. Every unverifiable record in the tracker comes from a single seeding run, and roughly one
in eight of them does not survive contact with the employer's careers page.

Two changes worth making:

1. Treat a missing Link as a blocking defect, not a gap. A record with no link has not been verified.
2. Record the pathway, not just the programme. "Level 6 DTS" is not specific enough when the employer
   runs a cyber pathway under the same name.
