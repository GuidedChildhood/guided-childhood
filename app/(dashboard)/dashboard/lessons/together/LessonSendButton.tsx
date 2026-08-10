'use client'

import { useState } from 'react'

// Send a watch together lesson to the child's device. The lesson already
// lives on their quest link as an adventure, so this pings their phone
// pointing straight at it (the ping deep links to their own quests). One
// tap, best effort, and it says so plainly if their phone is not set up.

export default function LessonSendButton({
  childId, childName, title, message, idleLabel,
}: {
  childId: string | null
  childName: string
  title: string
  /** Overrides the default "New lesson to play" wording. The Social Media
      Ready module uses it, because nine lessons are not "a lesson". */
  message?: string
  /** Overrides the idle button text, for the same reason. */
  idleLabel?: string
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'nodevice' | 'noserver' | 'quiet'>('idle')

  async function send() {
    if (!childId || state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/quests/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, message: message ?? `New lesson to play: ${title} ⭐` }),
      })
      const data = await res.json().catch(() => ({}))
      // Four honest outcomes now: delivered, held because it is night on the
      // child's side, the child's phone is not set up for pings yet (the
      // lesson is on their quests either way), or the server is missing its
      // notification keys (a deploy setting).
      //
      // quiet_hours is checked BEFORE the zero, because a held push and an
      // unsubscribed phone both come back as sent 0 and telling a parent to go
      // and set up a phone that is already set up is worse than saying nothing.
      if (!res.ok) setState('noserver')
      else if (data?.reason === 'quiet_hours') setState('quiet')
      else if (data?.sent > 0) setState('sent')
      else setState('nodevice')
      setTimeout(() => setState('idle'), 5000)
    } catch { setState('noserver') }
  }

  const label = state === 'sending' ? 'Sending...'
    : state === 'sent' ? `Pinged ${childName} ✓`
    : state === 'quiet' ? 'On their quests, no buzz after 7pm'
    : state === 'nodevice' ? 'On their quests (no ping set up)'
    : state === 'noserver' ? 'Pings not switched on yet'
    : idleLabel ?? `📲 Send to ${childName}`

  return (
    <button
      onClick={send}
      disabled={!childId || state === 'sending'}
      title={childId ? `Ping ${childName} to play this on their quests` : 'Add your child first'}
      style={{
        background: state === 'sent' ? 'var(--tint-sage)' : '#fff',
        border: '1.5px solid var(--border)', borderRadius: '11px',
        padding: '8px 12px', cursor: childId && state !== 'sending' ? 'pointer' : 'default',
        fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)',
        whiteSpace: 'nowrap', opacity: childId ? 1 : 0.55,
      }}
    >
      {label}
    </button>
  )
}
