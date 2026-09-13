// The parent's own milestones, said on the day done screen and in the week.
//
// The child earns Planet Friends at 2, 10, 22, 38 and 58 days
// (lib/pathway/streak-unlock.ts). The parent earned a number and nothing was
// ever said about it. Duolingo names the perfect week and the round numbers;
// so do we, in words, with no loss language, because the point of naming a
// milestone is that it was reached, never that it could be dropped.

export type ParentMilestone = { days: number; title: string; line: string }

export const PARENT_MILESTONES: ParentMilestone[] = [
  { days: 7, title: 'A perfect week', line: 'Seven days in a row. That is the habit, and your child felt every one of them.' },
  { days: 14, title: 'Two weeks straight', line: 'Fourteen days. Most of what a family changes about screens happens in the first fortnight of showing up.' },
  { days: 30, title: 'A whole month', line: 'Thirty days in a row. This is no longer something you are trying, it is something you do.' },
  { days: 50, title: 'Fifty days', line: 'Fifty days. The words for the arguments are yours now, not ours.' },
  { days: 100, title: 'One hundred days', line: 'A hundred days in a row. Very few parents anywhere have done this, and your child has a hundred calmer evenings to show for it.' },
]

/** The milestone reached exactly today, or null. */
export function milestoneFor(streakCount: number): ParentMilestone | null {
  return PARENT_MILESTONES.find(m => m.days === streakCount) ?? null
}

/** The next milestone ahead, for the week's roundup. */
export function nextMilestone(streakCount: number): ParentMilestone | null {
  return PARENT_MILESTONES.find(m => m.days > streakCount) ?? null
}
