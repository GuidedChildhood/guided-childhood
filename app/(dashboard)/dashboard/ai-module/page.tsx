import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AiCheckinCard, { type CheckinLesson } from './AiCheckinCard'

const AUDIENCE_META: Record<string, { label: string; bg: string }> = {
  age_7:   { label: 'Age 7',    bg: 'var(--stage-1)' },
  age_9:   { label: 'Age 9',    bg: 'var(--stage-1)' },
  age_11:  { label: 'Age 11',   bg: 'var(--stage-2)' },
  age_13:  { label: 'Age 13',   bg: 'var(--stage-3)' },
  age_16:  { label: 'Age 16',   bg: 'var(--stage-4)' },
  parent:  { label: 'Parents',  bg: 'var(--stage-5)' },
  teacher: { label: 'Teachers', bg: 'var(--terracotta-lt)' },
}
const AUDIENCE_ORDER = ['age_7', 'age_9', 'age_11', 'age_13', 'age_16', 'parent', 'teacher']

type Lesson = { id: string; audience: string; category: string; title: string; key_message: string; sort_order: number }

export default async function AiModulePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: lessonsData },
    { data: profileData },
    { data: checkinData },
  ] = await Promise.all([
    supabase
      .from('ai_lessons')
      .select('id, audience, category, title, key_message, sort_order')
      .order('sort_order', { ascending: true }),
    supabase
      .from('profiles')
      .select('onboarding_answers')
      .eq('id', user.id)
      .single(),
    supabase
      .from('ai_literacy_checkins')
      .select('answers')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const lessons = (lessonsData ?? []) as Lesson[]

  const groups = AUDIENCE_ORDER
    .map(aud => ({ aud, meta: AUDIENCE_META[aud], items: lessons.filter(l => l.audience === aud) }))
    .filter(g => g.items.length > 0)

  const ageBand = (profileData?.onboarding_answers as Record<string, string> | null)?.ageBand
  const showCheckin = ageBand === '11-13' || ageBand === '13-15' || ageBand === '16+'
  const savedAnswers = (checkinData?.answers as Record<string, string>) ?? null

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Understanding AI</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>The AI Module</h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
          How AI really works, and how to use it wisely. Calm, plain explanations for every age, plus you and the classroom.
        </p>
      </div>

      {showCheckin && (
        <AiCheckinCard
          ageBand={ageBand!}
          lessons={lessons as CheckinLesson[]}
          savedAnswers={savedAnswers}
        />
      )}

      {groups.length === 0 && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', color: 'var(--ink-muted)', fontSize: '14px' }}>
          The AI lessons are being prepared. Check back soon.
        </div>
      )}

      {groups.map(group => (
        <section key={group.aud} style={{ marginBottom: '28px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--ink)', background: group.meta.bg,
              padding: '4px 10px', borderRadius: '100px',
            }}>
              {group.meta.label}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {group.items.map(lesson => (
              <Link
                key={lesson.id}
                href={`/dashboard/ai-module/${lesson.id}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                  textDecoration: 'none',
                  background: 'var(--cream)', border: '1px solid var(--border)',
                  borderRadius: '14px', padding: '14px 16px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: '3px' }}>
                    {lesson.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lesson.key_message}
                  </div>
                </div>
                <span style={{ fontSize: '16px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
