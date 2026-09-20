'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { playKidSound } from '@/lib/sound/kidSounds'
import StickerBadge from '@/components/pathway/StickerBadge'
import type { StickerRule } from '@/lib/stickers/catalog'
import KidWeekCalendar from '@/components/kid/KidWeekCalendar'
import { HAPPY, Burst, Sticker } from '@/components/kid/HappyNewsBits'

// The child's own sticker book, at the foot of their path. The collection fills
// up as they earn stars, finish printables and grow, earned bright and locked
// as a soft mystery. The first time a sticker unlocks, it pops in with a bounce
// and the star sound, then is marked seen so the moment fires once. House
// motion rule: GSAP, and it stays quiet for reduced motion.

export type KidSticker = {
  key: string
  name: string
  emoji?: string
  art?: string | null
  colour: string
  earned: boolean
  // What the badge draws. The parent book stopped using emoji for these and the
  // child book did not, so the person the stickers are actually FOR was the one
  // still getting them.
  rule: StickerRule
  /** What it costs, in the child's words. "Save 8 half hours". */
  earn?: string
  /** How far along, and the target, both in the units the earn line names. */
  have?: number
  need?: number
}

// A LOCKED SLOT HAS TO SAY WHAT IT COSTS.
//
// Every locked sticker used to read the word "Locked" with a bare number under
// it: 8, 15, 25, 40, 5, 7. No unit, no verb, no name. A child cannot tell
// whether 40 is days, stars, sheets or minutes, or what earns it.
//
// The sentence existed the whole time. Every sticker in the catalog carries an
// `earn` string, "Save 25 half hours", "Finish 5 printables", and the tile
// printed "Locked" instead. The answer was written and thrown away at the last
// step.
//
// Mobbin, 5 August 2026: Tripadvisor puts the instruction on the tile itself
// ("Write 5 restaurant reviews") beside a 0/5, and stoic. lists the two or
// three closest with live progress. Not Boring Vibes is the one we half copied:
// bare numbers work there because a header names the unit, and we took the
// numbers and left the header behind.
// A DIE CUT STICKER, NOT A CIRCLE IN A RING.
//
// Justin, 14 September 2026, with the Every day page: the passport "although
// matches parents should try to make more pretty visually with stickers."
// Mobbin, this session: Kit's sticker picker gives every sticker a white die
// cut edge and a slight tilt, so a grid reads as a sheet you could peel;
// Swarm draws the ones you have not got yet as pale silhouettes, so the page
// reads as waiting rather than broken. Both here. An earned sticker is the
// art on a white disc with a thin ink edge and a hard ink shadow, tilted a
// few degrees each way down the row. A locked one is the same disc, pale,
// with the cost under it, because a thing with no name and no price is not
// something anybody works towards.
function Tile({ s, i = 0 }: { s: KidSticker; i?: number }) {
  const need = s.need ?? 0
  const have = Math.min(s.have ?? 0, need)
  const showBar = !s.earned && need > 0 && have > 0
  const tilt = i % 3 === 0 ? -5 : i % 3 === 1 ? 4 : -2

  return (
    <div data-sticker={s.earned ? 'earned' : 'locked'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textAlign: 'center', width: 96 }}>
      <div style={{ position: 'relative', width: 78, height: 78, transform: `rotate(${tilt}deg)`, marginBottom: 2 }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: s.earned ? '#fff' : '#F3F1EC',
          border: s.earned ? `1.5px solid ${HAPPY.ink}` : '1.5px dashed rgba(26,26,46,0.22)',
          boxShadow: s.earned ? `2px 4px 0 ${HAPPY.ink}` : 'none',
        }} />
        <div style={{ position: 'absolute', inset: 7, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {s.earned && s.art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.art} alt={s.name} width={60} height={60} style={{ width: 60, height: 60, objectFit: 'contain' }} />
          ) : s.art ? (
            // A locked Planet Friend keeps its shape, greyed, so a child can see
            // WHO is waiting for them rather than a question mark that could be
            // anybody. The mystery was hiding the reason to carry on.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.art} alt="" aria-hidden width={60} height={60} style={{ width: 60, height: 60, objectFit: 'contain', filter: 'grayscale(1)', opacity: 0.32 }} />
          ) : (
            <span style={{ opacity: s.earned ? 1 : 0.55 }}><StickerBadge s={s} size={56} /></span>
          )}
        </div>
      </div>

      {/* The name, always. A locked sticker is a thing you are working towards,
          and a thing with no name is not something anybody works towards. */}
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 800, color: s.earned ? 'var(--ink)' : 'var(--ink-soft)', lineHeight: 1.15 }}>
        {s.name}
      </span>

      {!s.earned && s.earn && (
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.25 }}>
          {s.earn}
        </span>
      )}

      {showBar && (
        <>
          <span style={{ width: '100%', height: 5, borderRadius: 'var(--radius-pill)', background: 'rgba(26,26,46,0.12)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', borderRadius: 'var(--radius-pill)', width: `${Math.round((have / need) * 100)}%`, background: s.colour }} />
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
            {have} of {need}{s.rule.kind === 'sorted' ? ' stars' : s.rule.kind === 'stamp' || s.rule.kind === 'lessons' ? ' lessons' : s.rule.kind === 'timer' || s.rule.kind === 'outside' ? ' days' : s.rule.kind === 'jobs' ? ' jobs' : ''}
          </span>
        </>
      )}
    </div>
  )
}

