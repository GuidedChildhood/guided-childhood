import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import LessonPlayer from '@/components/lessons/LessonPlayer'
import { parseSlides } from '@/lib/content/lesson-slides'

// A star lesson, the kid version: opened from the child's own quest link,
// no account, no login. The same lesson the schools product teaches, in
// the kid register: big, warm, DiGi reacting, and stars at the end. The
// token scopes everything, and teacher scripts never reach this client.

export const dynamic = 'force-dynamic'

export default async function KidLessonPage({ params }: { params: Promise<{ token: string; mission: string }> }) {
  const { token, mission: missionId } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()
  if (!/^[0-9a-f-]{36}$/.test(missionId)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const { data: mission } = await supabase
    .from('kid_lesson_missions')
    .select('id, lesson_id, stars, status, child_id')
    .eq('id', missionId)
    .maybeSingle()
  if (!mission || mission.child_id !== link.child_id) notFound()

  const [{ data: child }, { data: lesson }] = await Promise.all([
    supabase.from('children').select('name').eq('id', link.child_id).maybeSingle(),
    supabase.from('school_lessons').select('id, title, character_cast, slides').eq('id', mission.lesson_id).maybeSingle(),
  ])
  if (!lesson) notFound()

  const rawSlides = parseSlides(lesson.slides)
  if (!rawSlides) notFound()
  // The kid client never receives the teacher script channel.
  const slides = rawSlides.map(s => {
    const copy = { ...s }
    delete (copy as { script?: string }).script
    return copy
  })

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--deep-teal, #173C46)', padding: '20px 14px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '10px' }}>
          <Link href={`/k/${token}`} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
          }}>
            ← My quests
          </Link>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '13px',
            color: 'var(--ink)', background: 'var(--gold, #F2C94C)', borderRadius: '100px',
            padding: '6px 14px', boxShadow: '0 3px 0 rgba(0,0,0,0.2)',
          }}>
            Worth ⭐ {mission.stars}
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', margin: '0 0 6px' }}>
            A star lesson for {child?.name ?? 'you'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 6vw, 1.7rem)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
            {lesson.title}
          </h1>
        </div>

        <div style={{ background: 'var(--cream)', borderRadius: '24px', padding: 'clamp(18px, 4vw, 28px)', boxShadow: '0 6px 0 rgba(0,0,0,0.22)' }}>
          <LessonPlayer
            lessonId={lesson.id}
            lessonSource="school_lesson"
            slides={slides}
            backHref={`/k/${token}`}
            kidMode
            kidStars={mission.stars}
            completeEndpoint="/api/quests/lesson-complete"
            completeBody={{ token, mission_id: mission.id }}
          />
        </div>
      </div>
    </div>
  )
}
