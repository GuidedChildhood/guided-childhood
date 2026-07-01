import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import MarkLessonDone from '@/components/lessons/MarkLessonDone'

const AUDIENCE_LABEL: Record<string, { label: string; bg: string }> = {
  age_7:   { label: 'Age 7',    bg: 'var(--stage-1)' },
  age_9:   { label: 'Age 9',    bg: 'var(--stage-1)' },
  age_11:  { label: 'Age 11',   bg: 'var(--stage-2)' },
  age_13:  { label: 'Age 13',   bg: 'var(--stage-3)' },
  age_16:  { label: 'Age 16',   bg: 'var(--stage-4)' },
  parent:  { label: 'Parents',  bg: 'var(--stage-5)' },
  teacher: { label: 'Teachers', bg: 'var(--terracotta-lt)' },
}

// The four parts of every lesson, styled like the script steps so the AI module
// reads as a sibling of the scripts, not a different product.
const SECTIONS = [
  { num: 1, key: 'the_idea',       label: 'The idea',       bg: 'var(--stage-2)' },
  { num: 2, key: 'why_it_matters', label: 'Why it matters', bg: 'var(--stage-3)' },
  { num: 3, key: 'try_this',       label: 'Try this',       bg: 'var(--stage-1)' },
  { num: 4, key: 'key_message',    label: 'Remember',       bg: 'var(--stage-5)' },
] as const

type Lesson = {
  id: string
  audience: string
  category: string
  title: string
  the_idea: string
  why_it_matters: string
  try_this: string
  key_message: string
  digi_prompt: string
}

export default async function AiLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('ai_lessons')
    .select('id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt')
    .eq('id', id)
    .maybeSingle()

  const lesson = data as Lesson | null
  if (!lesson) notFound()

  const { data: completion } = await supabase
    .from('lesson_completions')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson.id)
    .eq('lesson_source', 'ai_lesson')
    .maybeSingle()

  const audience = AUDIENCE_LABEL[lesson.audience] ?? { label: lesson.audience, bg: 'var(--stage-2)' }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 48px' }}>

      {/* Back */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/dashboard/ai-module"
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
            color: 'var(--ink)', background: audience.bg,
            padding: '4px 10px', borderRadius: '100px',
          }}>
            {audience.label}
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
              background: 'var(--terracotta)', color: '#fff',
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

      <MarkLessonDone lessonId={lesson.id} lessonSource="ai_lesson" initialDone={!!completion} />

      {/* DiGi CTA */}
      <div style={{ background: 'var(--stage-5)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
            DiGi
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
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
        href="/dashboard/ai-module"
        style={{ display: 'flex', padding: '14px 18px', background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '12px', textDecoration: 'none', flexDirection: 'column', gap: '4px', textAlign: 'center' }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>The AI module</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--terracotta)' }}>Back to all lessons</span>
      </Link>
    </div>
  )
}
