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

// The words a child can hold on one slide.
//
// EYFS AND KS1 AT 12, ON DECODING. A four to seven year old is learning to
// read. Seventy words of prose on a wall is not dense for them, it is
// unreadable, and migration 276 proved it from the other side too: every idea
// in those paragraphs was already in the teacher's script, so cutting them lost
// nothing at all.
//
// KS2 TO KS5 AT 105, MEASURED RATHER THAN CHOSEN. These were 25, 40, 60 and 60,
// numbers we picked, and every single concept slide from KS2 up failed them,
// 60 out of 60. When a whole corpus written by people who knew what they were
// doing breaks a rule, suspect the rule.
//
// So the rule was replaced with a measurement. All 78 KS2 to KS5 prose slides
// were rendered through the real player (GC_DEV_SLIDES, see
// app/dev/lesson-player) at 1920x1080 and at 1366x768, and checked for the two
// failures a class actually sees: text clipped inside the scrolling area, and
// the Continue control pushed off screen so the lesson cannot advance.
//
// The first pass measured 13 failures starting at 95 words, and then showed
// WHY: the concept emoji cost 108px of a 768px laptop, 15 percent of the
// height, and was sized on viewport width only. Same bug the text had. Once
// decoration learned to yield (WALL.emoji), the laptop went from 65 to 73 of 78
// and the binding screen became the 1920x1080 wall:
//
//   below 106 words   64 slides on the wall, 73 on the laptop, ZERO failures
//   106 to 113        the ambiguous band, where the heading length decides it
//   106 and above     6 slides fail, and those are real copy to fix
//
// 105 is therefore the largest count at which nothing was observed to fail. Not
// a round number, because rounding away from the measurement is how we got the
// asserted ones. Fixing the layout first mattered: cutting copy to a ceiling
// that decoration was stealing would have been the wrong repair to the right
// complaint.
//
// THE FIRST ATTEMPT AT THIS MEASUREMENT SAID EVERY SLIDE FITS, and it was
// wrong. It read page level scrollHeight, which never grows here because the
// player scrolls content inside itself. A deliberately absurd 655 word control
// slide reported the same zero overflow as a 131 word one; the screenshot
// showed it cut off mid sentence with the Continue button gone. The control is
// the only reason that did not ship as "measured: the ceiling was wrong".
// Any future change to these numbers should re-run it.
//
// ONE NUMBER FOR FOUR KEY STAGES, deliberately. The binding constraint above
// KS1 is physical, how much 40px text fits on a classroom screen, and a screen
// does not care how old the child is. A tighter developmental ceiling for KS2
// than for KS5 is probably right and we have no evidence for where it sits, so
// it is not invented here.
export const WORD_CEILING = { EYFS: 12, KS1: 12, KS2: 105, KS3: 105, KS4: 105, KS5: 105 }

// How each ceiling is defended, for anything that wants to report the score
// without overclaiming it. All six are evidenced now, but not by the same kind
// of evidence, and that difference is worth carrying.
export const CEILING_BASIS = {
  EYFS: 'decoding', KS1: 'decoding',
  KS2: 'measured', KS3: 'measured', KS4: 'measured', KS5: 'measured',
}

// A slide the child DOES something on. Everything else, they watch.
//
// THIS WAS A LIST OF TYPE NAMES AND THAT WAS TOO BLUNT. Every one of the 44
// diagram slides counted as passive, which put the module's own tool slide,
// the thing the class chants back and uses, on the wrong side of the line and
// scored the scheme 4.35.
//
// The temptation was to move `diagram` wholesale into the set. Reading the
// scripts made that look right, and grepping them for "chant", "say it back",
// "hands up" matched 20 of 44. But a check that greps the teacher's prose for
// activity words is exactly the soft instrument this file exists to avoid: it
// scores writing style, and it under detected here anyway (a random five out
// of five all had choral response, so the pattern was missing more than half).
//
// THE DATA MAKES THE DISTINCTION ITSELF. A diagram carries an optional
// `verdicts` array, the answer chips the class chooses between, and exactly 21
// of the 44 have one: one per module, the tool slide. A diagram WITH verdicts
// is an instrument the class operates. A diagram without is a flow they watch.
// That is a structural fact in the slide, not an inference from prose, and it
// is per slide rather than per type.
//
// A `quote` joins them for the same kind of reason: the player renders it under
// the label "Say this", so the response is the design of the slide, not a
// happy accident of how somebody wrote its script.
export const ACTION = new Set(['choice', 'discussion', 'tryit', 'interactive', 'scenario'])

export const respondsTo = slide =>
  ACTION.has(slide.type) ||
  slide.type === 'quote' ||
  (slide.type === 'diagram' && (slide.verdicts?.length ?? 0) > 0)

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
      if (respondsTo(s)) {
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

// The stages the passport actually has, from lib/stickers/book.ts on the
// parents side, plus 'after' for the sixth form modules that sit past it.
// Kept as a literal rather than imported from shared/passport-stages.ts because
// this file is plain .mjs with no build step, and a drift between the two is
// caught by migration 277's own guard, which asserts the mapping module by
// module.
const PASSPORT_PLACEMENTS = new Set([
  'foundation', 'builder', 'explorer', 'shaper', 'independent', 'after',
])

// ── Check 10: the passport reaches the lesson ────────────────────────
export function checkPassport(lessons) {
  const fails = []
  let pass = 0
  for (const l of lessons) {
    // A lesson knows its page when the notes name one the passport actually
    // has. Any truthy string used to pass, which would have let a typo or an
    // invented stage score ten out of ten while nothing could ever award it.
    // Same rule as ON_THE_WALL: a value the check does not recognise fails.
    //
    // 'after' counts as knowing. KS5 is past sixteen and the passport is the
    // journey to sixteen, so those two modules fill nothing on purpose. A check
    // that demanded a page from all 21 would push somebody into inventing one
    // for a child who has already finished the book.
    const stage = l.teacher_notes?.passport_stage
    if (PASSPORT_PLACEMENTS.has(stage)) pass += 1
    else fails.push({ module: l.module_id, ks: l.key_stage, passport_stage: stage ?? 'missing' })
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
    detail: `${pass} of ${lessons.length} modules know their passport page`,
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
