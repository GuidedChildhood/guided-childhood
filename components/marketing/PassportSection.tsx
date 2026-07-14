import Link from 'next/link'
import { STAGES } from '@/lib/content/stages'
import { STAGE_READINESS, PASSPORT_ANALOGY } from '@/lib/content/passport'

// The passport, on the homepage. The one idea the whole platform turns on,
// stated where a first visitor meets it: the digital pathway is your child's
// social media passport. A digital passport book with five stamps, one earned
// each stage from 4 to 16, so that 16, the moment social media and the first
// vote arrive together, is a step and not a cliff edge. Not a ban, an
// education. Device settings relax as each stamp is earned, and a family
// joining late never misses a stamp, there is always a catch up plan.

const STAGE_RING = ['var(--stage-1)', 'var(--stage-2)', 'var(--stage-3)', 'var(--stage-4)', 'var(--stage-5)']
// A gentle, fixed lean per stamp so the row reads like a real stamped page,
// not a tidy grid. Fixed values keep the server render stable.
const STAMP_TILT = [-4, 3, -2, 4, 0]

export default function PassportSection() {
  return (
    <section aria-label="The social media passport" style={{ padding: 'clamp(72px, 9vw, 112px) 32px', background: '#FFFBEE', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1020px', margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p className="eyebrow fu" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The idea behind the pathway</p>
          <h2 className="fu" style={{ marginBottom: '16px' }}>
            Your child&apos;s{' '}
            <span style={{ color: 'var(--terracotta)' }}>social media passport</span>
          </h2>
          <p className="fu" style={{ fontSize: '1.05rem', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '600px', margin: '0 auto' }}>
            {PASSPORT_ANALOGY} This is not about banning. It is about preparation, the skills to navigate the digital world rather than hide from it. Your child earns the passport page by page: safe digital usage, healthy habits from the start, no matter what age they join.
          </p>
        </div>

        {/* The passport book: a deep teal cover beside a stamped page */}
        <div className="passport-book fu" style={{ display: 'flex', gap: '18px', alignItems: 'stretch', marginBottom: '36px', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Cover: a real passport book, burgundy with gold foil */}
          <div style={{
            flex: '1 1 240px', minWidth: 240, maxWidth: 320,
            background: 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)',
            borderRadius: '14px 18px 18px 14px',
            padding: '30px 26px', color: 'var(--terracotta)', position: 'relative',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 14px 40px rgba(0,0,0,0.22), inset 0 0 0 2px rgba(237,195,95,0.55), inset 0 0 0 5px rgba(237,195,95,0.14), inset 12px 0 24px rgba(0,0,0,0.25)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.8)', marginBottom: '8px' }}>
                Guided Childhood
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6rem', letterSpacing: '0.02em', lineHeight: 1.05 }}>
                Digital Passport
              </div>
              <div style={{ width: '46px', height: '1.5px', background: 'rgba(237,195,95,0.55)', margin: '12px auto 0' }} />
            </div>
            <div style={{ margin: '26px 0', display: 'flex', justifyContent: 'center' }}>
              {/* Gold foil crest: the rising bars in a ring */}
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                border: '2.5px solid rgba(237,195,95,0.85)',
                boxShadow: 'inset 0 0 0 4px rgba(237,195,95,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4.5px', height: '36px' }}>
                  {[5, 9, 14, 8].map((h, i) => (
                    <div key={i} style={{ width: '6.5px', height: `${(h / 14) * 36}px`, background: 'var(--terracotta)', borderRadius: '3px' }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(237,195,95,0.65)', textAlign: 'center' }}>
              Ages 4 to 16 · Prepared, not postponed
            </div>
          </div>

          {/* Stamp page */}
          <div style={{
            flex: '2 1 420px', minWidth: 300,
            background: '#fff', borderRadius: '18px', border: '1.5px solid var(--border)',
            padding: '26px 24px', boxShadow: '0 14px 40px rgba(0,0,0,0.07)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '18px' }}>
              One stamp earned each stage
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: '14px' }}>
              {STAGES.map((stage, i) => {
                const r = STAGE_READINESS[stage.id]
                const isFinal = stage.id === 5
                return (
                  <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                    <div style={{
                      width: 76, height: 76, borderRadius: '50%',
                      border: `2.5px dashed ${isFinal ? 'var(--terracotta)' : STAGE_RING[i]}`,
                      background: isFinal ? 'var(--terracotta-lt)' : `color-mix(in srgb, ${STAGE_RING[i]} 45%, white)`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      transform: `rotate(${STAMP_TILT[i]}deg)`,
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                        Stage
                      </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1, color: isFinal ? 'var(--terracotta-dark)' : 'var(--ink)' }}>
                        {stage.id}
                      </span>
                      {isFinal && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--terracotta-dark)', textTransform: 'uppercase' }}>
                          Ready
                        </span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.15 }}>
                        {stage.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                        {stage.ages.replace('Ages ', '').replace(' and above', '+')}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--ink-light)', marginTop: '3px', lineHeight: 1.3 }}>
                        {r.moment}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              At 16, when social media and the first vote arrive together, the cliff edge is just a step. Your child is prepared, educated and safe, and so are you.
            </p>
          </div>

          {/* The real thing: the passport as it looks in the app today */}
          <div style={{
            flex: '0 1 200px', minWidth: 180, maxWidth: 230, alignSelf: 'center',
            display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center',
          }}>
            <div style={{ borderRadius: '22px', overflow: 'hidden', border: '5px solid var(--ink)', boxShadow: '0 18px 50px rgba(26,26,46,0.22)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marketing/passport-mobile-stage.png"
                alt="The digital passport inside the app, a stage page with its circle filling"
                loading="lazy"
                style={{ width: '100%', display: 'block', aspectRatio: '390 / 680', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              Live in the app today
            </div>
          </div>
        </div>

        {/* Two supporting points: device settings, and catch up at any age */}
        <div className="fu" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '34px' }}>
          <div style={{ background: 'var(--stage-2)', border: '1.5px solid var(--stage-2)', borderRadius: '16px', padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '8px' }}>
              Settings that grow with them
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
              The parental device settings relax as each stamp is earned, so freedom is age related and earned, never handed over all at once. A feature phone around 9, a guided smartphone later, real social media at 16.
            </p>
          </div>
          <div style={{ background: 'var(--stage-4)', border: '1.5px solid var(--stage-4)', borderRadius: '16px', padding: '20px 22px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '8px' }}>
              Start at any age
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
              Joining when your child is 13 or 15? You never miss a stamp. We start where they are and build a catch up plan to get them up to speed, so the passport still completes by 16.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="fu" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/starter-pack" className="btn btn-gold" style={{ fontSize: '15px', padding: '15px 32px' }}>
            Start the passport, it is free
          </Link>
          <Link href="/passport" style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 28px', background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)', borderRadius: '16px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px' }}>
            See how it works
          </Link>
        </div>
      </div>
    </section>
  )
}
