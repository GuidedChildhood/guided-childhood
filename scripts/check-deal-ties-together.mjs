// The deal ties together: a job says what it is worth at add time, the list
// says when the first week is full, the agreement is at the ask and at the
// yes, both sides are told about the guide, and DiGi knows a first hello.
//
// Justin, 14 September 2026, from the Monday walkthrough on his phone. Six
// rules hold what he asked for, importing the real sweet spot and the real
// deal helper rather than reading their text, because a guard its own
// documentation satisfies is not a guard:
//
//   A. The composer offers the family job choice while the questions run,
//      and passes it out with the add; both parent pages send it to the API.
//   B. The first week line is the age's sweet spot, not a flat number:
//      three at four to seven, six at thirteen plus, and it names the first
//      week. Both parent pages give the composer the age band.
//   C. The deal helper returns the two lines that matter at the ask (when
//      screens go off, how time is earned), and nothing for no agreement.
//   D. The child's card takes the deal lines and the child's page passes
//      them; the parent's feed returns the deal and the yes box shows it,
//      with a doorway to making one when there is none.
//   E. Both guide lines speak under the guide, name nearly there, and name
//      the jobs that could earn more.
//   F. DiGi's first hello exists, is gated on a new family AND a first
//      greeting, and Home passes the account age.
//
//   node --experimental-strip-types scripts/check-deal-ties-together.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []
const blank = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
const read = (f) => blank(readFileSync(f, 'utf8'))

const composer = read('components/quests/JobComposer.tsx')
const manage = read('app/(dashboard)/dashboard/quests/manage/ManageJobs.tsx')
const quests = read('app/(dashboard)/dashboard/quests/QuestManager.tsx')
const kidCard = read('components/quests/DeviceTimeCard.tsx')
const kidPage = read('app/k/[token]/page.tsx')
const kidScreen = read('app/k/[token]/KidQuestScreen.tsx')
const activeRoute = read('app/api/quests/time/active/route.ts')
const parentCard = read('components/quests/ParentDeviceTime.tsx')
const sheet = read('components/digi/DigiWelcomeSheet.tsx')
const home = read('app/(dashboard)/dashboard/page.tsx')

// ── A: the family job choice at add time ────────────────────────────────────
if (!/Make it a family job/.test(composer) || !/setFamilyJob\(v => !v\)/.test(composer)) problems.push('A: the composer has no family job chip')
else if (!/familyJob: boolean\) => void/.test(composer) || !/\n\s+asFamily,\n\s+\)/.test(composer)) problems.push('A: the composer does not pass the family job choice out with the add')
else ok.push('A: the composer offers the family job and passes the choice with the add')
for (const [name, src] of [['ManageJobs', manage], ['QuestManager', quests]]) {
  const sends = (src.match(/is_family_job: familyJob/g) || []).length
  if (sends === 0) problems.push(`A: ${name} does not send is_family_job from the composer`)
  else ok.push(`A: ${name} sends is_family_job from the composer (${sends} mount${sends === 1 ? '' : 's'})`)
}

