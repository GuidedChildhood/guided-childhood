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
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: '16px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start',
        }}>
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            <DigiCharacter mood={p.kind === 'celebration' ? 'happy' : 'speak'} size={34} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '3px' }}>
              {KIND_LABEL[p.kind] ?? 'From DiGi'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
              {p.title}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.55, marginBottom: '8px' }}>
              {p.body}
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {p.href ? (
                <Link
                  href={p.href}
                  onClick={() => dismiss(p.id)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}
                >
                  Open Lessons to share →
                </Link>
              ) : (
                <Link
                  href={`/dashboard/digi?q=${encodeURIComponent(`You flagged: ${p.title}. Can we talk it through?`)}`}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}
                >
                  Talk it through with DiGi →
                </Link>
              )}
              <button
                onClick={() => dismiss(p.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
