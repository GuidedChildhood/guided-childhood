// DiGi and the Planet Friends. DiGi (the golden star) is the guide; each stage
// unlocks a new Planet Friend who grows up alongside the child. A child earns
// one Friend per stage on the way to 16, and together with DiGi they explore,
// learn and grow. These replace the old squad (Oliver, Zara, Sofia); DiGi is
// kept. Digital character art, hosted on the CDN next.config already allows.
//
// Two art fields per Friend. `img` is the finished digital character on its
// soft background, the version the parent app keeps. `cutout` is the same
// character with the background removed, floating clean like DiGi, used on the
// child app so a Friend feels like a living animation, not a toy on a card.
//
// One place, one source of truth. Rename, recolour or re-point art here and
// every surface follows.
//
// July 2026: Nova and Cosmo were both re-pointed. Nova had been rendered in a
// different style from the other four, matte with horns and photographed on a
// wooden floor, so it read as a character from another property and could never
// have been made into a plush or a charm alongside them. It is now drawn to
// match: same glossy body, same cream studio background, a crescent moon where
// the others have their sprout or antenna. Cosmo now points at the orange flame
// character, which is the one Justin means by Cosmo.

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

// ── THE FIVE FRIENDS SHIP WITH THE CODE ─────────────────────────────────────
//
// Justin handed over the five character files on 13 August. They are the same
// images the `img` field already pointed at on the CDN, plus a Nova that was
// not referenced anywhere, so this is the finished cast rather than a redraw.
//
// They live in public/digi-squad/friends now, at 512 square, which is four
// times the largest place any of them is drawn.
//
// WHY LOCAL RATHER THAN THE CDN. These are the face of the product on the one
// screen a parent opens every morning, and an image that is one network hop
// away is an image that is sometimes not there. It is not hypothetical: the
// CDN is unreachable from the build container, so every preview and every
// screenshot of the Planet Friend beside the road drew an empty circle, which
// is exactly what a parent on a bad train connection would have seen.
//
// THEY ARE CUT OUT, which is Justin's follow up on the same day: "I need them
// made transparent." The art arrives standing on a cream ground with its own
// drop shadow, and a Friend that carries a beige square around with it cannot
// sit on a coloured card, a dark header or the road. scripts/make-friend
// cutouts.py is how they were lifted, and it is kept because the next piece of
// character art will need the same treatment.
//
// So `img` and `cutout` are now the same file. They were only ever different
// because one had a background, and now neither does. Both fields stay, since
// forty files read one or the other and a rename would be a large diff to say
// nothing.
//
// `colouring` stays on the CDN: it is black and white line art for printables
// and genuinely is a different picture.

export type StageCharacter = {
  stageId: number          // 1 Foundation to 5 Independent
  key: string              // stable id used by the buddy picker and saves
  name: string
  img: string              // finished character on its background (parent app)
  cutout: string           // background removed, floats clean (child app)
  colouring: string        // black and white line art, for colour in printables
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
    img: '/digi-squad/friends/pebble.png',
    cutout: '/digi-squad/friends/pebble.png',
    colouring: BASE + 'hf_20260724_111510_303dc497-fe84-4539-a0f3-00f56f132c9a.png',
    ages: 'Ages 4 to 7', colour: '#E6B93E', action: 'Explore',
    blurb: 'Full of curiosity and wonder. Every big journey starts small.',
    role: 'your first safe steps',
    intro: "Hi, I'm Pebble! Earn me first and we'll take your very first steps together.",
    unlockLine: 'You earned Pebble! Your first Planet Friend is here.',
  },
  {
    stageId: 2, key: 'bloop', name: 'Bloop',
    img: '/digi-squad/friends/bloop.png',
    cutout: '/digi-squad/friends/bloop.png',
    colouring: BASE + 'hf_20260724_130028_f1485ff8-e1b1-44f0-85d4-87c12ef7af25.png',
    ages: 'Ages 8 to 10', colour: '#7CB342', action: 'Create',
    blurb: 'Creative and clever. Building skills and strong foundations.',
    role: 'building good habits',
    intro: "I'm Bloop! Reach Stage 2 and we'll build brilliant habits together.",
    unlockLine: 'You earned Bloop! Two Planet Friends now.',
  },
  {
    stageId: 3, key: 'orbit', name: 'Orbit',
    img: '/digi-squad/friends/orbit.png',
    cutout: '/digi-squad/friends/orbit.png',
    colouring: BASE + 'hf_20260724_130030_bca37824-1a9f-4744-9044-c97de3da8abe.png',
    ages: 'Ages 11 to 12', colour: '#4C9FD6', action: 'Explore',
    blurb: 'Exploring bigger worlds and asking big questions.',
    role: 'exploring and asking big questions',
    intro: "I'm Orbit! Get to Stage 3 and we'll explore bigger worlds together.",
    unlockLine: 'You earned Orbit! Three Friends exploring with you.',
  },
  {
    stageId: 4, key: 'nova', name: 'Nova',
    img: '/digi-squad/friends/nova.png',
    cutout: '/digi-squad/friends/nova.png',
    colouring: BASE + 'hf_20260725_090749_b565097d-be3d-403d-8435-2817497807bc.png',
    ages: 'Ages 13 to 15', colour: '#9B72CF', action: 'Guide',
    blurb: 'Learning to make good choices and shape your path.',
    role: 'making your own good choices',
    intro: "I'm Nova! At Stage 4 we'll learn to make your own good choices.",
    unlockLine: 'You earned Nova! Four Friends, nearly the whole team.',
  },
  {
    stageId: 5, key: 'cosmo', name: 'Cosmo',
    img: '/digi-squad/friends/cosmo.png',
    cutout: '/digi-squad/friends/cosmo.png',
    colouring: BASE + 'hf_20260725_090756_3600a3d8-266c-40ca-af9c-b890f0223bed.png',
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
