// Quest templates parents pick from when setting up the deal. Each is a
// real daily job families already fight about, plus the literacy crafts
// that make screen free time the fun option. Stars are defaults, parents
// adjust per family.
//
// PLAY PAYS BEST, on purpose. The real risk with screens is what they
// crowd out: sleep, movement, real play, boredom that turns into ideas.
// So the deal pays the most stars for exactly those things. Screen time
// earned by outside play is screen time that already did its job.

export type QuestTemplate = {
  title: string
  emoji: string
  stars: number
  schedule: 'daily' | 'weekdays' | 'weekend' | 'once'
  play?: boolean
}

// The family exchange rate: what one star is worth in screen minutes.
// Shown wherever stars appear so the deal is always concrete. Becomes a
// per family setting with the agreement integration.
export const STAR_MINUTES = 5

// Why play pays best, in the parent's language. Shown next to the
// templates so the star values read as a philosophy, not an accident.
export const PLAY_PAYS_WHY =
  'Play pays best on purpose. The research risk with screens is what they crowd out: sleep, movement, real play and the boredom that turns into ideas. So outside and play quests earn the top stars. Screen time earned that way has already done its job.'

// Same idea in kid language, for the quest page.
export const PLAY_PAYS_WHY_KID =
  'Outside and play quests pay the best stars. Screens are brilliant, but your body and brain grow strongest running about, making things and playing for real. That is why out there earns the most in here.'

export const QUEST_TEMPLATES: QuestTemplate[] = [
  // Play and outside first: the top of the pay scale
  { title: 'One hour of outside play',          emoji: '🌳', stars: 4, schedule: 'daily',    play: true },
  { title: 'Bike, scoot or run about',          emoji: '🚲', stars: 3, schedule: 'daily',    play: true },
  { title: 'Build, draw or make something real', emoji: '🎨', stars: 3, schedule: 'daily',   play: true },
  { title: 'Family game played together',       emoji: '🎲', stars: 4, schedule: 'weekend',  play: true },
  { title: 'A whole screen free Saturday morning', emoji: '☀️', stars: 5, schedule: 'weekend', play: true },

  // The daily jobs families already fight about
  { title: 'Shoes away in the hallway',   emoji: '👟', stars: 1, schedule: 'daily' },
  { title: 'Homework out before the TV',  emoji: '📖', stars: 2, schedule: 'weekdays' },
  { title: 'Teeth brushed, no reminders', emoji: '🦷', stars: 1, schedule: 'daily' },
  { title: 'Dressed and ready on time',   emoji: '👕', stars: 1, schedule: 'weekdays' },
  { title: 'School bag packed tonight',   emoji: '🎒', stars: 1, schedule: 'weekdays' },
  { title: 'Twenty minutes of reading',   emoji: '📚', stars: 2, schedule: 'daily' },
  { title: 'Homework before screens',     emoji: '✏️', stars: 2, schedule: 'weekdays' },
  { title: 'Table laid or cleared',       emoji: '🍽️', stars: 1, schedule: 'daily' },
  { title: 'Room tidy before bed',        emoji: '🛏️', stars: 1, schedule: 'daily' },
  { title: 'One kind thing done',         emoji: '💛', stars: 1, schedule: 'daily' },
  { title: 'Device on charge downstairs', emoji: '🔌', stars: 1, schedule: 'daily' },
  { title: 'Screen off first ask',        emoji: '📺', stars: 2, schedule: 'daily' },
  { title: 'Empty or load the dishwasher', emoji: '🫧', stars: 1, schedule: 'daily' },
  { title: 'Help make dinner',            emoji: '🍳', stars: 2, schedule: 'daily' },
  { title: 'Feed or walk the pet',        emoji: '🐾', stars: 1, schedule: 'daily' },
  { title: 'Clean bedroom top to bottom', emoji: '🧹', stars: 3, schedule: 'weekend' },
  { title: 'Put your washing away',       emoji: '🧺', stars: 1, schedule: 'weekdays' },
  { title: 'Help a brother or sister',    emoji: '🤝', stars: 2, schedule: 'daily' },
  { title: 'Spellings or times tables practised', emoji: '✖️', stars: 2, schedule: 'weekdays' },
  { title: 'Ten minutes of instrument practice', emoji: '🎵', stars: 2, schedule: 'daily' },
  { title: 'Bins out without being asked', emoji: '🗑️', stars: 2, schedule: 'once' },
  { title: 'Water the plants',            emoji: '🪴', stars: 1, schedule: 'weekend' },
]

// Starter ideas for the child's own quest asks, in their words. Free
// text sits alongside so any idea can be pitched to the grown up.
export const KID_REQUEST_IDEAS: { title: string; emoji: string }[] = [
  { title: 'Clean my room',            emoji: '🧹' },
  { title: 'Wash the car',             emoji: '🚗' },
  { title: 'Help with dinner',         emoji: '🍳' },
  { title: 'Tidy the garden',          emoji: '🌿' },
  { title: 'Sort my school bag',       emoji: '🎒' },
  { title: 'Read to someone smaller',  emoji: '📚' },
]
