// Where does DiGi's time actually go.
//
// Justin, twice: "DiGi took a little bit long to load answer." The closed loop
// plan parked it with the right instruction, measure before touching it, and
// this is the measuring half.
//
// WHY TIME TO FIRST TOKEN AND NOT TOTAL DURATION. The number a parent feels is
// when the reply starts moving, not when it stops. A reply that takes nine
// seconds to finish but starts in one reads as fast. A reply that appears whole
// after four seconds of nothing reads as slow. Total duration ranks those two
// the wrong way round, so it is the wrong number to optimise against and we do
// not collect it as the headline.
//
// WHY THE PHASES ARE WORTH SEPARATING. app/api/digi/route.ts streams, but the
// stream is opened at line 501 and the response is not returned until line 773,
// so six things happen strictly one after another before a parent sees a
// character: auth, thirteen queries, lane classification, seven more queries,
// prompt assembly, then Anthropic's own first token. Each has a completely
// different fix. An index will not help a slow model and a bigger keyword list
// will not help a slow query. Today we cannot tell them apart, which is the
// only reason this file exists.
//
// THIS FILE MUST NOT COST ANYTHING. Every mark is one number in memory. There
// is no I/O here and nothing in here can throw, because a reply to a worried
// parent must never fail because we were curious about how long it took.

/** The phases, in the order the route runs them. */
export const PHASES = ['auth', 'gather1', 'lane', 'gather2', 'prompt', 'model'] as const
export type Phase = (typeof PHASES)[number]

const LABEL: Record<Phase, string> = {
  auth: 'Auth and user lookup',
  gather1: 'Context round 1 (13 queries)',
  lane: 'Lane classification',
  gather2: 'Context round 2 (7 queries)',
  prompt: 'Prompt assembly',
  model: 'Model, first token',
}

export type Timings = Partial<Record<Phase, number>> & { total?: number }

export interface Timer {
  /** Close off a phase. The duration is the gap since the previous mark. */
  mark(phase: Phase): void
  /** Rounded milliseconds per phase, plus the total to first token. */
  read(): Timings
  /**
   * A `Server-Timing` header value.
   *
   * Chrome DevTools renders this natively under Network then Timing, so the
   * breakdown lands where CLAUDE.md rule 5 already has us looking on every
   * change. No new screen, and readable before migration 149 has a single row
   * in it.
   */
  header(): string
}

export function startTimer(): Timer {
  // performance.now() rather than Date.now(): it is monotonic, so a clock
  // adjustment mid request cannot produce a negative phase.
  const t0 = performance.now()
  let last = t0
  const marks: Timings = {}

  return {
    mark(phase) {
      const now = performance.now()
      marks[phase] = Math.round(now - last)
      last = now
    },
    read() {
      return { ...marks, total: Math.round(last - t0) }
    },
    header() {
      // Only phases that actually ran. A message that never reached the model
      // should show five entries, not a sixth sitting at zero pretending it was
      // instant. Zero and did-not-happen are different answers, and this week
      // has been one long lesson in not conflating them.
      return PHASES
        .filter(p => marks[p] !== undefined)
        .map(p => `${p};dur=${marks[p]};desc="${LABEL[p]}"`)
        .join(', ')
    },
  }
}
