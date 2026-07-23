'use client'

import { useEffect, useState, type ReactNode } from 'react'

// One DiGi interrupt, and only now and then. This gate governs the whole daily
// nudge cluster so a parent meets a SINGLE DiGi card on the first visit of a
// day, at most twice a week, never two days running, and the theme rotates:
// a lesson one time, a printable another, a script, a gentle moment, and most
// days nothing at all. First login sticks: once it has shown (or been set
// aside) it does not flash back the same day.
//
// The cadence lives in localStorage, not a table: a nudge is not data worth a
// migration, and the worst case of a cleared browser is one extra friendly
// card. Each themed slot may still choose to render nothing (a device check in
// with no pattern to raise), which simply makes that a quiet day, exactly the
// intent.

type Slot = { key: string; node: ReactNode }

const STATE_KEY = 'gc_flashup'
const GAP_DAYS = 2   // alternate days: never on back to back days
const WEEK_CAP = 2   // at most twice in any rolling seven days

type FlashState = { dates: string[]; idx: number; pick?: { date: string; key: string } }

function todayStr() { return new Date().toISOString().slice(0, 10) }
function dayNum(d: string) { return Math.floor(Date.parse(`${d}T00:00:00Z`) / 86_400_000) }

export default function DigiFlashUp({ slots }: { slots: Slot[] }) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (slots.length === 0) { setReady(true); return }
    const today = todayStr()

    let state: FlashState = { dates: [], idx: 0 }
    try {
      const raw = localStorage.getItem(STATE_KEY)
      if (raw) { const p = JSON.parse(raw); if (p && typeof p === 'object') state = p }
    } catch { /* private mode, treat as fresh */ }
    state.dates = (state.dates || []).filter(d => dayNum(today) - dayNum(d) < 14)
    if (typeof state.idx !== 'number') state.idx = 0

    // Already decided today: keep the same card all day so a first login pick
    // never swaps out from under the parent on the next render.
    if (state.pick && state.pick.date === today) {
      if (slots.some(s => s.key === state.pick!.key)) setChosen(state.pick.key)
      setReady(true)
      return
    }

    // One DiGi prompt a day, never two: if the welcome sheet already claimed
    // today (it runs first), the flash up stays quiet so a parent never meets
    // two DiGi cards at once.
    try { if (localStorage.getItem(`gc_digi_prompt_${today}`)) { setReady(true); return } } catch { /* private mode */ }

    const last = state.dates.length ? Math.max(...state.dates.map(dayNum)) : -Infinity
    const gapOk = dayNum(today) - last >= GAP_DAYS
    const weekCount = state.dates.filter(d => dayNum(today) - dayNum(d) < 7).length
    const showToday = gapOk && weekCount < WEEK_CAP

    if (!showToday) { setReady(true); return }

    // A show day: take the next theme in rotation.
    const key = slots[state.idx % slots.length].key
    const next: FlashState = {
      dates: [...state.dates, today],
      idx: (state.idx + 1) % slots.length,
      pick: { date: today, key },
    }
    try { localStorage.setItem(STATE_KEY, JSON.stringify(next)) } catch { /* private mode */ }
    // Claim the day so nothing else DiGi shows a second card today.
    try { localStorage.setItem(`gc_digi_prompt_${today}`, 'flashup') } catch { /* private mode */ }
    setChosen(key)
    setReady(true)
  }, [slots])

  if (!ready || !chosen) return null
  const slot = slots.find(s => s.key === chosen)
  return slot ? <>{slot.node}</> : null
}
