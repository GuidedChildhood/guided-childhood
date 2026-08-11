import type { LessonSlide } from '@gc/shared/lesson-slides'

// What a generated tutor lesson has to be before a child can be shown it.
//
// This lives here rather than inside the route for one reason: it is the whole
// safety argument for letting a model write a lesson for somebody's nine year
// old, and an argument that can only be tested by calling Anthropic and paying
// for it is an argument nobody tests. Every rule below is a pure function of a
// parsed JSON object, so scripts/check-tutor-deck.mjs can throw the bad cases
// at it in a tenth of a second.
//
// The rules, in the order they matter:
//
//  1. NO DEFICIT LANGUAGE. A child sent a lesson because a grown up cares. If
//     it reads as "you are behind", the child learns that being honest about
//     what they found hard gets them extra work, and the flag on the practice
//     sheet is the entire mechanism this product runs on.
//  2. NO DASHES. The house rule, everywhere, always.
//  3. TWO GRADEABLE QUESTIONS. The player computes its 70 percent pass from
//     choice slides. A deck without them passes on being tapped through, and a
//     lesson that cannot be got wrong has checked nothing.
//  4. SIX SLIDE TYPES. The contract has fifteen and several are traps: `stat`
//     wants a real figure with a real source, `video` wants a URL that exists,
//     `scenario` is a fabricated social post. A tutor lesson needs none of them
//     and a model would invent all three.

// The six shapes a tutor lesson is allowed to be made of.
export const ALLOWED_TYPES = new Set(['title', 'concept', 'tryit', 'choice', 'recap', 'digi'])

// Words that must never reach a child about their own learning. Asked for in
// the prompt and enforced here, because "please do not" is not a guarantee.
export const DEFICIT = /\b(tricky|struggl\w*|behind|weak\w*|poor|failing|bad at|catch(ing)? up|remedial)\b/i

const noDash = (v: string) => v.replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim()

// Dashes out of every string at any depth, in one pass, so one cannot hide in
// an option's feedback line.
export function scrub(value: unknown): unknown {
  if (typeof value === 'string') return noDash(value)
  if (Array.isArray(value)) return value.map(scrub)
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = scrub(v)
    return out
  }
  return value
}

// A choice slide the player can actually grade: two or more options, exactly
// one of them right.
export function gradeable(slide: LessonSlide): boolean {
  if (slide.type !== 'choice') return false
  const options = Array.isArray(slide.options) ? slide.options : []
  if (options.length < 2) return false
  return options.filter(o => o && o.correct === true).length === 1
}

export type DeckResult =
  | { ok: true; slides: LessonSlide[] }
  | { ok: false; reason: 'empty' | 'thin' | 'deficit' }

export function validateDeck(rawSlides: unknown): DeckResult {
  const scrubbed = scrub(rawSlides)
  const shortlist = Array.isArray(scrubbed)
    ? scrubbed.filter(s => s && typeof s === 'object' && ALLOWED_TYPES.has((s as { type?: string }).type ?? ''))
    : []
  // This IS the contract's parse for our purposes. parseSlides keeps objects
  // whose type is one of the fifteen and drops the rest, and our six are a
  // subset of those fifteen, so the filter above has already done its work and
  // all that is left is the empty case. Written out rather than called so that
  // this file imports no value from @gc/shared and can therefore be run
  // straight from a check script, which is the only reason the guarantees in it
  // get tested at all. LessonSlide is imported as a type and erases to nothing.
  const slides = shortlist.length > 0 ? (shortlist as LessonSlide[]) : null
  if (!slides) return { ok: false, reason: 'empty' }
  if (slides.filter(gradeable).length < 2) return { ok: false, reason: 'thin' }
  // Over everything a child will read, including the feedback on a wrong answer,
  // which is exactly where a well meaning model puts "do not worry if you found
  // this tricky".
  if (DEFICIT.test(JSON.stringify(slides))) return { ok: false, reason: 'deficit' }
  return { ok: true, slides }
}

// What to tell the parent when a deck does not pass. Never the machine reason:
// a parent reading "deficit" learns nothing, and all three are fixed the same
// way, by asking for another one.
export const DECK_FAILURE_MESSAGE: Record<'empty' | 'thin' | 'deficit', string> = {
  empty: 'DiGi came back with an empty one. Have another go.',
  thin: 'DiGi wrote that one a bit thin. Have another go.',
  deficit: 'DiGi wrote that one in the wrong tone. Have another go.',
}
