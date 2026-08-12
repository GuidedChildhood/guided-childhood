'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Celebration from '@/components/ui/Celebration'
import DigiCharacter from '@gc/shared/components/DigiCharacter'

// The end of the road, and the first thing on this page that says so.
//
// Justin, 12 August 2026: "when pathway is done and celebration."
//
// ── THERE WAS NO COMPLETION AT ALL ──────────────────────────────────────────
//
// The trophy at the end of the road lit up when all five stamps landed and that
// was the entire ceremony. No moment, no sentence, no acknowledgement anywhere
// in the app that a family had just finished a twelve year journey. The
// confetti component has existed since the design audit and is fired in eight
// places, for a lesson pass, a deck finished, a quest game won, the setup
// wizard closing. The one thing the whole product is built to reach had none.
//
// ── WHAT IT SAYS, AND WHY IT DOES NOT SAY GOODBYE ───────────────────────────
//
// The temptation is "you are finished", and it would be wrong twice over. It is
// not true, because the daily habit is what holds any of this in place and a
// sixteen year old with a phone is not a solved problem. And it is a terrible
// thing to tell a parent who is about to need us most.
//
// So it names what was actually achieved, which is specific and real: every
// stage walked, and a child who goes into social media with their eyes open
// rather than falling into it off a cliff. Then it points at the passport,
// which is the object they can keep and print, and says plainly that the daily
// stuff carries on. Warm, done, still here.
//
// ── WHY THE CONFETTI REMEMBERS IN A BROWSER, NOT THE DATABASE ───────────────
//
// The ACHIEVEMENT is already permanent: it is five earned stamps in the
// passport, derived from real passes, and this card reads that rather than any
// flag of its own. Nothing about the celebration is a fact about the family.
//
// What needs remembering is much smaller: has THIS SCREEN already had its
// confetti. That is a fact about a browser, and it is exactly the call the
// school chest already makes for the same reason. The cost of getting it wrong
// is a parent seeing the burst twice on a second device, once, ever. The cost
// of a migration is a table Justin has to run by hand before anybody's trophy
// works at all. The card itself is unconditional either way, so a cleared
// browser loses the burst and never the news.

const SEEN_KEY = 'gc.pathway.complete.seen'

export default function PathwayComplete({ childName }: { childName?: string | null }) {
  const kid = childName && childName !== 'Your child' ? childName : 'Your child'
  // Null until the browser has been asked, so the server render and the first
  // client render agree and nothing flashes.
  const [fresh, setFresh] = useState<boolean | null>(null)

  useEffect(() => {
    let already = false
    try { already = localStorage.getItem(SEEN_KEY) === '1' } catch { /* private mode */ }
    setFresh(!already)
    if (!already) {
      try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    }
  }, [])

  return (
    <div style={{ position: 'relative', marginBottom: '18px' }}>
      {/* Fires once, on the first load after the fifth stamp. Celebration draws
          nothing under prefers reduced motion, and everything below still
          lands, which is the whole reason the news is not IN the animation. */}
      {fresh === true && (
        <div aria-hidden style={{
          position: 'absolute', inset: '-20px -20px auto', height: 260,
          pointerEvents: 'none', zIndex: 2,
        }}>
          <Celebration />
        </div>
      )}

      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--terracotta-lt)', border: '2px solid var(--terracotta)',
        borderRadius: '20px', padding: '20px 20px 18px',
        boxShadow: '0 5px 0 var(--terracotta-dark)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{
            flexShrink: 0, width: 52, height: 52, borderRadius: '50%', background: '#fff',
            border: '2.5px solid var(--terracotta)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DigiCharacter size={34} mood="wave" />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
            }}>
              All five stamps
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
              letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1.2,
            }}>
              The whole pathway, walked
            </div>
          </div>
        </div>

        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 10px' }}>
          Every stage from four to sixteen. {kid} goes into all of this with their eyes open rather than falling into it off a cliff, and that was the whole point of the road.
        </p>
        {/* The honest half. A finished pathway is not a finished job, and a
            parent who reads "you are done" here is a parent we have quietly
            shown the door at the exact moment they need us most. */}
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
          Nothing stops. The daily habit is what holds it in place, and we are here for whatever comes next.
        </p>

        <Link href="#passport" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <span className="btn btn-gold" style={{ display: 'inline-flex' }}>
            See the finished passport
          </span>
        </Link>
      </div>
    </div>
  )
}
