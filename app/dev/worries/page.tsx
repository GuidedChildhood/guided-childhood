'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import WorryPicker from '@/components/onboarding/WorryPicker'

// Dev only fixture: the last question of setup, without an account.
//
//   /dev/worries          nothing ticked
//   /dev/worries?on=3     three ticked, for the chosen state
//   /dev/worries?mark=1   with the "we start here" marker, as the public quiz
//                         draws it (setup passes no primary, so the marker row
//                         is not reserved there and the tiles stay shorter)
//
// The real screen sits behind sign up, four screens deep, so this is the only
// way to look at it at 390 and 1200 before it ships. It draws the same
// WorryPicker the wizard draws, so there is nothing here that can be right
// while the real one is wrong. Never reachable in production.

export default function WorriesFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  // The query is read AFTER the first paint, never during it. Reading
  // window in a useState initialiser renders one thing on the server and
  // another in the browser, and React throws the whole tree away and warns.
  const [picked, setPicked] = useState<string[]>([])
  const [mark, setMark] = useState(false)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('on') === '3') setPicked(['bedtime_screens', 'ai_chatbots', 'wont_put_down'])
    if (q.get('mark') === '1') setMark(true)
  }, [])
  const toggle = (id: string) =>
    setPicked(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]))

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--app-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px 20px 32px' }}>
      <div style={{ maxWidth: 520, width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          What is hard right now?
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px' }}>
          Pick as many or as few as you like. These become the worries you rate on your first check in.
        </p>
        <div style={{ marginBottom: '16px' }}>
          <WorryPicker selected={picked} onToggle={toggle} primary={mark ? (picked[0] ?? null) : undefined} />
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, textAlign: 'center', margin: 0 }}>
          We keep asking as things come up, so this does not have to be right first time.
        </p>
      </div>
    </div>
  )
}
