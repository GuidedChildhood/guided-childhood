import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import MarkLessonDone from '@/components/lessons/MarkLessonDone'
import LessonPlayer from '@/components/lessons/LessonPlayer'
import { parseSlides, autoSlidesFromLesson } from '@/lib/content/lesson-slides'
import { hasFullAccess } from '@/lib/access'
import { isParentLessonFree } from '@/lib/content/lesson-access'

const STAGE_LABEL: Record<string, { label: string; bg: string }> = {
  foundation:  { label: 'Foundation · Ages 4 to 7',        bg: 'var(--stage-1)' },
  builder:     { label: 'Builder · Ages 8 to 10',          bg: 'var(--stage-2)' },
  explorer:    { label: 'Explorer · Ages 11 to 13',        bg: 'var(--stage-3)' },
  shaper:      { label: 'Shaper · Ages 13 to 15',          bg: 'var(--stage-4)' },
  independent: { label: 'Independent · Ages 16 and above', bg: 'var(--stage-5)' },
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

export default async function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('lessons')
    .select('id, stage_id, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, slides')
    .eq('id', id)
    .maybeSingle()

  const lesson = data as Lesson | null
  if (!lesson) notFound()

  const stageForEyebrow = STAGE_LABEL[lesson.stage_id] ?? STAGE_LABEL.foundation
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
  const locked = !hasFullAccess(accessProfile) && !completion
    && !(await isParentLessonFree(supabase, lesson.stage_id, lesson.id))

  if (locked) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 20px 48px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Link href="/dashboard/lessons" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            ← All lessons
          </Link>
        </div>
        <div style={{ background: 'var(--deep-teal)', borderRadius: '20px', padding: '32px 26px', textAlign: 'center' }}>
          <div style={{ fontSize: 34, marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 10 }}>
            {stage.label}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: '#fff', letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.2 }}>
            {lesson.title}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: 380, margin: '0 auto 22px' }}>
            One lesson in every stage is free, and you have opened it. The rest of the lessons, all the scripts and the full pathway are part of membership. The founder rate is still open at £7.99 a month for life.
          </p>
          <Link href="/dashboard/upgrade" style={{ display: 'inline-flex', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '14px', padding: '13px 24px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
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
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/dashboard/lessons"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
          >
            ← All lessons
          </Link>
        </div>
        <LessonPlayer
          lessonId={lesson.id}
          lessonSource="lesson"
          slides={slides}
          backHref="/dashboard/lessons"
          digiPrompt={lesson.digi_prompt}
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 48px' }}>

      {/* Back */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/dashboard/lessons"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
        >
          ← All lessons
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
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
              fontSize: '16px', fontWeight: 800, flexShrink: 0, fontFamily: 'var(--font-display)',
            }}>
              {section.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
                {section.label}
              </div>
              <p style={{
                fontSize: '15px', color: 'var(--ink)', lineHeight: 1.65,
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
            DiGi
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5 }}>
            Want to take this further? Ask DiGi.
          </p>
        </div>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(lesson.digi_prompt)}`}
          className="btn btn-gold"
          style={{ flexShrink: 0, padding: '11px 20px', fontSize: '12px' }}
        >
          Ask DiGi about this
        </Link>
      </div>

      {/* Back to all */}
      <Link
        href="/dashboard/lessons"
        style={{ display: 'flex', padding: '14px 18px', background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '12px', textDecoration: 'none', flexDirection: 'column', gap: '4px', textAlign: 'center' }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>Lessons</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--terracotta)' }}>Back to all lessons</span>
      </Link>
    </div>
  )
}
