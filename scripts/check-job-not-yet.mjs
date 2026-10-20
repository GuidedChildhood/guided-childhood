// A "NOT YET" ON A JOB IS A SECOND GO, NOT A DEAD END.
//
// Audit, 13 October 2026. When a grown up tapped "not done yet" on a child's
// job tick, the loop broke in three places at once, and none of them is a type
// error:
//
//   1. The child was told nothing. A yes pushed their phone straight away, a
//      not yet sent no word at all, so the job just went back to looking
//      unticked.
//   2. Their list showed the rejected job as plain "to do", and the all done
//      check counted it as DONE, because it only asked whether a tick existed.
//   3. When the child did the job properly and ticked again, the one tick per
//      child per job per day key (migration 206) covers every status, so the
//      insert hit the rejected row. The tick route swallowed the duplicate,
//      still pushed the parent "X ticked off a job" with nothing to approve,
//      and the child's tick undid itself on the next poll.
//
// This holds the three fixes in place. Static source checks only.
//
//   node scripts/check-job-not-yet.mjs
//
// Node builtins only: the guard jobs run no npm ci.

import { readFileSync } from 'node:fs'

const TICK = 'app/api/quests/tick/route.ts'
const APPROVE = 'app/api/quests/approve/route.ts'
const LIST = 'components/kid/KidTodayList.tsx'

const fail = []
const pass = []
// Comments carry the words that explain the rule, so a guard reading the raw
// file could pass on a sentence in a comment. Strip them first.
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
const read = p => {
  try { return strip(readFileSync(p, 'utf8')) } catch { fail.push(`${p} is missing`); return '' }
}

const tick = read(TICK)
const approve = read(APPROVE)
const list = read(LIST)

// 1. A SECOND TICK REVIVES THE REJECTED ROW, IT DOES NOT RELY ON INSERT.
if (tick) {
  if (!/existing\?\.status === 'rejected'/.test(tick)) {
    fail.push(`${TICK}: no longer looks for today's rejected row before ticking. The insert will hit the migration 206 key and the child's second go is silently lost.`)
  } else if (!/\.update\(\{[\s\S]*?status: 'pending'[\s\S]*?\}\)[\s\S]*?\.eq\('status', 'rejected'\)/.test(tick)) {
    fail.push(`${TICK}: finds the rejected row but does not update it back to pending, so a "not yet" still cannot be ticked again.`)
  } else {
    pass.push('a tick on a "not yet" job revives the rejected row to pending')
  }

  if (!/let fresh = false/.test(tick) || !/if \(fresh\)/.test(tick)) {
    fail.push(`${TICK}: the parent push is no longer gated on a row actually being inserted or revived, so a swallowed duplicate tells the grown up there is something to approve when there is not.`)
  } else if (!/fresh = !error/.test(tick)) {
    fail.push(`${TICK}: an insert that hit the duplicate key still counts as fresh, so the parent is pushed about nothing.`)
  } else {
    pass.push('the parent is pushed only when a tick was really added or revived')
  }
}

// 2. "NOT YET" WRITES THE CHILD A NOTE.
if (approve) {
  const fn = approve.match(/async function tellChildNotYet[\s\S]*?\n\}/)
  if (!fn) {
    fail.push(`${APPROVE}: tellChildNotYet is gone, so a "not yet" reaches the child as silence again.`)
  } else if (!/from\('kid_nudges'\)[\s\S]*?\.insert\(\{[^}]*child_id[^}]*quest_id[^}]*message/.test(fn[0])) {
    fail.push(`${APPROVE}: tellChildNotYet no longer writes a kid_nudges row, so a child without push set up is never told.`)
  } else if (!/pushToChild\(/.test(fn[0])) {
    fail.push(`${APPROVE}: tellChildNotYet no longer pushes the child, which a yes still does.`)
  } else if (!/decision === 'reject'/.test(approve) || !/await tellChildNotYet\(/.test(approve)) {
    fail.push(`${APPROVE}: the reject path no longer calls tellChildNotYet.`)
  } else if (/[–—]|\s-\s/.test((fn[0].match(/`[^`]*`|'[^']*'/g) ?? []).filter(x => / /.test(x)).join(' '))) {
    fail.push(`${APPROVE}: the not yet note has a dash in it. No dashes in any copy, ever.`)
  } else {
    pass.push('a "not yet" writes the child a kind note and pushes it')
  }
}

// 3. REJECTED IS NOT DONE ON THE CHILD'S LIST.
if (list) {
  if (/quests\.every\(q => ticks\[q\.id\]\)/.test(list) || /quests\.filter\(q => ticks\[q\.id\]\)\.length/.test(list)) {
    fail.push(`${LIST}: the all done check is back to "any tick at all", which counts a rejected job as done and can throw the party over it.`)
  } else if (!/ticks\[q\.id\] !== 'rejected'/.test(list)) {
    fail.push(`${LIST}: the done count no longer excludes rejected ticks.`)
  } else {
    pass.push('a rejected job does not count towards all done')
  }

  if (!/notYet = st === 'rejected'/.test(list) || !/Have another go/.test(list)) {
    fail.push(`${LIST}: a rejected job has lost its own gentle state and looks untouched again.`)
  } else {
    pass.push('a rejected job shows Have another go and stays tappable')
  }
}

for (const p of pass) console.log(`PASS  ${p}`)
for (const f of fail) console.error(`FAIL  ${f}`)
if (fail.length) {
  console.error(`\ncheck-job-not-yet: ${fail.length} problem${fail.length === 1 ? '' : 's'}. See the header of scripts/check-job-not-yet.mjs.`)
  process.exit(1)
}
console.log('\ncheck-job-not-yet ok: a "not yet" reaches the child and can be ticked again')
