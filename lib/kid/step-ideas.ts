import type { StepKey } from '@/lib/kid/five-a-day'

// What a self tick step actually asks for, said in things a child can picture.
//
// Justin, 9 August 2026: "something kind just flashed off as soon as clicked so
// we need to make this really work."
//
// A step with no href had one behaviour: tap and it was done. The row was
// dressed as a link, chevron and all, so a child tapped it expecting to be
// taken somewhere and instead silently ticked off a thing they had not done.
// Nothing asked, nothing offered, no way back.
//
// The half that was missing is this file. "Something kind" is a lovely row and
// a useless instruction: a child who wants to do it still has to think of one,
// standing in a kitchen, at the exact moment their attention is at its worst. So
// the sheet the row now opens leads with ideas, and the confirm sits under them.
//
// ── The rule for what goes in this list ──────────────────────────────────────
//
// Costs nothing, needs no adult to set it up, and can be done in the next ten
// minutes in an ordinary house. An idea that needs a trip to the shop is an idea
// a child reads, cannot do, and closes the sheet on.
//
// Kindness that is aimed at a person in the house leads, because that is the
// version that gets noticed and said thank you for, which is the whole loop.

export type StepIdeas = {
  /** The question the sheet asks, in the child's register. */
  ask: string
  /** Concrete things they could do. Chosen or ignored, never required. */
  ideas: string[]
  /** What the confirm button says. */
  confirm: string
}

export const STEP_IDEAS: Partial<Record<StepKey, StepIdeas>> = {
  kind: {
    ask: 'What kind thing could you do?',
    ideas: [
      'Make someone a drink',
      'Say one nice true thing to someone',
      'Do a job that is not yours',
      'Draw someone a picture',
      'Let someone else pick first',
      'Help someone smaller with something hard',
      'Tidy something you did not mess up',
      'Ring or message a grandparent',
    ],
    confirm: 'I did it',
  },
  tidy: {
    ask: 'What are you going to sort out?',
    ideas: ['Floor clear', 'Bed made', 'Clothes away', 'Rubbish out', 'Desk or table cleared'],
    confirm: 'My room is done',
  },
  make: {
    ask: 'What are you going to make?',
    ideas: ['Draw something', 'Build something', 'Bake something', 'Write a story', 'Fold or sew something', 'Make something out of a box'],
    confirm: 'I made it',
  },
  maths: {
    ask: 'Ten minutes of numbers. Which one?',
    ideas: ['Times tables out loud', 'Counting change', 'Number puzzles', 'Halving and doubling', 'Telling the time'],
    confirm: 'I did my ten minutes',
  },
  talk: {
    // Both ways round on purpose. A child who only ever answers questions about
    // their day learns that the check in is an inspection.
    ask: 'Ask about their day first, then tell them yours.',
    ideas: ['What was the best bit of your day?', 'What was the worst bit?', 'Was anything funny?', 'Is anything worrying you?'],
    confirm: 'We talked',
  },
  grownup_break: {
    ask: 'Ask for thirty minutes with the phones down.',
    ideas: ['Play a game', 'Go for a walk', 'Cook something together', 'Read in the same room', 'Just talk'],
    confirm: 'We did it',
  },
  reading: {
    ask: 'What did you read?',
    ideas: ['A book', 'A comic', 'A magazine', 'Something you read to someone smaller', 'Something someone read with you'],
    confirm: 'I read it',
  },
}

/** The ideas for a step, or null when it has none written yet. */
export function ideasFor(step: StepKey): StepIdeas | null {
  return STEP_IDEAS[step] ?? null
}
