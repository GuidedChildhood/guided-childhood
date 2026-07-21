'use client'

import { useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'

// DiGi hands over a script: the exact words for a moment this family is likely
// to meet, one tap from the full thing. Shown by the flash up gate on its turn,
// so this card is just the content and a quiet Not now.

export default function DigiScriptNudge({
  title, situation, sortOrder,
}: {
  title: string
  situation: string | null
  sortOrder: number
}) {
  const [show, setShow] = useState(true)
  if (!show) return null

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: '18px', padding: '16px 18px', marginBottom: '20px',
      boxShadow: '0 4px 0 rgba(26,26,46,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '10px' }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter size={26} mood="idle" />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            The words for a tricky moment
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '16.5px', color: 'var(--ink)', lineHeight: 1.2, marginTop: '2px' }}>
            {title}
          </div>
        </div>
      </div>

      {situation && (
        <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 13px' }}>
          {situation}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link
          href={`/dashboard/scripts/${sortOrder}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
            border: 'none', borderRadius: '12px', padding: '9px 15px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          Read the script
        </Link>
        <button
          onClick={() => setShow(false)}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', padding: '6px 4px',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
