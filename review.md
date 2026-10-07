# review.md — the standard every change is checked against before it ships

**What this file is.** The quality bar for Guided Childhood, in one place, so a
review is a checklist and not a mood. Three users of this file:

1. Any session, before pushing: read this, check your own diff against it.
2. The PR review routine: reviews every open pull request against it each
   weekday morning and comments must fix / should fix / okay to ship.
3. The weekly UX walkthrough routine: judges the live product against the
   customer test below.

**The verdict format.** Every review sorts findings into exactly three
buckets and says which one blocks:

- **Must fix** — breaks a non-negotiable, breaks the main flow, or creates a
  risk to children's data, payments, or auth. Blocks shipping.
- **Should fix** — real but survivable. Ship if urgent, but it gets a named
  task or a follow up in the same PR.
- **Okay to ship** — listed out loud so nothing passes silently.

---

## 1. The philosophy test (from THE-STORY.md, section 3)

Every feature honours all five commitments or it does not ship:

1. Never allow or deny. DiGi always returns a calibrated pathway, enforced in
   the prompt rails.
2. Connection is the protection. Repair over punishment, modelling over
   monitoring. No feature that turns the parent into a police officer.
3. The positive pathway, not the ban. Ban neutral, and Stage 4 content flows
   from the `social_media_law` config flag, never a hardcoded assumption.
4. Earned, not granted. The child is a participant, not a subject.
5. Evidence or silence. No invented numbers, no composite scores, every
   claim defensible to a hostile expert with a proof path in the product.

## 2. The customer test

The perfect customer is a UK parent with a child aged 2 to 16. They have been
burned by a blocking app, they can feel the phone moment coming, and they want
a plan, not a ban. Judge every surface as that parent:

- Can they understand what this screen is for in 5 seconds?
- Does the copy use their language (see
  `research/homepage-audience-language.md`), not our internal names?
- Does every claim on the page have a proof path in the product?
- Does the age range hold? A feature that only makes sense for a 9 year old
  needs to degrade gracefully for the parent of a 3 year old and a 15 year old.
- Every CTA on /join routes to /starter-pack.

## 3. The scope test

- The change matches the current week's plan in `/plans/` and the ticket it
  claims. Files touched outside that scope are a finding, not a bonus.
- Small enough to review in one sitting. If it is not, it should have been
  two PRs.
- Migration numbers claimed in the PR title per the multi session rules, and
  free per the ledger in `plans/decisions.md`.

## 4. The product test

- The main user flow still works end to end after the change.
- Mobile and desktop both checked (Chrome DevTools or Playwright) before
  anything is declared done. Mobile first.
- Forms handle the empty submit, the bad input, and the slow network without
  lying to the parent.
- No new console errors, and no route that answers 200 with a failure hidden
  in the body. Read bodies, not status codes.

## 4a. The check in test (the first thing a member does each day)

The daily check in is the retention loop's front door, so any change near it
is judged against the instrument's own rules, decided 12 to 19 August 2026,
revised 9 September and 7 October 2026, and recorded in `plans/decisions.md`:

- Five faces are five bands. Face n posts the TOP of its band (2, 4, 6, 8,
  10) to `concern_events`; the stored column stays 1 to 10 and every
  downstream reader (weekly email, monthly review, What is working, DiGi
  wisdom) carries on unchanged.
- Faces, not stars. Gold stars are the child's currency (jobs earn stars,
  stars become minutes), and a feeling rating that looks like earning
  confuses both of them. The faces are drawn in house style, never emoji,
  at least 48px to tap, with the band word under each.
- The server compares BANDS, never raw numbers
  (`app/api/daily/concern-check/route.ts`). A within band wobble is not
  movement. `bandOf` lives once, in `lib/concerns/bands.ts`.
