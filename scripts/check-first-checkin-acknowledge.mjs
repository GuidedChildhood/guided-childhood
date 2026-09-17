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
const STARTERS = 'app/api/checkin/starters/route.ts'
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
  // BOTH CALLS, COUNTED. The starters route is called twice, once to add and
  // once to remove, and a plain "does the path appear" check passed happily
  // with one of them pointed at a route that does not exist: half the screen
  // silently dead, the guard green. Caught in mutation testing.
  const startersCalls = (bare.match(/\/api\/checkin\/starters/g) ?? []).length
  if (!/\/api\/checkin\/confirm/.test(bare) || startersCalls < 2 || !/action:\s*'sorted'/.test(bare) || !/action:\s*'add'/.test(bare)) {
    fail.push(`${CARD}: the card no longer calls confirm and BOTH starters actions. Confirm is what makes tomorrow the first real check in; already sorted and add are what make this screen worth stopping on rather than a notice to tap past.`)
  }
  // NOTHING ON THIS SCREEN DELETES. Justin, 17 September 2026: "surely not us
  // is a bad option? Should be let's fix or fixed?" A worry a family has
  // already sorted is the best news in the account, and the first version of
  // this screen threw it away. Resting keeps it, and lets it come back on its
  // own if it recurs.
  if (/action:\s*'remove'/.test(bare) || /Not us/.test(bare)) {
    fail.push(`${CARD}: the delete is back. "Not us" judged the family rather than the situation, and deleting threw away the one row that says a family had already fixed something. Resting says the same thing and keeps the record, and it can be undone by tapping again.`)
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

const starters = read(STARTERS)
if (starters) {
  const bare = code(starters)
  if (!/concerns_confirmed_at/.test(bare) || !/status:\s*409/.test(bare)) {
    fail.push(`${STARTERS}: add and remove are not refused once the list is confirmed. Remove DELETES the row, which is honest on day one and catastrophic a fortnight later: it would throw away every reading, the weekly email's comparison and any passport stamp earned from it.`)
  }
  if (!/\.eq\('user_id',\s*user\.id\)/.test(bare)) {
    fail.push(`${STARTERS}: the write is not scoped to the signed in parent in the query itself. Row level security is the floor, not the whole wall.`)
  }
  if (/\.delete\(\)/.test(bare)) {
    fail.push(`${STARTERS}: this route deletes a concern. It used to, and it was the only irreversible button in the product, sitting on a screen a parent meets in their first two minutes next to a list the app itself guessed at. Already sorted rests the row instead: off the check in, kept in the record, back on its own if it recurs.`)
  }
  if (/score/.test(bare)) {
    fail.push(`${STARTERS}: a score is being written on day one. Resting through a status rather than a top band reading is the whole point: the first real number lands tomorrow with a day of watching behind it, rather than being invented here to make a row disappear.`)
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
for (const file of [CARD, PAGE, LOADER, CONFIRM, STARTERS, MIGRATION]) {
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
