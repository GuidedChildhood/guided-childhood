// Stickers that land: every sticker earned is seen, told, and kept.
//
// Justin, 14 September 2026: "big pop up passport animation of relevant
// Planet Friend and a visual sticker going in the passport ... letting
// parents know stickers earned and why ... the home tab on the app always
// has a Duolingo type reminder to return to daily tasks until done ... make
// sure stickers reflect the stickers required in the platform."
//
// Seven rules, two of them run against the real catalogue:
//
//   A. The catalogue pays the timer, the jobs and time outside, each a
//      ladder, every entry with an earn line and a why line, no dashes.
//   B. The book reads the three counters, ratchets them, and tells the
//      parent only when its own write landed and only on the child's load.
//   C. The child's load writes the book BEFORE it reads what is owed a
//      celebration, and hands the landing to the home screen.
//   D. The landing moment exists, marks seen on show, says why, and only
//      says "in your passport" after the flight. Friends stay with the rocket.
//   E. The daily sticker is in the book (Every day page) and named by the
//      day done screen.
//   F. Today is on the child's bar with the count left and a tick when
//      done; the six sub pages carry the way back; the open load only auto
//      switches tabs when the DAY is done.
//   G. The parent side: the passport strip has the stickers line, Home has
//      the news card with the passport doors on the first, the sheet card
//      draws the real catalogue, and the print out page exists at A6.
//   I. The week row moves the moment the day lands, the week is keyed by the
//      London day the store uses, and the five a day carries the mission:
//      the next sticker on each objective, under the week, in both views.
//   J. The front page is the calendar page (14 September 2026): the paper
//      theme is the default and light, the hold cover is the same page, the
//      greeting is the rainbow masthead with the Friend, and the evening
//      band also says what school needs tomorrow.
//   K. Nothing white is left on the paper page (14 September 2026): no child
//      surface still paints the retired dark --kid-bg token, the games
//      takeover wears the child's colour instead of one of its own, the
//      printables tally falls back to ink rather than white, and the mock of
//      the child app inside the parent welcome shows the app they will get.
//   L. The streak bar tells the truth and cannot collapse (14 September 2026):
//      a rung short enough to draw honestly is counted in fixed width pips, a
//      longer one is measured by one proportional track with a width floor,
//      the threshold is re-derived from the 390px pixel budget on every run,
//      and every fill is banked over the rung's REAL span so a full bar
//      always means nothing left to do.
//   H. The lunchtime round (14 September 2026): home counts pending ideas the
//      way the cap counts them, no window; the ask page has a door to the
//      jobs when it is full; no polka dot ground anywhere on the child side,
//      the week is discs with the sun on today; the book's tiles are die
//      cut and the how is behind a tap.
//
//   node --experimental-strip-types scripts/check-stickers-land.mjs

import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []
const blank = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
const read = (f) => blank(readFileSync(f, 'utf8'))

const book = read('lib/stickers/book.ts')
const kidPage = read('app/k/[token]/page.tsx')
const screen = read('app/k/[token]/KidQuestScreen.tsx')
const land = read('components/kid/KidStickerLand.tsx')
const kidStickers = read('components/kid/KidStickers.tsx')
const dayDone = read('components/kid/KidDayDone.tsx')
const tabBar = read('components/kid/KidTabBar.tsx')
const strip = read('components/pathway/StageChildStrip.tsx')
const childRead = read('lib/pathway/passport-child.ts')
const home = read('app/(dashboard)/dashboard/page.tsx')
const news = read('components/home/StickerNewsCard.tsx')
const shop = read('components/shop/Shop.tsx')
const fab = read('components/rightnow/RightNowButton.tsx')

// ── The probe ───────────────────────────────────────────────────────────────
const probe = `
import { STICKERS, stickerWhy } from './lib/stickers/catalog.ts'
const kinds = {}
for (const s of STICKERS) (kinds[s.rule.kind] ??= []).push(s)
const ladders = ['timer', 'jobs', 'outside'].map(k => (kinds[k] ?? []).map(s => s.rule.n))
const whys = STICKERS.map(s => stickerWhy(s, 'child'))
const parentWhy = stickerWhy(kinds.lessons[0], 'parent', 'Andy')
const dashed = STICKERS.filter(s => /[-–—]/.test(s.earn) || /[-–—]/.test(s.name) || /[–—]/.test(stickerWhy(s, 'child')))
console.log(JSON.stringify({ total: STICKERS.length, ladders, whysEmpty: whys.filter(w => !w || w.length < 12).length, parentWhy, dashed: dashed.map(s => s.key) }))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
let o = null
if (r.status !== 0) problems.push(`probe: could not run the catalogue: ${(r.stderr || '').trim().split('\n').slice(-2).join(' ')}`)
else o = JSON.parse(r.stdout.trim().split('\n').pop())

// ── A: the catalogue ────────────────────────────────────────────────────────
if (o) {
  const rising = o.ladders.every(l => l.length === 3 && l[0] === 1 && l[1] > l[0] && l[2] > l[1])
  if (!rising) problems.push(`A: the timer, jobs and outside ladders are not three rungs from one (${JSON.stringify(o.ladders)})`)
  else ok.push(`A: timer, jobs and outside each have a three rung ladder starting at one (${o.total} stickers on the sheet)`)
  if (o.whysEmpty > 0) problems.push(`A: ${o.whysEmpty} stickers have no why line`)
  else if (!/Andy passed a lesson\./.test(o.parentWhy)) problems.push(`A: the parent's why line reads "${o.parentWhy}"`)
  else ok.push('A: every sticker says why it came, to the child and to the parent by name')
  if (o.dashed.length) problems.push(`A: dashes in the copy for ${o.dashed.join(', ')}`)
  else ok.push('A: no dashes in any sticker copy')
}

