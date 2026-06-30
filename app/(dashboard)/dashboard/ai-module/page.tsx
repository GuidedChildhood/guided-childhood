import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Audience tiers, in reading order. The AI module is educational core content,
// so it is available to every signed-in member, not gated behind membership.
const AUDIENCE_META: Record<string, { label: string; color: string; bg: string }> = {
  age_7:   { label: 'Age 7',    color: 'var(--green-dark)', bg: 'var(--green-lt)' },
  age_9:   { label: 'Age 9',    color: 'var(--green-dark)', bg: 'var(--green-lt)' },
  age_11:  { label: 'Age 11',   color: 'var(--lav-deep)',   bg: 'var(--lav)' },
  age_13:  { label: 'Age 13',   color: 'var(--coral)',      bg: 'var(--coral-lt)' },
  age_16:  { label: 'Age 16',   color: 'var(--coral)',      bg: 'var(--coral-lt)' },
  parent:  { label: 'Parents',  color: 'var(--gold-dark)',  bg: 'var(--gold-lt)' },
  teacher: { label: 'Teachers', color: 'var(--ink-soft)',   bg: 'var(--warm)' },
}
const AUDIENCE_ORDER = ['age_7', 'age_9', 'age_11', 'age_13', 'age_16', 'parent', 'teacher']

type Lesson = { id: string; audience: string; title: string; key_message: string; sort_order: number }

export default async function AiModulePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('ai_lessons')
    .select('id, audience, title, key_message, sort_order')
    .order('sort_order', { ascending: true })

  const lessons = (data ?? []) as Lesson[]

  const groups = AUDIENCE_ORDER
    .map(aud => ({ aud, meta: AUDIENCE_META[aud], items: lessons.filter(l => l.audience === aud) }))
    .filter(g => g.items.length > 0)

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Understanding AI</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>The AI Module</h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
          How AI really works, and how to use it wisely. Calm, plain explanations for every age, plus you and the classroom.
        </p>
      </div>

      {groups.length === 0 && (
        <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', color: 'var(--ink-muted)', fontSize: '14px' }}>
          The AI lessons are being prepared. Check back soon.
        </div>
      )}

      {groups.map(group => (
        <section key={group.aud} style={{ marginBottom: '28px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: group.meta.color, background: group.meta.bg,
              padding: '4px 10px', borderRadius: '100px',
            }}>
              {group.meta.label}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {group.items.map(lesson => (
              <Link
                key={lesson.id}
                href={`/dashboard/ai-module/${lesson.id}`}
                style={{
                  display: 'block', textDecoration: 'none',
                  background: 'var(--warm)', border: '1px solid var(--border)',
                  borderRadius: '14px', padding: '16px 18px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', marginBottom: '4px' }}>
                  {lesson.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                  {lesson.key_message}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
