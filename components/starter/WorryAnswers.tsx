'use client'

import WorryIcon from '@/components/onboarding/WorryIcon'
import { WORRIES, CATCH_ALL_ID, type Worry } from '@/lib/onboarding/worries'
import { ANSWERS, scriptsForWorry } from '@/lib/content/proof'
import { MethodRow, type MethodId } from '@/components/starter/MethodIcon'

// The worries a parent just ticked, each with the answer to it.
//
// ── WHY IT IS HERE, ON THIS SCREEN ──────────────────────────────────────────
//
// Justin, 9 September 2026, looking at the reveal at the end of the starter
// quiz: "though we redesigned and simplify this page with the problems and
// what we do to fix?"
//
// The page told a parent how the platform works. It never told them what we do
// about the thing they had typed in thirty seconds earlier. This is the last
// screen before we ask for money, and a parent reading it is deciding one
// thing: does this actually deal with MY problem. Answering that is the whole
// job of this section.
//
// ── THE SHAPE, AND WHY IT IS NOT A TABLE ────────────────────────────────────
//
// The research behind it is a four column grid (the worry, the question
// underneath, what we do, the proof) and it reads well on a canvas at 1080.
// On a phone a four column grid is either a sideways scroll or four stacked
// fragments, so it is one card per worry instead: their words as the heading,
// the question underneath in their voice, the mechanism, then the proof as
// chips. Same four things, read top to bottom.
//
// ── AND WHY ONLY THEIRS ARE OPEN ────────────────────────────────────────────
//
// Nine full cards is a wall. The ones they ticked get the full answer; the
// rest are named in a strip underneath, because the promise on the question
// screen was "we cover them all, and more as we go" and a parent who ticked
// two should still see the other seven exist. Ticking nothing but Something
// else falls back to the three most houses recognise, so the section is never
// empty.

const FALLBACK = ['wont_put_down', 'mood_after_screens', 'asking_for_phone']

