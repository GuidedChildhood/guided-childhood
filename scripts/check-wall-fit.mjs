// DOES THE SLIDE FIT ON THE WALL?
//
// Found 21 September 2026 while rendering migrations 326 to 336, and it is not
// what that batch did. On a classroom projector, diagram step cards are cut off
// mid sentence. ks2-09-copyright-ownership slide 12, the slide carrying that
// lesson's three moves, stops at "Ask the maker BEFORE," on the card that word
// exists for, and its script tells the teacher to point at three verdicts that
// are below the fold. Nobody scrolls a wall mid lesson, so the class reads half
// a sentence.
//
// ── WHY EVERY EXISTING GUARD PASSES IT ──────────────────────────────────────
//
// council-checks.mjs has a properly derived word ceiling, 105 words for KS2 to
// KS5, measured by rendering all 78 prose slides rather than asserted. The
// number is not the problem. The SHAPE is: ON_THE_WALL splits a slide into
// prose and blocks, and blocks are measured one at a time, deliberately,
// because a child reads one card at a time at their own pace.
//
// The wall does not. It draws four cards plus a heading plus a caption at once
// and they have to fit in one screen height together. So four eleven word cards
// each clear the ceiling comfortably while the slide as a whole is cut in half.
// The ceiling measures READABILITY. Nothing measured FIT.
//
// That is a gap in method rather than an oversight: the 105 came out of a
// browser, and the guard carrying it does not use one. This one does.
//
// ── WHAT IT MEASURES ────────────────────────────────────────────────────────
//
// Every slide of every lesson in content/modules, through the real player, in
// class mode with the teacher's chrome, at 1920x1080 (a classroom projector)
// and optionally 1366x768 (the resolution on half the teacher laptops).
//
// The instrument is the stage's own scroll box, [data-stage] in LessonPlayer,
// not a guess at which div scrolls. A slide FAILS when the stage has more
// content than height: scrollHeight beyond clientHeight by more than SLACK.
//
// More screen does not help, which is worth knowing before anyone suggests it:
// the type scales with the viewport (shared/wall-scale.ts), so ks4-18 slide 11
// hides 17px at 1440x900 and 76px at 1920x1080.
//
// ── THE RATCHET ─────────────────────────────────────────────────────────────
//
// scripts/wall-fit-baseline.json names the slides known to clip, and at which
// SIZE: an entry is {wall: 210} or {laptop: 96} or both. A slide NOT on the
// list that clips is a regression and fails. A slide ON the list that now fits
// also fails, with a message saying to take it off, so a fix cannot quietly
// un-fix itself later. The list only ever gets shorter. Same pattern as
// check-larger-text.mjs and the wiring check's BASELINE.
//
// The unit compared is the slide AND the viewport, never the slide alone. CI
// runs the wall on its own and 55 of the first 298 entries clip only at
// laptop size, so a key level comparison would call all 55 fixed and fail a
// green tree. See the comparison block at the foot of this file.
//
// Rewrite the list after a deliberate change with --write-baseline. Never do
// that to make a red run go green.
//
// ── RUNNING IT ──────────────────────────────────────────────────────────────
//
// Needs the app up (the checkin-guard job in CI, or npm run dev locally) and
// GC_DEV_SLIDES pointing at a writable path: this rewrites that file per lesson
// and the dev route re-reads it per request, which is why no server restart is
// needed between the 29.
//
//   GC_DEV_SLIDES=/tmp/gc-dev-slides.json node scripts/check-wall-fit.mjs
//   ... --laptop            also measure 1366x768
//   ... --only ks2-09       one lesson, by id or prefix
//   ... --write-baseline
//
// ── THE BASELINE IS MEASURED ON THE HEADLESS SHELL ──────────────────────────
//
// chromium.launch() with no executablePath gives the headless shell, which is
// what CI gets from `npx playwright install chromium`, so that is the binary
// the numbers in the list belong to. It matters by a little and the little is
// enough: the same pangram at 40px is 1126px in full Chromium and 1131px in
// the shell, four tenths of a percent, and that flipped ks2-04 slide 17, which
// sits at 67px hidden against a 40px SLACK.
//
// So do not regenerate the list with GC_CHROMIUM pointed at a full Chromium.
// GC_CHROMIUM exists for sandboxes that carry no shell at all, and a run that
// uses it will disagree with CI on whatever is sitting near the threshold. The
// provenance line this prints on every run is how to tell: same pangram width,
// same renderer, and a difference in the list is then a real difference.
import { chromium } from 'playwright'
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.GC_BASE_URL ?? process.env.BASE ?? 'http://localhost:3000'
const SLIDES_FILE = process.env.GC_DEV_SLIDES
const BASELINE_FILE = 'scripts/wall-fit-baseline.json'
const MODULES = 'content/modules'
const WRITE = process.argv.includes('--write-baseline')
const LAPTOP = process.argv.includes('--laptop')
const ONLY = (() => {
  const i = process.argv.indexOf('--only')
  return i >= 0 ? process.argv[i + 1] : null
})()

