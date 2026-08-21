# Goal

The goal is to build up my apprenticeship tracker in preparation for the next academic year when apprenticeships begin to open applications.

## Rules

1. Never fabricate statistics, quotes, or sources.
2. Do not produce content that is misleading, harmful, or off-brief.
3. Information added to the table should be short and concise. Do not use full sentences when a few words will suffice.
4. Never add a new field to a companies.json entry. Work only with the fields listed below.

## Where The Tracker Lives

The tracker is `/data/companies.json`, a git-tracked JSON array, not Airtable or a spreadsheet.

Read and write it directly as a file. Each entry has: id, company, role, location, length,
trainingProvider, grades, salary, openDate, closeDate, dateNotes, link. Attachments and
stage tracking are not stored here: fact file presence is detected automatically at build
time, and stage tracking lives in the user's private, gitignored `/data/my-tracker.local.json`,
which this workflow never touches.

## Table Schema

Fields in the JSON entries, in order. Match them exactly when writing.

| Field | Type | Who fills it |
| --- | --- | --- |
| id | string | Agent |
| company | string | Agent |
| role | string | Agent |
| location | string | Agent |
| length | string | Agent |
| trainingProvider | string | Agent |
| grades | string | Agent |
| salary | string | Agent |
| openDate | date string | Agent |
| closeDate | date string | Agent |
| dateNotes | string | Agent |
| link | URL string | Agent |

The `id` field is a hyphenated slug derived from the company name. Generate it by: (1) lowercase the name, (2) strip accents, (3) drop `&`, (4) remove non-letter/digit/space characters, (5) collapse spaces to single hyphens. Examples: `Legal & General` becomes `legal-general`; `E.ON` becomes `eon`. This slug is used as the folder name in `/output/{id}/` for the company's fact file.

openDate and closeDate are written as `YYYY-MM-DD` strings in the JSON.

There are no separate day or month fields. All date detail lives in openDate, closeDate and dateNotes.

## Step-By-Step Process

**Step 1 - Receive name of company/companies**

* Accept any company name.
* If multiple company names are given, split them up and carry out the workflow for each company separately.

**Step 2 - Check tracker**

* Search `/data/companies.json` for an entry whose `company` field matches.
* If an entry already exists for that company, skip it. Do not create a duplicate.

**Step 3 - Initial details**

* Research whether the company offers a level 6 Digital Technology Solutions apprenticeship. If they have multiple options, choose the one most aligned to the role of a Software Engineer. Do not include network engineering or cybersecurity apprenticeships.
* If no level 6 role exists, check whether the company offers a level 4 apprenticeship in software engineering, AI engineering, or similar.
* If neither exists, skip this company entirely. Do not create an entry for it.
* Then apply the qualification rule. I am studying A levels in England, so a role fails if its entry requirements are qualifications I cannot hold, whatever its level or title. The clearest case is a Scottish Graduate Apprenticeship, which requires Scottish Highers. This is not a grades filter: do not skip a role for asking high grades or a specific subject, only for a qualification that is unobtainable for an England-based A level student. Skip the company and say which qualification was the blocker.
* Otherwise, append a new entry to `/data/companies.json` and populate:
  * id with the lowercase hyphenated slug of the company name.
  * company and role with what you found.
  * link with the URL of the apprenticeship listing or application page. Use the company's own page over a job board where possible.

**Step 4 - Date details**

Dates are the most important fields in this tracker. Everything else describes a scheme; the
dates are what stop me missing it. Treat them as the priority of the whole run, not as one
field among ten. A blank openDate or closeDate should be rare and must be earned, meaning
you searched properly and the information genuinely does not exist anywhere.

Do this separately for the opening date and the closing date. Give each its own dedicated
search. Do not rely on one combined search that also covers salary and location, because
dates get buried in those results.

* Check the company website and the apprenticeship listing first for a published date.
* If not published there, search specifically for that date. Try the company's early careers
  page, the listing on GOV.UK Find an Apprenticeship, and aggregators such as Gradcracker,
  Bright Network, RateMyApprenticeship and Prosple. Aggregator listings usually state a
  closing date even when the employer's own page does not.
* If the current cycle is not published, use a past cycle. This is required, not optional.
  Last year's listing for the same scheme is good evidence. Take its day and month, apply the
  year rule below, and say in dateNotes which cycle it came from.
* If last year's exact listing is gone, a documented pattern still counts. Examples: "recruits
  Jan to May", "applications open in October", "closes once filled". Use it and label it.
* Only leave a date blank after all of the above fail. When you do, dateNotes must say what
  you looked for and why it is empty, for example "Close: not published, 2026 listing removed".
* Never fabricate a date. Only enter one if there's reasonable evidence for it. An estimate
  clearly labelled in Date Notes is not fabrication. A guessed date with no basis is.

Writing the fields:

openDate and closeDate are real date fields used to sort and filter by what opens or closes next. Always populate them when you know the month.

* Write them as `YYYY-MM-DD`.
* If you have an exact day and month, combine them into that date.
* If you only have a month, or the real answer is a qualifier like "Rolling", "approx" or "varies", or a range like "12th-18th", use the 1st of that month and record the original wording in dateNotes. The imprecision must not be lost.
* For the year: use today's date and pick the next occurrence of that month and day on or after today. If the resulting date would be in the past, use next year.
* If the month itself is unknown, leave that date field empty. Do not guess a year. Reaching
  this point should be the exception, not the habit.
* If you can't find any date information at all, leave openDate and closeDate empty and say
  so explicitly in dateNotes.

Before finishing an entry, check its two date fields. If either is blank, ask yourself whether
you actually searched for it on its own or only hoped it would turn up. If it was the second,
go back and search again.

dateNotes is one line of free text covering both dates. Label each half so it stays readable, for example:

* "Open: approx Dec/Jan. Close: rolling, no fixed deadline"
* "Close: 12th-18th (range)"

Leave dateNotes empty when both dates are exact and published.

**Step 5 - Other details**

* Research the remaining details and populate: location, length, trainingProvider, grades, salary.
* All five are free text. Keep them short, for example "London", "4 years", "BBB", "£24,000".

**Step 6 - Finalising**

* Check all details. If there's significant evidence that some data in the entry is wrong, correct it.
* Repeat the process for the next company if there is one, or wait for a new one.
