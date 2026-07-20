'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

// More ways to hand the child's app over, for families with no WhatsApp, no
// child phone, or a very young child. A private QR the child's own tablet
// scans, a copy link, an email, and the co-view option: open the child app
// right here on the grown up's device and use it together. The token is the
// child's private key, so the QR is generated on device, never sent to any
// outside service.

export default function ChildLinkShare({ token, childName, ageBand, useMode, onSetMode }: { token: string; childName: string; ageBand?: string | null; useMode?: string | null; onSetMode?: (m: 'own' | 'coview') => void }) {
  const [qr, setQr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')
  // Co-view leads when it is set, else falls back to parent led for under 11
  // (4 to 7 and 8 to 10), the science aligned default we recommend.
  const savedYoungest = useMode ? useMode === 'coview' : (ageBand === '4-7' || ageBand === '8-10')
  // Reflect the tap the instant it happens, before the save round trip lands,
  // so choosing Together never feels dead. The persisted value takes over once
  // the parent state catches up.
  const [pending, setPending] = useState<'own' | 'coview' | null>(null)
  const youngest = pending ? pending === 'coview' : savedYoungest

  function choose(m: 'own' | 'coview') {
    setPending(m)
    onSetMode?.(m)
  }

  useEffect(() => {
    const u = `${window.location.origin}/k/${token}`
    setUrl(u)
    QRCode.toDataURL(u, { width: 220, margin: 1, color: { dark: '#1A1A2E', light: '#FFFFFF' } })
      .then(setQr).catch(() => setQr(null))
  }, [token])

  // Once the saved mode matches the tapped one, drop the optimistic override.
  useEffect(() => {
    if (pending && savedYoungest === (pending === 'coview')) setPending(null)
  }, [pending, savedYoungest])

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* no clipboard */ }
  }

  const btn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#fff',
    border: '1.5px solid var(--border)', borderRadius: '12px', padding: '10px 14px',
    cursor: 'pointer', textDecoration: 'none', fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: '13px', color: 'var(--ink)',
  }

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        Share to {childName}
      </div>

      {/* The QR is the hero: the fastest hand over there is. */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'var(--cream)', borderRadius: '16px', padding: '18px 16px 16px', marginBottom: '14px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--ink)', textAlign: 'center', lineHeight: 1.3, margin: 0 }}>
          Scan with {childName}&apos;s device
        </p>
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt={`QR code to open ${childName}'s app`} width={230} height={230} style={{ borderRadius: '16px', border: '1.5px solid var(--border)', background: '#fff' }} />
        ) : (
          <div style={{ width: 230, height: 230, borderRadius: '16px', background: '#fff', border: '1.5px solid var(--border)' }} />
        )}
        <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.45, margin: 0, maxWidth: 280 }}>
          Point {childName}&apos;s camera at this and their app opens. No typing, nothing to install.
        </p>
      </div>

      {/* How this child uses it, changeable any time. */}
      {onSetMode && (
        <div style={{ display: 'flex', gap: '7px', marginBottom: '12px' }}>
          {([['own', '📱 Own app'], ['coview', '👀 Together']] as const).map(([m, label]) => (
            <button key={m} onClick={() => choose(m)} aria-pressed={youngest === (m === 'coview')} style={{
              flex: 1, padding: '9px', borderRadius: '11px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12.5px', color: 'var(--ink)',
              background: (youngest === (m === 'coview')) ? 'var(--terracotta-lt)' : '#fff',
              border: (youngest === (m === 'coview')) ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* Co-view for the youngest, who have no device of their own. */}
      {youngest && (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ ...btn, width: '100%', justifyContent: 'center', background: 'var(--terracotta)', border: 'none', color: 'var(--ink)', boxShadow: '0 4px 0 var(--terracotta-dark)', fontWeight: 800, fontSize: '14px', marginBottom: '12px' }}>
          👀 Open {childName}&apos;s app here and use it together
        </a>
      )}

      {/* The quieter ways, under the hero: copy, email, open here. */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={copy} style={btn}>{copied ? 'Copied ✓' : '🔗 Copy link'}</button>
        <a href={`mailto:?subject=${encodeURIComponent(`${childName}'s quests`)}&body=${encodeURIComponent(`Open this on ${childName}'s device to see their quests and earn stars: ${url}`)}`} style={btn}>✉️ Email it</a>
        {!youngest && (
          <a href={url} target="_blank" rel="noopener noreferrer" style={btn}>👀 Open on this device</a>
        )}
      </div>
    </div>
  )
}
