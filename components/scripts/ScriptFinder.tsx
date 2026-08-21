'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { matchScripts } from '@/lib/digi/script-match'

// Find my script. A parent types the problem in their own words and we surface
// the closest scripts as they type. If nothing fits, DiGi takes the ask and it
// lands in the founder insights so the next script is written from real demand.
//
// ── Two changes on 11 August 2026 ────────────────────────────────────────────
//
// Justin: "can we make script suggestions actually pull up scripts that relate
// to the question, rather, and ability to search others."
//
// So DiGi's "scripts for moments like this" now arrives here with the parent's
// own question in the box (initialQuery), showing the matches immediately
// rather than dropping them at the top of a library of 236 and wishing them
// luck. The box stays editable, which is the second half of his ask.
//
// And the ranking moved to matchScripts, the whole word IDF matcher already
// used to pick DiGi's links. What was here was substring matching, the exact
// bug already fixed once on the DiGi side: "ai" matched "said", "afraid" and
// "again", so a parent asking about AI homework got toilet training scripts.
// Two searches over the same library disagreeing with each other is worse than
// either being wrong on its own.

type Lite = { sort_order: number; title: string; situation: string; category: string; is_free: boolean }

export default function ScriptFinder({
  scripts,
  isPaid,
  initialQuery = '',
  childId = null,
}: {
  scripts: Lite[]
  isPaid: boolean
  /** What the parent asked DiGi, so the answer is already on screen. */
  initialQuery?: string
  /** The child the page is about, carried into every result link so the
   *  reader's tick lands on the right child. Null keeps the clean URL. */
  childId?: string | null
}) {
  const [q, setQ] = useState(initialQuery)
  const [asked, setAsked] = useState(false)
  const [sending, setSending] = useState(false)

  const query = q.trim().toLowerCase()
  const results = useMemo(() => {
    if (query.length < 2) return []
    // The same matcher DiGi uses to choose which script to link. Whole words,
    // weighted by how rare each one is across the library, so "phone" narrows
    // less than "sextortion" and neither of them matches a word it merely sits
    // inside.
    const hits = matchScripts(scripts, q, 6)
    const bySort = new Map(scripts.map(s => [s.sort_order, s]))
    return hits.map(h => bySort.get(h.sort_order)).filter((s): s is Lite => Boolean(s))
  }, [query, q, scripts])

  const askDigi = async () => {
    if (query.length < 4 || sending) return
    setSending(true)
    try {
      await fetch('/api/scripts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: q.trim(), matchedSortOrder: results[0]?.sort_order ?? null }),
      })
      setAsked(true)
    } catch { /* best effort */ } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px', boxShadow: '0 4px 0 rgba(26,26,46,0.06)' }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '8px' }}>
        Find my script
      </label>
      <input
        value={q}
        onChange={e => { setQ(e.target.value); setAsked(false) }}
        placeholder="What is happening? e.g. wants a phone, will not come off the game"
        style={{
          width: '100%', padding: '13px 15px', borderRadius: '13px', boxSizing: 'border-box',
          border: '1.5px solid var(--border)', background: 'var(--cream)',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', outline: 'none',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--terracotta)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
      />

      {results.length > 0 && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {results.map(s => {
            const locked = !isPaid && !s.is_free
            return (
              <Link
                key={s.sort_order}
                href={locked ? '/dashboard/upgrade' : `/dashboard/scripts/${s.sort_order}${childId ? `?child=${childId}` : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px', padding: '11px 13px', textDecoration: 'none' }}
              >
                <span style={{ fontSize: 'var(--text-lg)', flexShrink: 0 }}>💬</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>{s.title}</span>
                  <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: '1px' }}>{s.situation}</span>
                </span>
                <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', color: 'var(--terracotta-dark)', fontWeight: 800 }}>{locked ? '🔒' : '→'}</span>
              </Link>
            )
          })}
        </div>
      )}

      {/* No good match, or the parent wants to ask for one. DiGi takes it and it
          lands in the founder insights to be written. */}
      {query.length >= 4 && (
        asked ? (
          <div style={{ marginTop: '12px', background: 'var(--tint-sage)', borderRadius: '12px', padding: '12px 14px', display: 'flex', gap: '9px', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-lg)' }}>💛</span>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.45 }}>
              DiGi has it. We write scripts from what parents actually ask for, so this helps shape what comes next.
            </span>
          </div>
        ) : (
          <div style={{ marginTop: '12px', display: 'flex', gap: '9px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>
              {results.length > 0 ? 'Not quite it?' : 'No script for this yet?'}
            </span>
            <button
              onClick={askDigi}
              disabled={sending}
              style={{
                background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '12px',
                padding: '9px 15px', cursor: sending ? 'default' : 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                boxShadow: '0 3px 0 var(--terracotta-dark)', opacity: sending ? 0.7 : 1,
              }}
            >
              {sending ? 'Sending…' : 'Ask DiGi for this script'}
            </button>
          </div>
        )
      )}
    </div>
  )
}
