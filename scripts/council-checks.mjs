// THE LESSON COUNCIL: the counted checks themselves, with no database and no
// credentials, so they can be run against a fixture and argued with.
//
// They live apart from scripts/council.mjs for one reason: a check that can
// only run against production is a check nobody tests. The scoring rules here
// are the thing most likely to be WRONG, and they have already been wrong
// twice (see the comment above ON_THE_WALL). Being able to run them over a
// saved scheme is what caught the second one.
//
// Every function takes the same shape: an array of lessons, each with
// key_stage, module_id, slides and teacher_notes. It returns
// { name, score, detail, fails }. Nothing here reads the network.

// The words a child can hold on one slide, by age. From the ISO 9241 legibility
// work and the age banded rules in research/2026-09-09-lesson-quality-council.md.
// These are OUR thresholds and they should be argued about, which is why they
// are one visible constant rather than scattered through the checks.
export const WORD_CEILING = { EYFS: 12, KS1: 12, KS2: 25, KS3: 40, KS4: 60, KS5: 60 }

// A slide the child DOES something on. Everything else, they watch.
export const ACTION = new Set(['choice', 'discussion', 'tryit', 'interactive', 'scenario'])

// The longest a child should sit without acting. Our judgement, not a standard.
export const MAX_PASSIVE_MINUTES = 4

// WHAT IS ACTUALLY ON THE WALL, per slide type.
//
// The first version of this check counted four fields, heading body text
// caption, on every slide whatever its type. Two things were wrong with that,
// and they pulled in opposite directions.
//
// TOO HARSH, and corrected earlier: it counted `question` and `prompt`, which
// are the teacher's, and scored KS1 at 4.52 with eleven well written teacher
// questions among the failures.
//
// TOO SOFT, and much worse: a `choice` slide has no heading, body, text or
// caption at all. Its words live in `question` and `options[].text`. So all
// 105 of them scored zero words and passed automatically. Same for
// `discussion` (37, its words are in `prompt`), `objective` (21), `stat` (12),
// and partly for `recap`, `keywords`, `digi` and `diagram`, whose real content
// is in an array the check never opened. 236 of 479 slides, nearly half the
// scheme, were being handed 10 out of 10 for having no fields the check knew
// the names of. The 7.93 was that free pass talking.
//
// So the map below is exhaustive by construction: every slide type names what
// it puts on the wall, and a type MISSING from the map fails loudly rather
// than scoring zero and passing. A check that cannot see a slide must never
// call it good.
//
// TWO KINDS OF WORDS, and they are never averaged together.
//
// PROSE is what a child reads while the teacher is talking. Reading and
// listening compete for the same channel, so this is where the redundancy
// effect bites and where the age ceiling belongs. Whole slide against it.
//
// BLOCKS are what a child reads to decide: the question and the options they
// are choosing between, the recap points, the keyword meanings, the steps of a
// diagram. Nobody is talking over these; the child reads one at a time, at
// their own pace, and re reading is the task. So each block is measured on its
// own against the same ceiling, not summed.
//
// Summing them would be the cheat. There are 149 prose slides and 699 blocks,
// so one combined average scores 8.69 and clears the 8.5 gate while the prose
// half sits at 4.30. Two checks, two scores, never one number.
export const ON_THE_WALL = {
  // prose: read while the teacher talks
  title:   { prose: ['title', 'eyebrow', 'body'] },
  concept: { prose: ['heading', 'body'] },
  tryit:   { prose: ['heading', 'body'] },
  recap:   { prose: ['heading'], blocks: s => s.points ?? [] },
  diagram: {
    prose: ['heading', 'caption'],
    blocks: s => (s.steps ?? []).map(x => `${x.title ?? ''} ${x.text ?? ''}`).concat(s.verdicts ?? []),
  },

  // blocks: read to decide, at the child's own pace
  choice:      { blocks: s => [s.question, ...(s.options ?? []).map(o => o.text)] },
  discussion:  { blocks: s => [s.prompt, s.lookFor] },
  objective:   { blocks: s => [s.outcome, s.why, ...(s.gains ?? [])] },
  keywords:    { prose: ['heading'], blocks: s => (s.words ?? []).map(w => `${w.word ?? ''} ${w.meaning ?? ''}`) },
  quote:       { blocks: s => [s.text] },
  stat:        { blocks: s => [s.figure, s.claim, s.source] },
  digi:        { prose: ['heading'], blocks: s => s.lines ?? [] },
  video:       { blocks: s => [s.caption] },
  interactive: { blocks: s => [s.caption] },

  // NOT MEASURED, on purpose. A scenario is a realistic feed post the class
  // investigates, and its realism IS the lesson. Cutting a fake post to fit a
  // word ceiling makes it a worse fake and teaches children to spot something
  // real posts do not do. It needs a different test, "would this pass for
  // real", and that one is judged, not counted.
  scenario:    { exempt: 'a fake post has to look like a real post' },
}

const count = t => {
  const s = String(t ?? '').trim()
  return s ? s.split(/\s+/).length : 0
}

