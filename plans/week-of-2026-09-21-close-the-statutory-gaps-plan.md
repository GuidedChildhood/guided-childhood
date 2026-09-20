# Close the statutory gaps, and make the audit a guard

Justin, 19 September 2026, after reading the audit: "are you able to plan and fix
what's missing add it to same best standard and let me know if you need anything
abd make sure everything is covered abd that it passes the audit".

So this is the build plan for everything `GDC_SCHOOLS_2026_COMPLIANCE_AUDIT.md`
found. The audit stays where it is as the record of what was true on 19
September. This plan is how it stops being true.

## The one idea that makes this different from a normal build

The audit is a document, and a document goes stale the moment someone edits a
slide. So the audit becomes **a script**.

`scripts/check-rshe-coverage.mjs` reads the 57 requirements and, for each one,
the evidence that it is taught: module ids plus the phrases that must appear in
those modules' live slide text. It fails if a requirement loses its evidence,
if a module id stops existing, or if a NONE appears where a FULL was. Run in CI
beside the other 128 guards.

That is what "passes the audit" means here. Not my opinion in a markdown file:
an exit code.

## The target end state

| Verdict | Now | After |
|---|---|---|
| FULL | 18 | 48 |
| PARTIAL | 28 | 0 |
| INDIRECT | 2 | 0 |
| NONE | 9 | 0 |
| BY DESIGN | 0 | 9 |

**BY DESIGN is a new verdict and it is not a hiding place.** It is for the
handful of requirements that belong to a school's wider RSE provision and not
to a digital literacy spine: consent in early sexual relationships, resisting
sexual pressure in a relationship, the laws on sexual violence. A scheme that
claimed those would be lying about what it is. Each BY DESIGN row names the
requirement, says why it sits outside, and says where in the school's provision
it belongs. A PSHE lead reading the matrix should be able to hand that row to
whoever owns it.

Everything else goes to FULL.

## Batches

### B1. The copy, first, because it carries no risk

The seven DO NOT CLAIM sentences, the two provenance fixes, the two KCSIE
wording corrections. No lesson, no database, no component. Ships on its own so
the site stops overclaiming today rather than at the end of the build.

### B2. The mapping becomes data

`shared/schools-rshe-2026.ts`: the 57 requirements with strand, item number,
verbatim text, KCSIE anchor, the modules that teach each one, and the evidence
phrases. Generated from `GDC_SCHOOLS_COVERAGE_MATRIX.csv` so the two cannot
drift. `RSHE_2025_TOPICS` stays exported until nothing imports it.

`scripts/check-rshe-coverage.mjs` with mutation tests, the house standard: break
the mapping five ways, the guard catches five.

### B3. The matrix page tells the truth

Same layout, same honesty note, real data. Gains a gaps section and a BY DESIGN
section. Gains a reviewed date and the source version. The page already renders
from a manifest, so this is a data swap rather than a redesign.

### B4. The cheap content, slide by slide

Top ups inside existing modules, one to three slides each, for the requirements
that are PARTIAL because a named clause is missing rather than because the topic
is absent. Roughly fifteen modules touched. Includes the two ks4-16 slides,
which are the highest value per slide in the scheme.

### B5. The four new modules

| New module | Key stage | Closes |
|---|---|---|
| Why 13? | KS2 | The age 13 minimum, why services are age restricted (2 requirements) |
| When it turns on you | KS3 | Bullying, harassment, stalking, coercive control online, how to report (3 requirements) |
| The money and the odds | KS4 | Online gambling, gambling like content in gaming, debt, the mental health harms (2 requirements) |
| The content you did not go looking for | KS4 | Self harm, suicide and violent content, illegal supply online, how to report, how to get support after seeing it (2 requirements) |

Twenty five modules becomes twenty nine. Every one built to the full contract:
the Rosenshine arc, a single action outcome in the child's voice, a word for
word script on every slide, the five part assessment block, a passport area, a
parent note, a scaffold, a home code, and a DSL note where the topic needs one.

Two of the four carry a DSL flag. The self harm module carries the most careful
writing in the scheme: no method detail, ever, the support routes named, and
the register that the rest of the scheme already uses, which is that the child
is never in trouble for telling.

**Done, 20 September.** All four in production as migrations 312 to 315,
carried in hash verified chunks and each recorded in the migration history as
an executable assertion of its own hash. In the end all four carry a DSL flag,
not two: bullying and coercive control at KS3 and gambling harm at KS4 both
earned one once the disclosure points were written. 29 modules, 856 slides.

### B6. Re-audit, and prove it

Regenerate the CSV and the audit document from the new state. Every number
recomputed from production, not edited by hand. Run every guard by exit code.
Render the changed pages at 390 and 1440 in Chrome DevTools.

**Done, 20 September.** 57 of 57 FULL. 147 evidence phrases attested against
production, 0 not found, hash in the fixture, ratchet at 0 and 0. Every guard
green by exit code, both typechecks green. The mapping page and the tracker
rendered at 390 and 1440 against a 29 module fixture whose four new rows are
the same JSON production holds. The audit document carries a dated section at
the top recording all of this and the limits that still stand; nothing below
it was edited.

## What is NOT in this plan

The computing national curriculum hooks stay unverified until someone supplies
the document. Four modules carry a `Computing` hook and this plan does not
touch them. The audit says so and will keep saying so.

## Rules this build keeps

Nothing here replaces anything that works. No lesson is rewritten, no route
moved, no passport wiring touched, no component redesigned. Every change is an
addition or a correction, and every one is guarded.
