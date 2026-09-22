// CAN A CHILD READ THE NUMBER?
//
// Found 22 September 2026, out of the wall fit work. check-wall-fit knows
// whether a SLIDE is cut. It does not know whether the cut part matters, and
// on six slides in this scheme the cut part is a helpline number.
//
// The teacher scripts are explicit that the wall is the surface a pupil copies
// from, and that copying is done in secret:
//
//   ks4-29 s14  "Read all three numbers slowly and leave the slide up far
//                longer than feels comfortable, because somebody is writing
//                one down and does not want to be seen doing it."
//   ks4-28 s19  "Read both numbers slowly and leave the slide up longer than
//                feels necessary, because somebody is writing one down and
//                will not want to be seen doing it."
//
// There is no worksheet, print route or handout carrying these numbers. The
// slides are the only pupil facing place they exist. A number below the fold
// is therefore not a layout defect that degrades a lesson, it is the one piece
// of the lesson a child in trouble came for, missing.
//
// ── WHY THIS IS NOT A RATCHET ───────────────────────────────────────────────
//
// check-wall-fit carries a baseline that only ever shrinks, which is right for
// 227 slides of crowded layout: you cannot fix them all at once and you must
// not let them grow. That logic does not transfer here. A ratchet's promise is
// "no worse than yesterday", and for a helpline the only acceptable state is
// readable. So this carries a short ALLOWED list with a written reason per
// entry, not a generated baseline, and there is no --write flag to regenerate
// it with. A new entry is a decision somebody makes in this file, in a diff,
// with the reason next to it.
//
// ── WHAT IT MEASURES ────────────────────────────────────────────────────────
//
// Every dialable number in content/modules, in the real player, at wall size
// and laptop size, measured as a Range over the DIGITS themselves rather than
// the paragraph holding them.
//
// That distinction is the whole accuracy of this check. An earlier version took
// the bottom of the enclosing text node, and on a diagram card the entire step
// text is one node, so it reported ks4-28 s19 as cut by 117px when the number
// on the first line of that card was perfectly readable and only the last line
// was gone. A Range over the matched characters measures the line the number is
// actually on, which is the line somebody is copying.
//
// ── RUNNING IT ──────────────────────────────────────────────────────────────
//
// Same harness as check-wall-fit: the app up, and GC_DEV_SLIDES set on the
// SERVER process as well as this one, since /dev/lesson-player reads that file
// per request. The sentinel below proves it rather than trusting it.
//
//   GC_DEV_SLIDES=/tmp/gc-dev-slides.json node scripts/check-helplines.mjs
//
// Nothing to configure per lesson: the numbers are found by scanning the
// modules, so a helpline added to a new lesson is covered the day it is added.
import { chromium } from 'playwright'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.GC_BASE_URL ?? process.env.BASE ?? 'http://localhost:3000'
const SLIDES_FILE = process.env.GC_DEV_SLIDES
const MODULES = 'content/modules'

// Every route the scheme gives a child. Kept as the exact strings a pupil would
// dial or text, so the search and the thing being protected are the same thing.
// A number here that appears in no lesson is not an error: it is the list
// staying ahead of the curriculum.
const NUMBERS = [
  '116 123',        // Samaritans, any age
  '0800 1111',      // Childline, under 19
  '0800 068 4141',  // HOPELINE247, under 35
  '0808 8020 133',  // National Gambling Helpline, no minimum age
  '85258',          // Shout, text line
]

// Fields the player never draws on the wall. A number here is for the teacher,
// so it is not a finding. Everything else in a slide is treated as pupil facing
// until proven otherwise, which is the safe direction for this particular check.
const TEACHER_ONLY = new Set(['script', 'teacher_notes', 'notes'])

