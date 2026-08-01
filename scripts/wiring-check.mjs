#!/usr/bin/env node
//
// The wiring check: is every surface actually connected to the rest?
//
// We already check three things well. Config is checked by looking (a missing
// key is visible), schema by reading the columns, and crons by heartbeat (a
// dead job stops writing rows). DiGi has its own eval suite on a Monday cron
// that generates real replies and grades them twice.
//
// None of that could catch what actually broke. On 31 July, in one day:
//
//   ask had no code anywhere that could tick it, so no child had ever
//     completed a day since the five a day shipped, and the streak, the
//     celebration and the Planet Friends all sat downstream of it
//   WeeklyReviewCard was imported nowhere at all, built and styled and never
//     rendered for anyone
//   /k/<token>/balance was linked from the five a day and 404'd
//   five surfaces disagreed about what "this week" means, so the same child
//     read 163 stars on one screen and 116 on another
//
// Every one of those passed every health check, because in each case the
// system was up, connected, configured and doing the wrong thing. Health and
// correctness are different questions.
//
// What they have in common is better than that: they are all STATIC FACTS
// ABOUT THE CODE. You do not need a database, a session or a running app to
// know that a link points at a route that does not exist, or that a component
// is imported nowhere, or that a step key has nothing that can write it. So
// these run in CI in about a second and cost nothing.
//
// Deliberately four checks, not fourteen. A check that cries wolf gets
// ignored, and the first one ignored will be the real one. Each of these
// earned its place by catching something that actually shipped.
//
// Usage: node scripts/wiring-check.mjs
// Exits 1 if anything is broken, so CI fails.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const errors = []
const warnings = []

function walk(dir, out = []) {
  let entries
  try { entries = readdirSync(dir) } catch { return out }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (/\.(tsx?|mjs)$/.test(name)) out.push(full)
  }
  return out
}

const FILES = walk(join(ROOT, 'app'))
  .concat(walk(join(ROOT, 'components')))
  .concat(walk(join(ROOT, 'lib')))
const read = f => readFileSync(f, 'utf8')
const rel = f => relative(ROOT, f)
const SOURCE = new Map(FILES.map(f => [f, read(f)]))

// ── 1. Dead internal links ───────────────────────────────────────────
//
// Caught /k/<token>/balance, which the five a day linked to for weeks while
// the route did not exist. A 404 on a link the product itself printed.
//
// Route groups (dashboard) do not appear in the URL, dynamic segments [token]
// match anything, and a ${...} in a template literal is treated as one
// wildcard segment so /k/${token}/balance is checked properly rather than
// skipped for being dynamic.

function appRoutes() {
  const routes = new Set()
  for (const f of walk(join(ROOT, 'app'))) {
    const name = f.split(sep).pop()
    if (name !== 'page.tsx' && name !== 'route.ts') continue
    const url = '/' + relative(join(ROOT, 'app'), f)
      .split(sep).slice(0, -1)
      .filter(seg => !(seg.startsWith('(') && seg.endsWith(')')))
      .join('/')
    routes.add(url === '/' ? '/' : url.replace(/\/$/, ''))
  }
  return [...routes]
}

function routeMatches(href, routes) {
  const want = href.split('/').filter(Boolean)
  return routes.some(r => {
    const have = r.split('/').filter(Boolean)
    if (have.length !== want.length) return false
    return have.every((seg, i) =>
      (seg.startsWith('[') && seg.endsWith(']')) || seg === '*' || seg === want[i])
  })
}

