'use client'

import { HAPPY, Burst, Ribbon, StarShape, SunRays } from '@/components/kid/HappyNewsBits'

// The child's week, as a row of seven discs.
//
// Justin, 14 September 2026, with the child home, the sticker book, Jonny's
// week and The Happy Newspaper website side by side: "design of background
// blue dots is not the right look, we want happy news style as the image here
// for calendar."
//
// The image: a white page. A big flat sun yellow disc with a drawn envelope on
// it, a big flat pink disc with a drawn post box on it, black hand drawn lines,
// one yellow ribbon with black words. Nothing patterned, nothing tinted,
// nothing behind the drawing but the disc.
//
// So the polka dot sky from the Kenji pass (earlier the same day) is gone, and
// the week is now that page, small. A white card with an ink edge. Every day
// is a DISC: a full day is a butter disc with the child's own Planet Friend
// sitting on it like a sticker, today is the pink disc with the sun's rays
// drawn around it, a day still to come is a white disc with a dashed edge, and
// a quiet day that has gone is a pale disc and nothing said about it, which is
// the ICO Children's Code line the whole app holds: no red, no loss language.
// The count is the sun, a butter burst with the number in it, and the one
// ribbon is the heading.
//
// Mobbin, this session: Me+ puts its mascot ON the week card, Finch its dots
// above the day, Duolingo its owl beside the streak. All three say the
// character belongs with the week. None is copied.
//
// Used by the five a day (full days), the sticker book (daily stickers) and
// the balance card (days with a quest), each handing in its own days, its
// own heading and its own line under.

export type WeekDay = { letter: string; done: boolean; isToday: boolean; ahead?: boolean }

export default function KidWeekCalendar({ days, friend, title, count, line, compact = false, tone = 'sky' }: {
  days: WeekDay[]
  /** The child's own Planet Friend, on every done day. */
  friend: { name: string; img: string } | null
  /** The ribbon heading. */
  title?: string
  /** The sun on the right, e.g. { n: 3, of: 7, word: 'full days' }. */
  count?: { n: number; of?: number; word: string } | null
  /** The line under the discs. */
  line?: string | null
  /** No card, no ribbon: just the discs, for sitting inside another card. */
  compact?: boolean
  /** Kept for the callers. The ribbon goes green for the green tone; the discs are the same page everywhere. */
  tone?: 'sky' | 'butter' | 'green'
}) {
  const disc = compact ? 34 : 44
  const rayBox = disc + 18

  const tiles = (
    <div data-week-calendar style={{ display: 'flex', justifyContent: 'space-between', gap: compact ? 4 : 6 }}>
      {days.map((d, i) => {
        const state = d.done ? 'done' : d.isToday ? 'today' : d.ahead ? 'ahead' : 'quiet'
        return (
          <div key={i} data-day={state} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 3 : 5 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
              color: d.isToday ? HAPPY.coral : 'var(--ink-muted)',
            }}>
              {d.isToday ? 'TODAY' : d.letter}
            </span>
            {/* A fixed box the size of the rays, so the row stays level whether
                or not today is in it. */}
            <span style={{ position: 'relative', width: rayBox, height: rayBox, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {state === 'today' && (
                <SunRays size={rayBox} style={{ position: 'absolute', inset: 0 }} />
              )}
              <span
                aria-label={d.done ? `${d.letter}, done` : d.isToday ? 'today' : d.ahead ? `${d.letter}, still to come` : `${d.letter}, quiet`}
                style={{
                  position: 'relative', width: disc, height: disc, borderRadius: '50%', boxSizing: 'border-box',
                  background: d.done ? HAPPY.butter : d.isToday ? HAPPY.pink : d.ahead ? '#fff' : '#F3F1EC',
                  border: d.done ? `2px solid ${HAPPY.ink}` : d.isToday ? `2px solid ${HAPPY.coral}` : d.ahead ? '2px dashed rgba(26,26,46,0.28)' : '2px solid rgba(26,26,46,0.1)',
                  boxShadow: d.done ? `0 3px 0 ${HAPPY.ink}` : d.isToday ? `0 3px 0 ${HAPPY.coral}` : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible',
                }}
              >
                {d.done && friend ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={friend.img} alt={friend.name} width={disc} height={disc} style={{ width: disc, height: disc, objectFit: 'contain', transform: `rotate(${i % 2 ? 6 : -6}deg)`, filter: 'drop-shadow(0 2px 2px rgba(26,26,46,0.18))' }} />
                    <span aria-hidden style={{
                      position: 'absolute', top: -7, right: -7, width: 18, height: 18, borderRadius: '50%',
                      background: HAPPY.green, color: '#fff', border: '2px solid #fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, lineHeight: 1,
                    }}>✓</span>
                  </>
                ) : d.done ? (
                  <StarShape size={disc * 0.6} color="#fff" />
                ) : d.isToday ? (
                  <span aria-hidden style={{ width: disc * 0.24, height: disc * 0.24, borderRadius: '50%', background: HAPPY.coral }} />
                ) : null}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )

  if (compact) return tiles

  return (
    <div data-week-card data-look="happy" style={{
      position: 'relative', background: '#fff',
      border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-card)', boxShadow: `0 5px 0 ${HAPPY.ink}`,
      padding: '14px 12px 12px', overflow: 'hidden',
    }}>
      {/* Two small stars in the corners, the way the Plate has them: the only
          decoration on the page, and it is drawn, not patterned. */}
      <span aria-hidden style={{ position: 'absolute', top: 8, right: 10 }}><StarShape size={12} color={HAPPY.coral} /></span>
      <span aria-hidden style={{ position: 'absolute', bottom: 10, left: 8 }}><StarShape size={10} color={HAPPY.butter} /></span>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <Ribbon tone={tone === 'green' ? 'green' : 'butter'}>{title ?? 'My week'}</Ribbon>
        {count && (
          <span data-week-count style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <Burst size={46} color={HAPPY.butter}>{count.n}</Burst>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              {count.of ? (
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: HAPPY.ink }}>of {count.of}</span>
              ) : null}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{count.word}</span>
            </span>
          </span>
        )}
      </div>
      {tiles}
      {line && (
        <p style={{ margin: '10px 0 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: HAPPY.ink, lineHeight: 1.3 }}>
          {line}
        </p>
      )}
    </div>
  )
}
