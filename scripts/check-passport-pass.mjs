// A pass on every passport page, the passport flipping in for a reason, and
// the page turn on GSAP with a way out for reduced motion.
//
// Justin, 13 September 2026: the pages must "make complete sense of what is
// being achieved", each "linked how to achieve a pass", the motion "top level
// standard", the book flipping "in and out when a passport attention is
// needed", and a family "jumping in at any age easily catch up able".
//
// Six rules. A and B run the real code (the pass words and the attention
// rule) through scripts/lib/ts-resolve.mjs; the rest read the source with
// comments stripped, so a comment describing the rule cannot satisfy it.
//
//   A. The pass rule prints what stamps a page (lib/pathway/stamped.ts): the
//      lessons, the scripts, the child's check. The check row links to the
//      check page WITH the stage, so an earlier page's check is reachable.
//      A page behind says the habits are kept up on the current page and
//      never asked for twice. A page ahead says the age it opens at.
//   B. Attention is one reason in order (ready for its check, pages behind,
//      a few left), nothing before the first check in, nothing when stamped.
//   C. The book draws PassportPass on the stage page and passes readOnly
//      through; the pass rows never link on the child's copy.
//   D. Both surfaces that build stamps carry the child's own check pass
//      (checkPassed from passedStages), and the child's book stamps by the
//      one rule (isStageStamped), not by a percentage.
//   E. The page turn is a GSAP timeline behind a reduced motion guard, and
//      the old CSS transition flip is gone.
//   F. The peek asks the attention route and never renders without a reason;
//      the route passes the first check in stamp to the rule.
//   G. The happy news finish: the slots, the to do rows, the next open row
//      and the shop link wear story icons on plates, never a bare emoji.
//
// Run:
//   node --experimental-strip-types scripts/check-passport-pass.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── A and B: run the real functions ──────────────────────────────────────────
const probe = `
import { passParts, passLine, OPENS_AT } from './lib/pathway/passport-pass.ts'
import { passportAttention } from './lib/pathway/passport-attention.ts'
const base = { id: 2, name: 'Builder', ages: 'Ages 8 to 10', pct: 40, href: '#', lessonsDone: 3, lessonsTotal: 5, scriptsDone: 1, scriptsTotal: 4, checkPassed: false }
const current = { ...base, status: 'current' }
const behind = { ...base, status: 'catchup' }
const ahead = { ...base, status: 'upcoming', lessonsDone: 0, scriptsDone: 0 }
const earned = { ...base, status: 'earned', lessonsDone: 5, scriptsDone: 4, checkPassed: true }
const checkOnly = { ...base, status: 'current', lessonsDone: 5, scriptsDone: 4 }
const parts = passParts(current, { childParam: 'kid-1' })
const out = {
  keys: parts.map(p => p.key),
  hrefs: parts.map(p => p.href),
  counts: parts.map(p => p.count),
  currentLine: passLine(current, parts, { childName: 'Alma' }),
  behindLine: passLine(behind, passParts(behind), { childName: 'Alma', catchupLine: 'One a month fills this page' }),
  aheadLine: passLine(ahead, passParts(ahead), { childName: 'Alma' }),
  earnedLine: passLine(earned, passParts(earned), {}),
  checkOnlyLine: passLine(checkOnly, passParts(checkOnly), {}),
  opens: OPENS_AT,
}
const st = (id, name, extra = {}) => ({ id, name, lessonsDone: 0, lessonsTotal: 5, scriptsDone: 0, scriptsTotal: 4, contentComplete: false, checkPassed: false, ...extra })
const full = { contentComplete: true, lessonsDone: 5, scriptsDone: 4 }
const stampedS = { ...full, checkPassed: true }
const att = {
  noCheckIn: passportAttention({ hasCheckedIn: false, currentStage: 2, childName: 'Alma', stages: [st(1, 'Foundation'), st(2, 'Builder', full)] }),
  ready: passportAttention({ hasCheckedIn: true, currentStage: 2, childName: 'Alma', stages: [st(1, 'Foundation'), st(2, 'Builder', full)] }),
  behind: passportAttention({ hasCheckedIn: true, currentStage: 3, childName: 'Alma', stages: [st(1, 'Foundation', stampedS), st(2, 'Builder'), st(3, 'Explorer', { lessonsDone: 1 })] }),
  nearly: passportAttention({ hasCheckedIn: true, currentStage: 2, childName: 'Alma', stages: [st(1, 'Foundation', stampedS), st(2, 'Builder', { lessonsDone: 4, scriptsDone: 3 })] }),
  quiet: passportAttention({ hasCheckedIn: true, currentStage: 2, childName: 'Alma', stages: [st(1, 'Foundation', stampedS), st(2, 'Builder', { lessonsDone: 1 })] }),
  allStamped: passportAttention({ hasCheckedIn: true, currentStage: 2, childName: 'Alma', stages: [st(1, 'Foundation', stampedS), st(2, 'Builder', stampedS)] }),
}
console.log(JSON.stringify({ out, att }))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
if (r.status !== 0) {
  problems.push(`the probe could not run the real code: ${(r.stderr || '').trim().split('\n').slice(-3).join(' ')}`)
} else {
  const { out, att } = JSON.parse(r.stdout.trim().split('\n').pop())
  // A
  if (out.keys.join(',') !== 'lessons,scripts,check') problems.push(`A: the pass is not lessons, scripts, check in that order: ${out.keys.join(',')}`)
  else ok.push('A: a pass is every lesson, every script, the stage check, in that order')
  if (!/\/dashboard\/pathway\/check\?stage=2/.test(out.hrefs[2]) || !/child=kid-1/.test(out.hrefs[2])) problems.push(`A: the check row does not link to the check page for ITS stage with the child: ${out.hrefs[2]}`)
  else ok.push('A: the check row links to the check page for its own stage, child carried')
  if (!/stage=2/.test(out.hrefs[0]) || !/child=kid-1/.test(out.hrefs[0]) || !/stage=builder/.test(out.hrefs[1])) problems.push(`A: lesson or script links lose the stage or the child: ${out.hrefs.slice(0, 2).join(' ')}`)
  else ok.push('A: lesson and script rows link to their own stage')
  if (out.counts[0] !== '3 of 5' || out.counts[1] !== '1 of 4' || out.counts[2] !== 'Not yet') problems.push(`A: the counts are not the stamp's numbers: ${out.counts.join(' | ')}`)
  else ok.push('A: the counts are the stamp\'s own numbers')
  if (!/lessons/.test(out.currentLine) || !/scripts/.test(out.currentLine) || !/check/.test(out.currentLine)) problems.push(`A: the current page line does not name what is left: ${out.currentLine}`)
  else ok.push('A: the current page names what is left')
  if (!/kept up/.test(out.behindLine) || !/never twice/.test(out.behindLine) || !/One a month/.test(out.behindLine)) problems.push(`A: a page behind does not say the habits are kept up on the current page, never twice, with its pace: ${out.behindLine}`)
  else ok.push('A: a page behind says catching up is the three, habits never twice, with its pace')
  if (!/turns 8/.test(out.aheadLine) || out.opens[2] !== 8 || out.opens[5] !== 16) problems.push(`A: a page ahead does not say when it opens: ${out.aheadLine}`)
  else ok.push('A: a page ahead says the age it opens at')
  if (!/^Passed/.test(out.earnedLine)) problems.push(`A: a passed page does not say so: ${out.earnedLine}`)
  else ok.push('A: a passed page says Passed')
  if (!/stage check is the last thing/.test(out.checkOnlyLine)) problems.push(`A: lessons and scripts done does not name the check as the last thing: ${out.checkOnlyLine}`)
  else ok.push('A: with only the check left, the line says so')
  if (/[—–]/.test(Object.values(out).filter(v => typeof v === 'string').join(' '))) problems.push('A: a dash in the pass copy')
  // B
  if (att.noCheckIn !== null) problems.push('B: attention before the first check in')
  else ok.push('B: silent before the first check in')
  if (att.ready?.kind !== 'check_ready' || att.ready?.stageId !== 2) problems.push(`B: content done and check open is not check_ready on that page: ${JSON.stringify(att.ready)}`)
  else ok.push('B: a page ready for its check wins')
  if (att.behind?.kind !== 'behind' || att.behind?.stageId !== 2) problems.push(`B: an unstamped earlier page is not behind: ${JSON.stringify(att.behind)}`)
  else ok.push('B: pages behind come next, opening on the first behind')
  if (att.nearly?.kind !== 'nearly') problems.push(`B: two left on the current page is not nearly: ${JSON.stringify(att.nearly)}`)
  else ok.push('B: a few left on the current page is the third reason')
  if (att.quiet !== null || att.allStamped !== null) problems.push(`B: attention with nothing to say: ${JSON.stringify([att.quiet, att.allStamped])}`)
  else ok.push('B: silent when there is nothing to say')
  if (/[—–]/.test(JSON.stringify(att))) problems.push('B: a dash in the attention copy')
}

