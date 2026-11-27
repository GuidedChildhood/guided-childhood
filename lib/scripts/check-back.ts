// When a script's check back falls due, read from its own words.
//
// The walkthrough on 27 November 2026 found the depth heading said "Check back
// in a few days" over a script whose plan is a two week trial, and that nothing
// on the page brought the parent back when the time came. The check back text
// is a database row, so the timing is read from it rather than stored twice:
// the heading and the "Remind me" button both come from here, and a script
// that says nothing about time gets the old few days.

export type CheckBackTiming = { days: number; phrase: string }

const RULES: { pattern: RegExp; days: number; phrase: string }[] = [
  { pattern: /\b(two weeks|2 weeks|fortnight)\b/i, days: 14, phrase: 'in two weeks' },
  { pattern: /\b(three weeks|3 weeks)\b/i, days: 21, phrase: 'in three weeks' },
  { pattern: /\b(a week|one week|next week|over the next week|seven days|7 days)\b/i, days: 7, phrase: 'in a week' },
]

export function checkBackTiming(text: string | null | undefined): CheckBackTiming {
  const t = text ?? ''
  for (const r of RULES) if (r.pattern.test(t)) return { days: r.days, phrase: r.phrase }
  return { days: 4, phrase: 'in a few days' }
}
