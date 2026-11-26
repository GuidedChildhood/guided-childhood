// The tells that gave the Mumsnet post away (24 November 2026), kept in one
// place so the guard (check-ai-tells.mjs --community) and the meter
// (rhythm.mjs) read the same list. None of these is a banned word; each is a
// sign of a post assembled for a forum rather than written by a parent in one.
// The plan is plans/2026-11-26-community-voice-plan.md.

/** Phrases, matched lower case. Announced honesty, survey shapes, our own tics, product copy. */
export const FORUM_PHRASES = [
  "i'll be upfront", 'i’ll be upfront', 'i will be upfront', "i'll be honest", 'i’ll be honest',
  'to be clear,', 'full disclosure', 'not a company with a marketing team',
  'which is exactly why', 'blunt is good', 'brutal honesty', 'any feedback is welcome',
  'thank you for reading', 'thanks for reading', 'thank you in advance',
  "o'clock on a tuesday", 'o’clock on a tuesday', '6pm on a tuesday', 'six on a tuesday',
  'the words to use tonight', 'a plan for their age', 'what i\'d really value', 'what i’d really value',
]

/** Line shapes that read as a survey or a brochure in a thread. */
export const FORUM_SHAPES = [
  [/^\s*\d+[.)]\s/, 'a numbered list (a forum post asks, it does not survey)'],
  [/^\s*#{1,6}\s/, 'a heading'],
  [/utm_[a-z]+=/i, 'a tracked link (give a domain to type instead)'],
  [/\*\*[^*]+\*\*/, 'bold text'],
]

/** Every forum tell on one line of text, as short labels. */
export function forumTells(line) {
  const low = line.toLowerCase()
  return [
    ...FORUM_PHRASES.filter((p) => low.includes(p)).map((p) => `the phrase "${p}"`),
    ...FORUM_SHAPES.filter(([re]) => re.test(line)).map(([, what]) => what),
  ]
}
