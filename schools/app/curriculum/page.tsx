import { anon as supabase } from '@/lib/supabase/anon'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CURRICULUM, CHARACTERS, KEY_STAGE_META, KEY_STAGE_ORDER, KEY_STAGE_WHY, SPIRAL_BEHAVIOURS } from '@gc/shared/schools-curriculum'

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

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '36px 20px 90px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', margin: '14px 0 4px' }}>
          The whole programme · Reception to Year 13
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
          The curriculum map
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '640px', marginBottom: '10px' }}>
          Twenty one modules covering all eight Education for a Connected World strands, taught by the DiGi Squad.
          Pick a module and teach it today. No download wall, no prep, nothing to book.
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '22px' }}>
          {liveCount} of {CURRICULUM.length} modules live in the pilot · the rest are in production
        </p>

        {/* How to use the map: three moves, so a first time visitor is never
            guessing what this page is for. */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '18px', padding: '18px 20px', marginBottom: '18px', maxWidth: '760px' }}>
          <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '10px' }}>How to use this map</div>
          <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Find your year group below. Each stage says what it covers and why the content lands at that age.',
              'Open any live module to see the objective, the misconceptions and what to print before you commit a lesson to it.',
              'Teach it the same day: every module carries the player, the word for word script, the paper pack and the parent note. Your school code opens all of it.',
            ].map(step => (
              <li key={step} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{step}</li>
            ))}
          </ol>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '10px 0 0' }}>
            Parents are welcome here too: the statutory guidance gives you the right to see what your child is taught, and this map is where you start. The line by line statutory mapping is at <Link href="/hub/rshe-mapping" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the mapping matrix</Link>, and the thinking behind the order is at <Link href="/philosophy" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>our philosophy</Link>.
          </p>
        </div>

        {/* The spiral: the ten behaviours that recur at every stage, deeper
            each time. This is what makes the map a progression rather than
            a topic list, the White Rose habit. */}
        <div style={{ marginBottom: '18px', maxWidth: '760px' }}>
          <div style={{ ...eyebrow, marginBottom: '8px' }}>Ten behaviours spiral through every stage, deeper each time</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SPIRAL_BEHAVIOURS.map(b => (
              <span key={b} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '100px', padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Jump nav: straight to your key stage. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '34px' }}>
          {KEY_STAGE_ORDER.map(ks => (
            <a key={ks} href={`#${ks.toLowerCase()}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', background: 'var(--terracotta-lt, #FDF4D9)', border: '1.5px solid var(--terracotta)', borderRadius: '100px', padding: '7px 16px', textDecoration: 'none' }}>
              {KEY_STAGE_META[ks].label} · {KEY_STAGE_META[ks].years}
            </a>
          ))}
        </div>

        {KEY_STAGE_ORDER.map(ks => {
          const meta = KEY_STAGE_META[ks]
          const modules = CURRICULUM.filter(m => m.keyStage === ks)
          return (
            <section key={ks} id={ks.toLowerCase()} style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
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
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.6, maxWidth: '720px', marginBottom: '16px' }}>
                <strong style={{ color: 'var(--green-dark)' }}>Why now:</strong> {KEY_STAGE_WHY[ks]}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
                {modules.map(m => {
                  const ch = CHARACTERS[m.character]
                  const live = liveModules.has(m.moduleId)
                  return (
                    <div key={m.moduleId} style={{
                      background: '#fff', border: `2px solid ${live ? ch.accent : 'var(--border)'}`,
                      borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                      boxShadow: live ? `0 5px 0 ${ch.soft}` : 'none',
                      opacity: live ? 1 : 0.82,
                    }}>
                      {/* Character band */}
                      <div style={{ background: ch.soft, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '32px', height: '32px', borderRadius: '50%', background: '#fff',
                          border: `2px solid ${ch.accent}`, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 'var(--text-lg)', flexShrink: 0,
                        }}>
                          {ch.emblem}
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: ch.ink }}>
                          {m.castLine}
                        </span>
                        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', color: ch.ink }}>
                          M{String(m.n).padStart(2, '0')}
                        </span>
                      </div>

                      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ ...eyebrow, fontSize: 'var(--text-sm)' }}>{m.yearBand}</span>
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
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                          {m.blurb}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 600, fontSize: 'var(--text-base)', color: ch.ink, lineHeight: 1.5 }}>
                          &ldquo;{m.outcome}&rdquo;
                        </p>

                        <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {live ? (
                            // The card lands on the lesson page, not straight
                            // into the player. A teacher choosing a module
                            // needs to see the objective, the misconceptions
                            // and what to print before they commit a lesson
                            // to it, and Teach this lesson is the first
                            // button on that page for anyone who already has.
                            <Link href={`/lesson/${m.moduleId}`} style={{
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                              color: '#fff', background: ch.accent, borderRadius: '12px',
                              padding: '8px 14px', textDecoration: 'none',
                            }}>
                              Ready to teach →
                            </Link>
                          ) : (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '7px 12px' }}>
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

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-light)', lineHeight: 1.6, maxWidth: '640px' }}>
          Every module ships with the lesson player, the word for word teacher script, the paper pack, pupil
          booklets and a parent note home. Print anything from the print room; nothing needs an account.
        </p>
      </div>
    </main>
  )
}
