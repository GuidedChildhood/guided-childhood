import { createClient } from '@/lib/supabase/server'
import { getChildren } from '@/lib/children/server'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import LessonSendButton from '../together/LessonSendButton'
import MarkLessonDone from '@/components/lessons/MarkLessonDone'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { parseSlides, autoSlidesFromLesson } from '@gc/shared/lesson-slides'
import { badgesFor } from '@gc/shared/curriculum-badges'
import { hasFullAccess } from '@/lib/access'
import { isParentLessonFree } from '@/lib/content/lesson-access'

const STAGE_LABEL: Record<string, { label: string; bg: string }> = {
  foundation:  { label: 'Foundation · Ages 4 to 7',        bg: 'var(--stage-1)' },
  builder:     { label: 'Builder · Ages 8 to 10',          bg: 'var(--stage-2)' },
  explorer:    { label: 'Explorer · Ages 11 to 13',        bg: 'var(--stage-3)' },
  shaper:      { label: 'Shaper · Ages 13 to 15',          bg: 'var(--stage-4)' },
  independent: { label: 'Independent · Ages 16 and above', bg: 'var(--stage-5)' },
}

// Stage slug to number, so "back" returns to the lessons for this lesson's own
// stage, the set the parent was on, not the full All ages shelf.
const STAGE_NUM: Record<string, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}

const SECTIONS = [
  { num: 1, key: 'the_idea',       label: 'The idea',       bg: 'var(--stage-2)' },
  { num: 2, key: 'why_it_matters', label: 'Why it matters', bg: 'var(--stage-3)' },
  { num: 3, key: 'try_this',       label: 'Try this',       bg: 'var(--stage-1)' },
  { num: 4, key: 'key_message',    label: 'Remember',       bg: 'var(--stage-5)' },
] as const

type Lesson = {
  id: string
  stage_id: string
  category: string
  title: string
  the_idea: string
  why_it_matters: string
  try_this: string
  key_message: string
  digi_prompt: string
  slides: unknown
}

