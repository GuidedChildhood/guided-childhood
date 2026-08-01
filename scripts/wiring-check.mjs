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
    if (real === 0 && fixtureOnly === 0) errors.push(`orphan component  ${rel(f)}  imported nowhere`)
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
    const writer = [...SOURCE].some(([g, s2]) =>
      g !== defFile && new RegExp(`step(?::\\s*|=)['"\`{]{1,2}${key}['"\`]`).test(s2))
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

checkDeadLinks()
checkOrphanComponents()
checkUnwritableSteps()
checkWeekWindows()

const line = '─'.repeat(64)
console.log(line)
console.log('Wiring check: is every surface connected to the rest?')
console.log(line)
if (!errors.length && !warnings.length) console.log('Nothing unwired. All four checks clean.')
for (const w of warnings) console.log(`  warn   ${w}`)
for (const e of errors) console.log(`  BROKEN ${e}`)
console.log(line)
console.log(`${errors.length} broken, ${warnings.length} to look at, across ${SOURCE.size} files.`)

process.exit(errors.length ? 1 : 0)