// Sub pixel rounding and a font fallback both show up as one or two pixels of
// scrollHeight on a box that visibly fits. The fade mask at the foot of the
// stage is about a line deep, so anything under a line of wall body text is
// inside the fade rather than lost: 40px is that line (WALL.body at 1920).
const SLACK = 40

const VIEWPORTS = [{ tag: 'wall', width: 1920, height: 1080 }]
if (LAPTOP) VIEWPORTS.push({ tag: 'laptop', width: 1366, height: 768 })

if (!SLIDES_FILE) {
  console.error('check-wall-fit: set GC_DEV_SLIDES to a writable path. This rewrites that')
  console.error('  file per lesson and /dev/lesson-player re-reads it per request.')
  process.exit(2)
}

const lessons = readdirSync(MODULES).filter(f => f.endsWith('.json')).sort()
  .map(f => JSON.parse(readFileSync(join(MODULES, f), 'utf8')))
  .filter(m => !ONLY || m.module_id.startsWith(ONLY))
if (!lessons.length) { console.error(`check-wall-fit: no lessons matched ${ONLY}`); process.exit(2) }

const baseline = existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, 'utf8')) : {}

// GC_CHROMIUM, the same escape hatch check-larger-text.mjs uses, for the
// sandboxes that carry a full chromium but no headless shell.
const browser = await chromium.launch({ executablePath: process.env.GC_CHROMIUM || undefined })
const found = {}   // "module s12" -> { wall: 210, laptop: 0 }
let measured = 0

// MEASURE ONLY WHEN THERE IS SOMETHING TO MEASURE.
//
// The first version of this took one reading on a 900ms timer and treated
// anything it could not read as a slide that fits. That is a lie in the safe
// direction, and CI told it: on the very same commit the baseline was measured
// from, the run reported 270 of 298 known clips as FIXED, including ks2-04
// slide 13 at 319px hidden. Not fonts (Nunito loads in both, and the fallback
// is 2.6 percent narrower, nowhere near enough) and not the browser binary
// (the headless shell differs on one slide of twelve, the one sitting on the
// threshold at 67px). It is simply that a page which has not finished
// rendering has almost nothing in the stage, and nothing in the stage always
// fits.
//
// So a reading is taken only once the stage has SETTLED: the same scrollHeight
// twice running, fonts done, real content in the column. Anything else stops
// the run with an error rather than quietly recording a zero, because a guard
// that cannot measure has to say so instead of passing.
//
// This is also faster than the fixed wait it replaces. The reveals animate
// opacity and transform, neither of which changes scrollHeight, so a static
// slide settles in about 400ms rather than always paying 900. The one thing
// that genuinely changes height over time is the intro's word by word typing,
// and that is exactly what polling waits for and a fixed timer did not.
const settle = async (page, label) => {
  await page.waitForSelector('[data-stage]', { timeout: 30000 })
  await page.evaluate(() => document.fonts.ready)
  const read = () => page.evaluate(() => {
    const el = document.querySelector('[data-stage]')
    const inner = el?.firstElementChild
    return {
      scroll: el?.scrollHeight ?? -1,
      client: el?.clientHeight ?? -1,
      kids: inner?.childElementCount ?? 0,
      chars: (inner?.textContent ?? '').trim().length,
    }
  })
  let last = null
  const deadline = Date.now() + 12000
  while (Date.now() < deadline) {
    const now = await read()
    if (now.kids > 0 && now.chars > 0 && last && now.scroll === last.scroll) return now
    last = now
    await page.waitForTimeout(200)
  }
  throw new Error(`${label}: the stage never settled. Last read ${JSON.stringify(last)}`)
}

