// The top device problems by age, every one solved in the product or named
// as a gap, and read by DiGi, the loop and the recommender.
//
// Justin, 13 September 2026: "DiGi can answer and provide solutions for each
// device related issue. Research by age the top proven common issues, all
// solved in our service and prevented."
//
//   A. Run the bank: every issue has a source URL, a category from the eight,
//      at least one proof script, three or more keywords, no dash in any
//      copy field; every band has six or more issues; no band's top three
//      carries a gap; the ranking per band is the one BAND_ORDER declares.
//   B. Every proof script title exists in the seeds (migrations and seeds
//      directories, read by scripts/lib/script-titles.mjs), and the four
//      scripts migration 298 adds are all named by an issue.
//   C. The matcher lands: for every issue, a sentence built from its own
//      words with the child in its first band comes back as that issue.
//   D. DiGi's route infers the issue and puts its block in the precedence
//      line; the recommender offers the band's categories with the 'age'
//      key; Home picks the first issue not acted on and shows its script.
//
// Run:
//   node --experimental-strip-types scripts/check-device-issues.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { scriptTitles } from './lib/script-titles.mjs'

const problems = []
const ok = []
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
const CATEGORIES = new Set(['screen-time', 'social-media', 'gaming', 'staying-safe', 'mood-confidence', 'family-rules', 'school-and-ai', 'everyday-routines'])
const BANDS = ['4-7', '8-10', '11-13', '13-15', '16+']

