'use client'

// The streak bar: a child sees how their completed days are stacking up toward
// the next Planet Friend. One track fills as the days bank, the next Friend
// waits at the end, and a warm line says exactly how close they are. Pure
// display: it reads the counts and invents nothing.
//
// ── WHY THIS IS ONE TRACK AND NOT A ROW OF DOTS ────────────────────────────
//
// Justin, 14 September 2026, looking at his own child home: "not sure what the
// ooooo is on this?" The row read "2 ooooooooo 8 more for Bloop".
//
// The ooooo was this component. It drew one dot per day in the rung, each one
// `flex: 1` with a fixed 10px height, a 2px ink border and a full pill radius,
// and no floor under the width. The row also carries a flame, the count, a
// sentence that never shrinks and a 38px Friend, so on a 390px phone the dots
// were left about 9px of width each. A 9 by 10 box with a 2px border and a
// 100px radius is not a dot. It is the letter o.
//
// Underneath it was a worse fault. The dot count was capped at eight, but the
// fill test was `i < banked`: a dot INDEX against a raw day COUNT. The real
// rungs are 2, 8, 12, 16 and 20 days, so from eighteen days onward the
// comparison saturated and every dot sat filled while days were still owed. A
// child on thirty days saw a completely full bar beside the words "8 more for
// Nova". The bar was contradicting the sentence next to it for most of the
// ladder, which is the one thing this product cannot do.
//
// One proportional track fixes both at once. It fills `banked` out of the
// rung's REAL span, so it can never claim more than is true on any rung; it
// cannot collapse, because a track has nothing to divide; and it is what the
// child app already does in six other places (the five a day, the mission
// rows, the passport pages, the road, the path and the sticker book), so it is
// one less shape for a child to learn.

import { rungSpan, streaksBankedTowardNext, streaksToNextFriend, nextFriendToEarn, friendsFromStreaks } from '@/lib/pathway/streak-unlock'
import HappyIcon from '@/components/kid/HappyIcon'

export default function StreakBar({ completedStreaks = 0 }: { completedStreaks?: number }) {
  // Every number and name on this row comes off the ONE count. It used to take
  // the next Friend from a separate `earnedStages` prop while taking the
  // number beside it from the day count, so a caller that let the two drift
  // would have printed a small number next to the wrong Friend's name. Since
  // earnedFriends() became completed days and nothing else, the prop carried
  // no information the count did not already have: checked across 0 to 200
  // days, earnedFriends and friendsFromStreaks agree everywhere. So it was
  // only ever a second chance to be wrong, and it is gone rather than ignored.
  const banked = streaksBankedTowardNext(completedStreaks)
  const toNext = streaksToNextFriend(completedStreaks)
  const next = nextFriendToEarn(friendsFromStreaks(completedStreaks))
  // The rung's real length, never the drawing cap. Guarded against 0 so the
  // whole family home case cannot divide by nothing on its way to the other
  // branch.
  const span = rungSpan(completedStreaks)
  const pct = span > 0 ? Math.min(100, Math.max(0, Math.round((banked / span) * 100))) : 0

  // Whole family home: a gentle, complete state instead of a progress bar.
  const done = !next

  // A tidy little box, deliberately. Justin, 9 August 2026: "Streaks: keep
  // this small and compact, in a tidy little box. Don't let it dominate the
  // screen." One line of type, the track beside it, the next Friend as a small
  // face on the end. Streaks show in other places, so the home strip only has
  // to say the number and the next prize.
  return (
    <div style={{
      background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-btn)',
      padding: '7px 12px 7px 8px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: '4px 8px', flexWrap: 'wrap',
      boxShadow: 'var(--lift)',
    }}>
      {/* The flame, drawn (the Happy Newspaper pass), and the count beside it. */}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        <HappyIcon name="flame" size={26} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--ink)' }}>{completedStreaks}</span>
      </span>

      {done ? (
        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
          The whole family is home. Superstar.
        </span>
      ) : (
        <>
          {/* The track. minWidth is the floor the dots never had: whatever
              else is in this row, the bar keeps 44px and stays a bar. */}
          <span
            data-streak-track
            data-streak-pct={pct}
            // Decoration, not information. The sentence immediately after it
            // says "8 more for Bloop" in real text, so announcing the track
            // too would read the same fact twice, and any label built from
            // span would have to invent a form of words for the case where a
            // caller passes an earned count that disagrees with the day count.
            aria-hidden
            style={{
              flex: 1, minWidth: 44, height: 12, boxSizing: 'border-box',
              borderRadius: 'var(--radius-pill)', background: '#fff',
              border: 'var(--edge)', overflow: 'hidden', display: 'block',
            }}
          >
            <span style={{
              display: 'block', height: '100%', width: `${pct}%`,
              background: 'var(--terracotta)', borderRadius: 'var(--radius-pill)',
              transition: 'width 0.35s ease',
            }} />
          </span>
          <span style={{ minWidth: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
            {toNext === 1 ? <><b>1</b> more for <b>{next!.name}</b>!</> : <><b>{toNext}</b> more for <b>{next!.name}</b></>}
          </span>
        </>
      )}

      {next && (
        // eslint-disable-next-line @next/next/no-img-element
        <span style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box', background: '#FEF7E0', border: 'var(--edge)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={next.cutout} alt={next.name} width={30} height={30} style={{ objectFit: 'contain', filter: 'grayscale(0.6) opacity(0.7)' }} />
        </span>
      )}
    </div>
  )
}
