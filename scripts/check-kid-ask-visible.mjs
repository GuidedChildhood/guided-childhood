// A BADGE HAS TO LAND ON THE THING IT COUNTS.
//
// Justin, 16 September 2026, with two photos of the child app: "the quest tab
// has a 2 first image but when i click on quests there is none?"
//
// The number was never wrong. The Quests badge counts `waitingOnGrownUp` in
// KidQuestScreen: this child's own pending job ideas plus a live screen time
// ask. Tapping it opens the jobs page, which lists only the jobs a grown up has
// SENT. Two different things wearing one name, so a child with two asks
// outstanding tapped a 2 and read "No jobs today", with the badge itself gone
// from the bar because the jobs page passed no count at all.
//
// Read against the live database for the child in the photo: one pending job
// idea, one live screen time ask. Both real, neither reachable.
//
// This guard holds the four properties that made it a lie, and nothing else:
//
//   1. The jobs page READS both kinds of ask.
//   2. It reads the pitched ones with no time window, the way the ask cap
//      counts them (a week window is its own old bug, 14 September).
//   3. The page SHOWS them.
//   4. The bar keeps the count on arrival.
//
// None of it is visible to a typecheck: a page that reads nothing, shows
// nothing and passes nothing is perfectly valid code, and the symptom is a
// number that looks invented.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const CARD = 'components/kid/KidWaitingAsks.tsx'
const SCREEN = 'app/k/[token]/jobs/KidJobsScreen.tsx'
const PAGE = 'app/k/[token]/jobs/page.tsx'
const CHROME = 'components/kid/KidScreenChrome.tsx'
const BAR = 'components/kid/KidTabBar.tsx'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
// Comments in these files recount the bug in full, so they have to come out
// before anything is read as code, or a guard passes on its own explanation.
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── 1. THE CARD ITSELF ──────────────────────────────────────────────────────
const card = read(CARD)
if (card) {
  // Read the CODE, not the file. The comment at the top of that card quotes
  // its own heading, so a check against the raw text passed happily against a
  // version whose heading had been renamed: the guard was reading its own
  // explanation back to itself. Caught in mutation testing, 16 September 2026.
  if (!/Waiting for their yes/.test(code(card))) {
    fail.push(`${CARD}: the words "Waiting for their yes" are gone. That heading is the whole job of this card: it names, in the child's own language, what the number on their Quests tab is counting.`)
  }
  const bare = code(card)
  if (!/kind:\s*'screen'/.test(bare) || !/kind:\s*'job'/.test(bare)) {
    fail.push(`${CARD}: the card no longer handles both kinds of ask. A child's badge counts pitched jobs AND a screen time ask, so a card that renders one of them sends the other back into the dark.`)
  }
}

