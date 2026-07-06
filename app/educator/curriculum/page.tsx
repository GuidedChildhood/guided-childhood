import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CURRICULUM, CHARACTERS, KEY_STAGE_META, KEY_STAGE_ORDER } from '@/lib/content/schools-curriculum'

// THE CURRICULUM MAP: the shop window. One screen showing the whole
// programme, Reception to Year 13, as character colour coded module cards
// with coverage rings that fill as classes are taught. This is the screen
// a head opens to see the year at a glance, and the screen that wins the
// pilot demo (Jigsaw shows a colourful programme; we show a colourful
// programme WITH live delivery evidence on it).

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

// Coverage ring: classes taught over total classes, drawn server side.
function CoverageRing({ taught, total, accent }: { taught: number; total: number; accent: string }) {
  const pct = total > 0 ? taught / total : 0
  const r = 15
  const c = 2 * Math.PI * r
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <svg width="38" height="38" viewBox="0 0 38 38" role="img" aria-label={`${taught} of ${total} classes taught`}>
        <circle cx="19" cy="19" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
        <circle
          cx="19" cy="19" r={r} fill="none" stroke={accent} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`}
          transform="rotate(-90 19 19)"
        />
        {pct === 1 && total > 0 && (
          <text x="19" y="24" textAnchor="middle" fontSize="14" fill={accent} fontWeight="900">✓</text>
        )}
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)' }}>
        {taught} of {total} classes
      </span>
    </span>
  )
}

export default async function CurriculumMapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('school_educators')
    .select('school_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()
  if (!membership) redirect('/educator')

  const [{ data: classes }, { data: lessons }] = await Promise.all([
    supabase.from('school_classes').select('id').eq('school_id', membership.school_id),
    supabase.from('school_lessons').select('id, module_id'),
  ])

  const classIds = (classes ?? []).map(c => c.id)
  const { data: deliveries } = classIds.length
    ? await supabase.from('lesson_deliveries').select('lesson_id, class_id').in('class_id', classIds)
    : { data: [] as { lesson_id: string; class_id: string }[] }

  // module_id → set of classes that have been taught it
  const lessonById = new Map((lessons ?? []).map(l => [l.id, l.module_id]))
  const liveModules = new Set((lessons ?? []).map(l => l.module_id))
  const taughtClasses = new Map<string, Set<string>>()
  for (const d of deliveries ?? []) {
    const moduleId = lessonById.get(d.lesson_id)
    if (!moduleId) continue
    if (!taughtClasses.has(moduleId)) taughtClasses.set(moduleId, new Set())
    taughtClasses.get(moduleId)!.add(d.class_id)
  }

  const totalClasses = classIds.length
  const liveCount = CURRICULUM.filter(m => liveModules.has(m.moduleId)).length

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '36px 20px 90px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <Link href="/educator" style={{ ...eyebrow, textDecoration: 'none' }}>← Workspace</Link>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', margin: '14px 0 4px' }}>
          The whole programme · Reception to Year 13
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
          The curriculum map
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '640px', marginBottom: '10px' }}>
          Twenty one modules covering all eight Education for a Connected World strands, taught by the DiGi Squad.
          The ring on each card fills as your classes are taught, so this page is also your live coverage record.
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '34px' }}>
          {liveCount} of {CURRICULUM.length} modules live in the pilot · the rest are in production
        </p>

        {KEY_STAGE_ORDER.map(ks => {
          const meta = KEY_STAGE_META[ks]
          const modules = CURRICULUM.filter(m => m.keyStage === ks)
          return (
            <section key={ks} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                  {meta.label} <span style={{ fontWeight: 700, fontSize: '0.75em', color: 'var(--ink-muted)' }}>{meta.years}</span>
                </h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)' }}>
                  {modules.length} module{modules.length === 1 ? '' : 's'}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', marginBottom: '16px' }}>
                {meta.strapline}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
                {modules.map(m => {
                  const ch = CHARACTERS[m.character]
                  const live = liveModules.has(m.moduleId)
                  const taught = taughtClasses.get(m.moduleId)?.size ?? 0
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
                          justifyContent: 'center', fontSize: '17px', flexShrink: 0,
                        }}>
                          {ch.emblem}
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: ch.ink }}>
                          {m.castLine}
                        </span>
                        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: ch.ink }}>
                          M{String(m.n).padStart(2, '0')}
                        </span>
                      </div>

                      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ ...eyebrow, fontSize: '9.5px' }}>{m.yearBand}</span>
                          {m.crown && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A5A0E', background: '#FBEEC9', borderRadius: '6px', padding: '1px 7px' }}>
                              👑 Crown module
                            </span>
                          )}
                          {m.dsl && (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--coral-dark)', background: 'var(--coral-lt)', borderRadius: '6px', padding: '1px 7px' }}>
                              DSL note
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.3 }}>
                          {m.title}
                        </h3>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                          {m.blurb}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 600, fontSize: '12.5px', color: ch.ink, lineHeight: 1.5 }}>
                          &ldquo;{m.outcome}&rdquo;
                        </p>

                        <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {live ? (
                            <Link href="/educator/preview" style={{
                              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
                              color: '#fff', background: ch.accent, borderRadius: '12px',
                              padding: '8px 14px', textDecoration: 'none',
                            }}>
                              Ready to teach →
                            </Link>
                          ) : (
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--ink-muted)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '7px 12px' }}>
                              In production
                            </span>
                          )}
                          <CoverageRing taught={taught} total={totalClasses} accent={ch.accent} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-light)', lineHeight: 1.6, maxWidth: '640px' }}>
          Every module ships with the lesson player, video beats, the teacher script, the paper pack, pupil booklets,
          named quizzes, a parent note home, and one tap register and marking. Coverage on this page is your
          printable evidence of delivery.
        </p>
      </div>
    </main>
  )
}
