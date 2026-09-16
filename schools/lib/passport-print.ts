import type { CharacterKey } from '@gc/shared/schools-curriculum'
import type { PassportStage } from '@gc/shared/passport-stages'
import type { AreaKey } from '@gc/shared/passport-areas'

// THE PASSPORT PRINT OUT: the four editions and their words (14 September 2026).
//
// Justin: "a print out of the passport for them as a task to cut out, print,
// attach stickers etc, with words that reflect what they should know each
// stage, super simple, super fun, and more engaging the older the level."
//
// One edition per passport page the school scheme fills (explorer is folded
// into shaper the way shared/passport-stages.ts already does, and KS5 sits
// after the passport). The words a child should know are never typed here:
// they are the `I can` line of every module on the page, read from the
// lesson rows, grouped by area. What this file owns is the register: how
// the same eight panels talk to a Reception class and to a Year 11 class.

export type Edition = {
  stage: PassportStage
  friend: CharacterKey
  years: string
  /** The cover's second line, in the register. */
  strap: string
  /** The inside cover: what this page is for. */
  about: string
  /** The line above the `I can` list on an area panel. */
  prove: string
  /** An area with no school lesson on this page. */
  athome: string
  /** The stamp panel. */
  stamp: string
  /** The back cover's home line. */
  home: string
  /** A larger friend and fewer words for the youngest. */
  young: boolean
  /** A signature line on the stamp panel for the oldest. */
  signed: boolean
}

export const EDITIONS: Edition[] = [
  {
    stage: 'foundation', friend: 'pebble', years: 'Reception to Year 2', young: true, signed: false,
    strap: 'My first steps online',
    about: 'This is your passport. Every lesson with Pebble fills one ring. Stick your sticker in the ring. When every ring is full, the page is done!',
    prove: 'I can',
    athome: 'This ring fills at home.',
    stamp: 'All the rings full? Stick Pebble here. That is your stamp!',
    home: 'Grown ups: the note that came home has a home code. Put it in the Guided Childhood app and this page fills there too.',
  },
  {
    stage: 'builder', friend: 'bloop', years: 'Years 3 to 6', young: false, signed: false,
    strap: 'Built by me, one lesson at a time',
    about: 'Four things every child on this page is learning. Each lesson fills one ring with a sticker. When every ring is full, the page is complete and Bloop is your stamp.',
    prove: 'By the end of this page I can',
    athome: 'No lesson on this page yet. The app fills this ring at home.',
    stamp: 'Every ring full? Stick Bloop here. That is the stamp for this page, and the next page is Orbit.',
    home: 'At home: the parent note carries a home code. Enter it in the Guided Childhood app and this page fills there as well as here.',
  },
  {
    stage: 'shaper', friend: 'orbit', years: 'Years 7 to 9', young: false, signed: false,
    strap: 'Making choices',
    about: 'This page is the one where the choices start to be yours. Four areas, one sticker each time a lesson proves you can do the thing, and the stamp when all four are earned, not given.',
    prove: 'Prove it',
    athome: 'Nothing on this page for this area yet. It is earned at home, in the app.',
    stamp: 'Four rings, four stickers, then Orbit here. Earned, never just a birthday reached.',
    home: 'The parent note that goes home has a home code. In the Guided Childhood app it fills this page too, and it never says which door a ring was filled through.',
  },
  {
    stage: 'independent', friend: 'nova', years: 'Years 10 and 11', young: false, signed: true,
    strap: 'The last page before full access',
    about: 'The last page before full access. Four areas, each one a test you pass by doing, not a box someone ticks for you. A sticker per lesson, a signature when the page is complete.',
    prove: 'The tests',
    athome: 'No school lesson sits in this area on this page. The app carries it at home.',
    stamp: 'Complete when every ring is filled. Sign it, date it, and Nova is the stamp.',
    home: 'The parent note has a home code. Entered in the Guided Childhood app, this page fills there too, and the first week of full access is planned rather than stumbled into.',
  },
]

export const editionFor = (stage: string): Edition | undefined => EDITIONS.find(e => e.stage === stage)

/** The one sheet fold. Eight panels on a landscape sheet: the top row prints
 *  upside down, the bottom row upright, the cover bottom right. Fold in half
 *  the long way, then in half and each end back to the middle, cut along the
 *  middle crease from the folded edge to the first crease, unfold, fold the
 *  long way and push the ends together. Page numbers on every panel let a
 *  teacher check it before a class does. */
export const ZINE_TOP: number[] = [5, 4, 3, 2]
export const ZINE_BOTTOM: number[] = [6, 7, 8, 1]

export const FOLD_STEPS = [
  'Fold the sheet in half the long way, so the top row meets the bottom row, and open it again.',
  'Fold it in half the short way, then fold each end back to the middle. You now have eight rectangles.',
  'Fold it in half the short way again. Cut along the middle crease from the folded edge as far as the first crease, and no further.',
  'Open it out, fold it the long way again, and push the two ends towards each other. The middle opens up. Fold it closed with the cover on the outside.',
]

export const AREA_EMOJI: Record<AreaKey, string> = { safe: '🛡️', balance: '⚖️', ai: '🤖', social: '💬' }
