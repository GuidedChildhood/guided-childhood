import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getParentLessons, getCompletionsForChild, durationLabel } from '@/lib/lessons/parent-lessons'
import { STAGES } from '@/lib/content/stages'
import LessonSendButton from './LessonSendButton'

// A stage tinted thumbnail with the lesson keyword and a play mark, so the
// grid reads like a shelf of little films without needing an image asset
// per lesson. One emoji per strand keeps them warm and distinct.
const STRAND_EMOJI: Record<string, string> = {
  screens: '📱', screen: '📱', bodies: '🧠', feelings: '💛', wellbeing: '💛',
  kindness: '🤝', privacy: '🛡️', gaming: '🎮', misinformation: '🔍',
  algorithms: '🎯', money: '💷', identity: '✨', default: '🎬',
}
function strandEmoji(strand: string): string {
  const k = (strand || '').toLowerCase()
  for (const key of Object.keys(STRAND_EMOJI)) if (k.includes(key)) return STRAND_EMOJI[key]
  return STRAND_EMOJI.default
}

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
        <Link href="/dashboard/lessons" style={{ display: 'inline-block', marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--terracotta)', letterSpacing: '0.04em', textDecoration: 'none' }}>
          Looking for the interactive lesson library? →
        </Link>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '14px' }}>
            {items.map(lesson => {
              const completion = completions.get(lesson.lesson_code)
              const done = Boolean(completion)
              const duration = durationLabel(segmentsByLesson.get(lesson.id))
              return (
                <div
                  key={lesson.lesson_code}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    background: '#fff', border: '1.5px solid var(--border)',
                    borderRadius: '18px', overflow: 'hidden',
                    boxShadow: '0 4px 18px rgba(26,26,46,0.06)',
                  }}
                >
                  {/* Thumbnail: a stage tinted tile with the strand emoji and
                      a play mark, the shelf of little films look */}
                  <Link
                    href={`/dashboard/lessons/together/${lesson.lesson_code}`}
                    style={{
                      position: 'relative', display: 'block', textDecoration: 'none',
                      aspectRatio: '16 / 10', overflow: 'hidden',
                      background: `linear-gradient(150deg, var(--stage-${stage.id}-bold) 0%, var(--stage-${stage.id}) 100%)`,
                    }}
                  >
                    {/* The real poster, a frame from the finished video. Falls
                        back to the stage tint and strand emoji when absent. */}
                    {lesson.poster_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={lesson.poster_url}
                        alt=""
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    {!lesson.poster_url && (
                      <span style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '26px', lineHeight: 1 }}>{strandEmoji(lesson.strand)}</span>
                    )}
                    {done && (
                      <span style={{ position: 'absolute', top: '10px', right: '10px', fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '2px 8px' }}>
                        ✓ Done{completion && completion.times_completed > 1 ? ` ×${completion.times_completed}` : ''}
                      </span>
                    )}
                    {/* Play mark */}
                    <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize: '16px', color: 'var(--ink)', marginLeft: '3px' }}>▶</span>
                    </span>
                    <span style={{ position: 'absolute', bottom: '10px', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.75)', borderRadius: '100px', padding: '2px 8px' }}>
                      Lesson {lesson.journey_step}{duration ? ` · ${duration}` : ''}
                    </span>
                  </Link>

                  <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '4px' }}>
                        {lesson.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
                        &ldquo;{lesson.catchphrase}&rdquo;
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Link
                        href={`/dashboard/lessons/together/${lesson.lesson_code}`}
                        style={{
                          flex: 1, textAlign: 'center', textDecoration: 'none',
                          background: 'var(--terracotta)', color: 'var(--ink)',
                          borderRadius: '11px', padding: '9px 10px',
                          fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800,
                          boxShadow: '0 3px 0 var(--terracotta-dark)', whiteSpace: 'nowrap',
                        }}
                      >
                        {done ? 'Watch again ↻' : '▶ Watch together'}
                      </Link>
                      <LessonSendButton childId={child?.id ?? null} childName={child?.name ?? 'your child'} title={lesson.title} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
