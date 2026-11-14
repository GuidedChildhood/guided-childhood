import type { CSSProperties, ReactNode } from 'react'
import MethodIcon, { METHOD, type MethodId } from './MethodIcon'
import { STAGES } from '@/lib/content/stages'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { MockAsk, MockDigi, MockProgress } from '@/app/(marketing)/starter-pack/Mocks'

// THE PATHWAY IS READY PAGE, SAID IN PICTURES.
//
// Justin, 14 November 2026, on the page a parent reaches after the three
// questions ("Ava's pathway is ready"): it should show exactly what they get,
// it looked messy and confusing, and it needs to be "super slick and much less
// wordy and obvious", highlighting what we offer and solve, the passport that
// gets them safe, ready and taught, and DiGi with how it learns from what
// parents say works. "The best look of any starter page."
//
// The page was 6,400px at 390 wide, most of it sentences. These four blocks
// replace the three middle sections (how it works, devices and time, also
// included). Each is a picture and a handful of words:
//
//   Passport     the five stages and their Planet Friend, theirs marked
//   Fixes        three "instead of" lines, the product drawn under each
//   DigiLearns   one drawn exchange and the loop it learns by
//   AlsoInside   the rest, as labels
//
// Mobbin, for the shape: MacroFactor and Deepstash draw "what happens next" as
// a short rail of icons with a few words, never a paragraph per step
// (https://mobbin.com/screens/a23e6bee-a4df-4db1-a6d1-cbb91410960d,
// https://mobbin.com/screens/a276b33b-25f4-4af8-a600-4813a2501089). Greenlight
// shows your phone beside the child's (https://mobbin.com/screens/21cafe44-cc81-4953-ba5e-536506229f5a).
//
// Server safe: no state, no effects. The page's own GSAP batch fades in
// anything carrying the wow-fu class, so these carry it and add no motion of
// their own (and no IntersectionObserver: scripts/check-starter-fold.mjs
// keeps the reveal to the one floating door it already has).

const EYEBROW: CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 6px',
}
const H2: CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.03em',
  fontSize: 'clamp(1.6rem, 6vw, 2.1rem)', lineHeight: 1.1, color: 'var(--ink)', margin: 0,
}

function Head({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <div className="wow-fu" style={{ textAlign: 'center', marginBottom: 24 }}>
      <p style={EYEBROW}>{eyebrow}</p>
      <h2 id={id} style={H2}>{title}</h2>
    </div>
  )
}

