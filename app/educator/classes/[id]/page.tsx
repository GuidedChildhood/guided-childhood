import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { recordDelivery } from '../../actions'

// Class view: pupils, the teach and record flow, and past deliveries.
// Recording a delivery IS the register: one tap, everyone defaults to met,
// the teacher then only touches exceptions on the marking screen.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const card: React.CSSProperties = {
  background: 'var(--warm)', border: '1.5px solid var(--border)',
  borderRadius: '20px', padding: '22px',
}

export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Link href="/educator" style={{ ...eyebrow, textDecoration: 'none' }}>← All classes</Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'var(--ink)', margin: '10px 0 4px' }}>
          {cls.name} <span style={{ fontWeight: 700, fontSize: '0.65em', color: 'var(--ink-muted)' }}>{cls.year_group}</span>
        </h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--green-dark)', marginBottom: '28px' }}>
          Class code {cls.class_code} · {(pupils ?? []).length} pupils
        </div>

        <section style={{ marginBottom: '32px' }}>
          <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '12px' }}>Teach and record</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(lessons ?? []).map(l => (
              <div key={l.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ ...eyebrow, marginBottom: '4px' }}>{l.key_stage}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)' }}>{l.title}</div>
                </div>
                <Link href={`/educator/classes/${cls.id}/lesson/${l.module_id}`} style={{
                  padding: '11px 20px', borderRadius: '16px', background: 'var(--gold)', color: 'var(--ink)',
                  boxShadow: '0 5px 0 var(--gold-hover)', textDecoration: 'none',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', flexShrink: 0,
                }}>
                  Everything for this lesson →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '12px' }}>Past deliveries</div>
          {(deliveries ?? []).length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>Nothing recorded yet. The moment you teach a lesson, one tap records it for the coverage report.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(deliveries ?? []).map(d => (
                <Link key={d.id} href={`/educator/deliveries/${d.id}`} style={{ ...card, padding: '14px 18px', textDecoration: 'none', display: 'flex', justifyContent: 'space-between' }}>
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
        </section>

        <section>
          <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '12px' }}>Pupils</div>
          <div style={{ ...card, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(pupils ?? []).map(p => (
              <span key={p.id} style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13.5px', color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '6px 12px' }}>
                {p.display_name}
              </span>
            ))}
            {(pupils ?? []).length === 0 && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>No pupils added.</span>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
