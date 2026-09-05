'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { SITE_URL } from '@/lib/config/site'

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
    // THE DOMAIN, NEVER THE PARENT'S CURRENT ADDRESS.
    //
    // Justin, 12 August 2026, holding a phone: "we need to fix the child app
    // so it is not a vercel link but the domain."
    //
    // Built from window.location.origin, a child was handed whatever address
    // the PARENT happened to be on at the moment they shared. Share from a
    // preview deployment and the link on that child's home screen is a preview
    // URL, and this is not a page a child visits once: it goes on the home
    // screen and stays for years, it is what every push notification opens,
    // and a child cannot fix it themselves. Preview deployments get deleted,
    // and when one is, that child is cut off with no error a parent could
    // diagnose.
    //
    // SITE_URL is the one place the live origin is written down. The QR and
    // the copied text are built from the same string, so they can never
    // disagree either.
    const u = `${SITE_URL}/k/${token}`
    setUrl(u)
    // Drawn well above display size so it stays sharp when a camera is held up
    // to it from the other side of a kitchen table.
    QRCode.toDataURL(u, { width: 640, margin: 1, color: { dark: '#1A1A2E', light: '#FFFFFF' } })
      .then(setQr).catch(() => setQr(null))
  }, [token])

  // Once the saved mode matches the tapped one, drop the optimistic override.
  useEffect(() => {
    if (pending && savedYoungest === (pending === 'coview')) setPending(null)
  }, [pending, savedYoungest])

  const invite = `${childName}, your quests are ready. Tick them off and earn your stars: ${url}`

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* no clipboard */ }
  }

  const btn: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#fff',
    border: '2px solid var(--ink)', borderRadius: '12px', padding: '10px 14px',
    cursor: 'pointer', textDecoration: 'none', fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
  }

  return (
    <div style={{ background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)', borderRadius: '18px', padding: '18px 20px', marginBottom: '22px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        Share to {childName}
      </div>

      {/* The QR is the hero: the fastest hand over there is. */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'var(--cream)', borderRadius: '16px', padding: '18px 16px 16px', marginBottom: '14px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', textAlign: 'center', lineHeight: 1.3, margin: 0 }}>
          Scan with {childName}&apos;s device
        </p>
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt={`QR code to open ${childName}'s app`} style={{ width: 'min(300px, 66vw)', height: 'min(300px, 66vw)', borderRadius: '16px', border: '2px solid var(--ink)', background: '#fff' }} />
        ) : (
          <div style={{ width: 'min(300px, 66vw)', height: 'min(300px, 66vw)', borderRadius: '16px', background: '#fff', border: '2px solid var(--ink)' }} />
        )}
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.45, margin: 0, maxWidth: 280 }}>
          Point {childName}&apos;s camera at this and their app opens. No typing, nothing to install.
        </p>
      </div>

      {/* How this child uses it, changeable any time. */}
      {onSetMode && (
        <div style={{ display: 'flex', gap: '7px', marginBottom: '12px' }}>
          {([['own', '📱 Own app'], ['coview', '👀 Together']] as const).map(([m, label]) => (
            <button key={m} onClick={() => choose(m)} aria-pressed={youngest === (m === 'coview')} style={{
              flex: 1, padding: '9px', borderRadius: '11px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
              background: (youngest === (m === 'coview')) ? 'var(--terracotta-lt)' : '#fff',
              border: (youngest === (m === 'coview')) ? '1.5px solid var(--terracotta)' : '2px solid var(--ink)',
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* Co-view for the youngest, who have no device of their own. */}
      {youngest && (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ ...btn, width: '100%', justifyContent: 'center', background: 'var(--terracotta)', border: 'none', color: 'var(--ink)', boxShadow: '0 4px 0 var(--terracotta-dark)', fontWeight: 800, fontSize: 'var(--text-md)', marginBottom: '12px' }}>
          👀 Open {childName}&apos;s app here and use it together
        </a>
      )}

      {/* THE THREE NAMED CHANNELS, under the hero.

          Each one carries NO recipient on purpose. wa.me with no number opens
          WhatsApp's own contact picker and sms: with no number opens Messages
          with the words already written, so neither depends on us having
          stored the child's number first. That was one more setup step that
          could be missing or wrong at the moment a parent is trying to hand
          something over.

          The generic device share has gone from this row. It opened the
          operating system sheet, which leads with AirDrop and nearby devices,
          and a child's private link is not something to offer whatever device
          happens to be in range. The reminder underneath keeps the co view
          route alive without putting it in front of a parent who came here to
          hand over a phone. */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <a href={`https://wa.me/?text=${encodeURIComponent(invite)}`} target="_blank" rel="noopener noreferrer" style={{ ...btn, flex: 1, justifyContent: 'center', background: '#25D366', border: 'none', color: '#fff', boxShadow: '0 4px 0 #1DA851' }}>WhatsApp</a>
        <a href={`sms:?&body=${encodeURIComponent(invite)}`} style={{ ...btn, flex: 1, justifyContent: 'center', background: 'var(--terracotta)', border: 'none', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>Text</a>
        <a href={`mailto:?subject=${encodeURIComponent(`${childName}'s quests`)}&body=${encodeURIComponent(invite)}`} style={{ ...btn, flex: 1, justifyContent: 'center', boxShadow: '0 4px 0 var(--border)' }}>Email</a>
      </div>

      <button onClick={copy} style={{ ...btn, width: '100%', justifyContent: 'center', background: 'transparent', color: 'var(--ink-soft)' }}>
        {copied ? 'Copied ✓' : 'Copy the link'}
      </button>

      {!youngest && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 0' }}>
          You can also open {childName}&apos;s app on your own device and use it together. Switch to Together above any time.
        </p>
      )}
    </div>
  )
}
