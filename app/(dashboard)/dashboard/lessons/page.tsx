import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const STAGE_META = {
  foundation:  { num: 1, label: 'Foundation',  ages: 'Ages 4 to 7',       color: 'var(--ink)', bg: 'var(--stage-1)' },
  builder:     { num: 2, label: 'Builder',     ages: 'Ages 8 to 10',      color: 'var(--ink)', bg: 'var(--stage-2)' },
  explorer:    { num: 3, label: 'Explorer',    ages: 'Ages 11 to 13',     color: 'var(--ink)', bg: 'var(--stage-3)' },
  shaper:      { num: 4, label: 'Shaper',      ages: 'Ages 13 to 15',     color: 'var(--ink)', bg: 'var(--stage-4)' },
  independent: { num: 5, label: 'Independent', ages: 'Ages 16 and above', color: 'var(--ink)', bg: 'var(--stage-5)' },
} as const

type StageId = keyof typeof STAGE_META

const CATEGORY_LABEL: Record<string, string> = {
  screen_habits: 'Screen habits',
  safety: 'Safety',
  wellbeing: 'Wellbeing',
  online_risks: 'Online risks',
  ai_safety: 'AI safety and literacy',
}

const AUDIENCE_TO_STAGE: Record<string, StageId> = {
  age_7: 'foundation',
  age_9: 'builder',
  age_11: 'explorer',
  age_13: 'shaper',
  age_16: 'independent',
}

type LessonRow = {
  id: string
  stage_id: StageId
  category: string
  title: string
  key_message: string
  sort_order: number
  source: 'lesson' | 'ai'
}

export default async function LessonsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const [{ data: lessonsData }, { data: aiLessonsData }] = await Promise.all([
    supabase
      .from('lessons')
      .select('id, stage_id, category, title, key_message, sort_order')
      .eq('audience', 'parent')
      .neq('status', 'stub')
      .order('sort_order', { ascending: true }),
    supabase
      .from('ai_lessons')
      .select('id, audience, category, title, key_message, sort_order')
      .in('audience', ['age_7', 'age_9', 'age_11', 'age_13', 'age_16'])
      .order('sort_order', { ascending: true }),
  ])

  const generalLessons: LessonRow[] = (lessonsData ?? []).map(l => ({ ...l, source: 'lesson' as const }))
  const aiLessons: LessonRow[] = (aiLessonsData ?? []).map(l => ({
    id: l.id,
    stage_id: AUDIENCE_TO_STAGE[l.audience],
    category: 'ai_safety',
    title: l.title,
    key_message: l.key_message,
    sort_order: l.sort_order,
    source: 'ai' as const,
  }))

  const allLessons = [...generalLessons, ...aiLessons]

  const byStage = (Object.keys(STAGE_META) as StageId[]).map(stageId => ({
    stageId,
    meta: STAGE_META[stageId],
    items: allLessons.filter(l => l.stage_id === stageId).sort((a, b) => a.sort_order - b.sort_order),
  })).filter(group => group.items.length > 0)

  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Every stage, one place</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>Lessons</h1>
        <p style={{ color: 'var(--ink)', fontSize: '15px' }}>
          Screen habits, safety, wellbeing and online risks, mapped to the school curriculum, plus the full AI safety and literacy pack{firstName ? ` for ${firstName}'s stage` : ''}.
        </p>
      </div>

      {/* Flagship playable lesson */}
      <Link href="/dashboard/lessons/preview" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
        <div style={{
          background: '#DEF0E7', border: '1.5px solid #2F8F6B',
          borderRadius: '20px', padding: '20px 22px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2F8F6B', marginBottom: '4px' }}>
              New · 15 minutes together · ages 11 to 15
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', marginBottom: '4px' }}>
              Is That Real?
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              The sofa lesson on fake images, made up stories and deepfakes. You lead, the slides support, and you both come out sharper than most adults.
            </div>
          </div>
          <span style={{
            background: 'var(--terracotta)', color: 'var(--ink)', flexShrink: 0,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            borderRadius: '14px', padding: '11px 18px', boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}>
            Start
          </span>
        </div>
      </Link>

      {/* Digital Health Check card */}
      <Link href="https://www.guidedchildhood.com/digitalwellbeing" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
        <div style={{
          background: 'var(--stage-5)', border: '1.5px solid var(--stage-5)',
          borderRadius: '16px', padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '4px' }}>
              Under 10 minutes, no login
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
              Get your child&apos;s Digital Health Report
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '4px' }}>
              Your membership includes one free report. Your code arrives by email.
            </div>
          </div>
          <span style={{ fontSize: '18px', color: 'var(--ink-light)', flexShrink: 0 }}>→</span>
        </div>
      </Link>

      {byStage.length === 0 && (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', color: 'var(--ink-muted)', fontSize: '14px' }}>
          Lessons are being prepared. Check back soon.
        </div>
      )}

      {byStage.map(group => (
        <section key={group.stageId} style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: group.meta.color, background: group.meta.bg,
              padding: '4px 10px', borderRadius: '100px',
            }}>
              Stage {group.meta.num}: {group.meta.label}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {group.meta.ages}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {group.items.map(lesson => (
              <Link
                key={`${lesson.source}-${lesson.id}`}
                href={lesson.source === 'ai' ? `/dashboard/ai-module/${lesson.id}` : `/dashboard/lessons/${lesson.id}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                  textDecoration: 'none',
                  background: 'var(--cream)', border: '1px solid var(--border)',
                  borderRadius: '14px', padding: '14px 16px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--terracotta)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {CATEGORY_LABEL[lesson.category] ?? lesson.category}
                    </span>
                  </div>
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
