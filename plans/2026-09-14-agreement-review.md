# The family agreement, reviewed end to end

Justin, 14 September 2026, with the builder's first step on his phone:

> Let's review agreements: that they're doing super top design for child
> print outs and they tie in, wired in with children, and we refer to
> regularly, advise of needing updating, print out and live on both apps
> for referring to, and matches best science, age, and what we have fully
> researched from child experts.

## What was true before today

| Ask | Found |
|---|---|
| Child print out, top design | The child's fridge sheet (`/k/[token]/deal`) printed the three rules, the timer rule, the jobs and the goal. It never read the family agreement, so the promises the family signed were not on the paper on the wall. The parent's A4 copy was six plain paragraphs. |
| Wired in with children | The promises reached the child's app as five text blocks built from the legacy columns; the child could not agree from their side (fixed this morning). |
| Refer to regularly | The weekly rung, the ask and the yes (this morning), the passport line (this morning). |
| Advise of needing updating | Only the review date, and only since this morning. Nothing noticed a child moving stage: a First screens deal on a child now on Builder read as fine. |
| Live on both apps | Yes on both, from three different readers of the same row, which is how they drift. |
| Matches best science by age | Each clause had a one line why. Nothing named a source, and two things contradicted the product's own research bank (below). |

## What changed

1. **One reader for the promises** (`lib/content/agreement-promises.ts`):
   structured clauses first, the legacy columns for older rows, each promise
   with its icon, the words the family chose, the science why and the
   question asked at the table. The child's app, both fridge doors and the
   A4 copy all read it, so the phone, the wall and the folder say the same
   thing.
2. **The fridge sheet redrawn** (`components/deal/FamilyDealSheet.tsx`): the
   promises first with their whys, the child's own Planet Friend, the type
   of deal, how the stars work, the timer rule, the jobs, the goal, "Why we
   agreed this" with sources, two signatures with the names printed when
   signed, and the review date. Happy Newspaper finish; print keeps the
   shapes and drops the shadows.
3. **The science, per deal type** (`SCIENCE_BY_TYPE` in
   `agreement-clauses.ts`): two or three lines each, every one already in
   the product's research bank (the DiGi situations bank, the expert
   knowledge rows, the verified briefings), with its source. Shown in the
   builder before the signatures and on every print. The naming rule from
   migration 123 holds: bodies, published studies and the four academics
   the homepage cites; never a living clinician.
4. **Outgrown** (`dealOutgrown`): a deal written for a younger stage than
   the child is on reads "written for First screens and Andy has moved on,
   update it together" on the passport and "Update the deal" on the road,
   whatever the review date. Ahead is fine; a legacy row with no type is
   never outgrown.
5. **Two corrections from the research**: no earned time clause in the
   four to seven deal (the stage guide says screen time is never framed as
   a reward at that age; the jobs and stars still run, the deal simply does
   not put the trade in writing for a five year old), and the earned time
   why line no longer leans on the retired verb.
6. The "Recommended for Andy" pill no longer wraps, and the Now button
   straddles the tab bar instead of floating a full circle over the page
   (it sat on the pill and on a product's price in two screenshots).

## Three honest lines for Justin, from our own research

- The one randomised trial of family media plans as a whole found no
  effect of the plan itself (Moreno and colleagues, JAMA Pediatrics 2021,
  1,520 families). The bedroom rule is where the evidence is strongest
  (Carter and colleagues, JAMA Pediatrics 2016, 125,198 children). So the
  science block leads with where devices sleep on every deal and treats
  the rest as the conversation, which is what it is for.
- The answer when we call clause has no evidence line anywhere in the bank.
  It stays as a family matter, not a science claim.
- Restriction stops working past fourteen (Collier 2016, Lukavska 2022),
  which is why the sixteen plus deal has fewer promises and more talking.

## Not changed

The A4 copy keeps its one page fit script. The agreement stays one per
family. The clause titles are unchanged because legacy rows are matched on
them.
