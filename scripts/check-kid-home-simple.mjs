// The child's home stays simple, checked without a browser (13 October 2026).
//
// Justin, with Teo's phone: "can we simplify the app home page first page ...
// super easy to follow through." Four agents reviewed the home that morning.
// What they found, and what each rule below keeps fixed:
//   every tab drew the whole home above itself, so Lessons and Printables
//     opened onto the same long page before the thing the child tapped
//   the red badges said 9+ every day, because "new" meant "never opened on
//     this phone", and a finished child was moved off the home by them
//   a job a grown up said "not done yet" to counted as done on the home
//   the "said yes" card priced stars at the flat rate, not the child's own
//   the presence nudge's "Do a job" scrolled to a list that no longer exists
//   the streak showed four times from four different counters
//
// Usage: node scripts/check-kid-home-simple.mjs

import { readFileSync } from 'node:fs'

let failures = 0
const check = (name, ok) => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
}
// Comments stripped, so a rule cannot be met by a comment naming the words.
const code = readFileSync('app/k/[token]/KidQuestScreen.tsx', 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const five = readFileSync('components/kid/KidFiveADay.tsx', 'utf8')

// ── EACH TAB IS ITS OWN PAGE ────────────────────────────────────────────────
check('the home knows which tab is Today', /const onToday = tab === 'quests'/.test(code))
check('the masthead and the day draw on Today only', (code.match(/\{onToday && \(<>/g) ?? []).length >= 2)
const askAt = code.indexOf('<KidAskBanner')
const before = code.slice(Math.max(0, askAt - 400), askAt)
check('the screen time ask is never hidden behind a tab', askAt > -1 && /<\/>\)\}\s*$/.test(before.trimEnd() + '\n') === false ? true : askAt > -1 && !/onToday && <KidAskBanner/.test(code))
check('a running timer shows on every tab', /\(onToday \|\| !!liveSession\) && \(!focusDay \|\| deviceOpen \|\| !!liveSession\)/.test(code))

// ── A RED NUMBER MEANS SOMETHING A GROWN UP SENT ───────────────────────────
check('the lessons badge counts star lessons still waiting, not the library', /const learnIds = missions\.filter\(m => m\.status === 'sent'\)/.test(code) && /const newWatch = 0/.test(code))
check('the printables badge counts only the sheet a grown up picked', /const printIds = assignedPrintable && !assignedSent \?/.test(code) && !/stagePrintables\.map\(p => `prn:/.test(code))

// ── THE LOOP IS HONEST ──────────────────────────────────────────────────────
check('a "not done yet" job is never counted done', /const isTicked = \(id: string\) => ticks\[id\] === 'pending' \|\| ticks\[id\] === 'approved'/.test(code) && !/quests\.filter\(q => ticks\[q\.id\]\)\.length/.test(code))
check('the yes card prices stars at the child\'s own rate', /q\.stars \* \(bank\?\.starMinutes \?\? STAR_MINUTES\)/.test(code) && !/q\.stars \* STAR_MINUTES\} minutes of screen time earned/.test(code))
check('a family job is thanked, never priced', /q\.is_family_job\s*\?/.test(code))
check('the yes refreshes the star bank', /setHappyNews\(\{[\s\S]{0,600}\}\)\s*playKidSound\('star'\)\s*router\.refresh\(\)/.test(code))
check('Use my time counts minutes at the child\'s own rate', /minutesReady=\{bankBalance \* \(bank\?\.starMinutes \?\? STAR_MINUTES\)\}/.test(code))
check('Do a job goes to the jobs, not to a list that left the page', !/getElementById\('my-todo'\)/.test(code))

// ── ONE STREAK ON THE SCREEN ────────────────────────────────────────────────
// Justin, 13 October 2026, chose "one streak, not four": the walkthrough found
// four counters from four props (the greeting's full days, the flame bar, the
// five a day's days in a row, the balance card's day streak). The flame bar,
// with the next Friend beside it, is the one that stays.
const fiveCode = five.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
check('the flame bar is still the streak', /<StreakBar completedStreaks=\{completedStreaks\} \/>/.test(code))
check('the five a day does not count its own days in a row', !/\{state\.streak\} day/.test(fiveCode))
check('the balance card carries no second streak', !/day streak/.test(code) && !/streakDays >/.test(code))
check('the greeting does not count full days', !/full day\$\{liveDays === 1/.test(code))

// ── THE REWARD IS ON THE THING TO TAP ───────────────────────────────────────
check('the jobs step wears its stars', /key === 'jobs' && jobsStarsLeft > 0/.test(five) && /jobsStarsLeft=\{/.test(code))

if (failures) { console.error(`\n${failures} kid home check(s) failed`); process.exit(1) }
console.log('\nKid home: simple and honest')
