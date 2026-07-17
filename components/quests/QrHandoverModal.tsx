'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

// The fastest hand over: a big QR the child's own phone or tablet scans right
// there in the room, so the grown up watches their app open on the child's
// screen in seconds, nothing typed, nothing installed. Copy and message stay as
// the fallback for a child who is not in the room. The token is the child's
// private key, so the QR is drawn on device and never sent anywhere.

export default function QrHandoverModal({ token, childName, onClose }: {
  token: string
  childName: string
  onClose: () => void
}) {
  const [qr, setQr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    const u = `${window.location.origin}/k/${token}`
    setUrl(u)
    QRCode.toDataURL(u, { width: 460, margin: 1, color: { dark: '#1A1A2E', light: '#FFFFFF' } })
      .then(setQr).catch(() => setQr(null))
  }, [token])

  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* no clipboard */ }
  }

  async function message() {
    const text = `${childName}, your quests are ready. Tick them off and earn your stars: ${url}`
    try {
      if (navigator.share) await navigator.share({ title: `${childName}'s quests`, text, url })
      else copy()
    } catch { /* cancelled */ }
  }

  const secondary: React.CSSProperties = {
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
    background: '#fff', border: '1.5px solid var(--border)', borderRadius: '13px', padding: '12px',
    cursor: 'pointer', textDecoration: 'none', fontFamily: 'var(--font-display)',
    fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)',
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(26,26,46,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 380, background: 'var(--cream)', borderRadius: '26px', padding: '24px 22px', boxShadow: '0 24px 60px -18px rgba(26,26,46,0.45)', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>Scan to open</span>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '16px', color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1, margin: '0 0 16px' }}>
          Open {childName}&apos;s app on their phone
        </h2>

        <div style={{ background: '#fff', borderRadius: '20px', padding: '16px', display: 'inline-block', boxShadow: '0 5px 0 rgba(26,26,46,0.08)', marginBottom: '14px' }}>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt={`QR code to open ${childName}'s app`} width={230} height={230} style={{ display: 'block', width: 230, height: 230 }} />
          ) : (
            <div style={{ width: 230, height: 230, background: 'var(--cream)', borderRadius: '10px' }} />
          )}
        </div>

        <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px', maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
          Point {childName}&apos;s phone or tablet camera at this. Their app opens straight away, nothing to type, nothing to install.
        </p>

        <div style={{ display: 'flex', gap: '9px' }}>
          <button onClick={copy} style={secondary}>{copied ? 'Copied ✓' : 'Copy link'}</button>
          <button onClick={message} style={{ ...secondary, background: 'var(--terracotta)', border: 'none', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>Send by message</button>
        </div>
      </div>
    </div>
  )
}
