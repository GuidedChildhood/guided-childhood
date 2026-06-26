// DiGi model — config value, never hardcoded, never blocks launch
// Set DIGI_MODEL in env. Priority: claude-fable-5 → claude-opus-4-8 → claude-sonnet-4-6
export const DIGI_MODEL = process.env.DIGI_MODEL ?? 'claude-fable-5'

export const DIGI_MODEL_FALLBACKS = [
  'claude-fable-5',
  'claude-opus-4-8',
  'claude-sonnet-4-6',
] as const
