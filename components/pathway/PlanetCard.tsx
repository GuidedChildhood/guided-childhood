'use client'

import { useState } from 'react'
import Link from 'next/link'
import PlanetArt from './PlanetArt'
import { PLANETS } from '@/lib/pathway/planets'

// One planet a week, under the pathway.
//
// ── THE SHAPE IS WANDERLOG'S, AND HERE IS WHY IT WON ────────────────────────
//
// Justin asked for the Mobbin research before this got built, so: the pattern
// that keeps coming back for "here is something else in this app" is the same
// four decisions everywhere it appears. The image is first and it is BIG,
// carrying most of the card. The heading is four to six words in the display
// weight. There is exactly one grey line under it. Navigation is dots, not
// arrows. Wanderlog is the cleanest example of it and the closest to what he
// described, which is why this looks like that.
//
// The thing all four decisions are protecting is the two second glance. A
// parent scrolling past the road is not reading, they are deciding whether to
// stop, and that decision is made on the picture and the heading alone. Every
// extra word is a reason to keep scrolling. So the line under the heading is
// there for the parent who has already stopped, and nothing else is there at
// all.
//
// ── THE WEEK PICKS, THE PARENT CAN OVERRULE ─────────────────────────────────
//
// It opens on the week's planet, which the SERVER works out and passes in.
// That matters more than it looks: if this component picked the week itself,
// the server and the browser would each read their own clock and React would
// hydrate a different planet than it rendered, which is a real flash of the
// wrong card on every single load.
//
// The dots then let a parent look at the other five without leaving the page.
// They are the release valve on the one a week rule: the rotation exists so
// nobody has to read a menu, and the dots exist so nobody who WANTS the menu is
// stuck waiting five weeks for it.
//
// Swipe works too, because on a phone this is a card that looks swipeable and
// a card that looks swipeable and is not feels broken.

export default function PlanetCard({ startIndex }: { startIndex: number }) {
  // Clamped rather than trusted. The server computes this from a date and a
  // modulo, but a bad prop should shift the card, never blank the page.
  const safeStart = Number.isInteger(startIndex) && startIndex >= 0 && startIndex < PLANETS.length ? startIndex : 0
  const [i, setI] = useState(safeStart)
  const [touchX, setTouchX] = useState<number | null>(null)
  const planet = PLANETS[i]

  const step = (by: number) => setI(prev => (prev + by + PLANETS.length) % PLANETS.length)

  return (
    <div
      onTouchStart={e => setTouchX(e.touches[0]?.clientX ?? null)}
      onTouchEnd={e => {
        if (touchX === null) return
        const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX
        // 44px, the same threshold as a tap target, so a slightly wobbly tap on
        // the card itself never counts as a swipe and steals the navigation.
        if (Math.abs(dx) > 44) step(dx < 0 ? 1 : -1)
        setTouchX(null)
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
        marginBottom: '8px',
      }}>
        Also in your app
      </div>

      {/* The whole card is the button. Justin: "it should be a clickable button".
          Not a card with a link in the corner: the entire thing, because the
          picture is the part a thumb goes for. */}
      <Link
        href={planet.href}
        style={{ textDecoration: 'none', display: 'block' }}
        aria-label={`${planet.title}. ${planet.line}`}
      >
        <div
          key={planet.key}
          className="gc-planet-card"
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            background: '#fff', border: '1.5px solid var(--border)',
            borderRadius: '18px', padding: '14px 16px',
            // The house button shadow, so this reads as a thing you press and
            // sits in the same family as every other chunky control.
            boxShadow: '0 4px 0 var(--border)',
          }}
        >
          <PlanetArt
            motif={planet.key} body={planet.body} ring={planet.ring}
            tint={planet.tint} alt={planet.alt} size={82}
          />
          {/* No arrow, and it is not an oversight. On a 390 wide phone the
              arrow and its gap cost about 32px of the only column that has any
              work to do, which pushed the grey line onto a third cramped row.
              The card carries the pressed button shadow and the whole of it is
              the link, so the affordance was never the arrow's job. Wanderlog
              drops it for the same reason and uses the dots instead. */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'var(--text-lg)', color: 'var(--ink)',
              lineHeight: 1.25, marginBottom: '4px',
            }}>
              {planet.title}
            </div>
            <div style={{
              fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.4,
            }}>
              {planet.line}
            </div>
          </div>
        </div>
      </Link>

      {/* Dots, not arrows. Six of them says "there are six things in here"
          before a parent has tapped anything, which is most of the job. */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '7px', marginTop: '11px',
      }}>
        {PLANETS.map((p, n) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setI(n)}
            aria-label={p.title}
            aria-current={n === i ? 'true' : undefined}
            style={{
              // 28px of tappable area around a 7px dot. The dot is the thing
              // you see; the button is the thing you hit.
              width: 28, height: 28, padding: 0, border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{
              display: 'block', borderRadius: '50%',
              width: n === i ? 9 : 7, height: n === i ? 9 : 7,
              background: n === i ? 'var(--terracotta)' : 'var(--border)',
              border: n === i ? '1.5px solid var(--terracotta-dark)' : 'none',
            }} />
          </button>
        ))}
      </div>

      {/* The card fades in when it changes, so tapping a dot reads as a swap
          rather than a repaint. Keyed on the planet above, so React remounts it
          and the animation runs every time.

          Reduced motion gets the swap with no fade, which is the same
          information with none of the movement. */}
      <style>{`
        .gc-planet-card { animation: gcPlanetIn .22s ease-out }
        @keyframes gcPlanetIn { from { opacity: .3 } to { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .gc-planet-card { animation: none }
        }
      `}</style>
    </div>
  )
}