function checkDeadLinks() {
  const routes = appRoutes()
  const seen = new Set()
  for (const [f, src] of SOURCE) {
    if (rel(f).startsWith('app' + sep + 'ref-') || rel(f).includes(sep + 'dev' + sep)) continue
    // href="/x" and href={`/x/${y}/z`} and router.push('/x')
    const pats = [/href=["'](\/[^"'#?]*)/g, /href=\{`(\/[^`#?]*)/g, /(?:push|replace)\(["'`](\/[^"'`#?]*)/g]
    for (const re of pats) {
      let m
      while ((m = re.exec(src))) {
        let href = m[1].replace(/\$\{[^}]*\}/g, '*').replace(/\/$/, '')
        // Anything still carrying template syntax after that is a nested
        // interpolation we cannot resolve, so it is not asserted on. A check
        // that guesses is a check that cries wolf, and the first false alarm
        // ignored will be the real one.
        if (/[$`{}]/.test(href)) continue
        if (!href || href.startsWith('/api') || href.includes('.')) continue
        if (href === '') href = '/'
        const key = `${rel(f)} ${href}`
        if (seen.has(key)) continue
        seen.add(key)
        if (!routeMatches(href, routes)) {
          errors.push(`dead link  ${href}  (in ${rel(f)})`)
        }
      }
    }
  }
}

// ── 2. Components nobody imports ─────────────────────────────────────
//
// Caught WeeklyReviewCard, which was written to put the weekly round up on
// Home and was never imported by anything. It looked finished in the file and
// had never rendered for a single parent.
//
// Imported only by a ref-* fixture is a warning, not an error: that is a real
// state for something being built, but it means no parent can reach it.

function checkOrphanComponents() {
  const comps = walk(join(ROOT, 'components')).filter(f => f.endsWith('.tsx'))
  for (const f of comps) {
    const base = f.split(sep).pop().replace(/\.tsx$/, '')
    // components/x/index.tsx is imported as @/components/x, never as
    // @/components/x/index, so both spellings count.
    const importPath = relative(join(ROOT), f).replace(/\.tsx$/, '').replace(/\\/g, '/')
    const needles = ['@/' + importPath]
    if (base === 'index') needles.push('@/' + importPath.replace(/\/index$/, ''))
    let real = 0, fixtureOnly = 0
    for (const [g, src] of SOURCE) {
      if (g === f) continue
      const named = base === 'index' ? null : new RegExp(`from ['"][^'"]*/${base}['"]`)
      if (!needles.some(n => src.includes(n)) && !(named && named.test(src))) continue
      if (rel(g).startsWith('app' + sep + 'ref-') || rel(g).includes(sep + 'dev' + sep)) fixtureOnly++
      else real++
    }
    // A warning, not a failure. An unimported component does not break a
    // path a parent walks: it is either dead code or wiring somebody forgot,
    // and the check cannot tell which. WeeklyReviewCard was the second kind
    // and one line in a report read every run would have caught it. Errors
    // here are reserved for things that are broken FOR A PARENT, so that a
    // red build always means someone cannot do something.
    if (real === 0 && fixtureOnly === 0) warnings.push(`orphan        ${rel(f)}  imported nowhere, dead code or forgotten wiring`)
    else if (real === 0) warnings.push(`fixture only  ${rel(f)}  imported only by a ref-/dev page`)
  }
}

// ── 3. Steps that navigate away and are never ticked ─────────────────
//
// The worst bug of the day, and it turns out it was not alone.
//
// A step with an href renders as a plain <a> in KidFiveADay: it navigates and
// never calls mark(). So a step that sends the child somewhere can ONLY be
// completed if the page it lands on ticks it. A step with no href is a button
// that marks itself, which is why the offline ones are fine.
//
// ask was one of the two steps ALWAYS in the five, so no day could ever be
// finished, so no streak existed, so the celebration and the Planet Friends
// were unreachable. Nothing errored. It simply never happened, for months.
//
// This is the check that would have caught it on the day it shipped, and
// running it found three more of exactly the same shape.

function checkUnwritableSteps() {
  const defFile = join(ROOT, 'lib', 'kid', 'five-a-day.ts')
  let src
  try { src = read(defFile) } catch { return }
  const block = src.split('export const STEPS')[1] ?? ''
  // Each key, and whether it carries an href (so navigates) or not.
  const defs = [...block.matchAll(/^\s{2}(\w+):\s*\{([\s\S]*?)^\s{2}\}/gm)]
    .map(m => ({ key: m[1], navigates: /href:\s*t\s*=>/.test(m[2]) }))
  if (!defs.length) { warnings.push('five a day: could not read STEPS, check skipped'); return }
  for (const { key, navigates } of defs) {
    // A step that stays on the list is ticked by the list's own mark(step).
    if (!navigates) continue
    // Two shapes count as ticking it, and the second was learned the hard way.
    //
    // The first is the key named as a field or a prop: step: 'lesson', or
    // step="balance" on MarkStepOnArrival. That is how the client side ticks.
    //
    // The second is the key passed as an argument to the shared marker:
    // markStepQuietly(admin, userId, childId, 'lesson'). Server side ticks are
    // written that way, and this check ORIGINALLY MISSED THEM ENTIRELY. It went
    // on reporting all three as broken after they were fixed, which is the
    // failure mode that matters most here: a check nobody can turn green is one
    // that gets deleted, and it takes the true findings with it.
    const named = new RegExp(`step(?::\\s*|=)['"\`{]{1,2}${key}['"\`]`)
    const marked = new RegExp(`markStep(?:Quietly)?\\([^)]*['"\`]${key}['"\`]`)
    const writer = [...SOURCE].some(([g, s2]) => g !== defFile && (named.test(s2) || marked.test(s2)))
    if (!writer) {
      errors.push(`unticked step  "${key}"  sends the child away and nothing on the far side ticks it, so the day can never complete`)
    }
  }
}

// ── 4. More than one definition of the week ──────────────────────────
//
// Caught the 163 vs 116 stars. The star bank, the quest board and the rollover
// cron count a star week (Monday, London). The stats page and week-report
// rolled back seven days instead, so two screens quoted different totals for
// "this week" and neither was wrong on its own terms.
//
// starWeekStart() is the one definition. A hand rolled seven day window in
// anything that reports a week is how the seam gets back in.

function checkWeekWindows() {
  const ROLLING = /Date\.now\(\)\s*-\s*7\s*\*|7\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000|7\s*\*\s*86400000/
  for (const [f, src] of SOURCE) {
    if (rel(f).startsWith('scripts')) continue
    if (!ROLLING.test(src)) continue
    if (src.includes('starWeekStart')) continue
    warnings.push(`rolling week  ${rel(f)}  hand rolled 7 day window, starWeekStart() is the shared definition`)
  }
}


// ── The baseline ─────────────────────────────────────────────────────
//
// Three real bugs were live the day this check was written, all the same
// shape as ask: a step that sends the child away where nothing on the far
// side ticks it. Fixing them is three product decisions (does a lesson count
// on arriving or on passing?) rather than a line of code, so they are
// recorded here instead of being quietly dropped.
//
// This exists so the check can be GREEN for new breakage while these are
// still open. A check that lands permanently red teaches everyone to ignore
// it within a week, and the first one ignored is the real one. That is the
// same failure as an alert that fires every morning, arrived at from the
// other direction.
//
// The rules for it: every entry is dated, printed loudly on every run, and
// counted in the exit summary. Nothing gets in here silently, and an entry
// that starts passing is itself reported so the list cannot rot.
// Empty, and it got here the right way round. The three that were recorded on
// 1 August (lesson, quiz, printable) were fixed the same day, the FIXED line
// said so on the next run, and they were removed rather than left to rot.
//
// Keep it empty if you can. A finding belongs here only when it is real, known,
// and blocked on a decision rather than on work.
const BASELINE = []

checkDeadLinks()
checkOrphanComponents()
checkUnwritableSteps()
checkWeekWindows()

const line = '─'.repeat(64)

// Split what is new from what was already known and written down.
const known = []
const fresh = []
for (const e of errors) {
  const hit = BASELINE.find(b => e.includes(b.match))
  ;(hit ? known : fresh).push(hit ? `${e}   [known since ${hit.since}]` : e)
}
// A baseline entry that no longer fires has been fixed, and saying so is how
// the list stays honest rather than accumulating dead entries forever.
const healed = BASELINE.filter(b => !errors.some(e => e.includes(b.match)))

console.log(line)
console.log('Wiring check: is every surface connected to the rest?')
console.log(line)
if (!fresh.length && !known.length && !warnings.length) console.log('Nothing unwired. All four checks clean.')
for (const w of warnings) console.log(`  warn    ${w}`)
for (const k of known) console.log(`  known   ${k}`)
for (const e of fresh) console.log(`  BROKEN  ${e}`)
for (const h of healed) console.log(`  FIXED   "${h.match}" no longer fires, remove it from BASELINE`)
console.log(line)
console.log(
  `${fresh.length} new, ${known.length} known and still open, ` +
  `${warnings.length} to look at, across ${SOURCE.size} files.`
)
if (known.length) console.log('Known entries are real bugs waiting on a decision, not noise. See BASELINE.')

// Only NEW breakage fails the build. The known three are already written
// down, in the PR, and printed above on every single run.
process.exit(fresh.length ? 1 : 0)
