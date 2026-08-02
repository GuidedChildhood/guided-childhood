'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// A quiet line under the handover nudge: if this child has no phone, the parent
// says so once and the app stops asking, committing to the fridge and parent
// managed flow. Sets children.no_phone through the parent scoped route, then
// refreshes so the nudge is gone.

export default function NoPhoneButton({ childId, childName }: { childId: string; childName: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function set() {
    setBusy(true)
    try {
      await fetch('/api/children/no-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, noPhone: true }),
      })
      router.refresh()
    } catch {
      setBusy(false)
    }
  }

  return (
    <div style={{ textAlign: 'center', margin: '-6px 0 16px' }}>
      <button
        onClick={set}
        disabled={busy}
        style={{
          background: 'none', border: 'none', cursor: busy ? 'default' : 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
          color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: '3px',
          padding: '4px 8px',
        }}
      >
        {busy ? 'Saving...' : `${childName} has no phone, keep it on the fridge`}
      </button>
    </div>
  )
}
