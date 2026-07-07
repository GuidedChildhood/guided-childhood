'use client'

import { useEffect, useState } from 'react'
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
  school: 'You are connected. School emails now come straight into your platform, PE kit days, forms and reminders will show up on Home, and you can send any of them straight to your child as a task.',
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
      <div
        onClick={dismiss}
        style={{
          background: 'var(--deep-teal)', color: '#fff', borderRadius: '16px',
          padding: '16px 18px', cursor: 'pointer', boxShadow: '0 10px 34px rgba(23,60,70,0.35)',
          display: 'flex', gap: '10px', alignItems: 'flex-start',
        }}
      >
        <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>✓</span>
        <span style={{ fontSize: '14.5px', lineHeight: 1.5, fontWeight: 600 }}>{queue[0]}</span>
      </div>
    </div>
  )
}
