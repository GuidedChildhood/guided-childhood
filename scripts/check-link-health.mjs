// Can we tell when the child's app has gone off the phone?
//
// Justin, 11 August 2026: "I've lost the app on my child's phone, deleted, and
// this may happen to users, so if we are able to see the app gone we can flag a
// quick share this code to put it back on the child's device."
//
// Home read kid_links.last_seen_at as a boolean, true once the child had EVER
// opened their app, so a family whose app was opened in March and deleted in
// April looked identical to one using it this morning.
//
// Half of these checks are about not crying wolf. A card telling a parent their
// child has deleted the app, during a half term when the child simply had
// nothing to tick, is the app inventing a problem in a family that does not
// have one.
//
// Usage: node --experimental-strip-types scripts/check-link-health.mjs

import { linkHealth, daysSinceSeen, linkHealthLine } from '../lib/kid/link-health.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const NOW = Date.parse('2026-08-11T12:00:00Z')
const daysAgo = n => new Date(NOW - n * 86400000).toISOString()

// ── Never opened is setup, not loss ─────────────────────────────────────────
check('no link at all is never, not gone', linkHealth(null, NOW) === 'never')
check('and an empty string is too', linkHealth('', NOW) === 'never')
check('and so is a timestamp we cannot read',
  linkHealth('not a date', NOW) === 'never', linkHealth('not a date', NOW))

// ── In use ──────────────────────────────────────────────────────────────────
check('opened this morning is live', linkHealth(daysAgo(0), NOW) === 'live')
check('opened three days ago is live', linkHealth(daysAgo(3), NOW) === 'live')

// ── NOT CRYING WOLF, which is most of the point ─────────────────────────────
check('a week off says nothing', linkHealth(daysAgo(7), NOW) === 'live')
check('and thirteen days still says nothing',
  linkHealth(daysAgo(13), NOW) === 'live', linkHealth(daysAgo(13), NOW))
check('a fortnight is quiet, which is noted and not announced',
  linkHealth(daysAgo(14), NOW) === 'quiet')
check('a whole half term of quiet is still not called gone',
  linkHealth(daysAgo(21), NOW) === 'quiet')
check('nothing is said to a parent until a month has passed',
  linkHealthLine(linkHealth(daysAgo(21), NOW), 'Teo', 21) === null)

// ── And then it says so ─────────────────────────────────────────────────────
check('a month with nothing opened is gone', linkHealth(daysAgo(30), NOW) === 'gone')
check('and so is three months', linkHealth(daysAgo(95), NOW) === 'gone')

const line = linkHealthLine('gone', 'Teo', daysSinceSeen(daysAgo(30), NOW))
check('the parent gets a line about it', line !== null)
check('and it names the child', /Teo/.test(line.title), line.title)
check('and it says how long, in weeks a parent can check',
  /month|weeks/.test(line.title), line.title)

// ── NEVER AN ACCUSATION ─────────────────────────────────────────────────────
//
// "They have deleted it" is a guess, and a guess about a child put to a parent
// is the same mistake the recommender made with its heaviest scripts.
check('it never accuses the child of deleting anything',
  !/delet\w*|removed it|got rid/i.test(line.title + ' ' + line.body), line.body)
check('it says what we can actually see',
  /has not been opened|has been quiet|Nothing has been ticked/i.test(line.title + ' ' + line.body))
check('and it hands over the fix',
  /send the link again/i.test(line.body))

// ── Counting days ───────────────────────────────────────────────────────────
check('days since is whole days', daysSinceSeen(daysAgo(30), NOW) === 30, String(daysSinceSeen(daysAgo(30), NOW)))
check('and null when never seen', daysSinceSeen(null, NOW) === null)

// ── A clock skewed into the future is not evidence ──────────────────────────
check('a future timestamp reads as just seen',
  linkHealth(new Date(NOW + 86400000 * 3).toISOString(), NOW) === 'live')

// ── House rules ─────────────────────────────────────────────────────────────
check('no dashes in the copy', !/[-–—]/.test(line.title + line.body))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
