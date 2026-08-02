'use client'

import { useState } from 'react'
import QrHandoverModal from '@/components/quests/QrHandoverModal'

// Share the QR code, and mean it: the code opens right here.
//
// Every one of these buttons used to be a link to the Quests page, where the
// parent then had to find the share tab and press share again. A button that
// says share the QR code and does not show a QR code is a button that lies,
// and it lost people at exactly the step the whole child side depends on.
//
// The child's link is created on demand, the same call the Quests share tab
// makes, so a family that never presses this never has a token sitting unused.

export default function ShareQrButton({
  childId,
  childName,
  label = 'Share the QR code',
  style,
}: {
  childId: string
  childName?: string | null
  label?: string
  style?: React.CSSProperties
}) {
  const [token, setToken] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  const name = childName && childName !== 'Your child' ? childName : 'your child'

  async function open() {
    if (busy || token) return
    setBusy(true)
    setFailed(false)
    try {
      const r = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'link', child_id: childId }),
      })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j?.token) setToken(j.token as string)
      else setFailed(true)
    } catch { setFailed(true) }
    setBusy(false)
  }

  return (
    <>
      <button
        onClick={open}
        disabled={busy}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
          borderRadius: 16, padding: '14px 24px', cursor: busy ? 'default' : 'pointer',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
          boxShadow: '0 5px 0 var(--terracotta-dark)', opacity: busy ? 0.75 : 1,
          ...style,
        }}
      >
        {busy ? 'One moment' : label}
      </button>

      {failed && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--terracotta-dark)', fontWeight: 700, margin: '10px 0 0' }}>
          That did not come through. Have another go, or find the code any time in Quests.
        </p>
      )}

      {token && (
        <QrHandoverModal token={token} childName={name} onClose={() => setToken(null)} />
      )}
    </>
  )
}
