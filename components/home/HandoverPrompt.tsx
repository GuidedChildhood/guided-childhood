'use client'

import { useState } from 'react'
import QrHandoverModal from '@/components/quests/QrHandoverModal'

// The one time ask: shall we put their side of this on their own phone?
//
// It matters because half the product is over there. The jobs are ticked
// there, the device time is earned there, the printables are asked for there.
// Today the QR code is buried on the Quests page where only a parent who goes
// looking will find it, so a family can run one side of a two sided thing for
// weeks without knowing.
//
// Three things make it fair rather than pushy. It never appears on the first
// open, because the first open already carries the welcome. Sending the link
// sits equal to the QR code, because the parent is holding the phone showing
// the code and cannot scan it with the same device, so a QR only ask is a dead
// end for any child who is not stood right there. And "we do it on paper" is a
// real answer that ends the asking for good, not a snooze.

export type HandoverChild = { id: string; name: string | null }

export default function HandoverPrompt({
  child,
  onDone,
}: {
  child: HandoverChild
  onDone: (choice: 'paper' | 'linked' | 'later') => void
}) {
  const [token, setToken] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  const name = child.name && child.name !== 'Your child' ? child.name : 'your child'

  // Their link is created on demand, exactly as the Quests share tab does it,
  // so a family that never gets here never has a token sitting unused.
  async function setItUp() {
    if (busy) return
    setBusy(true)
    setFailed(false)
    try {
      const r = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'link', child_id: child.id }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j?.token) { setFailed(true); setBusy(false); return }
      setToken(j.token as string)
      // Answered. Whether the child scans it in the next minute or the next
      // week, the parent has done their part and should never be asked again.
      void fetch('/api/handover', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'linked' }),
      })
    } catch { setFailed(true) }
    setBusy(false)
  }

  async function onPaper() {
    try {
      await fetch('/api/handover', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'paper' }),
      })
    } catch { /* the choice is theirs either way, the ask cap catches it */ }
    onDone('paper')
  }

  // The QR and the send link, once the token exists.
  if (token) {
    return <QrHandoverModal token={token} childName={name} onClose={() => onDone('linked')} />
  }

  const reason = (emoji: string, title: string, body: string) => (
    <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 9 }}>
      <span aria-hidden style={{ flexShrink: 0, fontSize: 19, lineHeight: 1.3 }}>{emoji}</span>
      <span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5, color: 'var(--ink)' }}>{title}</span>
        <span style={{ display: 'block', fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 1 }}>{body}</span>
      </span>
    </li>
  )

  return (
    <div
      onClick={() => onDone('later')}
      role="dialog"
      aria-label="Their own phone"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(26,26,46,0.45)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440, margin: 'auto',
          background: '#fff', border: '1.5px solid var(--border)',
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 24px 60px -18px rgba(26,26,46,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '16px 18px 14px', background: 'var(--terracotta-lt)' }}>
          <span aria-hidden style={{
            flexShrink: 0, width: 42, height: 42, borderRadius: 13, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21,
          }}>📲</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              One thing worth doing
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              Put {name}&apos;s side on their phone
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 18px 4px' }}>
          <p style={{ fontSize: 17, color: 'var(--ink)', fontWeight: 600, lineHeight: 1.5, margin: '0 0 13px' }}>
            Jobs, quests, printables and their star bank, on their own device. Nothing to install and nothing for them to sign up for.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {reason('✅', 'They tick their own jobs', 'You stop being the one chasing and checking. They do their side, you just approve.')}
            {reason('⏳', 'They ask for screen time', 'Instead of arguing for it. The stars they have earned decide the answer, not the mood in the room.')}
            {reason('🖨️', 'Sheets and lessons land with them', 'Straight onto their device, at the age they are actually at.')}
            {reason('⭐', 'They can see their stars', 'A bank that goes up is the whole reason a child keeps doing the jobs.')}
          </ul>
        </div>

        <div style={{ margin: '13px 18px 0', background: 'var(--tint-sage)', borderRadius: 14, padding: '11px 13px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
            What they get, and what they do not
          </div>
          <p style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
            Their view has no chat, no browsing and no account. It opens on a private link you send or they scan, and you can see everything on it.
          </p>
        </div>

        {failed && (
          <p style={{ margin: '10px 18px 0', fontSize: 15, color: 'var(--terracotta-dark)', fontWeight: 700 }}>
            That did not go through. Have another go, or find it any time in Quests.
          </p>
        )}

        <div style={{ padding: '14px 18px 18px' }}>
          <button
            onClick={setItUp}
            disabled={busy}
            style={{
              width: '100%', padding: '14px', cursor: busy ? 'default' : 'pointer',
              background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
              borderRadius: 16, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18,
              boxShadow: '0 5px 0 var(--terracotta-dark)', opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? 'One moment' : 'Set it up, code or link'}
          </button>

          {/* An equal choice, not a dismissal. Plenty of families will not give
              a child a phone, and we should be the platform that says fine. */}
          <button
            onClick={onPaper}
            style={{
              width: '100%', marginTop: 8, padding: '13px', cursor: 'pointer',
              background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)',
              borderRadius: 16, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
            }}
          >
            We do it on paper
          </button>
          <p style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.45, margin: '8px 0 0', textAlign: 'center' }}>
            Print the quest cards and tick them at the table. It all still counts, and we will not ask again.
          </p>

          <button
            onClick={() => onDone('later')}
            style={{
              width: '100%', marginTop: 10, padding: '8px', cursor: 'pointer',
              background: 'none', border: 'none', color: 'var(--ink-muted)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5,
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
