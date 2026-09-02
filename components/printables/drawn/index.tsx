import BalanceWheelSheet from './BalanceWheelSheet'
import PhonesToBedSheet, { type Bedtime } from './PhonesToBedSheet'
import ScreenTimeDealSheet, { type DealFacts } from './ScreenTimeDealSheet'
import HelpingHandSheet from './HelpingHandSheet'
import ReadyForMyPhoneSheet from './ReadyForMyPhoneSheet'
import KindnessPostcardsSheet from './KindnessPostcardsSheet'

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
}

export type { DealFacts, Bedtime }

export function DrawnSheet({ spec }: { spec: DrawnSpec }) {
  const { key, childName, stars, facts } = spec
  switch (key) {
    case 'balance-wheel': return <BalanceWheelSheet childName={childName} stars={stars} />
    case 'phones-to-bed': return <PhonesToBedSheet childName={childName} stars={stars} bedtime={facts?.bedtime ?? null} />
    case 'screen-time-deal': return <ScreenTimeDealSheet childName={childName} stars={stars} facts={facts} />
    case 'helping-hand': return <HelpingHandSheet childName={childName} stars={stars} />
    case 'ready-for-my-phone': return <ReadyForMyPhoneSheet childName={childName} stars={stars} />
    case 'kindness-postcards': return <KindnessPostcardsSheet childName={childName} stars={stars} />
  }
}
