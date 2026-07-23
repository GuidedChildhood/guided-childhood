// DiGi and the Planet Friends. DiGi (the golden star) is the guide; each stage
// unlocks a new Planet Friend who grows up alongside the child. A child earns
// one Friend per stage on the way to 16, and together with DiGi they explore,
// learn and grow. These replace the old squad (Oliver, Zara, Sofia); DiGi is
// kept. Art generated in the house plush mascot style from Justin's reference
// sheet, hosted on the CDN next.config already allows.
//
// One place, one source of truth. Rename, recolour or re-point art here and
// every surface follows.

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

export type StageCharacter = {
  stageId: number          // 1 Foundation to 5 Independent
  key: string              // stable id used by the buddy picker and saves
  name: string
  img: string              // avatar art
  ages: string
  colour: string           // the Friend's own colour, for rings and cards
  action: string           // Explore / Create / Guide / Lead
  blurb: string            // the one line on the poster
  role: string             // what they help the child with, short
  intro: string            // Duolingo style hello, spoken on first open
  unlockLine: string       // said when the Friend is actually unlocked
}

export const STAGE_CHARACTERS: StageCharacter[] = [
  {
    stageId: 1, key: 'pebble', name: 'Pebble',
    img: BASE + 'hf_20260723_120310_52c3cb2f-de3e-4660-9e67-006552a220ee.png',
    ages: 'Ages 4 to 7', colour: '#E6B93E', action: 'Explore',
    blurb: 'Full of curiosity and wonder. Every big journey starts small.',
    role: 'your first safe steps',
    intro: "Hi, I'm Pebble! Earn me first and we'll take your very first steps together.",
    unlockLine: 'You earned Pebble! Your first Planet Friend is here.',
  },
  {
    stageId: 2, key: 'bloop', name: 'Bloop',
    img: BASE + 'hf_20260723_120312_b7eb690e-9459-45fd-a8bb-d657870019e0.png',
    ages: 'Ages 8 to 10', colour: '#7CB342', action: 'Create',
    blurb: 'Creative and clever. Building skills and strong foundations.',
    role: 'building good habits',
    intro: "I'm Bloop! Reach Stage 2 and we'll build brilliant habits together.",
    unlockLine: 'You earned Bloop! Two Planet Friends now.',
  },
  {
    stageId: 3, key: 'orbit', name: 'Orbit',
    img: BASE + 'hf_20260723_120320_328ee92e-7a09-47b9-bc4b-5927861a24c5.png',
    ages: 'Ages 11 to 13', colour: '#4C9FD6', action: 'Explore',
    blurb: 'Exploring bigger worlds and asking big questions.',
    role: 'exploring and asking big questions',
    intro: "I'm Orbit! Get to Stage 3 and we'll explore bigger worlds together.",
    unlockLine: 'You earned Orbit! Three Friends exploring with you.',
  },
  {
    stageId: 4, key: 'nova', name: 'Nova',
    img: BASE + 'hf_20260723_120322_6140bdde-2f58-41ce-889a-63ae64068d11.png',
    ages: 'Ages 13 to 15', colour: '#9B72CF', action: 'Guide',
    blurb: 'Learning to make good choices and shape your path.',
    role: 'making your own good choices',
    intro: "I'm Nova! At Stage 4 we'll learn to make your own good choices.",
    unlockLine: 'You earned Nova! Four Friends, nearly the whole team.',
  },
  {
    stageId: 5, key: 'cosmo', name: 'Cosmo',
    img: BASE + 'hf_20260723_120328_8e6a3302-7595-4708-b4ca-44e56db39c1a.png',
    ages: 'Ages 16+', colour: '#E8873C', action: 'Lead',
    blurb: 'Confident and independent. Ready to lead your own future.',
    role: 'leading your own way',
    intro: "I'm Cosmo! Reach Stage 5 and you'll be ready to lead your own way.",
    unlockLine: 'You earned Cosmo! The whole team is with you. You did it.',
  },
]

export function charactersUpToStage(earnedStages: number): StageCharacter[] {
  return STAGE_CHARACTERS.filter(c => c.stageId <= earnedStages)
}

export function characterForStage(stageId: number): StageCharacter | undefined {
  return STAGE_CHARACTERS.find(c => c.stageId === stageId)
}

export function characterByKey(key: string): StageCharacter | undefined {
  return STAGE_CHARACTERS.find(c => c.key === key)
}
