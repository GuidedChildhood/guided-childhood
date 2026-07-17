'use client'

import { useEffect, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import type { SetupFlags } from './SetupPath'

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
    if (justUnlocked.length > 0) {
      setQueue(justUnlocked)
      requestAnimationFrame(() => setEntered(true))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (queue.length === 0) return null

  function dismiss() {
    setEntered(false)
    setTimeout(() => setQueue(q => q.slice(1)), 300)
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
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px',
          }}>Now on</span>
          <span style={{ display: 'block', fontSize: '14.5px', lineHeight: 1.5, fontWeight: 600, color: 'var(--ink)' }}>{queue[0]}</span>
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={(e) => { e.stopPropagation(); dismiss() }}
          style={{
            position: 'absolute', top: '11px', right: '11px',
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