// ── B: the book ─────────────────────────────────────────────────────────────
if (!/case 'timer': return ctx\.timerDays/.test(book) || !/case 'jobs': return ctx\.jobsDone/.test(book) || !/case 'outside': return ctx\.outsideDays/.test(book)) problems.push('B: the book does not read the three counters')
else if (!/\|\| s\.rule\.kind === 'timer' \|\| s\.rule\.kind === 'jobs' \|\| s\.rule\.kind === 'outside'/.test(book)) problems.push('B: the three counters do not ratchet')
// The move count must be asked for as JSON, never as an array. This rule used
// to assert the array form, which is to say it held the bug in place: kid_days
// .done is JSONB, postgrest-js turns an array into a Postgres array literal,
// and Postgres answers "invalid input syntax for type json" while supabase-js
// returns that error rather than throwing, so the count read as an honest
// zero for every child from the day it shipped. See the note in book.ts and
// scripts/check-jsonb-contains.mjs.
else if (!/\.eq\('status', 'approved'\)/.test(book) || !/\.contains\('done', JSON\.stringify\(\['move'\]\)\)/.test(book)) problems.push('B: jobs must count approved ticks, and outside must ask for the move step as JSON rather than an array')
else ok.push('B: the book reads approved jobs, timer days and outside days, and ratchets them')
if (!/if \(written && opts\?\.notify\)/.test(book)) problems.push('B: the parent push is not gated on the write landing and the child\'s load asking')
else if (!/earned their first sticker/.test(book) || !/Order the printed passport and sticker sheet/.test(book)) problems.push('B: the first sticker push does not say the passport line')
else if (!/const why = stickerWhy\(first, 'parent', name\)/.test(book)) problems.push('B: the push does not say why')
else ok.push('B: the parent is pushed with the why, and the first ever sticker carries the passport line')

