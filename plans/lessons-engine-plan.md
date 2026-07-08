# Lessons Engine — banked 4 July 2026 for the week of 6 July

Justin's ask: super professional slides (PowerPoint quality or better) with
text and animations for kids' lessons, presented in the parent dashboard.
The AI lessons tab becomes plain Lessons: home schooling in general, AI,
safety, all of it. His instinct, confirmed: driven first from the school
curriculum, then converted for parents.

## Decision to confirm Monday: in app slide engine, not PowerPoint

Slides are built inside the platform with the design system (Nunito, the
README colour tokens, chunky buttons), GSAP slide transitions and reveals,
Higgsfield images full bleed. Better than a deck because slides can: age
gate at the start, require the parent settings step before content unlocks
(the locked section 21b rule), embed a tap to ask DiGi, run a remembered
quiz, and feed progress into the streak and the path. Print to PDF stays
possible for worksheets.

## One curriculum master, two renderings

The schools lesson build spec (plans/schools-lesson-build-spec.md, KS3
module 12 fully scripted) is the master. Each lesson stores slides once;
the renderer swaps the frame:

- School rendering: teacher notes, class timing, discuss in pairs, register.
- Parent rendering: parent notes, do this together on the sofa, shorter,
  settings first, animation intro the parent can show the child.

Write once, sell twice. Lessons live in the database (lessons table exists
as scaffolding already), never hardcoded, consistent with the scripts rule.

## Slide format (draft, refine Monday)

slide types: title (image full bleed), teach (image + one idea), together
(activity instruction), check (tap quiz), settings gate (parent must
confirm), close (what we learned + next lesson tease). Each slide: heading,
body, image key, animation preset (fade up, stagger, none), audience notes
per rendering.

## Order

1. Confirm engine decision and slide schema Monday.
2. Build the renderer + one flagship parent lesson end to end (the existing
   AI intro animation as the opener).
3. Convert the KS3 reference lesson to prove school to parent conversion.
4. Then batch: Higgsfield image set per lesson, age variants.

## Teacher layer (Justin, 5 July: one engine runs home AND school)

Confirmed: the same slide decks and animation beats run everywhere. The
school rendering adds a teacher layer on top of the shared spine:

- Presenter mode: class screen shows the slide, teacher screen shows the
  per slide script, timing guidance, discussion pointers, expected
  answers and misconception warnings, safeguarding notes where a topic
  can surface disclosures.
- Resource pack per lesson: printable worksheets and activity sheets,
  generated from the same lesson data, plus the register and class code
  tie in from the schools product.
- Parent rendering stays the sofa version: shorter, parent notes,
  settings gate, do it together activities.
- Third rendering: every lesson also breaks into the daily two minute
  literacy cards for the session strip.

Edit the master once and all renderings update: no drift between what
schools teach and what parents reinforce. That consistency IS the school
to home sales story.
