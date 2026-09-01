// The best jobs for each age, in order of most useful.
//
// Justin, 1 September 2026: the best age related jobs should appear in order
// of most useful, super easy to add and send to the child's app. The old
// ideas list was one flat set of thirty with play first, so a parent of a
// four year old was offered Bins out and a parent of a fifteen year old was
// offered Shoes away in the hallway.
//
// Usefulness here means what the job does for the family's day and the
// child's growing up, not what it pays. The routine that removes the morning
// fight comes first, then the habits that keep screens in their place, then
// real help around the house, then the growing up skills, with play in the
// mix because play still pays the top stars on purpose. The ranking follows
// what the developmental literature agrees on: chores from small (the
// Minnesota Rossmann study), independence in age sized steps (Montessori),
// screens out of bedrooms at every age (the sleep evidence), and one real
// meal a week from about eleven.
//
// Titles reuse the library's own wording wherever a matching template
// exists, so the board's dedupe by title still catches them and the time of
// day rules in job-time.ts still read them.

import type { StageKey } from '@/lib/quests/game-picks'
import { AGE_BAND_TO_STAGE } from '@/lib/quests/game-picks'
import type { JobBand } from '@/lib/quests/job-time'

export type JobKind = 'routine' | 'home' | 'school' | 'play' | 'kind' | 'grow'

export type BestJob = {
  title: string
  emoji: string
  stars: number
  schedule: 'daily' | 'weekdays' | 'weekend' | 'once'
  /** The reminder slot. Left out, the words in the title decide (job-time.ts). */
  band?: JobBand
  kind: JobKind
  /** One line, in the parent's language, on why this one earns a star at this age. */
  why: string
}

export const JOB_KINDS: { key: JobKind; label: string }[] = [
  { key: 'routine', label: 'Routine' },
  { key: 'home',    label: 'Home' },
  { key: 'school',  label: 'School' },
  { key: 'play',    label: 'Play' },
  { key: 'kind',    label: 'Kindness' },
  { key: 'grow',    label: 'Growing up' },
]

// The tile tint per kind: the stage pastels and house tints the rest of the
// product already uses, so a tile reads as ours and not as a sticker.
export const KIND_TINT: Record<JobKind, { bg: string; border: string }> = {
  routine: { bg: 'var(--stage-1)', border: 'var(--stage-1-bold)' },
  home:    { bg: 'var(--tint-sage)', border: '#CFE0D8' },
  school:  { bg: 'var(--stage-2)', border: 'var(--stage-2-bold)' },
  play:    { bg: 'var(--stage-3)', border: 'var(--stage-3-bold)' },
  kind:    { bg: 'var(--stage-4)', border: 'var(--stage-4-bold)' },
  grow:    { bg: 'var(--stage-5)', border: 'var(--stage-5-bold)' },
}

