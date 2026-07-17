import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { getParentLessonByCode, getCompletionsForChild, FIRST_COMPLETION_STARS, REDO_STARS } from '@/lib/lessons/parent-lessons'
import { getStageFromAgeBand, STAGES, type AgeBand } from '@/lib/content/stages'
import ParentLessonPlayer from '@/components/lessons/ParentLessonPlayer'

// A watch together adventure, opened from the child's own quest link:
// no account, no login, snuggle up with the grown up. The token scopes
// everything, and the age gate holds here too: a child can only open
// lessons at or below their own stage.

export const dynamic = 'force-dynamic'

export default async function KidAdventurePage({ params }: { params: Promise<{ token: string; code: string }> }) {
  const { token, code } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()
  if (!/^\d{1,2}\.\d{1,2}$/.test(code)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const [{ data: child }, lessonData] = await Promise.all([
    supabase.from('children').select('name, age_band').eq('id', link.child_id).maybeSingle(),
    getParentLessonByCode(supabase, code),
  ])
  if (!lessonData) notFound()
  const { lesson, segments, cards } = lessonData

  // The age gate: visibility forward only. Current stage and below opens,
  // anything above stays out of reach even by URL.
  const childStageId = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 1
  if (lesson.stage_id > childStageId) notFound()

  const completions = await getCompletionsForChild(supabase, link.child_id)
  const completion = completions.get(lesson.lesson_code)
  const isRedo = (completion?.times_completed ?? 0) > 0
  const stageName = STAGES.find(s => s.id === lesson.stage_id)?.name ?? `Stage ${lesson.stage_id}`

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '20px 14px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '10px' }}>
          <Link href={`/k/${token}`} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            color: 'var(--ink-soft)', textDecoration: 'none',
          }}>
            ← My quests
          </Link>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '13px',
            color: 'var(--ink)', background: 'var(--gold, #F2C94C)', borderRadius: '100px',
            padding: '6px 14px', boxShadow: '0 3px 0 rgba(0,0,0,0.2)',
          }}>
            Worth ⭐ {isRedo ? REDO_STARS : FIRST_COMPLETION_STARS}
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
            Watch together with your grown up
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 6vw, 1.7rem)', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
            {lesson.title}
          </h1>
        </div>

        <div style={{ background: 'var(--cream)', borderRadius: '24px', padding: 'clamp(18px, 4vw, 28px)', boxShadow: '0 6px 0 rgba(0,0,0,0.22)' }}>
          <ParentLessonPlayer
            lesson={lesson}
            segments={segments}
            cards={cards}
            stageName={stageName}
            backHref={`/k/${token}`}
            childName={child?.name ?? null}
            token={token}
            kidMode
            timesCompleted={completion?.times_completed ?? 0}
          />
        </div>
      </div>
    </div>
  )
}