// ── C: the child's load ─────────────────────────────────────────────────────
if (!/getStickerBook\(supabase, link\.user_id, \{ id: link\.child_id, age_band: ageBand \?\? null \}, \{ notify: \{ childName: [^}]+\} \}\)\s*\.then\(async book => \[/.test(kidPage)) problems.push('C: the child\'s load does not write the book before reading what is owed, or does not ask to notify')
else if (!/dailyStickers=\{dailyStickers\}/.test(kidPage)) problems.push('C: the child\'s load does not hand the daily stickers to the screen')
else ok.push('C: the book writes first, notifies the parent, and the daily stickers reach the screen')
if (!/stickers\.filter\(s => celebrateStickers\.includes\(s\.key\) && s\.earned && s\.rule\.kind !== 'friend'\)/.test(screen)) problems.push('C: the landing list is not every owed non Friend sticker')
else if (!/<KidStickerLand[\s\S]{0,300}?onOpenBook=\{\(\) => \{ setLanding\(\[\]\); setPassportOpen\(true\) \}\}/.test(screen)) problems.push('C: the landing does not open the passport as its way out')
else if (!/celebrateStickers=\{bookCelebrate\}/.test(screen)) problems.push('C: the book\'s own pop would repeat what already landed')
else ok.push('C: the home screen lands every owed sticker except Friends, opens the passport, and the book does not repeat it')

// ── D: the landing moment ───────────────────────────────────────────────────
if (!existsSync('components/kid/KidStickerLand.tsx')) problems.push('D: no landing moment')
else if (!/fetch\('\/api\/kid\/stickers\/seen'/.test(land) || !/sent\.current = true/.test(land)) problems.push('D: the landing does not mark seen on show')
else if (!/stickerWhy\(/.test(land)) problems.push('D: the landing does not say why')
else if (!/onComplete: \(\) => setLanded\(true\)/.test(land) || !/landed \? 'In your passport' : 'Going in'/.test(land)) problems.push('D: "in your passport" is said before the flight lands')
else if (!/buddyFor\(buddy\)/.test(land)) problems.push('D: the child\'s own Friend does not hold the sticker')
else ok.push('D: the landing marks seen on show, says why, and says in your passport only once it is')

// ── E: the daily sticker ────────────────────────────────────────────────────
if (!/data-daily-page/.test(kidStickers) || !/daily\.week\.map/.test(kidStickers)) problems.push('E: the book has no Every day page')
else if (!/data-day-sticker/.test(dayDone) || !/Today's sticker is in your passport/.test(dayDone)) problems.push('E: the day done screen does not name the sticker it paid')
else ok.push('E: the daily sticker is in the book and named on the day done screen')

// ── E2: the week is one calendar, with the Friend on it (the Kenji note) ────
const weekCal = read('components/kid/KidWeekCalendar.tsx')
const fiveADay = read('components/kid/KidFiveADay.tsx')
if (!/data-week-calendar/.test(weekCal) || !/friend\.img/.test(weekCal)) problems.push('E2: the week calendar does not put the Friend on a done day')
else if (!/<KidWeekCalendar/.test(fiveADay) || !/<KidWeekCalendar/.test(kidStickers) || !/<KidWeekCalendar/.test(screen)) problems.push('E2: the five a day, the book and the balance card do not share the one week calendar')
else if (/'⭐'/.test(kidStickers.match(/data-daily-page[\s\S]{0,3000}/)?.[0] ?? '')) problems.push('E2: the Every day page still draws a yellow star per day')
else ok.push('E2: one week calendar, the child\'s Friend on every done day, on the five a day, the book and the balance card')

// ── F: today on every tab ───────────────────────────────────────────────────
if (!/data-today-tab/.test(tabBar) || !/today\.complete \? 'done' : today\.opened \? 'going' : 'fresh'/.test(tabBar)) problems.push('F: the bar has no Today entry with its three states')
else if (!/today=\{todayTab\}/.test(screen) || !/onToday=\{\(\) => \{ setTab\('quests'\)/.test(screen)) problems.push('F: the screen does not feed the Today entry or send it home')
else if (!/if \(!allDone \|\| !todayTab\.complete\)/.test(screen)) problems.push('F: the open load auto switches tabs on the jobs flag rather than the day')
else ok.push('F: Today sits on the bar with the count left, and the open load waits for the day')
// Every screen a child can wander onto keeps a way back to the day. The RULE is
// unchanged; what satisfies it now comes in two shapes.
//
// It used to be KidTodayReturn on all six: a pill, position fixed, zIndex 60,
// anchored bottom centre. On 15 September 2026 Justin photographed that pill
// sitting on top of a lesson title, which is the zoom drift the tab bar was
// portalled to escape, and it shared a zIndex and a corner with the new bar.
//
// So the five screens that took the tab bar get their way back from the bar's
// own Today entry, fed a real count by KidScreenChrome, and the pill is gone
// from them. The planet keeps the pill, because it is immersive and takes no
// bar. Either satisfies this rule; neither being present does not.
const subPages = ['jobs', 'lessons', 'planet', 'suggest', 'tell', 'print']
const missing = subPages.filter(p => {
  const src = read(`app/k/[token]/${p}/page.tsx`)
  const pill = /<KidTodayReturn token=\{token\} \/>/.test(src)
  const barToday = /<KidScreenChrome[^>]*today=\{todayTab\}/.test(src)
  return !pill && !barToday
})
if (missing.length) problems.push(`F: no way back to today on ${missing.join(', ')}: neither the KidTodayReturn pill nor a KidScreenChrome carrying today={todayTab}`)
else ok.push(`F: the way back to today is on all ${subPages.length} sub pages`)

// ── F2: the ask row cannot get stuck, and the week page is off the yellow ───
const weekPage = read('app/k/[token]/week/page.tsx')
if (!/if \(!state \|\| asksPending <= 0\) return/.test(fiveADay) || !/void mark\('ask', true, 'Idea already with your grown up'\)/.test(fiveADay)) problems.push('F2: an idea already with the grown up does not tick the ask row')
else if (!/Still to do: \$\{jobsLeft\.slice\(0, 3\)\.join/.test(fiveADay)) problems.push('F2: the jobs row does not name the jobs still to do')
else if (!/asksPending=\{Math\.max\(asks\.filter\(a => a\.status === 'pending'\)\.length, asksPendingTotal\)\}/.test(screen) || !/jobsLeft=\{quests\.filter\(q => !ticks\[q\.id\]\)\.map\(q => q\.title\)\}/.test(screen)) problems.push('F2: the screen does not hand the pending asks and the jobs left to the five a day')
else ok.push('F2: an idea with the grown up ticks the ask row, and the jobs row names what is left')
if (/background: 'var\(--butter\)'/.test(weekPage)) problems.push('F2: the child\'s week page is a slab of butter again')
else if (!/env\(safe-area-inset-top\)/.test(weekPage) || !/buddyFor\(/.test(weekPage)) problems.push('F2: the week page has no safe area padding or no Friend')
else ok.push('F2: the week page has the Friend and sits clear of the status bar')

// ── F3: ask for screen time has its own page, and the wait is watched ───────
const askPage = read('app/k/[token]/ask/page.tsx')
const askUi = read('components/kid/KidAskScreenTime.tsx')
const balancePage = read('app/k/[token]/balance/page.tsx')
const timerCard = read('components/quests/DeviceTimeCard.tsx')
if (!existsSync('components/kid/KidAskScreenTime.tsx') || !/data-devices/.test(askUi) || !/data-minutes/.test(askUi) || !/data-earn/.test(askUi)) problems.push('F3: the ask page is missing a step (screen, minutes, or the earn more panel)')
else if (!/fetch\(`\/api\/quests\/time\/status\?token=/.test(askUi) || !/setInterval\(check, 8000\)/.test(askUi) || !/data-start/.test(askUi)) problems.push('F3: the ask page does not watch for the yes and offer Start')
else if (!/body: JSON\.stringify\(\{ token, requestId: ask\.id \}\)/.test(askUi)) problems.push('F3: Start does not start the approved ask by its id')
else if (!/Promise\.resolve\(p\)\.then\(v => v, \(\) => null\)/.test(askPage)) problems.push('F3: the ask page reads do not fail soft')
else if (!/window\.location\.assign\(`\/k\/\$\{token\}\/ask`\)/.test(screen) || !/askHref=\{`\/k\/\$\{token\}\/ask`\}/.test(screen)) problems.push('F3: the home does not send Use my time and the balance door to the ask page')
else if (!/if \(askHref\) \{ window\.location\.assign\(askHref\); return \}/.test(timerCard)) problems.push('F3: the timer card ignores its askHref')
else if (!/href=\{`\/k\/\$\{token\}\/ask`\} data-ask-door/.test(balancePage)) problems.push('F3: the balance page has no door to the ask')
else ok.push('F3: the ask has its own three step page, the home and the balance open it, and the wait turns into Start')

// ── G: the parent side ──────────────────────────────────────────────────────
if (!/readStickerNews\(supabase, childId\)/.test(childRead) || !/stickers: \{ total: news\.total, recent: news\.recent\.map\(r => r\.name\) \}/.test(childRead)) problems.push('G: the passport child read has no stickers')
else if (!/data-stickers-line/.test(strip) || !/New this week:/.test(strip)) problems.push('G: the passport strip has no stickers line')
else ok.push('G: the parent passport reads the child\'s stickers and names the week\'s new ones')
if (!/<StickerNewsCard news=\{stickerNews\}/.test(home)) problems.push('G: Home has no sticker news card')
else if (!/data-first=\{news\.firstEver/.test(news) || !/keepsakes[^`]*#p-passport_printed/.test(news) || !/passport-print/.test(news)) problems.push('G: the first sticker card does not open the passport and the print out')
else ok.push('G: Home says what they earned and why, with the passport doors on the first')
if (!/data-sheet-catalogue/.test(shop) || !/STICKERS\.map\(st =>/.test(shop)) problems.push('G: the sticker sheet card does not draw the real catalogue')
else if (!/data-print-preview/.test(shop) || !existsSync('app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx')) problems.push('G: no print out to look at')
else if (!/size: A6 portrait/.test(readFileSync('app/(dashboard)/dashboard/keepsakes/passport-print/page.tsx', 'utf8'))) problems.push('G: the print out is not A6')
else if (!/startsWith\('\/dashboard\/keepsakes'\)/.test(fab)) problems.push('G: the Now button still sits on the shop')
else ok.push('G: the sheet is the catalogue, the print out is A6, and the shop is clear of the Now button')

// ── H: the lunchtime round ──────────────────────────────────────────────────
// Justin, 14 September 2026, 12:30: "Still blocking last one of 5 ... I'm
// guessing they are stuck on parents app?" (they were: five pending ideas
// older than the week the home page read, so home counted zero and the cap
// counted five). "Background blue dots is not the right look, we want happy
// news style." "Passport ... more pretty visually with stickers."
const askForJob = read('components/kid/KidAskForJob.tsx')
const schoolWeek = read('components/kid/KidSchoolWeek.tsx')
const passport = read('components/kid/KidPassport.tsx')
const pendingCount = kidPage.match(/supabase\.from\('quest_requests'\)\s*\.select\('id', \{ count: 'exact', head: true \}\)\s*\.eq\('child_id', link\.child_id\)\s*\.eq\('status', 'pending'\)/)
if (!pendingCount) problems.push('H: home does not count every pending ask the way the cap does (no window, head count)')
else if (!/asksPendingTotal=\{pendingAsksRes\.count \?\? 0\}/.test(kidPage) || !/asksPendingTotal = 0/.test(screen)) problems.push('H: the pending count never reaches the five a day')
else ok.push('H: home counts every pending idea, however old, so the ask row ticks itself')
if (!/pending >= MAX_PENDING && \(/.test(askForJob) || !/data-jobs-door/.test(askForJob) || !/href=\{`\/k\/\$\{token\}\/jobs`\}\s*data-jobs-door/.test(askForJob)) problems.push('H: at the cap the ask page has no door to the jobs')
else if (/Lots of ideas already waiting/.test(askForJob)) problems.push('H: the cap still says "Lots of ideas already waiting" with nowhere to go')
else ok.push('H: at the cap the ask page points at the jobs board')
const polka = [['components/kid/KidWeekCalendar.tsx', weekCal], ['app/k/[token]/week/page.tsx', weekPage], ['components/kid/KidAskScreenTime.tsx', askUi], ['components/kid/KidSchoolWeek.tsx', schoolWeek]].filter(([, src]) => /48px 40px/.test(src)).map(([f]) => f)
if (polka.length) problems.push(`H: the polka dot ground is back on ${polka.join(', ')}`)
else if (!/data-look="happy"/.test(weekCal) || !/<SunRays/.test(weekCal) || !/HAPPY\.pink/.test(weekCal) || !/<Burst/.test(weekCal)) problems.push('H: the week calendar is not the white page with discs, the sun on today, and the count in a burst')
else if (!/background: HAPPY\.cream/.test(weekPage) || !/background: HAPPY\.cream/.test(askUi)) problems.push('H: the week page or the ask page is not on the white ground')
else if (!/data-day=\{isOpen \? 'open' : d\.isToday \? 'today' : d\.isPast \? 'quiet' : 'ahead'\}/.test(schoolWeek) || !/borderRadius: '50%', boxSizing: 'border-box'/.test(schoolWeek)) problems.push('H: the week page strip is not discs')
else if (!/<KidWeekMasthead/.test(weekPage) || !/<KidWeekMasthead/.test(read('app/dev/kid-school-week/page.tsx')) || !/<RainbowArc painted/.test(read('components/kid/KidWeekMasthead.tsx'))) problems.push('H: the week page (or its fixture) has no painted rainbow masthead')
else ok.push('H: no polka ground on the child side; the week is discs with the sun on today, under the painted rainbow masthead')
if (!/data-sticker=\{s\.earned \? 'earned' : 'locked'\}/.test(kidStickers) || !/boxShadow: s\.earned \? `2px 4px 0 \$\{HAPPY\.ink\}` : 'none'/.test(kidStickers)) problems.push('H: the book\'s tiles are not die cut stickers')
else if (!/<details data-how style=/.test(kidStickers) || !/<HowItWorks note=\{page\.note\} steps=\{page\.steps\} how=\{page\.how\} \/>/.test(kidStickers)) problems.push('H: the how it works is not one tap away on every page')
else if (!/data-book-cover/.test(kidStickers) || !/daily\?\.friend && \(/.test(kidStickers) || !/<Burst size=\{52\}/.test(kidStickers)) problems.push('H: the cover has no Friend sticker or no count burst')
else if (!/daily\?\.friend && \(/.test(passport) || !/<Plate size=\{54\}/.test(passport)) problems.push('H: the passport title has no Friend on a plate')
else ok.push('H: the book leads with die cut stickers, the how is a tap away, the Friend is on the cover and the title')

// ── I: the week moves with the day, and the five carry the mission ──────────
// Justin, 14 September 2026, 13:07, with Today is done above a week row that
// still said finish today: "we need to know this is working right and every
// day works and adds together, and that the five a day have a mission over
// time to achieve our objectives of balanced device use and understanding
// online safety lessons."
const missionProbe = `
import { buildMission, nextOn } from './lib/kid/mission.ts'
const S = (key, kind, n, have, need, earned, extra = {}) => ({ key, name: key, colour: '#000', earned, rule: { kind, n, ...extra }, have, need })
const book = [
  S('pebble', 'friend', 1, 1, 2, false, { streaks: 2 }), S('bloop', 'friend', 2, 1, 10, false, { streaks: 10 }),
  S('lessons-1', 'lessons', 1, 3, 1, true), S('lessons-5', 'lessons', 5, 3, 5, false), S('stamp-1', 'stamp', 1, 3, 12, false),
  S('outside-1', 'outside', 1, 1, 1, true), S('outside-10', 'outside', 10, 1, 10, false), S('timer-7', 'timer', 7, 6, 7, false),
]
const rows = buildMission(book)
const live = buildMission(book, { fullDays: 2 })
const allDone = buildMission([S('pebble', 'friend', 1, 2, 2, true, { streaks: 2 })])
console.log(JSON.stringify({ keys: rows.map(r => r.key), titles: rows.map(r => r.title), lines: rows.map(r => r.line), liveFriend: live[0].line, liveDone: live[0].done, allDone: allDone[0].done, none: nextOn([], 'safety') }))
`
const mrun = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', missionProbe], { encoding: 'utf8' })
if (mrun.status !== 0) problems.push(`I: the mission probe could not run: ${(mrun.stderr || '').split('\n').slice(0, 3).join(' ')}`)
else {
  const r = JSON.parse(mrun.stdout.trim().split('\n').pop())
  if (r.keys.join() !== 'friend,safety,balance') problems.push(`I: the mission is not friend, safety, balance (${r.keys.join()})`)
  else if (r.titles[0] !== 'Bring pebble home' || r.titles[1] !== 'lessons-5' || r.titles[2] !== 'timer-7') problems.push(`I: the mission does not pick the next sticker with the least left (${r.titles.join(' | ')})`)
  else if (r.lines.join(' | ') !== '1 of 2 full days | 3 of 5 lessons | 6 of 7 days') problems.push(`I: the mission lines are wrong (${r.lines.join(' | ')})`)
  else if (r.liveFriend !== 'Done' || r.liveDone !== true) problems.push('I: the friend row does not take the live full days')
  else if (r.allDone !== true || r.none !== null) problems.push('I: an all earned objective is not done, or an empty book is not null')
  else ok.push('I: the mission picks the next sticker on each objective and moves with the live full days')
}
if (!/const \[week, setWeek\] = useState\(dailyStickers\?\.week \?\? null\)/.test(screen) || !/markTodayDone\(\)/.test(screen) || !/weekDone=\{week\}/.test(screen)) problems.push('I: the week row does not move the moment the day lands')
else if (!/total: liveDays, week: week \?\? dailyStickers\.week/.test(screen)) problems.push('I: the passport\'s Every day page does not take the live week and total')
else if (!/const todayUk = ukToday\(\)/.test(kidPage) || !/const dayStr = dayStrUk/.test(kidPage) || !/\.gte\('day', dayStrUk\(6\)\)/.test(kidPage) || /new Date\(Date\.now\(\) - o \* 86400000\)\.toISOString\(\)/.test(kidPage)) problems.push('I: the week is not keyed by the London day the store uses')
else if (!/mission=\{mission\}/.test(screen) || !/buildMission\(stickers, \{ fullDays: liveStreaks, token \}\)/.test(screen)) problems.push('I: the screen does not hand the mission to the five a day')
else if (!/data-mission-site="done"/.test(fiveADay) || !/data-mission-site="open"/.test(fiveADay) || !/<KidMission rows=\{mission\}/.test(fiveADay)) problems.push('I: the mission is not under the week in both views of the five a day')
else ok.push('I: the week row moves with the day, keyed by the London day, and the mission sits under it in both views')

// ── J: the front page is the calendar page ──────────────────────────────────
// Justin, 14 September 2026, 13:09, with Jonny's week page open: "having the
// calendar, which I love the design of ... does a day before reminder also,
// and the front page has the similar design as the calendar page, as looks
// great."
const themeSrc = readFileSync('lib/kid/theme.ts', 'utf8')
const globalsSrc = readFileSync('app/globals.css', 'utf8')
const cron = read('app/api/cron/job-reminders/route.ts')
const themeProbe = `
import { resolveTheme, DEFAULT_ACCENT, PICKER_ACCENTS } from './lib/kid/theme.ts'
const t = resolveTheme(null)
console.log(JSON.stringify({ def: DEFAULT_ACCENT, dark: t.dark, bg: t.bg, ink: t.ink, first: PICKER_ACCENTS[0], graphite: resolveTheme('graphite').dark }))
`
const trun = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', themeProbe], { encoding: 'utf8' })
if (trun.status !== 0) problems.push(`J: the theme probe could not run: ${(trun.stderr || '').split('\n').slice(0, 3).join(' ')}`)
else {
  const r = JSON.parse(trun.stdout.trim().split('\n').pop())
  if (r.def !== 'paper' || r.dark !== false || r.bg !== '#F9F8F6' || r.ink !== 'var(--ink)') problems.push(`J: the default theme is not the light paper page (${r.def}, dark ${r.dark}, ${r.bg})`)
  else if (r.first !== 'paper') problems.push('J: a child who tried a colour cannot pick the page back')
  else if (r.graphite !== true) problems.push('J: graphite is gone, so a child who chose it lost it')
  else ok.push('J: the paper page is the default, light, with graphite kept for those who chose it')
}
if (!/html\[data-gc-hold='kid'\] body::before \{[^}]*background: #F9F8F6;/.test(globalsSrc.replace(/\/\*[\s\S]*?\*\//g, ' '))) problems.push('J: the kid hold cover is not the paper page, so a dark flash sits in front of a white page')
else if (!/data-home-masthead/.test(screen) || !/<KidWeekMasthead\s[\s\S]{0,400}kicker=\{greetHour === null/.test(screen) || !/corner=\{/.test(screen)) problems.push('J: the home greeting is not the rainbow masthead with the greeting as its kicker and the sound switch in the corner')
else if (!/Tomorrow, get it ready tonight/.test(screen)) problems.push('J: the To remember card lost its tomorrow section')
else if (!/if \(band === 'evening'\)/.test(cron) || !/isChildVisible\(a\)/.test(cron) || !/isHeldForHolidays\(\{ recurs_weekday: a\.recurs_weekday/.test(cron) || !/`Tomorrow: \$\{items\[0\]\.title\}`/.test(cron)) problems.push('J: the evening band does not push what school needs tomorrow, by the card\'s own rules')
else ok.push('J: the hold cover, the masthead greeting, the tomorrow section and the evening kit push are all in')

// ── K: nothing white is left on the paper page ──────────────────────────────
// Making Paper the default flipped the ground under every child screen, and
// the theme file's own note records that the sub pages were written against a
// dark background and hardcode white text on it. A sweep of all 26 child pages
// and 45 child components on 14 September 2026 found four surfaces that named
// the dark ground themselves rather than asking the theme, so a child would
// have opened a game or a fixture and watched the app go black. These rules
// stop the next one being written.
//
// --kid-bg is the retired dark token. Any child surface that still paints it
// is painting a background that no longer matches the app around it.
const KID_SURFACES = [
  'components/quest-games/QuestGamePlayer.tsx',
  'components/onboarding/WelcomeWalkthrough.tsx',
  'app/dev/kid-day-done/page.tsx',
  'app/dev/kid-passport/page.tsx',
  'app/ref-kid-suggest/page.tsx',
  'app/ref-kid-week/page.tsx',
]
const stillDark = KID_SURFACES.filter(f => existsSync(f) && /var\(--kid-bg\)/.test(read(f)))
if (stillDark.length > 0) problems.push(`K: ${stillDark.join(', ')} still paint the retired dark ground, so the app goes black under a child on the paper page`)
else {
  const games = read('components/quest-games/QuestGamePlayer.tsx')
  const printables = read('components/kid/KidPrintables.tsx')
  const welcome = read('components/onboarding/WelcomeWalkthrough.tsx')
  // The mock of the child app inside the parent welcome, on its own. Testing
  // the whole file would let a KID.inkMuted somewhere else stand in for the
  // ink on the card itself, which is how the first version of this rule
  // passed a mutation that put the white text back.
  //
  // White TEXT is the fault, not white. A white card on the paper page is the
  // surface the whole child app is built from and stays exactly as it is.
  const sceneChild = welcome.slice(welcome.indexOf('function SceneChild'), welcome.indexOf('function ScenePayoff'))
  if (!/theme\?: KidTheme/.test(games) || !/const t = theme \?\? resolveTheme\(DEFAULT_ACCENT\)/.test(games) || !/background: t\.bg/.test(games)) problems.push('K: the games takeover does not wear the child\'s colour')
  else if (!/<QuestGamePlayer\s+game=\{activeGame\}\s+theme=\{theme\}/.test(screen)) problems.push('K: the child app does not hand its colour to the games takeover')
  else if (/tallyColor = 'rgba\(255,255,255/.test(printables)) problems.push('K: the printables tally still falls back to white, which is invisible on the paper page')
  else if (!/const KID = resolveTheme\(DEFAULT_ACCENT\)/.test(welcome) || !/background: KID\.bg/.test(sceneChild) || !/color: KID\.ink[,}\s]/.test(sceneChild) || /color: '#fff'|color: 'rgba\(255,255,255/.test(sceneChild)) problems.push('K: the welcome shows a parent a child app that is not the one their child gets')
  else ok.push('K: no child surface paints the retired dark ground, the games takeover and the welcome mock ask the theme, and the tally falls back to ink')
}

// ── L: the streak bar tells the truth and stays a bar ───────────────────────
// Justin, 14 September 2026, looking at his own child home: "not sure what the
// ooooo is on this?" The row read "2 ooooooooo 8 more for Bloop".
//
// Two faults in one component. The dots were flex:1 with a fixed height, a 2px
// ink border and a full pill radius and no floor under the width, so on a
// 390px phone they were left about 9px each and drew as rings. And the fill
// test was `i < banked`, a dot INDEX against a raw day COUNT, while the dot
// count was capped at 8: measured in a browser, a child on 18, 21, 30, 50 or
// 57 days saw a COMPLETELY FULL bar beside words saying 4, 1, 8, 8 and 1 more
// to go. The bar contradicted the sentence beside it for most of the ladder.
//
// The probe runs the real ladder and checks the honesty property directly,
// rather than trusting a regex to notice a saturating comparison. It walks
// every day count a child can hold, so a future change to the ladder is
// checked too rather than only the five rungs that exist today.
const streakBar = read('components/kid/StreakBar.tsx')
const spanProbe = `
import { rungSpan, streaksBankedTowardNext, streaksToNextFriend, earnedFriends, friendsFromStreaks } from './lib/pathway/streak-unlock.ts'
const rows = []
for (let s = 0; s <= 58; s++) {
  const span = rungSpan(s)
  const banked = streaksBankedTowardNext(s)
  const owed = streaksToNextFriend(s)
  const pct = span > 0 ? Math.min(100, Math.max(0, Math.round((banked / span) * 100))) : 0
  rows.push({ s, span, banked, owed, pct })
}
// A full bar must mean nothing owed, and an empty one must mean nothing banked.
const lies = rows.filter(r => (r.pct === 100 && r.owed > 0) || (r.pct === 0 && r.banked > 0))
// Every rung's span must be the real gap, never a drawing cap.
const spans = [...new Set(rows.filter(r => r.span > 0).map(r => r.span))].sort((a, b) => a - b)
// The row names the next Friend off the same count it prints, so the two can
// never drift. That only holds while the two routes agree everywhere.
const drift = []
for (let s = 0; s <= 200; s++) if (earnedFriends(s) !== friendsFromStreaks(s)) drift.push(s)
console.log(JSON.stringify({ lies: lies.map(r => r.s), spans, drift: drift.slice(0, 5), capped: rows.some(r => r.span === 8 && r.owed > 8) }))
`
const srun = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', spanProbe], { encoding: 'utf8' })
if (srun.status !== 0) problems.push(`L: the streak span probe could not run: ${(srun.stderr || '').split('\n').slice(0, 3).join(' ')}`)
else {
  const r = JSON.parse(srun.stdout.trim().split('\n').pop())
  if (r.lies.length > 0) problems.push(`L: the streak bar disagrees with its own words on ${r.lies.length} day counts (${r.lies.slice(0, 6).join(', ')})`)
  else if (r.spans.join() !== '2,8,12,16,20') problems.push(`L: the rung spans are not the real gaps between Friends (${r.spans.join()})`)
  else if (r.capped) problems.push('L: a rung span is still capped, so the bar measures progress against a drawing number')
  else if (r.drift.length > 0) problems.push(`L: the Friend count and the day count disagree (first at ${r.drift[0]} days), so the row can name the wrong Friend`)
  else ok.push('L: every day count from 0 to 58 fills the streak bar by the rung\'s real span, so a full bar always means nothing left')
}
if (!/data-streak-track/.test(streakBar) || !/minWidth: 44/.test(streakBar)) problems.push('L: the streak bar has no track with a width floor, so it can collapse into rings again')
else if (/rungLength/.test(streakBar)) problems.push('L: the streak bar still measures itself against the capped rung length')
else if (!/width: `\$\{pct\}%`/.test(streakBar) || !/rungSpan\(completedStreaks\)/.test(streakBar)) problems.push('L: the streak bar does not fill proportionally against the real span')
else if (/Array\.from\(\{ length: rung/.test(streakBar)) problems.push('L: the streak bar is drawing a row of dots again')
else if (/earnedStages/.test(streakBar) || !/nextFriendToEarn\(friendsFromStreaks\(completedStreaks\)\)/.test(streakBar)) problems.push('L: the streak bar takes the next Friend from something other than the count it prints')
else ok.push('L: the streak bar is one proportional track with a width floor, measured against the real span, naming the Friend off the same count')

// The road to social media had the same collapsing shape: one flex:1 mark per
// lesson with no floor. Twelve in the fixture measured 22px, but the real read
// pulls every live parent social media lesson up to the child's stage, about
// twenty one today at 11px and falling under 8px as the 13 plus module lands.
const road = read('components/pathway/SocialRoadNova.tsx')
if (!/repeat\(auto-fit, minmax\(14px, 1fr\)\)/.test(road)) problems.push('L: the social road marks have no width floor, so a longer curriculum smears them into a band')
else if (/flex: 1, height: isNext/.test(road)) problems.push('L: the social road marks still share whatever width is left')
else ok.push('L: the social road marks hold a 14px floor and wrap, so the marks survive the curriculum growing')

// ── M: a mission row is a door only where there is somewhere to go ──────────
// Justin, 14 September 2026: "checking if here we can link them to actually do
// it." Two halves, and the second is the one worth guarding. The lessons and
// timer rows must LEAD somewhere, and the full days and outside rows must NOT:
// both are earned on the five a day directly above the card, so a link would
// walk a child away from the thing they were about to do.
const missionUi = read('components/kid/KidMission.tsx')
const doorProbe = `
import { missionHref } from './lib/kid/mission.ts'
const T = '0123456789abcdef01'
const out = {}
for (const k of ['friend', 'lessons', 'stamp', 'outside', 'timer', 'jobs']) out[k] = missionHref(k, T)
out.noToken = missionHref('lessons', null)
console.log(JSON.stringify(out))
`
const drun = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', doorProbe], { encoding: 'utf8' })
if (drun.status !== 0) problems.push(`M: the mission door probe could not run: ${(drun.stderr || '').split('\n').slice(0, 3).join(' ')}`)
else {
  const d = JSON.parse(drun.stdout.trim().split('\n').pop())
  const T = '0123456789abcdef01'
  if (d.lessons !== `/k/${T}/lessons?next=1` || d.stamp !== `/k/${T}/lessons?next=1`) problems.push(`M: the lessons objective does not lead to the next unpassed lesson (${d.lessons})`)
  else if (d.timer !== `/k/${T}/balance`) problems.push(`M: the timer objective does not lead to the balance screen (${d.timer})`)
  else if (d.friend !== null || d.outside !== null) problems.push('M: a row earned on the five a day is linking away from it, which sends a child off the screen they were about to finish')
  else if (d.noToken !== null) problems.push('M: a mission row builds a link without a token, so it would point at /k/null')
  else ok.push('M: lessons and the timer lead somewhere real, and the rows earned on the five a day stay put')
}
if (!/data-mission-href/.test(missionUi) || !/const Row = r\.href \? 'a' : 'div'/.test(missionUi)) problems.push('M: the mission rows are not doors, so a child cannot act on what they say')
else if (!/href: done \? null : missionHref/.test(read('lib/kid/mission.ts'))) problems.push('M: a finished objective still offers a door, which sends a child to do a thing they have already done')
else ok.push('M: a row is an anchor when it leads somewhere and a plain row when it does not')

// ── N: the child's bar fits, says what is waiting, and leads with the jobs ──
// Justin, 14 September 2026, from his phone: "tabs here misaligned and we
// should have printables and update on jobs eg waiting on parents to do etc,
// also can make balance hidden behind tab as a bit messy."
//
// Three faults in one screenshot. The bar overflowed its own edge because four
// flex:1 tabs with no minWidth cannot shrink below their longest label
// ("Printables" wants 103px; at 360 the four together want 19px more than the
// bar has, and it cleared 390 by 7px, which any larger text setting spends).
// The bar said nothing about the asks a child had sitting with their grown up.
// And the Quests tab opened on a balance dial rather than on the jobs.
if (!/minWidth: 0/.test(tabBar) || !(tabBar.match(/minWidth: 0/g) || []).length >= 2) problems.push('N: a tab cannot shrink, so the longest label decides the width of the bar and it runs off the edge')
else if (!/const LABEL = 'clamp\(/.test(tabBar) || !/fontSize: LABEL/.test(tabBar)) problems.push('N: the tab labels do not give way before the bar does')
else if (!/whiteSpace: 'nowrap'/.test(tabBar)) problems.push('N: a tab label can wrap, which makes the bar two rows tall rather than narrower')
else ok.push('N: the tab labels shrink and the bar keeps its edges at any width or text size')

// The CONDITION, not just the attribute: a badge behind a branch that can
// never be true still leaves its markup in the file, which is how the first
// version of this rule passed a mutation that switched it off.
if (!/data-waiting-badge/.test(tabBar) || !/badges\.waiting/.test(tabBar) || !/key === 'quests' && waiting > 0 && \(/.test(tabBar)) problems.push('N: the bar never says how many of this child\'s asks a grown up still has')
else if (!/waiting: waitingOnGrownUp/.test(screen) || !/const waitingOnGrownUp =/.test(screen)) problems.push('N: the screen does not count what is waiting on the grown up')
else if (!/Math\.max\(asks\.filter\(a => a\.status === 'pending'\)\.length, asksPendingTotal\)/.test(screen)) problems.push('N: the waiting count uses the loaded window rather than the real head count, so an older idea stops being counted')
else ok.push('N: the jobs tab carries what is waiting on a grown up, counted the way the cap counts it')

if (/<BalanceInsight/.test(screen)) problems.push('N: the balance dial is back on the jobs tab, so a child opening their jobs meets a gauge before a job')
else if (!/<BalanceInsight/.test(balancePage)) problems.push('N: the balance dial is on neither screen, so it has been lost rather than moved')
else ok.push('N: the dial leads the balance page and the jobs tab leads with the jobs')

// ── O. THE FIVE A DAY LEADS WITH THE THING TO DO ────────────────────────────
//
// Justin, 15 September 2026, from his phone, on the child's home: "not sure
// how to do the 5 a day, please make it super clear from Your five for today
// the click through flow."
//
// The card was headed "Your five for today, 1 of 5" and then, before anything
// a child could tap, drew the week calendar and the three row mission panel:
// on a 390 phone roughly a screen and a half of reading between the heading
// and the first action. The ticked steps came before the live one too, so the
// thing to do slid further down the card with every step a child finished.
//
// The order is the whole fix, so the order is what this pins. Every anchor
// below is REAL CODE with the comments stripped out first, because a rule that
// can be satisfied by a comment mentioning the right words proves nothing.
const fiveCode = fiveADay.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')

const liveAt = fiveCode.indexOf('state.steps.find(k => !state.done.includes(k))')
const doneAt = fiveCode.indexOf('state.steps.filter(key => state.done.includes(key))')
const weekAt = fiveCode.lastIndexOf('<WeekDone week={weekDone}')
const missionAt = fiveCode.lastIndexOf('data-mission-site="open"')

if (liveAt === -1) problems.push('O: the one live step is gone from the five a day')
else if (weekAt === -1 || missionAt === -1) problems.push('O: the week row or the mission is no longer drawn on the open card')
else if (liveAt > weekAt || liveAt > missionAt) problems.push('O: the week row or the mission is drawn ABOVE the live step again, so a child meets a screen and a half of reading before the first thing they can tap')
else if (doneAt === -1) problems.push('O: the ticked steps are gone, so the climb so far is not shown')
else if (liveAt > doneAt) problems.push('O: the ticked steps are back above the live step, so the thing to do moves further down the card with every step finished')
else ok.push('O: the five a day draws the live step first, then the climb, then the week and the mission')

// Either quote form: since 25 September 2026 the words carry the step number
// too ("Do this next · step 3 of 5"), which is a template literal.
if (!/['`]Start here/.test(fiveCode) || !/['`]Do this next/.test(fiveCode)) problems.push('O: the live step is not named, so the card shows a count and a bar and leaves a child to guess which row is the way in')
else ok.push('O: the live step says Start here on a fresh day and Do this next after')

// ── P. THE DAY SAYS ITS REAL NUMBER ─────────────────────────────────────────
//
// Justin, 15 September 2026, with Teo's home screen: the greeting read "3 of
// your five to go" and the card directly under it read "Your five for today,
// 1 of 4". Two numbers on one screen that did not agree.
//
// The maths was right the whole time: one of four done leaves three to go, and
// the counter reads the real state. What was wrong was the WORD. "five" was
// typed into the greeting and into the card's ribbon, and a Stage 1 child gets
// FOUR, because lib/kid/five-a-day drops homework and maths for four to seven
// year olds on purpose. So a six year old was told twice that four was five.
//
// stepsPerDay had been written for exactly this ("for a caller that needs to
// say it out loud") and had no callers at all.
//
// Neither the count nor the word is visible to a typecheck: both are strings
// and numbers that happen to disagree.
const fiveCopy = fiveADay.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const homeCopy = screen.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')

if (/'Your five for today'/.test(fiveCopy) || /"Your five for today"/.test(fiveCopy)) {
  problems.push('P: the five a day ribbon hardcodes the word five again. A Stage 1 child gets four, so it has to say the real number.')
} else if (!/dayWord\(/.test(fiveCopy)) {
  problems.push('P: the five a day ribbon does not use dayWord, so its heading can drift from its own counter')
} else if (/of your five to go/.test(homeCopy)) {
  problems.push('P: the child home greeting hardcodes "of your five to go" again, so it contradicts the card right underneath it for every Stage 1 child')
} else if (!/dayWord\(/.test(homeCopy)) {
  problems.push('P: the child home greeting does not use dayWord')
} else {
  ok.push('P: the greeting and the ribbon both say the day\'s real number, so a four step day never calls itself five')
}

// ── Q: THE DAY FIRST, AND THE SAFE WAYS NEVER FOLD (25 September 2026) ────
// Justin: the child's home should run with the five a day, step by step, "as
// a bit cluttered". While the day runs the extras fold behind one More things
// to do. What must never fold: the five a day itself, Use my time (the timer
// rule), Telling a grown up, and a live timer's own card.
{
  const q = screen
  if (!/const focusDay = !homeAll && todayTab\.total > 0 && !todayTab\.complete/.test(q)) problems.push('Q: the home no longer folds its extras while the day is running, so the five a day is lost among thirteen blocks again')
  else if (!/tiles=\{focusDay \? \[\] : tiles\}/.test(q)) problems.push('Q: the tile grid is no longer the thing that folds, check KidHomeTiles still draws Use my time and Telling a grown up whatever the tiles')
  else if (/focusDay[^\n]*tellHref|tellHref[^\n]*focusDay/.test(q)) problems.push('Q: Telling a grown up is gated on focusDay. It is the safe way to raise a hard thing and must never be folded away')
  else if (!/\(!focusDay \|\| deviceOpen \|\| !!liveSession\)/.test(q)) problems.push('Q: a running timer card can be folded away. A live countdown must always show')
  else ok.push('Q: the day runs first, the extras fold behind More things to do, and the timer, Use my time and Telling a grown up never fold')
}

if (problems.length > 0) {
  console.error('check-stickers-land FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-stickers-land ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
