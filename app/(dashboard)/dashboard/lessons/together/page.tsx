import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getParentLessons, getCompletionsForChild, durationLabel } from '@/lib/lessons/parent-lessons'
import { STAGES } from '@/lib/content/stages'

// Watch together lessons: the co view videos for parent and child on the
// sofa, with the pause and talk beats built in. Parents see every lesson
// at every stage, ungated: the age gate lives on the child's link, where
// it belongs. Completion state here is the primary child's.

export const metadata = { title: 'Watch together lessons — Guided Childhood' }

export default async function WatchTogetherPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('id, name')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  const [{ lessons, segmentsByLesson }, completions] = await Promise.all([
    getParentLessons(supabase),
    child ? getCompletionsForChild(supabase, child.id) : Promise.resolve(new Map()),
  ])

  const doneCount = lessons.filter(l => completions.has(l.lesson_code)).length

  const byStage = STAGES
    .map(stage => ({ stage, items: lessons.filter(l => l.stage_id === stage.id) }))
    .filter(group => group.items.length > 0)

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Screens are better together</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>Watch together lessons</h1>
        <p style={{ color: 'var(--ink)', fontSize: '15px' }}>
          Short videos you watch on the sofa{child ? ` with ${child.name}` : ' with your child'}, with DiGi pausing at just the right moments for you to talk. First watch earns 10 stars, every rewatch earns 2 more.
        </p>
      </div>

      {doneCount > 0 && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px 18px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
              {doneCount} of {lessons.length} lessons complete{child ? ` for ${child.name}` : ''}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)', letterSpacing: '0.06em' }}>
              {Math.round((doneCount / Math.max(1, lessons.length)) * 100)}%
            </span>
          </div>
          <div style={{ height: '8px', borderRadius: '100px', background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ width: `${Math.round((doneCount / Math.max(1, lessons.length)) * 100)}%`, height: '100%', borderRadius: '100px', background: 'var(--terracotta)' }} />
          </div>
        </div>
      )}

      {byStage.length === 0 && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', color: 'var(--ink-muted)', fontSize: '14px' }}>
          The first lessons are being prepared. Check back soon.
        </div>
      )}

      {byStage.map(({ stage, items }) => (
        <section key={stage.id} style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--ink)', background: `var(--stage-${stage.id})`,
              padding: '4px 10px', borderRadius: '100px',
            }}>
              Stage {stage.id}: {stage.name}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {stage.ages}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map(lesson => {
              const completion = completions.get(lesson.lesson_code)
              const done = Boolean(completion)
              const duration = durationLabel(segmentsByLesson.get(lesson.id))
              return (
                <Link
                  key={lesson.lesson_code}
                  href={`/dashboard/lessons/together/${lesson.lesson_code}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                    textDecoration: 'none',
                    background: done ? '#EDF7F1' : 'var(--cream)',
                    border: done ? '1px solid #B7DEC9' : '1px solid var(--border)',
                    borderRadius: '14px', padding: '14px 16px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--terracotta)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Lesson {lesson.journey_step}{duration ? ` · ${duration}` : ''}
                      </span>
                      {done && (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.08em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '2px 8px' }}>
                          ✓ Completed{completion && completion.times_completed > 1 ? ` ×${completion.times_completed}` : ''}
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: '3px' }}>
                      {lesson.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      &ldquo;{lesson.catchphrase}&rdquo;
                    </div>
                  </div>
                  {done ? (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap' }}>
                      Watch again ↻
                    </span>
                  ) : (
                    <span style={{ fontSize: '15px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
                  )}
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