// KNOWN AND ACCEPTED, with the reason. Keyed "<module> s<n> @<viewport>".
//
// ks4-28-the-money-and-the-odds s28 is the gambling helpline as the closing
// point of a six point recap. It cannot be reordered the way ks4-29 s28 was:
// its script makes the number the deliberate last beat, "leave a beat after the
// last one", and the number is the closer on purpose. Fixing it means splitting
// the slide or cutting points, which is a curriculum decision rather than a
// layout one, so it is named here rather than quietly passed. Raised with
// Justin 22 September 2026, migration 337.
const ALLOWED = new Map([
  ['ks4-28-the-money-and-the-odds s28 @wall', 'recap closer, needs a curriculum decision to split'],
  ['ks4-28-the-money-and-the-odds s28 @laptop', 'recap closer, needs a curriculum decision to split'],
])

// Written into the reference slide and looked for in the DOM, to prove the
// server is serving the fixture rather than its own built in sample deck. The
// same trap check-wall-fit documents at length: GC_DEV_SLIDES is read by the
// PAGE, in the server process, so setting it only on this script measures the
// demo deck 29 times and reports a clean run.
const SENTINEL = 'gc-helpline-fixture-is-live'

const VIEWPORTS = [
  { tag: 'wall', width: 1920, height: 1080 },
  { tag: 'laptop', width: 1366, height: 768 },
]

if (!SLIDES_FILE) {
  console.error('check-helplines: set GC_DEV_SLIDES to a writable path, on the server too.')
  process.exit(2)
}

// Find every number, and the field it sits in, straight from the modules.
const walk = (value, path = []) => {
  if (typeof value === 'string') {
    const hit = NUMBERS.filter(n => value.includes(n))
    return hit.length ? [{ path: path.join('.'), numbers: hit }] : []
  }
  if (Array.isArray(value)) return value.flatMap((v, i) => walk(v, [...path, i]))
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([k]) => !TEACHER_ONLY.has(k))
      .flatMap(([k, v]) => walk(v, [...path, k]))
  }
  return []
}

const targets = []
for (const file of readdirSync(MODULES).filter(f => f.endsWith('.json')).sort()) {
  const module = JSON.parse(readFileSync(join(MODULES, file), 'utf8'))
  module.slides.forEach((slide, i) => {
    const found = walk(slide)
    if (!found.length) return
    targets.push({
      module: module.module_id,
      slides: module.slides,
      index: i,
      numbers: [...new Set(found.flatMap(f => f.numbers))],
      where: found.map(f => f.path).join(', '),
    })
  })
}

if (!targets.length) {
  console.error('check-helplines: no helpline numbers found in any lesson at all.')
  console.error('  Either every route was removed from the scheme, or NUMBERS is stale.')
  console.error('  Both are worth stopping for.')
  process.exit(2)
}

const browser = await chromium.launch({ executablePath: process.env.GC_CHROMIUM || undefined })

// Same settle as check-wall-fit: a page that has not finished rendering has
// nothing in the stage, and nothing in the stage is never below the fold. A
// guard that cannot measure has to say so rather than pass.
const settle = async (page, label) => {
  await page.waitForSelector('[data-stage]', { timeout: 30000 })
  await page.evaluate(() => document.fonts.ready)
  const read = () => page.evaluate(() => {
    const el = document.querySelector('[data-stage]')
    const inner = el?.firstElementChild
    return {
      scroll: el?.scrollHeight ?? -1,
      chars: (inner?.textContent ?? '').trim().length,
    }
  })
  let last = null
  const deadline = Date.now() + 12000
  while (Date.now() < deadline) {
    const now = await read()
    if (now.chars > 0 && last && now.scroll === last.scroll) return now
    last = now
    await page.waitForTimeout(200)
  }
  throw new Error(`${label}: the stage never settled. Last read ${JSON.stringify(last)}`)
}

// Where do these exact characters end, and where does the visible stage end?
const measure = (page, numbers) => page.evaluate(wanted => {
  const stage = document.querySelector('[data-stage]')
  const fold = stage.getBoundingClientRect().bottom
  const found = []
  const tree = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT)
  let node
  while ((node = tree.nextNode())) {
    const text = node.textContent ?? ''
    for (const want of wanted) {
      let from = 0
      let at
      while ((at = text.indexOf(want, from)) !== -1) {
        const range = document.createRange()
        range.setStart(node, at)
        range.setEnd(node, at + want.length)
        found.push({ number: want, bottom: Math.round(range.getBoundingClientRect().bottom) })
        from = at + want.length
      }
    }
  }
  return { fold: Math.round(fold), found }
}, numbers)

