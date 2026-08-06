'use client'

import KidStickers, { type KidSticker } from '@/components/kid/KidStickers'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { FRIEND_STREAKS, streaksForFriend, streaksToNextFriend, nextFriendToEarn } from '@/lib/pathway/streak-unlock'

// My wins: everything this child has actually done, in numbers big enough to
// hold up.
//
// Justin: "need to show clearly what they have achieved in streaks so if
// comparing with sibling they can see how they progressed."
//
// THE COMPARISON IS THEIRS, NOT OURS. Two children in one house are going to
// compare, and pretending otherwise just means one of them has nothing to show.
// So this makes a child's own record clear and easy to be proud of, and stops
// there. It never shows a sibling's numbers, never ranks anybody, and never says
// who is ahead. A leaderboard between brothers and sisters, built by us, would
// be a machine for making the younger one feel small.
//
// FOUR NUMBERS, AND WHY THESE FOUR:
//
//   Streaks earned    the currency, and the one that buys Friends
//   Best run          the record. Deliberately separate from the current run: a
//                     child who managed eleven days in March has done eleven
//                     days, and April cannot take that away
//   Days in a row     the current run, shown only when there IS one
//   Friends home      the family growing, which is the whole point
//
// No "days missed", no percentage, no "you were on 12". Nothing here can be
// read as a telling off, because a record a child is frightened of is a record
// they stop looking at.

export type WinRecord = {
  streaks: number
  completedDays: number
  bestRun: number
  currentRun: number
  friends: number
  wins: number
  stars: number
}

function Stat({ n, label, sub, colour }: { n: number | string; label: string; sub?: string; colour: string }) {
  return (
    <div style={{
      background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: 18,
      padding: '14px 12px', textAlign: 'center', boxShadow: `0 4px 0 ${colour}`,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '32px',
        color: 'var(--ink)', lineHeight: 1,
      }}>{n}</div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
        color: 'var(--ink)', marginTop: 4, lineHeight: 1.15,
      }}>{label}</div>
      {sub && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          color: 'var(--ink-muted)', marginTop: 3, lineHeight: 1.2,
        }}>{sub}</div>
      )}
    </div>
  )
}

export default function KidWins({
  onClose, token, childName, record, stickers, celebrateStickers,
}: {
  onClose: () => void
  token: string
  childName: string
  record: WinRecord | null
  stickers: KidSticker[]
  celebrateStickers: string[]
}) {
  const r = record
  const next = r ? nextFriendToEarn(r.friends) : null
  const toNext = r ? streaksToNextFriend(r.streaks) : FRIEND_STREAKS[0]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(26,26,46,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420, maxHeight: '86vh', overflowY: 'auto',
          background: 'var(--cream)', borderRadius: 24, padding: '22px 20px',
          boxShadow: '0 20px 50px -16px rgba(26,26,46,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
            color: 'var(--ink)', letterSpacing: '-0.01em',
          }}>
            🏆 {childName}&rsquo;s wins
          </span>
          <button onClick={onClose} aria-label="Close" style={{
            width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff',
            cursor: 'pointer', fontSize: 'var(--text-lg)', color: 'var(--ink-muted)', flexShrink: 0,
          }}>✕</button>
        </div>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600,
          color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 16px',
        }}>
          Everything you have earned, all in one place. Show somebody.
        </p>

        {!r ? (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600,
            color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 18px',
          }}>
            Finish today and your first win lands here.
          </p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <Stat n={r.streaks} label="Streaks earned" colour="var(--terracotta)" />
              <Stat
                n={r.bestRun}
                label="Best run"
                sub={r.bestRun === 1 ? 'day in a row' : 'days in a row'}
                colour="#E8873C"
              />
              <Stat n={`${r.friends}/5`} label="Friends home" colour="#7CB342" />
              <Stat n={r.stars} label="Stars banked" colour="#4C9FD6" />
            </div>

            {/* The current run, and only when there is one. Silent otherwise:
                nothing here ever says a run ended, or was lost, or is at risk. */}
            {r.currentRun > 1 && (
              <div style={{
                background: 'var(--terracotta-lt)', border: '1.5px solid #F1E4BE', borderRadius: 16,
                padding: '12px 14px', marginBottom: 12,
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 700,
                color: 'var(--ink)', lineHeight: 1.4,
              }}>
                🔥 You are on <b>{r.currentRun} days in a row</b> right now
                {r.currentRun >= r.bestRun ? ', which is your best ever.' : '.'}
              </div>
            )}

            {next && (
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600,
                color: 'var(--ink-soft)', lineHeight: 1.45, marginBottom: 16,
              }}>
                {toNext === 1
                  ? <>One more streak and <b>{next.name}</b> joins you.</>
                  : <><b>{toNext}</b> more streaks and <b>{next.name}</b> joins you.</>}
              </div>
            )}
          </>
        )}

        {/* The family so far. The faces, plainly, because "3 of 5" is a number
            and Pebble, Bloop and Orbit standing there is a family. */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8,
        }}>
          Your family
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {STAGE_CHARACTERS.map(c => {
            const home = r ? c.stageId <= r.friends : false
            return (
              <div key={c.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 66 }}>
                <span style={{
                  width: 58, height: 58, borderRadius: '50%', background: '#fff',
                  border: home ? `3px solid ${c.colour}` : '2px dashed rgba(26,26,46,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.cutout} alt={home ? c.name : ''} aria-hidden={!home}
                    width={48} height={48}
                    style={{ width: 48, height: 48, objectFit: 'contain', filter: home ? 'none' : 'grayscale(1)', opacity: home ? 1 : 0.32 }}
                  />
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  color: home ? 'var(--ink)' : 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.1,
                }}>
                  {home ? c.name : `${streaksForFriend(c.stageId)} days`}
                </span>
              </div>
            )
          })}
        </div>

        {/* The sticker book, which used to live at the foot of the road. It
            keeps its own once only pop (migration 109), so a sticker earned
            while the child was away still gets its moment here. */}
        <KidStickers token={token} stickers={stickers} celebrate={celebrateStickers} />
      </div>
    </div>
  )
}
