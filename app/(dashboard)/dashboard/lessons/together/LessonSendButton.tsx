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
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'nodevice' | 'noserver'>('idle')

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
      // Three honest outcomes: delivered, the child's phone is not set up
      // for pings yet (the lesson is on their quests either way), or the
      // server is missing its notification keys (a deploy setting).
      if (!res.ok) setState('noserver')
      else if (data?.sent > 0) setState('sent')
      else setState('nodevice')
      setTimeout(() => setState('idle'), 5000)
    } catch { setState('noserver') }
  }

  const label = state === 'sending' ? 'Sending...'
    : state === 'sent' ? `Pinged ${childName} ✓`
    : state === 'nodevice' ? 'On their quests (no ping set up)'
    : state === 'noserver' ? 'Pings not switched on yet'
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
