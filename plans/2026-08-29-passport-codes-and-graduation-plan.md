# Passport codes, school and home sync, and graduation

Date: 29 August 2026. Lane: platform code (passport and schools bridge). Migration claimed: 227.
Commissioned by Justin: "We should have unique codes like passports, link onto or sync with
school lessons or can be done as home learning, please make a plan, research Cambridge idea."
Folded in from earlier this week: the graduation video gated on passing everything, and
"maybe we weave into passport as the cert also."

## 1. The Cambridge idea, identified

The referent is Professor Sander van der Linden, University of Cambridge, Social Decision
Making Lab. In Nature Health (February 2026) and in Cambridge's expert reaction to the UK
under 16 consultation, he argues against a blanket ban and proposes two things instead:

1. **A social media passport.** Controlled, gradual exposure to digital technology through
   the school years, starting in reception around age four (family photos, reading, drawing),
   graduating to educational video, then a simulated social network contained within school,
   then the real thing. His line: just as you cannot drive a car without a licence, maybe you
   should not navigate social media without a passport, possibly with verification at log on.
2. **Safety by design.** PG-13 feeds without engagement maximising algorithms, with a ban
   used only as a temporary lever until platforms pass transparent audits.

What this means for us, plainly: **a Cambridge professor has described our product in a
Nature journal.** The five stages are his gradual exposure programme. The passport is his
passport. The stage checks are his graduation gates. He proposed it; we have built it. That
is a positioning gift, and it also tells us exactly which part to finish next: his passport
only works if it can be **verified**. Ours currently cannot, because it is computed on the
fly and has no public number. This plan fixes that.

Two claims discipline notes. We never say or imply he endorses Guided Childhood; the
checkable claim is "he proposed it, this is what it looks like built." And his own evidence
framing (harms real, ban evidence weak, school phone ban studies find no effect) matches our
verified fact base, so the alignment is honest, not opportunistic.

## 2. What already exists (platform map, verified 29 Aug)

Full sweep in the session scratchpad; the load bearing facts:

- The passport is **computed, never stored**: `lib/pathway/progress.ts` (`contentComplete`
  is the stamp gate). Inputs: `lesson_completions`, `lesson_pass_by`, script completions,
  `stage_quiz_passes`. Extend this, never fork it.
- The `children` table has **no public identifier of any kind**. The only per child token is
  `kid_links.token` (18 hex chars), and that is a **credential** granting full child app
  access. It must never be printed on a passport or reused as a passport number.
- `lesson_completions` already accepts `lesson_source = 'school_lesson'` (check constraint
  since migration 023). The home credit slot for school work **already exists, unused**.
- Every `schools.school_lessons` row already carries a `parent_note` jsonb ("what we taught
  today, and one thing to try at home", `no_login_required: true`). The school to home
  bridge content **is already written and currently goes nowhere**.
- The schools app is deliberately stateless: anon client only, and the locked privacy
  promise in writing: "Class codes, not pupil accounts. No emails, no dates of birth, no
  logins", "no session, no user and no personal data of any kind", THE-STORY.md: "we hold
  no assessment data on children." Nothing in this plan may move that line.
- Public no login page pattern to copy: `app/m/[id]/page.tsx` (shared moment card).
- Code as a door pattern to copy: `schools/lib/access.ts` (compare only, delay on a miss).
- Print channel that already carries personalisation to fulfilment:
  `app/api/shop/checkout/route.ts` attaches `personalisation: { childName, childId }`.
- Migration numbers: highest on origin/main is 226, the gap at 207 stays a gap, **next free
  is 227**, claimed by this plan's draft PR. Only open PR is #921 (homepage lane, no
  migrations).

## 3. Design rules (from the credential research)

From the Cambridge exams model, Duolingo English Test, DofE award validation, iDEA and the
Blue Peter badge failure of 2006:

1. **Two part identity.** Issuer locus plus candidate. Venue vouches for identity, the
   platform vouches for the result (the Cambridge centre and candidate split).
2. **The document is a pointer, the database is the credential.** Code and QR on every
   printed passport; a printout without a live check is "not official" (Duolingo pattern).
