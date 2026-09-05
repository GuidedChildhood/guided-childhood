import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { FRIEND_KEYS, FRIEND_MIN_AGE, type FriendKey, type Tier } from './logic'

// Planet Friends: content as data. The cast comes from the one source of
// truth for the Planet Friends (lib/content/stage-characters.ts), so a
// rename or a new piece of art there reaches the toy without a change here.
// Every line the toy says lives below. Renderers in components/planet never
// carry a string of their own, the same rule as the quest games registry.
// No dashes in any line, ever.

export type FriendArt = {
  key: FriendKey
  name: string
  /** The cut out character, floating clean, from public/digi-squad/friends. */
  img: string
  /** The Friend's own colour, for the nightcap, the bib and the pod glow. */
  colour: string
  /** The age this Friend grows up. */
  grownAt: number
}

const byKey = new Map(STAGE_CHARACTERS.map(c => [c.key, c]))

export function friendArt(key: FriendKey): FriendArt {
  const c = byKey.get(key)
  return {
    key,
    name: c?.name ?? key,
    img: c?.cutout ?? `/digi-squad/friends/${key}.png`,
    colour: c?.colour ?? '#E6B93E',
    grownAt: FRIEND_MIN_AGE[key],
  }
}

export const CAST: FriendArt[] = FRIEND_KEYS.map(friendArt)

/** The planet's growth stages, for the grown up's eyes and the fixture. A child sees the drawing. */
export const PLANET_STAGES = ['Bare rock', 'First grass', 'A flag', 'A little house', 'Rings', 'A moon']

/** A pastel of each Friend's colour for the blanket, so the pods read as a set. */
export const BLANKETS: Record<FriendKey, string> = {
  pebble: '#FCEFC2',
  bloop: '#DDF0CF',
  orbit: '#D6E9F7',
  nova: '#E6DBF6',
  cosmo: '#FBE0CC',
}

// Every line the toy says, in the Friends' own voices. Short, warm, child
// reading level. Tier 1 hears these read by a grown up or not at all, so the
// pictures carry the meaning there.
export const LINES = {
  welcome: 'Hello! Sprinkle me, tickle me, tuck me in.',
  yawn: 'I am getting sleepy.',
  tired: 'So sleepy. I need my pod.',
  napStart: 'Night night. See you soon.',
  pods: 'Shh. Everyone is asleep in their pods.',
  orbit: 'Resting. One slow orbit and I am back.',
  sunlightPrompt: 'Find me some real sunshine. Planets need their star. Take me to your sunniest window.',
  sunlightGrownup: 'Ask your grown up to come too.',
  sunlightButton: 'Catch the sunshine',
  sunlightWaiting: 'Mmm. Real sunshine.',
  sunlightDone: 'That was real sunshine. I can feel it!',
  grewAway: 'Our planet grew while you were away!',
  grewNight: 'Our planet grew in the night!',
  windDown: 'Nearly bedtime on our planet.',
  nightTier1: 'Everyone is asleep. Night night.',
  nightTier2: 'Everyone is asleep in their pods. They grow while you sleep too.',
  askDoor: 'Ask my grown up',
  asked: 'Asked. Your grown up will see it.',
  yes: 'Your grown up said yes!',
  notNow: 'Not this time, and that is fine.',
  nightNotNow: 'Night night. See you in the morning.',
  startWindow: 'Start my minutes',
  backToQuests: 'Back to my quests',
  backToPlanet: 'Back to my planet',
  sprinkled: 'Sparkly!',
  tickled: 'Hee hee!',
  boop: 'Boop!',
  cloudOn: 'Ahh, a little shade.',
  cloudOff: 'Hello sunshine.',
  everyoneToBed: 'Everyone to bed',
  babies: 'Still babies. They grow up with you.',
  baby: 'Still a baby. Growing up with you.',
} as const
