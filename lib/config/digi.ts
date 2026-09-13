// DiGi's models. Config values, never hardcoded, never block launch.
//
// Two tiers answer two different kinds of waiting.
//
// THE CHAT TIER answers a parent who is standing in a kitchen at bedtime
// watching the screen. What matters there is the first word arriving fast and
// the whole answer still being right. It runs at lower effort for that.
//
// THE DEEP TIER does the thinking nobody is waiting on: the weekly review, the
// insights, the wisdom pass, the safety verifier, the evals.
//
// Both default to Claude Fable 5.1. Justin, 13 September 2026: "make sure DiGi
// uses 5.1." The brief had argued for Opus 5 on chat, because Fable thinks on
// every request and cannot be told not to; the effort setting is what keeps
// that honest for a parent who is waiting, and digi_latency.model_ms will say
// whether it is enough. DIGI_MODEL_CHAT=claude-opus-5 is the one line back,
// and the only tier that can then be put into fast mode (below).
//
// Sunday 13 September 2026: the ladder had fallen a generation behind
// (claude-fable-5, opus-4-8, a date suffixed haiku). Every id is checked
// against the Models API by scripts/check-digi-model.mjs.
// A blank value in Vercel is unset, not a model called nothing.
function envOr(name: string, fallback: string): string {
  const v = (process.env[name] ?? '').trim()
  return v || fallback
}

export const DIGI_MODEL = envOr('DIGI_MODEL', 'claude-fable-5-1')

export const DIGI_MODEL_FALLBACKS = [
  'claude-fable-5-1',
  'claude-opus-5',
  'claude-sonnet-5',
] as const

// The model that answers a parent in the chat. Its own setting so the two
// tiers can be split again without a deploy; the ladder behind it is the same.
export const DIGI_MODEL_CHAT = envOr('DIGI_MODEL_CHAT', 'claude-fable-5-1')

// The fast tier for mechanical jobs: memory extraction, feedback
// classification, prompt chips, moment copy, the lane classifier. The deep
// model's judgement is wasted there; latency and cost are not.
export const DIGI_MODEL_FAST = envOr('DIGI_MODEL_FAST', 'claude-haiku-4-5')

export type DigiTask =
  | 'chat' | 'rescue' | 'rehearse' | 'expand' | 'onboarding'
  | 'verify' | 'grade' | 'wisdom' | 'insights'
  | 'extract' | 'feedback' | 'prompts' | 'moment'

const FAST_TASKS = new Set<DigiTask>(['extract', 'feedback', 'prompts', 'moment', 'grade'])

// The jobs where a person is watching the reply arrive.
const CHAT_TASKS = new Set<DigiTask>(['chat', 'rescue', 'rehearse', 'expand', 'onboarding'])

// The model router (DiGi intelligence step 8): one place decides which
// model answers which job. Parent facing words and safety judgement get
// the deep model, mechanical jobs start on the fast tier, and every task
// keeps the full fallback ladder behind its first choice.
export function digiModelsFor(task: DigiTask): string[] {
  const ladder = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  if (FAST_TASKS.has(task)) return [DIGI_MODEL_FAST, ...ladder.filter(m => m !== DIGI_MODEL_FAST)]
  if (CHAT_TASKS.has(task)) return [DIGI_MODEL_CHAT, ...ladder.filter(m => m !== DIGI_MODEL_CHAT)]
  return ladder
}

// ── EFFORT ───────────────────────────────────────────────────────────────────
//
// How hard the model thinks before it speaks. The API default is high, and
// until 13 September 2026 nothing in this codebase set it, so every call on
// the platform ran at the deepest setting including the one a parent waits
// for. On the chat tier it is the single biggest lever on time to first word,
// and it is free.
//
// Deep and mechanical jobs are deliberately left on the API default: a weekly
// review nobody is waiting for should think as hard as it likes.
export type DigiEffort = 'low' | 'medium' | 'high' | 'xhigh' | 'max'
const EFFORTS: ReadonlySet<string> = new Set(['low', 'medium', 'high', 'xhigh', 'max'])