// ── C: the book draws the pass block, read only through ──────────────────────
const book = strip(readFileSync('components/pathway/PassportBook.tsx', 'utf8'))
const pass = strip(readFileSync('components/pathway/PassportPass.tsx', 'utf8'))
const passCall = book.match(/<PassportPass[\s\S]*?\/>/)?.[0] ?? ''
if (!passCall) problems.push('C: PassportBook no longer renders PassportPass on the stage page')
else if (!/readOnly=\{readOnly\}/.test(passCall)) problems.push('C: PassportPass is drawn without readOnly, so the child\'s copy gets the parent\'s links')
else ok.push('C: the book draws the pass block and passes readOnly through')
if (!/readOnly\s*\|\|[^?]*\?\s*\(\s*<span/.test(pass) || !/<Link/.test(pass)) problems.push('C: PassportPass does not switch its rows from links to spans on readOnly')
else ok.push('C: the pass rows are spans on the child\'s copy')

// ── D: the stamps carry the child's own check, one stamp rule ─────────────────
const page = strip(readFileSync('app/(dashboard)/dashboard/pathway/page.tsx', 'utf8'))
const kid = strip(readFileSync('app/k/[token]/page.tsx', 'utf8'))
if (!/checkPassed:\s*passedStages\.has\(s\.id\)/.test(page)) problems.push('D: the pathway page no longer carries checkPassed from the child\'s own passes')
else ok.push('D: the parent\'s stamps carry checkPassed from passedStages')
if (!/checkPassed:\s*passed\.has\(id\)/.test(kid)) problems.push('D: the child\'s book no longer carries checkPassed')
else ok.push('D: the child\'s stamps carry checkPassed')
if (!/status:\s*isStageStamped\(/.test(kid)) problems.push('D: the child\'s book stamps by something other than isStageStamped')
else ok.push('D: the child\'s book stamps by the one rule')

// ── E: the page turn is GSAP, with a way out ──────────────────────────────────
const goTo = book.slice(book.indexOf('function goTo('), book.indexOf('useLayoutEffect('))
if (!/gsap\.timeline\(/.test(goTo)) problems.push('E: the page turn is not a GSAP timeline')
else ok.push('E: the page turn is a GSAP timeline')
if (!/reduceMotion\(\)/.test(goTo) || goTo.indexOf('reduceMotion()') > goTo.indexOf('gsap.timeline(')) problems.push('E: the reduced motion guard does not come before the timeline in goTo')
else ok.push('E: reduced motion goes straight to the page')
if (/transition:\s*'transform 0\.28s/.test(book)) problems.push('E: the old CSS transition flip is still on the page')
else ok.push('E: the old CSS flip is gone')
if (!/power2\.in'/.test(goTo) || !/power2\.out'/.test(goTo)) problems.push('E: the turn does not accelerate in and settle out')
else ok.push('E: in on power2.in, out on power2.out')

// ── F: the peek asks for a reason and the route passes the check in stamp ─────
const peek = strip(readFileSync('components/home/PassportPeek.tsx', 'utf8'))
const route = strip(readFileSync('app/api/pathway/attention/route.ts', 'utf8'))
if (!/\/api\/pathway\/attention/.test(peek)) problems.push('F: the peek does not ask the attention route')
else ok.push('F: the peek asks the attention route')
if (!/if \(!att \|\| !shown\) return null/.test(peek)) problems.push('F: the peek can render without a reason')
else ok.push('F: the peek renders only with a reason')
if (!/hasCheckedIn:\s*!!profileRes\.data\?\.first_checkin_at/.test(route)) problems.push('F: the route does not pass the first check in stamp to the rule')
else ok.push('F: the route passes the first check in stamp')
if (!/passportAttention\(/.test(route)) problems.push('F: the route decides on its own rather than through passportAttention')
else ok.push('F: the route decides through the one rule')

// ── G: the happy news finish, story icons not emoji on the passport ───────────
const slots = strip(readFileSync('components/pathway/StageSlots.tsx', 'utf8'))
const todo = strip(readFileSync('components/pathway/PassportToDo.tsx', 'utf8'))
const bare = (src, name) => new RegExp(`>\\s*\\{${name}\\.emoji\\}\\s*<`).test(src)
if (bare(slots, 'sec') || !/SLOT_ICON\[sec\.key\]/.test(slots)) problems.push('G: the five slots draw the emoji rather than the story icon')
else ok.push('G: the slots wear story icons')
if (bare(todo, 'it') || !/SLOT_ICON\[it\.key\]/.test(todo)) problems.push('G: the to do rows draw the emoji rather than the story icon')
else ok.push('G: the to do rows wear story icons')
if (bare(book, 'next') || !/SLOT_ICON\[next\.key\]/.test(book)) problems.push('G: the next open row draws the emoji rather than the story icon')
else ok.push('G: the next open row wears a story icon')
if (/🛂/.test(book)) problems.push('G: the shop link still carries the passport emoji rather than the story icon')
else ok.push('G: the shop link wears the passport story icon')

for (const line of ok) console.log(`PASS  ${line}`)
if (problems.length) {
  console.error('')
  for (const p of problems) console.error(`FAIL  ${p}`)
  process.exit(1)
}
console.log('\nall passed')
