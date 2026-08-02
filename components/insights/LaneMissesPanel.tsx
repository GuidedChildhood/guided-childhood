'use client'

import { useCallback, useEffect, useState } from 'react'

// The words DiGi did not know, on the board Justin already reads weekly.
//
// Justin: "can we get a report of any fail in future so I can review weekly in
// insights and click a button to add common ones".
//
// WHAT A MISS ACTUALLY COSTS, so this panel is not just tidy. When the keyword
// pass cannot place a message, DiGi pays for a model call to classify it.
// Measured on Justin's own session: 1332ms on a message about Teo and the
// television, because tv was not in the list. Every word added here is a second
// taken off a real conversation.
//
// WHY IT SHOWS WHAT IT IS HOLDING BACK. A word appears only once two separate
// families have used it, which is the privacy line and is not negotiable. But a
// panel that silently filtered would look like a quiet week when it was not, so
// it says how many it is sitting on. Same rule as everywhere else this week:
// never let a thing that happened look like a thing that did not.

type Suggestion = { word: string; families: number; hits: number }
type Health = {
  messages: number; answered: number; failed: number
  fellThrough: number; medianTotalMs: number | null
}
type Report = { days: number; suggestions: Suggestion[]; heldBack: number; health: Health }

const card: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
  padding: '20px 22px', marginBottom: 22, boxShadow: '0 3px 0 rgba(26,26,46,0.05)',
}

const label: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

export default function LaneMissesPanel() {
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError] = useState('')
  const [days, setDays] = useState(7)
  const [adding, setAdding] = useState<string | null>(null)
  const [added, setAdded] = useState<string[]>([])

  const load = useCallback(async (d: number) => {
    setError('')
    try {
      const res = await fetch(`/api/insights/lane-misses?days=${d}`)
      const data = await res.json()
      // A failed read reported as an empty week is the exact fault this whole
      // week has been about, so it says which one it is.
      if (!res.ok) { setError(data.error ?? 'Could not read the report.'); return }
      setReport(data as Report)
    } catch {
      setError('Could not reach the report.')
    }
  }, [])

  useEffect(() => { load(days) }, [load, days])

  async function addWord(word: string) {
    setAdding(word)
    try {
      const res = await fetch('/api/insights/lane-misses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      })
      if (res.ok) {
        setAdded(prev => [...prev, word])
        setReport(prev => prev ? { ...prev, suggestions: prev.suggestions.filter(s => s.word !== word) } : prev)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Could not add that word.')
      }
    } catch {
      setError('Could not add that word.')
    } finally {
      setAdding(null)
    }
  }

  const h = report?.health

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
        <p style={{ ...label, margin: 0 }}>Words DiGi did not know</p>
        <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
          {[7, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              style={{
                ...label, cursor: 'pointer', padding: '4px 10px', borderRadius: 100,
                border: '1.5px solid var(--border)',
                background: days === d ? 'var(--gold, #F2C94C)' : '#fff',
                color: 'var(--ink)',
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-sm)', marginBottom: 16, lineHeight: 1.5 }}>
        When a message has no word DiGi recognises, it pays for a model call to work out what the message is about. That
        costs about a second, every time. Adding a word here takes that second back.
      </p>

      {error && (
        <div style={{ padding: '10px 14px', background: '#FDECEC', borderRadius: 10, marginBottom: 14, fontSize: 'var(--text-sm)' }}>
          {error}
        </div>
      )}

      {h && (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 16, paddingBottom: 16, borderBottom: '1.5px solid var(--border)' }}>
          <Stat label="Messages" value={String(h.messages)} />
          <Stat label="Answered" value={String(h.answered)} />
          <Stat label="Failed" value={String(h.failed)} alert={h.failed > 0} />
          <Stat label="Paid for a lane call" value={String(h.fellThrough)} alert={h.fellThrough > 0} />
          <Stat label="Median reply" value={h.medianTotalMs != null ? `${(h.medianTotalMs / 1000).toFixed(1)}s` : 'no data'} />
        </div>
      )}

      {report && report.suggestions.length === 0 && (
        <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-sm)' }}>
          Nothing to add this time. Either the list is keeping up, or no word has come up in more than one family yet.
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {report?.suggestions.map(s => (
          <button
            key={s.word}
            onClick={() => addWord(s.word)}
            disabled={adding === s.word}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              padding: '8px 12px', borderRadius: 12, background: '#fff',
              border: '1.5px solid var(--border)', boxShadow: '0 3px 0 var(--border)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)',
              color: 'var(--ink)', opacity: adding === s.word ? 0.5 : 1,
            }}
          >
            <span>{s.word}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', fontWeight: 600 }}>
              {s.families} families
            </span>
            <span aria-hidden style={{ color: 'var(--terracotta)', fontWeight: 900 }}>+</span>
          </button>
        ))}
      </div>

      {added.length > 0 && (
        <p style={{ marginTop: 14, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
          Added and live within five minutes: {added.join(', ')}.
        </p>
      )}

      {report && report.heldBack > 0 && (
        <p style={{ marginTop: 14, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
          {report.heldBack} more {report.heldBack === 1 ? 'word is' : 'words are'} being held back because only one family
          has used {report.heldBack === 1 ? 'it' : 'them'} so far. One family&rsquo;s words are never shown, including to you.
        </p>
      )}
    </div>
  )
}

function Stat({ label: l, value, alert = false }: { label: string; value: string; alert?: boolean }) {
  return (
    <div>
      <p style={{ ...label, margin: 0, marginBottom: 2 }}>{l}</p>
      <p style={{
        margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'var(--text-lg)', color: alert ? '#E5484D' : 'var(--ink)',
      }}>
        {value}
      </p>
    </div>
  )
}
