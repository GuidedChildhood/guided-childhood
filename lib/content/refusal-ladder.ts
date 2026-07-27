// What to do when a child just keeps saying no.
//
// This is the single most common standoff a busy parent has, and the rehearsal
// used to have no answer for it: it offered three warm validating lines and
// then, if the child kept refusing, offered them again. That is not a gap in
// the copy, it is a gap in the model. Validation is not a lever. It lowers the
// temperature and it is worth doing, but a child who wants the tablet still
// wants the tablet after the third "I hear you", and a parent who has run out
// of empathy and out of road is the parent who caves or shouts.
//
// The research that fixes it is Becky Kennedy's, and the useful part is a
// definition rather than a script:
//
//   "Boundaries are not what we tell kids not to do; boundaries are what we
//    tell kids we WILL do."
//
// A boundary needs no compliance to work. "Turn it off" requires the child to
// act, so it can be refused. "I am going to take the tablet at six" requires
// only the parent to act, so it cannot. That is why the standoff ends: there
// is nothing left to negotiate about. Everything else here follows from it.
//
// The second half is that the goal is not to WIN the conversation. A child who
// is still furious but heard, with the rule intact, is a success. Becky's
// framing is that two things are true at once: the boundary holds AND their
// anger is allowed. And a hard moment gets repaired afterwards, not avoided:
// repairing a rupture builds more credibility than never having one.
//
// Sources, and worth reading rather than taking our word for it:
// - https://www.cnn.com/2022/11/04/health/how-to-resolve-conflict-parenting-wellness/index.html
// - https://tim.blog/2024/12/31/dr-becky-kennedy-good-inside-transcript/
// - https://www.ted.com/pages/how-to-repair-any-relationship-w-master-fixer-dr.-becky-transcript

/** How many validating turns before the standoff needs a different move.
 *  Three is the number parents recognise, and past it repetition starts to
 *  read as a parent who has no answer, which is worse than none. */
export const VALIDATE_TURNS = 3

export type LadderStep = 'connect' | 'boundary' | 'close'

export function ladderStep(parentTurns: number): LadderStep {
  if (parentTurns < VALIDATE_TURNS) return 'connect'
  if (parentTurns < VALIDATE_TURNS + 2) return 'boundary'
  return 'close'
}

/** DiGi's one line about why the move is changing, shown above the chips. */
export const STEP_NOTE: Record<LadderStep, string> = {
  connect:
    'Start by naming what they feel. It does not end the standoff and it is not meant to, it lowers the temperature so the next bit can land.',
  boundary:
    'Three goes at hearing them is enough. More would just read as having no answer. Now say what YOU will do, not what they must do. A boundary you can keep on your own cannot be refused.',
  close:
    'This is where it ends, not where you win it. Say it once, stay warm, and let them be furious. A child who is upset but heard, with the rule still standing, is the good outcome.',
}

/**
 * The boundary lines: every one is something the parent does, so none of them
 * needs the child to agree for the moment to be over.
 */
export const BOUNDARY_LINES = [
  'I have decided, and I am not going to change my mind on this one. You can be cross with me about it.',
  'I am going to come and take it at six. You do not have to like it, and you do not have to hand it over.',
  'I am not going to argue about this any more. I am still here, and the answer is still no.',
] as const

/** Closing lines: end it warmly, and name that it gets picked up later. */
export const CLOSE_LINES = [
  'I can see you are really angry. That is allowed. I am going to go and start tea, and I am not cross with you.',
  'We are both a bit worn out with this one. Let us leave it and talk about it properly tomorrow.',
  'You do not have to be happy about it. I still love you, and it is still a no.',
] as const

/** What the parent takes away, once the rehearsal is over. */
export const AFTER_THE_STANDOFF = {
  heading: 'What to do after one of these',
  points: [
    {
      title: 'Repair before you explain',
      body: 'Come back when you are both calm and say the simple version: that got hard, I did not love how loud it got, I still meant the answer. Repairing a rough moment builds more trust than never having one.',
    },
    {
      title: 'Check in tomorrow, not tonight',
      body: 'Nothing useful is learned by a flooded child or a worn out parent. The follow up is the next day, when the same conversation costs almost nothing.',
    },
    {
      title: 'Refusals fall when the rule is not news',
      body: 'Most standoffs are really surprise. A rule written down and agreed in advance, on the fridge and in their app, is a rule you point at rather than one you have to win from scratch every time.',
    },
  ],
} as const
