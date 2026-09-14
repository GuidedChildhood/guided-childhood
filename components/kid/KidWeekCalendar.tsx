'use client'

import { HAPPY, Ribbon, StarShape } from '@/components/kid/HappyNewsBits'

// The child's week, as a row of seven tiles.
//
// Justin, 14 September 2026, with four screenshots of the Kenji shop (the
// chick and the bunny on a polka dot sky, the gem rewards board, the boba
// blind boxes): "Child calendar does not look great in yellow. Redesign in
// super fun happy news style like the Kenji shop but our Planet Friends."
//
// Three week rows had grown on the child's side and all three were yellow on
// yellow: a butter circle with a butter star, gold stars on cream, a plain
// green tick. This is the one row now, in the Happy Newspaper finish, with
// the Kenji move that makes it fun: a pastel sky ground scattered with coral
// and butter dots, and on every done day the child's own Planet Friend
// sitting on the tile like a sticker. Today wears a coral edge and a tag.
// Days ahead are drawn dotted so the week keeps its shape, and a past day
// with nothing on it is simply quiet: no red, no loss language, the ICO
// Children's Code line the whole app holds.
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
  /** The pill on the right, e.g. { n: 3, of: 7, word: 'full days' }. */
  count?: { n: number; of?: number; word: string } | null
  /** The line under the tiles. */
  line?: string | null
  /** No ground, no ribbon: just the tiles, for sitting inside another card. */
  compact?: boolean
  tone?: 'sky' | 'butter' | 'green'
}) {
  const ground = tone === 'butter' ? 'var(--tint-butter, #FFF6DE)' : tone === 'green' ? 'var(--tint-green, #E8F4EE)' : 'var(--tint-blue, #D8E8F8)'
  const dots = `radial-gradient(circle at 12px 10px, ${HAPPY.coral}55 3px, transparent 3.5px), radial-gradient(circle at 36px 30px, ${HAPPY.butter}88 3px, transparent 3.5px)`
  const tileSize = compact ? 36 : 44

  const tiles = (
    <div data-week-calendar style={{ display: 'flex', justifyContent: 'space-between', gap: compact ? 4 : 6 }}>
      {days.map((d, i) => {
        const state = d.done ? 'done' : d.isToday ? 'today' : d.ahead ? 'ahead' : 'quiet'
        return (
          <div key={i} data-day={state} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
              color: d.isToday ? HAPPY.coral : 'var(--ink-muted)',
            }}>
              {d.isToday ? 'TODAY' : d.letter}
            </span>
            <span
              aria-label={d.done ? `${d.letter}, done` : d.isToday ? 'today' : d.ahead ? `${d.letter}, still to come` : `${d.letter}, quiet`}
              style={{
                position: 'relative', width: '100%', maxWidth: tileSize + 8, height: tileSize + 6, borderRadius: 12,
                background: d.done ? '#fff' : d.isToday ? HAPPY.butterLt : 'rgba(255,255,255,0.55)',
                border: d.done ? `2px solid ${HAPPY.ink}` : d.isToday ? `2px solid ${HAPPY.coral}` : d.ahead ? '2px dashed rgba(26,26,46,0.22)' : '2px solid rgba(26,26,46,0.12)',
                boxShadow: d.done ? `0 3px 0 ${HAPPY.ink}` : d.isToday ? `0 3px 0 ${HAPPY.coral}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible',
              }}
            >
              {d.done && friend ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={friend.img} alt={friend.name} width={tileSize} height={tileSize} style={{ width: tileSize, height: tileSize, objectFit: 'contain', transform: `rotate(${i % 2 ? 6 : -6}deg)`, filter: 'drop-shadow(0 2px 2px rgba(26,26,46,0.18))' }} />
                  <span aria-hidden style={{
                    position: 'absolute', top: -7, right: -6, width: 18, height: 18, borderRadius: '50%',
                    background: HAPPY.green, color: '#fff', border: '2px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, lineHeight: 1,
                  }}>✓</span>
                </>
              ) : d.done ? (
                <StarShape size={tileSize * 0.6} color={HAPPY.butter} />
              ) : d.isToday ? (
                <span aria-hidden style={{ width: 10, height: 10, borderRadius: '50%', background: HAPPY.coral }} />
              ) : null}
            </span>
          </div>
        )
      })}
    </div>
  )

  if (compact) return tiles

  return (
    <div data-week-card style={{
      position: 'relative', background: `${dots}, ${ground}`, backgroundSize: '48px 40px, auto',
      border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-card)', boxShadow: `0 5px 0 ${HAPPY.ink}`,
      padding: '14px 12px 12px', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Ribbon tone={tone === 'green' ? 'green' : 'butter'}>{title ?? 'My week'}</Ribbon>
        {count && (
          <span style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 4, background: '#fff', border: `2px solid ${HAPPY.ink}`,
            borderRadius: 'var(--radius-pill)', padding: '5px 9px', boxShadow: `0 3px 0 ${HAPPY.ink}`, whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: HAPPY.ink, lineHeight: 1 }}>{count.n}{count.of ? ` of ${count.of}` : ''}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{count.word}</span>
          </span>
        )}
      </div>
      {tiles}
      {line && (
        <p style={{ margin: '11px 0 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: HAPPY.ink, lineHeight: 1.3 }}>
          {line}
        </p>
      )}
    </div>
  )
}
