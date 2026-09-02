import BalanceWheelSheet from './BalanceWheelSheet'
import PhonesToBedSheet, { type Bedtime } from './PhonesToBedSheet'
import ScreenTimeDealSheet, { type DealFacts } from './ScreenTimeDealSheet'
import HelpingHandSheet from './HelpingHandSheet'
import ReadyForMyPhoneSheet from './ReadyForMyPhoneSheet'
import KindnessPostcardsSheet from './KindnessPostcardsSheet'
import { ExampleContext } from './HappyPaper'

// The drawn sheets: printables drawn in code rather than fetched as art.
//
// Justin, 2 September 2026: "add more happy news style printables just as
// other ones like this. Come up with ideas using this style for age related
// device balance use." Six sheets, one per device balance idea, each on the
// same A4 paper as the bucket list (HappyPaper). The registry points at one
// of these by key instead of at a CDN image, and everything downstream (both
// grids, the ask and confirm loop, the five a day tick, the stage gating)
// works exactly as it does for a sheet of art, because the sheet is still a
// registry entry. This file is the only place a key meets a component.

export const DRAWN_KEYS = ['balance-wheel', 'phones-to-bed', 'screen-time-deal', 'helping-hand', 'ready-for-my-phone', 'kindness-postcards'] as const
export type DrawnKey = typeof DRAWN_KEYS[number]

export function isDrawnKey(k: unknown): k is DrawnKey {
  return typeof k === 'string' && (DRAWN_KEYS as readonly string[]).includes(k)
}

/** Everything a drawn sheet needs to print: which one, whose, and the family's real numbers when known. */
export type DrawnSpec = {
  key: DrawnKey
  childName: string
  /** The finished sheet's worth, from the registry. */
  stars: number
  /** The family's real settings, when the caller has them. Dotted lines otherwise. */
  facts?: DealFacts
  /** Show it filled in and coloured in, the way a child's might look when done. Never for a print. */
  example?: boolean
}

export type { DealFacts, Bedtime }

export function DrawnSheet({ spec }: { spec: DrawnSpec }) {
  const { key, childName, stars, facts } = spec
  let sheet: React.ReactNode
  switch (key) {
    case 'balance-wheel': sheet = <BalanceWheelSheet childName={childName} stars={stars} />; break
    case 'phones-to-bed': sheet = <PhonesToBedSheet childName={childName} stars={stars} bedtime={facts?.bedtime ?? null} />; break
    case 'screen-time-deal': sheet = <ScreenTimeDealSheet childName={childName} stars={stars} facts={facts} />; break
    case 'helping-hand': sheet = <HelpingHandSheet childName={childName} stars={stars} />; break
    case 'ready-for-my-phone': sheet = <ReadyForMyPhoneSheet childName={childName} stars={stars} />; break
    case 'kindness-postcards': sheet = <KindnessPostcardsSheet childName={childName} stars={stars} />; break
  }
  return <ExampleContext.Provider value={!!spec.example}>{sheet}</ExampleContext.Provider>
}

/**
 * The window each tile shows onto the filled in example: the part of the
 * paper that is a picture (the wheel, the bed, the jars, the hand, the road,
 * the postcards), in paper pixels. DrawnCover scales it to fill the tile the
 * way an image sheet's preview does, so a grid of sheets reads as a grid of
 * pictures rather than a grid of shrunken forms.
 */
export const COVER: Record<DrawnKey, { x: number; y: number; w: number; h: number }> = {
  // Each window is the tile's own shape (five wide to six tall), so a tile
  // shows exactly this and a squarer card or thumbnail only trims the edges.
  'balance-wheel': { x: 138, y: 222, w: 516, h: 622 },
  'phones-to-bed': { x: 355, y: 228, w: 370, h: 446 },
  'screen-time-deal': { x: 97, y: 236, w: 600, h: 715 },
  'helping-hand': { x: 40, y: 318, w: 370, h: 446 },
  'ready-for-my-phone': { x: 96, y: 236, w: 602, h: 724 },
  'kindness-postcards': { x: 45, y: 238, w: 352, h: 424 },
}