const probe = `
import { DEVICE_ISSUES, BAND_ORDER, issuesForBand, bandIssueCategories } from './lib/content/device-issues.ts'
import { inferIssue } from './lib/content/device-issues-match.ts'
import { pickIssue } from './lib/home/issue-of-week.ts'
const bands = ${JSON.stringify(BANDS)}
const perBand = Object.fromEntries(bands.map(b => [b, issuesForBand(b).map(i => ({ key: i.key, gap: i.gap ?? null }))]))
const order = BAND_ORDER
const matches = DEVICE_ISSUES.map(i => {
  const words = i.keywords.slice(0, 2).join(' and ')
  return { key: i.key, band: i.bands[0], got: inferIssue('my child ' + words + ' and I do not know what to do', i.bands[0])?.key ?? null }
})
const none = inferIssue('what is the weather like', '8-10')
const cats = bandIssueCategories('8-10').map(c => c.category)
// The picker over three states: nothing acted on, the first issue's scripts
// acted on, everything acted on.
const rows = issuesForBand('8-10').flatMap((i, n) => i.proof.scripts.map((t, k) => ({ sort_order: n * 10 + k + 1, title: t, is_free: k === 0 })))
const first = issuesForBand('8-10')[0]
const firstRows = rows.filter(r => first.proof.scripts.includes(r.title)).map(r => r.sort_order)
const picks = {
  fresh: pickIssue('8-10', rows, new Set(), 3),
  afterFirst: pickIssue('8-10', rows, new Set(firstRows), 3),
  all: pickIssue('8-10', rows, new Set(rows.map(r => r.sort_order)), 3),
}
console.log(JSON.stringify({ issues: DEVICE_ISSUES.map(i => ({ key: i.key, bands: i.bands, name: i.name, url: i.source.url, category: i.proof.category, scripts: i.proof.scripts, keywords: i.keywords.length, copy: [i.name, i.words, i.mechanism, i.response, i.prevent].join(' ') })), perBand, order, matches, none: none?.key ?? null, cats, picks: { fresh: { key: picks.fresh?.issue.key, script: picks.fresh?.script?.title, kept: picks.fresh?.kept }, afterFirst: { key: picks.afterFirst?.issue.key, kept: picks.afterFirst?.kept }, all: { key: picks.all?.issue.key, kept: picks.all?.kept } } }))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
if (r.status !== 0) {
  problems.push(`the probe could not run the real code: ${(r.stderr || '').trim().split('\n').slice(-4).join(' ')}`)
} else {
  const out = JSON.parse(r.stdout.trim().split('\n').pop())
  // A
  for (const i of out.issues) {
    if (!/^https?:\/\//.test(i.url)) problems.push(`A: ${i.key} has no source URL`)
    if (!CATEGORIES.has(i.category)) problems.push(`A: ${i.key} names a category that is not live: ${i.category}`)
    if (i.scripts.length === 0) problems.push(`A: ${i.key} has no proof script`)
    if (i.keywords < 3) problems.push(`A: ${i.key} has fewer than three keywords`)
    if (/[—–]/.test(i.copy)) problems.push(`A: ${i.key} has a dash in its copy`)
  }
  if (problems.length === 0) ok.push(`A: ${out.issues.length} issues, every one with a source, a live category, a proof script and no dash`)
  for (const b of BANDS) {
    const list = out.perBand[b]
    if (list.length < 6) problems.push(`A: band ${b} has only ${list.length} issues`)
    const topGap = list.slice(0, 3).find(i => i.gap)
    if (topGap) problems.push(`A: band ${b} carries a gap in its top three: ${topGap.key}`)
    const declared = out.order[b] ?? []
    if (list.slice(0, declared.length).map(i => i.key).join() !== declared.filter(k => list.some(i => i.key === k)).join()) problems.push(`A: band ${b} is not in the declared order`)
  }
  ok.push('A: every band has six or more issues, ranked as declared, no gap in a top three')
  // C
  const wrong = out.matches.filter(m => m.got !== m.key)
  if (wrong.length) problems.push(`C: the matcher misses its own words for: ${wrong.map(m => `${m.key} (got ${m.got})`).join(', ')}`)
  else ok.push(`C: the matcher lands every issue from its own words in its band`)
  if (out.none !== null) problems.push(`C: a message about nothing matched ${out.none}`)
  else ok.push('C: a message about nothing matches nothing')
  if (out.cats[0] !== 'screen-time' || !out.cats.includes('gaming')) problems.push(`C: the band categories for 8 to 10 do not lead with the most raised: ${out.cats.join(',')}`)
  else ok.push('C: the recommender signal leads with what the age brings most')
  if (out.picks.fresh.key !== out.perBand['8-10'][0].key || out.picks.fresh.kept !== false || !out.picks.fresh.script) problems.push(`C: a fresh family is not handed the top issue and its script: ${JSON.stringify(out.picks.fresh)}`)
  else ok.push('C: a fresh family is handed the top issue and its first script')
  if (out.picks.afterFirst.key !== out.perBand['8-10'][1].key || out.picks.afterFirst.kept !== false) problems.push(`C: after the first issue is acted on the second is not offered: ${JSON.stringify(out.picks.afterFirst)}`)
  else ok.push('C: an issue acted on is never re offered as to do')
  if (out.picks.all.kept !== true) problems.push(`C: with everything acted on the fix is not marked kept up: ${JSON.stringify(out.picks.all)}`)
  else ok.push('C: with everything done the week rotates as kept up')
  // B
  const titles = new Set(scriptTitles().map(t => t.title))
  const missing = []
  for (const i of out.issues) for (const t of i.scripts) if (!titles.has(t)) missing.push(`${i.key}: "${t}"`)
  if (missing.length) problems.push(`B: proof scripts that do not exist in the seeds: ${missing.join('; ')}`)
  else ok.push(`B: every proof script exists in the seeds (${titles.size} titles read)`)
  const mig = readFileSync('supabase/migrations/298_reminder_time_and_gap_scripts.sql', 'utf8')
  const added = [...mig.matchAll(/where not exists \(select 1 from public\.scripts where title = '([^']+)'\)/g)].map(m => m[1])
  const named = new Set(out.issues.flatMap(i => i.scripts))
  const orphan = added.filter(t => !named.has(t))
  if (added.length < 4) problems.push(`B: migration 298 adds ${added.length} scripts, expected four`)
  else if (orphan.length) problems.push(`B: migration 298 adds scripts no issue names: ${orphan.join('; ')}`)
  else ok.push('B: the four gap scripts are each the proof path of an issue')
}

// D
const route = strip(readFileSync('app/api/digi/route.ts', 'utf8'))
if (!/const issue = inferIssue\(String\(message\)/.test(route)) problems.push('D: the DiGi route no longer infers the issue')
else ok.push('D: the DiGi route infers the issue from the message and the band')
const prec = route.slice(route.indexOf('PRECEDENCE +'), route.indexOf('laneShape(lane)', route.indexOf('PRECEDENCE +')))
if (!/issueKnowledge/.test(prec)) problems.push('D: the issue block is not in the precedence line')
else ok.push('D: the issue block reaches the system prompt')
if (!/never as a rule and never as taking the device away/.test(route)) problems.push('D: the issue block no longer holds never allow or deny')
else ok.push('D: the issue block holds never allow or deny')
const rec = strip(readFileSync('lib/pathway/recommend.ts', 'utf8'))
if (!/bandIssueCategories\(/.test(rec) || !/'age'\)/.test(rec)) problems.push('D: the recommender no longer offers the band\'s issues')
else ok.push("D: the recommender offers the band's issues as its weakest signal")
const home = strip(readFileSync('app/(dashboard)/dashboard/page.tsx', 'utf8'))
if (!/pickIssueOfWeek\(/.test(home) || !/<IssueOfTheWeek/.test(home)) problems.push('D: Home no longer shows the fix of the week')
else ok.push('D: Home shows the fix of the week')

for (const line of ok) console.log(`PASS  ${line}`)
if (problems.length) {
  console.error('')
  for (const p of problems) console.error(`FAIL  ${p}`)
  process.exit(1)
}
console.log('\nall passed')
