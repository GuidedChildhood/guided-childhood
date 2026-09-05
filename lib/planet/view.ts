import type { BedtimePhase, CodeMode, Home, HomeAsk, HomeEvent, Tier } from './logic'

// What the child's screen receives, whole, on every read and every event, so
// it never has to guess what changed. Types only: shared by the server, the
// client and the dev fixture.

export type ScreenAsk = { id: string; minutes: number; status: 'pending' | 'approved' | 'declined' }

export type HomeView = {
  home: Home
  serverNow: string
  tier: Tier
  /** The child's age in whole years, which decides who is still a baby. */
  childAge: number
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
  ask: HomeAsk | null
  /** The device time ask made from the night overlay, if one is live. */
  screenAsk: ScreenAsk | null
  /** Minutes one star buys this child, so the night ask asks for whole stars. */
  starMinutes: number
  /** The hidden code cards made for this child: which missions, in which shape, and whether printed. Never the code itself. */
  cards: { key: string; mode: CodeMode; printed: boolean }[]
}

export type ClientEvent = HomeEvent | { kind: 'ask_wake' } | { kind: 'ask_seen' }
