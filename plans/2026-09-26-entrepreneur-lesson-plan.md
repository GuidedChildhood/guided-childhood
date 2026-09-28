# Could you be an entrepreneur? The build plan, 26 September 2026

Justin's decision 5 (plans/2026-09-24-simon-squibb-weighed.md): a second
standalone lesson, after "What problem would you solve?", for Years 8 and 9,
free at its own link, outside the scheme. Built after the flagged lesson checks
(PR 1166). Migration **355** (353 and 354 are on main; nothing open claims 355).

## The evidence, read first

Three researchers read the primaries on 26 September. Their reports are the
source for every figure below, and every figure goes into the evidence panel.

- **ONS Business demography 2024** (20 November 2025): of UK businesses born in
  2019, 94.6 percent active after one year, 55.9 after three, 38.4 after five.
  Registered businesses only; "died" means stopped trading, not why.
- **ONS EMP01** (May to July 2026): 4.53 million self employed of 34.48
  million in work, one in eight. DBT Business population estimates 2025: 75
  percent of businesses employ nobody but the owners.
- **HMRC Personal incomes 2023 to 2024**: 29 percent of people with self
  employment income also had a job.
- **DWP Family Resources Survey 2024 to 2025**: full time self employed median
  take home £22,800 against £29,000 for employees; pay less steady.
- **Stephan, Rauch and Hatak 2023** (meta analysis, 94 studies): a little more
  work satisfaction on average, no difference in stress; lower for people pushed
  into it. ONS personal wellbeing 2023: no significant difference.
- **GEM UK 2024/25**: fear of failure 58 percent among adults who see a good
  opportunity; about 12 percent of adults starting or running a new business.
- **Personality**: small effects (Zhao, Seibert and Lumpkin 2010; Rauch and
  Frese 2007); childhood test scores did not strongly predict later self
  employment in the British 1958 cohort (Blanchflower and Oswald 1998).
- **Trying it**: mini company programmes often leave students less keen on
  average (Oosterbeek 2010), which fits learning what the work is like (von
  Graevenitz 2010). The lesson says trying shows you what it is like, never
  that it reveals talent or beats a quiz.
- **Under 18s**: the child employment rules, selling platform ages, company
  director at 16, and money mule warnings, from gov.uk, legislation.gov.uk and
  each platform's own terms.

## The lesson

Orbit opens, DiGi closes. Thirty one slides, about sixty one minutes, the
Rosenshine arc, with three cycles and one tool:

- **Look: ways to work.** Employer, alone, with staff, or a job plus a side
  project. One in eight work for themselves, and most have no staff.
- **Weigh: the honest numbers.** Does it last, what does it pay, how does it
  feel. Myths tested against the figures.
- **Try: a small version.** Fear of failing is the common brake, so make
  failing cheap. No entrepreneur type. The same moves inside any job. What you
  can do before 18, and the one safety line: money offers go to a parent or
  carer.

Practise: a true, myth or it depends sort of six claims. Prove: three choice
questions. Close: the recap, Orbit's mission (ask one adult who works for
themselves about their week), DiGi's last line.

## It will not

Rank a business above a job or university (Bjorvatn 2020 is why), promise
income, use Simon Squibb's figures or name him, give a personality test, or
suggest selling online or taking money without an adult.

## The build

1. `content/standalone/could-you-be-an-entrepreneur.json`, held to the module
   contract, the rubric, wall fit and the helplines.
2. `schools/lib/taster.ts`: the second standalone id and title, and the pair,
   so each lesson's free bar names the other.
3. `scripts/check-source-claims.mjs`: the claims that must never come back
   wrong (most businesses fail in year one; you earn more; born one).
4. Migration 355: insert the row, guarded, hash proved against the file.
5. Render at 390 and 1440, commit, a fresh PR once 1166 has merged.

## Done, 26 September

Built as planned, with one change of shape: the practise sort's fourth claim is
now "you can tell from someone's personality if they will be an entrepreneur",
because the evidence can settle that one and cannot settle "born, not made".

The lesson's exact wording was then checked again against the primaries by
three checkers: 10 claims confirmed, 9 corrected, 1 not traceable (the HMRC
table, since read in the spreadsheet itself and confirmed). What changed:

- Personality is moderately linked to starting a business, not "a little",
  and the 1958 measure was a teacher's rating at age 7, not a test score.
- "What matters more is why" became "why they do it also matters".
- Street trading: no adult makes it legal for a Year 8, so the slide says no
  selling or busking in the street. Northern Ireland allows work from 13, so
  the card reads "From 13 or 14". No law makes an adult responsible until 18;
  the platforms do.
- The trading allowance counts takings before costs, and above £1,000 HMRC
  must be told.
- HMRC counts "employment income" (pay or some taxable benefits), so the slide
  says plenty of people have a job and work for themselves, and the script
  carries the exact figure.

Every correction is pinned in check-source-claims, and each pin was shown to
fire on the old wording. Migration 355 was applied in 40 hash proved parts;
the recorded proof passed on its first run.
