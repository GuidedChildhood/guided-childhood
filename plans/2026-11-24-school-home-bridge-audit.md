# School to home bridge audit (24 November 2026)

Read only audit of how the schools platform and the parents app work together,
whether the bridge works end to end today, and how to sell it. Code reading plus
local guards; no production reads. Every claim below has a file and line.

## Summary in five lines

1. The bridge exists and connects: parent note, QR and home code, the
   `/home-code/<code>` landing, the lessons page card, the signed share link,
   and the child's own lesson at home that fills the passport page.
2. The weak joint is the home code. Since migration 373 it writes one
   `lesson_coverage` row and nothing in either app ever reads that table, so the
   "record" the note and the card promise is invisible to the parent.
3. Five pieces of school facing or parent facing copy still say a class lesson
   or the home code fills or credits the passport. That stopped being true on
   12 October 2026 (decision: only the child's own check at home ticks a page).
4. The honest sell today is "one message at school and at home": the note, the
   tea question, the share link that opens the same lesson for the parent, and
   the same five page passport the child fills at home.
5. A passport film can be shot today from real screens. A two apps film can be
   shot today only if it ends on the child's own lesson and the passport, and
   skips any "it is on the record" moment until coverage is shown somewhere.

## Steps table

| # | Step | Status | Evidence |
|---|------|--------|----------|
| 1 | Teacher teaches; the passport beat on the wall fills the page on this screen only | WORKS | migration 297; `shared/components/PassportPage.tsx:24`, `:175`; `schools/app/hub/passport/HubPassport.tsx:14` |
| 2 | Paper pack prints the parent note (taught, tool, try this, Ask at tea or Say this tonight) | WORKS | `schools/app/print/[module]/page.tsx:340` to `:366` |
| 3 | Note prints the passport line, page name and area | WORKS | `schools/app/print/[module]/page.tsx:371` to `:376`; text in migration 373 |
| 4 | Note prints home code plus QR to `guidedchildhood.com/home-code/XXXX` | WORKS | `schools/app/print/[module]/page.tsx:101` to `:104`, `:381` to `:399`; `schools/lib/qr.ts:24`; guard `scripts/check-passport-bridge.mjs` passes |
| 5 | QR lands, signed out: page names the lesson and offers the starter pack | WORKS | `app/(marketing)/home-code/[code]/page.tsx:54` to `:131` |
| 6 | Signed out code survives sign up and is recorded for the new child | PARTIAL | `app/api/school-code/remember/route.ts:23` sends to `/starter-pack` with no `next`; `lib/starter/finish-setup.ts:163` redeems silently. The parent never sees the lesson again after onboarding |
| 7 | QR lands, signed in: redirect to the lessons page card with the code filled | WORKS | `app/(marketing)/home-code/[code]/page.tsx:61` to `:65`; `components/lessons/SchoolCodeCard.tsx:45` to `:53` |
| 8 | Parent enters code by hand | WORKS | `components/lessons/SchoolCodeCard.tsx:101` to `:135`; `app/api/school-code/route.ts:15`; `lib/school/home-code.ts:37` to `:46` |
| 9 | Code writes "met in class" for one named child | WORKS (write) | `lib/school/home-code.ts:71` to `:122`; table in migration 373 |
| 10 | Parent or child can SEE "met in class" anywhere | MISSING | only reader or writer of `lesson_coverage` is `lib/school/home-code.ts:98`, `:107`. The "We did this at school" chip was deferred to PR 5 (`plans/2026-10-09-curriculum-sync-plan.md:143` to `:147`) and is not built |
| 11 | Card links to the child's lesson path with that lesson focused | WORKS | `components/lessons/SchoolCodeCard.tsx:84` to `:86`; `app/(dashboard)/dashboard/lessons/path/page.tsx:44`, `:132` to `:136` |
| 12 | The child can do the same lesson at home tonight | PARTIAL | Members: the parent can make it this week's or Do it together (`lessons/path/page.tsx:157` to `:222`). Free or expired families: any module after the first shows "Opens with membership" (`lib/pathway/lesson-path.ts:245`, `lessons/path/page.tsx:165`). Pacing: one new school lesson per seven days for the child (`lib/pathway/lesson-path.ts:83`) |
| 13 | The child's pass fills the passport page; a full page plus the big check earns the stamp | WORKS | `app/k/[token]/school/[lessonId]/route.ts:14`; `lib/pathway/lesson-credit.ts:31`; `lib/pathway/stamped.ts:24`; stored stamps `lib/pathway/stamp-store.ts`, migration 378 |
| 14 | Parent sees what was taught | PARTIAL | Via share link: full note and lesson (`app/(marketing)/from-school/[module]/[token]/page.tsx:21` to `:27`). Via QR or code: title and one outcome line only; the tea question shows only after the child passes (`lessons/path/page.tsx:150`) |
| 15 | School share link per lesson, minted for a licence or pilot, opens at `/from-school/...` | WORKS in code, live status unverified | `schools/lib/parent-share.ts:35`; `schools/components/ParentShare.tsx:17`; `shared/parent-share.ts`; `npm run share-test` 12 of 12 pass. Fails closed if `PARENT_SHARE_SECRET` is unset on either Vercel project (`shared/parent-share.ts:30`); nothing in the repo confirms it is set |
| 16 | Share link sign up remembers the school and the home code | WORKS | `app/(marketing)/from-school/[module]/[token]/start/route.ts:30` to `:51`; `app/api/trial/start/route.ts:135` to `:139`; migration 386 |
| 17 | Newsletter school link `/s/<code>` attributes families to a school | WORKS | `app/s/[code]/route.ts`; migration 353; guard `scripts/check-school-link.mjs` passes |
| 18 | Parent pack page (`/hub/parents`) points parents at the app or the passport | MISSING | `schools/app/hub/parents/page.tsx` has no link, QR or blurb; the pilot page promises "a blurb to copy, a QR code" in the parent pack (`schools/app/pilot/page.tsx:55`). The copy message lives on each lesson page (`ParentShare.tsx:17`) and the QR on each note, so this is a wording gap more than a missing feature |
| 19 | Account linking between school and family | None by design | No pupil data. Only a pseudonymous school ref is stored on the profile (migration 386). Nothing goes back to the school |

## Broken promises (the most important finding)

Copy that describes something the parents app does not do today.

1. **Parent note, home code block.** "It opens your child's own passport record
   and notes that the class met today's lesson."
   `schools/app/print/[module]/page.tsx:396`. It opens the lessons page (or the
   starter pack), and the note it writes is never shown. Also "nothing shared
   back with us" on the same line should say "with the school": the parent is
   making an account with us. The landing page already says it correctly
   (`home-code/[code]/page.tsx:113`).
2. **Pupil booklet, For a grown up.** "and this lesson goes onto your child's own
   passport." `schools/app/print/[module]/booklet/page.tsx:271` to `:274`. False
   since migration 373: the code records coverage and ticks nothing. The sync
   plan said every such promise would be rewritten in PR 2; this one was missed.
3. **Hub passport page.** "The child's own passport is filled at home with the
   home code on the parent note." `schools/app/hub/passport/page.tsx:33` to `:34`.
   Same error. Only the child's own check fills the page.
4. **Schools home page and philosophy.** "School lessons earn credit toward the
   same passport." `schools/app/page.tsx:197` and
   `schools/app/philosophy/page.tsx:203`. Since 12 October a class lesson earns
   no credit; it is "met in class" and invisible.
5. **The record that nobody can see.** `/home-code` page: "This code records that
   the class met it, on your child's own passport"
   (`app/(marketing)/home-code/[code]/page.tsx:91`); lessons card: "it is on
   {child}'s record" and "Enter it here and {child}'s record shows the class met
   it" (`components/lessons/SchoolCodeCard.tsx:98`, `:155`). There is no screen
   that shows that record. Either build the "We did this at school" mark on the
   lesson path and the passport page, or change the words to "we have noted it".
6. **Lesson page, What this lesson earns.** "carries the home code that records it
   on the child's own passport" (`schools/app/lesson/[module]/page.tsx:444` to
   `:445`). Same invisible record. The next sentence is correct.
