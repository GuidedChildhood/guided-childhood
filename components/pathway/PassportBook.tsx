'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Stamp, StampStatus } from './PassportStamps'
import { characterForStage } from '@/lib/content/stage-characters'

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

const STAGE_SLUGS = ['foundation', 'builder', 'explorer', 'shaper', 'independent'] as const

const R = 52
const C = 2 * Math.PI * R

function statusLabel(s: StampStatus): string {
  if (s === 'earned') return 'Earned'
  if (s === 'current') return 'In progress'
  if (s === 'catchup') return 'Catch up'
  return 'Ahead'
}

const CELEBRATED_KEY = 'gc_passport_celebrated'

export default function PassportBook({
  stamps,
  childName,
}: {
  stamps: Stamp[]
  childName: string
}) {
  // Page 0 is the cover; pages 1..5 are the stages. The book rests on its
  // cover and never opens itself: the parent taps to open each page, the way
  // Justin asked for, so the cover is a real front door.
  const [page, setPage] = useState(0)
  const [flipping, setFlipping] = useState<'next' | 'prev' | null>(null)
  const [drawn, setDrawn] = useState(false)
  const [celebrating, setCelebrating] = useState<Stamp | null>(null)
  const pending = useRef<number | null>(null)

  const earnedCount = stamps.filter(s => s.status === 'earned').length
  const allEarned = earnedCount === stamps.length && stamps.length > 0

  // Draw the rings in shortly after mount. No auto flip: the cover stays put.
  useEffect(() => {
    const draw = setTimeout(() => setDrawn(true), 300)
    return () => clearTimeout(draw)
  }, [])

  // Real success when a page is newly stamped. We remember which earned pages
  // the family has already celebrated, so the first time a page crosses to
  // earned it gets a proper moment: a stamp slam, a burst and a gentle buzz.
  // Later visits stay calm. This is the "make it feel earned" ask.
  useEffect(() => {
    if (typeof window === 'undefined') return
    let seen: number[] = []
    try { seen = JSON.parse(localStorage.getItem(CELEBRATED_KEY) ?? '[]') } catch { seen = [] }
    const fresh = stamps.find(s => s.status === 'earned' && !seen.includes(s.id))
    if (!fresh) return
    const t = setTimeout(() => {
      setCelebrating(fresh)
      try { navigator.vibrate?.([40, 60, 90]) } catch { /* not supported */ }
      const next = Array.from(new Set([...seen, ...stamps.filter(s => s.status === 'earned').map(s => s.id)]))
      try { localStorage.setItem(CELEBRATED_KEY, JSON.stringify(next)) } catch { /* private mode */ }
    }, 700)
    return () => clearTimeout(t)
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
  // The Planet Friend earned at this stage, so each passport page carries the
  // character who grows up alongside the child there.
  const friend = stamp ? characterForStage(stamp.id) : undefined

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
            /* The cover reads like a real passport: burgundy book, gold
               foil rules and crest, formal letterspaced titling. */
            <div
              onClick={() => goTo(1)}
              role="button"
              aria-label="Open the passport"
              style={{
                background: 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)',
                borderRadius: '14px 18px 18px 14px', cursor: 'pointer',
                padding: '38px 26px 30px', textAlign: 'center', minHeight: '420px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: 'inset 0 0 0 2px rgba(237,195,95,0.55), inset 0 0 0 5px rgba(237,195,95,0.14), inset 12px 0 24px rgba(0,0,0,0.25)',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.34em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                  Digital Passport
                </div>
                <div style={{ width: '46px', height: '1.5px', background: 'rgba(237,195,95,0.55)', margin: '10px auto 0' }} />
              </div>
              <div>
                {/* The gold foil crest: the rising bars in a laurel ring */}
                <div style={{
                  width: '84px', height: '84px', borderRadius: '50%', margin: '0 auto 18px',
                  border: '2.5px solid rgba(237,195,95,0.85)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 0 0 4px rgba(237,195,95,0.18)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4.5px', height: '34px' }}>
                    {[5, 9, 14, 8].map((h, i) => (
                      <div key={i} style={{ width: '6px', height: `${(h / 14) * 34}px`, background: 'var(--terracotta)', borderRadius: '3px' }} />
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--terracotta)', letterSpacing: '0.02em', lineHeight: 1.15 }}>
                  {childName === 'your child' ? 'Our family' : childName}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.65)', marginTop: '8px' }}>
                  The journey to 16
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.5)' }}>
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
                {friend && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '9px' }}>
                    <span style={{
                      width: 62, height: 62, borderRadius: '50%', overflow: 'hidden',
                      border: `2.5px solid ${friend.colour}`, background: '#fff',
                      boxShadow: '0 3px 0 rgba(26,26,46,0.10)', position: 'relative', flexShrink: 0,
                    }}>
                      <Image src={friend.img} alt={friend.name} fill sizes="62px" style={{ objectFit: 'cover' }} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.text, opacity: 0.8, marginTop: '6px' }}>
                      {stamp.status === 'earned' || stamp.status === 'current' ? `With ${friend.name}` : `Meet ${friend.name}`}
                    </span>
                  </div>
                )}
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.35rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                  {stamp.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.text, marginTop: '4px' }}>
                  {stamp.ages}
                </div>
              </div>

              {/* To stamp this page: the plain checklist of what completes the
                  stage. Each task shows a tick when it is done and how much is
                  left when it is not, so the page always says exactly what to
                  do next. Lessons lead, they are the process. */}
              {/* This whole panel rides above the flip tap zones (zIndex 3) so
                  every row is tappable and takes the parent straight to the
                  exact thing that fills it: the stage lessons, the scripts, the
                  device setup, the daily habit. Nobody is left guessing the
                  next step. */}
              <div style={{ position: 'relative', zIndex: 3, borderTop: `1.5px dashed ${theme.bold}`, paddingTop: '12px', marginTop: 'auto' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.text, opacity: 0.7, marginBottom: '9px' }}>
                  {stamp.status === 'earned' ? 'This page is stamped' : 'To stamp this page · tap any one to do it'}
                </div>
                {(() => {
                  const lt = stamp.lessonsTotal ?? 0
                  const ld = stamp.lessonsDone ?? 0
                  const slug = STAGE_SLUGS[stamp.id - 1] ?? 'foundation'
                  const tasks: { label: string; done: boolean; detail: string; href: string }[] = [
                    { label: 'Watch the lessons', done: (stamp.lessonsPct ?? 0) >= 100, detail: lt > 0 ? `${ld} of ${lt} done` : `${stamp.lessonsPct ?? 0}%`, href: `/dashboard/lessons?stage=${stamp.id}` },
                    { label: 'Read the scripts', done: (stamp.scriptsPct ?? 0) >= 100, detail: `${stamp.scriptsPct ?? 0}%`, href: `/dashboard/scripts?stage=${slug}` },
                    { label: 'Set up the devices', done: (stamp.devicesPct ?? 0) >= 100, detail: `${stamp.devicesPct ?? 0}%`, href: '/dashboard/devices' },
                    { label: 'Keep the daily habit', done: (stamp.streakPct ?? 0) >= 100, detail: `${stamp.streakPct ?? 0}%`, href: '/dashboard' },
                  ]
                  return tasks.map(t => (
                    <Link key={t.label} href={t.href} style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '7px', textDecoration: 'none' }}>
                      <span style={{
                        width: 17, height: 17, borderRadius: '6px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: t.done ? theme.bold : 'transparent',
                        border: t.done ? 'none' : `1.5px solid ${theme.bold}`,
                      }}>
                        {t.done && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                        )}
                      </span>
                      <span style={{ flex: 1, fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)', opacity: t.done ? 0.5 : 1, textDecoration: t.done ? 'line-through' : 'none' }}>
                        {t.label}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: theme.text, opacity: 0.75, whiteSpace: 'nowrap' }}>
                        {t.detail}{t.done ? '' : ' ›'}
                      </span>
                    </Link>
                  ))
                })()}
                <Link
                  href={`/dashboard/lessons?stage=${stamp.id}`}
                  style={{
                    display: 'block', textAlign: 'center', marginTop: '11px',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
                    color: 'var(--ink)', textDecoration: 'none',
                    background: theme.bold, borderRadius: '12px', padding: '10px 14px',
                  }}
                >
                  {stamp.status === 'earned' ? 'Look back at this stage' : stamp.status === 'catchup' ? 'Catch this page up →' : 'Start the next step →'}
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
            Every page stamped, all the way to 16. {childName === 'your child' ? 'Your child has' : `${childName} has`} grown up online with the habits, the know how and the judgement built stage by stage.
          </div>
        </div>
      )}

      {/* Real success: the first time a page is stamped, the whole thing gets
          a moment. A dimmed backdrop, a big seal slamming in, a burst of gold
          and a warm line, then a tap to carry on to the page it belongs to. */}
      {celebrating && (() => {
        const t = STAGE_THEME[celebrating.id] ?? STAGE_THEME[1]
        return (
          <div
            onClick={() => { const id = celebrating.id; setCelebrating(null); goTo(id) }}
            role="button"
            aria-label="Continue"
            style={{
              position: 'fixed', inset: 0, zIndex: 60, cursor: 'pointer',
              background: 'rgba(26,26,46,0.62)', backdropFilter: 'blur(3px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '24px', animation: 'gcCelebFade 0.3s ease both',
            }}
          >
            {/* Gold burst behind the seal */}
            <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{
                  position: 'absolute', width: 9, height: 9, borderRadius: '2px',
                  background: i % 2 ? 'var(--terracotta)' : '#fff',
                  ['--r' as string]: `${i * 30}deg`,
                  animation: `gcBurst 0.75s cubic-bezier(0.22,1,0.36,1) both`,
                  animationDelay: `${0.12 + i * 0.012}s`,
                } as React.CSSProperties} />
              ))}
              <div style={{
                width: 130, height: 130, borderRadius: '50%', background: t.bg,
                border: `4px solid ${t.text}`, color: t.text,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
                animation: 'gcSeal 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: '4px' }}>Stamped</span>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '22px', maxWidth: '320px', animation: 'gcCelebFade 0.4s ease 0.25s both' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                Page {celebrating.id} earned
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: '#fff', marginTop: '8px', lineHeight: 1.15 }}>
                {celebrating.name} complete
              </div>
              <div style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.55, marginTop: '8px' }}>
                {childName === 'your child' ? 'Your child' : childName} has the {celebrating.name} habits in place for their age now. A real step on the road to a confident, capable 16.
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: '18px' }}>
                Tap to see the page
              </div>
            </div>
          </div>
        )
      })()}

      <style>{`
        @keyframes gcStampIn {
          0% { transform: scale(0.4) rotate(-30deg); opacity: 0; }
          100% { transform: scale(1) rotate(-10deg); opacity: 1; }
        }
        @keyframes gcCelebFade { 0% { opacity: 0 } 100% { opacity: 1 } }
        @keyframes gcSeal {
          0% { transform: scale(2.4) rotate(18deg); opacity: 0 }
          60% { opacity: 1 }
          100% { transform: scale(1) rotate(-8deg); opacity: 1 }
        }
        @keyframes gcBurst {
          0% { transform: rotate(var(--r)) translateY(0) scale(0.2); opacity: 0 }
          35% { opacity: 1 }
          100% { transform: rotate(var(--r)) translateY(-92px) scale(1); opacity: 0 }
        }
      `}</style>
    </div>
  )
}
