import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import JudgementGrid from './JudgementGrid'
import { panel, eyebrow, h1 } from '@/components/educator/ui'

// The marking screen. The register was taken when the delivery was recorded
// (everyone met by default); this screen is for the exceptions, and it is
// the whole per lesson marking workload: under a minute for most classes.

export default async function DeliveryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: delivery } = await supabase
    .from('lesson_deliveries')
    .select('id, taught_at, class_id, school_classes(name, year_group), school_lessons(title, single_action_outcome)')
    .eq('id', id)
    .maybeSingle()
  if (!delivery) notFound()

  const cls = delivery.school_classes as unknown as { name: string; year_group: string }
  const lesson = delivery.school_lessons as unknown as { title: string; single_action_outcome: string }

  const [{ data: pupils }, { data: judgements }] = await Promise.all([
    supabase.from('pupils').select('id, display_name').eq('class_id', delivery.class_id).order('display_name'),
    supabase.from('teacher_judgements').select('pupil_id, level').eq('delivery_id', id),
  ])

  const levelByPupil = new Map((judgements ?? []).map(j => [j.pupil_id, j.level]))
  const rows = (pupils ?? []).map(p => ({
    pupilId: p.id,
    name: p.display_name,
    level: (levelByPupil.get(p.id) ?? 'met') as 'working_towards' | 'met' | 'exceeded',
  }))

  const metCount = rows.filter(r => r.level === 'met').length
  const wtCount = rows.filter(r => r.level === 'working_towards').length
  const exCount = rows.filter(r => r.level === 'exceeded').length

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '28px 20px 90px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Link href={`/educator/classes/${delivery.class_id}`} style={{ ...eyebrow, textDecoration: 'none' }}>
          ← {cls?.name} · {cls?.year_group}
        </Link>

        {/* Gradient header with the outcome and the judgement tallies */}
        <div style={{ ...panel, marginTop: '14px', marginBottom: '18px', background: 'linear-gradient(135deg, var(--deep-teal, #173C46) 0%, #12313a 100%)', border: 'none', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,201,76,0.22) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ ...eyebrow, color: 'rgba(255,255,255,0.6)' }}>
              Marking · taught {new Date(delivery.taught_at).toLocaleDateString('en-GB')}
            </div>
            <h1 style={{ ...h1, color: '#fff', margin: '8px 0 6px' }}>{lesson?.title}</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, marginBottom: '14px', maxWidth: '460px' }}>
              {lesson?.single_action_outcome}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { n: wtCount, label: 'working towards' },
                { n: metCount, label: 'met' },
                { n: exCount, label: 'exceeded' },
              ].map(t => (
                <span key={t.label} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                  color: '#fff', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.24)',
                  borderRadius: '100px', padding: '5px 12px',
                }}>
                  {t.n} {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={panel}>
          <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '4px' }}>The exceptions</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
            Everyone starts at Met. Touch only the pupils who were not, and you are done.
          </p>
          <JudgementGrid deliveryId={delivery.id} rows={rows} />
        </div>
      </div>
    </main>
  )
}
