'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { SITE_URL } from '@/lib/config/site'

// THE HAND OVER, IN ONE SHEET.
//
// Justin, 13 August 2026: "the share to phone button not working in any
// place." It was not the domain and it was not the code. Every entry point
// eventually reached this component, and the one that did not was a Link on
// the Quests page pointing at /dashboard/quests?tab=share, which is the page
// it was already on. Next does not remount a route for a query change, so the
// effect that reads ?tab= never ran again: the card navigated to itself and
// nothing opened. That card opens this sheet directly now, so there is no
// navigation left to fail.
//
// WHAT THIS SHEET IS FOR, in Justin's order:
//
//   1. The QR leads and it is BIG, because it is the easiest hand over there
//      is. The child's own camera is already pointing at the parent half the
//      time. Nothing typed, nothing installed, no account for the child.
//   2. WhatsApp, text and email sit under it and all three actually work.
//      They are built with NO recipient on purpose. wa.me with no number opens
//      WhatsApp's own contact picker, and sms: with no number opens Messages
//      with the words already written. That beats a stored number, which is
//      one more thing to set up first and one more thing to be wrong.
//   3. The printed chart is the other door, not a footnote, for the families
//      who will never hand this child a device. Same size, same weight.
//
// WHAT CAME OUT. The generic device share button. It opened the operating
// system sheet, which leads with AirDrop and nearby devices, and handing a
// child's private link to whatever device happens to be in range is the one
// route on this screen nobody asked for. The three named channels cover what
// it was actually being used for. The quiet line at the bottom keeps the co
// view option alive for the day a parent wants it.
//
// THE LINK IS ALWAYS SITE_URL. Never window.location.origin. A code scanned
// off this screen goes onto a child's home screen and stays there for years,
// so a preview origin baked into it outlives the deployment it came from, and
// no child can fix that themselves.

type Door = 'phone' | 'chart'

