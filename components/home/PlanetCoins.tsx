'use client'

import Link from 'next/link'
import PlanetArt from '@/components/pathway/PlanetArt'
import ChestSpark from '@/components/pathway/ChestSpark'
import { PLANETS } from '@/lib/pathway/planets'

// Everything else in the product, as six coins under today's loop.
//
// Justin, 12 August 2026, after hunting for the school chest twice and finally
// finding it: "it is on the passport pathway, which is fine, but it needs to be
// on the pathway five a day tabs a parent does. That is where it should rotate
// and pop up as Duolingo type bonuses." Then, on the shape: "all needs to be
// neat pages hidden behind coins, planets, with quick words to say what it is
// and to its own page, tidy neat easy to read."
//
// ── WHY IT MOVED ────────────────────────────────────────────────────────────
//
// The planet card and the school chest were both built onto /dashboard/pathway,
// which is the passport page. It is the right page for a road that spans four
// to sixteen and the wrong one for a discovery: a parent opens Home daily and
// the passport occasionally, so anything meant to introduce the product was
// sitting behind the least visited door. Justin proved it by looking straight
// past both, twice, and reporting them missing.
//
// The daily loop is where a parent actually is. So the coins sit directly under
// it, in the one place they open every day.
//
// ── WHY COINS AND NOT MORE CARDS ────────────────────────────────────────────
//
// Home is already long. Six full cards would be six more scrolls and would
// bury the loop they are meant to sit beside. A coin is an icon, two words and
// a tap: it costs one row of a phone screen for all six, which is the only
// budget Home has left. The full sentence for each still exists, on the planet
// card on the pathway page, for a parent who wants the pitch.
//
// The art is the same PlanetArt the card uses, at 52px instead of 92. One
// drawing, two sizes, so a coin and its card can never drift apart.
//
// ── NO COUNTS, NO DOTS, NO BADGES ───────────────────────────────────────────
//
// Same rule the planet card carries and for the same reason. The moment a coin
// says "3 waiting" it stops being somewhere to wander and becomes another thing
// a parent is behind on, and the loop above it is already carrying every bit of
// obligation this page can hold. These are doors, not duties.

// ── ONE COIN A WEEK IS LIT, AND IT MOVES ────────────────────────────────────
//
// Justin: "the coins or planets and shooting star and rotating coins on the
// today's task for parents page."
//
// Six equal coins is a menu, and a menu gets skimmed once and becomes
// furniture. That is the same argument the planet card already makes for
// showing one thing a week, so the coins use the SAME index rather than a
// second rotation of their own: the coin that is lit on Home this week is the
// planet on the pathway page this week, and a parent who follows one and then
// the other is not shown two different recommendations.
//
// `featured` arrives from the server for the same reason PlanetCard takes
// startIndex: working the week out in the browser means the server renders one
// coin lit and the client another, and React calls that a hydration mismatch.

export default function PlanetCoins({ featured }: { featured: number }) {
  const lit = Number.isInteger(featured) && featured >= 0 && featured < PLANETS.length ? featured : 0

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: '20px',
      padding: '15px 13px 14px',
      marginBottom: '20px',
    }}>
      {/* The same shooting star that crosses the school chest, for the same
          reason: it says look over here and carries no obligation with it,
          which a badge or a count could never do. Three passes and it stops,
          so it is a greeting rather than a screensaver. */}
      <ChestSpark active />

      <style>{`
        @keyframes coin-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .coin-lit { animation: coin-float 2.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .coin-lit { animation: none; } }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, padding: '0 3px', marginBottom: '11px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)',
        }}>
          Everything else
        </span>
        {/* No "see all" link. There is no seventh thing behind these six, and a
            link that only ever shows you what you can already see is a lie the
            eye has to check. */}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
          One tap each
        </span>
      </div>

      {/* THREE ACROSS AT EVERY WIDTH, and that is a correction rather than a
          preference. It was auto-fit with a 94px minimum, which reads as the
          flexible, modern answer and produced five coins on a row and one
          stranded underneath at 1280: measured, not guessed. Six divides by
          three and by two, never by five, so a fixed three column grid is the
          only setting that is tidy on a phone AND on a laptop. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
      }}>
        {PLANETS.map((p, i) => (
          <Link
            key={p.key}
            href={p.href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
              textDecoration: 'none', padding: '9px 4px 10px', borderRadius: '16px',
              background: 'transparent',
            }}
          >
            {/* The tinted disc is what makes it read as a coin rather than a
                sticker: the planet sits IN something, the way the card draws it.
                This week's coin is the only one that moves. It is a slow float
                rather than a pulse or a wobble, because the row sits under the
                daily loop and anything sharp down here competes with the one
                step a parent actually came to do. */}
            <span
              aria-hidden
              className={i === lit ? 'coin-lit' : undefined}
              style={{
                width: 62, height: 62, borderRadius: '100px', background: p.tint,
                border: i === lit ? `2.5px solid ${p.ring}` : `1.5px solid ${p.ring}`,
                boxShadow: `0 3px 0 ${p.ring}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {/* tint transparent because the disc is the span above: drawing
                  it twice puts a hard circle inside a soft one. The alt is
                  still passed even though the wrapper is hidden, so the markup
                  stays valid rather than an image with an empty label. */}
              <PlanetArt motif={p.key} body={p.body} ring={p.ring} tint="transparent" size={52} alt={p.alt} />
            </span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
              color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2,
            }}>
              {p.short}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
