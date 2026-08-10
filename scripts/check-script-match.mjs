// Does DiGi get handed the right scripts for a real parent question?
//
// Runs the matcher against a snapshot of the LIVE library rather than a made up
// one, because the bug this replaces was invisible on any small fixture: with
// twenty scripts the old threshold of two words looked fine, and it was only
// against 312 rows and a real one line question that it returned nothing.
//
// Usage: node --experimental-strip-types scripts/check-script-match.mjs
// Reads the library from scripts/fixtures/scripts-snapshot.json.
//
// The snapshot holds the 73 scripts the repo's own migrations insert, not the
// full 312 that are live: the rest were seeded before the current migration
// history. That makes this a LOWER BOUND rather than a weaker test. Rarity
// weighting is log(library size / scripts containing the word), so a smaller
// library gives every word a smaller score, and a case that clears the floor
// on 73 clears it by more on 312.

import { readFileSync } from 'node:fs'
import { matchScripts } from '../lib/digi/script-match.ts'

const scripts = JSON.parse(readFileSync(new URL('./fixtures/scripts-snapshot.json', import.meta.url), 'utf8'))

// The questions a parent actually types. Short and specific is the norm, and it
// is exactly what the old matcher could not serve.
// Asserted on sort_order, not on the title.
//
// The first version of this test matched titles against /tiktok/i and failed,
// and the matcher was right while the test was wrong: our TikTok scripts are
// called "The feed got dark and they did not choose it" and "They want to post
// videos of themselves", because titles are written in the words a parent would
// use rather than the platform's name. Asserting on the title was really
// asserting that we name scripts after brands, which we deliberately do not.
const CASES = [
  { q: 'my son will not get off snapchat', want: [9600, 9601, 9602, 9603] },
  { q: 'she wants tiktok', want: [9604, 9605, 9606] },
  { q: 'worried about snapchat streaks and the map', want: [9601, 9602] },
  { q: 'he keeps asking for instagram', want: [9607, 9608, 9609] },
  { q: 'someone added my daughter to a whatsapp group', want: [9611, 9612, 9613] },
  // The control. A greeting must return nothing: a script linked here would
  // teach a parent the links are noise.
  { q: 'hello', want: [] },
  { q: 'thanks that helped', want: [] },
]

// NOT TESTED HERE, and worth saying rather than hiding: AI and homework. The
// snapshot carries no school-and-ai scripts, because all 31 live ones were
// seeded outside the repo's migration history. The two letter floor that makes
// "AI" reachable is in the matcher and cannot be proven by this fixture.

let failures = 0
for (const c of CASES) {
  const hits = matchScripts(scripts, c.q)
  const titles = hits.map(h => h.title)
  const orders = hits.map(h => h.sort_order)
  const ok = c.want.length === 0
    ? hits.length === 0
    : hits.length > 0 && orders.some(o => c.want.includes(o))
  if (!ok) failures++
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${JSON.stringify(c.q).padEnd(48)} → ${hits.length}${titles.length ? '  ' + JSON.stringify(titles.slice(0, 2)) : ''}`,
  )
}

console.log(`\n${CASES.length - failures} of ${CASES.length} passed, across ${scripts.length} scripts.`)
process.exit(failures === 0 ? 0 : 1)