7. **Smaller.** "Parents carry the same lesson on that evening"
   (`schools/app/page.tsx:430`) is true for members and for share link families,
   not for a free or expired account on any module after the first. The pilot
   parent pack "blurb to copy, a QR code" (`schools/app/pilot/page.tsx:55`) is
   not on the parent pack page itself.

The guard `scripts/check-passport-bridge.mjs` passes because it checks that the
QR and code are printed, not what the words around them promise. One rule added
there ("no school surface says the code fills, credits or puts the lesson on the
passport") would hold 1 to 4 shut.

## 1. The bridge, piece by piece

**What leaves the classroom.** Each module's paper pack ends on Sheet 6, the
parent note, photocopied per pupil (`schools/app/print/[module]/page.tsx:340`).
In reading order: headline and what we taught (`parent_note.headline`, `taught`),
the module's tool, Try this at home, then Ask at tea (`family_question` with
Listen for and Then ask) or, on six heavy lessons, Say this tonight
(`say_this`), lines `:355` to `:366`. Then The passport box: the honest line from
migration 373 ("The class met it today; it goes on the page when your child does
its own short check at home, in their app") plus page and area from
`shared/passport-stages.ts` and `shared/passport-areas.ts` (`:371` to `:376`).
Then the home code block: QR, code `HOME-XXXX` (migration 230, one static code
per module, Crockford), and the typed URL (`:381` to `:399`; URL built in
`schools/lib/qr.ts:24` using `shared/home-code-link.ts`). The pupil booklet
carries a shorter For a grown up box (`booklet/page.tsx:265`).

**The question that comes home.** Stored on `school_lessons.parent_note`
(`family_question`, `listen_for`, `then_ask`, `say_this`; rewritten for all 34
in migration 373). It appears on the note, on the parent pack page per module
(`schools/app/hub/parents/page.tsx`, "The question coming home"), on the share
link teaser as Ask at home tonight, and in the parents app on each lesson the
child has passed (`app/(dashboard)/dashboard/lessons/path/page.tsx:150`).

**Where the link lands.** `/home-code/<code>`
(`app/(marketing)/home-code/[code]/page.tsx`). Signed in: straight to
`/dashboard/lessons?home=XXXX`, where `SchoolCodeCard` fills the field and
scrolls to it. Signed out: a page that names the lesson and offers Start your
child's passport (through `/api/school-code/remember`, which stores the code in a
30 day cookie and sends to `/starter-pack`) or Already have an account.

