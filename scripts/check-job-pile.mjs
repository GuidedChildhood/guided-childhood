// Does an untouched job land in the pile a parent would expect?
//
// Justin, 11 August 2026, on a job filed under "To do with you" while the child
// app was set up on the same screen: "why does this say not on their app as in
// this case there is a child app set up as you can see?"
//
// Usage: node --experimental-strip-types scripts/check-job-pile.mjs

import { pileFor } from '../lib/quests/job-pile.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const TEO = 'teo', ALMA = 'alma'
const family = [TEO, ALMA]
const linked = new Set([TEO])
const none = new Set()

// ── The bug ─────────────────────────────────────────────────────────────────
//
// A whole family job carries child_id null, and lib/kid/jobs-read.ts fetches a
// child's list with `child_id.eq.<id>,child_id.is.null`, so it is already on
// Teo's screen. The old rule sent it to "To do with you" anyway.
check('a family job goes to their app once one child is linked',
  pileFor(null, linked, family) === 'sent', pileFor(null, linked, family))
check('and undefined is treated the same as null',
  pileFor(undefined, linked, family) === 'sent')

// ── What still belongs to the parent ────────────────────────────────────────
check('a family job with no app anywhere is the parent\'s to mark',
  pileFor(null, none, family) === 'withyou')
check('and so is a job for the one child without an app',
  pileFor(ALMA, linked, family) === 'withyou')
check('while the linked child\'s own job is on their app',
  pileFor(TEO, linked, family) === 'sent')

// ── Teo having an app does nothing for Alma ─────────────────────────────────
//
// The fix must not overreach into "somebody in the house has an app, so
// everything is sent". A job addressed to Alma is on nobody's screen.
check('one child\'s app does not cover a job addressed to the other',
  pileFor(ALMA, linked, family) === 'withyou')

// ── A link to a child who is gone cannot vote ───────────────────────────────
//
// hasApp is built from kid_links, which can outlive the child row. Counting a
// stale link would put a family job on an app that nobody opens.
check('a link for a deleted child does not send a family job',
  pileFor(null, new Set(['deleted-child']), family) === 'withyou')

// ── The empty house ─────────────────────────────────────────────────────────
check('no children at all means nothing is on an app',
  pileFor(null, none, []) === 'withyou')

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