function parseEffort(raw: string | undefined, fallback: DigiEffort): DigiEffort {
  const v = (raw ?? '').trim().toLowerCase()
  return EFFORTS.has(v) ? (v as DigiEffort) : fallback
}

export const DIGI_CHAT_EFFORT: DigiEffort = parseEffort(process.env.DIGI_CHAT_EFFORT, 'medium')

// Haiku 4.5 rejects the effort parameter outright, so it must never be sent
// to the fast tier. Judged on the model actually being called, not the task,
// because the ladder can hand a chat task to any model in it.
export function supportsEffort(model: string): boolean {
  return !/haiku/i.test(model)
}

export function digiEffortFor(task: DigiTask, model: string): DigiEffort | null {
  if (!supportsEffort(model)) return null
  if (CHAT_TASKS.has(task)) return DIGI_CHAT_EFFORT
  return null
}

// ── FAST MODE ────────────────────────────────────────────────────────────────
//
// Up to two and a half times the output speed on the same model, at a premium
// price, and only on Claude Opus 5 and Opus 4.8. Off unless DIGI_FAST_MODE is
// set, because it is a pricing decision. Judged per model so that a fallback
// to Sonnet inside the ladder never sends the flag somewhere it errors.
export const DIGI_FAST_MODE = /^(1|true|on|yes)$/i.test((process.env.DIGI_FAST_MODE ?? '').trim())
export const FAST_MODE_BETA = 'fast-mode-2026-02-01'

export function supportsFastMode(model: string): boolean {
  return /^claude-opus-(5|4-8)(\b|$)/.test(model)
}

export function fastModeFor(model: string): boolean {
  return DIGI_FAST_MODE && supportsFastMode(model)
}

// ── STEPPING IN UNASKED ──────────────────────────────────────────────────────
//
// Justin, 13 September 2026, approving the recommendation: DiGi may step in
// unasked at most twice a week, and never two days running. A number he can
// change, so it is config. The rule itself is code, never prompt: the reader
// (lib/digi/moment.ts) checks it BEFORE any model call, so a family cannot be
// interrupted more often than this however keen the model is.
//
// Zero turns stepping in off without touching the reader.
export const DIGI_STEP_IN_PER_WEEK: number = (() => {
  const n = Number.parseInt(envOr('DIGI_STEP_IN_PER_WEEK', '2'), 10)
  return Number.isFinite(n) ? Math.min(7, Math.max(0, n)) : 2
})()

/** A calendar date in the UK, the only clock a family lives on. */
export function ukDate(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: 'Europe/London' })
}

export type StepInVerdict = { ok: true } | { ok: false; reason: 'off' | 'cap' | 'consecutive' }

/**
 * May DiGi step in today, given when it last did.
 *
 * `recent` is every time DiGi stepped in, as ISO timestamps, newest or oldest
 * first, it does not matter. Two rules, both about the family's calendar:
 *
 *   cap          no more than DIGI_STEP_IN_PER_WEEK in the last seven days
 *   consecutive  never on a UK date that is today or yesterday of a step in
 */
export function stepInAllowed(recent: string[], now: Date = new Date(), cap: number = DIGI_STEP_IN_PER_WEEK): StepInVerdict {
  if (cap <= 0) return { ok: false, reason: 'off' }
  const weekAgo = now.getTime() - 7 * 86_400_000
  const stamps = recent
    .map(s => new Date(s))
    .filter(d => Number.isFinite(d.getTime()))
  const inWeek = stamps.filter(d => d.getTime() >= weekAgo && d.getTime() <= now.getTime()).length
  if (inWeek >= cap) return { ok: false, reason: 'cap' }
  const today = ukDate(now)
  const yesterday = ukDate(new Date(now.getTime() - 86_400_000))
  if (stamps.some(d => { const day = ukDate(d); return day === today || day === yesterday })) {
    return { ok: false, reason: 'consecutive' }
  }
  return { ok: true }
}
