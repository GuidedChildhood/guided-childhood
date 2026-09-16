// WHAT THIS SCREEN HAS DONE TOWARDS EACH LESSON.
//
// The tracker's memory, and the sibling of shared/schools-taught.ts: same
// localStorage doctrine, same promise. It records what a SCREEN has done
// towards a LESSON, never who was in the room. The schools app holds no pupil
// data, no teacher accounts and no session, the data processing agreement is
// written on that, and an attendance register is a different product with a
// different legal footing.
//
// THE RULE THE PANEL SETS. Justin, 16 September 2026, with a screenshot of
// Meta's "You're following best practices": like this, that auto ticks as
// they go. That panel works because every row in it is machine checked, so a
// person reads six green ticks and believes them. The moment one row needs a
// human to tap it the whole panel becomes a form, and a green tick stops
// being evidence.
//
// So: a green tick is only ever awarded for something the product can see for
// itself. Seven of the nine steps here have a real detector behind them. The
// two that do not sit in their own block, drawn differently, and say so.
//
// NO IMPORTS, on purpose, so the guard can load this under plain node and so
// this file can never reach for a lesson row. What applies to a lesson comes
// in as a LessonShape, read from the row by the page that has it.
//
// ONE TRUTH PER FACT. The passport step is NOT stored here. The passport beat
// already writes shared/schools-taught.ts when a class fills the page, so
// `lessonState` takes that list and reads the step from it. A second copy of
// the same fact is the bug that arrives three weeks later.

export type StepId =
  | 'read' | 'lookback' | 'pack' | 'record' | 'board' | 'taught' | 'passport'
  | 'dsl' | 'notes_home'

/** `auto` ticks itself from a signal. `yours` is a teacher's word. */
export type StepKind = 'auto' | 'yours'

export type StepDef = {
  id: StepId
  kind: StepKind
  /** The claim, in the past tense, stating the thing as done. */
  claim: string
  /** The grey line underneath: why it matters. One sentence. */
  why: string
  /** What actually ticks it, for the page that has to say so. */
  signal: string
}

// In running order, which is also teaching order: before, during, after.
export const STEP_ORDER: StepId[] = [
  'read', 'lookback', 'pack', 'record', 'board', 'taught', 'passport',
  'dsl', 'notes_home',
]

export const STEPS: Record<StepId, StepDef> = {
  read: {
    id: 'read', kind: 'auto',
    claim: 'You have read the lesson',
    why: 'Knowing the misconceptions before the room says them is the difference between a lesson and a reading.',
    signal: 'the lesson page opened',
  },
  lookback: {
    id: 'lookback', kind: 'auto',
    claim: 'You have looked back',
    why: 'This lesson opens by recalling the last one, so the class is warmer when you begin.',
    signal: 'the lesson before this one opened, or already taught',
  },
  pack: {
    id: 'pack', kind: 'auto',
    claim: 'The pack is printed',
    why: 'One photocopy run and the whole lesson can be taught with no screen at all.',
    signal: 'the pack sent to a printer',
  },
  record: {
    id: 'record', kind: 'auto',
    claim: 'The learning record is printed',
    why: 'The assessment is the conversation about the gap, and it needs the sheet in front of you.',
    signal: 'the learning record sent to a printer',
  },
  board: {
    id: 'board', kind: 'auto',
    claim: 'The board is ready',
    why: 'Open it before they come in, not while thirty children watch you type.',
    signal: 'the lesson opened in the player',
  },
  taught: {
    id: 'taught', kind: 'auto',
    claim: 'You taught it',
    why: 'Recorded here with the date, for your own record and your subject lead’s.',
    signal: 'the player reached the finish',
  },
  passport: {
    id: 'passport', kind: 'auto',
    claim: 'The class filled the passport page',
    why: 'The page fills at school and at home alike, and this screen keeps its own count.',
    signal: 'the passport moment tapped in the lesson',
  },
  dsl: {
    id: 'dsl', kind: 'yours',
    claim: 'Brief the safeguarding lead',
    why: 'So they know why a child may come to them this week.',
    signal: 'yours to tick, we cannot see it',
  },
  notes_home: {
    id: 'notes_home', kind: 'yours',
    claim: 'Parent notes into book bags',
    why: 'The home code travels on that note, which is the whole bridge to home.',
    signal: 'yours to tick, we cannot see it',
  },
}

/**
 * What the lesson row says about which steps apply to it. Every field is a
 * fact already on the row, so a lesson that gains `i can` statements gains
 * its learning record step without anybody editing a list.
 */
export type LessonShape = {
  /** `teacher_notes.i_can` has entries. */
  hasRecord: boolean
  /** The lesson fills one of the five passport pages (not the KS5 'after'). */
  hasPassportPage: boolean
  /** `dsl_note.required`. */
  dslRequired: boolean
  /** There is a lesson before this one in the scheme to look back at. */
  hasPrevious: boolean
}

