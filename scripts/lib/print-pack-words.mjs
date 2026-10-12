// THE WORDS ON THE THREE PAPER PACK SHEETS THAT GROW WITH A LESSON.
//
// Most sheets of the paper pack (schools/app/print/[module]/page.tsx) are
// fixed: four bookmarks, worksheet cards split by capacity, answer keys with
// room to spare. Three sheets carry as many words as the lesson gives them,
// and those are the three that ran onto a second page on 9 October 2026: the
// teacher one pager, the start and exit cards, and the parent note.
//
// This counts the characters each of those sheets prints, read from a lesson
// the way the page reads it. Two scripts share it, so they cannot count
// differently: check-print-pack-fit.mjs records the count beside the room
// it measured in a real PDF, and check-print-kit.mjs compares today's count
// against that record in CI, where there is no browser.
//
// Node builtins only: the wiring job runs no npm ci.

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

export const BASELINE = 'scripts/print-pack-fit-baseline.json'

// The files whose layout the measured room belongs to. A change to either
// can move every sheet, so the record says which version it measured.
export const LAYOUT_FILES = ['schools/components/print/kit.tsx', 'schools/app/print/[module]/page.tsx']
export const layoutHash = () => {
  const h = createHash('sha256')
  for (const f of LAYOUT_FILES) h.update(readFileSync(f, 'utf8').replace(/\r\n/g, '\n'))
  return h.digest('hex').slice(0, 16)
}

// How much new text the measured room can take, deliberately pessimistic:
// the tallest line a sheet sets (px) and the fewest characters any line on
// it holds (the half width boxes on the one pager, the column beside the
// friend on a card, the words beside the QR on the note). One line is kept
// back for a paragraph that spills a single word onto a line of its own.
export const SHEET_LINE = {
  teacher: { px: 17, chars: 45 },
  cards: { px: 30, chars: 35 },
  parent: { px: 24, chars: 40 },
}
export const roomFor = (kind, sparePx) => Math.max(0, Math.floor(sparePx / SHEET_LINE[kind].px) - 1) * SHEET_LINE[kind].chars

const len = parts => parts.flat(Infinity).filter(p => typeof p === 'string').reduce((n, p) => n + p.trim().length, 0)
const obj = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {})
const text = v => (typeof v === 'string' && v.trim() ? v : undefined)
// asTool in schools/lib/notes.ts, in plain node: { heading, lines } or null.
const toolOf = v => {
  if (typeof v === 'string') return v.trim() ? { lines: [v.trim()] } : null
  const t = obj(v)
  const tool = { heading: text(t.heading), lines: Array.isArray(t.lines) ? t.lines.filter(l => typeof l === 'string') : typeof t.lines === 'string' && t.lines.trim() ? [t.lines] : [] }
  return tool.heading || tool.lines.length ? tool : null
}

/** A content/modules/*.json lesson to the characters each growing sheet prints. */
export function packWords(lesson) {
  const row = obj(lesson.row)
  const notes = obj(lesson.teacher_notes)
  const parent = obj(lesson.parent_note)
  const diff = obj(notes.differentiation)
  // The page reads the tool through asTool (schools/lib/notes.ts): a tool
  // written as a sentence prints as one line under "The tool", and only a
  // row with no tool at all prints the reference lesson's three checks.
  const tool = toolOf(notes.tool)

  const teacher = len([
    row.title, row.single_action_outcome, obj(lesson.dsl_note).note,
    notes.learning_objective, notes.timing,
    (row.statutory_hooks ?? []).join(' · '), (row.efcw_strands ?? []).join(', '), row.evidence_anchor,
    notes.misconceptions ?? [], diff.support, diff.stretch, notes.paper_fallback,
  ])

  // The classroom deck: the authored slides less anything child only
  // (visibleSlides in shared/lesson-slides.ts). The start card is the first
  // choice slide, the exit card the prove phase ones (page.tsx).
  const slides = (Array.isArray(lesson.slides) ? lesson.slides : []).filter(s => s && !s.kid_only)
  const checks = slides.filter(s => s.type === 'choice')
  const asked = c => [c.question ?? '', (c.options ?? []).map(o => o?.text ?? '')]
  const start = checks[0]?.question?.trim() ? [asked(checks[0])] : []
  const exits = checks.filter(c => c.phase === 'prove').map(asked)
  const cards = len([start, exits, notes.commitment_stem ?? 'My commitment: the next time I see a shocking post I will...'])

  const parentWords = len([
    parent.headline ?? 'What we taught today', parent.taught,
    tool ? tool.heading ?? 'The tool' : 'The three checks',
    tool ? tool.lines : ['1. Who made this, and how do they know?', '2. What do other places say?', '3. How is it trying to make me feel?'],
    parent.try_this, parent.family_question, parent.passport,
  ])

  return { teacher, cards, parent: parentWords }
}
