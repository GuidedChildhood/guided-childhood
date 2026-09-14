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
else if (!/\.eq\('status', 'approved'\)/.test(book) || !/\.contains\('done', \['move'\]\)/.test(book)) problems.push('B: jobs must count approved ticks and outside must count the move step')
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
const subPages = ['jobs', 'lessons', 'planet', 'suggest', 'tell', 'print']
const missing = subPages.filter(p => !/<KidTodayReturn token=\{token\} \/>/.test(read(`app/k/[token]/${p}/page.tsx`)))
if (missing.length) problems.push(`F: no way back to today on ${missing.join(', ')}`)
else ok.push(`F: the way back to today is on all ${subPages.length} sub pages`)

// ── F2: the ask row cannot get stuck, and the week page is off the yellow ───
const weekPage = read('app/k/[token]/week/page.tsx')
if (!/if \(!state \|\| asksPending <= 0\) return/.test(fiveADay) || !/void mark\('ask', true, 'Idea already with your grown up'\)/.test(fiveADay)) problems.push('F2: an idea already with the grown up does not tick the ask row')
else if (!/Still to do: \$\{jobsLeft\.slice\(0, 3\)\.join/.test(fiveADay)) problems.push('F2: the jobs row does not name the jobs still to do')
else if (!/asksPending=\{asks\.filter\(a => a\.status === 'pending'\)\.length\}/.test(screen) || !/jobsLeft=\{quests\.filter\(q => !ticks\[q\.id\]\)\.map\(q => q\.title\)\}/.test(screen)) problems.push('F2: the screen does not hand the pending asks and the jobs left to the five a day')
else ok.push('F2: an idea with the grown up ticks the ask row, and the jobs row names what is left')
if (/background: 'var\(--butter\)'/.test(weekPage)) problems.push('F2: the child\'s week page is a slab of butter again')
else if (!/env\(safe-area-inset-top\)/.test(weekPage) || !/buddyFor\(/.test(weekPage)) problems.push('F2: the week page has no safe area padding or no Friend')
else ok.push('F2: the week page sits on the dotted sky with the Friend, clear of the status bar')

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

if (problems.length > 0) {
  console.error('check-stickers-land FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-stickers-land ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
