# Goal

The goal is to build up my apprenticeship tracker in preparation for the next academic year when apprenticeships begin to open applications.

## Rules

1. Never fabricate statistics, quotes, or sources.
2. Do not produce content that is misleading, harmful, or off-brief.
3. Information added to the table should be short and concise. Do not use full sentences when a few words will suffice.
4. Never create a new field in Airtable. Work only with the fields listed below.

## Where The Tracker Lives

The tracker is an Airtable base, not a spreadsheet.

The base and table IDs live in `/workflows/airtable-ids.local.md`, which is gitignored so the IDs
stay out of the public repository. Read that file to get them.

Use the Airtable MCP tools to read and write. Do not go through Google Sheets.

## Table Schema

Fields in the table, in order. The type matters, so match it exactly when writing.

| Field | Type | Who fills it |
| --- | --- | --- |
| Company | single line text | Agent |
| Role | single line text | Agent |
| Attachments | attachments | Fact file workflow, after the user confirms. Not this workflow |
| Registered for Updates | checkbox | Manual, do not populate |
| Open Date | date | Agent |
| Close Date | date | Agent |
| Date Notes | single line text | Agent |
| Link | URL | Agent |
| Location | single line text | Agent |
| Length | single line text | Agent |
| Training Provider | single line text | Agent |
| Grades | single line text | Agent |
| Salary | single line text | Agent |
| Current Stage | single select | Agent sets to "Not applied" on new rows, then manual |
| Next Stage | single line text | Manual, do not populate |
| Next Stage Done | checkbox | Manual, do not populate |

Allowed single select values:

* Current Stage: `Not applied` `Applied` `Interview` `Offer` `Rejected` `Withdrawn`.

Open Date and Close Date display as D/M/YYYY in Airtable but must be written as `YYYY-MM-DD`.

There are no separate day or month fields. All date detail lives in Open Date, Close Date and Date Notes.

## Step-By-Step Process

**Step 1 - Receive name of company/companies**

* Accept any company name.
* If multiple company names are given, split them up and carry out the workflow for each company separately.

**Step 2 - Check tracker**

* Search the Airtable table for the company name in the Company field.
* If a record already exists for that company, skip it. Do not create a duplicate.

**Step 3 - Initial details**

* Research whether the company offers a level 6 Digital Technology Solutions apprenticeship. A level 6 AI, machine learning or AI engineering apprenticeship counts too and is treated the same as a software engineering one. If they have multiple options, choose the one most aligned to the role of a Software Engineer, or to AI engineering. Do not include network engineering or cybersecurity apprenticeships.
* If no level 6 role exists, check whether the company offers a level 4 apprenticeship in software engineering, AI engineering, or similar.
* If neither exists, skip this company entirely. Do not create a record for it.
* Then apply the qualification rule. I am studying A levels in England, so a role fails if its entry requirements are qualifications I cannot hold, whatever its level or title. The clearest case is a Scottish Graduate Apprenticeship, which requires Scottish Highers. This is not a grades filter: do not skip a role for asking high grades or a specific subject, only for a qualification that is unobtainable for an England-based A level student. Skip the company and say which qualification was the blocker.
* Otherwise, create a new record and populate:
  * Company and Role with what you found.
  * Link with the URL of the apprenticeship listing or application page. Use the company's own page over a job board where possible.
  * Current Stage set to `Not applied`.

**Step 4 - Date details**

Dates are the most important fields in this tracker. Everything else describes a scheme; the
dates are what stop me missing it. Treat them as the priority of the whole run, not as one
field among ten. A blank Open Date or Close Date should be rare and must be earned, meaning
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
  year rule below, and say in Date Notes which cycle it came from.
* If last year's exact listing is gone, a documented pattern still counts. Examples: "recruits
  Jan to May", "applications open in October", "closes once filled". Use it and label it.
* Only leave a date blank after all of the above fail. When you do, Date Notes must say what
  you looked for and why it is empty, for example "Close: not published, 2026 listing removed".
* Never fabricate a date. Only enter one if there's reasonable evidence for it. An estimate
  clearly labelled in Date Notes is not fabrication. A guessed date with no basis is.

Writing the fields:

Open Date and Close Date are real date fields used to sort and filter by what opens or closes next. Always populate them when you know the month.

* Write them as `YYYY-MM-DD`. Airtable displays them as D/M/YYYY, but that is only the display format.
* If you have an exact day and month, combine them into that date.
* If you only have a month, or the real answer is a qualifier like "Rolling", "approx" or "varies", or a range like "12th-18th", use the 1st of that month and record the original wording in Date Notes. The imprecision must not be lost.
* For the year: use today's date and pick the next occurrence of that month and day on or after today. If the resulting date would be in the past, use next year.
* If the month itself is unknown, leave that date field empty. Do not guess a year. Reaching
  this point should be the exception, not the habit.
* If you can't find any date information at all, leave Open Date and Close Date empty and say
  so explicitly in Date Notes.

Before finishing a row, check its two date fields. If either is blank, ask yourself whether
you actually searched for it on its own or only hoped it would turn up. If it was the second,
go back and search again.

Date Notes is one line of free text covering both dates. Label each half so it stays readable, for example:

* "Open: approx Dec/Jan. Close: rolling, no fixed deadline"
* "Close: 12th-18th (range)"

Leave Date Notes empty when both dates are exact and published.

**Step 5 - Other details**

* Research the remaining details and populate: Location, Length, Training Provider, Grades, Salary.
* All five are free text. Keep them short, for example "London", "4 years", "BBB", "£24,000".
* Leave Registered for Updates, Next Stage and Next Stage Done alone. Those are manual.
* Leave Attachments alone too. `company-role-fact-file-workflow.md` fills it once the user confirms the fact file.

**Step 6 - Finalising**

* Check all details. If there's significant evidence that some data in the row is wrong, correct it.
* Repeat the process for the next company if there is one, or wait for a new one.
