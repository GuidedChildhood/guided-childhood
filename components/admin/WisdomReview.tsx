'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// The approve or bin control for the wisdom holding pen.
//
// Reading comes first and the buttons sit underneath, because the whole point of
// this page is that somebody read the lines before a parent did. A one click
// approve at the top would recreate the unattended cron with an extra step.

export type WisdomRow = {
  id: string
  topic: string
  age_band: string | null
  what_works: string
  evidence_count: number
}

export default function WisdomReview({ pending, liveCount }: { pending: WisdomRow[]; liveCount: number }) {
  const [busy, setBusy] = useState<'approve' | 'discard' | 'rebuild' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function act(action: 'approve' | 'discard') {
    setBusy(action)
    setError(null)
    try {
      const res = await fetch('/api/admin/wisdom-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'That did not go through')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That did not go through')
    } finally {
      setBusy(null)
    }
  }

  // The on demand rebuild. The founder route has existed since the review
  // gate shipped, but nothing on this page could press it, so the only way
  // to fill the pen was to wait for Sunday. Same implementation as the cron:
  // it writes candidates into the pen and touches nothing live.
  async function rebuild() {
    setBusy('rebuild')
    setError(null)
    try {
      const res = await fetch('/api/admin/digi-wisdom', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'The rebuild did not go through')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The rebuild did not go through')
    } finally {
      setBusy(null)
    }
  }

  const rebuildButton = (
    <button
      onClick={rebuild}
      disabled={busy !== null}
      style={{
        padding: '13px 22px', borderRadius: '16px', border: '2px solid var(--border)',
        background: '#fff', color: 'var(--ink-soft)',
        fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800,
        boxShadow: '0 5px 0 var(--border)', cursor: busy ? 'default' : 'pointer',
        opacity: busy ? 0.6 : 1,
      }}
    >
      {busy === 'rebuild' ? 'Rebuilding, this takes a minute' : 'Run the rebuild now'}
    </button>
  )

  if (pending.length === 0) {
    return (
      <div style={{ background: 'var(--tint-green)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px 20px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
          Nothing waiting
        </div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '12px' }}>
          DiGi is serving {liveCount} approved {liveCount === 1 ? 'pattern' : 'patterns'}. The next rebuild runs Sunday at
          06:00 and will leave its suggestions here rather than putting them live, or run one now and review it today.
        </p>
        {error && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--danger)', marginBottom: '10px' }}>{error}</p>
        )}
        {rebuildButton}
      </div>
    )
  }

  return (
    <div>
      <div style={{ background: 'var(--tint-amber)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px 20px', marginBottom: '18px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
          {pending.length} {pending.length === 1 ? 'pattern is' : 'patterns are'} waiting on you
        </div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
          DiGi is still serving the {liveCount} you approved before. Nothing below has reached a parent. Approving
          replaces the live set with all of these; binning them leaves DiGi exactly as it is.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
        {pending.map(w => (
          <div key={w.id} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)' }}>
                {w.topic}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                {w.age_band ?? 'any age'} · {w.evidence_count}
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{w.what_works}</p>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
        The number after the age band is the model&#39;s own estimate of how many signals sit behind the pattern, not a
        counted total. Treat it as a hint about confidence, not a statistic, and never publish it.
      </p>

      {error && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--danger)', marginBottom: '10px' }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => act('approve')}
          disabled={busy !== null}
          style={{
            padding: '13px 22px', borderRadius: '16px', border: 'none',
            background: 'var(--green)', color: '#fff',
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800,
            boxShadow: '0 5px 0 var(--green-dark)', cursor: busy ? 'default' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy === 'approve' ? 'Putting them live' : 'Approve and put live'}
        </button>
        <button
          onClick={() => act('discard')}
          disabled={busy !== null}
          style={{
            padding: '13px 22px', borderRadius: '16px', border: '2px solid var(--border)',
            background: '#fff', color: 'var(--ink-soft)',
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800,
            boxShadow: '0 5px 0 var(--border)', cursor: busy ? 'default' : 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy === 'discard' ? 'Binning' : 'Bin these'}
        </button>
      </div>
    </div>
  )
}
