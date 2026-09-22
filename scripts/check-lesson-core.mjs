// THE CORE AND THE EXTENSION.
//
// 26 of the 29 school lessons run longer than 55 minutes, and every one of them
// puts its prove phase, the exit quiz, LAST and gives it four minutes. So a
// teacher who stops at the bell loses one hundred per cent of the assessment
// and keeps all of the explaining. A reviewer heard what actually happens in
// the room: teachers cut the last two practise slides to reach the quiz, and
// some never reach it.
//
// The fix is not a stopping point, it is a droppable set in the MIDDLE. Slides
// carry `extension: true`; the core is every slide without it. A teacher short
// of time skips the marked ones, still runs the whole arc, still lands the
// objective and still reaches the exit quiz.
//
// This holds the rules from plans/2026-09-21-core-and-extension-plan.md.
//
//   1. A slide may be marked extension ONLY in teach or practise. Never
//      starter, never prove, never close: the arc has to survive the cut.
//   2. The core fits 55 minutes where that is reachable without cutting into
//      explanation or a lesson's last check. See THE FIVE below: two
//      safeguarding lessons cannot, and pretending otherwise would mean
//      dropping safeguarding content to hit a number.
//   3. The core still teaches the objective: every protected phrase still
//      appears in a core slide.
//   4. Nothing is deleted and no minute changes. The published length stays the
//      real total of every slide, core and extension together.
//   5. The three youngest lessons already fit. They carry no marks and this
//      expects none.
//
// ── THE FIVE THAT DO NOT REACH 55, AND WHY THAT IS THE RIGHT ANSWER ─────────
//
// Marking everything safely droppable (discussions, second examples, later
// checks, secondary practice) leaves five lessons above 55: ks2-08, ks3-11 and
// ks3-12 at 56, ks2-07 at 59, ks4-17 at 60. What remains in those is concept
// slides, key visuals and each phase's single remaining check.
//
// ks4-17 is sextortion. Getting it to 55 means dropping what sextortion is, or
// why paying never makes it stop, or the three lifelines, or the one check left
// in the teach phase. That is not a time saving, it is a hole in a safeguarding
// lesson, and the same argument runs for ks2-07 on privacy.
//
// So the ceiling below is per lesson and derived from what marking safely
// achieved, not asserted at 55 for everything. A lesson may always come DOWN.
// It may never go up without changing this file and saying why.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const MODULES = 'content/modules'
const TARGET = 55
const MARKABLE_PHASES = new Set(['teach', 'practise'])
const LIST = process.argv.includes('--list')

// The core minutes each lesson is allowed, where 55 was not reachable without
// cutting explanation or a last check. Lower these as content changes; never
// raise one without a line here saying what stopped it.
const CEILING = {
  'ks2-07-privacy-reputation': 59,
  'ks2-08-kind-safe-online': 56,
  // 58 rather than 56 because of this check's own catch. Both slides carrying
  // "password", an RSHE evidence phrase, were marked, which would have dropped
  // it out of the core. Slide 20, three workarounds hiding in one message, is
  // the lesson's own synthesis and came back. The two minutes are the price.
  'ks3-11-social-workarounds': 58,
  'ks3-12-misinfo-deepfakes': 56,
  'ks4-17-sextortion': 60,
}

// The phrases a lesson is held to elsewhere, so the core cannot drop the slide
// that carries one. Read from the two files that own them rather than copied,
// because a copy drifts: that is the fault check-source-claims caught on
// 21 September, when gen-review-batch knew two of the three places a phrase
// lives and the third went to production unguarded.
const unq = s => s.replace(/\\'/g, "'")
const probes = []
for (const [file, kind] of [['shared/schools-rshe-2026.ts', 'rshe'], ['shared/schools-computing-pos.ts', 'computing']]) {
  const src = readFileSync(file, 'utf8')
  for (const b of src.split(/\n  \{\n/).slice(1)) {
    const mods = [...(b.match(/modules: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'([^']+)'/g)].map(m => m[1])
    if (!mods.length) continue
    if (kind === 'rshe') {
      for (const m of (b.match(/evidence: \[([^\]]*)\]/) || [, ''])[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)) probes.push({ phrase: unq(m[1]), modules: mods })
    } else {
      for (const p of b.matchAll(/\{ phrase: '((?:[^'\\]|\\.)*)', modules: \[([^\]]*)\] \}/g)) {
        probes.push({ phrase: unq(p[1]), modules: [...p[2].matchAll(/'([^']+)'/g)].map(x => x[1]) })
      }
    }
  }
}

const norm = s => String(s).toLowerCase()
let bad = 0
const fail = (id, msg) => { bad += 1; console.error(`  FAIL ${id}: ${msg}`) }
const rows = []

for (const f of readdirSync(MODULES).filter(x => x.endsWith('.json')).sort()) {
  const m = JSON.parse(readFileSync(join(MODULES, f), 'utf8'))
  const id = m.module_id
  const total = m.slides.reduce((a, s) => a + (s.minutes || 0), 0)
  const marked = m.slides.filter(s => s.extension)
  const core = total - marked.reduce((a, s) => a + (s.minutes || 0), 0)
  const cap = CEILING[id] ?? TARGET
  rows.push({ id, total, core, marks: marked.length, cap })

  // 1. only in the middle
  for (const [i, s] of m.slides.entries()) {
    if (s.extension && !MARKABLE_PHASES.has(s.phase)) {
      fail(id, `slide ${i + 1} is marked extension in the ${s.phase} phase. Only teach and practise may be dropped; the arc has to survive the cut.`)
    }
  }

  // 2. the core fits, at 55 or at this lesson's recorded ceiling
  if (core > cap) {
    fail(id, `the core is ${core} minutes against a ceiling of ${cap}. Mark more of the teach or practise phase, or `
      + `if nothing is left that can go without cutting explanation, raise the ceiling in this file and say what stopped it.`)
  }
  // and a ceiling that is no longer needed is a ceiling that should come off
  if (CEILING[id] && core <= TARGET) {
    fail(id, `the core is ${core} minutes, inside ${TARGET}, so the ${CEILING[id]} minute exception in this file is stale. Take it off.`)
  }

  // 5. the three that already fit carry no marks
  if (total <= TARGET && marked.length) {
    fail(id, `is ${total} minutes and already fits, so it should carry no extension marks. It has ${marked.length}.`)
  }

  // 3. every protected phrase survives in the core
  const coreText = norm(JSON.stringify(m.slides.filter(s => !s.extension)))
  for (const p of probes.filter(p => p.modules.includes(id))) {
    const inWhole = norm(JSON.stringify(m.slides)).includes(norm(p.phrase))
    if (inWhole && !coreText.includes(norm(p.phrase))) {
      fail(id, `the core no longer carries "${p.phrase.slice(0, 54)}". A teacher who drops the extension set would lose it.`)
    }
  }
}

if (LIST) {
  console.log('lesson'.padEnd(42), 'total', 'core', 'marks', 'ceiling')
  for (const r of rows) console.log(r.id.padEnd(42), String(r.total).padStart(5), String(r.core).padStart(4), String(r.marks).padStart(5), String(r.cap).padStart(7))
}

const withMarks = rows.filter(r => r.marks).length
console.log(bad
  ? `\ncheck-lesson-core: ${bad} failing`
  : `check-lesson-core: ${rows.length} lessons, ${withMarks} carry an extension set, every core inside its ceiling with every protected phrase kept.`)
process.exit(bad ? 1 : 0)
