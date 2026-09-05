import type { MissionDef, Outfit, PartKey, Tier } from './logic'

// Planet Friends: the missions, as data (design section 3.2, redone for the
// build in slice 3). A mission is a real world thing done with a grown up,
// proved by time, by a grown up's tap, by a code found outside, or by a
// lesson passed on the child's own link. Every reward is a part, named on
// the card before the mission starts, and the child builds with it: found
// offline, never found by chance. Missions pay on the planet only, never
// stars (Justin, 2 September 2026). No dashes in any line.
//
// Justin, 2 September 2026: "Seems to be plant missions still? How is this
// like Toca Boca? Surely they build rooms and stuff." So the garden went:
// space and adventure now, and a part to build with at the end of each.

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
  /** The one thing to talk about, for the grown up. The fuller version is a scripts row (see scriptOrder). */
  grownupLine: string
  /** The scripts row that rides this mission: its sort_order, which is the script's address at /dashboard/scripts/<sort_order>. Seeded by migration 254 (253 had the nine garden rows that never shipped). */
  scriptOrder: number
  /** One picture per step for the printed sheet, so a child who cannot read can follow it. */
  stepArt: [string, string, string]
}

export const MISSIONS: Mission[] = [
  {
    key: 'rocket_launch', title: 'Rocket launch', emoji: '🚀', tiers: [1, 2, 3],
    proof: 'grownup_tap', together: 'required', reward: 'rocket', rewardLabel: 'A rocket',
    steps: ['Make a rocket from a box or a bottle.', 'Count down from ten, out loud, together.', 'Blast off! Arms up as high as they go.'],
    askLine: 'says you launched a rocket together.',
    grownupLine: 'Ask where it would fly, and who it would take.',
    scriptOrder: 9630, stepArt: ['📦', '🔟', '🚀'],
  },
  {
    key: 'moon_jumps', title: 'Twenty moon jumps', emoji: '🦘', tiers: [1, 2, 3],
    proof: 'grownup_tap', together: 'required', reward: 'trampoline', rewardLabel: 'A trampoline',
    steps: ['Go outside, or find a soft spot.', 'Twenty moon jumps, as high as you can.', 'Your grown up counts. Land like an astronaut.'],
    askLine: 'did twenty moon jumps.',
    grownupLine: 'Ask which jump was the highest, and do one yourself.',
    scriptOrder: 9631, stepArt: ['🚪', '🦘', '🧑‍🚀'],
  },
  {
    key: 'explorer_walk', title: 'Explorer walk', emoji: '🧭', tiers: [1, 2, 3],
    proof: 'grownup_tap', together: 'required', reward: 'rover', rewardLabel: 'A moon rover',
    steps: ['Walk somewhere you have never been before.', 'Look for one thing worth remembering.', 'Bring it home, or draw it.'],
    askLine: 'explored somewhere new together.',
    grownupLine: 'Ask what they would name the place.',
    scriptOrder: 9632, stepArt: ['🥾', '🔎', '🏠'],
  },
  {
    key: 'stretch', title: 'Five minute stretch', emoji: '🤸', tiers: [1, 2, 3],
    proof: 'timer', timerMinutes: 5, together: 'invited', reward: 'swing', rewardLabel: 'A swing',
    steps: ['Stand up tall.', 'Reach for the sky, then touch your toes.', 'Keep going until the ring fills.'],
    askLine: 'stretched for five whole minutes.',
    grownupLine: 'Do it with them. Five minutes is longer than it sounds.',
    scriptOrder: 9633, stepArt: ['🧍', '🙆', '⭕'],
  },
  {
    key: 'helping_hands', title: 'Helping hands', emoji: '🧹', tiers: [1, 2, 3],
    proof: 'grownup_tap', together: 'invited', reward: 'robot', rewardLabel: 'A robot helper',
    steps: ['Find one job at home nobody asked you to do.', 'Do it properly.', 'See if anyone notices.'],
    askLine: 'did a job nobody asked them to do.',
    grownupLine: 'Ask what made them pick that one.',
    scriptOrder: 9634, stepArt: ['🧹', '💪', '👀'],
  },
  {
    key: 'star_hunt', title: 'Star hunt', emoji: '🔭', tiers: [2, 3],
    proof: 'grownup_tap', together: 'required', reward: 'telescope', rewardLabel: 'A telescope',
    steps: ['Wait until it is dark.', 'Go to a window or outside with your grown up.', 'Count the stars you can see. Every one counts.'],
    askLine: 'counted real stars in the real sky.',
    grownupLine: 'Ask how many they found, and which was the brightest.',
    scriptOrder: 9635, stepArt: ['🌃', '🪟', '⭐'],
  },
  {
    key: 'read_book', title: 'Read a real book', emoji: '📖', tiers: [2, 3],
    proof: 'timer', timerMinutes: 10, together: 'invited', reward: 'tent', rewardLabel: 'A story tent',
    steps: ['Pick a real book, paper and all.', 'Find a comfy spot.', 'Read until the ring fills.'],
    askLine: 'read a real book for ten minutes.',
    grownupLine: 'Ask what happened in the bit they just read.',
    scriptOrder: 9636, stepArt: ['📖', '🛋️', '⭕'],
  },
  {
    key: 'spider_legs', title: 'The counting hunt', emoji: '🔎', tiers: [2, 3],
    proof: 'code', answer: ['8'], together: 'invited', reward: 'moon', rewardLabel: 'A pale moon',
    steps: ['Find a spider, outside or in a book.', 'Count its legs. Carefully.', 'Come back and tap the number.'],
    askLine: 'counted the legs on a spider.',
    grownupLine: 'Ask where they found it, and whether it was scary or interesting.',
    scriptOrder: 9637, stepArt: ['🕷️', '🔢', '🔎'],
  },
  {
    key: 'screens_off_dinner', title: 'Screens off dinner', emoji: '🍽️', tiers: [2, 3],
    proof: 'grownup_tap', together: 'required', reward: 'campfire', rewardLabel: 'A campfire',
    steps: ['Every screen goes on the charger. Grown ups too.', 'Eat together.', 'Tell each other one good thing about today.'],
    askLine: 'says the whole family had a screens off dinner.',
    grownupLine: 'Ask which good thing they picked, and tell them yours.',
    scriptOrder: 9638, stepArt: ['🔌', '🍽️', '💬'],
  },
  {
    key: 'do_lesson', title: 'Do a lesson', emoji: '📚', tiers: [2, 3],
    proof: 'lesson', together: 'invited', reward: 'dish', rewardLabel: 'A satellite dish',
    steps: ['Open the Learn tab.', 'Pass a lesson your grown up sent you.', 'Come back to your planet.'],
    askLine: 'passed a lesson.',
    grownupLine: 'Ask them to teach you the one thing they remember from it.',
    scriptOrder: 9639, stepArt: ['📚', '✅', '🪐'],
  },
  {
    key: 'phone_to_bed', title: 'Phone to bed, unasked', emoji: '🔌', tiers: [2, 3],
    proof: 'grownup_tap', together: 'invited', reward: 'night_light', rewardLabel: 'A night light',
    steps: ['At bedtime, put your device on the charger.', 'Before anyone asks you to.', 'Tell your grown up you did it.'],
    askLine: 'put their device to bed without being asked.',
    grownupLine: 'Say thank you and mean it. Then put yours next to it.',
    scriptOrder: 9640, stepArt: ['🔌', '🤫', '🙋'],
  },
  {
    // The hidden code card (design 5.2). The grown up prints the card, the
    // server has made its code for this child, and the child taps what is
    // on it. The code never reaches the child's device.
    key: 'comet_card', title: 'The Comet card', emoji: '☄️', tiers: [2, 3],
    proof: 'code', perChild: true, together: 'required', reward: 'comet', rewardLabel: 'A comet across your sky',
    steps: ['Your grown up prints the Comet card and hides it.', 'Hunt for it. Ten steps from a door is a good start.', 'Found it? Come back and tap what is on the card.'],
    askLine: 'found the Comet card.',
    grownupLine: 'Hide it somewhere they have to really look. Then ask how they worked it out.',
    scriptOrder: 9641, stepArt: ['🖨️', '🔎', '☄️'],
  },
]