/** The road: five stages, a Planet Friend at each, the child's own stage marked. */
export function Passport({ here, kid }: { here: number; kid?: string }) {
  const current = STAGES.find(s => s.id === here)
  return (
    <section aria-labelledby="ready-passport" data-ready-passport>
      <Head eyebrow="The passport" title="One road, from 4 to 16." id="ready-passport" />
      {/* ── THE PASSPORT COVER, AS THE APP DRAWS IT ─────────────────────
          Justin: check the image matches the app, then "it's the cover that
          looks like a real passport". So this is the app's own cover
          (components/pathway/PassportBook, page 0) at a smaller size: the
          burgundy book, the gold foil rules and crest, the formal titling,
          the child's name, and the five friends along the bottom in foil,
          because none is stamped yet for a family that has just arrived.
          The shop photo of the printed booklet was a different object with a
          different title, so it went. */}
      <div className="wow-fu" aria-hidden style={{ display: 'flex', justifyContent: 'center', margin: '-2px 0 26px' }}>
        <div style={{
          width: 214, minHeight: 290, boxSizing: 'border-box',
          background: 'linear-gradient(160deg, var(--passport-cover-hi) 0%, var(--passport-cover) 55%, var(--passport-cover-lo) 100%)',
          borderRadius: '12px 16px 16px 12px', padding: '24px 16px 18px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: 'inset 0 0 0 2px rgba(237,195,95,0.55), inset 0 0 0 5px rgba(237,195,95,0.14), inset 10px 0 20px rgba(0,0,0,0.25), 0 14px 30px rgba(26,26,46,0.18)',
          transform: 'rotate(-2deg)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
              Digital Childhood Passport
            </div>
            <div style={{ width: 36, height: 1.5, background: 'rgba(237,195,95,0.55)', margin: '8px auto 0' }} />
          </div>
          <div>
            <div style={{
              width: 58, height: 58, borderRadius: '50%', margin: '0 auto 12px',
              border: '2px solid rgba(237,195,95,0.85)', boxShadow: 'inset 0 0 0 3px rgba(237,195,95,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 24 }}>
                {[5, 9, 14, 8].map((h, i) => (
                  <div key={i} style={{ width: 4.5, height: (h / 14) * 24, background: 'var(--terracotta)', borderRadius: 2 }} />
                ))}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--terracotta)', lineHeight: 1.15, letterSpacing: '0.02em', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {kid || 'Our family'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.65)', marginTop: 6 }}>
              The journey to 16
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            {STAGE_CHARACTERS.map(c => (
              <span key={c.key} style={{
                width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                background: 'rgba(237,195,95,0.10)', border: '1.5px solid rgba(237,195,95,0.45)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={c.cutout} alt="" width={24} height={24} style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  filter: 'grayscale(1) brightness(1.35) sepia(0.7) hue-rotate(-8deg) opacity(0.42)',
                }} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <ol className="wow-fu" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4, position: 'relative', textAlign: 'center' }}>
        <span aria-hidden style={{ position: 'absolute', left: '10%', right: '10%', top: 29, height: 2, background: 'var(--border)' }} />
        {STAGES.map(s => {
          const friend = STAGE_CHARACTERS.find(c => c.stageId === s.id)
          const on = s.id === here
          return (
            <li key={s.id} aria-current={on ? 'step' : undefined} style={{ position: 'relative', minWidth: 0 }}>
              <span style={{
                display: 'inline-flex', width: '100%', maxWidth: 58, aspectRatio: '1 / 1', borderRadius: '50%', overflow: 'hidden',
                border: on ? '3px solid var(--ink)' : 'var(--edge)', boxSizing: 'border-box',
                background: `var(--stage-${s.id}-bold)`, boxShadow: on ? 'var(--lift)' : 'none',
                opacity: on ? 1 : 0.85,
              }}>
                {friend && <img src={friend.img} alt="" width={58} height={58} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </span>
              {/* Ages only under each friend. The stage names were wider than
                  their slot on a 320px phone ("Independent") and pushed the page
                  sideways; the child's own stage is named in the line below. */}
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: on ? 900 : 700, fontSize: 'var(--text-xs)', color: on ? 'var(--ink)' : 'var(--ink-muted)', marginTop: 6, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                {s.ageBand === '16+' ? '16+' : s.ageBand.replace('-', ' to ')}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="wow-fu" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4, margin: '18px 0 2px', textAlign: 'center' }}>
        {kid || 'Your child'} is at {current?.name ?? 'their stage'}, stage {here} of 5.
      </p>
      <p className="wow-fu" style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, textAlign: 'center' }}>
        Safe, ready and taught, one stage at a time.
      </p>
    </section>
  )
}

function Fix({ instead, title, children }: { instead: string; title: string; children: ReactNode }) {
  return (
    <li className="wow-fu" style={{ listStyle: 'none' }}>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.3, margin: '0 0 2px' }}>{instead}</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
        {title}
      </h3>
      {children}
    </li>
  )
}

/** Three fixes. `afterStars` is the fold that holds the time number and the
 *  honest notes about it, which stay on the page one tap in. */
export function Fixes({ kid, words, concern, afterStars }: { kid: string; words: string; concern: string; afterStars?: ReactNode }) {
  return (
    <section aria-labelledby="ready-fixes" data-ready-fixes>
      <Head eyebrow="What it fixes" title="Three things, starting tonight." id="ready-fixes" />
      <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 40 }}>
        <Fix instead="Instead of rows about more time" title="Stars they earn.">
          <MockAsk kid={kid} />
          {afterStars && <div style={{ marginTop: 12 }}>{afterStars}</div>}
        </Fix>
        <Fix instead="Instead of not knowing what to say" title="The words, ready.">
          <p style={{
            margin: 0, background: 'var(--tint-butter)', borderRadius: 'var(--radius-card)', padding: '18px 20px',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.45,
          }}>
            &ldquo;{words}&rdquo;
          </p>
        </Fix>
        <Fix instead="Instead of guessing if it works" title="Ten seconds a day.">
          <MockProgress concern={concern} />
        </Fix>
      </ul>
    </section>
  )
}

