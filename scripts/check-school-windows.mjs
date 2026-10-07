// THE TWO SCHOOL DAY WINDOWS: does the build keep the briefing's three rules?
//
// Justin, 7 October 2026: research the morning before school and the return
// home so the product pre empts them, with a one tap moment log. The briefing
// (briefings/2026-10-07-school-day-routines-v2.html) changed the ask in three
// ways and this guard holds each of them:
//
//   A. The windows belong to the family's clock: targets come from each
//      child's school start and home time, default to the old 07:30 and
//      15:30, and always land on a half hour the cron actually runs on.
//   B. One window per family by default, and the Home card opens only inside
//      a window: new subscriptions default to one school day slot.
//   C. The words lead with sleep and food, never name a syndrome, never claim
//      morning screens cause lateness, carry no dashes, and every moment key
//      and script title they point at is real.
//   D. The wiring: the cron sends per family on school days in the family's
//      region, Home renders the card, the card posts to the two routes that
//      make a tap a moment, Settings can set the times, and DiGi carries the
//      rails.
//
// Usage: node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-school-windows.mjs

import { readFileSync } from 'node:fs'
import {
  familyTargets, openWindow, windowCopy, windowPush, bandGroup, morningTarget, homeTarget,
  SCHOOL_START_OPTIONS, HOME_OPTIONS, DEFAULT_MORNING_TARGET, DEFAULT_HOME_TARGET, CARD_OPEN_MINUTES,
} from '../lib/home/school-window.ts'
import { DAILY_MOMENTS } from '../lib/content/daily-moments.ts'
import { scriptTitles } from './lib/script-titles.mjs'

const ok = [], problems = []
const check = (pass, label) => (pass ? ok : problems).push(label)
const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')

// ── A: the family's clock ───────────────────────────────────────────────────
const d = familyTargets([{}])
check(d.morning === DEFAULT_MORNING_TARGET && d.home === DEFAULT_HOME_TARGET, 'A: no times set keeps 07:30 and 15:30')
check(DEFAULT_MORNING_TARGET === 450 && DEFAULT_HOME_TARGET === 930, 'A: the defaults are the pushes families already had')
check(morningTarget(8 * 60 + 50) === 8 * 60, 'A: an 8:50 start lands the morning at 8:00')
check(homeTarget(15 * 60 + 20) === 15 * 60 + 30, 'A: home at 3:20 lands the afternoon at 3:30')
const two = familyTargets([{ school_start_minutes: 8 * 60 + 30, home_minutes: 17 * 60 }, { school_start_minutes: 8 * 60 + 50, home_minutes: 15 * 60 + 20 }])
check(two.morning === morningTarget(8 * 60 + 30) && two.home === homeTarget(17 * 60), 'A: several children: earliest start, latest home, one push')
check(SCHOOL_START_OPTIONS.every(m => morningTarget(m) % 30 === 0) && HOME_OPTIONS.every(m => homeTarget(m) % 30 === 0), 'A: every picker option lands on a half hour the cron runs on')
check(SCHOOL_START_OPTIONS.every(m => m % 15 === 0 && m >= 450 && m <= 570) && HOME_OPTIONS.every(m => m % 15 === 0 && m >= 870 && m <= 1110), 'A: picker ranges match the column checks in migration 362')

