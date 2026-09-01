import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { parseSlides } from '@gc/shared/lesson-slides'
import { resolveTheme } from '@/lib/kid/theme'
import KidBackLink from '@/components/kid/KidBackLink'

// A tutor lesson, on the child's phone.
//
// Written by DiGi from the homework their grown up was looking at, read by that
// grown up, and sent. What arrives here is a row: the deck was generated days
// or minutes ago on the parent's side, and nothing on this page calls a model.
// That is the rule scripts/check-child-has-no-model.mjs exists to keep, and it
// is why the slides are stored rather than made on demand.
//
// The token is the whole auth, the same as every other page under /k. The row
// is checked against the link's own child, so a token cannot open a lesson
// written for a sibling.

export const dynamic = 'force-dynamic'

export default async function KidTutorLessonPage({ params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const { data: lesson } = await supabase
    .from('tutor_lessons')
    .select('id, child_id, title, emoji, stars, slides, sent_at, done_at, cleared_at')
    .eq('id', id)
    .maybeSingle()
  if (!lesson || lesson.child_id !== link.child_id) notFound()
  // Unsent is not "not yet", it is a lesson a grown up has not agreed to. A
  // child guessing an id must not be able to open one, so it is a 404 rather
  // than a friendly wait screen.
  if (!lesson.sent_at || lesson.cleared_at) notFound()

  const { data: child } = await supabase
    .from('children').select('name, accent').eq('id', link.child_id).maybeSingle()
  const theme = resolveTheme(child?.accent as string | null)

  const rawSlides = parseSlides(lesson.slides)
  if (!rawSlides) notFound()
  // The teacher script channel never reaches a kid client. Nothing generated
  // here carries one, and this stays anyway: the day something does, this page
  // is already right rather than newly wrong.
  const slides = rawSlides.map(s => {
    const copy = { ...s }
    delete (copy as { script?: string }).script
    return copy
  })

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, padding: '20px 14px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '10px' }}>
          <KidBackLink href={`/k/${token}`} color={theme.inkSoft} fontSize="var(--text-sm)" />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)',
            color: 'var(--ink)', background: 'var(--gold, #F2C94C)', borderRadius: '100px',
            padding: '6px 14px', boxShadow: '0 3px 0 rgba(0,0,0,0.2)',
          }}>
            Worth ⭐ {lesson.stars}
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.inkMuted, margin: '0 0 6px' }}>
            A lesson just for {child?.name ?? 'you'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 6vw, 1.7rem)', color: theme.ink, letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
            {lesson.emoji ?? '📘'} {lesson.title}
          </h1>
        </div>

        <div style={{ background: 'var(--cream)', borderRadius: '24px', padding: 'clamp(18px, 4vw, 28px)', boxShadow: '0 6px 0 rgba(0,0,0,0.22)' }}>
          <LessonPlayer
            lessonId={lesson.id}
            lessonSource="lesson"
            slides={slides}
            backHref={`/k/${token}`}
            homeHref={`/k/${token}`}
            kidMode
            kidStars={lesson.stars}
            completeEndpoint="/api/kid/tutor-complete"
            completeBody={{ token, lesson_id: lesson.id }}
          />
        </div>
      </div>
    </div>
  )
}
