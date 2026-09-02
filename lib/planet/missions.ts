import type { MissionDef, RewardKey, Tier } from './logic'

// Planet Friends: the missions, as data (design section 3.2). A mission is a
// real world thing done with a grown up, proved by time, by a grown up's tap,
// by a code found outside, or by a lesson passed on the child's own link.
// Every reward is named on the card before the mission starts: found
// offline, never found by chance. Missions pay on the planet only, never
// stars (Justin, 2 September 2026). No dashes in any line.

export type Mission = MissionDef & {
  title: string
  emoji: string
  /** Three lines at most, child reading level. */
  steps: string[]
  together: 'required' | 'invited'
  /** The reward in the child's words, on the card. */
  rewardLabel: string
  /** For a grown up's tap: the line the parent reads in the pop up, after the child's name. */
  askLine: string
  /** The one thing to talk about, for the grown up. */
  grownupLine: string
}

export const MISSIONS: Mission[] = [
  {
    key: 'plant_seed', title: 'Plant a real seed', emoji: '🌱', tiers: [1, 2, 3],
    proof: 'grownup_tap', together: 'required', reward: 'dome', rewardLabel: 'A little garden dome',
    steps: ['Find a pot and some soil.', 'Push a seed in with your finger.', 'Give it a little water.'],
    askLine: 'says you planted a real seed together.',
    grownupLine: 'Ask what the seed needs first: water, light or time.',
  },
  {
    key: 'leaf_walk', title: 'A walk for three leaves', emoji: '🍂', tiers: [1, 2, 3],
    proof: 'grownup_tap', together: 'required', reward: 'flag', rewardLabel: 'A leaf flag',
    steps: ['Go outside with your grown up.', 'Find three different leaves.', 'Bring them home.'],
    askLine: 'says you went out and found three leaves together.',
    grownupLine: 'Ask which leaf was hardest to find, and why.',
  },
  {
    key: 'stretch', title: 'Five minute stretch', emoji: '🤸', tiers: [1, 2, 3],
    proof: 'timer', timerMinutes: 5, together: 'invited', reward: 'ring', rewardLabel: 'A ring around the planet',
    steps: ['Stand up tall.', 'Reach for the sky, then touch your toes.', 'Keep going until the ring fills.'],
    askLine: 'stretched for five whole minutes.',
    grownupLine: 'Do it with them. Five minutes is longer than it sounds.',
  },
  {
    key: 'water_plant', title: 'Water a real plant', emoji: '💧', tiers: [1, 2],
    proof: 'grownup_tap', together: 'required', reward: 'pool', rewardLabel: 'A pool in a crater',
    steps: ['Find a plant in your house.', 'Give it a drink, not a flood.', 'Say hello to it.'],
    askLine: 'says you watered a real plant together.',
    grownupLine: 'Ask how they can tell when a plant is thirsty.',
  },
  {
    key: 'read_book', title: 'Read a real book', emoji: '📖', tiers: [2, 3],
    proof: 'timer', timerMinutes: 10, together: 'invited', reward: 'lamp', rewardLabel: 'A story lamp',
    steps: ['Pick a real book, paper and all.', 'Find a comfy spot.', 'Read until the ring fills.'],
    askLine: 'read a real book for ten minutes.',
    grownupLine: 'Ask what happened in the bit they just read.',
  },
  {
    key: 'spider_legs', title: 'The counting hunt', emoji: '🔎', tiers: [2],
    proof: 'code', answer: ['8'], together: 'invited', reward: 'moon', rewardLabel: 'A pale moon',
    steps: ['Find a spider, outside or in a book.', 'Count its legs. Carefully.', 'Come back and tap the number.'],
    askLine: 'counted the legs on a spider.',
    grownupLine: 'Ask where they found it, and whether it was scary or interesting.',
  },
  {
    key: 'screens_off_dinner', title: 'Screens off dinner', emoji: '🍽️', tiers: [2, 3],
    proof: 'grownup_tap', together: 'required', reward: 'blanket', rewardLabel: 'A picnic blanket under the stars',
    steps: ['Every screen goes on the charger. Grown ups too.', 'Eat together.', 'Tell each other one good thing about today.'],
    askLine: 'says the whole family had a screens off dinner.',
    grownupLine: 'Ask which good thing they picked, and tell them yours.',
  },
  {
    key: 'do_lesson', title: 'Do a lesson', emoji: '📚', tiers: [2, 3],
    proof: 'lesson', together: 'invited', reward: 'star', rewardLabel: 'A bright new star',
    steps: ['Open the Learn tab.', 'Pass a lesson your grown up sent you.', 'Come back to your planet.'],
    askLine: 'passed a lesson.',
    grownupLine: 'Ask them to teach you the one thing they remember from it.',
  },
]

export const MISSION_DEFS: Record<string, MissionDef> = Object.fromEntries(
  MISSIONS.map(m => [m.key, { key: m.key, tiers: m.tiers, proof: m.proof, timerMinutes: m.timerMinutes, answer: m.answer, reward: m.reward }]),
)

export function missionByKey(key: string): Mission | undefined {
  return MISSIONS.find(m => m.key === key)
}

export function missionsForTier(tier: Tier): Mission[] {
  return MISSIONS.filter(m => m.tiers.includes(tier))
}

/** What each reward is, for the reveal card and the parent's eyes. */
export const REWARD_LABELS: Record<RewardKey, string> = {
  dome: 'A little garden dome',
  flag: 'A leaf flag',
  ring: 'A ring around the planet',
  pool: 'A pool in a crater',
  lamp: 'A story lamp',
  star: 'A bright new star',
  blanket: 'A picnic blanket',
  moon: 'A pale moon',
}

export const MISSION_LINES = {
  board: 'Missions',
  boardTier1: 'A mission with a grown up',
  rewardPrefix: 'Reward:',
  withGrownup: 'With a grown up',
  grownupInvited: 'Grown ups welcome',
  start: 'Start',
  weDidIt: 'We did it',
  keepGoing: 'Keep going',
  thatIsIt: 'That is it',
  asked: 'Asked. Your grown up will see it.',
  notNow: 'Not this time, and that is fine. It is still on your board.',
  notYetTimer: 'Not yet. Keep going until the ring fills.',
  notYetLesson: 'Not yet. Pass a lesson on the Learn tab first.',
  notQuite: 'Not quite. Have another look.',
  landed: 'It landed on your planet!',
  tapNumber: 'Tap the number',
  close: 'Back to my planet',
  learnTab: 'Open the Learn tab',
} as const
