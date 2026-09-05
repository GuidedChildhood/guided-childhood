'use client'

import { useState } from 'react'

// The home half of bridge a (migration 230). A class lesson sends a sheet
// home with a code on it; this card is where the code lands. One field, one
// button, and the module is credited to this child as a school_lesson
// completion. Home educating families enter the same codes from the pack.
// Quiet by design: a small card at the foot of the lessons page, never a
// stone on the road a parent can be behind on.

export default function SchoolCodeCard({ childId, childName }: {
  childId: string | null
  childName: string
}) {
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ kind: 'ok' | 'again' | 'error'; text: string } | null>(null)

  async function redeem() {
    if (!code.trim() || busy) return
    setBusy(true)
    setResult(null)
    try {
      const res = await fetch('/api/school-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, child_id: childId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResult({ kind: 'error', text: data.error ?? 'Something went wrong. Try again in a moment.' })
      } else if (data.alreadyDone) {
        setResult({ kind: 'again', text: `${data.title} was already on the record. Nothing lost, nothing doubled.` })
      } else {
        setResult({ kind: 'ok', text: `Stamped in: ${data.title}. The record now shows ${childName} covered this.` })
        setCode('')
      }
    } catch {
      setResult({ kind: 'error', text: 'Something went wrong. Try again in a moment.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{
      marginTop: 28, background: '#fff', border: '2px solid var(--ink)',
      borderRadius: 18, padding: '18px 20px',
    }}>
      <p className="eyebrow" style={{ marginBottom: 4 }}>Brought home from school</p>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px' }}>
        Got a code on a school sheet?
      </p>
      <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', lineHeight: 1.55, margin: '0 0 12px' }}>
        When a class covers one of our lessons, the sheet that comes home carries a code. Enter it here and the passport records it. Home learning packs use the same codes.
      </p>
      <form
        onSubmit={e => { e.preventDefault(); redeem() }}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
      >
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="HOME 7K3F"
          aria-label="School lesson code"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          style={{
            flex: '1 1 140px', minWidth: 0, padding: '12px 14px',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            border: '2px solid var(--ink)', borderRadius: 12, color: 'var(--ink)',
            background: 'var(--cream)',
          }}
        />
        <button
          type="submit"
          disabled={busy || !code.trim()}
          style={{
            padding: '12px 20px', border: 'none', borderRadius: 16,
            background: 'var(--terracotta)', color: 'var(--ink)',
            boxShadow: '0 5px 0 var(--terracotta-dark)', cursor: busy || !code.trim() ? 'default' : 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            opacity: busy || !code.trim() ? 0.6 : 1,
          }}
        >
          {busy ? 'Checking…' : 'Stamp it in'}
        </button>
      </form>
      {result && (
        <p role="status" style={{
          margin: '10px 0 0', fontSize: 'var(--text-base)', lineHeight: 1.5, fontWeight: 600,
          color: result.kind === 'error' ? 'var(--terracotta-dark)' : 'var(--retro-green)',
        }}>
          {result.text}
        </p>
      )}
    </div>
  )
}
