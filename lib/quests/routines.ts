// Routines: ready made bundles of quests a parent adds in one tap, for the
// moments of the week families already run on autopilot. A routine is just a
// named set of the same quests the templates offer, grouped so the whole
// school morning or bedtime wind down lands at once instead of one job at a
// time. Adding a routine creates each of its quests for the child; anything
// already set is skipped, so tapping twice never doubles up.
//
// Schedules use the existing quest values (daily, weekdays, weekend, once).
// Richer shapes, three times a week, specific days, a holiday device rule,
// are planned in routines-and-sunday-review.md, not built here.

export type RoutineTask = {
  title: string
  emoji: string
  stars: number
  schedule: 'daily' | 'weekdays' | 'weekend' | 'once'
}

export type RoutinePack = {
  key: string
  name: string
  emoji: string
  blurb: string
  tasks: RoutineTask[]
}

export const ROUTINE_PACKS: RoutinePack[] = [
  {
    key: 'school-morning',
    name: 'School morning',
    emoji: '🌅',
    blurb: 'Out the door on time, no nagging. Lands every school day.',
    tasks: [
      { title: 'Teeth brushed, no reminders', emoji: '🦷', stars: 1, schedule: 'weekdays' },
      { title: 'Dressed and ready on time', emoji: '👕', stars: 1, schedule: 'weekdays' },
      { title: 'Breakfast eaten and cleared', emoji: '🥣', stars: 1, schedule: 'weekdays' },
      { title: 'School bag packed', emoji: '🎒', stars: 1, schedule: 'weekdays' },
      { title: 'Shoes on and by the door', emoji: '👟', stars: 1, schedule: 'weekdays' },
    ],
  },
  {
    key: 'after-school',
    name: 'After school',
    emoji: '🎒',
    blurb: 'Homework and reading before the screen goes on.',
    tasks: [
      { title: 'Homework before screens', emoji: '✏️', stars: 2, schedule: 'weekdays' },
      { title: 'Twenty minutes of reading', emoji: '📚', stars: 2, schedule: 'weekdays' },
      { title: 'Lunchbox emptied', emoji: '🍱', stars: 1, schedule: 'weekdays' },
      { title: 'One kind thing done', emoji: '💛', stars: 1, schedule: 'weekdays' },
    ],
  },
  {
    key: 'dinner',
    name: 'Dinner helper',
    emoji: '🍽️',
    blurb: 'Everyone pitches in around the meal.',
    tasks: [
      { title: 'Help make dinner', emoji: '🍳', stars: 2, schedule: 'daily' },
      { title: 'Table laid or cleared', emoji: '🍽️', stars: 1, schedule: 'daily' },
      { title: 'Load or empty the dishwasher', emoji: '🫧', stars: 1, schedule: 'daily' },
    ],
  },
  {
    key: 'bedtime',
    name: 'Bedtime wind down',
    emoji: '🌙',
    blurb: 'A calm end to the day, screens off and downstairs.',
    tasks: [
      { title: 'Room tidy before bed', emoji: '🛏️', stars: 1, schedule: 'daily' },
      { title: 'Reading at night', emoji: '📖', stars: 2, schedule: 'daily' },
      { title: 'Teeth brushed for bed', emoji: '🦷', stars: 1, schedule: 'daily' },
      { title: 'Device on charge downstairs', emoji: '🔌', stars: 1, schedule: 'daily' },
    ],
  },
  {
    key: 'weekend-reset',
    name: 'Weekend reset',
    emoji: '🧹',
    blurb: 'A bigger tidy and some real play, Saturday and Sunday.',
    tasks: [
      { title: 'Clean bedroom top to bottom', emoji: '🧹', stars: 3, schedule: 'weekend' },
      { title: 'Put your washing away', emoji: '🧺', stars: 1, schedule: 'weekend' },
      { title: 'Water the plants', emoji: '🪴', stars: 1, schedule: 'weekend' },
      { title: 'Family game played together', emoji: '🎲', stars: 4, schedule: 'weekend' },
    ],
  },
  {
    key: 'holiday',
    name: 'Holiday days',
    emoji: '☀️',
    blurb: 'A gentler holiday shape: more play, a little structure, the morning screen time earned.',
    tasks: [
      { title: 'One hour of outside play', emoji: '🌳', stars: 4, schedule: 'daily' },
      { title: 'Build, draw or make something real', emoji: '🎨', stars: 3, schedule: 'daily' },
      { title: 'Help with a meal', emoji: '🍳', stars: 2, schedule: 'daily' },
      { title: 'Twenty minutes of reading', emoji: '📚', stars: 2, schedule: 'daily' },
      { title: 'One kind thing done', emoji: '💛', stars: 1, schedule: 'daily' },
    ],
  },
]
