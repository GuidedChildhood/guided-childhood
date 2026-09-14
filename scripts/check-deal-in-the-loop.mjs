// The deal is the root: the family agreement is read on the passport, asked
// for on the road, agreed on the child's phone, and talked through as it is
// built.
//
// Justin, 14 September 2026, with Andy's Foundation passport reading Timer
// days 0: "Andy prob won't use timer at this age. Can we also see where best
// to add in family agreement as this determines how jobs, device time is all
// agreed and passports and device all stem from that, and we need to agree,
// to remind, maybe print, appears on child phone, discuss it when building."
//
// Six rules hold what he asked for. Two of them run the real helpers rather
// than reading their text, because a guard its own documentation satisfies
// is not a guard:
//
//   A. The passport child read carries the deal and says the parent runs the
//      timer at four to seven, and nowhere else.
//   B. The strip scores the deal in the fourth cell at that age, keeps the
//      timer nudge off, and says the four deal states with a door for each
//      (make it, finish it, review it, print it). The book passes it through
//      and the child's copy carries no door.
//   C. The road asks a family with a job and no signed deal to make one, and
//      turns the weekly rung into a review on the review date.
//   D. The child's own I agree: a token scoped route that only ever sets the
//      child's signature and stamps the agreed date only when the parent
//      has signed; the page passes both signatures; the sheet posts to it.
//   E. Every clause carries a question to ask the child, with no dashes,
//      and the builder shows it once the clause is in.
//   F. DiGi's family state drops the timer clause at four to seven.
//
//   node --experimental-strip-types scripts/check-deal-in-the-loop.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []
const blank = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
const read = (f) => blank(readFileSync(f, 'utf8'))

const childRead = read('lib/pathway/passport-child.ts')
const strip = read('components/pathway/StageChildStrip.tsx')
const book = read('components/pathway/PassportBook.tsx')
const road = read('lib/pathway/daily-tasks.ts')
const kidRoute = read('app/api/kid/deal-agree/route.ts')
const kidPage = read('app/k/[token]/page.tsx')
const kidScreen = read('app/k/[token]/KidQuestScreen.tsx')
const clausesSrc = readFileSync('lib/content/agreement-clauses.ts', 'utf8')
const builder = read('components/agreement/AgreementBuilder.tsx')
const familyState = read('lib/digi/family-state.ts')

