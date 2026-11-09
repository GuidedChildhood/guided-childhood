// The thirty everyday flashpoints: researched, planned, and headed off before
// they start (lib/content/family-flashpoints.ts, Justin 9 November 2026).
//
//   A. The bank: exactly thirty rows, the messy bedroom first, unique keys and
//      concern slugs, every band covered, every row with a source URL, three or
//      more keywords, no dash in any copy field, and nothing in the plan that
//      takes a device away or punishes.
//   B. Every script a row names exists in the seeds.
//   C. The heads up: at most two days a week per row, a push body of push
//      length that names the child, and the picker sends the room row on a
//      Monday before school to a family who claimed it, and nothing on the
//      Tuesday or to a family who did not.
//   D. The matcher lands every row from its own words, and a message about
//      nothing matches nothing.
//   E. The wiring: the cron asks for the heads up before the usual line and
//      never sends it to a child's device, DiGi asks the device bank first and
//      prints the flashpoint block, the claim route raises the concern, and the
//      page is reachable from Everything else.
//
// Run: node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-family-flashpoints.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { scriptTitles } from './lib/script-titles.mjs'

const problems = []
const ok = []
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
const BANDS = ['4-7', '8-10', '11-13', '13-15', '16+']

const probe = `
import { FAMILY_FLASHPOINTS, headsUpLine } from './lib/content/family-flashpoints.ts'
import { inferFlashpoint } from './lib/content/family-flashpoints-match.ts'
import { pickHeadsUp, claimedFlashpoints, dayOfWeek, headsUpPush } from './lib/push/flashpoint-heads-up.ts'
const rows = FAMILY_FLASHPOINTS.map(f => ({
  key: f.key, bands: f.bands, slug: f.proof.concernSlug, url: f.source.url, scripts: f.proof.scripts,
  keywords: f.keywords.length, days: f.headsUp.days, window: f.headsUp.window,
  body: headsUpLine(f, 'Ava').body, title: f.headsUp.title, rawBody: f.headsUp.body,
  copy: [f.name, f.when, f.mechanism, f.parentFirst, f.plan, f.childSide, f.prevent, f.headsUp.title, f.headsUp.body, f.gap ?? ''].join(' '),
  plan: f.plan,
}))
const matches = FAMILY_FLASHPOINTS.map(f => {
  const words = f.keywords.slice(0, 2).join(' and ')
  return { key: f.key, got: inferFlashpoint('honestly ' + words + ' and I do not know what to do', f.bands[0])?.key ?? null }
})
const none = inferFlashpoint('what is the weather like on saturday', '8-10')?.key ?? null
const real = inferFlashpoint('my daughter is 11 and will never tidy her room, it is a tip again by Monday', '11-13')?.key ?? null
// 9 November 2026 is a Monday. Day numbers count from 1 January 1970, a Thursday.
const monday = Math.floor(Date.UTC(2026, 10, 9) / 86400000)
const claimed = claimedFlashpoints([{ slug: 'messy-bedroom', label: 'The bedroom that never stays tidy', child_id: 'c1' }])
const onMonday = pickHeadsUp('morning', monday, true, claimed)
const onTuesday = pickHeadsUp('morning', monday + 1, true, claimed)
const afternoon = pickHeadsUp('home', monday, true, claimed)
const unclaimed = pickHeadsUp('morning', monday, true, [])
const holiday = pickHeadsUp('morning', monday, false, claimed)
const push = onMonday ? headsUpPush(onMonday.flashpoint, 'Ava', 'c1') : null
console.log(JSON.stringify({ rows, matches, none, real, dow: dayOfWeek(monday), onMonday: onMonday?.flashpoint.key ?? null, onTuesday: onTuesday?.flashpoint.key ?? null, afternoon: afternoon?.flashpoint.key ?? null, unclaimed: unclaimed?.flashpoint.key ?? null, holiday: holiday?.flashpoint.key ?? null, push }))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
if (r.status !== 0) {
  problems.push(`the probe could not run the real code: ${(r.stderr || '').trim().split('\n').slice(-4).join(' ')}`)
} else {
  const out = JSON.parse(r.stdout.trim().split('\n').pop())
  // A
  if (out.rows.length !== 30) problems.push(`A: the bank has ${out.rows.length} rows, not thirty`)
  if (out.rows[0]?.key !== 'messy_room') problems.push('A: the messy bedroom is not the first row')
  const keys = new Set(out.rows.map(x => x.key)), slugs = new Set(out.rows.map(x => x.slug))
  if (keys.size !== out.rows.length) problems.push('A: two rows share a key')
  if (slugs.size !== out.rows.length) problems.push('A: two rows share a concern slug')
  for (const b of BANDS) if (!out.rows.some(x => x.bands.includes(b))) problems.push(`A: no row covers band ${b}`)
  for (const x of out.rows) {
    if (!/^https:\/\//.test(x.url)) problems.push(`A: ${x.key} has no https source URL`)
    if (x.keywords < 3) problems.push(`A: ${x.key} has fewer than three keywords`)
    if (/[—–]|\s-\s/.test(x.copy)) problems.push(`A: ${x.key} has a dash in its copy`)
    if (/\b(confiscat|take (the|their|his|her) (phone|tablet|device|console) away|ground (them|him|her)|grounded|punish)/i.test(x.plan)) problems.push(`A: ${x.key}'s plan punishes or confiscates`)
    if (!/^[a-z0-9-]+$/.test(x.slug)) problems.push(`A: ${x.key}'s concern slug is not kebab case`)
  }
  if (!problems.some(p => p.startsWith('A:'))) ok.push(`A: thirty rows, the room first, every band covered, sourced, no dash, no punishment`)
  // B
  const titles = new Set(scriptTitles().map(t => t.title))
  const missing = []
  for (const x of out.rows) for (const t of x.scripts) if (!titles.has(t)) missing.push(`${x.key}: "${t}"`)
  if (missing.length) problems.push(`B: scripts that do not exist in the seeds: ${missing.join('; ')}`)
  else ok.push(`B: every script a row names exists in the seeds (${titles.size} titles read)`)
  // C
  for (const x of out.rows) {
    if (x.days.length === 0 || x.days.length > 2) problems.push(`C: ${x.key} heads up runs on ${x.days.length} days a week (one or two)`)
    if (x.days.some(d => d < 0 || d > 6)) problems.push(`C: ${x.key} has a day outside 0 to 6`)
    if (x.body.length > 170) problems.push(`C: ${x.key} heads up body is ${x.body.length} characters (170 at most)`)
    if (x.title.length > 40) problems.push(`C: ${x.key} heads up title is too long for a push`)
    if (!x.rawBody.includes('{kid}') && !['parents_disagree'].includes(x.key) && !/\byou\b/i.test(x.rawBody)) problems.push(`C: ${x.key} heads up speaks to nobody`)
  }
  if (out.dow !== 1) problems.push(`C: dayOfWeek reads 9 November 2026 as ${out.dow}, not Monday`)
  if (out.onMonday !== 'messy_room') problems.push(`C: a family who claimed the room gets ${out.onMonday} on Monday before school`)
  if (out.onTuesday !== null) problems.push(`C: the room heads up also went on Tuesday (${out.onTuesday})`)
  if (out.afternoon !== null) problems.push(`C: the room heads up also went in the afternoon (${out.afternoon})`)
  if (out.unclaimed !== null) problems.push(`C: a family who claimed nothing got ${out.unclaimed}`)
  if (out.holiday !== null) problems.push(`C: the room heads up went on a holiday Monday (${out.holiday})`)
  if (!out.push || out.push.url !== '/dashboard/flashpoints?child=c1#messy_room' || !out.push.body.includes('Ava')) problems.push(`C: the push does not open the plan for the child: ${JSON.stringify(out.push)}`)
  if (!problems.some(p => p.startsWith('C:'))) ok.push('C: one or two days each, push length, and the room goes on Monday before school to the family who claimed it and nobody else')
  // D
  const wrong = out.matches.filter(m => m.got !== m.key)
  if (wrong.length) problems.push(`D: the matcher misses its own words for: ${wrong.map(m => `${m.key} (got ${m.got})`).join(', ')}`)
  else ok.push('D: the matcher lands every row from its own words')
  if (out.none !== null) problems.push(`D: a message about nothing matched ${out.none}`)
  if (out.real !== 'messy_room') problems.push(`D: the real Monday message matched ${out.real}, not the room`)
  if (out.none === null && out.real === 'messy_room') ok.push('D: the real Monday message lands on the room, and nothing matches nothing')
}

