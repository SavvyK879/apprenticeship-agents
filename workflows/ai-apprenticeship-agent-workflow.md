# Goal

The goal is to build up my apprenticeship tracker in preparation for the next academic year when apprenticeships begin to open applications.

## Rules

1. Never fabricate statistics, quotes, or sources.
2. Do not produce content that is misleading, harmful, or off-brief.
3. Information added to the table should be short and concise. Do not use full sentences when a few words will suffice.
4. Never create a new field in Airtable. Work only with the fields listed below.

## Where The Tracker Lives

The tracker is an Airtable base, not a spreadsheet.

* Base: "Apprenticeship Tracker" — `appGa8FIDwREZf4Vr`
* Table: "Table 1" — `tblNtjoCUrKBM9g3Y`

Use the Airtable MCP tools to read and write. Do not go through Google Sheets.

## Table Schema

Fields in the table, in order. The type matters, so match it exactly when writing.

| Field | Type | Who fills it |
| --- | --- | --- |
| Company | single line text | Agent |
| Role | single line text | Agent |
| Attachments | attachments | Manual, do not populate |
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

* Research whether the company offers a level 6 Digital Technology Solutions apprenticeship. If they have multiple options, choose the one most aligned to the role of a Software Engineer. Do not include network engineering or cybersecurity apprenticeships.
* If no level 6 role exists, check whether the company offers a level 4 apprenticeship in software engineering, AI engineering, or similar.
* If neither exists, skip this company entirely. Do not create a record for it.
* Otherwise, create a new record and populate:
  * Company and Role with what you found.
  * Link with the URL of the apprenticeship listing or application page. Use the company's own page over a job board where possible.
  * Current Stage set to `Not applied`.

**Step 4 - Date details**

Do this separately for the opening date and the closing date.

* Check the company website and the apprenticeship listing first for a published date.
* If not published there, do a quick, non-exhaustive search elsewhere online.
* If still not found, estimate using last year's opening/closing date for the same apprenticeship.
* Never fabricate a date. Only enter one if there's reasonable evidence for it.

Writing the fields:

Open Date and Close Date are real date fields used to sort and filter by what opens or closes next. Always populate them when you know the month.

* Write them as `YYYY-MM-DD`. Airtable displays them as D/M/YYYY, but that is only the display format.
* If you have an exact day and month, combine them into that date.
* If you only have a month, or the real answer is a qualifier like "Rolling", "approx" or "varies", or a range like "12th-18th", use the 1st of that month and record the original wording in Date Notes. The imprecision must not be lost.
* For the year: use today's date and pick the next occurrence of that month and day on or after today. If the resulting date would be in the past, use next year.
* If the month itself is unknown, leave that date field empty. Do not guess a year.
* If you can't find any date information at all, leave Open Date and Close Date empty.

Date Notes is one line of free text covering both dates. Label each half so it stays readable, for example:

* "Open: approx Dec/Jan. Close: rolling, no fixed deadline"
* "Close: 12th-18th (range)"

Leave Date Notes empty when both dates are exact and published.

**Step 5 - Other details**

* Research the remaining details and populate: Location, Length, Training Provider, Grades, Salary.
* All five are free text. Keep them short, for example "London", "4 years", "BBB", "£24,000".
* Leave Attachments, Registered for Updates, Next Stage and Next Stage Done alone. Those are manual.

**Step 6 - Finalising**

* Check all details. If there's significant evidence that some data in the row is wrong, correct it.
* Repeat the process for the next company if there is one, or wait for a new one.
