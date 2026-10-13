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

import { readFileSync, readdirSync } from 'node:fs'

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
check('a running timer shows on every tab', /\{\(onToday \|\| !!liveSession\) && \(\(\) => \{/.test(code))

// ── A RED NUMBER MEANS SOMETHING A GROWN UP SENT ───────────────────────────
check('the lessons badge counts star lessons still waiting, not the library', /const learnIds = missions\.filter\(m => m\.status === 'sent'\)/.test(code) && /const newWatch = 0/.test(code))
check('the printables badge counts only the sheet a grown up picked', /const printIds = assignedPrintable && !assignedSent \?/.test(code) && !/stagePrintables\.map\(p => `prn:/.test(code))

// ── THE LOOP IS HONEST ──────────────────────────────────────────────────────
check('a "not done yet" job is never counted done', /const isTicked = \(id: string\) => ticks\[id\] === 'pending' \|\| ticks\[id\] === 'approved'/.test(code) && !/quests\.filter\(q => ticks\[q\.id\]\)\.length/.test(code))
check('the yes card prices stars at the child\'s own rate', /q\.stars \* \(bank\?\.starMinutes \?\? STAR_MINUTES\)/.test(code) && !/q\.stars \* STAR_MINUTES\} minutes of screen time earned/.test(code))
check('a family job is thanked, never priced', /q\.is_family_job\s*\?/.test(code))
check('the yes refreshes the star bank', /setHappyNews\(\{[\s\S]{0,600}\}\)\s*playKidSound\('star'\)\s*(markSinceSeen\(\)\s*)?router\.refresh\(\)/.test(code))
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

// ── THE FIVE ARE DONE: THE FAMILY MOONWALKS ON ──────────────────────────────
// Justin, 13 October 2026: when the five land, each Planet Friend moonwalks on
// with a tip for earning stars, instead of the rocket. The rocket's flight is
// skipped after the parade; the earned Friend's arrival card still follows.
// And no clearProps 'all' anywhere in the child's components: it wipes the
// whole inline style, which left the arrival card's name and button as dark
// words on a night sky.
const parade = readFileSync('components/kid/KidFriendsParade.tsx', 'utf8')
check('the parade plays after the day screen and hands on to the arrival without a flight',
  /setParadeOpen\(true\)/.test(code) && /<KidFriendsParade/.test(code) && /setArrivalSkipFlight\(true\)/.test(code) && /skipFlight=\{arrivalSkipFlight\}/.test(code))
check('all five Friends have a tip', ['pebble', 'bloop', 'orbit', 'nova', 'cosmo'].every(k => new RegExp(`${k}: '`).test(parade)))
check('the parade can always be skipped', />\s*Skip\s*</.test(parade))
const wipes = readdirSync('components/kid').filter(f => f.endsWith('.tsx')).filter(f => /clearProps: 'all'/.test(readFileSync(`components/kid/${f}`, 'utf8')))
check(`no clearProps 'all' in the child's components${wipes.length ? ` (${wipes.join(', ')})` : ''}`, wipes.length === 0)

// ── A CHILD'S LESSONS ARE THAT CHILD'S OWN ──────────────────────────────────
// Justin, 13 October 2026, on Teo's "9 of 10": he had passed none himself and
// eight were rows with no child on them. He chose "only Teo's own". Every per
// child lesson count reads one rule, so the badge, the planets and the stamp
// agree; a household row counts for nobody's badge.
const scopeSrc = readFileSync('lib/lessons/child-scope.ts', 'utf8')
check('the child lesson rule never adds the household rows', /childId \? `child_id\.eq\.\$\{childId\}` : null/.test(scopeSrc) && !/is\.null/.test(scopeSrc.replace(/\/\/.*$/gm, '')))
check('the lesson count leaves household rows out unless asked', /household = false,/.test(readFileSync('lib/pathway/lesson-path-server.ts', 'utf8')))
for (const f of ['lib/pathway/lesson-path-server.ts', 'lib/pathway/journey.ts', 'lib/pathway/progress.ts']) {
  const src = readFileSync(f, 'utf8')
  const lessonReads = src.split('\n').filter(l => /from\('lesson_completions'\)/.test(l))
  check(`${f} reads a child's lesson passes through lessonScopeFor`, /lessonScopeFor\(childId\)/.test(src) && !lessonReads.some(l => /is\.null|childScope\(/.test(l)))
}

// ── THE DAY FIRST, ONE REWARD CARD, THE PARENT LINK (13 October 2026) ──────
// Justin chose all four: the five a day at the top (the greeting and the day
// one card), one reward card never locked, reminders asked after the first
// finished day, and the parent link (waiting line, Since you last looked).
const mastAt = code.indexOf('<KidWeekMasthead')
const fiveAt = code.indexOf('<KidFiveADay')
const schoolAt = code.indexOf('<KidSchoolBanner items={schoolToday}')
const rewardAt = code.indexOf('<KidRewardCard')
check('the greeting and the five a day are one card at the top',
  mastAt > 0 && fiveAt > mastAt && fiveAt - mastAt < 2500 && /<KidWeekMasthead\s+joined/.test(code) && /onStateChange=\{onTodayState\}\s+joined/.test(code))
check('the school diary is one slim line below the day', schoolAt > fiveAt && /weekCount=\{schoolWeekCount\} slim \/>/.test(code))
check('one reward card, drawn whatever the day, after the day', rewardAt > fiveAt && /\{\(onToday \|\| !!liveSession\) && \(\(\) => \{/.test(code) && !/!focusDay \|\| deviceOpen/.test(code))
check('the tiles carry no second Use my time', !/<KidHomeTiles[\s\S]{0,300}onUseTime=/.test(code))
check('reminders are asked once a day has been finished', /remindState === 'ios'\) && \(liveDays >= 1 \|\| todayTab\.complete\)/.test(code))
const link = readFileSync('lib/kid/grown-up-link.ts', 'utf8')
check('the grown up is "Mum or Dad" until the account names them', /: 'Mum or Dad'/.test(link))
check('the waiting line and Since you last looked are on the home', /<KidWaitingLine/.test(code) && /<KidSinceLooked/.test(code))
check('a yes seen live is not news on the next open', /playKidSound\('star'\)\s*markSinceSeen\(\)/.test(code))
check('the five names the step that is lit, not done plus one', /step \$\{liveNo\} of/.test(five))

if (failures) { console.error(`\n${failures} kid home check(s) failed`); process.exit(1) }
console.log('\nKid home: simple and honest')