// ── DIGI, AND HOW IT LEARNS ─────────────────────────────────────────────────
//
// The loops are the real ones in digi/00-how-digi-works.md, "How DiGi learns":
// a memory of this family on every reply, a "did it work" card a few days
// after a suggestion, and a weekly pass over what families said worked, read
// back as a starting suggestion (rank 5 in PRECEDENCE: never authority, never
// with numbers). So this says what the loop does and claims no result from it:
// no count of families, no success rate, because the counted outcomes table is
// still filling.
//
// The exchange is a drawing, not a recorded reply. Its words are the Builder
// stage's own online safety line (challengeActions.online_safety in
// lib/content/stages.ts), so DiGi is never shown saying something the product
// does not already say to a parent.

const DIGI_WORDS = 'You can always come to me if something online feels weird or wrong. I will not take the device away. I will help.'

const LOOP: { icon: MethodId; label: string }[] = [
  { icon: 'digi', label: 'You ask' },
  { icon: 'script', label: 'You try it' },
  { icon: 'checkin', label: 'Did it work?' },
  { icon: 'passport', label: 'It remembers' },
]

export function DigiLearns() {
  return (
    <section aria-labelledby="ready-digi" data-ready-digi>
      <Head eyebrow="DiGi, your guide" title="Ask anything. It learns what works." id="ready-digi" />
      <div className="wow-fu">
        <MockDigi
          question="They saw something online that upset them. What do I say?"
          answer="Stay calm, and keep them talking to you. This is the conversation for their age."
          words={DIGI_WORDS}
        />
      </div>
      <ol aria-label="How DiGi learns" className="wow-fu" style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, position: 'relative' }}>
        <span aria-hidden style={{ position: 'absolute', left: '12%', right: '12%', top: 21, height: 2, background: 'var(--border)' }} />
        {LOOP.map(l => (
          <li key={l.label} style={{ position: 'relative', textAlign: 'center', minWidth: 0 }}>
            <span aria-hidden style={{
              display: 'inline-flex', width: 44, height: 44, borderRadius: '50%', background: METHOD[l.icon].tint,
              border: 'var(--edge)', boxSizing: 'border-box', alignItems: 'center', justifyContent: 'center',
            }}>
              <MethodIcon id={l.icon} size={22} />
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xs)', color: 'var(--ink)', marginTop: 6, lineHeight: 1.2 }}>
              {l.label}
            </span>
          </li>
        ))}
      </ol>
      <p className="wow-fu" style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '16px 0 0', textAlign: 'center' }}>
        Every answer starts from the research, then fits your family. What works for other families comes back as a starting point for yours.
      </p>
    </section>
  )
}

const ALSO: { icon: MethodId; label: string }[] = [
  { icon: 'kidapp', label: 'Their own app' },
  { icon: 'lesson', label: 'Lessons' },
  { icon: 'script', label: 'Scripts' },
  { icon: 'balance', label: 'Device time' },
  { icon: 'moment', label: 'Moments' },
  { icon: 'checkin', label: 'Weekly review' },
]

/** Everything else, as labels. */
export function AlsoInside() {
  return (
    <section aria-labelledby="ready-also" data-ready-also>
      <Head eyebrow="Also inside" title="All in one place." id="ready-also" />
      <ul className="wow-fu" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {ALSO.map(a => (
          <li key={a.label} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px 7px 7px',
            background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)',
          }}>
            <span aria-hidden style={{
              width: 30, height: 30, borderRadius: '50%', background: METHOD[a.icon].tint,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MethodIcon id={a.icon} size={18} />
            </span>
            {a.label}
          </li>
        ))}
      </ul>
      <p className="wow-fu" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45, textAlign: 'center', margin: '22px 0 0' }}>
        Not a blocking app. We never read their chats.
      </p>
    </section>
  )
}
