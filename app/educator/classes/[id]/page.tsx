import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { updateClass, deleteClass, addPupils, renamePupil, removePupil } from '../../actions'
import { panel, eyebrow, sectionEyebrow, innerRow, input, label, btnGold, btnQuiet, h1 } from '@/components/educator/ui'

// Class view: pupils, the teach and record flow, past deliveries, and now
// inline editing (rename the class, change year group, add, rename and
// remove pupils, delete the class). Premium surfaces throughout.
// Recording a delivery IS the register: one tap, everyone defaults to met.

export default async function ClassPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; edit?: string }>
}) {
  const { id } = await params
  const { error, edit } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: cls } = await supabase
    .from('school_classes')
    .select('id, name, year_group, class_code, school_id')
    .eq('id', id)
    .maybeSingle()
  if (!cls) notFound()

  const [{ data: pupils }, { data: lessons }, { data: deliveries }] = await Promise.all([
    supabase.from('pupils').select('id, display_name').eq('class_id', id).order('display_name'),
    supabase.from('school_lessons').select('id, module_id, title, key_stage').order('sort_order'),
    supabase.from('lesson_deliveries').select('id, lesson_id, taught_at, school_lessons(title)').eq('class_id', id).order('taught_at', { ascending: false }),
  ])

  const editing = edit === '1'

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '28px 20px 90px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <Link href="/educator" style={{ ...eyebrow, textDecoration: 'none' }}>← All classes</Link>

        {error && (
          <div style={{ background: 'var(--coral-lt)', border: '2px solid var(--coral)', borderRadius: '14px', padding: '12px 16px', margin: '14px 0', fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--coral-dark, #8F3F04)', lineHeight: 1.55, overflowWrap: 'anywhere' }}>
            {error}
          </div>
        )}

        {/* Header panel with the class identity and edit toggle */}
        <div style={{ ...panel, marginTop: '14px', marginBottom: '18px', background: 'linear-gradient(135deg, var(--deep-teal, #173C46) 0%, #12313a 100%)', border: 'none', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,201,76,0.24) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ ...h1, color: '#fff' }}>
                {cls.name} <span style={{ fontWeight: 700, fontSize: '0.6em', color: 'rgba(255,255,255,0.7)' }}>{cls.year_group}</span>
              </h1>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
                Class code {cls.class_code} · {(pupils ?? []).length} pupil{(pupils ?? []).length === 1 ? '' : 's'}
              </div>
            </div>
            <Link href={editing ? `/educator/classes/${cls.id}` : `/educator/classes/${cls.id}?edit=1`} style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none',
              color: '#fff', background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: '12px', padding: '9px 16px',
            }}>
              {editing ? 'Done' : 'Edit class'}
            </Link>
          </div>
        </div>

        {/* Edit panel: class details + delete */}
        {editing && (
          <div style={{ ...panel, marginBottom: '18px' }}>
            <div style={sectionEyebrow}>Class details</div>
            <form action={updateClass} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <input type="hidden" name="class_id" value={cls.id} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={label}>
                  Class name
                  <input name="name" required defaultValue={cls.name} style={{ ...input, marginTop: '6px' }} />
                </label>
                <label style={label}>
                  Year group
                  <input name="year_group" required defaultValue={cls.year_group} style={{ ...input, marginTop: '6px' }} />
                </label>
              </div>
              <button type="submit" style={{ ...btnGold, alignSelf: 'flex-start' }}>Save changes</button>
            </form>

            <div style={{ ...sectionEyebrow, color: 'var(--coral-dark, #8F3F04)' }}>Danger zone</div>
            <form action={deleteClass}>
              <input type="hidden" name="class_id" value={cls.id} />
              <button type="submit" style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer',
                color: 'var(--coral-dark, #8F3F04)', background: 'var(--coral-lt)', border: '1.5px solid var(--coral)',
                borderRadius: '12px', padding: '10px 16px',
              }}>
                Delete this class and its pupils
              </button>
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-muted)', marginTop: '6px' }}>
                Removes the class, its pupils and its delivery records. This cannot be undone.
              </span>
            </form>
          </div>
        )}

        {/* Teach and record */}
        <div style={{ ...panel, marginBottom: '18px' }}>
          <div style={sectionEyebrow}>Teach and record</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(lessons ?? []).map(l => (
              <div key={l.id} style={{ ...innerRow, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ ...eyebrow, marginBottom: '4px' }}>{l.key_stage}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>{l.title}</div>
                </div>
                <Link href={`/educator/classes/${cls.id}/lesson/${l.module_id}`} style={{ ...btnGold, fontSize: '13.5px', padding: '10px 18px', textDecoration: 'none', flexShrink: 0 }}>
                  Everything for this lesson →
                </Link>
              </div>
            ))}
            {(lessons ?? []).length === 0 && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>Run the migrations and the lessons appear here.</p>
            )}
          </div>
        </div>

        {/* Past deliveries */}
        <div style={{ ...panel, marginBottom: '18px' }}>
          <div style={sectionEyebrow}>Past deliveries</div>
          {(deliveries ?? []).length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>Nothing recorded yet. The moment you teach a lesson, one tap records it for the coverage report.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(deliveries ?? []).map(d => (
                <Link key={d.id} href={`/educator/deliveries/${d.id}`} style={{ ...innerRow, textDecoration: 'none', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                    {(d.school_lessons as unknown as { title: string })?.title ?? 'Lesson'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)' }}>
                    {new Date(d.taught_at).toLocaleDateString('en-GB')}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pupils */}
        <div style={panel}>
          <div style={sectionEyebrow}>Pupils</div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(pupils ?? []).map(p => (
                <div key={p.id} style={{ ...innerRow, display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <form action={renamePupil} style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, minWidth: '200px' }}>
                    <input type="hidden" name="pupil_id" value={p.id} />
                    <input type="hidden" name="class_id" value={cls.id} />
                    <input name="display_name" defaultValue={p.display_name} style={{ ...input, padding: '8px 12px', fontSize: '14px' }} />
                    <button type="submit" style={{ ...btnQuiet, padding: '8px 14px' }}>Save</button>
                  </form>
                  <form action={removePupil}>
                    <input type="hidden" name="pupil_id" value={p.id} />
                    <input type="hidden" name="class_id" value={cls.id} />
                    <button type="submit" aria-label={`Remove ${p.display_name}`} style={{ background: 'none', border: 'none', color: 'var(--coral-dark, #8F3F04)', cursor: 'pointer', fontSize: '16px', padding: '6px 8px' }}>✕</button>
                  </form>
                </div>
              ))}
              {(pupils ?? []).length === 0 && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>No pupils yet. Add them below.</p>
              )}

              <form action={addPupils} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="hidden" name="class_id" value={cls.id} />
                <label style={label}>
                  Add pupils, one per line, first name and initial only
                  <textarea name="pupils" rows={4} placeholder={'Amara K\nBen T\nChloe M'} style={{ ...input, marginTop: '6px', resize: 'vertical' }} />
                </label>
                <button type="submit" style={{ ...btnGold, alignSelf: 'flex-start' }}>Add to the class</button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(pupils ?? []).map(p => (
                <span key={p.id} style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13.5px', color: 'var(--ink)', background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '10px', padding: '6px 12px' }}>
                  {p.display_name}
                </span>
              ))}
              {(pupils ?? []).length === 0 && (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>No pupils added. Use Edit class to add them.</span>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
