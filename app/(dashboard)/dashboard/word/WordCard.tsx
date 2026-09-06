'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnswerBody } from '@/app/(dashboard)/dashboard/digi/DigiChat'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import type { DigiWord } from '@/lib/digi/word'

// One insight in full. Opening it marks it seen (from here, never during the
// server render). The butter button is the one thing to do next and marks it
// acted. Helped and Not really underneath are how DiGi learns: the reaction
// goes to the row and to digi_feedback, and the next insight reads both.

export default function WordCard({ word, childName, latest }: { word: DigiWord; childName: string | null; latest: boolean }) {
  const [reaction, setReaction] = useState<string | null>(word.reaction)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (word.status !== 'pending') return
    fetch('/api/digi/word', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: word.id, status: 'seen' }),
    }).catch(() => {})
  }, [word.id, word.status])

  async function react(value: 'helped' | 'not') {
    if (busy || reaction) return
    setBusy(true)
    setReaction(value)
    try {
      await fetch('/api/digi/word', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: word.id, reaction: value }),
      })
    } catch { /* the tap still shows as taken */ } finally { setBusy(false) }
  }

  function acted() {
    fetch('/api/digi/word', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: word.id, status: 'acted' }),
    }).catch(() => {})
  }

  const when = new Date(word.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const BTN: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
    padding: '11px 16px', borderRadius: 14, border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', background: '#fff',
    textDecoration: 'none',
  }

  return (
    <article style={{
      background: '#fff', border: '2px solid var(--ink)', borderRadius: 22, boxShadow: '0 4px 0 var(--ink)',
      padding: '20px 18px 18px', marginBottom: 20, opacity: latest ? 1 : 0.92,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, flexShrink: 0 }}><DigiCharacter size={34} mood="speak" /></div>
        <div style={{ minWidth: 0 }}>
          <p className="eyebrow" style={{ margin: 0 }}>{latest ? 'DiGi wants to tell you something' : 'From DiGi'}</p>
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
            {when}{childName ? ` · about ${childName}` : ''}
          </p>
        </div>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: latest ? 'clamp(1.5rem, 6vw, 1.9rem)' : 'var(--text-xl)',
        letterSpacing: '-0.02em', lineHeight: 1.12, margin: '0 0 14px', color: 'var(--ink)',
      }}>
        {word.title}
      </h2>

      <AnswerBody text={word.body} />

      {word.source && (
        <p style={{ margin: '14px 0 0', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          Leans on {word.source}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
        {word.href && (
          <Link href={word.href} onClick={acted} style={{ ...BTN, background: 'var(--terracotta)', flex: '1 1 100%', fontSize: 'var(--text-md)', fontWeight: 900, padding: '14px 18px' }}>
            {word.cta || 'Open it'}
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        {reaction ? (
          <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>
            {reaction === 'helped' ? 'Noted. DiGi will lean this way next time.' : 'Noted. DiGi will take a different line next time.'}
          </p>
        ) : (
          <>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginRight: 4 }}>Was this useful?</span>
            <button onClick={() => react('helped')} disabled={busy} style={{ ...BTN, padding: '8px 14px', fontSize: 'var(--text-sm)' }}>Helped</button>
            <button onClick={() => react('not')} disabled={busy} style={{ ...BTN, padding: '8px 14px', fontSize: 'var(--text-sm)' }}>Not really</button>
          </>
        )}
      </div>
    </article>
  )
}
