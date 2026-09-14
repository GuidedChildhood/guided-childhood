// The daily jobs guide: start small, build up as weeks go well, advice not a block.
//
// Justin, 14 September 2026, having put twelve jobs on Jonny's board from the
// Top picks tab: "can we check we only allow recommended daily jobs and build
// up as they get better at doing them so they are not overwhelmed. A little
// warning and advice, not blocked."
//
//   A. The maths: start is two at four to ten and three from eleven, the
//      ceiling is the age's sweet spot, a week goes well at four agreed
//      ticks, the guide climbs one per good week and never past the ceiling,
//      the three statuses fall out of the count.
//   B. The card is on the Add a job tab, fed by jobs due TODAY and the four
//      weeks of agreed ticks the API now returns, and the composer is fed the
//      same number.
//   C. Nothing is blocked: the API's add route has no guide check, the card
//      says so out loud, and no copy carries a dash.
//
//   node --experimental-strip-types scripts/check-job-guide.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []
const blank = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
const read = (f) => blank(readFileSync(f, 'utf8'))

const guideSrc = readFileSync('lib/quests/job-guide.ts', 'utf8')
const card = read('components/quests/JobGuideCard.tsx')
const manage = read('app/(dashboard)/dashboard/quests/manage/ManageJobs.tsx')
const composer = read('components/quests/JobComposer.tsx')
const api = read('app/api/quests/route.ts')
const fixture = read('app/dev/add-job/page.tsx')

// ── A: the maths, against the real module ───────────────────────────────────
const probe = `
import { jobGuide, startingJobs, weeksGoingWell } from './lib/quests/job-guide.ts'
const today = new Date(2026, 8, 17) // a Thursday, so four days back stay inside the week
const iso = (daysBack) => { const d = new Date(today); d.setDate(d.getDate() - daysBack); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
const week = (k) => [0, 1, 2, 3].map(d => iso(k * 7 + d))
const out = {
  starts: ['4-7', '8-10', '11-13', '13-15', '16+'].map(b => jobGuide(b, 0, []).start),
  ceilings: ['4-7', '8-10', '11-13', '13-15', '16+'].map(b => jobGuide(b, 0, []).ceiling),
  fresh: jobGuide('11-13', 12, [], today),
  three: jobGuide('11-13', 3, [], today),
  two: jobGuide('11-13', 2, [], today),
  oneGood: jobGuide('11-13', 4, week(0), today).guide,
  twoGood: jobGuide('11-13', 4, [...week(0), ...week(1)].map(d => d), today).guide,
  capped: jobGuide('4-7', 3, [...week(0), ...week(1), ...week(2), ...week(3)], today).guide,
  thinWeek: weeksGoingWell([iso(0), iso(1), iso(2)], today),
  oldWeek: weeksGoingWell([iso(35), iso(36), iso(37), iso(38)], today),
  startOf: [3, 4, 5, 6].map(startingJobs),
}
console.log(JSON.stringify(out))
`
const run = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8' })
if (run.status !== 0) problems.push(`A: the probe could not run: ${(run.stderr || '').split('\n').slice(0, 3).join(' ')}`)
else {
  const r = JSON.parse(run.stdout.trim().split('\n').pop())
  if (r.starts.join() !== '2,2,3,3,3') problems.push(`A: start is not two at four to ten and three from eleven (${r.starts.join()})`)
  else if (r.ceilings.join() !== '3,4,5,6,6') problems.push(`A: the ceiling is not the age's sweet spot (${r.ceilings.join()})`)
  else if (r.fresh.guide !== 3 || r.fresh.status !== 'over') problems.push(`A: twelve jobs for a fresh eleven year old is not over a guide of three (${r.fresh.guide}, ${r.fresh.status})`)
  else if (r.three.status !== 'at' || r.two.status !== 'room') problems.push('A: at and room do not fall out of the count')
  else if (r.oneGood !== 4 || r.twoGood !== 5) problems.push(`A: a good week does not lift the guide by one (${r.oneGood}, ${r.twoGood})`)
  else if (r.capped !== 3) problems.push(`A: the guide passed the ceiling (${r.capped})`)
  else if (r.thinWeek !== 0 || r.oldWeek !== 0) problems.push(`A: a thin week or a week older than four counted as going well (${r.thinWeek}, ${r.oldWeek})`)
  else if (r.startOf.join() !== '2,2,3,3') problems.push(`A: startingJobs is not half the ceiling rounded up, never under two (${r.startOf.join()})`)
  else if (!/nothingBlocked: 'Nothing is blocked\./.test(guideSrc)) problems.push('A: the guide does not carry the nothing is blocked line')
  else ok.push('A: start, ceiling, the good weeks and the three statuses hold against the real module')
}

// ── B: on the page, fed by today and the four weeks ─────────────────────────
if (!/<JobGuideCard guide=\{guide\} childName=\{childName \?\? null\} onSeeJobs=\{\(\) => goTab\('theirs'\)\} \/>/.test(manage)) problems.push('B: the Add a job tab has no guide card')
else if (!/questDueToday\(q\.schedule, q\.schedule_days \?\? null\)/.test(manage) || !/jobGuide\(kid\?\.age_band \?\? null, dueToday\.length, dates\)/.test(manage)) problems.push('B: the guide is not read off the jobs due today for this child')
else if (!/setRecentApproved\(d\.recentApproved \?\? \[\]\)/.test(manage) || !/recentApproved: approvedRes\.data \?\? \[\]/.test(api) || !/\.eq\('status', 'approved'\)\.gte\('tick_date', fourWeeksAgo\)/.test(api)) problems.push('B: the API does not hand the page four weeks of agreed ticks')
else if (!/comfortable=\{guide\.guide\}/.test(manage) || !/typeof comfortable === 'number' \? comfortable :/.test(composer)) problems.push('B: the composer and the guide card can disagree on the number')
else if (!/data-over-guide/.test(manage)) problems.push('B: the board count line does not say when it is over the guide')
else if (!/<JobGuideCard guide=\{guide\}/.test(fixture) || !/params\.get\('board'\)/.test(fixture)) problems.push('B: the fixture cannot show the heavy board')
else ok.push('B: the card sits on the Add a job tab, fed by today and the four weeks, and the composer reads the same number')

// ── C: advice, not a block ──────────────────────────────────────────────────
const postSrc = api.slice(api.indexOf('export async function POST'))
if (/jobGuide|job-guide|maxJobs|too many jobs/.test(postSrc)) problems.push('C: the add route checks the guide, which makes it a block')
else if (!/data-nothing-blocked/.test(card) || !/guide\.nothingBlocked/.test(card)) problems.push('C: the card does not say nothing is blocked')
else if (!/data-guide-trim/.test(card)) problems.push('C: the card has no door to trim the list')
else {
  const copy = [guideSrc, readFileSync('components/quests/JobGuideCard.tsx', 'utf8')]
    .map(src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' '))
    .join('\n')
  const strings = [...copy.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*)\1/g)].map(m => m[2])
  const dashed = strings.filter(t => /[–—]|\s-\s/.test(t) && /[a-z]{3,}/.test(t))
  if (dashed.length) problems.push(`C: a dash in the guide copy: ${dashed[0].slice(0, 60)}`)
  else ok.push('C: the add route takes every add, the card says nothing is blocked, and the copy has no dashes')
}

if (problems.length > 0) {
  console.error('check-job-guide FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-job-guide ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
