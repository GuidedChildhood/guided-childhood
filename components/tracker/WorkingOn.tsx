'use client'

import { useMemo, useRef, useState } from 'react'
import HappyNews, { type HappyNewsItem, type CharacterKey } from '@/components/celebrate/HappyNews'

// The heart of Progress: not a graph, but the real list of what this
// family is working on, and the parent's own verdict on each. Solved
// moves it to the win column, still stuck keeps it live, and need help
// raises it with the team by email for now, until the in app assessment
// is built. A small report counts the wins, and a pattern line points at
// the one worth a proper plan.

export type WorkingConcern = {
  slug: string
  label: string
  status: string
  times_flagged: number
}

export type SolvedConcern = {
  slug: string
  label: string
  times_flagged: number
}

const HELP_EMAIL = 'hello@guidedchildhood.com'

// How long the look back question stays up before the resolution saves without
// it. A win should never be held hostage to a follow up question.
const SOLVE_GRACE_MS = 8000

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export default function WorkingOn({
  concerns,
  solvedAlready,
  recentSolved = [],
  childName,
  parentEmail,
}: {
  concerns: WorkingConcern[]
  solvedAlready: number
  recentSolved?: SolvedConcern[]
  childName: string
  parentEmail: string
}) {
  const [live, setLive] = useState(concerns)
  const [solvedNow, setSolvedNow] = useState(0)
  const [helped, setHelped] = useState<Record<string, boolean>>({})
  const [solvedList, setSolvedList] = useState(recentSolved)
  const [showSolved, setShowSolved] = useState(false)
  // The celebration when a concern is finally solved. Null the rest of the
  // time; HappyNews takes itself away after a few seconds.
  const [happy, setHappy] = useState<HappyNewsItem | null>(null)
  const [pendingSolve, setPendingSolve] = useState<{ slug: string; label: string } | null>(null)

  // One resolution post per slug, whichever path gets there first.
  const solvePosted = useRef<Record<string, boolean>>({})
  const solveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const solvedTotal = solvedAlready + solvedNow
  const working = live.length

  // The one that keeps coming back is the one worth a real plan.
  const pattern = useMemo(() => {
    const stubborn = [...live].sort((a, b) => b.times_flagged - a.times_flagged)[0]
    if (stubborn && stubborn.times_flagged >= 3) {
      return `${stubborn.label} has come up ${stubborn.times_flagged} times. That is the one to build a proper plan around, ask DiGi or tap Need help.`
    }
    if (live.length >= 3) {
      return 'Several things at once is a lot. Pick the one that stings most today and let the rest wait.'
    }
    return null
  }, [live])

  // Send the resolution. Called once per slug, either with the parent's
  // retrospective number or without it when they skip or drift away.
  function sendSolved(slug: string, scoreAtStart: number | null) {
    if (solvePosted.current[slug]) return
    solvePosted.current[slug] = true
    if (solveTimer.current) { clearTimeout(solveTimer.current); solveTimer.current = null }
    fetch('/api/concerns/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, status: 'resolved', scoreAtStart }),
    }).catch(() => {})
  }

  function markSolved(slug: string) {
    const done = live.find(c => c.slug === slug)

    // ── THE PARENT GETS THE CELEBRATION TOO ────────────────────────────────
    //
    // Justin, 13 August 2026: "HappyNews exists but is only wired into the
    // child app. Wire it to the moment being resolved, so solving one is a
    // small celebration rather than a row quietly disappearing."
    //
    // He is describing exactly what happened here: a parent solved something
    // they had been working on for weeks and the row simply vanished from the
    // list. The child's side has had a Friend spring up with confetti for
    // months. The person doing the actual work got a disappearing row.
    //
    // Same component, no second version. The Friend rotates by the concern's
    // own name rather than at random, so the same problem is always greeted by
    // the same face and it reads as somebody who has been following along.
    const cast: CharacterKey[] = ['digi', 'pebble', 'bloop', 'orbit', 'nova', 'cosmo']
    let hash = 0
    for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
    setHappy({
      character: cast[hash % cast.length],
      headline: 'One off the list',
      // The label back in their own words, because "one off the list" alone
      // could be about anything and the win is that it was THIS one.
      sub: done ? `${done.label} is sorted. That stays on your record.` : undefined,
    })
    setLive(prev => prev.filter(c => c.slug !== slug))
    setSolvedNow(n => n + 1)
    // Drop it onto the sorted list too so it can be reopened straight away
    // if it comes back, no refresh needed.
    if (done) setSolvedList(prev => [{ slug: done.slug, label: done.label, times_flagged: done.times_flagged }, ...prev.filter(s => s.slug !== slug)].slice(0, 8))

    // If another one is still waiting on its number, let that one go as it is
    // rather than holding two answers open at once.
    if (pendingSolve && pendingSolve.slug !== slug) sendSolved(pendingSolve.slug, null)

    // Ask the one question that makes the before and after honest: looking back
    // from the end, how bad was it at the start. People re-scale what a 7 means
    // to them as they get to know a problem, and asking now rather than trusting
    // a rating from months ago is the standard correction for that drift.
    //
    // Held, not blocking. The win is already on the board above; this is a
    // question they can ignore and the resolution still saves either way.
    setPendingSolve({ slug, label: done?.label ?? 'that one' })
    solveTimer.current = setTimeout(() => {
      setPendingSolve(null)
      sendSolved(slug, null)
    }, SOLVE_GRACE_MS)
  }

  function answerLookBack(scoreAtStart: number | null) {
    if (!pendingSolve) return
    const { slug } = pendingSolve
    setPendingSolve(null)
    sendSolved(slug, scoreAtStart)
  }

  // It came back. Reopen it, move it to the live list, and let the server
  // bump the flag count so the pattern line and DiGi read the recurrence.
  function markHappenedAgain(slug: string) {
    const back = solvedList.find(s => s.slug === slug)
    setSolvedList(prev => prev.filter(s => s.slug !== slug))
    if (back) {
      setLive(prev => [{ slug: back.slug, label: back.label, status: 'open', times_flagged: back.times_flagged + 1 }, ...prev])
      setSolvedNow(n => Math.max(0, n - 1))
    }
    fetch('/api/concerns/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, status: 'recurred' }),
    }).catch(() => {})
  }

  function markStuck(slug: string) {
    setHelped(prev => ({ ...prev, [slug]: true }))
    fetch('/api/concerns/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, status: 'open' }),
    }).catch(() => {})
  }

  function helpHref(label: string) {
    const subject = `Help with: ${label}`
    const body = `Hi, I could use some advice on this with ${childName}.\n\nWhat is going on:\n\n\nMy account: ${parentEmail}`
    return `mailto:${HELP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '18px 20px', marginBottom: '20px' }}>
      {/* Fixed to the bottom of the viewport by the component itself, so it
          rides above whatever the parent is looking at and does not push the
          list around as it arrives. */}
      <HappyNews item={happy} onClose={() => setHappy(null)} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '14px' }}>
        What we are working on
      </div>

      {pendingSolve && (
        <div style={{ background: 'var(--tint-green)', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
            {pendingSolve.label} is sorted. Nice one.
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-soft)' }}>
              Looking back now, where was it when you started? 1 is really tough, 10 is going great.
            </span>
            <button
              onClick={() => answerLookBack(null)}
              style={{ background: 'none', border: 'none', padding: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'underline', cursor: 'pointer', flexShrink: 0 }}
            >
              Skip
            </button>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {SCALE.map(n => (
              <button
                key={n}
                onClick={() => answerLookBack(n)}
                aria-label={`${n} out of 10`}
                style={{ flex: 1, minWidth: 0, padding: '9px 0', borderRadius: '9px', border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)', cursor: 'pointer' }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* The report: wins and live count */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: working > 0 ? '16px' : '0' }}>
        <div style={{ background: 'var(--tint-green)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1 }}>{solvedTotal}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2D5016', marginTop: '6px' }}>Sorted</div>
        </div>
        <div style={{ background: 'var(--terracotta-lt)', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1 }}>{working}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginTop: '6px' }}>On the go</div>
        </div>
      </div>

      {working === 0 ? (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '14px 0 0' }}>
          {solvedTotal > 0
            ? `Nothing open right now, and ${solvedTotal} sorted. When something comes up, flag it in the moment and it lands here to work through.`
            : 'Nothing flagged yet. When a hard moment comes up, tap it in the daily check in or Help now and it lands here so we can work through it together.'}
        </p>
      ) : (
        <>
          {pattern && (
            <div style={{ background: 'var(--stage-1)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stage-1-text)', display: 'block', marginBottom: '4px' }}>
                Pattern
              </span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5 }}>{pattern}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {live.map(c => (
              <div key={c.slug} style={{ border: '1px solid var(--border)', borderRadius: '14px', padding: '13px 15px', background: 'var(--cream)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                    {c.label}
                  </span>
                  {c.times_flagged > 1 && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', flexShrink: 0 }}>
                      {c.times_flagged}x
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => markSolved(c.slug)}
                    style={{
                      background: 'var(--tint-green)', border: '1.5px solid #2D5016', color: '#2D5016',
                      borderRadius: '100px', padding: '7px 14px', cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800,
                    }}
                  >
                    Sorted ✓
                  </button>
                  <button
                    onClick={() => markStuck(c.slug)}
                    style={{
                      background: '#fff', border: '1.5px solid var(--border)', color: 'var(--ink-soft)',
                      borderRadius: '100px', padding: '7px 14px', cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 700,
                    }}
                  >
                    Still going
                  </button>
                  <a
                    href={helpHref(c.label)}
                    style={{
                      background: 'var(--terracotta)', border: 'none', color: 'var(--ink)',
                      borderRadius: '100px', padding: '7px 14px', textDecoration: 'none',
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800,
                      boxShadow: '0 3px 0 var(--terracotta-dark)',
                    }}
                  >
                    Need help
                  </a>
                </div>
                {helped[c.slug] && (
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 0 0' }}>
                    Kept on the list. If it is stubborn, tap Need help and we will come back with a plan.
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Recently sorted, with a way back on. A win is never final: if it
          comes back, one tap reopens it and DiGi sees the pattern. */}
      {solvedList.length > 0 && (
        <div style={{ marginTop: working > 0 ? '18px' : '14px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
          <button
            onClick={() => setShowSolved(s => !s)}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            }}
          >
            Recently sorted ({solvedList.length})
            <span aria-hidden="true" style={{ transform: showSolved ? 'rotate(90deg)' : 'none', transition: 'transform .15s', display: 'inline-block' }}>›</span>
          </button>
          {showSolved && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {solvedList.map(s => (
                <div key={s.slug} style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 13px', background: 'var(--tint-green)' }}>
                  <span style={{ flexShrink: 0, color: '#2D5016' }} aria-hidden="true">✓</span>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>
                    {s.label}
                  </span>
                  <button
                    onClick={() => markHappenedAgain(s.slug)}
                    style={{
                      flexShrink: 0, background: '#fff', border: '1.5px solid var(--border)', color: 'var(--ink-soft)',
                      borderRadius: '100px', padding: '6px 12px', cursor: 'pointer',
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 700,
                    }}
                  >
                    Happened again
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
