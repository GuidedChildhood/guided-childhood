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
] as const

export function dailyMomentLabel(key: string): string | null {
  return DAILY_MOMENTS.find(m => m.key === key)?.label ?? null
}