// ── 2. THE PAGE READS BOTH KINDS, AND READS THEM THE WAY THE BADGE DOES ─────
const page = read(PAGE)
if (page) {
  const bare = code(page)

  const pitched = bare.match(/from\('quest_requests'\)([\s\S]{0,400}?)(?=\n\s*supabase\.from|\n\s*\]\))/)
  if (!pitched) {
    fail.push(`${PAGE}: the page does not read quest_requests at all, so a child's own pitched job ideas cannot appear on the page their Quests badge opens. That is the exact fault Justin photographed.`)
  } else {
    if (!/\.eq\('status',\s*'pending'\)/.test(pitched[1])) {
      fail.push(`${PAGE}: the quest_requests read does not filter to pending. The badge counts pending asks only, so anything else here makes the page and the bar disagree about the same child.`)
    }
    // THE WINDOW IS THE OLD BUG, NOT A TIDY UP.
    //
    // Justin, 14 September 2026: the ask page said "Lots of ideas already
    // waiting" while the five for today sat at 4 of 5. His ideas were older
    // than the week the query looked at, so they were invisible here and
    // counted everywhere that mattered. The cap in app/api/quests/request
    // counts every pending row with no window, so this read must too.
    if (/\.gte\('created_at'/.test(pitched[1]) || /weekAgo/.test(pitched[1])) {
      fail.push(`${PAGE}: the quest_requests read has a time window on it. The ask cap counts EVERY pending row, so a child with older ideas gets told their asks do not exist while the cap still refuses them a new one. That is the 14 September bug, back on a different screen.`)
    }
  }

  if (!/from\('device_requests'\)/.test(bare)) {
    fail.push(`${PAGE}: the page does not read device_requests, so a live screen time ask is counted by the badge and shown nowhere. In the live data behind Justin's photo, that ask was one of the two.`)
  }
  // The CALL, not the import. An unused import satisfies a plain name check
  // while the ask sails past the freshness rule, which is the second thing
  // mutation testing caught here.
  if (!/isAskLive\(\s*String\(/.test(bare)) {
    fail.push(`${PAGE}: the screen time ask is not passed through isAskLive. Without it yesterday's ask is listed as though it were still live, which is the opposite failure: a badge of one and a card that never clears.`)
  }

  if (!/waiting=\{waiting\}/.test(bare)) {
    fail.push(`${PAGE}: the asks are read and then not handed to KidJobsScreen, so the page renders exactly as it did before and the read is dead weight.`)
  }
  if (!/waiting=\{waiting\.length\}/.test(bare)) {
    fail.push(`${PAGE}: the count is not handed to KidScreenChrome, so the badge vanishes from the bar the moment a child taps it. A number that disappears when you reach for it reads as a number that was never real.`)
  }
}

// ── 3. THE SCREEN SHOWS THEM ────────────────────────────────────────────────
const screen = read(SCREEN)
if (screen) {
  const bare = code(screen)
  if (!/<KidWaitingAsks\s+asks=\{waiting\}/.test(bare)) {
    fail.push(`${SCREEN}: KidWaitingAsks is not rendered with the waiting asks. The page can read every row it likes; this is the line that puts them in front of the child.`)
  }
  // The empty state must not invite an ask while the child already has some
  // pending: the cap counts those, so the invitation can be refused a moment
  // after it is offered.
  if (!/waiting\.length\s*>\s*0/.test(bare)) {
    fail.push(`${SCREEN}: the empty state no longer asks whether anything is waiting. It goes back to telling a child with asks already pending to go and ask for one, which the ask cap may refuse on the next tap.`)
  }
}

// ── 4. THE BAR CAN STILL DRAW IT ────────────────────────────────────────────
const chrome = read(CHROME)
if (chrome) {
  const bare = code(chrome)
  if (!/badges=\{\{[^}]*waiting[^}]*\}\}/.test(bare)) {
    fail.push(`${CHROME}: the bar is handed no waiting count, so every screen that opts into these tabs drops the badge. The jobs page is the one the badge OPENS, which is where losing it does the damage.`)
  }
}

const bar = read(BAR)
if (bar) {
  const bare = code(bar)
  if (!/key === 'quests' && waiting > 0/.test(bare)) {
    fail.push(`${BAR}: the Quests tab no longer draws a badge from the waiting count. Without it the number cannot appear at all, and every read behind it is wasted work.`)
  }
}

// ── 5. NO DASHES, ANYWHERE IN THE COPY ──────────────────────────────────────
// House rule, and this card is new copy a child reads.
if (card) {
  const dashes = card.match(/[‐-―−]/g)
  if (dashes) {
    fail.push(`${CARD}: ${dashes.length} dash character${dashes.length === 1 ? '' : 's'} in the file. No dashes in any copy, ever. Restructure the sentence instead.`)
  }
}

if (fail.length) {
  console.error('check-kid-ask-visible: the Quests badge points at something a child cannot see\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log('check-kid-ask-visible: the child\'s own asks are read, shown on the page their badge opens, and counted on the bar when they get there.')
