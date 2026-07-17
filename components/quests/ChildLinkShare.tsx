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
  const youngest = useMode ? useMode === 'coview' : (ageBand === '4-7' || ageBand === '8-10')

  useEffect(() => {
    const u = `${window.location.origin}/k/${token}`
    setUrl(u)
    QRCode.toDataURL(u, { width: 220, margin: 1, color: { dark: '#1A1A2E', light: '#FFFFFF' } })
      .then(setQr).catch(() => setQr(null))
  }, [token])

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
        More ways to share
      </div>
      <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
        No phone or no WhatsApp? Any of these work. For a little one, use it together on your own device.
      </p>

      {/* How this child uses it, changeable any time. */}
      {onSetMode && (
        <div style={{ display: 'flex', gap: '7px', marginBottom: '14px' }}>
          {([['own', '📱 Own app'], ['coview', '👀 Together']] as const).map(([m, label]) => (
            <button key={m} onClick={() => onSetMode(m)} aria-pressed={youngest === (m === 'coview')} style={{
              flex: 1, padding: '9px', borderRadius: '11px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12.5px', color: 'var(--ink)',
              background: (youngest === (m === 'coview')) ? 'var(--terracotta-lt)' : '#fff',
              border: (youngest === (m === 'coview')) ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* Co-view first for the youngest, who have no device of their own. */}
      {youngest && (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ ...btn, width: '100%', justifyContent: 'center', background: 'var(--terracotta)', border: 'none', color: 'var(--ink)', boxShadow: '0 4px 0 var(--terracotta-dark)', fontWeight: 800, fontSize: '14px', marginBottom: '14px' }}>
          👀 Open {childName}&apos;s app here and use it together
        </a>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt={`QR code to open ${childName}'s app`} width={200} height={200} style={{ borderRadius: '14px', border: '1.5px solid var(--border)' }} />
        ) : (
          <div style={{ width: 200, height: 200, borderRadius: '14px', background: 'var(--cream)', border: '1.5px solid var(--border)' }} />
        )}
        <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.45, margin: 0, maxWidth: 260 }}>
          Point {childName}&apos;s tablet camera at this to open their app. No typing, nothing to install.
        </p>
      </div>

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