// THE HOW, ONE TAP AWAY.
//
// Justin, 6 August 2026, made every page say how it works, above the tiles,
// because a page of locked circles is a question and the answer has to come
// first. That rule holds. What changed on 14 September is the WEIGHT: a tan
// block of two paragraphs above every grid made the book read as a manual
// with some stickers in it. So the headline answer, the one line note, stays
// first and always visible, and the paragraph sits under it behind a native
// details, open on a tap. Nothing is lost; the stickers lead.
function HowItWorks({ note, steps, how }: { note: string; steps?: string[]; how?: string }) {
  if (!steps && !how) {
    return (
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: '#4A3B25', lineHeight: 1.4, margin: '0 0 12px' }}>
        {note}
      </p>
    )
  }
  return (
    <details data-how style={{ margin: '0 0 12px' }}>
      {/* The note on its own line, full width, and the label under it. Side by
          side the label squeezed the note into five short lines. */}
      <summary style={{
        cursor: 'pointer', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3,
        fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: '#4A3B25', lineHeight: 1.4,
      }}>
        <span>{note}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#A08247',
        }}>How it works ›</span>
      </summary>
      <div style={{ background: '#F4ECD9', borderRadius: 9, padding: '10px 11px', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {steps && (
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {steps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span aria-hidden style={{
                  flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
                  background: '#EDC35F', color: '#2A1F14',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xs)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                }}>{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 700, color: '#4A3B25', lineHeight: 1.45 }}>{step}</span>
              </li>
            ))}
          </ol>
        )}
        {how && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: '#6B5C42', lineHeight: 1.5, margin: 0 }}>
            {how}
          </p>
        )}
      </div>
    </details>
  )
}

/** This week's daily stickers and the all time count, for the Every day page. */
export type DailyStickers = {
  total: number
  week: { letter: string; earned: boolean; isToday: boolean }[]
  /** The child's own Planet Friend, on every done day of the row. */
  friend?: { name: string; img: string } | null
}

