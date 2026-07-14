'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The passport, gamified and live. Five stamps, one per stage. Each fills as
// the family works through that stage's tasks (the same blend the pathway
// uses), and lands as a solid stamp at 100 percent. This is deliberately not
// the stars: stars are the child's daily quest reward, stamps are the parent
// and child earning a whole stage of the journey to 16. Every stamp links to
// its stage, so it doubles as a map and a catch up plan: a family joining late
// sees the earlier stamps waiting, and can go and fill them in. When all five
// are stamped, the passport is complete and celebrates.

export type StampStatus = 'earned' | 'current' | 'catchup' | 'upcoming'

export interface Stamp {
  id: number
  name: string
  ages: string
  pct: number
  status: StampStatus
  href: string
  // The visible process on the passport page: lessons done of total.
  lessonsDone?: number
  lessonsTotal?: number
  // The four tasks that stamp the page, each as its own percent, so a page
  // can show a plain checklist of exactly what is left to complete.
  scriptsPct?: number
  streakPct?: number
  devicesPct?: number
  lessonsPct?: number
}

const R = 32
const C = 2 * Math.PI * R

function ringColor(s: StampStatus): string {
  if (s === 'earned') return 'var(--terracotta)'
  if (s === 'current') return 'var(--terracotta)'
  if (s === 'catchup') return 'var(--stage-4-bold)'
  return 'var(--border)'
}
function label(s: StampStatus): string {
  if (s === 'earned') return 'Earned'
  if (s === 'current') return 'In progress'
  if (s === 'catchup') return 'Catch up'
  return 'Ahead'
}

export default function PassportStamps({
  stamps,
  childName,
}: {
  stamps: Stamp[]
  childName: string
}) {
  // Fill the rings from empty on mount, so they visibly draw in.
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 120)
    return () => clearTimeout(t)
  }, [])

  const earnedCount = stamps.filter(s => s.status === 'earned').length
  const allEarned = earnedCount === stamps.length && stamps.length > 0

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
      padding: '20px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          {childName === 'your child' ? 'The' : `${childName}'s`} social media passport
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
          {earnedCount}/{stamps.length}
        </span>
      </div>
      <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 16px' }}>
        One stamp for each stage, earned as you work through it. Complete the passport by 16.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(84px, 1fr))', gap: '10px' }}>
        {stamps.map(stamp => {
          const col = ringColor(stamp.status)
          const shown = drawn ? stamp.pct : 0
          const offset = C * (1 - Math.min(shown, 100) / 100)
          const earned = stamp.status === 'earned'
          const dim = stamp.status === 'upcoming'
          return (
            <Link key={stamp.id} href={stamp.href} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', opacity: dim ? 0.55 : 1 }}>
                <div style={{ position: 'relative', width: 76, height: 76 }}>
                  <svg width="76" height="76" viewBox="0 0 76 76" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                    <circle cx="38" cy="38" r={R} fill="none" stroke="var(--border)" strokeWidth="5" />
                    <circle
                      cx="38" cy="38" r={R} fill="none" stroke={col} strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={C} strokeDashoffset={offset}
                      style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
                    />
                  </svg>
                  {/* Centre: a solid stamp when earned, the stage number otherwise */}
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    {earned ? (
                      <div style={{
                        width: 46, height: 46, borderRadius: '50%', background: 'var(--terracotta)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 0 var(--terracotta-dark)',
                        animation: drawn ? 'stampIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
                      }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5l4.5 4.5L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.35rem', lineHeight: 1, color: dim ? 'var(--ink-muted)' : 'var(--ink)' }}>
                          {stamp.id}
                        </span>
                        {stamp.status !== 'upcoming' && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, color: 'var(--ink-muted)', marginTop: '1px' }}>
                            {stamp.pct}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11.5px', color: 'var(--ink)', lineHeight: 1.15 }}>
                    {stamp.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.06em',
                    textTransform: 'uppercase', marginTop: '3px',
                    color: earned ? 'var(--terracotta-dark)' : stamp.status === 'catchup' ? 'var(--stage-4-text)' : 'var(--ink-light)',
                  }}>
                    {label(stamp.status)}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {allEarned && (
        <div style={{
          marginTop: '16px', background: 'var(--deep-teal)', borderRadius: '14px',
          padding: '14px 16px', textAlign: 'center',
          animation: drawn ? 'stampIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: '#fff' }}>
            🎉 Passport complete
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, marginTop: '3px' }}>
            Every stage earned, all the way to 16. {childName === 'your child' ? 'Your child is' : `${childName} is`} prepared, educated and safe.
          </div>
        </div>
      )}

      <style>{`
        @keyframes stampIn {
          0% { transform: scale(0.4) rotate(-12deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
