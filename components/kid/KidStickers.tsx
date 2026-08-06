'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { playKidSound } from '@/lib/sound/kidSounds'
import StickerBadge from '@/components/pathway/StickerBadge'
import type { StickerRule } from '@/lib/stickers/catalog'

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
function Tile({ s }: { s: KidSticker }) {
  const need = s.need ?? 0
  const have = Math.min(s.have ?? 0, need)
  const showBar = !s.earned && need > 0 && have > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textAlign: 'center', width: 96 }}>
      <div style={{
        position: 'relative', width: 72, height: 72, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        background: s.earned ? '#fff' : 'rgba(26,26,46,0.05)',
        border: s.earned ? `3px solid ${s.colour}` : '2.5px dashed rgba(26,26,46,0.18)',
        boxShadow: s.earned ? `0 4px 0 ${s.colour}` : 'none',
      }}>
        {s.earned && s.art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.art} alt={s.name} width={60} height={60} style={{ width: 60, height: 60, objectFit: 'contain' }} />
        ) : s.art ? (
          // A locked Planet Friend keeps its shape, greyed, so a child can see
          // WHO is waiting for them rather than a question mark that could be
          // anybody. The mystery was hiding the reason to carry on.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.art} alt="" aria-hidden width={60} height={60} style={{ width: 60, height: 60, objectFit: 'contain', filter: 'grayscale(1)', opacity: 0.35 }} />
        ) : (
          <StickerBadge s={s} size={56} />
        )}
      </div>

      {/* The name, always. A locked sticker is a thing you are working towards,
          and a thing with no name is not something anybody works towards. */}
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: s.earned ? 'var(--ink)' : 'var(--ink-soft)', lineHeight: 1.15 }}>
        {s.name}
      </span>

      {!s.earned && s.earn && (
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.25 }}>
          {s.earn}
        </span>
      )}

      {showBar && (
        <>
          <span style={{ width: '100%', height: 5, borderRadius: 100, background: 'rgba(26,26,46,0.12)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', borderRadius: 100, width: `${Math.round((have / need) * 100)}%`, background: s.colour }} />
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
            {have} of {need}
          </span>
        </>
      )}
    </div>
  )
}

export default function KidStickers({ token, stickers, celebrate }: {
  token: string
  stickers: KidSticker[]
  celebrate: string[]
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
    {
      name: 'The Stamps',
      how: 'A stamp is a whole stage of your passport finished, lessons and all. These take months, which is what makes them the rarest thing in here.',
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
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#EDC35F',
          }}>
            My sticker book
          </span>
          {/* One count for the whole book. There used to be two that could not
              be reconciled: "6 of 13" here and "Friends home 0 of 5" up in the
              wins panel, both true, of different systems. */}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            color: 'rgba(237,195,95,0.68)', whiteSpace: 'nowrap',
          }}>
            {earnedCount} of {stickers.length} collected
          </span>
        </div>

        {pages.map(page => (
          <div key={page.name} style={{ background: '#FFFCF3', borderRadius: 10, padding: '12px 11px 13px', boxShadow: '0 2px 0 rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: '#2A1F14', letterSpacing: '-0.01em' }}>
                {page.name}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: '#9A8A6A', whiteSpace: 'nowrap' }}>
                {page.of.filter(s => s.earned).length} of {page.of.length}
              </span>
            </div>
            {/* How it works, ABOVE the tiles rather than under them. A page of
                locked circles is the question; the answer has to come first. */}
            {(page.steps || page.how) && (
              <div style={{
                background: '#F4ECD9', borderRadius: 9, padding: '10px 11px', marginBottom: 12,
                display: 'flex', flexDirection: 'column', gap: 7,
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A08247',
                }}>
                  How it works
                </span>
                {page.steps && (
                  <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {page.steps.map((step, i) => (
                      <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span aria-hidden style={{
                          flexShrink: 0, width: 18, height: 18, borderRadius: '50%',
                          background: '#EDC35F', color: '#2A1F14',
                          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '11px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                        }}>{i + 1}</span>
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 700,
                          color: '#4A3B25', lineHeight: 1.45,
                        }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {page.how && (
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600,
                    color: '#6B5C42', lineHeight: 1.5, margin: 0,
                  }}>
                    {page.how}
                  </p>
                )}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '14px 6px', justifyItems: 'center' }}>
              {page.of.map(s => <Tile key={s.key} s={s} />)}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, color: '#9A8A6A', lineHeight: 1.4, margin: '11px 0 0', textAlign: 'center' }}>
              {page.note}
            </p>
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
                    : <span aria-hidden style={{ fontSize: '46px', lineHeight: 1 }}>{s.emoji}</span>}
                </div>
              ))}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {toCheer.length > 1 ? 'You earned new stickers' : `You earned ${toCheer[0]?.name}`}
            </h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
              Straight into your sticker book. Keep going for more.
            </p>
            <button onClick={() => setShowCheer(false)} style={{
              width: '100%', padding: '14px', borderRadius: 16, border: 'none', cursor: 'pointer',
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
