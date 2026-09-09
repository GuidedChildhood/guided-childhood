// WHICH PASSPORT PAGE A SCHOOL LESSON FILLS.
//
// Every one of the 21 school modules already tells the parent, in its own
// parent note, that "today filled a little of your child's passport page" and
// that "each stage ends with a stamp that is earned, never just a birthday
// reached". That promise has been going home since the scheme launched and
// nothing recorded which page or which stamp. The council's passport check
// scored 0 out of 10 for exactly this.
//
// This is the first half of closing it: the lesson knows what it earns.
// Awarding a stamp to a child stays with the passport codes lane, which owns
// public.stage_passports and the codes (plans/week-of-2026-08-31-white-rose-
// passport-curriculum-plan.md, "Nothing in this plan writes a completion, a
// stamp or a code"). Nothing here writes one either.
//
// THE STAMP BELONGS TO THE STAGE, NOT THE LESSON. The parent note says a stage
// ends with a stamp, so a stamp per lesson would contradict the thing we have
// been telling families. A lesson fills a page; finishing the pages earns the
// Planet Friend. That also means the stamp is named once here rather than
// copied onto nineteen module rows where it could drift.

export type PassportStage = 'foundation' | 'builder' | 'explorer' | 'shaper' | 'independent'

// The stage vocabulary is the parents app's own (lib/stickers/book.ts) and the
// key stage mapping is shared/curriculum-badges.ts. Reusing both rather than
// inventing a school side set is the point: one passport, two products.
export const PASSPORT_STAGES: Record<PassportStage, { stamp: string; keyStage: string; page: string }> = {
  foundation:  { stamp: 'Pebble', keyStage: 'KS1',   page: 'First steps' },
  builder:     { stamp: 'Bloop',  keyStage: 'KS2',   page: 'Good habits' },
  explorer:    { stamp: 'Orbit',  keyStage: 'KS2/3', page: 'Asking questions' },
  shaper:      { stamp: 'Orbit',  keyStage: 'KS3',   page: 'Making choices' },
  independent: { stamp: 'Nova',   keyStage: 'KS4',   page: 'Ready at sixteen' },
}

// A module either fills a page or sits after the passport is finished. Both are
// answers; only silence is a gap.
export type PassportPlacement = PassportStage | 'after'

// FROM THE ONLY AGE SIGNAL A MODULE ACTUALLY CARRIES, which is its key stage.
//
// Two honest imprecisions, written down rather than smoothed over:
//
// EYFS takes `foundation` even though that stage is labelled KS1. Reception
// sits just under it, Pebble carries both, and the alternative is inventing a
// sixth stage for one module and putting a stamp in the passport that the
// parents app has never heard of.
//
// KS3 all takes `shaper`, so `explorer` goes unused by the school scheme.
// Explorer straddles ages 11 to 13, which is Years 7 and 8, but every KS3
// module records its year band as "Years 7 to 9". Splitting them would mean
// guessing which lessons a Year 7 meets first, and a guess in the passport is
// worse than a stage nobody uses yet.
//
// KS5 fills nothing. The passport is the journey TO sixteen and Years 12 and 13
// are past it. That is the design, not a hole: a check that demanded all 21
// modules name a stage would push somebody into inventing a page for a child
// who has already finished the book.
export const PLACEMENT_BY_KEY_STAGE: Record<string, PassportPlacement> = {
  EYFS: 'foundation',
  KS1:  'foundation',
  KS2:  'builder',
  KS3:  'shaper',
  KS4:  'independent',
  KS5:  'after',
}

export const stampFor = (p: PassportPlacement): string | null =>
  p === 'after' ? null : PASSPORT_STAGES[p].stamp