// ── Check 2a: prose ──────────────────────────────────────────────────
export function checkProse(lessons) {
  const fails = []
  let total = 0, pass = 0
  for (const l of lessons) {
    const ceiling = WORD_CEILING[l.key_stage] ?? 60
    for (const [i, s] of (l.slides ?? []).entries()) {
      const map = ON_THE_WALL[s.type]
      if (!map) {
        total += 1
        fails.push({ module: l.module_id, ks: l.key_stage, slide: i + 1, type: s.type, words: 'UNKNOWN TYPE', ceiling })
        continue
      }
      if (!map.prose) continue
      total += 1
      const w = map.prose.reduce((n, k) => n + count(s[k]), 0)
      if (w <= ceiling) pass += 1
      else fails.push({ module: l.module_id, ks: l.key_stage, slide: i + 1, type: s.type, words: w, ceiling })
    }
  }
  return {
    key: 'prose',
    binary: false,
    name: 'Prose: words a child reads while the teacher is talking',
    score: total ? (10 * pass) / total : 0,
    detail: `${pass} of ${total} slides within the age ceiling`,
    fails: fails.sort((a, b) => (b.words | 0) - (a.words | 0)),
  }
}

// ── Check 2b: blocks ─────────────────────────────────────────────────
export function checkBlocks(lessons) {
  const fails = []
  let total = 0, pass = 0
  for (const l of lessons) {
    const ceiling = WORD_CEILING[l.key_stage] ?? 60
    for (const [i, s] of (l.slides ?? []).entries()) {
      const map = ON_THE_WALL[s.type]
      if (!map?.blocks) continue
      for (const b of map.blocks(s)) {
        const w = count(b)
        if (w === 0) continue // an absent optional field is not a block
        total += 1
        if (w <= ceiling) pass += 1
        else fails.push({ module: l.module_id, ks: l.key_stage, slide: i + 1, type: s.type, words: w, ceiling })
      }
    }
  }
  return {
    key: 'blocks',
    binary: false,
    name: 'Blocks: each thing a child reads to decide',
    score: total ? (10 * pass) / total : 0,
    detail: `${pass} of ${total} blocks within the age ceiling`,
    fails: fails.sort((a, b) => b.words - a.words),
  }
}

// ── Check 3: engagement cadence ──────────────────────────────────────
export function checkEngagement(lessons) {
  const fails = []
  let stretches = 0, ok = 0
  for (const l of lessons) {
    let run = 0, startedAt = 1
    for (const [i, s] of (l.slides ?? []).entries()) {
      if (ACTION.has(s.type)) {
        if (run > 0) {
          stretches += 1
          if (run <= MAX_PASSIVE_MINUTES) ok += 1
          else fails.push({ module: l.module_id, ks: l.key_stage, fromSlide: startedAt, toSlide: i, minutes: run })
        }
        run = 0
        startedAt = i + 2
      } else {
        run += Number(s.minutes ?? 0)
      }
    }
    if (run > 0) {
      stretches += 1
      if (run <= MAX_PASSIVE_MINUTES) ok += 1
      else fails.push({ module: l.module_id, ks: l.key_stage, fromSlide: startedAt, toSlide: (l.slides ?? []).length, minutes: run })
    }
  }
  return {
    key: 'engagement',
    binary: false,
    name: 'Engagement: minutes a child sits without acting',
    score: stretches ? (10 * ok) / stretches : 0,
    detail: `${ok} of ${stretches} stretches within ${MAX_PASSIVE_MINUTES} minutes`,
    fails: fails.sort((a, b) => b.minutes - a.minutes),
  }
}

// ── Check 10: the passport reaches the lesson ────────────────────────
export function checkPassport(lessons) {
  const fails = []
  let pass = 0
  for (const l of lessons) {
    // A lesson knows its stamp when the notes name one. Nothing can be stamped
    // until this exists, so it is the first thing the passport work must fix.
    const has = Boolean(l.teacher_notes?.passport_stage)
    if (has) pass += 1
    else fails.push({ module: l.module_id, ks: l.key_stage, missing: 'passport_stage' })
  }
  return {
    key: 'passport',
    // Binary: a module either names its stamp or it does not. There is no craft
    // judgement in it, so anything under 10 is unfinished work, not a standard
    // we are working towards. Justin, 9 September 2026: ten out of ten on the
    // binary checks, the ratchet everywhere else.
    binary: true,
    name: 'Passport: the lesson knows which stamp it earns',
    score: lessons.length ? (10 * pass) / lessons.length : 0,
    detail: `${pass} of ${lessons.length} modules name a passport stage`,
    fails,
  }
}

// ── The ratchet ──────────────────────────────────────────────────────
// The floor is the best score this check has ever reached, so it can never be
// satisfied by standing still and never failed by standing still. Only going
// backwards is red. Binary checks ignore the ratchet: they must be ten.
//
// Pure on purpose. The runner does the file reading, the fixture guard and the
// exit code; this decides. A gate whose logic is tangled up with process.exit
// is a gate nobody tests, and the two bugs already found in this file were both
// in code that could not be run without production credentials.
export function verdict({ score, best, binary, rulesChanged }) {
  if (rulesChanged) return 'NO FLOOR'

  // A binary check is ten or it is not done. But "never started" and "went
  // backwards" are different facts and only one of them is a regression, so
  // they get different words and different exit codes. Making unbuilt work red
  // on every build is how a gate teaches people to ignore it; making a
  // regression red is the entire point of having one.
  if (binary) {
    if (score >= 10) return 'HELD'
    return best >= 10 ? 'SLIPPED' : 'UNMET'
  }

  if (best === null || best === undefined) return 'FIRST RUN'
  if (score < best) return 'SLIPPED'
  if (score > best) return 'RATCHET UP'
  return 'HELD'
}

// Only a regression fails the build. UNMET is outstanding work, and it is
// already named in the report and in the plan.
export const isRegression = v => v === 'SLIPPED'