{
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  const page = await context.newPage()
  writeFileSync(SLIDES_FILE, JSON.stringify([{
    type: 'recap', phase: 'close', minutes: 2, heading: 'Reference slide',
    points: [`Proves the server is reading the fixture. ${SENTINEL}`],
    script: 'Reference only.',
  }]))
  await page.goto(`${BASE}/dev/lesson-player?class=1&teacher=1&slide=0`, { waitUntil: 'networkidle', timeout: 60000 })
  await settle(page, 'the reference slide')
  const live = await page.evaluate(s => document.body.textContent?.includes(s) ?? false, SENTINEL)
  if (!live) {
    console.error('check-helplines: the server is NOT reading GC_DEV_SLIDES.')
    console.error(`  Wrote a sentinel to ${SLIDES_FILE} and the page did not render it, so every`)
    console.error('  number would be measured against the built in sample deck instead of its')
    console.error('  own lesson. Export GC_DEV_SLIDES before starting the server, not only here.')
    process.exit(2)
  }
  await context.close()
}

const cut = []
const missing = []
let readable = 0

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
  const page = await context.newPage()
  for (const target of targets) {
    const label = `${target.module} s${target.index + 1}`
    writeFileSync(SLIDES_FILE, JSON.stringify(target.slides))
    await page.goto(`${BASE}/dev/lesson-player?class=1&teacher=1&slide=${target.index}`, { waitUntil: 'networkidle', timeout: 60000 })
    await settle(page, `${label} @${viewport.tag}`)
    const { fold, found } = await measure(page, target.numbers)

    // A number the module says is on this slide, that the player did not draw,
    // is a finding in its own right: it means a pupil facing field is not
    // reaching the wall, and nobody would notice from the JSON.
    const drawn = new Set(found.map(f => f.number))
    for (const number of target.numbers) {
      if (!drawn.has(number)) missing.push({ label, viewport: viewport.tag, number, where: target.where })
    }

    for (const hit of found) {
      const over = hit.bottom - fold
      if (over <= 0) { readable += 1; continue }
      cut.push({ key: `${label} @${viewport.tag}`, label, viewport: viewport.tag, number: hit.number, over })
    }
  }
  await context.close()
}

await browser.close()

const unexpected = cut.filter(c => !ALLOWED.has(c.key))
const accepted = cut.filter(c => ALLOWED.has(c.key))

// A slide that was fixed and left on the list is how an allowlist rots. Same
// rule as the ratchet: an entry that no longer fires has to come off.
const stale = [...ALLOWED.keys()].filter(k => !cut.some(c => c.key === k))

for (const m of missing) {
  console.log(`  NOT DRAWN   ${m.number.padEnd(14)} ${m.label} @${m.viewport}  (in ${m.where})`)
}
for (const c of unexpected) {
  console.log(`  CUT ${String(c.over).padStart(4)}px  ${c.number.padEnd(14)} ${c.key}`)
}
for (const c of accepted) {
  console.log(`  accepted    ${c.number.padEnd(14)} ${c.key}  (${ALLOWED.get(c.key)})`)
}
for (const k of stale) {
  console.log(`  NOW FITS    ${k}  take it out of ALLOWED`)
}

console.log(`\ncheck-helplines: ${readable} readable, ${accepted.length} accepted, `
  + `${unexpected.length} below the fold, ${missing.length} not drawn, ${stale.length} stale`)

if (unexpected.length || missing.length || stale.length) {
  console.error('\nA pupil copying this number down cannot see all of it.')
  console.error('Fix the slide. Shorten it, split it, or move a sentence into the script.')
  console.error('Adding it to ALLOWED needs a reason somebody else would accept.')
  process.exit(1)
}
console.log('Every helpline number in the scheme is on the wall.')
