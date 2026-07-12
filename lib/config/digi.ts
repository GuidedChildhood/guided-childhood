// DiGi model — config value, never hardcoded, never blocks launch
// Set DIGI_MODEL in env. Priority: claude-fable-5 → claude-opus-4-8 → claude-sonnet-5
export const DIGI_MODEL = process.env.DIGI_MODEL ?? 'claude-fable-5'

export const DIGI_MODEL_FALLBACKS = [
  'claude-fable-5',
  'claude-opus-4-8',
  'claude-sonnet-5',
] as const

// The fast tier for mechanical jobs: memory extraction, feedback
// classification, prompt chips, moment copy. The deep model's judgement
// is wasted there; latency and cost are not. Config value, never hardcoded.
export const DIGI_MODEL_FAST = process.env.DIGI_MODEL_FAST ?? 'claude-haiku-4-5-20251001'

export type DigiTask =
  | 'chat' | 'rescue' | 'rehearse' | 'expand' | 'onboarding'
  | 'verify' | 'grade' | 'wisdom' | 'insights'
  | 'extract' | 'feedback' | 'prompts' | 'moment'

const FAST_TASKS = new Set<DigiTask>(['extract', 'feedback', 'prompts', 'moment'])

// The model router (DiGi intelligence step 8): one place decides which
// model answers which job. Parent facing words and safety judgement get
// the deep model, mechanical jobs start on the fast tier, and every task
// keeps the full fallback ladder behind its first choice.
export function digiModelsFor(task: DigiTask): string[] {
  const ladder = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  if (!FAST_TASKS.has(task)) return ladder
  return [DIGI_MODEL_FAST, ...ladder.filter(m => m !== DIGI_MODEL_FAST)]
}
