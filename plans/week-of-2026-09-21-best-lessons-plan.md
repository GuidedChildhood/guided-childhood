# The best lesson a teacher has ever used: the plan

20 September 2026, evening. Session 0u09q9, on PR #1130 until it merges, then
a fresh PR from the same branch.

Justin, 20 September: "fix slides and use all your powers to make sure these
slides are top presentation lessons and the best a teacher would have ever
used. Use as many agents as possible and do not stop until you are 200%
confident this is the best possible finished product." In the same message:
the DfE computing programme of study text, in full; "can we use happy news
icons on lessons, since we have icons"; "can we keep seeing appearances from
characters, and how to plan that"; "can we take from the best doing this
already and better it".

## What is true today, measured on production this evening

- 29 lessons, 856 slides. The 147 statutory phrase checks pass. Prose within
  the wall ceiling: 357 of 375. Eighteen over: six EYFS and KS1 slides over
  the 12 word decoding ceiling (two title bodies at 36 and 41 words, one at
  43, a KS1 concept slide at 82, two diagram captions at 21), and twelve KS2
  to KS4 concept slides the September clauses pushed past the measured 105
  word projector ceiling, to between 106 and 207 words.
- Every lesson opens on its friend, has the arrival beat, the half time
  breath, the mission beat, the passport beat and DiGi's close. The four
  lessons written on 19 September carry a half time breath with no friend, no
  heading, no prompt and a 30 second breath; the other 25 carry the friend,
  a heading, a prompt and a four second breath.
- Icons: the wall draws emoji on the one idea slide and on diagram steps, the
  Hub draws 14 emoji on its tiles, the print booklet two. The Happy News
  drawn set (components/kid/HappyIcon.tsx, 52 names, ink lines and crayon
  fills) lives in the parents app only. The house rule since 5 September is
  that an emoji doing an icon's job becomes a drawn icon in a plate.
- Computing: no map. The RSHE map covers the 57 statutory requirements and
  the tracker evidences them.

## The order

1. **Migration 320, the eighteen slides inside their ceilings.** The twelve
   appended clauses move off the wall into the teacher's script, word for
   word, so the attestation still reads every phrase and the teacher still
   says it; the wall keeps the idea the slide was built for. The six early
   years slides cut to the decoding ceiling, with what came off carried in
   the script the same way. The four half time breaths get their friend, a
   heading, a prompt and four seconds, in the register of their key stage.
   Contract rule 12: a star breath names a friend, carries a heading and a
   prompt, and breathes for four seconds. Then: attestation 147 of 147, prose
   on production 375 of 375, contract on every touched module, hashes equal
   to content/modules for the four new modules, a render of one module per
   key stage on the wall.
2. **The bar.** Two research agents, briefed on THE-STORY.md: what the best
   schemes do lesson by lesson (Teach Computing, Project Evolve, Oak, Common
   Sense, Be Internet Legends, Childnet, CEOP, Kapow, Twinkl, Jigsaw) and what
   the evidence says a projected slide and a scripted lesson should be
   (Mayer, Sweller, dual coding, Rosenshine, the EEF, legibility, hinge
   questions, seductive detail). Out of them: `scripts/lesson-rubric.md`,
   every check with its source, marked measurable or judgement. Nothing
   invented, nothing without a citation.
3. **The computing map.** `shared/schools-computing-pos.ts` transcribed from
   the programme of study text Justin supplied: the statements we honestly
   evidence (KS1 safe and respectful use and where to go for help; KS2 safe,
   respectful and responsible use, acceptable and unacceptable behaviour,
   ways to report, discerning evaluation of content; KS3 identity and
   privacy, inappropriate content, contact and conduct, reporting,
   trustworthiness of artefacts; KS4 how changes in technology affect safety,
   privacy and identity, reporting) with phrase probes against the slides like
   the RSHE map, and the statements that are not ours (programming, networks,
   data, hardware) shown plainly as not taught here. `/hub/computing-mapping`,
   `check-computing-coverage`, and a claim on the site only for what maps.
