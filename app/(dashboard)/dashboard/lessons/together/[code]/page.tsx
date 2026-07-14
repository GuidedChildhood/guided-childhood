import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getParentLessonByCode, getCompletionsForChild } from '@/lib/lessons/parent-lessons'
import { STAGES } from '@/lib/content/stages'
import ParentLessonPlayer from '@/components/lessons/ParentLessonPlayer'

// One watch together lesson, played from the parent's side of the sofa.
// The completion writes against the primary child, so the tick, the
// stars and any stage passport land exactly as if the child had played
// it from their own link.

export default async function WatchTogetherLessonPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  if (!/^\d{1,2}\.\d{1,2}$/.test(code)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: child }, lessonData] = await Promise.all([
    supabase
      .from('children')
      .select('id, name')
      .eq('parent_id', user.id)
      .eq('is_primary', true)
      .maybeSingle(),
    getParentLessonByCode(supabase, code),
  ])
  if (!lessonData) notFound()
  const { lesson, segments, cards } = lessonData

  const completions = child ? await getCompletionsForChild(supabase, child.id) : new Map()
  const completion = completions.get(lesson.lesson_code)
  const stageName = STAGES.find(s => s.id === lesson.stage_id)?.name ?? `Stage ${lesson.stage_id}`

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px' }}>
      <Link href="/dashboard/lessons/together" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
        ← All lessons
      </Link>

      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>
          {stageName} · Lesson {lesson.journey_step} · Keyword: {lesson.keyword}
        </p>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', marginBottom: '6px' }}>{lesson.title}</h1>
        <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', fontStyle: 'italic' }}>
          &ldquo;{lesson.catchphrase}&rdquo;
        </p>
      </div>

      {/* The parent note: the misconception this lesson breaks and any
          promise the grown up must keep. Parent eyes, worth reading first. */}
      <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
          Before you press play
        </div>
        <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
          {lesson.misconception}
        </p>
        {lesson.parent_note && (
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            {lesson.parent_note}
          </p>
        )}
      </div>

      {child ? (
        <ParentLessonPlayer
          lesson={lesson}
          segments={segments}
          cards={cards}
          stageName={stageName}
          backHref="/dashboard/lessons/together"
          childName={child.name}
          childId={child.id}
          timesCompleted={completion?.times_completed ?? 0}
        />
      ) : (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', color: 'var(--ink-muted)', fontSize: '14px' }}>
          Add your child first so their stars and passport have somewhere to land.{' '}
          <Link href="/dashboard/settings" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Add them in settings</Link>
        </div>
      )}
    </div>
  )
}
