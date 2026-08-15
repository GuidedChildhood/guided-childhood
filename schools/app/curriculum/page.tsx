import { anon as supabase } from '@/lib/supabase/anon'
import Link from 'next/link'
import { CURRICULUM, CHARACTERS, KEY_STAGE_META, KEY_STAGE_ORDER } from '@gc/shared/schools-curriculum'

// THE CURRICULUM MAP: the whole programme, Reception to Year 13, as
// character colour coded module cards. Behind the school code (proxy.ts), so
// only a licensed school sees it, but still anonymous once inside: the
// coverage rings from the old educator workspace do not exist here because a
// code is a door, not an identity, and this page has no idea who is looking.

export const revalidate = 3600

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
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '34px' }}>
          {liveCount} of {CURRICULUM.length} modules live in the pilot · the rest are in production
        </p>

        {KEY_STAGE_ORDER.map(ks => {
          const meta = KEY_STAGE_META[ks]
          const modules = CURRICULUM.filter(m => m.keyStage === ks)
          return (
            <section key={ks} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                  {meta.label} <span style={{ fontWeight: 700, fontSize: '0.75em', color: 'var(--ink-muted)' }}>{meta.years}</span>
                </h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)' }}>
                  {modules.length} module{modules.length === 1 ? '' : 's'}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginBottom: '16px' }}>
                {meta.strapline}
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
