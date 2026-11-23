import { db as supabase } from '@/lib/supabase/server-db'
import { isTasterModule, TASTER_MODULES } from '@/lib/taster'
import { currentAccess } from '@/lib/licence'
import { pilotModulesFor } from '@/lib/pilot'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CURRICULUM, CHARACTERS, KEY_STAGE_META, KEY_STAGE_ORDER, KEY_STAGE_WHY, SPIRAL_BEHAVIOURS, positionLabel } from '@gc/shared/schools-curriculum'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'
import FriendMark from '@gc/shared/components/FriendMark'

// THE CURRICULUM MAP: the whole programme, Reception to Year 13, as
// character colour coded module cards. PUBLIC since 30 August 2026 (the open
// map decision): the map is the shop window and the standard others align
// to, and it cannot be taught from. Tapping into any module meets the school
// code gate, which is the funnel, not a leak. Still anonymous by design: the
// coverage rings from the old educator workspace do not exist here because
// this page has no idea who is looking, and never will.
//
// Upgraded 31 August to White Rose map habits: the map explains how to use
// itself, names the spiral behaviours that make it a progression rather
// than a topic list, jumps by key stage, and says WHY each stage's content
// lands at that age (KEY_STAGE_WHY, shared with the home page so the two
// can never drift).

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'The Curriculum Map, Reception to Year 13',
  description:
    'Every module of the Guided Childhood digital literacy curriculum on one page: what each year group covers, why it lands at that age, and the ten behaviours that spiral through the whole scheme. Free to read, mapped to the statutory RSHE guidance and all eight Education for a Connected World strands.',
  alternates: { canonical: 'https://schools.guidedchildhood.com/curriculum' },
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