export const MISSION_DEFS: Record<string, MissionDef> = Object.fromEntries(
  MISSIONS.map(m => [m.key, { key: m.key, tiers: m.tiers, proof: m.proof, timerMinutes: m.timerMinutes, answer: m.answer, perChild: m.perChild, reward: m.reward }]),
)

export function missionByKey(key: string): Mission | undefined {
  return MISSIONS.find(m => m.key === key)
}

export function missionsForTier(tier: Tier): Mission[] {
  return MISSIONS.filter(m => m.tiers.includes(tier))
}

/** What each part is, in the child's words: the reveal card, the box, the parent's eyes. */
export const PART_LABELS: Record<PartKey, string> = {
  flag: 'A flag',
  bench: 'A bench',
  lamp: 'A lamp post',
  rocket: 'A rocket',
  telescope: 'A telescope',
  trampoline: 'A trampoline',
  rover: 'A moon rover',
  swing: 'A swing',
  tent: 'A story tent',
  campfire: 'A campfire',
  dish: 'A satellite dish',
  night_light: 'A night light',
  moon: 'A pale moon',
  comet: 'A comet',
  star: 'A bright star',
  robot: 'A robot helper',
  ring: 'A ring around the planet',
}
/** RewardKey is the old name for PartKey; the old label map stays for the reveal card. */
export const REWARD_LABELS = PART_LABELS

