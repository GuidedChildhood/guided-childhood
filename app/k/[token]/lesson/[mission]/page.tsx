import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { isTogether, TOGETHER_COOKIE } from '@/lib/lessons/together'
import { createAdminClient } from '@/lib/supabase/admin'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { parseSlides, visibleSlides } from '@gc/shared/lesson-slides'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { resolveTheme } from '@/lib/kid/theme'
import KidBackLink from '@/components/kid/KidBackLink'
import { isTogetherStage, stageForKeyStage, schoolModulesForStage } from '@/lib/lessons/school-path'
import { listStarLessons } from '@/lib/quests/star-lesson-catalogue'
import { characterKeyFor, registerFor } from '@gc/shared/friend-register'
import { FLAGGED_MODULES } from '@gc/shared/schools-curriculum'
import type { LessonTool } from '@gc/shared/lesson-slides'

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
    .select('id, lesson_id, stars, status, child_id, paid_at')
    .eq('id', missionId)
    .maybeSingle()
  if (!mission || mission.child_id !== link.child_id) notFound()

  const [{ data: child }, lesson] = await Promise.all([
    supabase.from('children').select('name, accent').eq('id', link.child_id).maybeSingle(),
    getStarLesson(supabase, mission.lesson_id, 'id, module_id, title, character_cast, slides, key_stage, teacher_notes'),
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
    tool?: LessonTool
  }
  const { slides } = visibleSlides(rawSlides, audience, {
    worksheet: { verdict_options: notes.worksheet?.verdict_options, items: notes.worksheet_items },
  })

  // THE SAME LESSON AS THE CLASS MEETS (sync plan A7). The host friend, how
  // it moves and the lesson's tool all come off the row, as the teach route
  // reads them, so the child meets Bloop where the class met Bloop, a calm
  // DiGi on the KS4 safeguarding decks, and the three checks strip. The first
  // line counts the child's own road, never the wall's key stage count, so
  // the two cannot disagree one tap apart.
  const row = lesson as { module_id?: string | null; character_cast?: string | null }
  const stageOfLesson = stageForKeyStage(keyStage)
  const roadModules = stageOfLesson ? schoolModulesForStage(await listStarLessons(supabase), stageOfLesson) : []
  const place = roadModules.findIndex(m => m.id === lesson.id)
  const introEyebrow = place >= 0 ? `Lesson ${place + 1} of ${roadModules.length}` : undefined
  // A DSL flagged module played alone carries the child's tell page on every
  // slide and the people to tell on the finish (sync plan A6).
  const flagged = !!row.module_id && FLAGGED_MODULES.some(m => m.moduleId === row.module_id)
  // The pill lives in the player's own top bar: the page around a full screen
  // player is never seen. It reads what was paid, not the status (plan v10,
  // 1.5): stars pay on the first finish, pass or not, so a retake after a
  // fail must not promise stars already banked.
  const paid = !!mission.paid_at || mission.status === 'done'
  const kidBadge = mission.status === 'done' ? 'Done ✓ play again'
    : paid ? `⭐ ${mission.stars} already in your bank`
    : `Worth ⭐ ${mission.stars}`
  // A retake a grown up opened from their own app (lib/lessons/together).
  const together = isTogether((await cookies()).get(TOGETHER_COOKIE)?.value, link.child_id, mission.lesson_id)

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, padding: '20px 14px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '10px' }}>
          <KidBackLink href={`/k/${token}/lessons`} color={theme.inkSoft} fontSize="var(--text-sm)" />
          {/* The pill moved into the player's top bar (kidBadge): this header
              sits under the full screen player and is never seen. */}
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
            kidBadge={kidBadge}
            tellHref={flagged ? `/k/${token}/tell` : undefined}
            character={characterKeyFor(row.character_cast)}
            register={registerFor(keyStage)}
            tool={notes.tool}
            introEyebrow={introEyebrow}
            // A number only when this finish pays, which is the first one.
            kidStars={paid ? undefined : mission.stars}
            together={together}
            completeEndpoint="/api/quests/lesson-complete"
            completeBody={{ token, mission_id: mission.id }}
          />
        </div>
      </div>
    </div>
  )
}
