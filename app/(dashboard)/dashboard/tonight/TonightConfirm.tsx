'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// The one tap. Posts the confirmation, then walks back to the road so the
// rung is green the moment home paints (router.refresh, no cached copy).

export default function TonightConfirm({
  childId, mechanism, href, hrefLabel, done,
}: {
  childId: string
  mechanism: string
  href: string
  hrefLabel: string
  done: boolean
}) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'failed'>(done ? 'done' : 'idle')
  const router = useRouter()

  async function confirm() {
    if (state === 'busy' || state === 'done') return
    setState('busy')
    try {
      const res = await fetch('/api/daily/tonight', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, mechanism }),
      })
      if (!res.ok) { setState('failed'); return }
      setState('done')
      router.refresh()
      setTimeout(() => router.push(`/dashboard?child=${childId}`), 700)
    } catch { setState('failed') }
  }

  const BTN: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', padding: '15px 18px', borderRadius: 16, cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
    border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)',
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <button
        onClick={confirm}
        disabled={state === 'busy' || state === 'done'}
        style={{
          ...BTN,
          background: state === 'done' ? 'var(--retro-green)' : 'var(--terracotta)',
          color: state === 'done' ? '#fff' : 'var(--ink)',
          opacity: state === 'busy' ? 0.7 : 1,
        }}
      >
        {state === 'done' ? 'On for tonight ✓' : state === 'busy' ? 'Saving…' : state === 'failed' ? 'Try again' : 'It is on tonight'}
      </button>
      <Link href={href} style={{ ...BTN, background: '#fff', color: 'var(--ink)', textDecoration: 'none', fontSize: 'var(--text-md)' }}>
        {hrefLabel}
      </Link>
      {state === 'failed' && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: 0, textAlign: 'center' }}>
          That did not save. Check the connection and tap again.
        </p>
      )}
    </div>
  )
}
