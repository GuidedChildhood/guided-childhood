import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { parseSlides, visibleSlides } from '@gc/shared/lesson-slides'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { resolveTheme } from '@/lib/kid/theme'
import KidBackLink from '@/components/kid/KidBackLink'
import { isTogetherStage, stageForKeyStage } from '@/lib/lessons/school-path'

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

  const [{ data: child }, lesson] = await Promise.all([
    supabase.from('children').select('name, accent').eq('id', link.child_id).maybeSingle(),
    getStarLesson(supabase, mission.lesson_id, 'id, title, character_cast, slides, key_stage, teacher_notes'),
  ])
  if (!lesson) notFound()
  // The colour the child chose in Make it mine, rather than the anthracite
  // default this screen used to be pinned to.
  const theme = resolveTheme(child?.accent as string | null)

  const rawSlides = parseSlides(lesson.slides)
  if (!rawSlides) notFound()
  // The child's deck, not the classroom's (shared/lesson-slides visibleSlides,
  // plan v10 item 1.4). Under 7 it is the together deck, because at that age
  // a grown up reads it out on their phone. The worksheet the class does on
  // paper becomes the child's own sort; only its items and verdicts are read
  // here, and teacher_notes itself never reaches the client.
  const keyStage = (lesson as { key_stage?: string | null }).key_stage ?? null
  const audience = isTogetherStage(stageForKeyStage(keyStage)) ? 'together' : 'kid'
  const notes = ((lesson as { teacher_notes?: unknown }).teacher_notes ?? {}) as {
    worksheet?: { verdict_options?: unknown }
    worksheet_items?: unknown
  }
  const { slides } = visibleSlides(rawSlides, audience, {
    worksheet: { verdict_options: notes.worksheet?.verdict_options, items: notes.worksheet_items },
  })

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, padding: '20px 14px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '10px' }}>
          <KidBackLink href={`/k/${token}/lessons`} color={theme.inkSoft} fontSize="var(--text-sm)" />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)',
            color: 'var(--ink)', background: 'var(--gold, #F2C94C)', borderRadius: 'var(--radius-pill)',
            padding: '6px 14px', boxShadow: '0 3px 0 rgba(0,0,0,0.2)',
          }}>
            {/* A replay pays no stars (the row paid once), so it says so. */}
            {mission.status === 'done' ? 'Done ✓ play again' : `Worth ⭐ ${mission.stars}`}
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.inkMuted, margin: '0 0 6px' }}>
            A star lesson for {child?.name ?? 'you'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 6vw, 1.7rem)', color: theme.ink, letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
            {lesson.title}
          </h1>
        </div>

        <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-card)', padding: 'clamp(18px, 4vw, 28px)', boxShadow: '0 6px 0 rgba(0,0,0,0.22)' }}>
          <LessonPlayer
            lessonId={lesson.id}
            lessonSource="school_lesson"
            slides={slides}
            backHref={`/k/${token}`}
            kidMode
            audience={audience}
            kidStars={mission.status === 'done' ? undefined : mission.stars}
            completeEndpoint="/api/quests/lesson-complete"
            completeBody={{ token, mission_id: mission.id }}
          />
        </div>
      </div>
    </div>
  )
}