// A BASELINE OF PIXELS CARRIES ITS CONDITIONS OR IT CARRIES NOTHING.
//
// Every run prints the browser it used and how wide a known string renders in
// the body face. If a future run disagrees with the list, this line is the
// first place to look: same number means the rendering matched and the
// difference is real, a different number means the environments differ and
// the list was never the thing being tested.
{
  // A FIXED REFERENCE SLIDE, not whatever the fixture happens to hold, so the
  // number means the same thing in every run. Settling catches a page that has
  // not finished rendering. It does not catch a page that renders DIFFERENTLY,
  // and the run that found all this reported the same 215 twice from two
  // different code states, which is the signature of a structural difference
  // rather than a timing one. This is the line that would tell us: one slide,
  // known words, so two runs can be subtracted.
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  const page = await ctx.newPage()
  writeFileSync(SLIDES_FILE, JSON.stringify([{
    type: 'recap', phase: 'close', minutes: 2, heading: 'Reference slide',
    points: [
      'A fixed slide measured at the start of every run, so two runs can be compared.',
      'If this number moves, the renderer moved, and the list was never what was being tested.',
      'It is never written to the baseline and it belongs to no lesson.',
    ],
    script: 'Reference only.',
  }]))
  await page.goto(`${BASE}/dev/lesson-player?class=1&teacher=1&slide=0`, { waitUntil: 'networkidle', timeout: 60000 })
  const ref = await settle(page, 'the reference slide')
  const env = await page.evaluate(async () => {
    await document.fonts.ready
    const probe = document.createElement('span')
    probe.textContent = 'The quick brown fox jumps over the lazy dog 0123456789'
    probe.style.cssText = 'position:fixed;left:-9999px;white-space:nowrap;font-size:40px;font-family:var(--font-body)'
    document.body.appendChild(probe)
    const w = Math.round(probe.getBoundingClientRect().width)
    probe.remove()
    return { w, nunito: [...document.fonts].some(f => /nunito/i.test(f.family) && f.status === 'loaded') }
  })
  console.log(`check-wall-fit: ${browser.version()} | pangram at 40px ${env.w}px | `
    + `Nunito ${env.nunito ? 'loaded' : 'NOT LOADED, metrics will not match the baseline'}`)
  console.log(`check-wall-fit: reference slide stage ${ref.client}px, content ${ref.scroll}px, `
    + `${ref.kids} blocks, ${ref.chars} chars. A run that disagrees with the baseline and also `
    + `disagrees here is measuring a different page, not a different scheme.`)
  await ctx.close()
}

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  for (const lesson of lessons) {
    // The dev route reads this file per request, so writing it here puts this
    // lesson's real rows through the real player with no restart.
    writeFileSync(SLIDES_FILE, JSON.stringify(lesson.slides))
    for (let i = 0; i < lesson.slides.length; i += 1) {
      const label = `${lesson.module_id} slide ${i + 1} at ${vp.tag}`
      const url = `${BASE}/dev/lesson-player?class=1&teacher=1&slide=${i}`
      // A slide that will not load is not a slide that fits, so this throws
      // rather than skipping. Skipping is what let a broken run look green.
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      const box = await settle(page, label)
      const hidden = box.scroll - box.client
      measured += 1
      if (hidden > SLACK) {
        const key = `${lesson.module_id} s${i + 1}`
        ;(found[key] ??= {})[vp.tag] = hidden
      }
    }
  }
  await ctx.close()
}
await browser.close()

const keys = Object.keys(found).sort()
const where = k => Object.entries(found[k]).map(([t, px]) => `${t} ${px}px`).join(', ')

if (WRITE) {
  // A write without --laptop would silently drop every laptop only clip, and
  // 55 of the first 298 were laptop only. The baseline holds both sizes or it
  // is not the baseline, so this refuses rather than quietly shrinking it.
  if (!LAPTOP) {
    console.error('check-wall-fit: --write-baseline needs --laptop as well, or the run')
    console.error('  would drop every slide that clips only at 1366x768.')
    process.exit(2)
  }
  writeFileSync(BASELINE_FILE, JSON.stringify(found, null, 2) + '\n')
  console.log(`wrote ${BASELINE_FILE}: ${keys.length} slide(s) clipping, of ${measured} measured`)
  for (const k of keys) console.log(`  ${k}  ${where(k)}`)
  process.exit(0)
}

// COMPARE ONLY WHAT THIS RUN MEASURED, on both axes.
//
// A baseline entry is a slide AND a viewport: "ks2-04 s5" may be listed at
// laptop and not at wall. Two scoping holes follow from that, and both have
// bitten already.
//
// By lesson: --only measures one lesson, so every other lesson on the list
// reads as "now fits, take it off" and one lesson's run reports 280 false
// fixes.
//
// By viewport: CI runs the wall alone, because measuring both sizes doubles a
// job that already takes half an hour. Comparing a wall only run against the
// whole baseline reports all 55 laptop only entries as fixed, which is 55
// failures on a green tree.
//
// So the unit of comparison is the pair, not the key.
const measuredModule = k => lessons.some(l => k.startsWith(`${l.module_id} s`))
const TAGS = VIEWPORTS.map(v => v.tag)
const pairs = obj => Object.keys(obj).filter(measuredModule)
  .flatMap(k => TAGS.filter(t => obj[k][t] != null).map(t => `${k} @${t}`))

const wasClipping = new Set(pairs(baseline))
const isClipping = new Set(pairs(found))

const fresh = [...isClipping].filter(p => !wasClipping.has(p)).sort()
const fixed = [...wasClipping].filter(p => !isClipping.has(p)).sort()

for (const p of fresh) console.error(`  FAIL ${p} is cut off on the wall and is not on the baseline`)
for (const p of fixed) console.error(`  FAIL ${p} now fits. Take it off ${BASELINE_FILE} so it cannot break again.`)

if (!fresh.length && !fixed.length) {
  console.log(`check-wall-fit: ${measured} slides measured at ${TAGS.join(' and ')}, `
    + `${isClipping.size} clipping, all known. ${Object.keys(baseline).length} slides on the baseline.`)
  process.exit(0)
}
console.error(`\ncheck-wall-fit: ${fresh.length} new, ${fixed.length} fixed but still listed.`)
process.exit(1)