- Comparison is said in words, never as two numbers ("getting there, up
  from hard going").
- Last time is a grey face on the band it was; today's face is butter. Never
  a single outlined star, never a cumulative fill.
- One tap, one message. `lib/concerns/outcome.ts` is the only source of the
  line under the faces, what happens next, and which help buttons show. The
  card renders what it returns and nothing else, so two messages can never
  sit on one row. Every row of its table is a unit test.
- Special attention on every one or two, not only a dip: Ask DiGi and Get
  the words appear on the row, the row stays open rather than folding, and
  the same invite lands ONCE on Notifications and Home (keyed by the worry
  in `digi_prompts.source`), clearing when the worry lifts or after a week.
- DiGi asks "How did that go?" once: one unanswered card per child at a
  time, a due follow up waits behind it, and an unanswered card expires
  after a fortnight (`lib/digi/followup-queue.ts` is the only copy).
- Per child: every child with a live worry needs a scored event today before
  the Today rung ticks. State is keyed by concern id, never by slug.
- The history row is the record: the scored `concern_events` write comes
  first and its failure is an error, never a silent Saved. The tap saves
  in about a second; Change works until it lands and not after, because a
  second post the same day can resolve the concern on the server.
- A top score rests the worry and says so on the spot (`SILVER_RUN` in
  `lib/concerns/resting.ts` is the only copy of the rule, one since
  7 October 2026); it comes back after a week to check it held, and logging
  its moment brings it back sooner.
- The baseline framing tells the parent it is the starting point AND that we
  check in daily and show movement.
- `scripts/check-concern-dots.mjs` and `scripts/check-checkin-outcome.mjs`
  pass against the change.

## 5. The design test

- Checker design tokens only. Nunito display and body, IBM Plex Mono for
  labels and eyebrows. No Inter, no purple gradients, no generic AI patterns.
- Buttons: 16px radius, chunky shadow. Motion: GSAP only, subtle.
- No dashes in any customer facing copy. Not headings, not buttons, not body.
- Justin's voice throughout: warm, plain, direct, no AI-isms.

## 6. The risk test

Anything touching these is must fix territory by default and needs a human
eye before merge:

- Auth, payments (founder rate cap of 50 stays enforced in code), or
  migrations.
- Children's data. We are pre DPIA sign off: no new collection of a child's
  data without Justin's explicit yes, and deletion promises stay true.
- Scripts belong in the database (`scripts` table), never hardcoded.
- `DIGI_MODEL` stays a config value from the environment, never hardcoded.
- Unnecessary complexity: a dependency, an abstraction, or a service the
  ticket did not need is a finding.

## 7. The teacher test (the schools scheme)

Justin, 13 September 2026: "these lessons need to be better than Rosenshine,
White Rose, Oak, Jigsaw, the best possible teaching format, easy to use, teach,
and has everything a teacher needs. Top quality print, reporting, all the admin
at the push of a button, and constantly checked and updated to the latest tech
changes." Judge every schools change as the teacher who has never seen the
scheme, has a class in eleven minutes, and a projector that works:

- **Better than the four, by name.** Rosenshine: the arc is on the wall and
  the pass is computed from real questions. Oak: starter and exit quizzes, the
  words of every video beside it, a worksheet with an answer key, a learning
  record. Jigsaw: a settle, a pause, a character who carries the room. White
  Rose: a free progression map and small steps. A change that drops below any
  of these is a finding.
- **Everything a teacher needs, in one place.** Prep page, run sheet, the
  player with the script on every slide, the print pack, the parent note, the
  DSL note. If a teacher has to leave the product to teach the lesson, that is
  a must fix.
- **Easy to use.** One button from the module to teaching it. The script and
  the timing live on the slide, never in a document they have to open first.
- **Top quality print.** A4 in millimetres, photocopies clean in black and
  white, nothing flowing off the page, checked by printing rather than by
  reading the CSS.
- **Reporting and admin at a button.** The register, the marking and the
  report come from what the class did, never from the teacher typing it
  twice. This is the staffroom, not yet built; a change that makes it harder
  to build is a finding today.
- **Constantly checked and updated.** Every claim guarded in code, and the
  scheme refreshed when the world changes (a new law, a platform change, a new
  trial) through a routine with a human gate, never a silent edit.
- **A character in every lesson**, in the register of its key stage, so the
  wall is alive between slide two and the close and not only at the ends.
  A friend who fronts no lesson is not sold anywhere either: the front page
  cast is computed from the curriculum for that reason. Cosmo is the live
  exception and the open work, not the precedent
  (`plans/2026-09-14-cosmo-at-sixth-form-spec.md`).