export default function WorryAnswers({ worryIds, own, tonight, helpFirst = false }: {
  worryIds: string[]
  /** What they typed into Something else. Gets a card of its own, in their
   *  words, because the worry a parent cared enough to write out by hand was
   *  the one worry this section used to drop on the floor. */
  own?: string
  /** The one thing to do this evening, written per stage per pathway key.
   *
   *  It was cut with the examples on 9 September, at the same moment the hero
   *  was sharpened from "how it gets better from tonight" into "what you can
   *  do tonight". So the promise got MORE specific in the same edit that
   *  removed the delivery, on the page whose whole job is trust. It is back,
   *  but only on the first card it genuinely answers: never on the catch all,
   *  where a stock script is about somebody else's evening. */
  tonight?: string
  /** Their words tripped the risk gate in lib/concerns/risk. The card stops
   *  being an answer and becomes a handover. */
  helpFirst?: boolean
}) {
  const ownWords = (own ?? '').trim()
  const named = worryIds.filter(id => id !== CATCH_ALL_ID && ANSWERS[id])
  // Their own words keep the place they gave them. A parent who put Something
  // else first sees their card first.
  // ── THEIR OWN WORRY GOES LAST ─────────────────────────────────────────────
  //
  // It used to keep the place they gave it, which put it FIRST for anybody who
  // ticked Something else first, which is most people who tick it at all. So
  // the first substantive sentence under a hero reading "Alma's pathway is
  // built" was "we have not written a pathway for this one yet". True, and
  // exactly the wrong order: read first it says we do not cover you, read
  // third, after two confident answers, it reads as the honesty it is.
  const withOwn = ownWords && worryIds.includes(CATCH_ALL_ID)
    ? [...worryIds.filter(id => id !== CATCH_ALL_ID && ANSWERS[id]), CATCH_ALL_ID]
    : named
  const chosen = withOwn.length ? withOwn : FALLBACK
  const rest = WORRIES.filter(w => w.id !== CATCH_ALL_ID && !chosen.includes(w.id))
  const firstAnswerable = chosen.findIndex(id => id !== CATCH_ALL_ID)
  const theirs = named.length > 0 || !!ownWords

  return (
    <div>
      {chosen.map((id, i) => {
        const worry = WORRIES.find(w => w.id === id) as Worry
        const isOwn = id === CATCH_ALL_ID
        // ── THE CARD FOR A WORRY WE DID NOT WRITE ──────────────────────────
        //
        // There is no hand written pathway for words a parent invented thirty
        // seconds ago, and pretending otherwise on the screen before we ask
        // for money is the fastest way to lose someone. So this card is the
        // honest one: it says what actually happens to their words, which is
        // that DiGi searches everything we have against them and they join
        // the check in like any other worry. That is true, it is checkable
        // the moment they step in, and it is a better answer than a stock
        // paragraph pretending to be about their evening.
        const a = isOwn
          ? {
              question: helpFirst
                ? 'We are not going to answer this one with a product.'
                : 'You typed this one yourself. What happens to it?',
              answer: helpFirst
                ? 'If they have said anything about hurting themselves or about not wanting to be here, please stop reading this page and ring your GP today. If they are not safe right now, 999 or your nearest A and E. Childline is 0800 1111, any time of day or night. We have kept your words and your place here for when you come back.'
                : 'DiGi reads your words against everything we hold and hands you the closest scripts and moments we have, and it joins your check in like any other worry. We have not hand written a pathway for these exact words yet. Yours is now in the queue for the ones we write next.',
              proof: [],
              // No method chips on a handover. A row reading Daily check in and
              // Moments under a disclosure of self harm is the product
              // answering the wrong question in public.
              methods: (helpFirst ? [] : ['checkin', 'digi', 'moment', 'script']) as MethodId[],
            }
          : ANSWERS[id]
        return (
          <div
            key={id}
            className="wow-fu"
            style={{
              background: '#fff',
              border: '2px solid var(--ink)',
              borderRadius: 20,
              boxShadow: '0 5px 0 var(--ink)',
              padding: '18px 18px 20px',
              marginBottom: i === chosen.length - 1 ? 0 : 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span aria-hidden style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: worry.tint, border: '2px solid var(--ink)', boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)',
              }}>
                <WorryIcon name={worry.icon} size={25} />
              </span>
              <h3 style={{
                margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'var(--text-lg)', letterSpacing: '-0.02em',
                lineHeight: 1.2, color: 'var(--ink)',
              }}>
                {isOwn && ownWords ? ownWords : worry.label}
              </h3>
            </div>

            {/* Their question, in the words they would use asking a friend. */}
            <p style={{
              margin: '0 0 10px', fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'var(--text-md)', lineHeight: 1.4, color: 'var(--ink-soft)',
            }}>
              {a.question}
            </p>

            <p style={{ margin: 0, fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--ink)' }}>
              {a.answer}
            </p>

            {/* ── HOW WE FIX IT, DRAWN ──────────────────────────────────
                The parts of the product that pick this worry up, as chips with
                the drawing on them. This replaced a mechanism paragraph and,
                on the first card, a script quoted in full.

                Justin, 9 September 2026: "we just need to acknowledge the
                problem and say how we help solve it via scripts, moments,
                daily check in etc, the METHOD not examples."

                The examples were doing real damage rather than just taking up
                room: a script about algorithms sat under a worry about a
                friend's new phone, because the script is written per pathway
                and the pathway is a bucket several worries share. Naming the
                method is both shorter and true of every worry in the bucket. */}
            {/* One thing they can do this evening, before they have paid a
                penny. On the first card the stock script actually fits: never
                on the catch all, and never when the words tripped the gate. */}
            {!isOwn && !helpFirst && i === firstAnswerable && tonight && (
              <div style={{ marginTop: 13, background: 'var(--terracotta-lt)', border: '2px solid var(--ink)', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
                  marginBottom: 5,
                }}>
                  Tonight
                </div>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', lineHeight: 1.45, color: 'var(--ink)' }}>
                  {tonight}
                </p>
              </div>
            )}
            <MethodRow ids={a.methods} />
            {/* The counted number, back on the card.
                The method row replaced the proof chips and took the only
                figure on the page with it, so a parent could read the whole
                thing and find nothing countable to weigh a payment against.
                These counts are real: lib/content/proof.ts carries the SQL and
                the date they were counted in the database. */}
            {!isOwn && scriptsForWorry(id) > 0 && (
              <p style={{
                margin: '10px 0 0', fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em',
                color: 'var(--ink-soft)',
              }}>
                {scriptsForWorry(id)} scripts cover this one
              </p>
            )}
          </div>
        )
      })}

      {rest.length > 0 && (
        <div className="wow-fu" style={{
          marginTop: 16, padding: '15px 17px 17px',
          background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: 18,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            marginBottom: 10,
          }}>
            {theirs ? 'Also covered, when it comes up' : 'And the rest of it'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {rest.map(w => (
              <span key={w.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#fff', border: '1.5px solid var(--border)', borderRadius: 100,
                padding: '5px 11px 5px 6px',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'var(--text-sm)', color: 'var(--ink)',
              }}>
                <span aria-hidden style={{
                  width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                  background: w.tint, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink)',
                }}>
                  <WorryIcon name={w.icon} size={15} />
                </span>
                {w.label}
              </span>
            ))}
          </div>
          {/* "Seeing things they should not" sits between Morning TV and AI
              chatbots and quietly covers pornography, pro suicide content and
              adult contact. Those do not wait for a script, and a chip in a
              list is the wrong size for them. */}
          <p style={{
            margin: '12px 0 0', fontSize: 'var(--text-sm)', lineHeight: 1.55,
            color: 'var(--ink-soft)',
          }}>
            If someone has contacted your child who should not have, report it to CEOP at
            ceop.police.uk and tell the school the same day. If it is self harm or suicide
            content in a feed, report it in the app and get the account out of the feed. The
            scripts are for the conversation afterwards, not instead of it.
          </p>
        </div>
      )}
    </div>
  )
}