// ── The probe: the real helpers ─────────────────────────────────────────────
const probe = `
import { parentRunsTimerFor } from './lib/pathway/passport-child.ts'
import { dealLine } from './lib/pathway/deal-line.ts'
import { CLAUSES_BY_TYPE, AGREEMENT_TYPES } from './lib/content/agreement-clauses.ts'
const today = '2026-09-14'
const seen = new Map()
for (const list of Object.values(CLAUSES_BY_TYPE)) for (const c of list) seen.set(c.key, c.talk)
console.log(JSON.stringify({
  bands: ['4-7', '8-10', '11-13', '13-15', '16+', null].map(b => parentRunsTimerFor(b)),
  none: dealLine(null, 'Andy', 'c1', today),
  draft: dealLine({ signed: false, agreedDate: null, reviewDate: null }, 'Andy', 'c1', today),
  due: dealLine({ signed: true, agreedDate: '2026-08-01', reviewDate: '2026-09-01' }, 'Andy', 'c1', today),
  fine: dealLine({ signed: true, agreedDate: '2026-09-01', reviewDate: '2026-10-01' }, 'Andy', 'c1', today),
  types: AGREEMENT_TYPES.length,
  typesCovered: AGREEMENT_TYPES.every(t => (CLAUSES_BY_TYPE[t.key] ?? []).length > 0),
  talks: [...seen.entries()],
}))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
let o = null
if (r.status !== 0) {
  problems.push(`probe: could not run the real helpers: ${(r.stderr || '').trim().split('\n').slice(-2).join(' ')}`)
} else {
  o = JSON.parse(r.stdout.trim().split('\n').pop())
}

// ── A: the child read ───────────────────────────────────────────────────────
if (o) {
  if (JSON.stringify(o.bands) === JSON.stringify([true, false, false, false, false, false])) ok.push('A: the parent runs the timer at four to seven and nowhere else')
  else problems.push(`A: parentRunsTimerFor answers ${JSON.stringify(o.bands)} for 4-7, 8-10, 11-13, 13-15, 16+, null`)
}
if (!/from\('family_agreements'\)\.select\('signed_by_parent, signed_by_child, agreed_date, review_date'\)/.test(childRead)) problems.push('A: the child read does not read the deal row')
else if (!/signed: !!dealRow\.signed_by_parent && !!dealRow\.signed_by_child/.test(childRead)) problems.push('A: the deal is not signed by BOTH in the child read')
else if (!/parentRunsTimer: parentRunsTimerFor\(ageBand\)/.test(childRead)) problems.push('A: the child read does not carry parentRunsTimer')
else ok.push('A: the child read carries the deal (signed by both, agreed on, review) and the age flag')

// ── B: the strip and the book ───────────────────────────────────────────────
if (!/parentRunsTimer\s*\?\s*\{ value: deal\?\.signed \? '✓' : '·', label: 'Deal' \}/.test(strip)) problems.push('B: the fourth cell does not read the deal at four to seven')
else if (!/timerDays === 0 && !parentRunsTimer &&/.test(strip)) problems.push('B: the timer nudge still shows at four to seven')
else ok.push('B: at four to seven the fourth cell is the deal and the timer nudge is off')
if (o) {
  const d = o
  const checks = [
    ['none', d.none, /No family deal yet/, /\/dashboard\/agreement\?from=passport&child=c1/],
    ['draft', d.draft, /not signed by you both/, /\/dashboard\/agreement\?from=passport&child=c1/],
    ['due', d.due, /review was due 1 September/, /\/dashboard\/agreement\?from=passport&child=c1/],
    ['fine', d.fine, /Agreed on 1 September\. Review together on 1 October\./, /\/dashboard\/agreement\/print/],
  ]
  for (const [name, line, text, href] of checks) {
    if (!text.test(line.text)) problems.push(`B: the ${name} deal line says "${line.text}"`)
    else if (!href.test(line.href)) problems.push(`B: the ${name} deal line points at ${line.href}`)
    else ok.push(`B: the ${name} deal line reads right and opens the right door`)
  }
  if (/Print it for the fridge/.test(d.fine.cta) && /Make it with Andy/.test(d.none.cta)) ok.push('B: the deal line names the next thing (make it, print it)')
  else problems.push('B: the deal line CTAs lost their verbs')
}
if (!/\{!readOnly && \(\s*<>\s*\{' '\}\s*<Link href=\{theDeal\.href\}/.test(strip)) problems.push('B: the child\'s copy of the book carries the door into the parent dashboard')
else ok.push('B: the deal line door is off the read only book')
if (!/parentRunsTimer=\{childRead\.parentRunsTimer \?\? false\}/.test(book) || !/deal=\{childRead\.deal \?\? null\}/.test(book) || !/readOnly=\{readOnly\}\s*onApp=/.test(book)) problems.push('B: the book does not pass the age flag, the deal and readOnly to the strip')
else ok.push('B: the book passes the age flag, the deal and readOnly to the strip')

// ── C: the road ─────────────────────────────────────────────────────────────
if (!/select\('updated_at, created_at, signed_by_parent, signed_by_child, review_date'\)/.test(road)) problems.push('C: the road does not read the review date')
else if (!/\.\.\.\(anyQuests && !agreementSigned \? \[\{\s*key: 'agreement' as const,\s*label: 'Make the deal',[\s\S]{0,200}?done: false,/.test(road)) problems.push('C: the road does not ask a family with a job and no signed deal to make one')
else if (!/label: agreementReviewDue \? 'Review the deal' : 'The deal'/.test(road) || !/done: agreementFreshThisWeek && !agreementReviewDue/.test(road)) problems.push('C: the weekly rung does not become the review on the review date')
else if (!/agreementReviewDate <= today/.test(road) || !/agreementUpdatedAt\.slice\(0, 10\) < agreementReviewDate/.test(road)) problems.push('C: review due is not "date passed and not touched since"')
else ok.push('C: the road asks for the deal once there is a job, and for the review when its date comes')
if (/leadKey[\s\S]{0,600}'agreement'/.test(road)) problems.push('C: the agreement became the day\'s lead; it is a recommendation, never the one tick')
else ok.push('C: the agreement is never the lead')

// ── D: the child agrees on their phone ──────────────────────────────────────
if (!/\/\^\[0-9a-f\]\{18\}\$\/\.test\(token\)/.test(kidRoute) || !/from\('kid_links'\)\.select\('user_id'\)\.eq\('token', token\)/.test(kidRoute)) problems.push('D: the kid route is not token scoped')
else if (!/signed_by_child: true/.test(kidRoute) || /signed_by_child: false|signed_by_parent: true/.test(kidRoute)) problems.push('D: the kid route must only ever set the child\'s signature to true')
else if (!/if \(parentSigned && !row\.agreed_date\) update\.agreed_date =/.test(kidRoute)) problems.push('D: the kid route stamps agreed_date without the parent\'s signature')
else if (!/\.eq\('user_id', link\.user_id\)/.test(kidRoute)) problems.push('D: the kid route reads a deal that is not this family\'s')
else ok.push('D: the child\'s agree is token scoped, sets only their signature, and agreed means both')
if (!/agreementParentSigned=\{agreementParentSigned\}/.test(kidPage) || !/agreementChildSigned=\{agreementChildSigned\}/.test(kidPage)) problems.push('D: the child\'s page does not pass both signatures')
else if (!/<FamilyDeal[\s\S]{0,600}?agreementParentSigned=\{agreementParentSigned\}[\s\S]{0,100}?agreementChildSigned=\{agreementChildSigned\}/.test(kidScreen)) problems.push('D: the screen does not hand both signatures to Our family deal')
else if (!/fetch\('\/api\/kid\/deal-agree'/.test(kidScreen) || !/I agree ✓/.test(kidScreen)) problems.push('D: Our family deal has no I agree')
else if (!/const bothAgreed = agreementSigned \|\| \(childAgreed && agreementParentSigned\)/.test(kidScreen)) problems.push('D: the sheet claims agreed by both on the child\'s tap alone')
else ok.push('D: Our family deal offers the child their own I agree and only says agreed by both when it is')

// ── E: talk it through ──────────────────────────────────────────────────────
if (o) {
  const missing = o.talks.filter(([, t]) => !t || String(t).trim().length < 20).map(([k]) => k)
  const dashed = o.talks.filter(([, t]) => /[-–—]/.test(String(t))).map(([k]) => k)
  if (missing.length > 0) problems.push(`E: clauses with no question to ask the child: ${missing.join(', ')}`)
  else if (dashed.length > 0) problems.push(`E: dashes in the talk line for: ${dashed.join(', ')}`)
  else if (!o.typesCovered || o.types !== 5) problems.push('E: an agreement type has no clauses')
  else ok.push(`E: every clause (${o.talks.length}) carries a question for the child, with no dashes`)
}
if (!/talk: string/.test(clausesSrc)) problems.push('E: Clause has no talk field')
if (!/Ask \{childName\}[\s\S]{0,200}?\{c\.talk\}/.test(builder)) problems.push('E: the builder does not show the question once the clause is in')
else if (!/\{included && \([\s\S]{0,400}?data-talk/.test(builder)) problems.push('E: the question shows before the clause is in')
else ok.push('E: the builder asks the child\'s question once the clause is in')

// ── F: DiGi ─────────────────────────────────────────────────────────────────
if (!/\$\{state\.child\.parentRunsTimer \? '' : `, the device timer used on/.test(familyState)) problems.push('F: DiGi still tells a four to seven family about the child\'s timer days')
else ok.push('F: DiGi drops the timer clause at four to seven')

if (problems.length > 0) {
  console.error('check-deal-in-the-loop FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-deal-in-the-loop ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
