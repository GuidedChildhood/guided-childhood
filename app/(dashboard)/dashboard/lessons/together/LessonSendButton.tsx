'use client'

import { useState } from 'react'

// Send a watch together lesson to the child's device. The lesson already
// lives on their quest link as an adventure, so this pings their phone
// pointing straight at it (the ping deep links to their own quests). One
// tap, best effort, and it says so plainly if their phone is not set up.

export default function LessonSendButton({
  childId, childName, title,
}: {
  childId: string | null
  childName: string
  title: string
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'nolink'>('idle')

  async function send() {
    if (!childId || state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/quests/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, message: `New lesson to play: ${title} ⭐` }),
      })
      const data = await res.json().catch(() => ({}))
      setState(data?.sent > 0 ? 'sent' : 'nolink')
      setTimeout(() => setState('idle'), 4000)
    } catch { setState('idle') }
  }

  const label = state === 'sending' ? 'Sending...'
    : state === 'sent' ? `Sent to ${childName} ✓`
    : state === 'nolink' ? 'Their phone is not set up yet'
    : `📲 Send to ${childName}`

  return (
    <button
      onClick={send}
      disabled={!childId || state === 'sending'}
      title={childId ? `Ping ${childName} to play this on their quests` : 'Add your child first'}
      style={{
        background: state === 'sent' ? 'var(--tint-sage)' : '#fff',
        border: '1.5px solid var(--border)', borderRadius: '11px',
        padding: '8px 12px', cursor: childId && state !== 'sending' ? 'pointer' : 'default',
        fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, color: 'var(--ink)',
        whiteSpace: 'nowrap', opacity: childId ? 1 : 0.55,
      }}
    >
      {label}
    </button>
  )
}
