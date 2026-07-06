// Quest templates parents pick from when setting up the deal. Each is a
// real daily job families already fight about, plus the literacy crafts
// that make screen free time the fun option. Stars are defaults, parents
// adjust per family.

export type QuestTemplate = {
  title: string
  emoji: string
  stars: number
  schedule: 'daily' | 'weekdays' | 'weekend' | 'once'
}

// The family exchange rate: what one star is worth in screen minutes.
// Shown wherever stars appear so the deal is always concrete. Becomes a
// per family setting with the agreement integration.
export const STAR_MINUTES = 5

export const QUEST_TEMPLATES: QuestTemplate[] = [
  { title: 'Shoes away in the hallway',   emoji: '👟', stars: 1, schedule: 'daily' },
  { title: 'Homework out before the TV',  emoji: '📖', stars: 2, schedule: 'weekdays' },
  { title: 'Teeth brushed, no reminders', emoji: '🦷', stars: 1, schedule: 'daily' },
  { title: 'Dressed and ready on time',   emoji: '👕', stars: 1, schedule: 'weekdays' },
  { title: 'School bag packed tonight',   emoji: '🎒', stars: 1, schedule: 'weekdays' },
  { title: 'Twenty minutes of reading',   emoji: '📚', stars: 2, schedule: 'daily' },
  { title: 'Homework before screens',     emoji: '✏️', stars: 2, schedule: 'weekdays' },
  { title: 'One hour outside',            emoji: '🌳', stars: 2, schedule: 'weekend' },
  { title: 'Table laid or cleared',       emoji: '🍽️', stars: 1, schedule: 'daily' },
  { title: 'Room tidy before bed',        emoji: '🛏️', stars: 1, schedule: 'daily' },
  { title: 'One kind thing done',         emoji: '💛', stars: 1, schedule: 'daily' },
  { title: 'Device on charge downstairs', emoji: '🔌', stars: 1, schedule: 'daily' },
  { title: 'Screen off first ask',        emoji: '📺', stars: 2, schedule: 'daily' },
  { title: 'Family game played together', emoji: '🎲', stars: 3, schedule: 'weekend' },
]
