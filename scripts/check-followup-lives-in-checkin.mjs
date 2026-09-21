// A worry's follow up is asked in the check in, and nowhere else.
//
// ── THE MEASUREMENT THIS PROTECTS ───────────────────────────────────────────
//
// The same question, the same three taps, two places, read off this product's
// own tables on 21 September 2026:
//
//   inside the check in, about last night's script ....... 15 answered of 40
//   on a separate card, days later ........................ 0 answered of  6
//
// Same parents. The only difference is that the check in asks while the worry
// is already in their head. So on Justin's go ahead the question moved onto
// the worry row, above its stars, and stopped being a card.
//
// ── WHY A GUARD AND NOT A COMMENT ───────────────────────────────────────────
//
// Three separate files have to agree for the move to hold, and none of the
// three fails a build or a typecheck if it quietly stops agreeing:
//
//   1. The cron must not create a Home card when the follow up has a worry.
//   2. The prompts route must hide the cards already in the queue.
//   3. The check in must read what is waiting and render it.
//
// Break any one and the product goes back to asking twice on one morning, or
// stops asking at all. Both failures are invisible until somebody reads the
// tables weeks later, which is exactly how the 0 of 6 went unnoticed.
//
// Node builtins only, so it runs in the guards job with nothing installed.
//
//   node scripts/check-followup-lives-in-checkin.mjs

import { readFileSync } from 'node:fs'

const read = (p) => {
  try { return readFileSync(p, 'utf8') } catch { return null }
}

const problems = []

// ── 1. THE CRON ────────────────────────────────────────────────────────────
const CRON = 'app/api/cron/followups/route.ts'
const cron = read(CRON)
if (!cron) {
  problems.push(`${CRON} is missing, so nothing delivers a promised follow up at all.`)
} else {
  // The skip has to come BEFORE the card insert, or the card is made anyway.
  const skip = cron.search(/if\s*\(\s*f\.concern_id\s*\)/)
  const card = cron.search(/from\('digi_prompts'\)\s*\.insert/)
  if (skip === -1) {
    problems.push(
      `${CRON}: nothing skips the Home card for a follow up that has a concern_id. ` +
      `A worry's question belongs in the check in now; making the card as well asks it twice on one morning.`,
    )
  } else if (card !== -1 && skip > card) {
    problems.push(
      `${CRON}: the concern_id skip comes AFTER the digi_prompts insert, so the card is created before anything checks. ` +
      `Move the skip above the insert.`,
    )
  }
  // Skipping the card must still close the follow up, or the cron redelivers
  // the same promise every morning for ever.
  const between = skip !== -1 ? cron.slice(skip, skip + 700) : ''
  if (skip !== -1 && !/status:\s*'delivered'/.test(between)) {
    problems.push(
      `${CRON}: the concern_id branch does not mark the follow up delivered. ` +
      `It would be picked up again on every run, for ever.`,
    )
  }
}

// ── 2. THE PROMPTS ROUTE ───────────────────────────────────────────────────
const PROMPTS = 'app/api/digi/prompts/route.ts'
const prompts = read(PROMPTS)
if (!prompts) {
  problems.push(`${PROMPTS} is missing, so Home has no proactive queue.`)
} else {
  if (!/withoutWorryFollowUps/.test(prompts)) {
    problems.push(
      `${PROMPTS}: the follow up cards already in the queue are no longer filtered. ` +
      `Every unanswered follow up on the live account has a worry attached, so they would all come back as cards.`,
    )
  } else {
    // Both exits have to be filtered, and the check counts CALLS rather than
    // looking for the word near the return. A first version of this rule was
    // satisfied by `prompts: shown` whatever `shown` had been assigned from,
    // so deleting the filter and keeping the variable name passed it. Caught
    // by mutation testing, which is the only reason this line is here.
    const responses = [...prompts.matchAll(/NextResponse\.json\(\{\s*prompts:/g)].length
    const calls = [...prompts.matchAll(/withoutWorryFollowUps\s*\(/g)].length - 1 // minus the definition
    if (calls < responses) {
      problems.push(
        `${PROMPTS}: ${responses} prompt responses but the filter is called ${calls} time${calls === 1 ? '' : 's'}. ` +
        `Both exits have to run it, and the early return when something is already pending is the one that fires on a normal day.`,
      )
    }
  }
}

// ── 3. THE CHECK IN ────────────────────────────────────────────────────────
const LOADER = 'lib/checkin/today.ts'
const loader = read(LOADER)
if (!loader) {
  problems.push(`${LOADER} is missing, so there is no check in to move the question into.`)
} else {
  if (!/from\('digi_outcomes'\)/.test(loader) || !/\.is\('verdict',\s*null\)/.test(loader)) {
    problems.push(
      `${LOADER}: nothing reads the outcomes still waiting on a verdict. ` +
      `With the card gone too, the question would never be asked anywhere.`,
    )
  }
  if (!/followUp/.test(loader)) {
    problems.push(`${LOADER}: rows no longer carry followUp, so the check in has nothing to render.`)
  }
}

const VIEW = 'components/daily/ConcernCheckIn.tsx'
const view = read(VIEW)
if (!view) {
  problems.push(`${VIEW} is missing.`)
} else {
  if (!/Did you get to try it\?/.test(view)) {
    problems.push(`${VIEW}: the question itself is gone from the worry row.`)
  }
  if (!/\/api\/digi\/outcome/.test(view)) {
    problems.push(
      `${VIEW}: the answer no longer posts to /api/digi/outcome, so three taps would be collected and thrown away, ` +
      `which is the exact bug the follow up card had before it could be answered at all.`,
    )
  }
  // Above the stars, not below them. The whole point is that it is read on the
  // way to the rating rather than after the row is finished with.
  const question = view.indexOf('Did you get to try it?')
  const stars = view.indexOf('role="radiogroup"')
  if (question !== -1 && stars !== -1 && question > stars) {
    problems.push(
      `${VIEW}: the question renders BELOW the stars. A row is answered and folds away at the stars, ` +
      `so anything under them is never seen.`,
    )
  }
}

if (problems.length > 0) {
  console.error('check-followup-lives-in-checkin FAILED\n')
  for (const p of problems) console.error(`  ${p}\n`)
  console.error('15 of 40 against 0 of 6 is what this protects. See plans/decisions.md, 21 September 2026.')
  process.exit(1)
}
console.log('check-followup-lives-in-checkin ok: asked on the worry row, not on a card, and the answer is saved.')
