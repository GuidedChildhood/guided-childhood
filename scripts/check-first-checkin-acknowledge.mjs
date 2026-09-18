// DAY ONE ACKNOWLEDGES. IT DOES NOT ASK FOR A NUMBER.
//
// Justin, 17 September 2026, after signing up a fresh account and going through
// his own first check in: "it's just to acknowledge first concerns raised so
// seems overkill to ask them to do a check in maybe we should just acknowledge
// they are added to solve first and are on next day ... and if any more moments
// to add so we keep addressing the issues and helping until they go away."
//
// READ FROM PRODUCTION ON THAT ACCOUNT, because the argument is a measurement
// rather than a preference:
//
//   20:58:40  account created
//   20:58:55  seven concerns written in one go
//   20:59:29  first rating
//   21:00:04  seventh rating
//
// Seven ratings in thirty five seconds, every one scored the same, ninety
// seconds after the account existed. That reading is what the weekly email
// compares against, what the passport stamp is earned from, and what sits
// behind every "is it getting better" sentence in the product. The instrument
// was anchored on a number taken before there was anything to read.
//
// FOUR THINGS HOLD THAT FIX IN PLACE, and every one of them is invisible to a
// typecheck because the old behaviour is perfectly valid code:
//
//   1. Day one returns a list to agree to, and no rows to score.
//   2. The cap is on the DAY and is three. It used to be five per render,
//      which is not a cap at all: answering five produced the next two on the
//      following load, which is exactly how seven happened.
//   3. The order is longest unasked first, which is what makes the cap a
//      rotation instead of a cliff. Newest first with a cap would leave a
//      worry at the bottom of the list for ever.
//   4. The confirmation is its own column. Reusing first_checkin_at would
//      switch on the review filter before any reading existed and delete the
//      family's baseline on the day they signed up, a bug already fixed twice.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const LOADER = 'lib/checkin/today.ts'
const PAGE = 'app/(dashboard)/dashboard/checkin/page.tsx'
const CARD = 'components/daily/ConcernAcknowledge.tsx'
const CONFIRM = 'app/api/checkin/confirm/route.ts'
const MIGRATION = 'supabase/migrations/304_first_checkin_acknowledge.sql'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
// Every one of these files explains the bug in its own comments, quoting the
// very strings this guard looks for. They come out before anything is read as
// code, or the guard passes on its own explanation.
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── 1. DAY ONE RETURNS A LIST TO AGREE TO, AND NOTHING TO SCORE ─────────────
const loader = read(LOADER)
if (loader) {
  const bare = code(loader)

  const branch = bare.match(/if\s*\(!confirmed\)\s*\{([\s\S]*?)\n  \}/)
  if (!branch) {
    fail.push(`${LOADER}: the day one branch is gone. Without it a family's first visit asks for a score again, which is the thing Justin measured: seven ratings in thirty five seconds, ninety seconds after signing up.`)
  } else {
    if (!/rows:\s*\[\]/.test(branch[1])) {
      fail.push(`${LOADER}: day one no longer returns an empty rows list. The page renders the rating card from rows, so anything in there is a star a parent is asked for before they have watched a single day.`)
    }
    if (!/acknowledge:\s*\{/.test(branch[1])) {
      fail.push(`${LOADER}: day one returns no acknowledge payload, so the page has nothing to show and a new family meets an empty check in.`)
    }
  }

  // The guarded read, and which way it fails. Missing column must mean
  // CONFIRMED, so an unmigrated environment behaves exactly as it did before
  // rather than sending every family on earth to the acknowledgement screen.
  if (!/confirmedRead\.error\s*\n?\s*\?\s*true/.test(bare)) {
    fail.push(`${LOADER}: a failed read of concerns_confirmed_at no longer falls back to treating the family as confirmed. Migrations run by hand here, so before 304 is applied that read fails for everybody, and failing the other way would hand the acknowledgement screen to households on week ten.`)
  }
  if (/select\('[^']*first_checkin_at[^']*concerns_confirmed_at/.test(bare) || /select\('[^']*concerns_confirmed_at[^']*first_checkin_at/.test(bare)) {
    fail.push(`${LOADER}: concerns_confirmed_at is being read inside the main profiles select. Naming a column that does not exist yet fails the WHOLE query it sits in, and that query is the check in. It belongs in its own read that is allowed to fail.`)
  }

  // ── 2. THE CAP IS ON THE DAY, AND IT IS THREE ────────────────────────────
  if (!/const DAILY_CAP = 3\b/.test(bare)) {
    fail.push(`${LOADER}: DAILY_CAP is not 3. Three is the number that keeps a day's check in under a minute, which is the whole point: a parent who is asked seven things answers them in five seconds each and means none of it.`)
  }
  if (!/DAILY_CAP\s*-\s*\(takenByChild/.test(bare)) {
    fail.push(`${LOADER}: the cap no longer subtracts what today has already taken, so it is a cap on the page rather than on the day. That is what it was before: answering five simply produced the next two on the following load.`)
  }
  if (!/mine\.slice\(0,\s*roomFor\(/.test(bare)) {
    fail.push(`${LOADER}: the rows asked for are not sliced by the room left today. Whatever the cap says, this is the line that decides how many questions a parent actually sees.`)
  }
  // ── THE CAP MUST NOT HAVE A SECOND, UNCOUNTED PATH ────────────────────────
  //
  // This rule exists because the one above passed while the cap was being
  // walked round in production. Justin, 18 September 2026: "today for Timbotee
  // it made me do check in twice?" Seven ratings in 49 seconds on a cap of
  // three, measured on the row.
  //
  // The slice was a ternary: roomFor on the branch with a child, plain
  // DAILY_CAP on the branch without one. A child who had used their three fell
  // out of the queue, which made `current` null, which took the second branch,
  // which refilled the page with three more. The cap enforced was the cap
  // bypassed.
  //
  // So: exactly one slice, and DAILY_CAP may only ever appear where the room
  // is worked out, never as a slice length of its own.
  if (/slice\(0,\s*DAILY_CAP\)/.test(bare)) {
    fail.push(`${LOADER}: something slices the day's questions by DAILY_CAP directly instead of by the room left. That is a second path with nothing subtracted, and it is exactly how a family with one child was asked seven questions on a day capped at three.`)
  }
  if ((bare.match(/\.slice\(0,\s*roomFor\(/g) ?? []).length !== 1) {
    fail.push(`${LOADER}: the day's questions are sliced in more or fewer than one place. One branch is what makes the cap true on every path.`)
  }
  // A worry with no child of its own still spends someone's allowance. Drop it
  // from the count and a household whose worries are all unassigned has a cap
  // that subtracts nothing, which is the same bypass by another door.
  if (!/const key = r\.child_id \?\? HOUSEHOLD/.test(bare)) {
    fail.push(`${LOADER}: a worry with no child of its own no longer counts against the household allowance, so those questions are capped against a total that never goes up.`)
  }
  // An empty queue means every child is finished or has nothing to answer.
  // Asking the whole list at that point is the bug above wearing a new coat.
  if (!/hasKids \? \[\] : answerable/.test(bare)) {
    fail.push(`${LOADER}: with no child in the queue the loader still falls back to the whole answerable list. An empty queue in a family that HAS children means everybody is done for today, so the answer is to ask nothing, not to ask everybody again.`)
  }
  if (/\.slice\(0,\s*5\)/.test(bare)) {
    fail.push(`${LOADER}: a hardcoded five is back. That literal is the old per render limit and it is what produced seven ratings in thirty five seconds.`)
  }
  // The queue has to agree with the cap, or the page says two are left about
  // questions it will not ask, which is a badge pointing at nothing.
  if (!/Math\.min\(answerable\.filter\(c => c\.child_id === k\.id\)\.length,\s*roomFor\(k\.id\)\)/.test(bare)) {
    fail.push(`${LOADER}: the queue count ignores the cap. A child whose three are done would still be listed as having worries outstanding, so the page promises questions it has decided not to ask.`)
  }

  // ── 3. LONGEST UNASKED FIRST ─────────────────────────────────────────────
  if (!/\.order\('last_checked_at',\s*\{\s*ascending:\s*true,\s*nullsFirst:\s*true\s*\}\)/.test(bare)) {
    fail.push(`${LOADER}: the check in is no longer ordered by longest unasked first. With a cap on the day, the order IS the rotation: newest first would park a worry at the bottom of the list for ever and the parent would never be asked about the thing they came here for.`)
  }
  if (/\.order\('last_flagged_at',\s*\{\s*ascending:\s*false/.test(bare)) {
    fail.push(`${LOADER}: newest flagged first is back on the check in query. Under a daily cap that buries every worry that is not the most recent one.`)
  }
}

// ── 4. THE PAGE SHOWS IT, AND STOPS THERE ───────────────────────────────────
const page = read(PAGE)
if (page) {
  const bare = code(page)
  if (!/if\s*\(acknowledge\)\s*\{[\s\S]*?<ConcernAcknowledge/.test(bare)) {
    fail.push(`${PAGE}: the page does not render the acknowledgement when the loader asks for it. The loader can return whatever it likes; this is the line that puts it in front of a parent.`)
  }
  if (!/<ConcernAcknowledge[\s\S]{0,400}?\n  \}/.test(bare)) {
    fail.push(`${PAGE}: the acknowledgement branch does not return early. Everything below it belongs to a reading, including the child switcher and the redirect that rewrites ?child=, and none of it applies to a list you are agreeing to.`)
  }
  // The doorway for the thing that happened today and is on no list yet.
  if (!/Did anything else happen today\?/.test(bare)) {
    fail.push(`${PAGE}: the finished check in no longer asks whether anything else happened. That question is the only way a new worry joins the list between check ins, which is the half of Justin's ask that keeps the loop going until things go away.`)
  }
}

// ── 5. THE CARD ASKS FOR NO SCORE ───────────────────────────────────────────
const card = read(CARD)
if (card) {
  const bare = code(card)
  if (/concern-check|score|rating|stars/i.test(bare)) {
    fail.push(`${CARD}: the acknowledgement screen mentions a score, a rating or the check in API. It has one job, which is to show a parent their own words back. The moment it posts a number it becomes the thing it replaced.`)
  }
  // ── AND IT DOES NOT ASK THEM TO CURATE THE LIST EITHER ───────────────────
  //
  // Justin, 17 September 2026, on the version that had an Already fine chip on
  // every row and an Add another box: "they have only just raised the concerns
  // on the set up ... surely the very first check in just confirms they are
  // here on the check in tracker and we will track each day and provide
  // solutions?"
  //
  // A parent reaches this screen about forty seconds after typing those worries
  // into the sign up question. Nobody marks as already fine a thing they named
  // as hard less than a minute ago, and being asked to is the app admitting it
  // was not listening. One button, and out of the way.
  if (/checkin\/starters|action:\s*'sorted'|action:\s*'add'|Already fine|Add another|Not us/.test(bare)) {
    fail.push(`${CARD}: the editing controls are back on day one. The worries on this screen are under a minute old and they are the parent's own words, so asking them to prune or top up the list reads as the app not having heard them. Confirming is the whole job.`)
  }
  if (!/\/api\/checkin\/confirm/.test(bare)) {
    fail.push(`${CARD}: the card no longer calls the confirm route, so nothing records that the list was seen and the parent meets this screen again tomorrow instead of their first real check in.`)
  }
  // BOTH HALVES OF WHAT HAPPENS NEXT. Tracking on its own is a spreadsheet, and
  // the reason a parent signed up is the other half.
  if (!/give you something to\s*\n?\s*try|give you something to try/.test(bare)) {
    fail.push(`${CARD}: the screen promises to track but not to help. A parent did not come here for a chart, and this line is the only place on day one where the product says what it is actually for.`)
  }
}

// ── 6. THE CONFIRMATION IS ITS OWN COLUMN, AND EDITING CLOSES WITH IT ───────
const confirm = read(CONFIRM)
if (confirm) {
  const bare = code(confirm)
  if (!/concerns_confirmed_at:/.test(bare)) {
    fail.push(`${CONFIRM}: the confirm route does not write concerns_confirmed_at, so a parent is sent round the same screen tomorrow.`)
  }
  if (/first_checkin_at/.test(bare)) {
    fail.push(`${CONFIRM}: the confirm route touches first_checkin_at. That column means "they have given us a reading", and lib/checkin/today.ts keys the review filter off it. Setting it here switches that filter on before any reading exists and deletes the family's baseline on the day they sign up. That bug has already been fixed twice.`)
  }
}

// ── 7. THE MIGRATION EXISTS AND BACKFILLS ───────────────────────────────────
const migration = read(MIGRATION)
if (migration) {
  // SQL COMMENTS COME OUT FIRST. This file explains itself at length, and
  // commenting the backfill out left every word of it in place: the guard was
  // reading a disabled statement and calling it done. Caught in mutation
  // testing, the same way the JS comment stripping above earns its keep.
  const sql = migration.replace(/--.*$/gm, '')
  if (!/add column if not exists concerns_confirmed_at/i.test(sql)) {
    fail.push(`${MIGRATION}: the column is not added. Everything above it is reading something that is not there.`)
  }
  if (!/update profiles[\s\S]*concerns_confirmed_at = first_checkin_at/i.test(sql)) {
    fail.push(`${MIGRATION}: the backfill is gone. Without it, every family already using the product is handed a screen saying "these are the ones we start on" about worries they have been working on for months.`)
  }
}

// ── 8. NO DASHES, HOUSE RULE ────────────────────────────────────────────────
for (const file of [CARD, PAGE, LOADER, CONFIRM, MIGRATION]) {
  const src = read(file)
  const dashes = src.match(/[‐-―−]/g)
  if (dashes) {
    fail.push(`${file}: ${dashes.length} dash character${dashes.length === 1 ? '' : 's'} in the file. No dashes in any copy, ever.`)
  }
}

if (fail.length) {
  console.error('check-first-checkin-acknowledge: day one is asking for numbers again\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log('check-first-checkin-acknowledge: day one acknowledges, the day is capped at three, longest unasked comes first, and the confirmation has its own column.')
