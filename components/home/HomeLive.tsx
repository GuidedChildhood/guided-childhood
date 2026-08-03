'use client'

import { useEffect, useState } from 'react'
import LiveTimerChip from '@/components/home/LiveTimerChip'
import WaitingOnYou from '@/components/quests/WaitingOnYou'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'

// The one place on Home where somebody is waiting on you.
//
// Justin, holding up Duolingo's home: "after pathway is done for the day it
// should move away leaving all the next important tabs. We can then use the pop
// up for urgent stuff."
//
// WHAT THIS IS FOR. The parent's Home renders twenty three components in
// sequence. Most are conditional, so nobody sees all of them, but the ones that
// do fire compete for the same first screen with nothing deciding between them.
// This is the first of the three slots that replace that: one fixed place for
// anything with a person on the other end of it, so a parent learns where to
// look once and it is always the same place.
//
// WHY IT DOES NOT DISAPPEAR, which is the whole point of the wrapper.
//
// LiveTimerChip and WaitingOnYou both say the same thing in their own comments:
// "Nothing renders here on a quiet day", "Silent when nothing waits". That
// instinct is right about NOISE and wrong about POSITION. A slot that vanishes
// teaches a parent nothing, because the absence of a card is indistinguishable
// from a card that failed to load, from a feature they have never met. It is
// the same complaint Justin made about the weekly round up disappearing on a
// Monday: the quiet state has to be a sentence, not a gap.
//
// Both references agree. Deel's Upcoming actions keeps its rows and writes "No
// pending items to approve" with the button greyed rather than removed.
// Airwallex's My tasks shows five cards, four of them reading "You're up to
// date" with a grey tick and one carrying a count. Settled things stay visible
// as one quiet line; only the outstanding one has weight.
//
// NOTHING IS EVER INVENTED HERE. If there is genuinely nothing waiting, this
// says so in grey and takes one line. A slot that manufactures urgency to
// justify its own existence is exactly the pattern this product exists to argue
// against, and a parent who is caught up has earned being told so.

export default function HomeLive() {
  // Whether anything is actually live. Read here rather than trusted from the
  // children, because the two of them poll different endpoints on different
  // clocks and the calm line must not flash in between.
  const [busy, setBusy] = useState<boolean | null>(null)

  useEffect(() => {
    let live = true
    const refresh = () => {
      Promise.all([
        fetch('/api/notifications').then(r => r.json()).catch(() => ({ items: [] })),
        fetch('/api/quests/time/active').then(r => r.json()).catch(() => ({ children: [] })),
      ]).then(([notifs, timers]) => {
        if (!live) return
        const waiting = (notifs.items ?? []).length > 0
        const onScreen = (timers.children ?? []).some(
          (k: { session?: unknown; request?: unknown }) => k.session || k.request,
        )
        setBusy(waiting || onScreen)
      })
    }
    refresh()
    // Same cadence and the same wake ups the two children already use, so the
    // wrapper can never be a step behind what it is wrapping.
    const id = setInterval(refresh, 15000)
    const onVis = () => { if (!document.hidden) refresh() }
    window.addEventListener(NOTIFS_CHANGED_EVENT, refresh)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      live = false
      clearInterval(id)
      window.removeEventListener(NOTIFS_CHANGED_EVENT, refresh)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  // The first paint, before either read has answered. Holds the height of the
  // calm line so the page does not jump once it knows, and says nothing while
  // it does not know: a slot that guesses "all clear" and then contradicts
  // itself half a second later is worse than one that waits.
  if (busy === null) return <div style={{ height: 46, marginBottom: 14 }} aria-hidden />

  if (!busy) {
    return (
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16,
          padding: '13px 16px', marginBottom: 14,
        }}
      >
        <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', color: '#2F8F6B' }}>✓</span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
          Nothing waiting on you right now.
        </span>
      </div>
    )
  }

  // Both, in this order, because a running timer is happening NOW and a queue
  // of approvals has been happening for a while. Each still decides its own
  // rows; this only decides that the slot exists.
  return (
    <>
      <LiveTimerChip />
      <WaitingOnYou />
    </>
  )
}