export default async function LessonDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ child?: string }>
}) {
  const { id } = await params
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data }, { child }] = await Promise.all([
    supabase
      .from('lessons')
      .select('id, stage_id, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, slides')
      .eq('id', id)
      .maybeSingle(),
    // Which child this lesson is being looked at FOR, so the send button
    // below pings the right phone and the back link keeps the toggle.
    getChildren<{ id: string; name: string | null; age_band: string | null; is_primary: boolean | null }>(
      supabase, user.id, childParam, 'id, name, age_band'),
  ])

  const lesson = data as Lesson | null
  if (!lesson) notFound()

  const stageForEyebrow = STAGE_LABEL[lesson.stage_id] ?? STAGE_LABEL.foundation
  const childQS = childParam && child ? `&child=${child.id}` : ''
  // Back returns to this lesson's own stage, so the parent lands on the set
  // they were working through, not the whole All ages shelf.
  const lessonsBackHref = `/dashboard/lessons?stage=${STAGE_NUM[lesson.stage_id] ?? 2}${childQS}`
  // The child can only be told about a lesson their own list will show them:
  // their stage or earlier, with an authored deck. The kid app's list and its
  // age gate enforce exactly this, so a ping must never point at a lesson
  // that would 404 on their side.
  const childStageNum = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 2
  const childName = child?.name && child.name !== 'Your child' ? child.name : 'your child'
  const sendable = !!child && !!parseSlides(lesson.slides) && (STAGE_NUM[lesson.stage_id] ?? 99) <= childStageNum
  // Authored deck wins; otherwise build one from the lesson's own four parts
  // so every parent lesson plays as slides, never a flat wall of text.
  const slides = parseSlides(lesson.slides) ?? autoSlidesFromLesson(lesson, { eyebrow: stageForEyebrow.label })

  const { data: completion } = await supabase
    .from('lesson_completions')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)
    .eq('lesson_source', 'lesson')
    .maybeSingle()

  const stage = STAGE_LABEL[lesson.stage_id] ?? STAGE_LABEL.foundation

  // Free tier: one lesson per stage is free, the rest unlock with membership
  // (everything is open during the 7 day trial). A lesson already opened stays
  // open. Everything else in this stage sits behind the paywall.
  const { data: accessProfile } = await supabase
    .from('profiles').select('subscription_status, trial_ends_at').eq('id', user.id).maybeSingle()
  const locked = !hasFullAccess(accessProfile, user.email) && !completion
    && !(await isParentLessonFree(supabase, lesson.stage_id, lesson.id))

  if (locked) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 20px 48px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link href={lessonsBackHref} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            ← Lessons
          </Link>
        </div>
        <div style={{ background: 'var(--deep-teal)', borderRadius: '20px', padding: '32px 26px', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 10 }}>
            {stage.label}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: '#fff', letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.2 }}>
            {lesson.title}
          </h1>
          <p style={{ fontSize: 'var(--text-md)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 22px' }}>
            One lesson in every stage is free, and you have opened it. The rest of the lessons, all the scripts and the full pathway are part of membership. The founder rate is still open at £7.99 a month for life.
          </p>
          <Link href="/dashboard/upgrade" style={{ display: 'inline-flex', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '14px', padding: '13px 24px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
            Unlock every lesson
          </Link>
        </div>
      </div>
    )
  }

  // Slide lessons render in the interactive player. The four section text
  // layout below stays as the fallback for lessons without slides yet.
  if (slides) {
    return (
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px 20px 48px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            href={lessonsBackHref}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
          >
            ← Lessons
          </Link>
          {/* Justin, 1 September 2026: "we can send to relevant childs app
              from here if needed to let child know that lesson." Only when
              this child's own list will actually show it: their stage or
              earlier, with an authored deck. */}
          {sendable && (
            <LessonSendButton
              childId={child?.id ?? null}
              childName={childName}
              title={lesson.title}
              message={`New lesson for you: ${lesson.title}. It is on your lessons page ⭐`}
            />
          )}
        </div>
        <LessonPlayer
          lessonId={lesson.id}
          lessonSource="lesson"
          slides={slides}
          backHref={lessonsBackHref}
          digiPrompt={lesson.digi_prompt}
          badges={badgesFor(lesson.stage_id, lesson.category)}
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 48px' }}>

      {/* Back */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href={lessonsBackHref}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
        >
          ← Lessons
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--ink)', background: stage.bg,
            padding: '4px 10px', borderRadius: '100px',
          }}>
            {stage.label}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {lesson.title}
        </h1>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
        {SECTIONS.map(section => (
          <div
            key={section.num}
            style={{ background: section.bg, border: `1.5px solid ${section.bg}`, borderRadius: '16px', padding: '22px', display: 'flex', gap: '18px' }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--terracotta)', color: 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--text-lg)', fontWeight: 800, flexShrink: 0, fontFamily: 'var(--font-display)',
            }}>
              {section.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
                {section.label}
              </div>
              <p style={{
                fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.65,
                ...(section.key === 'key_message' ? { fontWeight: 600 } : {}),
              }}>
                {lesson[section.key]}
              </p>
            </div>
          </div>
        ))}
      </div>

      <MarkLessonDone lessonId={lesson.id} lessonSource="lesson" initialDone={!!completion} />

      {/* DiGi CTA */}
      <div style={{ background: 'var(--stage-5)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
            DiGi
          </div>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5 }}>
            Want to take this further? Ask DiGi.
          </p>
        </div>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(lesson.digi_prompt)}${childQS}`}
          className="btn btn-gold"
          style={{ flexShrink: 0, padding: '11px 20px', fontSize: 'var(--text-base)' }}
        >
          Ask DiGi about this
        </Link>
      </div>

      {/* Back to all */}
      <Link
        href={lessonsBackHref}
        style={{ display: 'flex', padding: '14px 18px', background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '12px', textDecoration: 'none', flexDirection: 'column', gap: '4px', textAlign: 'center' }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>Lessons</span>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--terracotta)' }}>Back to lessons</span>
      </Link>
    </div>
  )
}