3. **Exact match or silence.** The verify page confirms or says "not found", and never
   leaks name, school, age or stage to a guesser (DofE pattern: code plus date in, "Award
   found" or "Invalid request" out).
4. **Same syllabus, any venue, one certificate.** The stamp records the pass and the date,
   never whether it was earned at school or at home (the Cambridge private candidate
   route). This one decision makes school and home sync a data model, not a feature.
5. **Verification precedes privileges.** Blue Peter learned it the hard way: an
   unverifiable child credential with real privileges was farmed within weeks.

And the market fact worth keeping: **no UK scheme gives an under 16 a per child, publicly
verifiable internet readiness credential.** iDEA is closest and is a different category
(enterprise skills). This is a genuine first in the niche, assembled from trusted patterns.

## 4. The build, in order

### Phase 1. The passport number (SMALL) — migration 227

`children.passport_code text unique`, human readable Crockford base32 in the shape
`GC-XXXX-XXXX` (no ambiguous characters, easy to read out loud), generated with a collision
retry, backfilled for every existing child. Surfaced in three places: the parent flip book
(`PassportBook.tsx`), the child's passport (`KidPassport.tsx`), and the keepsakes checkout
`personalisation` payload so the printed passport carries its own number and QR. No privacy
movement at all: the code alone reveals nothing until Phase 2 ships, and even then only
what Phase 2 chooses to show.

### Phase 2. The verify page (MEDIUM) — `/verify/[code]`

Copied from the `app/m/[id]` pattern: public, no login, regex validated input, admin client
read, minimal render. Shows first name, stamps earned with dates, and nothing else, with
one CTA to the stage check. Exact match or silence throughout. Route note: `/passport` is
taken by marketing and `/dashboard/passport` is a dead redirect shim that stays dead, so
`/verify/[code]` it is. One line goes in the DPIA already on the go live checklist: a
child's first name and stamp dates are reachable by anyone holding the printed code, by
design, and by nobody else.

### Phase 3. The school and home bridge (SMALL to MEDIUM) — bridge a only

Static **home codes per school module**, seeded on `schools.school_lessons` (one nullable
column, same pattern as the scaffold column in 221), delivered through the `parent_note`
that every school lesson already carries, on the photocopied sheet home. A parent (or the
child in the kid app) enters the code at home; a small redemption route writes a
`lesson_completions` row with `lesson_source = 'school_lesson'`. The whole class shares one
code per module, which is fine because this is **credit, not assessment**: the school said
"we covered this", the passport records it, and design rule 4 means the stamp never says
which door it came through. Home educators use the same codes from the pack, which is the
"or can be done as home learning" half of the request answered by the same mechanism.

### Phase 4. Graduation woven into the passport

- **The certificate is the final page of the passport**, not a separate artefact. When
  every stage's lessons and quizzes are passed, the last spread renders as the completion
  certificate: name, passport code, date, QR to `/verify/[code]`. One keepsake, printable.
- **The graduation film** unlocks on the same gate (all lessons and tests passed, passport
  earned): one master film per stage close with a personalised end card, the child's name
  and their code. Assets via the lesson-video pipeline later; the gate ships first.
- **At sixteen, a readiness review, never a verdict.** In line with the law (the
  `social_media_law` flag drives the wording), the passport's closing page says the
  preparation is complete and walks the family through the first accounts. The certificate
  wording is fixed now and non negotiable: it says the child **completed the preparation**,
  with stage, score and date. It never says "safe" or "ready for social media". "Passed
  Stage 4, 14 March 2027, verify at guidedchildhood.com/verify" is defensible forever;
  "certified safe online" is mockery and liability in one line.

### Phase 5. The recognition ladder (not built now, designed for)

Justin's long game: platforms or employers asking for an earned passport at sixteen, van
der Linden's "verification at log on". We do not build for that yet, but Phase 1 and 2 are
exactly the substrate it needs (a per child code plus a public verifier), and we keep the
data model compatible with Open Badges 3.0 so a future export is a mapping, not a rebuild.
First rungs when the time comes: schools recognising home earned stamps (Phase 3 already
does this in reverse), then youth organisations, then the ban era conversation with
platforms once Spring 2027 makes age assurance everyone's problem.

## 5. Do not build, do not touch

- Bridge b (class codes entered at home): needs teacher accounts and lesson delivery state
  the schools app deliberately does not have. LARGE and premature.
- Bridge c (pupil identity sync): violates three locked privacy positions in writing. Never.
- The `kid_links` token stays secret and is never printed anywhere.
- The name "digital passport" is never used in UK school marketing: it is the UKCIS tool
  for children in care. Ours stays "the passport" and "the passport to sixteen".
- `/dashboard/passport` tabs stay dead; migration 218 (`stage_arrivals`) owns every age
  triggered DiGi moment, so any "your child's class covered X" nudge goes through it, not
  through a second trigger system; school credit stays beside the road like the
  SchoolChest, never a stone a parent can be behind on; codes live in the database
  (non negotiable 6).

## 6. Marketing, once Phase 1 and 2 exist

One LinkedIn piece, held until the verify page is live so every claim has a proof path:
"A Cambridge professor proposed a social media passport in Nature Health. Here is what it
looks like built." The claims are checkable (his proposal is public, our passport is
verifiable at a URL), the alignment note from section 1 applies (proposed, not endorsed),
and it slots into the series calendar after the Settlement Papers week. Not before.

## 7. Order and size

1. Migration 227 plus code surfacing (Phase 1): small, one PR.
2. `/verify/[code]` (Phase 2): medium, same PR or the next.
3. Bridge a (Phase 3): small to medium, its own PR, touches the schools repo pack sheets.
4. Graduation gate and certificate spread (Phase 4): medium, after 1 and 2.
5. Film assets and the sixteen review copy: later, gated behind Phase 4.

## 8. Needed from Justin

- A yes to this order, or a reorder.
- Whether the graduation film per stage is commissioned now (lesson-video pipeline) or
  after launch week. Recommendation: after; the gate and certificate ship without it.
- Nothing else. The DPIA line is drafted here, the migration number is claimed in the PR.
