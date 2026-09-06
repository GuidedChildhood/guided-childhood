'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import HappyIcon from '@/components/kid/HappyIcon'

// The alert: DiGi wants to tell you something. One butter card under the
// now slot on Home while an insight is unread, the hook on it, one tap to
// read it in full. Nothing else about the insight lives here; the card is
// the knock on the door, the page is the conversation.
//
// Justin, 6 September 2026: "a little alert button that says DiGi wants to
// tell you something."

export type WordPreview = { id: string; title: string; created_at: string }

export default function DigiWordCard({ initial }: { initial?: WordPreview | null }) {
  const [word, setWord] = useState<WordPreview | null>(initial ?? null)

  useEffect(() => {
    if (initial !== undefined) return
    fetch('/api/digi/word')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        const unread = (d?.words ?? []).find((w: { status: string }) => w.status === 'pending')
        setWord(unread ?? null)
      })
      .catch(() => {})
  }, [initial])

  if (!word) return null

  return (
    <Link
      href="/dashboard/word"
      style={{
        display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none',
        background: 'var(--terracotta)', border: '2px solid var(--ink)', borderRadius: 20,
        boxShadow: '0 4px 0 var(--ink)', padding: '14px 16px', marginBottom: 16, color: 'var(--ink)',
      }}
    >
      <span aria-hidden style={{
        width: 52, height: 52, borderRadius: 16, background: '#fff', border: '2px solid var(--ink)', boxSizing: 'border-box',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <HappyIcon name="tell" size={34} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="eyebrow" style={{ display: 'block', marginBottom: 3, color: 'var(--ink)' }}>DiGi wants to tell you something</span>
        <span style={{
          display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
          lineHeight: 1.25, color: 'var(--ink)',
        }}>
          {word.title}
        </span>
      </span>
      <span aria-hidden style={{
        flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: '#fff', border: '2px solid var(--ink)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900,
      }}>›</span>
    </Link>
  )
}