export const OUTFIT_LABELS: Record<Outfit, string> = {
  party_hat: 'A party hat',
  glasses: 'Star glasses',
  helmet: 'A space helmet',
  cape: 'A cape',
  crown: 'A crown',
}

/** What a Friend says when it is dropped on a part. */
export const PART_LINES: Record<PartKey, string> = {
  flag: 'Salute!',
  bench: 'Ahh. Sit with me.',
  lamp: 'Bright!',
  rocket: 'Three, two, one!',
  telescope: 'I can see your house!',
  trampoline: 'Boing! Boing!',
  rover: 'Vroom vroom.',
  swing: 'Wheee!',
  tent: 'Story time.',
  campfire: 'Toasty.',
  dish: 'Hello, space!',
  night_light: 'Night night, little light.',
  moon: 'Hello, moon.',
  comet: 'Whoosh!',
  star: 'Twinkle.',
  robot: 'Beep boop.',
  ring: 'Round and round.',
}

/** The six pictures a code card can carry, as the child sees them on the pad and on the card. */
export const PICTURE_ART: Record<string, string> = { star: '⭐', moon: '🌙', rocket: '🚀', planet: '🪐', comet: '☄️', sun: '☀️' }

export const MISSION_LINES = {
  board: 'Missions',
  boardTier1: 'A mission with a grown up',
  rewardPrefix: 'You get:',
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
  landed: 'It is in your parts box. Put it anywhere you like.',
  tapNumber: 'Tap the number',
  tapPictures: 'Tap the pictures in order',
  tapLetters: 'Tap the letters',
  cardFirst: 'Your grown up prints the Comet card first. Then the hunt is on.',
  close: 'Back to my planet',
  learnTab: 'Open the Learn tab',
  // The parts box (slice 3).
  box: 'My parts',
  boxHint: 'Drag a part onto your planet. Drag it off the bottom to put it back.',
  boxEmpty: 'Your box is empty. Missions bring parts, and the planet makes more room while you are away.',
  noRoom: 'No room yet. Your planet grows more room while you are away.',
  spaces: (n: number) => (n === 1 ? '1 space left' : `${n} spaces left`),
  wear: 'Drag an outfit onto a Friend.',
} as const