4. **Icons.** The Happy News set moves to shared so both apps draw it. The
   Hub tiles and the map wear it first. Then the wall: an optional `icon` on
   title and one idea slides, drawn from a lesson set in the same hand
   (shield, lock, eye, magnifier, speech bubble, clock, brain, heart, hand,
   phone, camera, key, door, map, globe, coin, dice, scales, megaphone,
   question mark, tick, group, bed, star), the player drawing the icon where
   it draws the emoji today, the contract refusing an unknown name. The review
   agents propose the icon per slide; nothing decorates.
5. **Characters.** `plans/character-appearances-plan.md`: where each friend
   appears in every lesson today (title, arrival, teach slides, half time,
   mission, passport, the videos and the fifteen expression stills), the rota
   by key stage, the next beat worth building (the friend's reaction after
   the two checks, from the stills), and the guard that keeps every new
   lesson in shape, so the 19 September gap cannot happen again.
6. **The review.** A workflow of one agent per lesson against the rubric,
   each returning slide level findings with the exact rewrite, one verifier
   per lesson (facts and sources, no dashes, inside the ceilings, every
   attested phrase kept, Justin's voice, the friend's register), then batches
   of guarded migrations with backups and hash assertions, attestation,
   council and render after each batch. No slide changes without the
   verifier's yes.

## Verification, every batch

Attestation 147 of 147. Prose on production. The module contract on every
changed module. Hashes equal to content/modules for every module in the
batch, which means the older 21 modules get pulled into content/modules first
so the mirror is true rather than stale. Render at 390 and 1440 on the wall
and the prep page. A unicode scan for dashes. No new claim on any page without
a proof path in the product.

## Step 6, designed. 20 September, late evening, after PR 1130 merged

PR 1130 merged at 18:12. Everything from here is a fresh PR from the same
branch, restarted from main. The two research agents for the bar did not
survive the session restart, so they were relaunched with the same briefs,
writing to the scratchpad and returning the checks section.

**The mirror first.** There is no database credential in the container and
no network route to the project, so the 21 older lessons come into
content/modules through the Supabase tool: seven export agents, three
modules each, one `jsonb_build_object` per module in the exact shape the
eight existing files use, then `scripts/module-string-hash.mjs` on the file
and its `--sql` twin on production, and the two must agree on slides,
strings and md5 before the agent moves on. A copy that passes the hash is
the row, character for character; a copy that fails is refetched.

**One edit is one string.** A finding the verifier accepts is
`{ slide, path, check, severity, problem, expect, new }`: the 1 based slide,
a slash path to one string leaf inside it (`body`, `options/1/feedback`,
`steps/2/text`, `config/prompt`, `points/0`), the rubric check it answers,
the exact text there now and the exact text that should be. No slide is
added, moved or removed by this road; a finding that needs a new slide is a
lesson level proposal and comes to Justin as a list, not a migration.

**The only road to production is `scripts/gen-review-batch.mjs`.** It reads
the accepted findings, refuses any edit whose `expect` is not the file's
text, whose `new` carries a dash, that pushes the slide over its wall
ceiling, that loses an attested phrase, or that breaks the module contract,
and only then writes the batches: whole modules in teaching order, sized to
what the Supabase tool has carried before (320 was 43 KB), each one a
transaction with a backup table, a write that checks the slide's type and
heading and the exact current text and records a miss instead of writing,
the abort on any miss, the prose ceiling proof, the attestation proof for
the batch's phrases, and the string hash proof that every module now equals
its file. The migration header lists every edit and why, so the file is the
record. Migration numbers 321 onwards are claimed for these batches in the
PR title.

**The workflow.** One pipeline over the 29 modules: a reviewer per lesson
(the rubric, the module file, the friend's register, the protected phrases,
the instruments) returns the findings above plus lesson level proposals; a
verifier per lesson, briefed to refute, returns accept or reject per finding
with a reason. Then the generator, then each batch applied and proved, then
the fixture rebuilt from content/modules and the wall rendered at 390 and
1440, one module per key stage, before the next batch.