/** The steps that apply to one lesson, in running order. */
export function stepsFor(shape: LessonShape): StepDef[] {
  return STEP_ORDER
    .filter(id => {
      if (id === 'record') return shape.hasRecord
      if (id === 'passport') return shape.hasPassportPage
      if (id === 'dsl') return shape.dslRequired
      if (id === 'lookback') return shape.hasPrevious
      return true
    })
    .map(id => STEPS[id])
}

// ── THE MEMORY ────────────────────────────────────────────────────────────

const KEY = 'gc.schools.progress'
export const PROGRESS_EVENT = 'gc:schools-progress'

/** `{ [moduleId]: { [stepId]: isoDate } }`. The date, not a boolean, so the
 *  coverage sheet can say when. */
export type Progress = Record<string, Partial<Record<StepId, string>>>

function store(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage
  } catch {
    return null // private mode, or storage blocked
  }
}

export function readProgress(): Progress {
  const s = store()
  if (!s) return {}
  try {
    const raw = s.getItem(KEY)
    const v: unknown = raw ? JSON.parse(raw) : {}
    if (!v || typeof v !== 'object' || Array.isArray(v)) return {}
    const out: Progress = {}
    for (const [moduleId, steps] of Object.entries(v as Record<string, unknown>)) {
      if (!steps || typeof steps !== 'object' || Array.isArray(steps)) continue
      const kept: Partial<Record<StepId, string>> = {}
      for (const [stepId, at] of Object.entries(steps as Record<string, unknown>)) {
        // Unknown ids are dropped rather than carried: a renamed step should
        // not leave a ghost tick behind that nothing can clear.
        if (typeof at === 'string' && (STEP_ORDER as string[]).includes(stepId)) {
          kept[stepId as StepId] = at
        }
      }
      out[moduleId] = kept
    }
    return out
  } catch {
    return {}
  }
}

function write(p: Progress): Progress {
  const s = store()
  try { s?.setItem(KEY, JSON.stringify(p)) } catch { /* full or blocked: the page still draws */ }
  try { window.dispatchEvent(new CustomEvent(PROGRESS_EVENT)) } catch { /* SSR */ }
  return p
}

/**
 * Record a step against a lesson, once. The FIRST date wins: a teacher who
 * reopens the pack in March has not printed it in March, and a coverage sheet
 * that drifts forward every time somebody looks at a page is not a record.
 */
export function markStep(moduleId: string, stepId: StepId, at: string = new Date().toISOString()): Progress {
  const p = readProgress()
  const steps = p[moduleId] ?? {}
  if (steps[stepId]) return p
  return write({ ...p, [moduleId]: { ...steps, [stepId]: at } })
}

export function unmarkStep(moduleId: string, stepId: StepId): Progress {
  const p = readProgress()
  const steps = { ...(p[moduleId] ?? {}) }
  if (!steps[stepId]) return p
  delete steps[stepId]
  return write({ ...p, [moduleId]: steps })
}

export function clearProgress(): void {
  write({})
}

// ── WHERE THE STEPS AND THE MEMORY MEET ───────────────────────────────────

/**
 * The passport step's "when". The taught memory is a list of module ids and
 * carries no date, so this step can say that it happened and cannot say when.
 * A sentinel rather than an invented timestamp: the coverage sheet prints
 * "done" for this row instead of a date it does not have.
 */
export const TAUGHT_NO_DATE = 'taught'

export type StepState = StepDef & { doneAt: string | null }

export type LessonState = {
  steps: StepState[]
  /** The seven the product can see, of those that apply. */
  auto: StepState[]
  /** The two a teacher ticks. */
  yours: StepState[]
  done: number
  total: number
  /** Every applicable step done. Computed, never stored. */
  complete: boolean
  /** The latest date across the steps, which is when it became complete. */
  completedAt: string | null
}

/**
 * One lesson's state, with the passport step read from the taught memory
 * rather than from this one.
 *
 * THE TICK IS COMPUTED HERE AND NOWHERE ELSE, and there is deliberately no
 * way to store it. A tick a teacher can award themselves proves nothing to a
 * subject lead, which is the reason it exists.
 */
export function lessonState(
  moduleId: string,
  shape: LessonShape,
  progress: Progress,
  taught: string[],
): LessonState {
  const saved = progress[moduleId] ?? {}
  const steps: StepState[] = stepsFor(shape).map(def => ({
    ...def,
    // ONE TRUTH PER FACT: the passport beat already wrote this into the
    // taught memory, so this step is read from there and never stored here.
    doneAt: def.id === 'passport'
      ? (taught.includes(moduleId) ? TAUGHT_NO_DATE : null)
      : (saved[def.id] ?? null),
  }))
  const dates = steps.map(s => s.doneAt).filter((d): d is string => !!d && d !== TAUGHT_NO_DATE)
  const done = steps.filter(s => s.doneAt).length
  return {
    steps,
    auto: steps.filter(s => s.kind === 'auto'),
    yours: steps.filter(s => s.kind === 'yours'),
    done,
    total: steps.length,
    complete: steps.length > 0 && done === steps.length,
    completedAt: done === steps.length && dates.length ? dates.slice().sort().at(-1)! : null,
  }
}