export default async function CurriculumMapPage() {

  const { data: lessons } = await supabase.from('school_lessons').select('id, module_id')
  const liveModules = new Set((lessons ?? []).map(l => l.module_id))
  const liveCount = CURRICULUM.filter(m => liveModules.has(m.moduleId)).length
  // A pilot school sees which two its code opens; everything else is marked
  // as the full scheme, still visible, opening with a licence.
  const access = await currentAccess()
  const pilotSet = access?.tier === 'pilot' ? new Set(pilotModulesFor(access.phase)) : null
  // CAN THIS VISITOR OPEN THIS LESSON. Asked once, here, because the card has
  // to answer it twice: in the chip and on the button, and those two must
  // never disagree. The wall itself is in the proxy (schools/proxy.ts) and is
  // not moved by this; all that changes is whether the page says so.
  const opens = (moduleId: string) =>
    isTasterModule(moduleId) || access?.tier === 'licence' || (pilotSet?.has(moduleId) ?? false)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', margin: '14px 0 4px' }}>
          The whole programme · Reception to Year 13
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          The curriculum map
        </h1>
        {/* ONE LINE, THEN YOUR YEAR (23 November 2026). The map opened on a
            paragraph, a three step box and ten chips before the first year
            group (plans/2026-11-23-schools-ux-review.md). It now says what it
            is in one line, names the free lesson, and puts the year groups
            first. The ten behaviours fold away under the year buttons. */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '640px', marginBottom: 'var(--space-4)' }}>
          {CURRICULUM.length} lessons, Reception to Year 13. Every one is open to read, and one is free to teach today:{' '}
          <Link href={`/lesson/${TASTER_MODULES[0]}`} style={{ color: 'var(--ink)', fontWeight: 800 }}>
            {CURRICULUM.find(m => m.moduleId === TASTER_MODULES[0])?.title ?? 'the free sample'}
          </Link>.
          {liveCount < CURRICULUM.length ? ` ${liveCount} of ${CURRICULUM.length} are live.` : ''}
        </p>
        {/* Jump nav: straight to your key stage. */}
        <nav aria-label="Jump to a year group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          {KEY_STAGE_ORDER.map(ks => (
            <a key={ks} href={`#${ks.toLowerCase()}`} className="gc-tap" style={{ display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '12px 16px', textDecoration: 'none', minHeight: '44px' }}>
              {KEY_STAGE_META[ks].years}
              <span style={{ ...eyebrow, fontSize: 'var(--text-xs)' }}>{KEY_STAGE_META[ks].label}</span>
            </a>
          ))}
        </nav>
        <details style={{ marginBottom: '34px' }}>
          <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', minHeight: '44px', display: 'flex', alignItems: 'center' }}>Ten behaviours come back every year, a little deeper each time</summary>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            {SPIRAL_BEHAVIOURS.map(b => (
              <span key={b} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>{b}</span>
            ))}
          </div>
        </details>

        {KEY_STAGE_ORDER.map(ks => {
          const meta = KEY_STAGE_META[ks]
          const modules = CURRICULUM.filter(m => m.keyStage === ks)
          return (
            <section key={ks} id={ks.toLowerCase()} style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                  {meta.label} <span style={{ fontWeight: 700, fontSize: '0.75em', color: 'var(--ink-muted)' }}>{meta.years}</span>
                </h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)' }}>
                  {modules.length} module{modules.length === 1 ? '' : 's'}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginBottom: '8px' }}>
                {meta.strapline}
              </p>
              {/* Why this content lands at this age: the map explains its
                  own order, which is what earns a sceptical reader. */}
              <details style={{ maxWidth: '720px', marginBottom: '16px' }}>
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', minHeight: '44px', display: 'flex', alignItems: 'center' }}>Why at this age</summary>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{KEY_STAGE_WHY[ks]}</p>
              </details>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 'var(--space-3)' }}>
                {modules.map(m => {
                  const ch = CHARACTERS[m.character]
                  const live = liveModules.has(m.moduleId)
                  return (
                    <div key={m.moduleId} style={{
                      background: '#fff', border: `2px solid ${live ? ch.accent : 'var(--border)'}`,
                      borderRadius: 'var(--radius-card)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                      boxShadow: live ? `0 5px 0 ${ch.soft}` : 'none',
                      opacity: live ? 1 : 0.82,
                    }}>
                      {/* Character band */}
                      <div style={{ background: ch.soft, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{
                          width: '52px', height: '52px', borderRadius: '50%', background: '#fff',
                          border: `2px solid ${ch.accent}`, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 'var(--text-lg)', flexShrink: 0,
                          overflow: 'hidden',
                        }}>
                          <FriendMark character={m.character} size={48} ring={false} />
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: ch.ink }}>
                          {m.castLine}
                        </span>
                        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', color: ch.ink }}>
                          Lesson {positionLabel(m.moduleId)}
                        </span>
                      </div>

                      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          <span style={{ ...eyebrow, fontSize: 'var(--text-sm)' }}>{m.yearBand}</span>
                          {/* THE TRUE LENGTH, ON THE CARD (21 September 2026).
                              This map is public, so a head reads it before they
                              have seen a lesson, and until today it said nothing
                              about how long one takes. The figure is the sum of
                              the slides, held to the lesson files by
                              scripts/check-lesson-minutes.mjs, so it cannot
                              drift into a promise the lesson does not keep. */}
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: ch.ink, background: ch.soft, borderRadius: '6px', padding: '1px 7px' }}>
                            {m.minutes} minutes
                          </span>
                          {m.crown && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A5A0E', background: '#FBEEC9', borderRadius: '6px', padding: '1px 7px' }}>
                              👑 Crown module
                            </span>
                          )}
                          {m.dsl && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--coral-dark)', background: 'var(--coral-lt)', borderRadius: '6px', padding: '1px 7px' }}>
                              DSL note
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.3 }}>
                          {m.title}
                        </h3>
                        <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 600, fontSize: 'var(--text-base)', color: ch.ink, lineHeight: 1.5 }}>
                          &ldquo;{m.outcome}&rdquo;
                        </p>

                        <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                          {/* The one module anybody can open without a code.
                              This map is public, so without the chip it is
                              twenty two doors to /unlock and one that opens,
                              with nothing saying which. See lib/taster.ts. */}
                          {/* Until 18 September this chip rendered only for a
                              pilot school, so a visitor with NO code saw
                              twenty four identical gold buttons and every one
                              of them bounced to /unlock. The comment above
                              had named that exact failure and the code did it
                              anyway. Now every card says which it is, to
                              everybody, the way a price sits on every option
                              on a shop page. A licensed school gets no chip,
                              because for them there is nothing to say. */}
                          {live && !isTasterModule(m.moduleId) && access?.tier !== 'licence' && (
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                              letterSpacing: '0.1em', textTransform: 'uppercase',
                              color: pilotSet?.has(m.moduleId) ? 'var(--stage-1-text)' : 'var(--ink-muted)',
                              background: pilotSet?.has(m.moduleId) ? 'var(--stage-1)' : 'transparent',
                              border: `1.5px solid ${pilotSet?.has(m.moduleId) ? 'var(--stage-1-bold)' : 'var(--border)'}`, borderRadius: 'var(--radius-pill)',
                              padding: '5px 11px',
                            }}>
                              {pilotSet?.has(m.moduleId) ? 'In your pilot' : pilotSet ? 'Full scheme' : 'Licence needed'}
                            </span>
                          )}
                          {live && isTasterModule(m.moduleId) && (
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                              letterSpacing: '0.1em', textTransform: 'uppercase',
                              color: 'var(--retro-green-dark)', background: 'var(--tint-green)',
                              border: '1.5px solid var(--retro-green-dark)', borderRadius: 'var(--radius-pill)',
                              padding: '5px 11px',
                            }}>
                              Free sample
                            </span>
                          )}
                          {live ? (
                            // The card lands on the lesson page, not straight
                            // into the player. A teacher choosing a module
                            // needs to see the objective, the misconceptions
                            // and what to print before they commit a lesson
                            // to it, and Teach this lesson is the first
                            // button on that page for anyone who already has.
                            // "Ready to teach" is a promise the tap can only
                            // keep when the visitor can actually open it.
                            // Everywhere else the tap lands on /unlock, so the
                            // button says so and goes quiet: solid and in the
                            // friend's colour for a lesson you have, outlined
                            // for a door. That also takes twenty four filled
                            // buttons off the page, which is most of why it
                            // read as louder than it is.
                            <Link className="gc-tap" href={`/lesson/${m.moduleId}`} style={{
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                              color: opens(m.moduleId) ? '#fff' : 'var(--ink-soft)',
                              background: opens(m.moduleId) ? ch.accent : 'transparent',
                              border: opens(m.moduleId) ? '1px solid transparent' : '1px solid var(--border)',
                              borderRadius: 'var(--radius-tile)',
                              padding: '8px 14px', textDecoration: 'none',
                            }}>
                              {opens(m.moduleId) ? 'Ready to teach →' : 'Unlock this lesson →'}
                            </Link>
                          ) : (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '7px 12px' }}>
                              In production
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

      </div>
    </main>
  )
}