export default function KidStickers({ token, stickers, celebrate, daily = null }: {
  token: string
  stickers: KidSticker[]
  celebrate: string[]
  daily?: DailyStickers | null
}) {
  // The new stickers to celebrate this visit, held so a dismiss cannot lose
  // them before they are marked seen.
  const [toCheer] = useState(() => stickers.filter(s => celebrate.includes(s.key) && s.earned))
  const [showCheer, setShowCheer] = useState(toCheer.length > 0)
  const popRef = useRef<HTMLDivElement>(null)
  const seenSent = useRef(false)

  // Mark them seen straight away so the moment never repeats, even if the child
  // taps through fast or closes the tab. Fire and forget.
  useEffect(() => {
    if (toCheer.length === 0 || seenSent.current) return
    seenSent.current = true
    try {
      fetch('/api/kid/stickers/seen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, keys: toCheer.map(s => s.key) }),
      }).catch(() => {})
    } catch { /* best effort */ }
    try { playKidSound('star') } catch { /* sound off */ }
  }, [toCheer, token])

  // The pop, unless reduced motion is asked for.
  useEffect(() => {
    if (!showCheer || !popRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.gc-cheer-pop', { scale: 0.3, opacity: 0, y: 20, duration: 0.5, ease: 'back.out(1.9)', stagger: 0.12 })
      gsap.from('.gc-cheer-spark', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.04, delay: 0.1 })
    }, popRef)
    return () => ctx.revert()
  }, [showCheer])

  const earnedCount = stickers.filter(s => s.earned).length

  // The pages of the book, in the order they are worth working through. Every
  // sticker lands on exactly one, and a page with nothing in it is not drawn,
  // so an older database missing the stamps simply has two pages.
  // EVERY PAGE SAYS HOW IT WORKS.
  //
  // Justin, 6 August 2026: "Can we also explain in more det[ail] the savers here
  // as not clear on how they earn them and how are they used? Was it for extra
  // holiday allowance as needs to [be] clear to [the] child."
  //
  // He is right, and the fact that he had to ask is the evidence. The saving
  // page said "For the time you earned and did not spend" and the tiles said
  // "Save 8 half hours", which never explained what a save IS, when it is
  // counted, or what it gets you. A child cannot work toward a thing whose rule
  // they cannot state.
  //
  // The holiday question is the important half, and the answer is no. There are
  // two rewards in this product and they pay two different behaviours, which
  // migration 127 is explicit about:
  //
  //   SAVING   time you had and chose not to spend. Counted on Monday, thirty
  //            minutes to a save. It pays THESE STICKERS and nothing else.
  //   HOLIDAY  jobs done after the week is already full. It pays real minutes,
  //            banked and spendable in the school holidays.
  //
  // A child seeing the word "saving" will reasonably assume they are saving up
  // time, so the page has to say that they are not, and say where the time that
  // does carry over actually comes from. Otherwise the first Monday their
  // minutes start fresh reads as the app taking something off them.
  const pages: { name: string; note: string; steps?: string[]; how?: string; of: KidSticker[] }[] = [
    {
      name: 'The Squad',
      how: 'A full day is all five of your five a day, ticked off. Every Friend costs a number of full days, and it says how many under their picture.',
      note: 'Finish full days to bring them home',
      of: stickers.filter(s => s.rule.kind === 'friend'),
    },
    // SORTED TOGETHER. Justin, 2 September 2026: "reflect positively with
    // moments being rated 5 stars and rewards appearing on the child's app."
    // The worries a grown up raised for this child, each a stamp waiting on
    // five stars. Said as the two of them fixing it, because that is what a
    // check in that climbs to five actually is, and a child who can see the
    // stars climbing is a child who knows the trying is being noticed.
    {
      name: 'Sorted together',
      how: 'Your grown up keeps an eye on the tricky bits, like screens at bedtime, and gives each one stars at their check in. When one gets five stars it is sorted, and it stamps here. That is the two of you fixing it together.',
      note: 'Five stars from your grown up stamps it',
      of: stickers.filter(s => s.rule.kind === 'sorted'),
    },
    // OFF SCREEN AND ON THE TIMER. Justin, 14 September 2026: stars "when
    // they use timer, complete jobs, outside especially, offline especially".
    // The three things a week is actually made of, on one page, outside first.
    {
      name: 'Off screen, on the timer',
      how: 'Time outside is the Move about step on your five a day. A job counts when your grown up approves it. The timer counts every day you use it for your screen time.',
      note: 'Outside pays best. It always will',
      of: stickers.filter(s => s.rule.kind === 'outside' || s.rule.kind === 'jobs' || s.rule.kind === 'timer'),
    },
    {
      name: 'Lessons',
      how: 'Every lesson you pass counts here, and every one fills the stamp for your stage too.',
      note: 'Pass lessons to fill this page',
      of: stickers.filter(s => s.rule.kind === 'lessons'),
    },
    {
      name: 'The Stamps',
      how: 'A stamp is a whole stage of your passport finished, every lesson passed. The bar under each one is how far you have got. These take months, which is what makes them the rarest thing in here.',
      note: 'The rare ones. A whole stage each',
      of: stickers.filter(s => s.rule.kind === 'stamp'),
    },
    {
      name: 'Saving and Streaks',
      steps: [
        'Do your jobs. That is how you earn screen time.',
        'Do not spend it all. Every half hour you leave is one save.',
        'On Monday your saves are counted and this page fills up.',
      ],
      how: 'Saves turn into these stickers, not into more minutes, because your minutes start fresh every Monday. Doing extra jobs when your week is already full is the other one. That turns into holiday time, and holiday time is real minutes you can use in the school holidays.',
      note: 'The one who uses less gets more',
      of: stickers.filter(s => s.rule.kind === 'credits' || s.rule.kind === 'sheets' || s.rule.kind === 'streak'),
    },
  ].filter(p => p.of.length > 0)

  return (
    <div style={{ margin: '10px 2px 8px' }}>
      {/* THE COLLECTION IS THE PASSPORT.
          Justin: "we want the stickers and the squad friends to appear in a
          copy of the passport image we have."
          The parent already has a passport, a burgundy book with a gold crest
          that is the one object in this product meant to feel like a keepsake.
          The child had a grid of circles on a grey background. This is their
          copy of the same book, and the stickers live inside it.
          Mobbin, Finch's Micropedia: a collection reads as a collection when it
          is a bound thing with pages and the count is printed on it, not when
          it is a wall of tiles. */}
      <div style={{
        background: 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)',
        borderRadius: '14px 18px 18px 14px',
        boxShadow: 'inset 0 0 0 2px rgba(237,195,95,0.5), inset 0 0 0 5px rgba(237,195,95,0.12), inset 13px 0 26px rgba(0,0,0,0.3), 0 14px 34px rgba(0,0,0,0.3)',
        padding: '16px 13px 14px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {/* THE COVER. The child's own Friend as a big die cut sticker on the
            burgundy, and the count in a butter sun. Justin, 14 September 2026:
            prettier, with stickers. One count for the whole book. There used
            to be two that could not be reconciled: "6 of 13" here and "Friends
            home 0 of 5" up in the wins panel, both true, of different systems. */}
        <div data-book-cover style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '2px 2px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            {daily?.friend && (
              <span style={{ position: 'relative', width: 58, height: 58, flexShrink: 0, transform: 'rotate(-7deg)' }}>
                <span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#fff', border: `1.5px solid ${HAPPY.ink}`, boxShadow: `2px 3px 0 ${HAPPY.ink}` }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={daily.friend.img} alt={daily.friend.name} width={46} height={46} style={{ position: 'absolute', inset: 6, width: 46, height: 46, objectFit: 'contain' }} />
              </span>
            )}
            <div style={{ minWidth: 0 }}>
              <span style={{
                display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EDC35F', lineHeight: 1.3,
              }}>
                My sticker book
              </span>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'rgba(237,195,95,0.68)', marginTop: 2 }}>
                {earnedCount} of {stickers.length} collected
              </span>
            </div>
          </div>
          <Burst size={52} color={HAPPY.butter}>{earnedCount}</Burst>
        </div>

        {/* EVERY DAY. The daily sticker (migration 284) lived on today's card
            and vanished at midnight. Justin, 14 September 2026: "make sure all
            daily stickers towards achievement are populated on parent's and
            child's passport." This week's seven, and the total, in the book. */}
        {daily && (
          <div data-daily-page style={{ background: '#FFFCF3', borderRadius: 10, padding: '12px 11px 13px', boxShadow: '0 2px 0 rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: '#2A1F14', letterSpacing: '-0.01em' }}>
                Every day
              </span>
              <Sticker accent="butter" rotate={4} size="sm">{daily.total} day sticker{daily.total === 1 ? '' : 's'}</Sticker>
            </div>
            <HowItWorks
              note="Finish your five a day and your Friend lands on that day"
              how="Full days are what bring the Planet Friends home. Every Friend on the next page costs a number of full days, and it says how many under their picture."
            />
            {/* The Kenji note (14 September 2026): the child's Friend on every
                done day, on a dotted sky, never a yellow star on cream. */}
            {(() => {
              const today = daily.week.findIndex(d => d.isToday)
              const n = daily.week.filter(d => d.earned).length
              return (
                <KidWeekCalendar
                  days={daily.week.map((d, i) => ({ letter: d.letter, done: d.earned, isToday: d.isToday, ahead: today >= 0 && i > today }))}
                  friend={daily.friend ?? null}
                  title="This week"
                  count={{ n, word: n === 1 ? 'day' : 'days' }}
                  line="One a day. Nobody can take a day back off you"
                />
              )
            })()}
          </div>
        )}

        {pages.map(page => (
          <div key={page.name} style={{ background: '#FFFCF3', borderRadius: 10, padding: '12px 11px 13px', boxShadow: '0 2px 0 rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: '#2A1F14', letterSpacing: '-0.01em' }}>
                {page.name}
              </span>
              <Sticker accent={page.of.every(s => s.earned) ? 'green' : 'butter'} rotate={4} size="sm">
                {page.of.filter(s => s.earned).length} of {page.of.length}
              </Sticker>
            </div>
            <HowItWorks note={page.note} steps={page.steps} how={page.how} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '14px 6px', justifyItems: 'center' }}>
              {page.of.map((s, i) => <Tile key={s.key} s={s} i={i} />)}
            </div>
          </div>
        ))}
      </div>

      {showCheer && (
        <div
          onClick={() => setShowCheer(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(26,26,46,0.62)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}
        >
          <div ref={popRef} onClick={e => e.stopPropagation()} style={{
            position: 'relative', width: '100%', maxWidth: 380, background: 'var(--cream)', borderRadius: 28,
            padding: '34px 24px 26px', boxShadow: '0 24px 60px -16px rgba(0,0,0,0.55)', textAlign: 'center', overflow: 'hidden',
          }}>
            {/* A little burst behind the sticker */}
            {['✨', '⭐', '🎉', '✨', '⭐', '🎉'].map((e, i) => (
              <span key={i} className="gc-cheer-spark" aria-hidden style={{
                position: 'absolute', top: `${12 + (i % 3) * 12}%`, left: i < 3 ? `${8 + i * 6}%` : undefined,
                right: i >= 3 ? `${8 + (i - 3) * 6}%` : undefined, fontSize: 'var(--text-xl)',
              }}>{e}</span>
            ))}
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 12px' }}>
              {toCheer.length > 1 ? `${toCheer.length} new stickers` : 'New sticker'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
              {toCheer.map(s => (
                <div key={s.key} className="gc-cheer-pop" style={{
                  width: 96, height: 96, borderRadius: '50%', background: '#fff',
                  border: `4px solid ${s.colour}`, boxShadow: `0 6px 0 ${s.colour}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {s.art
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={s.art} alt={s.name} width={82} height={82} style={{ width: 82, height: 82, objectFit: 'contain' }} />
                    // The same drawn badge the book shows, not the emoji it
                    // retired. The celebration was the one surface still
                    // popping a trophy emoji for a sticker the child would
                    // then find looking completely different in their book.
                    : <StickerBadge s={s} size={78} />}
                </div>
              ))}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {toCheer.length > 1 ? 'You earned new stickers' : toCheer[0]?.rule.kind === 'sorted' ? `${toCheer[0].name}: sorted` : `You earned ${toCheer[0]?.name}`}
            </h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
              {toCheer.length === 1 && toCheer[0]?.rule.kind === 'sorted'
                ? 'Your grown up gave it five stars. That was you. Stamped in your passport.'
                : 'Straight into your sticker book. Keep going for more.'}
            </p>
            <button onClick={() => setShowCheer(false)} style={{
              width: '100%', padding: '14px', borderRadius: 'var(--radius-btn)', border: 'none', cursor: 'pointer',
              background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: 'var(--text-md)', boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}>
              Yay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