export default function QrHandoverModal({ token, childName, onClose }: {
  token: string
  childName: string
  onClose: () => void
}) {
  const [qr, setQr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')
  const [door, setDoor] = useState<Door>('phone')

  useEffect(() => {
    const u = `${SITE_URL}/k/${token}`
    setUrl(u)
    // Drawn at 640 and displayed smaller, so it stays sharp on a retina screen
    // and survives being held up to a camera across a kitchen table.
    QRCode.toDataURL(u, { width: 640, margin: 1, color: { dark: '#1A1A2E', light: '#FFFFFF' } })
      .then(setQr).catch(() => setQr(null))
  }, [token])

  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* no clipboard */ }
  }

  const invite = `${childName}, your quests are ready. Tick them off and earn your stars: ${url}`

  // Every channel is a plain link with no recipient, so it opens the app's own
  // picker rather than needing a number we may not have.
  const channels: { key: string; label: string; href: string; bg: string; fg: string; shadow?: string; icon: React.ReactNode }[] = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(invite)}`,
      bg: '#25D366', fg: '#fff', shadow: '0 4px 0 #1DA851',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm-2.53 4.4c-.15-.34-.3-.35-.44-.35l-.38-.01c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.66s.72 1.93.82 2.06c.1.13 1.4 2.13 3.38 2.99.47.2.84.33 1.13.42.47.15.9.13 1.24.08.38-.06 1.17-.48 1.33-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23s-1.17-.58-1.35-.64c-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05a5.5 5.5 0 0 1-1.62-1c-.6-.53-1-1.19-1.12-1.39-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35s-.44-1.09-.61-1.49z" />
        </svg>
      ),
    },
    {
      key: 'text',
      label: 'Text',
      href: `sms:?&body=${encodeURIComponent(invite)}`,
      bg: 'var(--terracotta)', fg: 'var(--ink)', shadow: '0 4px 0 var(--terracotta-dark)',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      href: `mailto:?subject=${encodeURIComponent(`${childName}'s quests`)}&body=${encodeURIComponent(invite)}`,
      bg: '#fff', fg: 'var(--ink)', shadow: '0 4px 0 var(--border)',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2.5" />
          <path d="m2.5 7 9.5 6.5L21.5 7" />
        </svg>
      ),
    },
  ]

  // nowrap matters: at 390 "Printed chart" wrapped to two lines and the two
  // doors stopped being the same height, which reads as one being the lesser
  // of the two. They are not.
  const doorTab = (key: Door): React.CSSProperties => ({
    flex: 1, padding: '11px 6px', borderRadius: '13px', cursor: 'pointer', border: 'none',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
    whiteSpace: 'nowrap',
    color: door === key ? 'var(--ink)' : 'var(--ink-soft)',
    background: door === key ? '#fff' : 'transparent',
    boxShadow: door === key ? '0 2px 6px -2px rgba(26,26,46,0.25)' : 'none',
  })

  return (
    <div
      onClick={onClose}
      // Above the welcome and handover overlays (200), because this is opened
      // from inside them. At 140 the code came up behind the card that asked
      // for it, which looks exactly like the button doing nothing.
      style={{ position: 'fixed', inset: 0, zIndex: 240, background: 'rgba(26,26,46,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 420, background: 'var(--cream)', borderRadius: '26px', padding: '20px 20px 22px', boxShadow: '0 24px 60px -18px rgba(26,26,46,0.45)', textAlign: 'center', margin: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            Hand it to {childName}
          </span>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: 'var(--text-lg)', color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
        </div>

        {/* Two doors, equal weight. A family with no child device is not taking
            the lesser option, they are taking the other one. */}
        <div role="tablist" style={{ display: 'flex', gap: '4px', background: 'rgba(26,26,46,0.06)', borderRadius: '16px', padding: '4px', marginBottom: '18px' }}>
          <button role="tab" aria-selected={door === 'phone'} onClick={() => setDoor('phone')} style={doorTab('phone')}>
            📱 Their phone
          </button>
          <button role="tab" aria-selected={door === 'chart'} onClick={() => setDoor('chart')} style={doorTab('chart')}>
            🖨️ On paper
          </button>
        </div>

        {door === 'phone' ? (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, margin: '0 0 14px' }}>
              Point {childName}&apos;s camera at this
            </h2>

            {/* The hero. Big enough to scan from across a table, which is the
                whole point of a code rather than a link. */}
            <div style={{ background: '#fff', borderRadius: '22px', padding: '16px', display: 'inline-block', boxShadow: '0 5px 0 rgba(26,26,46,0.08)', marginBottom: '14px' }}>
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qr}
                  alt={`QR code to open ${childName}'s app`}
                  style={{ display: 'block', width: 'min(304px, 68vw, 34vh)', height: 'min(304px, 68vw, 34vh)' }}
                />
              ) : (
                <div style={{ width: 'min(304px, 68vw, 34vh)', height: 'min(304px, 68vw, 34vh)', background: 'var(--cream)', borderRadius: '10px' }} />
              )}
            </div>

            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 auto 18px', maxWidth: 300 }}>
              Their app opens straight away. Nothing to type, nothing to install, no account for them to make.
            </p>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '9px' }}>
              Or send it to them
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {channels.map(c => (
                <a
                  key={c.key}
                  href={c.href}
                  target={c.key === 'whatsapp' ? '_blank' : undefined}
                  rel={c.key === 'whatsapp' ? 'noopener noreferrer' : undefined}
                  style={{
                    flex: 1, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    background: c.bg, color: c.fg, borderRadius: '15px', padding: '13px 6px', textDecoration: 'none',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                    boxShadow: c.shadow, border: c.key === 'email' ? '1.5px solid var(--border)' : 'none',
                  }}
                >
                  {c.icon}
                  {c.label}
                </a>
              ))}
            </div>

            <button
              onClick={copy}
              style={{
                width: '100%', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: '14px',
                padding: '11px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'var(--text-base)', color: 'var(--ink-soft)',
              }}
            >
              {copied ? 'Copied ✓' : 'Copy the link'}
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, margin: '0 0 14px' }}>
              The chart for the fridge
            </h2>

            {/* The chart shown at the same size the code gets, because it is
                the same offer. A family who prints this is fully set up: the
                child ticks the paper, the parent taps the stars. */}
            <div style={{ background: '#fff', borderRadius: '22px', padding: '16px 14px', boxShadow: '0 5px 0 rgba(26,26,46,0.08)', marginBottom: '14px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '10px' }}>
                {childName}&apos;s week
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <div key={`${d}${i}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>{d}</div>
                ))}
                {Array.from({ length: 21 }).map((_, i) => (
                  <div key={i} aria-hidden style={{
                    aspectRatio: '1', borderRadius: '7px', border: '2px solid var(--border)',
                    background: i === 0 || i === 8 || i === 15 ? 'var(--terracotta-lt)' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)',
                  }}>
                    {i === 0 || i === 8 || i === 15 ? '★' : ''}
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 auto 18px', maxWidth: 300 }}>
              Big tick boxes, one week a page. {childName} ticks the paper, you tap the stars in here. No device needed at all.
            </p>

            <Link
              href="/dashboard/quests/print"
              style={{
                display: 'block', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '16px',
                padding: '15px', textDecoration: 'none', fontFamily: 'var(--font-display)',
                fontWeight: 900, fontSize: 'var(--text-lg)', boxShadow: '0 5px 0 var(--terracotta-dark)',
              }}
            >
              Open the chart to print
            </Link>
          </>
        )}

        {/* The co view route, kept as a reminder rather than a fourth button.
            It is the right answer for a young child and the wrong one to put
            in front of a parent who came here to hand over a phone. */}
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '16px 0 0' }}>
          You can also open {childName}&apos;s app on your own device and use it together. It is waiting in Quests whenever you want it.
        </p>
      </div>
    </div>
  )
}
