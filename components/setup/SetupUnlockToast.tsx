'use client'

import { useEffect, useState } from 'react'
import type { SetupFlags } from './SetupPath'
import { POPUP_DELAY, openPopup, closePopup, whenClear } from '@/lib/ui/popupQueue'

// The moment a setup step actually finishes deserves its own plain
// confirmation of what just switched on, not a silent fold into a
// generic "all done" line. Detected by comparing this load's flags
// against the last ones seen, stored locally, so a step that flips
// from off to on gets its one specific explainer, once.

const UNLOCK_COPY: Record<keyof SetupFlags, string> = {
  quests: 'Family Quests are live. Everyday jobs now earn stars, and the stars buy the screen time you both agreed.',
  daily: 'Your daily practice has started. Two minutes a day is the whole habit, and it just began.',
  push: 'Check ins are on. From now on we nudge you right at the moments your child actually faces screens.',
  school: 'School routines are set. Whatever you added will remind you, and your child too if you switch that on, every time it comes round.',
  childLink: 'Their phone link is ready. Send it by message and their quests open like a mini app, nothing to install.',
  agreement: 'Your family agreement is signed. It is what the stars buy, and Friday brings a quick check on how the week went against it.',
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
      {/* Warm and light, in the brand butter, never a stark black box. The
          check sits in a soft butter chip, and there is a real cross to shut
          it, as well as a tap anywhere on the card. */}
      <div
        style={{
          position: 'relative', background: '#fff', color: 'var(--ink)',
          border: '1.5px solid var(--border)', borderRadius: '18px',
          padding: '15px 44px 15px 15px',
          boxShadow: '0 12px 34px -10px rgba(26,26,46,0.22)',
          display: 'flex', gap: '11px', alignItems: 'flex-start', cursor: 'pointer',
        }}
        onClick={dismiss}
      >
        <span style={{
          flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
          background: 'var(--terracotta-lt)', border: '1px solid var(--terracotta)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '15px', lineHeight: 1, color: 'var(--terracotta-dark)', fontWeight: 900,
        }}>✓</span>
        <span style={{ fontSize: '14.5px', lineHeight: 1.5, fontWeight: 600, color: 'var(--ink)' }}>{queue[0]}</span>
        <button
          type="button"
          aria-label="Close"
          onClick={(e) => { e.stopPropagation(); dismiss() }}
          style={{
            position: 'absolute', top: '9px', right: '9px',
            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
            background: 'var(--cream)', border: '1px solid var(--border)',
            color: 'var(--ink-muted)', fontSize: '14px', lineHeight: 1, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>
      </div>
    </div>
  )
}