// E
const cron = strip(readFileSync('app/api/push/cron/route.ts', 'utf8'))
const headsAt = cron.indexOf('pickHeadsUp('), usualAt = cron.indexOf('windowPushFor(window')
if (headsAt === -1 || usualAt === -1 || headsAt > usualAt) problems.push('E: the window pass does not ask for the heads up before the usual line')
else ok.push('E: the window pass asks for the heads up first')
const headsSend = cron.slice(headsAt, cron.indexOf('continue', headsAt))
if (/childId/.test(headsSend.slice(headsSend.indexOf('sendPush(')))) problems.push("E: the heads up passes childId to sendPush, which would send it to the child's device")
else ok.push("E: the heads up goes to the parent's devices only")
const route = strip(readFileSync('app/api/digi/route.ts', 'utf8'))
if (!/const flashpoint = issue \? null : inferFlashpoint\(/.test(route)) problems.push('E: DiGi no longer asks the device bank first')
else ok.push('E: DiGi asks the device bank first, then the everyday rows')
if (!/THE EVERYDAY ROW THIS FAMILY IS IN/.test(route) || !/never a rule, never a punishment/.test(route)) problems.push('E: the DiGi flashpoint block is missing or lost its rail')
else ok.push('E: the DiGi block carries the plan, the parent first line and the rail')
const claim = strip(readFileSync('app/api/flashpoints/claim/route.ts', 'utf8'))
if (!/raiseConcern\(/.test(claim) || !/parent_id', user\.id/.test(claim)) problems.push('E: the claim route does not raise the concern for a child of this parent')
else ok.push("E: the claim raises the concern, only for this parent's child")
const grid = readFileSync('components/home/ExploreGrid.tsx', 'utf8')
if (!/'\/dashboard\/flashpoints'/.test(grid)) problems.push('E: the page is not reachable from Everything else')
else ok.push('E: the page is reachable from Everything else')

for (const line of ok) console.log(`PASS  ${line}`)
if (problems.length) {
  console.error('')
  for (const p of problems) console.error(`FAIL  ${p}`)
  process.exit(1)
}
console.log('\nflashpoints hold')