export const BEST_JOBS: Record<StageKey, BestJob[]> = {
  foundation: [
    { title: 'Teeth brushed, no reminders',      emoji: '🦷', stars: 1, schedule: 'daily',    band: 'morning',      kind: 'routine', why: 'Twice a day without the nagging. The habit that saves the most mornings.' },
    { title: 'Dressed and ready on time',        emoji: '👕', stars: 1, schedule: 'weekdays', band: 'morning',      kind: 'routine', why: 'Clothes on and out of the door without the fight.' },
    { title: 'Toys tidied before bed',           emoji: '🧸', stars: 1, schedule: 'daily',    band: 'evening',      kind: 'home',    why: 'Their room, their job. Five minutes, then the story.' },
    { title: 'Shoes away in the hallway',        emoji: '👟', stars: 1, schedule: 'daily',    band: 'after_school', kind: 'home',    why: 'One place for shoes, and tomorrow morning finds them.' },
    { title: 'One hour of outside play',         emoji: '🌳', stars: 4, schedule: 'daily',    band: 'after_school', kind: 'play',    why: 'The best thing a small body can do. Pays the top stars on purpose.' },
    { title: 'Table laid or cleared',            emoji: '🍽️', stars: 1, schedule: 'daily',    band: 'after_school', kind: 'home',    why: 'Real help at dinner, and they feel part of it.' },
    { title: 'A book shared for ten minutes',    emoji: '📚', stars: 2, schedule: 'daily',    band: 'evening',      kind: 'school',  why: 'A book with a grown up every day is the whole reading race.' },
    { title: 'Feed or walk the pet',             emoji: '🐾', stars: 1, schedule: 'daily',    band: 'after_school', kind: 'home',    why: 'A living thing that needs them. Responsibility they can feel.' },
    { title: 'Clothes in the basket, not the floor', emoji: '🧺', stars: 1, schedule: 'daily', band: 'evening',     kind: 'home',    why: 'Small and daily. The tidy habit starts here.' },
    { title: 'Finished screen time and handed it back', emoji: '📺', stars: 2, schedule: 'daily', band: 'after_school', kind: 'grow', why: 'Ending screen time without a fight is the skill that matters most at this age.' },
    { title: 'One kind thing done',              emoji: '💛', stars: 1, schedule: 'daily',    band: 'evening',      kind: 'kind',    why: 'Named out loud at bedtime. Kindness that gets noticed grows.' },
    { title: 'Water the plants',                 emoji: '🪴', stars: 1, schedule: 'weekend',  band: 'after_school', kind: 'home',    why: 'A little job that shows care makes things grow.' },
  ],
  builder: [
    { title: 'School bag packed tonight',        emoji: '🎒', stars: 1, schedule: 'weekdays', band: 'evening',      kind: 'routine', why: 'Packed the night before, and the morning has no scramble.' },
    { title: 'Homework before screens',          emoji: '✏️', stars: 2, schedule: 'weekdays', band: 'after_school', kind: 'school',  why: 'The order matters more than the minutes. Work, then play.' },
    { title: 'Device on charge downstairs',      emoji: '🔌', stars: 1, schedule: 'daily',    band: 'evening',      kind: 'grow',    why: 'Screens sleep outside bedrooms. The rule the sleep evidence is loudest about.' },
    { title: 'Dressed and ready on time',        emoji: '👕', stars: 1, schedule: 'weekdays', band: 'morning',      kind: 'routine', why: 'Out of the door on time without a single reminder.' },
    { title: 'Twenty minutes lost in a book',    emoji: '📚', stars: 3, schedule: 'daily',    band: 'after_school', kind: 'school',  why: 'Deep attention practised every day. Pays well on purpose.' },
    { title: 'Empty or load the dishwasher',     emoji: '🫧', stars: 1, schedule: 'daily',    band: 'after_school', kind: 'home',    why: 'A proper job the house needs, not a pretend one.' },
    { title: 'Room tidy before bed',             emoji: '🛏️', stars: 1, schedule: 'daily',    band: 'evening',      kind: 'home',    why: 'Floor clear, clothes away. Five minutes, every night.' },
    { title: 'One hour of outside play',         emoji: '🌳', stars: 4, schedule: 'daily',    band: 'after_school', kind: 'play',    why: 'Movement and mates. Screen time earned outside has already done its job.' },
    { title: 'Put your washing away',            emoji: '🧺', stars: 1, schedule: 'weekdays', band: 'after_school', kind: 'home',    why: 'Their clothes, their drawers. Independence in small folds.' },
    { title: 'Help make dinner',                 emoji: '🍳', stars: 2, schedule: 'daily',    band: 'after_school', kind: 'grow',    why: 'Chopping, stirring, laying out. A cook by twelve starts here.' },
    { title: 'Bike, scoot or run about',         emoji: '🚲', stars: 3, schedule: 'daily',    band: 'after_school', kind: 'play',    why: 'Out of breath once a day. The body grows on it.' },
    { title: 'Spellings or times tables practised', emoji: '✖️', stars: 2, schedule: 'weekdays', band: 'after_school', kind: 'school', why: 'Ten minutes of the boring bit, done before it becomes a battle.' },
    { title: 'Help a brother or sister',         emoji: '🤝', stars: 2, schedule: 'daily',    band: 'after_school', kind: 'kind',    why: 'Reading with them, a game, a hand with shoes. Noticed and paid.' },
    { title: 'Bins out without being asked',     emoji: '🗑️', stars: 2, schedule: 'once',     band: 'evening',      kind: 'home',    why: 'Without being asked is the whole job. Set the day once it is in.' },
  ],
  explorer: [
    { title: 'Device on charge downstairs',      emoji: '🔌', stars: 1, schedule: 'daily',    band: 'evening',      kind: 'grow',    why: 'The single habit that protects sleep at this age.' },
    { title: 'Homework before screens',          emoji: '✏️', stars: 2, schedule: 'weekdays', band: 'after_school', kind: 'school',  why: 'Work first, then the feed. The order is the habit.' },
    { title: 'School bag packed tonight',        emoji: '🎒', stars: 1, schedule: 'weekdays', band: 'evening',      kind: 'routine', why: 'Kit, books, homework, checked the night before.' },
    { title: 'Cook one family meal a week',      emoji: '🍳', stars: 4, schedule: 'weekend',  band: 'after_school', kind: 'grow',    why: 'A real meal, start to finish. The most useful thing they will leave home with.' },
    { title: 'Twenty minutes lost in a book',    emoji: '📚', stars: 3, schedule: 'daily',    band: 'after_school', kind: 'school',  why: 'The deepest screen free attention there is. Pays well on purpose.' },
    { title: 'Own laundry, start to finish',     emoji: '🧺', stars: 3, schedule: 'weekend',  band: 'after_school', kind: 'grow',    why: 'Load, dry, fold, away. Theirs to run every week.' },
    { title: 'An hour outside: bike, run or sport', emoji: '🚲', stars: 3, schedule: 'daily', band: 'after_school', kind: 'play',    why: 'Movement every day, phone left at home.' },
    { title: 'Empty or load the dishwasher',     emoji: '🫧', stars: 1, schedule: 'daily',    band: 'after_school', kind: 'home',    why: 'Daily, expected, no fuss. Part of living here.' },
    { title: 'Tidy the kitchen after dinner',    emoji: '🧽', stars: 2, schedule: 'daily',    band: 'evening',      kind: 'home',    why: 'Surfaces wiped, table cleared. Everyone gets their evening back.' },
    { title: 'Bins out without being asked',     emoji: '🗑️', stars: 2, schedule: 'once',     band: 'evening',      kind: 'home',    why: 'Remembering the day is the job. Set the day once it is in.' },
    { title: 'Ten minutes of instrument practice', emoji: '🎵', stars: 2, schedule: 'daily',  band: 'after_school', kind: 'school',  why: 'Little and often beats an hour on Sunday.' },
    { title: 'Read with a younger sibling',      emoji: '🤝', stars: 2, schedule: 'weekdays', band: 'evening',      kind: 'kind',    why: 'Teaching it is the best way to know it, and it is kind.' },
    { title: 'Plan tomorrow in five minutes',    emoji: '📝', stars: 1, schedule: 'weekdays', band: 'evening',      kind: 'grow',    why: 'Bag, kit, homework, checked tonight. Organisation, practised.' },
  ],
  shaper: [
    { title: 'Phone charged outside the bedroom', emoji: '🔌', stars: 1, schedule: 'daily',   band: 'evening',      kind: 'grow',    why: 'Sleep first. The one rule the research is loudest about for teenagers.' },
    { title: 'Homework done before the phone comes out', emoji: '✏️', stars: 2, schedule: 'weekdays', band: 'after_school', kind: 'school', why: 'The phone waits in another room until the work is done.' },
    { title: 'Cook one family meal a week',      emoji: '🍳', stars: 4, schedule: 'weekend',  band: 'after_school', kind: 'grow',    why: 'Their night on the rota. Plan it, cook it, serve it.' },
    { title: 'Own laundry, start to finish',     emoji: '🧺', stars: 3, schedule: 'weekend',  band: 'after_school', kind: 'grow',    why: 'Nobody else touches their washing. Leaving home ready.' },
    { title: 'Weekly room reset',                emoji: '🧹', stars: 3, schedule: 'weekend',  band: 'after_school', kind: 'home',    why: 'Floor clear, bed changed, bin out. Their space, kept.' },
    { title: 'Thirty minutes of real exercise',  emoji: '🏃', stars: 3, schedule: 'daily',    band: 'after_school', kind: 'play',    why: 'Sport, gym, a run. Body before feed.' },
    { title: 'Screen free hour before bed',      emoji: '🌙', stars: 2, schedule: 'daily',    band: 'evening',      kind: 'grow',    why: 'Shower, book, music. The hour that makes the morning.' },
    { title: 'Tidy the kitchen after dinner',    emoji: '🧽', stars: 2, schedule: 'daily',    band: 'evening',      kind: 'home',    why: 'A grown up job done to a grown up standard.' },
    { title: 'Twenty minutes lost in a book',    emoji: '📚', stars: 3, schedule: 'daily',    band: 'after_school', kind: 'school',  why: 'Reading for pleasure at this age predicts more than most things schools measure.' },
    { title: 'Look after a younger sibling for an hour', emoji: '🤝', stars: 3, schedule: 'weekend', band: 'after_school', kind: 'kind', why: 'Real responsibility, real trust, and worth real stars.' },
    { title: 'Food shop with the list',          emoji: '🛒', stars: 3, schedule: 'weekend',  band: 'after_school', kind: 'grow',    why: 'Budget, list, checkout. The maths that actually matters.' },
    { title: 'Revision block, phone in another room', emoji: '📖', stars: 3, schedule: 'weekdays', band: 'after_school', kind: 'school', why: 'One focused block beats three distracted ones.' },
    { title: 'Walk the dog or run an errand',    emoji: '🐾', stars: 2, schedule: 'daily',    band: 'after_school', kind: 'kind',    why: 'Someone depends on them turning up. Good practice for everything.' },
  ],
  independent: [
    { title: 'Phone charged outside the bedroom', emoji: '🔌', stars: 1, schedule: 'daily',   band: 'evening',      kind: 'grow',    why: 'The habit they will keep or lose for life. Worth a star even now.' },
    { title: 'Cook two family meals a week',     emoji: '🍳', stars: 5, schedule: 'weekdays', band: 'after_school', kind: 'grow',    why: 'Two nights on the rota. Leaving home able to feed themselves and others.' },
    { title: 'Own laundry, start to finish',     emoji: '🧺', stars: 3, schedule: 'weekend',  band: 'after_school', kind: 'grow',    why: 'Theirs entirely. Nobody at university will do it either.' },
    { title: 'Weekly food shop and budget',      emoji: '🛒', stars: 4, schedule: 'weekend',  band: 'after_school', kind: 'grow',    why: 'A budget they set and hit. The money skill that lasts.' },
    { title: 'Revision block, phone in another room', emoji: '📖', stars: 3, schedule: 'weekdays', band: 'after_school', kind: 'school', why: 'Deep work, on purpose, with the phone out of reach.' },
    { title: 'Weekly room and bathroom clean',   emoji: '🧹', stars: 3, schedule: 'weekend',  band: 'after_school', kind: 'home',    why: 'The whole space, bathroom included. Flat ready.' },
    { title: 'Real exercise, their choice',      emoji: '🏋️', stars: 3, schedule: 'daily',    band: 'after_school', kind: 'play',    why: 'Their sport, their schedule, most days of the week.' },
    { title: 'Take a sibling to their club',     emoji: '🚌', stars: 2, schedule: 'once',     band: 'after_school', kind: 'kind',    why: 'Being the one who can be relied on.' },
    { title: 'Car washed or the garden done',    emoji: '🚿', stars: 3, schedule: 'weekend',  band: 'after_school', kind: 'home',    why: 'The jobs a household would otherwise pay for.' },
    { title: 'Screen free hour before bed',      emoji: '🌙', stars: 2, schedule: 'daily',    band: 'evening',      kind: 'grow',    why: 'Sleep is the study aid nobody sells.' },
    { title: 'One piece of life admin sorted',   emoji: '📄', stars: 2, schedule: 'once',     band: 'after_school', kind: 'grow',    why: 'Bank, forms, an appointment, a CV line. One item at a time.' },
    { title: 'Meal plan written for the week',   emoji: '📝', stars: 2, schedule: 'weekend',  band: 'evening',      kind: 'grow',    why: 'Plan first and the shop and the cooking both get easier.' },
  ],
}

/** The stage, and its ranked jobs, for a child's age band. Builder when unknown. */
export function bestJobsFor(ageBand: string | null | undefined): { stage: StageKey; jobs: BestJob[] } {
  const stage: StageKey = AGE_BAND_TO_STAGE[ageBand ?? ''] ?? 'builder'
  return { stage, jobs: BEST_JOBS[stage] }
}

// Which kind a job the family wrote themselves belongs to, read from its
// words, so a used before row gets the same tile tint as everything else.
export function kindForTitle(title: string): JobKind {
  const t = title.toLowerCase()
  if (/teeth|dressed|ready on time|bag packed|shoes on|breakfast|bedtime|pyjama/.test(t)) return 'routine'
  if (/homework|read|book|spelling|times table|practice|practis|revision|instrument|school/.test(t)) return 'school'
  if (/outside|football|bike|scoot|run|play|swim|sport|exercise|dance|walk/.test(t)) return 'play'
  if (/kind|brother|sister|sibling|help a|grandma|grandad|neighbour|errand/.test(t)) return 'kind'
  if (/cook|meal|laundry|budget|shop|charge|screen|phone|device|plan|admin/.test(t)) return 'grow'
  return 'home'
}
