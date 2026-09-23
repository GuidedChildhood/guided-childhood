# 23 September 2026: make it the school's own, and show every source note

Jane, a DSL, reviewed the schools site and asked for resources that are "easy
to access and adapt". Justin's answers to today's questions:

1. Build the school settings row now.
2. Put the form on the open safeguarding crosswalk too, so a DSL can adapt and
   print it before buying.
3. Show the 24 hidden source notes, and add a guard so none can hide again.
4. Evidence panels for the 8 flagged lessons that have none, two or three a
   day, every claim checked before it goes live.
5. Justin is allowing the journal hosts (iproov.com, science.org,
   journals.sagepub.com, pubmed.ncbi.nlm.nih.gov, eric.ed.gov) so sources can
   be checked against the original paper.

## A. The school settings row (browser only, as now)

- `shared/schools-your-school.ts` gains three fields next to the lead's name
  and where to find them: the deputy, how a concern is recorded here, and the
  title of the school's safeguarding policy. Old saved records still read.
- The panel (`schools/app/hub/YourSchoolPanel.tsx`) groups the fields by who
  reads them: what the class hears, what staff need. Saved details show as
  label and value rows with Change and Forget (the Mobbin settings pattern:
  Klaviyo, Devin, Buffer).
- `/hub/dsl` (open): the panel on screen; on paper, the school's details at
  the top, or ruled lines to write them in by hand.
- `/hub/cpd` (licensed): the same details at the top and one line under every
  briefing's disclosure paragraph saying who to take it to and how it is
  recorded.
- The lesson's printed teacher sheet adds the deputy and the route.
- Nothing leaves the browser. No account, no server record, no new promise.

## B. The hidden source notes

- `shared/evidence-status.ts` decides what a row's status shows: one of the
  three badges, or the note itself when the status is written as a note.
- The lesson page renders through it, so a note always shows.
- `scripts/check-evidence-status.mjs` in CI: every row in content/modules has
  a claim, a source and a status; the page uses the helper; no row's note is
  dropped.

## C. Evidence for the 8 flagged lessons

ks1-02, ks2-07, ks2-08, ks3-10, ks3-11, ks4-16, ks4-17, ks4-18. Per lesson:
list the claims its slides make, find the primary source for each, verify it,
correct anything that says more than its source, then a guarded migration with
a dry run first and the module contract run on the mirror BEFORE production.
Two or three lessons a day.

## Verification

Typecheck, every schools guard, render at 390 and 1440 against the fixture,
and a print preview of the crosswalk with and without details typed.