**Entering it.** One field and Record it on the lessons page
(`components/lessons/SchoolCodeCard.tsx`), posting to `/api/school-code`. It
needs a child; a code with no child is refused (`lib/school/home-code.ts:80`).

**What happens next.** One `lesson_coverage` row (child, module, `home_code`).
No completion, no stamp, no stars (`lib/school/home-code.ts:11` to `:25`). The
card then says the class met it and links to the child's lesson path with that
lesson focused. The passport page fills only when the child passes that lesson's
check at home, in the kid app (`app/k/[token]/school/[lessonId]`) or together on
the parent's phone. Nothing goes back to the school. No account linking.

**The second door, the share link.** On a licensed or pilot school's lesson page
the schools app mints a signed link (`schools/lib/parent-share.ts`,
`schools/components/ParentShare.tsx`) with a copy button and a ready message for
the newsletter. It opens `/from-school/<module>/<ref>.<sig>` in the parents app:
title, what the class learned and the tea question to anybody; the whole note and
the lesson in the together register to any signed in account. Sign up from there
carries the school ref and the home code through the starter pack, and returns
the parent to the lesson.

**The third door, the school link.** `/s/<code>` for a newsletter (migration 353).
Attribution only; lands on the stage check.

## 2. Does it work

See the steps table. In one paragraph: every route exists and the pieces connect;
`npm run share-test` (12 of 12), `check-passport-bridge`, `check-passport-areas`,
`check-lesson-path` and `check-school-link` all pass locally. What does not work
is the visible middle. A parent who scans the QR is told the lesson is "on the
record" and then finds that record nowhere, and a parent new to us is carried
into onboarding without the lesson being mentioned again. The end of the chain
(the child's own check filling the page) works, and is behind membership for any
module after the first of a stage.

## 3. The passport

**One passport, five pages, two apps.** Pages and stamps from
`shared/stage-map.ts:44` to `:50`: First steps (Pebble, EYFS and KS1), Good
habits (Bloop, KS2), Asking questions (Orbit, KS3), Making choices (Nova, KS4),
Ready at sixteen (Cosmo, KS5). Four areas on every page: Safe online, balance, AI,
social (`shared/passport-areas.ts:34`, guarded against the parents copy by
`scripts/check-passport-areas.mjs`). Every school module knows its page
(migration 277) and its area (`SCHOOL_MODULE_AREA`).

**In the schools app (no pupil data).**
- `/lesson/<module>`: What this lesson earns, the page drawn with this screen's
  count (`schools/app/lesson/[module]/page.tsx:432`).
- `/lesson/<module>/run`: the passport beat near the end of each deck; the class
  taps Fill the page, the ring moves, the seal stays open (migration 297,
  `shared/components/PassportPage.tsx`).
- `/hub/passport`: the five pages side by side with this screen's fill, ticks for
  lessons taught before the beat existed.
- `/print/passport` and `/print/passport/<stage>`: a paper passport to fold and a
  sticker sheet.

**In the parents app (per child).**
- `/dashboard/pathway#passport` (old `/dashboard/passport` redirects): image
  first, five planet stamps (colour when earned), the open page's count, one next
  step, what was learnt, and the printed passport to order
  (`app/(dashboard)/dashboard/pathway/page.tsx:60` to `:72`).
- `/dashboard/pathway/check`: the big five question check, which a child cannot
  fail.
- `/dashboard/keepsakes/passport-print` (plus `/record`, `/zine`, `/stickers`):
  printable book and record.
- `/verify/<code>`: the public check of a passport number `GC-XXXX-XXXX`
  (migration 227).
- Child side `/k/<token>`: a Passport tile opens `KidPassport` (the book, the
  pages, stickers, the steps to the next stamp); `/k/<token>/lessons` lists the
  school modules for the child's year; `/k/<token>/quiz` is the stage check.

**How a school lesson fills a page.** It does not, directly. The class meets it;
the note goes home; the child does the same lesson's short check at home; a pass
credits the module (`lib/pathway/lesson-credit.ts`), which counts toward the
page. **How a stamp is earned:** every lesson and script on the page done, AND the
big check passed by this child (`lib/pathway/stamped.ts:24`), stored once and
kept (migration 378). Never on a birthday, never at school.

## 4. How to sell it

Built from the WORKS rows only. Plain, warm, no dashes.

**(a) For heads and trusts.**
"Your lessons on phones and online life go home with a note and a question for
tea, so parents back up what you taught without your staff writing a word."

**(b) For parents.**
"When your child's class has a Guided Childhood lesson, you get the same lesson
and the words for the chat at home, and your child fills their own passport to
sixteen as they go."

**(c) Three proof points, each with a proof path.**
1. Every lesson sends a parent note with the question to ask at tea. Proof: open
   any paper pack, `schools.guidedchildhood.com/print/<module>`, last sheet.
2. A school can send any lesson home as one link, and the parent sees what the
   class learned and the question, with the whole lesson inside a free account.
   Proof: the lesson page share card (`/lesson/<module>` with a code) and
   `/from-school/...` in the parents app.
3. Home and school use one passport with the same five pages and four areas, and
   the child fills it at home with their own short checks. Proof:
   `/hub/passport` beside `/dashboard/pathway#passport`.

This lands squarely on Oak's two pointers (PSHE, and engagement with parents,
both costly in staff time) and on "alongside the parent" from the 23 November
call.

