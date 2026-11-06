'use client'

import { useState } from 'react'

// THE PARENT LINK ON A LESSON PAGE (5 November 2026).
//
// The link is minted on the server (lib/parent-share.ts) and only for a lesson
// the school's code opens; this is the card that shows it with two copy
// buttons, one for the bare link and one for a message ready for the
// newsletter, the class app or a text home. Nothing is sent from here and
// nothing is recorded: the school pastes it wherever it talks to families.

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

export default function ParentShare({ url, title, schoolRef }: { url: string; title: string; schoolRef: string }) {
  const [copied, setCopied] = useState<'link' | 'message' | null>(null)
  const message = `Today in class we taught "${title}". Here is what your child learned, and one question to ask at home: ${url}`

  async function copy(what: 'link' | 'message') {
    const text = what === 'link' ? url : message
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      setTimeout(() => setCopied(null), 2400)
    } catch {
      // No clipboard (an old browser, or permission refused): the text is on
      // the page to select by hand, so say so rather than pretend.
      window.prompt('Copy this', text)
    }
  }

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '22px 24px', marginBottom: '16px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '10px' }}>
        Share this lesson with parents
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, margin: '0 0 14px' }}>
        One link for the newsletter, the class app or a text home. Anyone with it sees the lesson&rsquo;s title, what the
        class learned and the question to ask at home. Parents read the rest, and go through the lesson with their child,
        with a free Guided Childhood account. Nothing about any pupil is shared, and nothing comes back to the school about
        who opened it.
      </p>
      <p style={{ ...mono, marginBottom: 6 }}>Your parent link</p>
      <input
        readOnly
        value={url}
        aria-label="Parent link for this lesson"
        onFocus={e => e.currentTarget.select()}
        style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink)', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '12px 14px', minHeight: 44, marginBottom: 12 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
        <button type="button" className="btn btn-gold" onClick={() => copy('link')} style={{ minHeight: 44 }}>
          {copied === 'link' ? 'Link copied' : 'Copy the link'}
        </button>
        <button type="button" className="btn-outline" onClick={() => copy('message')} style={{ minHeight: 44 }}>
          {copied === 'message' ? 'Message copied' : 'Copy a message for parents'}
        </button>
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, margin: '12px 0 0' }}>
        Your school&rsquo;s reference on the link is {schoolRef}. It stands for your school without naming it or your code.
      </p>
    </div>
  )
}
