// The tabs go on the screens a child may wander off, and nowhere else.
//
// Justin, 15 September 2026: "are you also building the tabs at bottom working
// for each page". KidScreenChrome puts the three tabs on a child screen that is
// not the home screen. Two rules decide where it may go, and neither is visible
// to a typecheck or a build, because a bar on the wrong screen is perfectly
// valid React that merely costs a child their work.
//
// ── 1. NOT ON A SCREEN WITH SOMETHING TO LOSE ───────────────────────────────
//
// Half the child's screens are a lesson player, the stage check, the planet or
// a diary entry being typed. A permanent row of tabs there is an invitation to
// leave a task half done, and on the lesson player it would not even be seen:
// the player is `position: fixed; inset: 0; zIndex: 110` and the bar is
// zIndex 60, so it renders underneath and a child taps a tab that is not there.
//
// This is why screens OPT IN rather than a layout mounting the bar for all of
// them: a new immersive screen cannot acquire tabs by being added to a folder.
//
// ── 2. A SCREEN THAT TAKES THE BAR MUST MAKE ROOM FOR IT ────────────────────
//
// The bar is fixed and portalled to document.body, so it occupies no space in
// the flow. A screen that mounts the chrome without raising its bottom padding
// puts its own last control underneath the bar, where it cannot be tapped. The
// balance screen padded `22px 16px 50px`, and 50px is not enough.
//
// ── 3. AND IT MUST NEVER REACH PAPER ────────────────────────────────────────
//
// The bucket list, the star chart, the family deal and the whole printables
// shelf exist to come out on paper. A fixed bar prints across the bottom of
// every one of them unless it is told not to.
//
//   node scripts/check-kid-chrome.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []

const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = rel => {
  try { return strip(readFileSync(join(ROOT, rel), 'utf8')) } catch { return null }
}

const CHROME = 'components/kid/KidScreenChrome.tsx'
const BAR = 'components/kid/KidTabBar.tsx'

// ── The wrapper still exists and still mounts the real bar ──────────────────
const chrome = read(CHROME)
if (chrome === null) {
  problems.push(`${CHROME} is gone, so the screens below are importing something this guard cannot see`)
} else if (!/<KidTabBar[\s/>]/.test(chrome)) {
  // Deliberately the RENDER and not the mere mention: the import line keeps the
  // word KidTabBar in the file long after the component has stopped rendering
  // one, which is exactly how this guard first passed a chrome that showed no
  // bar at all.
  problems.push(`${CHROME} imports KidTabBar but never renders one, so a screen that opts in gets the padding and the unzoom and no tabs`)
} else if (!/body\s*\{\s*zoom:\s*1\s*;?\s*\}/.test(chrome)) {
  problems.push(
    `${CHROME} no longer unzooms body. shared/tokens.css zooms body 1.07, and a FIXED element inside a zoomed ancestor drifts up an iPhone as you scroll: it happened to the parent's bar twice in one morning and to this bar before it was portalled. Without this the bar creeps away from the floor on a real phone while looking perfect in every desktop browser.`,
  )
} else {
  ok.push('KidScreenChrome renders the real bar and unzooms body for it')
}

// ── The bar stays off paper ─────────────────────────────────────────────────
const bar = read(BAR)
if (bar === null) {
  problems.push(`${BAR} is missing`)
} else if (!/@media\s+print/.test(bar) || !/display:\s*none/.test(bar)) {
  problems.push(
    `${BAR} has no @media print rule hiding it. It is fixed, so it prints across the bottom of every sheet a child prints: the bucket list, the star chart, the family deal, every printable. Printing is not a side feature of this app.`,
  )
} else {
  ok.push('the bar hides itself when printing, so it never lands on a child\'s sheet')
}

