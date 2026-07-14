'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Stamp, StampStatus } from './PassportStamps'

// The passport as a little book. A teal cover with the gold crest, then
// one page per stage in that stage's colour, each carrying a big progress
// circle that fills as the family completes that stage's work. Pages flip
// like a real passport (tap the sides or the arrows), a completed page
// earns its round seal, and the book opens itself on the stage the child
// is in. Earlier stages sit waiting as catch up pages, later ones as
// ahead pages, so the whole journey to 16 is a flick through.

const STAGE_THEME: Record<number, { bg: string; bold: string; text: string }> = {
  1: { bg: 'var(--stage-1)', bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)' },
  2: { bg: 'var(--stage-2)', bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)' },
  3: { bg: 'var(--stage-3)', bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)' },
  4: { bg: 'var(--stage-4)', bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)' },
  5: { bg: 'var(--stage-5)', bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)' },
}

const R = 52
const C = 2 * Math.PI * R

function statusLabel(s: StampStatus): string {
  if (s === 'earned') return 'Earned'
  if (s === 'current') return 'In progress'
  if (s === 'catchup') return 'Catch up'
  return 'Ahead'
}

export default function PassportBook({
  stamps,
  childName,
}: {
  stamps: Stamp[]
  childName: string
}) {
  // Page 0 is the cover; pages 1..5 are the stages.
  const [page, setPage] = useState(0)
  const [flipping, setFlipping] = useState<'next' | 'prev' | null>(null)
  const [drawn, setDrawn] = useState(false)
  const pending = useRef<number | null>(null)

  const earnedCount = stamps.filter(s => s.status === 'earned').length
  const allEarned = earnedCount === stamps.length && stamps.length > 0
  const currentStage = stamps.find(s => s.status === 'current')

  // Open the book on the child's stage: a beat on the cover, then flip in.
  useEffect(() => {
    const draw = setTimeout(() => setDrawn(true), 300)
    const open = setTimeout(() => {
      if (currentStage) goTo(currentStage.id)
    }, 900)
    return () => { clearTimeout(draw); clearTimeout(open) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function goTo(target: number) {
    if (target === page || flipping) return
    pending.current = target
    setFlipping(target > page ? 'next' : 'prev')
  }

  // The flip is two halves: rotate to the spine, swap the page, rotate out.
  useEffect(() => {
    if (!flipping) return
    const t = setTimeout(() => {
      if (pending.current !== null) setPage(pending.current)
      pending.current = null
      setFlipping(null)
    }, 280)
    return () => clearTimeout(t)
  }, [flipping])

  const stamp = page >= 1 ? stamps[page - 1] : null
  const theme = stamp ? STAGE_THEME[stamp.id] ?? STAGE_THEME[1] : null

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          {childName === 'your child' ? 'The' : `${childName}'s`} digital passport
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
          {earnedCount}/{stamps.length} pages stamped
        </span>
      </div>
      <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
        One page per stage. The circle fills as you complete the stage, and a full circle stamps the page. Flip through to catch up or peek ahead.
      </p>

      {/* The book */}
      <div style={{ perspective: '1400px', maxWidth: '340px', margin: '0 auto' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: '18px',
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            transform: flipping === 'next' ? 'rotateY(-88deg)' : flipping === 'prev' ? 'rotateY(88deg)' : 'rotateY(0deg)',
            transition: 'transform 0.28s ease-in',
            boxShadow: '0 14px 40px rgba(26,26,46,0.18)',
          }}
        >
          {page === 0 ? (
            /* ── The cover ─────────────────────────────── */
            <div
              onClick={() => goTo(1)}
              role="button"
              aria-label="Open the passport"
              style={{
                background: 'var(--deep-teal)', borderRadius: '18px', cursor: 'pointer',
                padding: '38px 26px 30px', textAlign: 'center', minHeight: '420px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                border: '1.5px solid rgba(255,255,255,0.12)',
                boxShadow: 'inset 0 0 0 6px rgba(237,195,95,0.35), inset 0 0 0 8px rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                Digital Passport
              </div>
              <div>
                {/* The crest: the gold square with the rising bars */}
                <div style={{
                  width: '64px', height: '64px', background: 'var(--terracotta)', borderRadius: '16px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 0 var(--terracotta-dark)', marginBottom: '18px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '30px' }}>
                    {[5, 9, 14, 8].map((h, i) => (
                      <div key={i} style={{ width: '5.5px', height: `${(h / 14) * 30}px`, background: '#fff', borderRadius: '3px' }} />
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  {childName === 'your child' ? 'Our family' : childName}
                </div>
                <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.72)', marginTop: '6px' }}>
                  The journey to 16, one stage at a time
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
                Tap to open
              </div>
            </div>
          ) : stamp && theme && (
            /* ── A stage page ──────────────────────────── */
            <div
              style={{
                background: theme.bg, borderRadius: '18px',
                padding: '20px 22px 18px', minHeight: '420px', position: 'relative', overflow: 'hidden',
                border: '1.5px solid var(--border)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Tap zones: left half back, right half forward */}
              <div onClick={() => goTo(page - 1)} aria-hidden style={{ position: 'absolute', inset: '0 50% 0 0', cursor: 'pointer', zIndex: 2 }} />
              <div onClick={() => page < stamps.length && goTo(page + 1)} aria-hidden style={{ position: 'absolute', inset: '0 0 0 50%', cursor: page < stamps.length ? 'pointer' : 'default', zIndex: 2 }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.text, opacity: 0.75 }}>
                  Digital Passport · Stage {stamp.id}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: theme.text, opacity: 0.55 }}>
                  P{stamp.id} of {stamps.length}
                </span>
              </div>

              {/* The circle that fills as the stage completes */}
              <div style={{ position: 'relative', width: 128, height: 128, margin: '4px auto 12px' }}>
                <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                  <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(26,26,46,0.10)" strokeWidth="9" />
                  <circle
                    cx="64" cy="64" r={R} fill="none" stroke={theme.bold} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(drawn ? stamp.pct : 0, 100) / 100)}
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {stamp.status === 'earned' ? (
                    <div style={{
                      width: 84, height: 84, borderRadius: '50%',
                      border: `3px solid ${theme.text}`, color: theme.text,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      transform: 'rotate(-10deg)', animation: 'gcStampIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
                    }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '2px' }}>
                        Earned
                      </span>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.9rem', lineHeight: 1, color: theme.text }}>
                        {stamp.pct}%
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.text, opacity: 0.7, marginTop: '3px' }}>
                        {statusLabel(stamp.status)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.35rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                  {stamp.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.text, marginTop: '4px' }}>
                  Ages {stamp.ages}
                </div>
              </div>

              {/* Passport data rows */}
              <div style={{ borderTop: `1.5px dashed ${theme.bold}`, paddingTop: '12px', marginTop: 'auto' }}>
                {[
                  ['Holder', childName === 'your child' ? 'Our family' : childName],
                  ['Status', stamp.status === 'earned' ? 'Page stamped' : stamp.status === 'catchup' ? 'Waiting, catch up any time' : stamp.status === 'upcoming' ? 'Still to come' : 'Filling up now'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '5px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.text, opacity: 0.65 }}>{k}</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--ink)' }}>{v}</span>
                  </div>
                ))}
                <Link
                  href={stamp.href}
                  style={{
                    position: 'relative', zIndex: 3,
                    display: 'block', textAlign: 'center', marginTop: '10px',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
                    color: 'var(--ink)', textDecoration: 'none',
                    background: theme.bold, borderRadius: '12px', padding: '10px 14px',
                  }}
                >
                  {stamp.status === 'earned' ? 'Look back at this stage' : stamp.status === 'catchup' ? 'Catch this page up →' : 'Fill this page →'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '14px' }}>
        <button
          onClick={() => goTo(Math.max(0, page - 1))}
          aria-label="Previous page"
          disabled={page === 0}
          style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '10px',
            width: 34, height: 34, cursor: page === 0 ? 'default' : 'pointer',
            opacity: page === 0 ? 0.4 : 1, fontSize: '15px', color: 'var(--ink)',
          }}
        >
          ←
        </button>
        <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
          {[0, ...stamps.map(s => s.id)].map(i => {
            const active = i === page
            const t = i >= 1 ? STAGE_THEME[i] : null
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={i === 0 ? 'Cover' : `Stage ${i}`}
                style={{
                  width: active ? 22 : 8, height: 8, borderRadius: '100px', border: 'none', padding: 0,
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  background: active ? (t ? t.bold : 'var(--deep-teal)') : 'var(--border)',
                }}
              />
            )
          })}
        </div>
        <button
          onClick={() => goTo(Math.min(stamps.length, page + 1))}
          aria-label="Next page"
          disabled={page === stamps.length}
          style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '10px',
            width: 34, height: 34, cursor: page === stamps.length ? 'default' : 'pointer',
            opacity: page === stamps.length ? 0.4 : 1, fontSize: '15px', color: 'var(--ink)',
          }}
        >
          →
        </button>
      </div>

      {allEarned && (
        <div style={{
          marginTop: '14px', background: 'var(--deep-teal)', borderRadius: '14px',
          padding: '14px 16px', textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: '#fff' }}>
            🎉 Passport complete
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, marginTop: '3px' }}>
            Every page stamped, all the way to 16. {childName === 'your child' ? 'Your child is' : `${childName} is`} prepared, educated and safe.
          </div>
        </div>
      )}

      <style>{`
        @keyframes gcStampIn {
          0% { transform: scale(0.4) rotate(-30deg); opacity: 0; }
          100% { transform: scale(1) rotate(-10deg); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
