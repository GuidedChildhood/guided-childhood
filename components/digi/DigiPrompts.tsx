'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'

type Prompt = { id: string; kind: string; title: string; body: string; href?: string | null }

const KIND_LABEL: Record<string, string> = {
  watch_for: 'Worth watching this week',
  tip: 'A small improvement',
  parent_care: 'For you, not the kids',
  new_research: 'New research',
  celebration: 'Worth celebrating',
  school: 'From school',
}

// DiGi leads: proactive prompts generated from this family's own data and
// the expert knowledge base, surfaced before the parent asks anything.
export default function DigiPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])

  useEffect(() => {
    fetch('/api/digi/prompts')
      .then(r => r.json())
      .then(d => setPrompts(d.prompts ?? []))
      .catch(() => {})
  }, [])

  const dismiss = async (id: string) => {
    setPrompts(p => p.filter(x => x.id !== id))
    try {
      await fetch('/api/digi/prompts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'dismissed' }),
      })
    } catch { /* non-blocking */ }
  }

  if (prompts.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      {prompts.map(p => (
        <div key={p.id} style={{
          background: '#fff', border: '1.5px solid var(--border)',
          borderRadius: '20px', padding: '18px 20px 16px',
          boxShadow: '0 4px 18px rgba(26,26,46,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '13px', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DigiCharacter mood={p.kind === 'celebration' ? 'happy' : 'speak'} size={30} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
                {KIND_LABEL[p.kind] ?? 'From DiGi'}
              </span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px', color: 'var(--ink)', lineHeight: 1.25, marginTop: '3px' }}>
                {p.title}
              </span>
            </span>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.68, margin: '0 0 15px' }}>
            {p.body}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href={p.href ?? `/dashboard/digi?q=${encodeURIComponent(`You flagged: ${p.title}. Can we talk it through?`)}`}
              onClick={() => { if (p.href) dismiss(p.id) }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
                borderRadius: '13px', padding: '10px 16px',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
                boxShadow: '0 4px 0 var(--terracotta-dark)',
              }}
            >
              {p.href ? 'Open Lessons' : 'Talk it through'}
              <span style={{ fontSize: '15px' }} aria-hidden>→</span>
            </Link>
            <button
              onClick={() => dismiss(p.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
