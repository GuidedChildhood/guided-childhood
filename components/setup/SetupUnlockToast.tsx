'use client'

import { useEffect, useState } from 'react'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import type { SetupFlags } from '@/lib/setup/steps'
import { POPUP_DELAY, openPopup, closePopup, whenClear } from '@/lib/ui/popupQueue'

// The moment a setup step actually finishes deserves its own plain
// confirmation of what just switched on, not a silent fold into a
// generic "all done" line. Detected by comparing this load's flags
// against the last ones seen, stored locally, so a step that flips
// from off to on gets its one specific explainer, once.

// Three now rather than seven, matching the Setup Quest. The four that went
// (quests, daily, birthday, school) did not lose their moment, they lost their
// status as setup: jobs and school take their turn under Today, the daily
// practice IS the daily loop, and the birthday is answered at signup.
const UNLOCK_COPY: Record<keyof SetupFlags, string> = {
  agreement: 'Your family agreement is signed. It is what the stars buy, and Friday brings a quick check on how the week went against it.',
  childLink: 'That is their side sorted. Whether it is the code on their phone or the chart on the fridge, they can see what they have earned.',
  homeScreen: 'We are one tap away now, and the check ins can reach you at the hours screens turn up in your house.',
  children: 'That is everybody in. Each child carries their own stage, their own worries and their own check in, so nothing about one of them is answered by the other.',
}

const STORAGE_KEY = 'gc_setup_flags_seen'

export default function SetupUnlockToast({ flags }: { flags: SetupFlags }) {
  const [queue, setQueue] = useState<string[]>([])
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    let previous: Partial<SetupFlags> = {}
    try {
      previous = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    } catch { /* treat as first visit */ }

    const justUnlocked = (Object.keys(flags) as (keyof SetupFlags)[])
      .filter(key => flags[key] && !previous[key])
      .map(key => UNLOCK_COPY[key])

    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags))
    if (justUnlocked.length === 0) return
    // Do not stack on load. Wait a beat after login and until nothing else is
    // up (the welcome sheet goes first), then slide in on its own.
    return whenClear(POPUP_DELAY.toast, () => {
      openPopup('toast')
      setQueue(justUnlocked)
      requestAnimationFrame(() => setEntered(true))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (queue.length === 0) return null

  function dismiss() {
    setEntered(false)
    setTimeout(() => setQueue(q => {
      const rest = q.slice(1)
      if (rest.length === 0) closePopup('toast')
      return rest
    }), 300)
  }

  return (
    <div style={{
      position: 'fixed', left: '50%', top: 'max(16px, env(safe-area-inset-top))',
      transform: entered ? 'translate(-50%, 0)' : 'translate(-50%, -16px)',
      opacity: entered ? 1 : 0,
      transition: 'transform 0.35s ease, opacity 0.35s ease',
      zIndex: 90, width: 'min(94vw, 440px)',
    }}>
      {/* The premium DiGi note: the same butter mark and warm ink as the DiGi
          front door, so a finished setup step reads as DiGi telling you what
          just switched on, clear and premium, never a stark black box. */}
      <div
        style={{
          position: 'relative', background: '#fff', color: 'var(--ink)',
          border: '1.5px solid var(--border)', borderRadius: '22px',
          padding: '17px 46px 17px 17px',
          boxShadow: '0 2px 4px rgba(26,26,46,0.04), 0 18px 42px -12px rgba(26,26,46,0.26)',
          display: 'flex', gap: '13px', alignItems: 'flex-start', cursor: 'pointer',
        }}
        onClick={dismiss}
      >
        <span style={{
          flexShrink: 0, width: 44, height: 44, borderRadius: '14px',
          background: 'var(--terracotta)', boxShadow: '0 4px 0 var(--terracotta-dark)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DigiCharacter mood="happy" size={30} once />
        </span>
        <span style={{ flex: 1, minWidth: 0, paddingTop: '1px' }}>
          <span style={{
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px',
          }}>Now on</span>
          <span style={{ display: 'block', fontSize: 'var(--text-md)', lineHeight: 1.5, fontWeight: 600, color: 'var(--ink)' }}>{queue[0]}</span>
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={(e) => { e.stopPropagation(); dismiss() }}
          style={{
            position: 'absolute', top: '11px', right: '11px',
            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
            background: 'var(--cream)', border: '1px solid var(--border)',
            color: 'var(--ink-muted)', fontSize: 'var(--text-md)', lineHeight: 1, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>
      </div>
    </div>
  )
}