**(d) Do not claim yet.**
- That the home code "puts the lesson on the passport", "credits", "stamps" or
  "fills" anything. It does not since 12 October.
- That the parent can "see the class met it" or that it is "on the record". No
  screen shows it.
- That parents "carry the same lesson that evening" without saying how: true for
  members and share link families only.
- That the school can see which families joined or how pupils did at home. It
  cannot, by design, and that is a selling point to say plainly instead.
- Any number of families reached through schools: nothing is measured yet beyond
  `school_share_ref` and `school_link` attribution.
- That the share link is live, until `PARENT_SHARE_SECRET` is confirmed on both
  Vercel projects and one link is opened end to end.

## 5. Films

### Film 1: the passport

Real screens, made up data (a seeded demo family), in this order:
1. `schools.guidedchildhood.com/lesson/<module>/run`: the passport beat, the
   class taps Fill the page.
2. `/hub/passport`: the five pages side by side.
3. `/print/<module>`: the parent note's passport box (page and area).
4. `www.guidedchildhood.com/k/<token>`: the child opens the Passport tile.
5. `/k/<token>/lessons` then one school lesson ending in its check.
6. `/dashboard/pathway#passport`: the stamp row, the page count moving.
7. `/dashboard/pathway/check`: the big check (a child cannot fail).
8. `/dashboard/keepsakes/passport-print`: the printed passport and stickers.

Before filming: nothing to build. Set up one demo family with a passed lesson
and a near full page, and use the real routes rather than `/dev/kid-passport`
(dev routes 404 on production and read as staged). Keep the beat's words exact:
the wall fills a page on that screen only; the stamp is earned at home.

### Film 2: how the two apps work together

Real screens that work today, in this order:
1. `/lesson/<module>/run` in class (one slide plus the beat).
2. `/print/<module>` Sheet 6, the parent note: Ask at tea, the passport line, the
   QR.
3. Phone scans the QR: `/home-code/<code>` (signed out view, names the lesson).
4. Signed in: `/dashboard/lessons?home=XXXX`, the card filled, Record it.
5. Tap Open {child}'s lessons: `/dashboard/lessons/path?child=...&lesson=...`
   with the lesson focused; Do it together.
6. The lesson plays and passes; `/dashboard/pathway#passport` moves by one.
7. Alternative door: `/lesson/<module>` share card, then `/from-school/...`
   teaser and full lesson.

Must fix first so the film shows only what works:
- Change the card's success line (`SchoolCodeCard.tsx:155`) and the note's code
  block (`print/[module]/page.tsx:396`) so neither promises a record the parent
  cannot see; or build the "We did this at school" mark on the lesson path row
  and the passport page so step 4 has something to show.
- Film with a member demo family, or with lesson 1 of a stage, so step 5 is not
  "Opens with membership".
- Confirm `PARENT_SHARE_SECRET` is set on both projects before filming step 7.
- Optional: make `/api/school-code/remember` pass `next=/home-code/<code>` so a
  new parent returns to the lesson after onboarding, which is the one moment the
  film currently has to cut around.
