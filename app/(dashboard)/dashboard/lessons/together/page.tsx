import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getParentLessons, getCompletionsForChild, durationLabel, type ParentLesson, type ParentLessonSegment } from '@/lib/lessons/parent-lessons'
import { STAGES, getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import SendToChildButton from '@/components/lessons/SendToChildButton'

// Watch together lessons: the front page for the co view videos parent and
// child watch on the sofa, with the pause and talk beats built in. Parents
// see every lesson at every stage, ungated: the age gate lives on the
// child's link, where it belongs. Each lesson is a poster card with two
// clear moves: watch it together here, or send it to the child's own
// device. Completion state here is the primary child's.

export const metadata = { title: 'Watch together lessons — Guided Childhood' }

export default async function WatchTogetherPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('id, name, age_band')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  const [{ lessons, segmentsByLesson }, completions] = await Promise.all([
    getParentLessons(supabase),
    child ? getCompletionsForChild(supabase, child.id) : Promise.resolve(new Map()),
  ])

  const doneCount = lessons.filter(l => completions.has(l.lesson_code)).length

  const childStageId = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : null

  // The front page leads with the child's current stage, then anything
  // still ahead, and folds the early stages under one Earlier lessons
  // heading for late joiners catching up. With no child yet, we simply
  // group by stage in order.
  type Section = { key: string; stage: (typeof STAGES)[number] | null; heading: string; items: ParentLesson[] }
  const sections: Section[] = []

  if (childStageId) {
    const current = STAGES.find(s => s.id === childStageId)
    const currentItems = lessons.filter(l => l.stage_id === childStageId)
    if (current && currentItems.length > 0) {
      sections.push({ key: `stage-${current.id}`, stage: current, heading: `Stage ${current.id}: ${current.name}`, items: currentItems })
    }
    for (const stage of STAGES.filter(s => s.id > childStageId)) {
      const items = lessons.filter(l => l.stage_id === stage.id)
      if (items.length > 0) sections.push({ key: `stage-${stage.id}`, stage, heading: `Stage ${stage.id}: ${stage.name}`, items })
    }
    const earlier = lessons.filter(l => l.stage_id < childStageId)
    if (earlier.length > 0) {
      sections.push({ key: 'earlier', stage: null, heading: 'Earlier lessons', items: earlier })
    }
  } else {
    for (const stage of STAGES) {
      const items = lessons.filter(l => l.stage_id === stage.id)
      if (items.length > 0) sections.push({ key: `stage-${stage.id}`, stage, heading: `Stage ${stage.id}: ${stage.name}`, items })
    }
  }

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

      {sections.length === 0 && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', color: 'var(--ink-muted)', fontSize: '14px' }}>
          The first lessons are being prepared. Check back soon.
        </div>
      )}

      {sections.map(({ key, stage, heading, items }) => (
        <section key={key} style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--ink)', background: stage ? `var(--stage-${stage.id})` : 'var(--border)',
              padding: '4px 10px', borderRadius: '100px',
            }}>
              {heading}
            </span>
            {stage && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {stage.ages}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {items.map(lesson => (
              <LessonCard
                key={lesson.lesson_code}
                lesson={lesson}
                segments={segmentsByLesson.get(lesson.id)}
                done={completions.has(lesson.lesson_code)}
                timesCompleted={completions.get(lesson.lesson_code)?.times_completed ?? 0}
                childId={child?.id ?? null}
                childName={child?.name ?? null}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function LessonCard({
  lesson,
  segments,
  done,
  timesCompleted,
  childId,
  childName,
}: {
  lesson: ParentLesson
  segments: ParentLessonSegment[] | undefined
  done: boolean
  timesCompleted: number
  childId: string | null
  childName: string | null
}) {
  const duration = durationLabel(segments)
  const watchHref = `/dashboard/lessons/together/${lesson.lesson_code}`

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      background: 'var(--cream)', border: '1px solid var(--border)',
      borderRadius: '16px', overflow: 'hidden',
    }}>
      <Link href={watchHref} aria-label={`Watch ${lesson.title} together`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', background: 'var(--stage-3)' }}>
          {lesson.poster_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lesson.poster_url}
              alt={`${lesson.title} poster`}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px', display: 'block' }}
            />
          )}
        </div>
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--terracotta)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Lesson {lesson.journey_step}
          </span>
          {duration && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {duration}
            </span>
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Stage {lesson.stage_id}
          </span>
          {done && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.08em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '2px 8px' }}>
              ✓ Completed{timesCompleted > 1 ? ` ×${timesCompleted}` : ''}
            </span>
          )}
        </div>

        <Link href={watchHref} style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)' }}>
            {lesson.title}
          </div>
        </Link>

        <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
          &ldquo;{lesson.catchphrase}&rdquo;
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <Link
            href={watchHref}
            className="btn btn-gold"
            style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}
          >
            {done ? 'Watch again ↻' : 'Watch together'}
          </Link>
          <SendToChildButton lessonCode={lesson.lesson_code} childId={childId} childName={childName} />
        </div>
      </div>
    </div>
  )
}
