# Learning printables: UK curriculum aligned, Years 1 to 6

Brief from Justin, 25 July 2026. England first, Years 1 to 6.

## The problem

Our printables are colouring in. That is right for a four year old and wrong for
a nine year old. An older child needs sheets that reflect **what school expects
them to know at their age, at this point in the year**, so a parent can see
where their child actually is without waiting for a report.

## What it is

A printable per **year group** per **subject** per **term**, testing what a
child should know by that point in the school year, branded with the Planet
Friends so it feels like ours and not a photocopy.

Three subjects: **maths**, **English** (grammar, punctuation, spelling) and
**reading** (fluency and comprehension).

The child works it. Anything they found hard they mark, and that flag reaches
the parent as a plain line: she is shaky on column subtraction. That is the
whole product. Not a grade, a place to help.

Doing one earns **stars**, so it sits in the same economy as jobs and lands as
screen time. It is a real off screen win and counts on the balance.

## Why time of year matters

"What a Year 4 should know" is useless in September and true in June. The sheet
has to know which term it is printed in.

English schools broadly follow a three term year, and the dominant primary maths
scheme (**White Rose**) sequences it the same way almost everywhere:

- **Autumn**: place value, addition and subtraction
- **Spring**: multiplication and division, then fractions
- **Summer**: geometry, measures, statistics, and consolidation

So an autumn Year 4 sheet tests place value to 10,000 and column methods. A
summer Year 4 sheet tests times tables, area and time. Same year, different
sheet.

## The statutory checkpoints, which are the real hooks

These are fixed points in the English school year and they are exactly what a
parent is anxious about. Each one should have a run up sheet:

| When | What | Year |
|---|---|---|
| June | **Phonics Screening Check** | Year 1 |
| May | SATs (optional since 2023/24) | Year 2 |
| June | **Multiplication Tables Check**, all tables to 12 x 12 | Year 4 |
| May | **SATs**: reading, maths, grammar punctuation and spelling | Year 6 |

A "get ready for the times tables check" sheet in the spring of Year 4 is
probably the single most wanted printable we could make.

## Curriculum sources to verify against before writing any content

Nothing gets generated from memory. Every objective traces to one of:

1. **The national curriculum in England, primary programmes of study** (DfE,
   statutory). The spine: year by year objectives for maths and English,
   including the statutory spelling word lists (Years 1 and 2, 3 and 4, 5 and 6).
2. **White Rose Maths** small steps and term sequencing, because it is what most
   English primaries actually teach to, so it matches what the child saw in class.
3. **Oak National Academy**, government backed, free, curriculum aligned, useful
   as a cross check on sequencing.
4. **The Multiplication Tables Check framework** and **KS1 and KS2 test
   frameworks** (STA) for what "should know" means formally.
5. **Little Wandle** or **Read Write Inc** for the phonics progression, since
   reading in Years 1 and 2 is a phonics question, not a comprehension one.

Accuracy is the product here. A sheet that tests the wrong thing for the year is
worse than no sheet, because a parent will believe it.

## Nations

England only at first. Scotland (Curriculum for Excellence), Wales (Curriculum
for Wales) and Northern Ireland are genuinely different curricula, not variants.
The data model keys on a `curriculum` field from day one so they slot in later
without a rebuild, but nothing is claimed about them until they are built.

## Shape of the build

**Content model**
- `curriculum` (england), `year_group` (1 to 6), `subject`, `term`
  (autumn, spring, summer), `objective` (the statutory line), `source`
- Questions attached to objectives, each with an answer and a worked solution
  for the parent's sheet

**The printable**
- One sheet per year, subject and term, in the house tokens, Planet Friends on
  every page, the same warm look as the rest of our printables
- A parent answer page, so a parent who is not sure themselves can still mark it
- Ink friendly edition like every other printable we ship

**The help flag, which is the bit that matters**
- Each question block has a "I found this tricky" tick
- The child ticks as they go, the sheet is recorded done, and the parent gets the
  summary: the two or three things to sit down and go over
- DiGi turns that into a plain next step for the parent, in Justin's voice, never
  a diagnosis and never a comparison to other children

**Stars**
- A finished sheet is worth stars like a printable is now, confirmed by the
  parent, and counts on the off screen total

**In app quizzes**
- Multiple choice versions of the same objectives, tied to a platform video:
  watch this, then answer
- Same Planet Friends branding, same star reward, so a child can do it on a
  screen when paper is not to hand

## Build order

1. **Research and map** the curriculum: year by year, term by term, per subject,
   with sources. This is the long pole and it comes first.
2. **Migration and content model**, plus the first year group end to end as the
   proof (suggest Year 4, because the tables check is the sharpest hook).
3. **The printable generator** and the branded sheet design.
4. **The help flag** to the parent, and the stars.
5. **The in app multiple choice quizzes** tied to videos.
6. Fill out the remaining year groups.

## Open questions

- Do we cover **Reception**, or start at Year 1? Started at Year 1 per Justin.
- Times tables check practice as its own standalone product, given how much
  parents search for it?
- **Decided 25 Jul: the child is shown no score**, only what to go over. A score
  turns a warm shared thing into a test that judges them, and the child stops
  flagging what they found hard, which is the whole mechanism. The parent still
  gets the substance, just never a number attached to their child.