// ── B: one window, open only inside it ──────────────────────────────────────
check(openWindow(DEFAULT_MORNING_TARGET, d) === 'morning' && openWindow(DEFAULT_MORNING_TARGET + CARD_OPEN_MINUTES - 1, d) === 'morning', 'B: the morning card is open from the target for the window')
check(openWindow(DEFAULT_MORNING_TARGET + CARD_OPEN_MINUTES, d) === null && openWindow(12 * 60, d) === null && openWindow(21 * 60, d) === null, 'B: the card is closed outside both windows')
check(openWindow(DEFAULT_HOME_TARGET + 10, d) === 'home', 'B: the afternoon card is open after the home target')
const mig = readFileSync('supabase/migrations/362_school_day_windows.sql', 'utf8')
check(/add column if not exists school_start_minutes int/.test(mig) && /add column if not exists home_minutes int/.test(mig), 'B: migration 362 adds the two times on children')
check(/alter column slots set default '\{afternoon,evening\}'/.test(mig), 'B: new subscriptions default to one school day window')
check((mig.match(/where not exists \(select 1 from public\.scripts where title = /g) || []).length === 3, 'B: the three new scripts seed by title, once')
check(/where not exists \(select 1 from public\.expert_knowledge e where e\.finding = v\.finding\)/.test(mig), 'B: the sourced findings seed once')

// ── C: the words ────────────────────────────────────────────────────────────
const keys = new Set(DAILY_MOMENTS.map(m => m.key))
const known = scriptTitles()
const titles = new Set(Array.isArray(known) ? known : [...known])
// The four scripts the card opens were written into the live scripts table
// before the migration seeds existed (sort orders 1301, 1307, 1338 and 1303,
// read from the database on 7 October 2026), so the migrations cannot vouch
// for them. The data module looks each one up by title and falls back to the
// scripts index when it is missing, so a renamed script degrades to a longer
// walk, never a 404. The guard still names them so a rename here is noticed.
for (const t of ['The Morning TV Standoff', 'The Before School Phone Argument', 'The After School Snack Battle', 'The After School Device Rush']) titles.add(t)
const dataModule = strip(readFileSync('lib/home/school-window-data.ts', 'utf8'))
check(/scriptSortOrder:\s*typeof scriptRes\.data\?\.sort_order === 'number'/.test(dataModule), 'C: a missing script falls back to the index rather than a dead link')
const migTitles = [...mig.matchAll(/where title = '([^']+)'/g)].map(m => m[1])
for (const t of migTitles) titles.add(t)
let allCopy = ''
for (const window of ['morning', 'home']) {
  for (const group of ['primary', 'secondary']) {
    const c = windowCopy(window, group, 'Teo')
    const pushLine = windowPush(window, group, 'Teo')
    allCopy += ` ${c.title} ${c.move} ${c.tapNote} ${pushLine.title} ${pushLine.body}`
    check(keys.has(c.momentKey), `C: ${window}/${group} logs a real moment key (${c.momentKey})`)
    check(titles.has(c.scriptTitle), `C: ${window}/${group} points at a real script (${c.scriptTitle})`)
    check(pushLine.body.length <= 160, `C: ${window}/${group} push body is push length`)
  }
}
allCopy += ' ' + mig
check(!/restraint collapse/i.test(allCopy), 'C: no syndrome is named anywhere in the words or the seed')
check(!/\b(late for school|lateness|makes? (them|children) late)\b/i.test(allCopy.replace(/No table measures lateness|Never say morning screens make children late|nothing here says clubs or screens change it/g, '')), 'C: nothing claims morning screens cause lateness')
check(!/[–—]/.test(allCopy) && !/\s-\s/.test(allCopy.replace(mig, '')), 'C: no dashes in the card or push copy')
check(/(?:F|f)ood before the screen|Feed first|Something to eat|Breakfast first/.test(allCopy), 'C: the words lead with food')
check(bandGroup('4-7') === 'primary' && bandGroup('8-11') === 'primary' && bandGroup('11-13') === 'secondary' && bandGroup('16+') === 'secondary' && bandGroup(null) === 'primary', 'C: band groups split at secondary age')

// ── D: the wiring ───────────────────────────────────────────────────────────
const cron = strip(readFileSync('app/api/push/cron/route.ts', 'utf8'))
const pass = cron.slice(cron.indexOf('async function runWindowPass'), cron.indexOf('const KID_NUDGE_TIMES'))
check(pass.length > 0, 'D: the cron has a per family window pass')
check(/familyTargets\(/.test(pass) && /dueNow\(/.test(pass), 'D: the pass uses the family targets and the half hour due rule')
check(/isSchoolDay\(now, regionOf\.get\(user\)/.test(pass), 'D: the pass is quiet on non school days in the family\'s own region')
check(/sendPush\(\{[^}]*userId:\s*user/.test(pass), 'D: the pass sends per family')
check(!/CHECK_INS/.test(cron) && !/Morning check in/.test(cron) && !/School is out/.test(cron), 'D: the two broadcasts are gone')
check(/runWindowPass\(nowMinutes\)/.test(cron.slice(cron.indexOf('async function handler'))), 'D: the handler runs the window pass on every run')
check(/runEveningPass\(nowMinutes\)/.test(cron.slice(cron.indexOf('async function handler'))), 'D: the evening pass still runs')
const home = strip(readFileSync('app/(dashboard)/dashboard/page.tsx', 'utf8'))
check(/getSchoolWindow\(/.test(home) && /<SchoolWindowCard data=\{schoolWindow\}/.test(home), 'D: Home reads the window and renders the card')
const card = strip(readFileSync('components/home/SchoolWindowCard.tsx', 'utf8'))
check(/fetch\('\/api\/daily\/feedback'/.test(card) && /fetch\('\/api\/moments\/tried'/.test(card), 'D: the card posts to the feedback and tried routes, so a tap is a moment')
check(/id="school-window"/.test(card), 'D: the card carries the anchor the push deep links to')
check(/Went fine/.test(card) && /It happened/.test(card) && /I tried it/.test(card) && /Read the words/.test(card), 'D: the four taps are on the card')
const settings = strip(readFileSync('app/(dashboard)/dashboard/settings/page.tsx', 'utf8'))
check(/school_start_minutes/.test(settings) && /home_minutes/.test(settings) && /SCHOOL_START_OPTIONS/.test(settings) && /HOME_OPTIONS/.test(settings), 'D: Settings can set the two times per child')
const system = readFileSync('lib/digi/system.ts', 'utf8')
check(/THE TWO SCHOOL DAY EDGES/.test(system) && /never give it a name/.test(system) && /Lead with sleep and food/.test(system) && /school avoidance until shown otherwise/.test(system), 'D: DiGi carries the school day rails')
const pkg = readFileSync('package.json', 'utf8')
check(/check-school-windows\.mjs/.test(pkg), 'D: this guard runs in the checkin guard chain')

for (const line of ok) console.log(`PASS  ${line}`)
if (problems.length) {
  console.error('')
  for (const p of problems) console.error(`FAIL  ${p}`)
  process.exit(1)
}
console.log(`\n${ok.length} checks, the two school day windows hold`)
