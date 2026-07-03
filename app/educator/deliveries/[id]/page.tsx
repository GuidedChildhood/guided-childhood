import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import JudgementGrid from './JudgementGrid'

// The marking screen. The register was taken when the delivery was recorded
// (everyone met by default); this screen is for the exceptions, and it is
// the whole per lesson marking workload: under a minute for most classes.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

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

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <Link href={`/educator/classes/${delivery.class_id}`} style={{ ...eyebrow, textDecoration: 'none' }}>
          ← {cls?.name} · {cls?.year_group}
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem, 4.5vw, 1.8rem)', color: 'var(--ink)', margin: '10px 0 4px' }}>
          {lesson?.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '6px' }}>
          {lesson?.single_action_outcome}
        </p>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '24px' }}>
          Taught {new Date(delivery.taught_at).toLocaleDateString('en-GB')} · register recorded · everyone starts at Met, touch only the exceptions
        </div>
        <JudgementGrid deliveryId={delivery.id} rows={rows} />
      </div>
    </main>
  )
}
