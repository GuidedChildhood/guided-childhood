// The daily moments a parent can flag at the end of the deck. Shared by the
// deck viewer (the picker tiles) and the daily feedback API (which turns a
// flagged moment into a concerns ledger row, so the label must match here).

export const DAILY_MOMENTS = [
  { key: 'morning', label: 'Morning routine', icon: '☀️' },
  { key: 'teeth', label: 'Teeth brushing', icon: '🦷' },
  { key: 'dressed', label: 'Getting dressed', icon: '👕' },
  { key: 'bag', label: 'School bag', icon: '🎒' },
  { key: 'lunch', label: 'Lunch / packed lunch', icon: '🥪' },
  { key: 'dropoff', label: 'School drop off', icon: '🏫' },
  { key: 'pickup', label: 'School pick up', icon: '🚗' },
  { key: 'snacks', label: 'Snacks and food', icon: '🍎' },
  { key: 'dinner', label: 'Choosing dinner', icon: '🍽️' },
  { key: 'tv_eve', label: 'Evening TV', icon: '📺' },
  { key: 'homework', label: 'Homework', icon: '📚' },
  { key: 'clothes', label: 'Clothes in washing', icon: '🧺' },
  { key: 'fighting', label: 'Sibling fighting', icon: '😤' },
  { key: 'bedtime', label: 'Getting to bed', icon: '🌙' },
  { key: 'sleep', label: 'Staying asleep', icon: '😴' },

  // THE SCREEN MOMENTS. Justin, 11 August 2026: "we should have struggle to
  // come off device, and TV first thing morning, phones in car, at restaurant,
  // walking in street, as moments need to solve."
  //
  // He is right and the omission is glaring now it is named: every tile above
  // this line is a routine that would exist if screens had never been invented.
  // A parent opened the one screen in the product that asks what went wrong
  // today and found teeth brushing, packed lunches and no way to say the
  // handover was a fight. The five below are the actual moments this company
  // exists for.
  { key: 'come_off', label: 'Coming off a device', icon: '🎮' },
  { key: 'tv_morning', label: 'TV first thing', icon: '📺' },
  { key: 'phone_car', label: 'Phones in the car', icon: '🚙' },
  { key: 'phone_out', label: 'Phones when eating out', icon: '🍽️' },
  { key: 'phone_street', label: 'Phones while walking', icon: '🚸' },
] as const

export function dailyMomentLabel(key: string): string | null {
  return DAILY_MOMENTS.find(m => m.key === key)?.label ?? null
}

// The day timeline groups the tagger renders. Keys reference DAILY_MOMENTS,
// which stays the single source of truth for labels and the feedback API.
export type DailyMomentGroup = {
  name: string
  time: string
  keys: readonly string[]
}

export const DAILY_MOMENT_GROUPS: readonly DailyMomentGroup[] = [
  // TV first thing leads the morning, because for a lot of families it is the
  // first thing, before the teeth and the bag and the rest of it.
  { name: 'Morning', time: '7am', keys: ['tv_morning', 'morning', 'teeth', 'dressed', 'bag', 'lunch'] },
  { name: 'School', time: '9am', keys: ['dropoff', 'pickup'] },
  { name: 'After school', time: '3pm', keys: ['come_off', 'snacks', 'homework'] },
  // OUT AND ABOUT is a new part of the day rather than a category, because the
  // car, the restaurant and the pavement are the three places a phone causes
  // trouble and none of them is a time of day. A family can meet all three
  // between four and seven on a Saturday.
  { name: 'Out and about', time: '5pm', keys: ['phone_car', 'phone_out', 'phone_street'] },
  { name: 'Evening', time: '6pm', keys: ['dinner', 'tv_eve', 'clothes', 'fighting'] },
  { name: 'Bed', time: '8pm', keys: ['bedtime', 'sleep'] },
] as const

