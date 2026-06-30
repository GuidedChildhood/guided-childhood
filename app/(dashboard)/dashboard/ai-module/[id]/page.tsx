import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const AUDIENCE_LABEL: Record<string, string> = {
  age_7: 'Age 7', age_9: 'Age 9', age_11: 'Age 11', age_13: 'Age 13',
  age_16: 'Age 16', parent: 'Parents', teacher: 'Teachers',
}

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

  if (!lesson) {
    return (
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px 20px' }}>
        <Link href="/dashboard/ai-module" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none' }}>
          Back to the AI module
        </Link>
        <p style={{ marginTop: '20px', color: 'var(--ink-muted)' }}>That lesson could not be found.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '24px 20px' }}>
      <Link href="/dashboard/ai-module" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none' }}>
        Back to the AI module
      </Link>

      <div style={{ margin: '16px 0 8px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--lav-deep)', background: 'var(--lav)', padding: '4px 10px', borderRadius: '100px',
        }}>
          {AUDIENCE_LABEL[lesson.audience] ?? lesson.audience}
        </span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', marginBottom: '20px' }}>{lesson.title}</h1>

      <Section eyebrow="The idea">
        <p style={{ fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{lesson.the_idea}</p>
      </Section>

      <Section eyebrow="Why it matters">
        <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{lesson.why_it_matters}</p>
      </Section>

      <div style={{ background: 'var(--green-lt)', border: '1px solid var(--green)', borderRadius: '16px', padding: '20px 22px', marginBottom: '14px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-dark)', marginBottom: '10px' }}>
          Try this
        </p>
        <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.6 }}>{lesson.try_this}</p>
      </div>

      <div style={{ background: 'var(--gold-lt)', border: '1px solid var(--gold)', borderRadius: '16px', padding: '18px 22px', marginBottom: '20px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '8px' }}>
          Remember
        </p>
        <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5 }}>{lesson.key_message}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(lesson.digi_prompt)}`}
          className="btn btn-gold"
          style={{ padding: '11px 22px', fontSize: '12px' }}
        >
          Ask DiGi about this
        </Link>
        <Link href="/dashboard/ai-module" className="btn btn-outline" style={{ padding: '11px 22px', fontSize: '12px' }}>
          Back to all lessons
        </Link>
      </div>
    </div>
  )
}

function Section({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: '8px' }}>
        {eyebrow}
      </p>
      {children}
    </div>
  )
}
