// AI module configuration.
// The model is a config value (never hardcoded), the same rule as DIGI_MODEL.
// The refresh job uses it to draft age-appropriate summaries of incoming AI news.
export const AI_UPDATE_MODEL = process.env.AI_UPDATE_MODEL ?? process.env.DIGI_MODEL ?? 'claude-fable-5'

export const AI_UPDATE_MODEL_FALLBACKS = [
  'claude-fable-5',
  'claude-opus-4-8',
  'claude-sonnet-4-6',
] as const

// Which audiences the living updates layer drafts for. Younger children are
// served by the evergreen lessons, not the news feed, so the feed targets
// older children, parents, and teachers by default.
export const AI_UPDATE_AUDIENCES = ['age_13', 'age_16', 'parent', 'teacher'] as const