// ── Which routes may have it ────────────────────────────────────────────────
//
// A screen is immersive when leaving it mid task costs the child something: a
// lesson in progress, a quiz half answered, a diary entry not yet saved.
const IMMERSIVE = [
  ['app/k/[token]/lessons/[lessonId]/page.tsx', 'a lesson in progress'],
  ['app/k/[token]/lesson/[mission]/page.tsx', 'a star lesson in progress'],
  ['app/k/[token]/tutor/[id]/page.tsx', "DiGi's lesson in progress"],
  ['app/k/[token]/adventures/[code]/page.tsx', 'a watch together adventure'],
  ['app/k/[token]/quiz/page.tsx', 'the stage check, ten questions in'],
  ['app/k/[token]/planet/page.tsx', 'an arrangement being dragged'],
  ['app/k/[token]/week/page.tsx', 'a diary entry being typed'],
]
for (const [rel, why] of IMMERSIVE) {
  const src = read(rel)
  if (src === null) continue // a screen that has moved is not this guard's business
  if (/KidScreenChrome/.test(src)) {
    problems.push(
      `${rel} mounts KidScreenChrome, and it should not: it is ${why}. A row of tabs there invites a child to walk away from work they cannot get back, and on the lesson players the bar renders underneath the player (zIndex 60 against 110) so the tab cannot even be tapped.`,
    )
  }
}
ok.push(`no immersive screen mounts the chrome (${IMMERSIVE.length} checked)`)

// ── Every screen that DOES take it makes room for it ────────────────────────
function walk(dir, out = []) {
  let entries
  try { entries = readdirSync(dir) } catch { return out }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (st.isDirectory()) walk(full, out)
    else if (/\.tsx$/.test(name)) out.push(full)
  }
  return out
}

// The bar's own height plus the home indicator. Anything less and the last
// control on the page sits under the bar.
const CLEARS = /padding[^;\n]*calc\(\s*9[0-9]px\s*\+\s*env\(safe-area-inset-bottom/

// The padding belongs on the screen's SCROLLING ROOT, and that is often not the
// file that mounts the chrome: jobs, lessons and printables are server pages
// that hand their whole body to a client component, and the root div lives
// there. So the clearance counts if it is in the mounting file or in any local
// component that file renders.
function localImports(src, fromRel) {
  const out = []
  for (const m of src.matchAll(/from\s+'(@\/[^']+|\.[^']+)'/g)) {
    const spec = m[1]
    let rel
    if (spec.startsWith('@/')) rel = spec.slice(2)
    else {
      const dir = fromRel.split('/').slice(0, -1)
      for (const part of spec.split('/')) {
        if (part === '.') continue
        else if (part === '..') dir.pop()
        else dir.push(part)
      }
      rel = dir.join('/')
    }
    for (const ext of ['.tsx', '.ts']) {
      try { statSync(join(ROOT, rel + ext)); out.push(rel + ext); break } catch { /* not a local file */ }
    }
  }
  return out
}

const users = []
for (const file of [...walk(join(ROOT, 'app')), ...walk(join(ROOT, 'components'))]) {
  const rel = file.replace(ROOT + '/', '')
  if (rel === CHROME) continue
  const src = strip(readFileSync(file, 'utf8'))
  if (!/<KidScreenChrome/.test(src)) continue
  users.push(rel)
  const here = CLEARS.test(src)
  const inChild = here ? null : localImports(src, rel).find(r => {
    const c = read(r)
    return c !== null && CLEARS.test(c)
  })
  if (!here && !inChild) {
    problems.push(
      `${rel} mounts KidScreenChrome but nothing it renders pads for it. The bar is fixed and portalled to body, so it takes up no room in the flow: without a bottom padding of about 96px plus the safe area inset on this screen's scrolling root, its last control sits underneath the bar and a child cannot tap it.`,
    )
  }
}
if (users.length === 0) {
  problems.push('nothing mounts KidScreenChrome at all, so the tabs Justin asked for are on the home screen and nowhere else')
} else {
  ok.push(`${users.length} screen(s) mount the chrome and every one pads for the bar: ${users.map(u => u.replace('app/k/[token]/', '').replace('/page.tsx', '')).join(', ')}`)
}

if (problems.length > 0) {
  console.error('check-kid-chrome FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why a bar on the wrong screen costs a child their work.')
  process.exit(1)
}
console.log('check-kid-chrome ok: the tabs are where a child can wander, and nowhere else')
for (const line of ok) console.log('  ' + line)
