'use client'

import { useEffect, useState } from 'react'
import { stageShareLink, stageShareMessage, whatsappHref } from '@/lib/share/stage'

// "Send this to a parent who has this fight." The share action on the stage
// result; the why is in lib/share/stage.ts.
//
// The shape is the one the referral screens on Mobbin share (Yami's invite
// screen, Cleo's share card): one main button, a quieter copy button beside
// it, and one line saying what the friend gets. Ours carries no reward for a
// visitor, so for them the line is about the friend's two minutes instead.
//
// Who is sharing decides the link. A parent who already has an account (the
// reveal passes member when it has no account step to offer) asks
// /api/referrals for their own code, made on first ask as the settings page
// does; anyone else shares the counted /v/stage-share and never calls it.
// Until that answer arrives the visitor link stands, so the buttons never
// wait on the network.

export default function ShareStage({ member = false }: { member?: boolean }) {
  const [origin, setOrigin] = useState('https://www.guidedchildhood.com')
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin)
    if (!member) return
    let live = true
    fetch('/api/referrals')
      .then(r => (r.ok ? r.json() : null))
      .then((d: { code?: string } | null) => { if (live && d?.code) setCode(d.code) })
      .catch(() => { /* a visitor, or not ready: the counted link stands */ })
    return () => { live = false }
  }, [member])

  const link = stageShareLink(origin, code)
  const message = stageShareMessage(link, Boolean(code))

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* clipboard blocked: the WhatsApp button still works */ }
  }

  const button: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    minHeight: 52, padding: '14px 20px', borderRadius: 16, cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
    letterSpacing: '-0.01em', color: 'var(--ink)', textDecoration: 'none',
    // Wraps rather than nowrap. With nowrap, iOS Larger Text grew "Send on
    // WhatsApp" past the button and the button 118px past the screen edge
    // (check-larger-text, /ref-reveal). The label may now break onto two
    // lines at the largest sizes, which is what a big text setting asks for.
    textAlign: 'center', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box',
  }

  return (
    <section
      data-stage-share
      aria-labelledby="stage-share-heading"
      style={{
        marginTop: 22, background: 'var(--terracotta-lt)', border: 'var(--edge)',
        borderRadius: 'var(--radius-card)', padding: '24px 20px', boxShadow: 'var(--lift)',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8,
      }}>
        Know someone?
      </div>
      <h2 id="stage-share-heading" style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 4.6vw, 1.7rem)', fontWeight: 900,
        letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, margin: '0 0 8px',
      }}>
        Send this to a parent who has this fight.
      </h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        {code
          ? 'Three questions tell them their child’s stage and what to say tonight. They get £5 off their first month, and you get £5 once they stay.'
          : 'Three questions tell them their child’s stage and what to say tonight. No sign up, and it is free.'}
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a
          href={whatsappHref(message)}
          target="_blank"
          rel="noopener noreferrer"
          data-share-whatsapp
          style={{ ...button, flex: '1 1 200px', background: 'var(--terracotta)', border: 'var(--edge)', boxShadow: '0 5px 0 var(--terracotta-dark)' }}
        >
          Send on WhatsApp
        </a>
        <button
          type="button"
          onClick={copy}
          data-share-copy
          aria-live="polite"
          style={{ ...button, flex: '1 1 140px', background: '#fff', border: 'var(--edge)', boxShadow: '0 5px 0 var(--ink)' }}
        >
          {copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
    </section>
  )
}
