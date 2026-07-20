// Curriculum badges for the family lessons: the Key Stage a stage sits in,
// and the Education for a Connected World strand a lesson category maps to.
// Honest mapping only, derived from what the lesson already is; nothing here
// claims the family lessons are the school curriculum. The real academic
// depth is the school tier (schools/01, docs/09); these chips are the
// signpost that the family version walks the same recognised ground.

// Key Stage from the stage the lesson belongs to. Explorer straddles the
// KS2 to KS3 border (ages 11 to 13), so it says so rather than rounding up.
const KEY_STAGE: Record<string, string> = {
  foundation:  'KS1',
  builder:     'KS2',
  explorer:    'KS2/3',
  shaper:      'KS3',
  independent: 'KS4',
}

// Education for a Connected World strand from the lesson category. One
// strand per category, the closest fit, never a stretch.
const STRAND: Record<string, string> = {
  safety:        'Online relationships',
  online_risks:  'Privacy and security',
  screen_habits: 'Health, wellbeing and lifestyle',
  wellbeing:     'Health, wellbeing and lifestyle',
  ai_safety:     'Managing online information',
  ai_literacy:   'Managing online information',
  misinformation:'Managing online information',
  identity:      'Self image and identity',
  social:        'Self image and identity',
}

export type CurriculumBadges = {
  keyStage: string | null
  strand: string | null
}

export function keyStageFor(stageId: string | null | undefined): string | null {
  if (!stageId) return null
  return KEY_STAGE[stageId] ?? null
}

export function strandFor(category: string | null | undefined): string | null {
  if (!category) return null
  return STRAND[category] ?? null
}

export function badgesFor(stageId: string | null | undefined, category: string | null | undefined): CurriculumBadges {
  return { keyStage: keyStageFor(stageId), strand: strandFor(category) }
}
