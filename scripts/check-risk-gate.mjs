// Does the free text gate actually catch what a frightened parent types?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// The gate decides whether the starter quiz reveal sells a product or hands
// over a phone number, and it is the only thing standing between a parent who
// types "she said she doesn't want to be here" and a marketing card with their
// words set as the heading.
//
// It shipped broken. The normaliser kept apostrophes while the patterns
// assumed they had been stripped, so the most likely sentence in the whole set
// did not match. Nothing errored. The page simply sold, which is exactly what
// a false negative looks like from the outside: nothing.
//
// A safety gate that can fail silently gets a test that runs on every push.
//
// Usage: node --experimental-strip-types scripts/check-risk-gate.mjs

import { needsHelpFirst } from '../lib/concerns/risk.ts'

let failures = 0
const hit = (text) => {
  const ok = needsHelpFirst(text)
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  catches: ${JSON.stringify(text)}`)
}
const miss = (text) => {
  const ok = !needsHelpFirst(text)
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  lets through: ${JSON.stringify(text)}`)
}

// ── THE SENTENCES THIS EXISTS FOR ───────────────────────────────────────────
// Apostrophes in all three forms, because a parent types fast on a phone.
hit("she said she doesn't want to be here any more")
hit('she said she doesn’t want to be here any more')
hit('she said she doesnt want to be here')
hit('he told me he wants to die')
hit('I found cuts on her arm')
hit('worried about self harm')
hit('worried about self-harm')
hit('she has been cutting herself')
hit('he keeps saying he would be better off without us')
hit('talking about suicide in a group chat')
hit('she has stopped eating')
hit('making herself sick after meals')
hit('an older man has been messaging her')
hit('someone asked her for naked pictures')
hit('SHE SAID SHE DOESNT WANT TO BE HERE')

// ── AND THE ORDINARY WORRIES IT MUST NOT SWALLOW ────────────────────────────
// A false positive shows a frightened helpline to somebody who did not need
// it, which is a small harm but not a free one: it would fire on every parent
// if the list were loose.
miss('speaking on phone a lot as friend has a new one')
miss('getting off the Switch at teatime')
miss('she will not put the tablet down')
miss('he is tired in the mornings')
miss('too much youtube after school')
miss('arguing about bedtime every night')
miss('')
miss(null)
miss(undefined)
// "die" inside another word must not fire it.
miss('he loves playing among us and dies a lot in it')

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