// ── B: the first week line from the real sweet spot ─────────────────────────
const probe = `
import { assessJobLoad } from './lib/quests/job-load.ts'
import { dealLinesFrom } from './lib/content/agreement-clauses.ts'
console.log(JSON.stringify({
  young: assessJobLoad('4-7', []).maxJobs,
  teen: assessJobLoad('13-15', []).maxJobs,
  none: dealLinesFrom(null),
  empty: dealLinesFrom({ bedroom_rule_time: '', extra_agreements: '' }),
  full: dealLinesFrom({ bedroom_rule_time: '7pm on school nights', bedroom_rule_location: 'Kitchen', extra_agreements: 'Screens at the table: No screens at meals\\nHow screen time is earned: Stars from quests buy screen minutes' }),
  bedtimeOnly: dealLinesFrom({ bedroom_rule_time: '8pm', bedroom_rule_location: 'Hallway', extra_agreements: '' }),
}))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
if (r.status !== 0) {
  problems.push(`B/C: the probe could not run the real helpers: ${(r.stderr || '').trim().split('\n').slice(-2).join(' ')}`)
} else {
  const o = JSON.parse(r.stdout.trim().split('\n').pop())
  if (o.young === 3 && o.teen === 6) ok.push('B: the sweet spot is three at four to seven and six at thirteen plus')
  else problems.push(`B: the sweet spot moved (${o.young}, ${o.teen}); the first week line reads it, so check it still makes sense`)
  if (!/assessJobLoad\(ageBand, \[\]\)\.maxJobs/.test(composer)) problems.push('B: the composer does not read the age sweet spot for its nudge')
  else if (!/enough for the first week/.test(composer) || !/get used to the deal, then add the life jobs/.test(composer)) problems.push('B: the composer does not say the first week line')
  else ok.push('B: the composer nudges at the age sweet spot and names the first week')
  for (const [name, src] of [['ManageJobs', manage], ['QuestManager', quests]]) {
    if (!/<JobComposer[\s\S]{0,400}?ageBand=\{/.test(src)) problems.push(`B: ${name} mounts the composer without the age band`)
    else ok.push(`B: ${name} gives the composer the age band`)
  }

  // ── C: the deal helper ───────────────────────────────────────────────────
  const c = [
    [Array.isArray(o.none) && o.none.length === 0, 'C: no agreement is no lines'],
    [Array.isArray(o.empty) && o.empty.length === 0, 'C: an empty agreement is no lines'],
    [o.full.length === 2 && o.full[0].key === 'screens-off' && o.full[1].key === 'earn-time' && o.full[1].text === 'Stars from quests buy screen minutes', 'C: screens off and how time is earned come back, the earn line stripped of its title'],
    [o.bedtimeOnly.length === 2 && o.bedtimeOnly[1].key === 'device-sleep', 'C: with no earn clause, where devices sleep fills the second line'],
  ]
  for (const [pass, label] of c) (pass ? ok : problems).push(pass ? label : `${label}: NOT so`)
}

// ── D: the deal at the ask and at the yes ───────────────────────────────────
if (!/dealLines\?: string\[\]/.test(kidCard) || !/dealLines\.map\(/.test(kidCard)) problems.push("D: the child's card does not take or show the deal lines")
else if (!/dealLinesFrom\(/.test(kidPage) || !/dealLines=\{dealLines\}/.test(kidPage) || !/dealLines=\{dealLines\}/.test(kidScreen)) problems.push("D: the child's page does not pass the deal lines through to the card")
else ok.push("D: the child's card shows the deal at the ask")
if (!/dealLinesFrom\(/.test(activeRoute) || !/\n\s+deal,\n/.test(activeRoute)) problems.push("D: the parent's active feed does not return the deal")
else if (!/deal\?: FamilyDeal/.test(parentCard) || !/Your deal:/.test(parentCard) || !/No family deal yet/.test(parentCard)) problems.push("D: the parent's yes box does not show the deal, or the doorway to one")
else if (!/<ChildRow[^>]*deal=\{deal\}/.test(parentCard) || !/<PendingAskBox[\s\S]{0,600}?deal=\{deal\}/.test(parentCard)) problems.push("D: the deal does not reach the yes box from the feed (row or box not passed it)")
else ok.push("D: the parent's yes box shows the deal, and points to making one")

// ── E: both told about the guide ────────────────────────────────────────────
if (!/Nearly at today's healthy amount/.test(kidCard) || !/minutes of today's healthy amount left/.test(kidCard) || !/Jobs still to do could earn/.test(kidCard)) problems.push("E: the child's card does not speak under the guide")
else ok.push("E: the child's card says what is left, nearly there, and what jobs could earn")
if (!/Nearly at today's guide/.test(parentCard) || !/min of today's guide left/.test(parentCard) || !/still to do could earn more/.test(parentCard) || !/jobsLeft=\{kid\.jobsLeft\?\.count/.test(parentCard)) problems.push("E: the parent's guide line does not speak under the guide")
else ok.push("E: the parent's guide line says what is left, nearly there, and the jobs that could earn more")

// ── F: DiGi's first hello ───────────────────────────────────────────────────
if (!/Lovely to meet you/.test(sheet)) problems.push('F: DiGi has no first hello')
else if (!/if \(count === 0 && newFamily\) setFirstHello\(true\)/.test(sheet)) problems.push('F: the first hello is not gated on a new family AND a first greeting')
else if (!/newFamily=\{accountAgeDays <= 7\}/.test(home)) problems.push('F: Home does not tell the sheet the account is new')
else ok.push('F: DiGi says hello on the first greeting of a new family, and welcome back after')

// ── G: something else, and hello@ hears about it ────────────────────────────
//
// Justin, 14 September 2026, on the add a device list: "should we have Other,
// please add, that messages hello@". The picker names it, the route saves it
// like any device and tells the contact inbox, with nothing that identifies
// the family.
const screens = read('components/devices/YourScreens.tsx')
const devRoute = read('app/api/devices/family/route.ts')
if (!/Something else/.test(screens) || !/other: isOther/.test(screens) || !/What kind of thing is it\?/.test(screens)) problems.push('G: the screens picker has no Something else door that names the kind')
else if (!/d\.other === true/.test(devRoute) || !/to: CONTACT\.email/.test(devRoute) || !/kind: 'operational'/.test(devRoute)) problems.push('G: the device route does not tell hello@ about a device we do not list')
else if (/user\.email|user\.id/.test(devRoute.slice(devRoute.indexOf('const others'), devRoute.indexOf('const rows'))) || /others\.map\(o => o\.label\)[\s\S]{0,400}user\./.test(devRoute)) problems.push('G: the note to hello@ carries something that identifies the family')
else ok.push('G: a device we do not list can be named, is saved, and hello@ hears the name and the kind only')

if (problems.length > 0) {
  console.error('check-deal-ties-together FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-deal-ties-together ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
