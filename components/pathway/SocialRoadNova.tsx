'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { characterForStage } from '@/lib/content/stage-characters'
import { legNextStep, type SocialRoad } from '@/lib/pathway/social-road'

// Nova, on the parent's pathway, pointing down the road to social media.
//
// Justin: "on the parents pathway every month we need an appearance of Nova
// that says come this way for the road to social media. It needs to then only
// be completed when they complete relevant lesson on social media and children
// have done their necessary part, like an extra on the Duolingo pathway, keeps
// them on track to get the passport pass."
//
// WHY THIS IS NOT ANOTHER LESSON CARD. Everything else on this page is measured
// on the family: the passport asks whether the household has covered a thing.
// This one asks TWICE, and shows both answers, because the entire point of the
// run up to sixteen is that the parent and the child arrive there having each
// done the work. Two ticks per leg, both visible, neither standing in for the
// other. See lib/pathway/social-road.ts.
//
// WHY IT IS A ROAD AND NOT A LIST. The eighteen social media lessons already
// existed and sat in the lesson hub in sort order, indistinguishable from
// everything else. A parent met them as list entries. Named as a road with one
// leg a month, they become the thing they actually are: the years between
// eleven and sixteen, walked in order, with somebody up ahead saying come on.
//
// Nova is the Stage 4 Planet Friend, ages 13 to 15, whose role is "making your
// own good choices". It is her road.

export default function SocialRoadNova({
  road,
  childId,
  childName,
  onApp,
}: {
  road: SocialRoad
  childId: string
  childName: string | null
  /** Does the child have their own app? Decides which second button shows. */
  onApp: boolean
}) {
  const [marking, setMarking] = useState(false)
  const [markedNow, setMarkedNow] = useState(false)
  const [failed, setFailed] = useState(false)

  const nova = characterForStage(4)
  const leg = road.current
  const walked = road.complete + (markedNow && leg?.parentDone ? 1 : 0)
  const pct = road.total > 0 ? Math.round((walked / road.total) * 100) : 0
  const them = childName ?? 'your child'

  const markTogether = async () => {
    if (marking || !leg) return
    setMarking(true)
    setFailed(false)
    try {
      const res = await fetch('/api/social-road', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, lessonId: leg.lessonId }),
      })
      if (!res.ok) throw new Error('failed')
      setMarkedNow(true)
    } catch {
      setFailed(true)
    } finally {
      setMarking(false)
    }
  }

  const childTicked = !!leg?.childDone || markedNow

  return (
    <div style={{
      background: 'var(--stage-4)', border: '1.5px solid var(--stage-4-bold)',
      borderRadius: '20px', padding: '17px 18px', marginBottom: '16px',
    }}>
      {/* Nova, and where the road has got to */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '12px' }}>
        {nova && (
          <span style={{
            flexShrink: 0, width: 56, height: 56, borderRadius: '50%', overflow: 'hidden',
            border: `2.5px solid ${nova.colour}`, background: '#fff', position: 'relative',
            boxShadow: '0 3px 0 rgba(26,26,46,0.10)',
          }}>
            <Image src={nova.img} alt="Nova" fill sizes="56px" style={{ objectFit: 'cover' }} />
          </span>
        )}
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stage-4-text)',
          }}>
            The road to social media
          </span>
          <span style={{
            display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25, marginTop: 2,
          }}>
            {road.current ? 'Come this way' : 'You walked the whole road'}
          </span>
        </span>
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          color: 'var(--stage-4-text)', whiteSpace: 'nowrap',
        }}>
          {walked}/{road.total}
        </span>
      </div>

      {/* The legs as a row of marks, Duolingo style: walked, next, still ahead */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '13px' }} aria-hidden>
        {road.legs.map((l, i) => {
          const done = (l.parentDone && l.childDone) || (markedNow && l.lessonId === leg?.lessonId && l.parentDone)
          const isNext = l.lessonId === leg?.lessonId && !done
          return (
            <span key={l.lessonId} style={{
              flex: 1, height: isNext ? 9 : 6, borderRadius: 100,
              alignSelf: 'center',
              background: done ? 'var(--retro-green)' : isNext ? 'var(--terracotta)' : 'rgba(26,26,46,0.14)',
              transition: 'background 0.3s ease',
            }} title={`Leg ${i + 1}`} />
          )
        })}
      </div>

      {leg ? (
        <>
          <div style={{
            background: 'rgba(255,255,255,0.72)', border: '1px solid var(--border)',
            borderRadius: '14px', padding: '13px 14px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stage-4-text)', marginBottom: 5,
            }}>
              This month
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
              {leg.title}
            </div>
            {leg.keyMessage && (
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '5px 0 0' }}>
                {leg.keyMessage}
              </p>
            )}

            {/* THE TWO TICKS. Both always shown, even when neither is done, so
                it is obvious from the first look that this one needs two
                people. A single row that filled in silently would read like
                every other lesson tick in the product. */}
            <div style={{ marginTop: 11, display: 'grid', gap: 6 }}>
              {[
                { done: leg.parentDone, label: 'You have watched it' },
                { done: childTicked, label: `${childName ?? 'They'} ${childName ? 'has' : 'have'} done their part` },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    flexShrink: 0, width: 18, height: 18, borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: row.done ? 'var(--retro-green)' : 'transparent',
                    border: row.done ? 'none' : '1.5px solid var(--terracotta-dark)',
                  }}>
                    {row.done && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                    )}
                  </span>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', opacity: row.done ? 0.55 : 1 }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '9px 0 0' }}>
              {legNextStep({ ...leg, childDone: childTicked }, childName)}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            {!leg.parentDone && (
              <Link
                href={`/dashboard/lessons/${leg.lessonId}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
                  borderRadius: 14, padding: '11px 17px', textDecoration: 'none',
                  boxShadow: '0 4px 0 var(--terracotta-dark)',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                }}
              >
                Watch it
              </Link>
            )}
            {/* Not a button. The lesson is already on the child's own list of
                stage lessons the moment it is in reach, so there is nothing for
                the parent to send and nowhere useful to send them: the first
                version of this linked to the jobs board, which is a different
                page about a different thing. It is a status, so it reads as
                one. */}
            {!childTicked && onApp && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#fff', color: 'var(--ink-soft)', border: '1px solid var(--border)',
                borderRadius: 100, padding: '8px 13px',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.04em',
              }}>
                Waiting on {them}&rsquo;s app
              </span>
            )}
            {!childTicked && (
              <button
                type="button"
                onClick={markTogether}
                disabled={marking}
                style={{
                  background: 'none', border: 'none', padding: '11px 2px', cursor: marking ? 'default' : 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
                  color: 'var(--ink-muted)', textDecoration: 'underline',
                }}
              >
                {marking ? 'Saving' : 'We did this one together'}
              </button>
            )}
          </div>
          {failed && (
            <p style={{ fontSize: 'var(--text-sm)', color: '#B93B3F', margin: '7px 0 0', lineHeight: 1.45 }}>
              That did not save. Have another go in a moment.
            </p>
          )}
        </>
      ) : (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
          Every leg open to {them} is walked, by both of you.{' '}
          {road.ahead > 0
            ? `${road.ahead} more ${road.ahead === 1 ? 'opens' : 'open'} up as they grow.`
            : 'That is the whole road to sixteen.'}
        </p>
      )}
    </div>
  )
}
