import type { BedtimePhase, Garden, GardenAsk, GardenEvent, Tier } from './logic'

// What the child's screen receives, whole, on every read and every event, so
// it never has to guess what changed. Types only: shared by the server, the
// client and the dev fixture.

export type ScreenAsk = { id: string; minutes: number; status: 'pending' | 'approved' | 'declined' }

export type GardenView = {
  garden: Garden
  serverNow: string
  tier: Tier
  bedtime: {
    phase: BedtimePhase
    startMin: number | null
    endMin: number | null
    /** London minutes past midnight right now. */
    minutesNow: number
    /** The parent said yes to minutes inside bedtime: play is open until this instant. */
    windowUntil: string | null
  }
  /** The wake early ask, if one is live. */
  ask: GardenAsk | null
  /** The device time ask made from the night overlay, if one is live. */
  screenAsk: ScreenAsk | null
  /** Minutes one star buys this child, so the night ask asks for whole stars. */
  starMinutes: number
}

export type ClientEvent = GardenEvent | { kind: 'ask_wake' } | { kind: 'ask_seen' }
