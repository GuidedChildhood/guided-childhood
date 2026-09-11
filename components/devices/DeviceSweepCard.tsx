'use client'

import { useEffect, useRef, useState } from 'react'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import { currentChildId } from '@/lib/children/current'

// DiGi's fortnightly nudge on the Device Safety Hub: has a new device come into
// the house, and do the settings still match the child's age. It shows at most
// once every two weeks (the server keeps the clock), stamps the clock the
// moment it appears, and quietly thanks the parent when they confirm.
//
// ── TWO BUTTONS THAT DID THE SAME THING (11 September 2026) ────────────────
//
// Justin: "at the moment its confusing as has all checked button and nothing
// new? make this make sense and easy to add devices."
//
// He was right in the most literal way. "All checked" and "Nothing new" were
// both onClick={confirm}: the same handler, the same outcome, a real decision
// put to a parent that could not change anything. A choice with no consequence
// is worse than no choice, because someone stops and thinks about it.
//
// There is a genuine pair underneath it, and it is the pair the question
// implies. "Any new devices?" has exactly two answers: YES, which must lead
// straight to the list so they can add it, and NO, which is the confirm. So the
// primary button now goes to the list and the quiet one closes the card.
//
// ── AND IT NEVER ASKS BEFORE THERE IS A LIST ──────────────────────────────
//
// "it should have add devices here and only ask every 2 weeks if any new
// devices and the list below is correct". The gate for that lives in the API:
// no devices recorded, no sweep, because a re check needs something to re
// check and until then the add card below is the whole job.
//
// ── THE FOCUS WAS BEING COMPUTED AND THROWN AWAY ──────────────────────────
//
// The route works out whether to lead with a birthday ("Alma is 11 now"), with
// the console in the house and the games on it, or with the plain nudge, and it
// returns that as `focus` with an Ask DiGi question attached. This component's
// type stopped at childName, so every bit of it was discarded and every family
// got the generic line. It is read now, which is most of what makes this card
// worth a fortnight of a parent's attention rather than a chore.

type Focus = {
  kind: 'birthday' | 'games' | 'generic'
  headline: string
  sub: string
  chat?: { label: string; q: string }
}
type Sweep = { due: boolean; childId?: string; childName?: string | null; focus?: Focus }

export default function DeviceSweepCard() {
  const [sweep, setSweep] = useState<Sweep | null>(null)
  const [done, setDone] = useState(false)
  const seenSent = useRef(false)

  useEffect(() => {
    fetch(`/api/devices/sweep${currentChildId() ? `?child=${currentChildId()}` : ''}`)
      .then(r => r.json())
      .then((d: Sweep) => { if (d?.due) setSweep(d) })
      .catch(() => { /* stay quiet on error */ })
  }, [])

  // Start the fortnight clock the moment the card renders, so it will not
  // reappear on the next visit whatever the parent taps.
  useEffect(() => {
    if (!sweep?.due || !sweep.childId || seenSent.current) return
    seenSent.current = true
    fetch('/api/devices/sweep', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'seen', childId: sweep.childId }),
    }).catch(() => { /* best effort */ })
  }, [sweep])

  const confirm = () => {
    if (sweep?.childId) {
      fetch('/api/devices/sweep', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'done', childId: sweep.childId }),
      }).catch(() => { /* best effort */ })
    }
    setDone(true)
  }

  if (!sweep?.due) return null

  const name = sweep.childName
  // The server already decided what is worth leading with. Fall back to the
  // plain question only when an older deployment sends no focus at all.
  const headline = sweep.focus?.headline
    ?? (name ? `Any new devices in the house for ${name}?` : 'Any new devices in the house?')
  const sub = sweep.focus?.sub
    ?? 'A new phone, console or tablet? Add it below, and give the settings a look so they still match their age.'
  const chat = sweep.focus?.chat

  // YES leads to the list. The card sits directly above it, so this is a scroll
  // rather than a navigation: the parent keeps their place and the thing they
  // came to do is under their thumb.
  const goAdd = () => {
    document.getElementById('your-screens')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px', boxShadow: '0 4px 0 var(--ink)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: done ? 0 : '12px' }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'var(--terracotta-lt)', border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter size={26} mood={done ? 'happy' : 'idle'} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            DiGi, every two weeks
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.35 }}>
            {done
              ? 'Lovely. DiGi will check in again in two weeks.'
              : headline}
          </div>
          {!done && (
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '3px' }}>
              {sub}
            </div>
          )}
        </div>
      </div>
      {!done && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* YES and NO, and they now do different things. The primary takes
              them to the list to add it; the quiet one says nothing arrived and
              closes the card for a fortnight. */}
          <button
            onClick={goAdd}
            style={{ padding: '11px 17px', borderRadius: '12px', border: '2px solid var(--ink)', cursor: 'pointer', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', boxShadow: '0 4px 0 var(--ink)' }}
          >
            Yes, add it
          </button>
          <button
            onClick={confirm}
            style={{ padding: '11px 17px', borderRadius: '12px', border: '2px solid var(--ink)', cursor: 'pointer', background: 'var(--cream)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', boxShadow: '0 4px 0 var(--ink)' }}
          >
            Nothing new
          </button>
          {/* The question DiGi worked out for this family, when there is one:
              what changes at their new age, or what to know about the games on
              the console we know is in the house. */}
          {chat && (
            <a
              href={`/dashboard/digi?q=${encodeURIComponent(chat.q)}`}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)', textDecoration: 'underline', padding: '11px 2px' }}
            >
              {chat.label}
            </a>
          )}
        </div>
      )}
    </div>
  )
}
