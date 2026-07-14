import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasFullAccess } from '@/lib/access'
import { freeLessonIds } from '@/lib/content/lesson-access'
import { getParentLessons, getCompletionsForChild, durationLabel } from '@/lib/lessons/parent-lessons'
import { STAGES } from '@/lib/content/stages'
import LessonsTabs from './LessonsTabs'
import StarLessons from './StarLessons'
import LessonSendButton from './together/LessonSendButton'

// The Lessons hub: one place for every lesson type. A segmented control
// switches between doing lessons together (the watch together videos on
// top, then the interactive library) and sending a lesson to the child's
// device. Send to child moved here from the Quests page so lessons live in
// one home; on the child it still lands as a quest.

export const metadata = { title: 'Lessons — Guided Childhood' }

const STAGE_META = {
  foundation:  { num: 1, label: 'Foundation',  ages: 'Ages 4 to 7',       bg: 'var(--stage-1)' },
  builder:     { num: 2, label: 'Builder',     ages: 'Ages 8 to 10',      bg: 'var(--stage-2)' },
  explorer:    { num: 3, label: 'Explorer',    ages: 'Ages 11 to 13',     bg: 'var(--stage-3)' },
  shaper:      { num: 4, label: 'Shaper',      ages: 'Ages 13 to 15',     bg: 'var(--stage-4)' },
  independent: { num: 5, label: 'Independent', ages: 'Ages 16 and above', bg: 'var(--stage-5)' },
} as const
type StageId = keyof typeof STAGE_META

const CATEGORY_LABEL: Record<string, string> = {
  screen_habits: 'Screen habits', safety: 'Safety', wellbeing: 'Wellbeing',
  online_risks: 'Online risks', ai_safety: 'AI safety and literacy',
}
const AUDIENCE_TO_STAGE: Record<string, StageId> = {
  age_7: 'foundation', age_9: 'builder', age_11: 'explorer', age_13: 'shaper', age_16: 'independent',
}

const STRAND_EMOJI: Record<string, string> = {
  screens: '📱', screen: '📱', bodies: '🧠', feelings: '💛', wellbeing: '💛',
  kindness: '🤝', privacy: '🛡️', gaming: '🎮', misinformation: '🔍',
  algorithms: '🎯', money: '💷', identity: '✨', default: '🎬',
}
function strandEmoji(strand: string): string {
  const k = (strand || '').toLowerCase()
  for (const key of Object.keys(STRAND_EMOJI)) if (k.includes(key)) return STRAND_EMOJI[key]
  return STRAND_EMOJI.default
}

type LessonRow = {
  id: string; stage_id: StageId; category: string; title: string
  key_message: string; sort_order: number; source: 'lesson' | 'ai'
}

export default async function LessonsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children').select('id, name').eq('parent_id', user.id).eq('is_primary', true).maybeSingle()
  const childName = child?.name && child.name !== 'Your child' ? child.name : 'your child'

  const [{ data: profile }, { data: lessonsData }, { data: aiLessonsData }, { data: completionsData }, watch, watchCompletions] = await Promise.all([
    supabase.from('profiles').select('full_name, subscription_status, trial_ends_at').eq('id', user.id).maybeSingle(),
    supabase.from('lessons').select('id, stage_id, category, title, key_message, sort_order').eq('audience', 'parent').neq('status', 'stub').order('sort_order', { ascending: true }),
    supabase.from('ai_lessons').select('id, audience, category, title, key_message, sort_order').in('audience', ['age_7', 'age_9', 'age_11', 'age_13', 'age_16']).order('sort_order', { ascending: true }),
    supabase.from('lesson_completions').select('lesson_id, lesson_source').eq('user_id', user.id).in('lesson_source', ['lesson', 'ai_lesson']),
    getParentLessons(supabase),
    child ? getCompletionsForChild(supabase, child.id) : Promise.resolve(new Map()),
  ])

  // ── The interactive library (school + AI lessons) ──
  const generalLessons: LessonRow[] = (lessonsData ?? []).map(l => ({ ...l, source: 'lesson' as const }))
  const aiLessons: LessonRow[] = (aiLessonsData ?? []).map(l => ({
    id: l.id, stage_id: AUDIENCE_TO_STAGE[l.audience], category: 'ai_safety',
    title: l.title, key_message: l.key_message, sort_order: l.sort_order, source: 'ai' as const,
  }))
  const allLessons = [...generalLessons, ...aiLessons]
  const isPaid = hasFullAccess(profile, user.email)
  const freeIds = freeLessonIds(generalLessons)
  const completedLessonIds = new Set((completionsData ?? []).filter(c => c.lesson_source === 'lesson').map(c => c.lesson_id))
  const completedAiIds = new Set((completionsData ?? []).filter(c => c.lesson_source === 'ai_lesson').map(c => c.lesson_id))
  const isDone = (l: LessonRow) => l.source === 'ai' ? completedAiIds.has(l.id) : completedLessonIds.has(l.id)
  const isLocked = (l: LessonRow) => l.source === 'lesson' && !isPaid && !freeIds.has(l.id) && !completedLessonIds.has(l.id)
  const byStage = (Object.keys(STAGE_META) as StageId[]).map(stageId => ({
    stageId, meta: STAGE_META[stageId],
    items: allLessons.filter(l => l.stage_id === stageId).sort((a, b) => a.sort_order - b.sort_order),
  })).filter(group => group.items.length > 0)

  // ── The watch together video shelf (parent_lessons) ──
  const { lessons: watchLessons, segmentsByLesson } = watch
  const watchByStage = STAGES
    .map(stage => ({ stage, items: watchLessons.filter(l => l.stage_id === stage.id) }))
    .filter(group => group.items.length > 0)

  const firstName = profile?.full_name?.split(' ')[0]

  const together = (
    <div>
      {/* Watch together videos lead: the premium co view content */}
      {watchByStage.length > 0 && (
        <section style={{ marginBottom: '34px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
            Watch together
          </p>
          <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 16px' }}>
            Short illustrated films you watch on the sofa{child ? ` with ${childName}` : ''}, with DiGi pausing to talk. First watch earns 10 stars.
          </p>
          {watchByStage.map(({ stage, items }) => (
            <div key={stage.id} style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', background: `var(--stage-${stage.id})`, padding: '4px 10px', borderRadius: '100px', display: 'inline-block', marginBottom: '12px' }}>
                Stage {stage.id}: {stage.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '14px' }}>
                {items.map(lesson => {
                  const completion = watchCompletions.get(lesson.lesson_code)
                  const done = Boolean(completion)
                  const duration = durationLabel(segmentsByLesson.get(lesson.id))
                  return (
                    <div key={lesson.lesson_code} style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 18px rgba(26,26,46,0.06)' }}>
                      <Link href={`/dashboard/lessons/together/${lesson.lesson_code}`} style={{ position: 'relative', display: 'block', textDecoration: 'none', aspectRatio: '16 / 10', background: `linear-gradient(150deg, var(--stage-${stage.id}-bold) 0%, var(--stage-${stage.id}) 100%)` }}>
                        <span style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '26px', lineHeight: 1 }}>{strandEmoji(lesson.strand)}</span>
                        {done && (
                          <span style={{ position: 'absolute', top: '10px', right: '10px', fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '2px 8px' }}>✓ Done</span>
                        )}
                        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
                          <span style={{ fontSize: '16px', color: 'var(--ink)', marginLeft: '3px' }}>▶</span>
                        </span>
                        <span style={{ position: 'absolute', bottom: '10px', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.75)', borderRadius: '100px', padding: '2px 8px' }}>
                          Lesson {lesson.journey_step}{duration ? ` · ${duration}` : ''}
                        </span>
                      </Link>
                      <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '4px' }}>{lesson.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>&ldquo;{lesson.catchphrase}&rdquo;</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <Link href={`/dashboard/lessons/together/${lesson.lesson_code}`} style={{ flex: 1, textAlign: 'center', textDecoration: 'none', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '11px', padding: '9px 10px', fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800, boxShadow: '0 3px 0 var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
                            {done ? 'Watch again ↻' : '▶ Watch together'}
                          </Link>
                          <LessonSendButton childId={child?.id ?? null} childName={childName} title={lesson.title} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* The interactive library */}
      <section>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
          The interactive library
        </p>
        <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Screen habits, safety, wellbeing, online risks and the full AI literacy pack{firstName ? ` for ${firstName}'s stage` : ''}, mapped to the school curriculum.
        </p>

        {/* Flagship playable lesson */}
        <Link href="/dashboard/lessons/preview" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
          <div style={{ background: '#DEF0E7', border: '1.5px solid #2F8F6B', borderRadius: '20px', padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2F8F6B', marginBottom: '4px' }}>New · 15 minutes together · ages 11 to 15</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', marginBottom: '4px' }}>Is That Real?</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>The sofa lesson on fake images, made up stories and deepfakes. You lead, the slides support.</div>
            </div>
            <span style={{ background: 'var(--terracotta)', color: 'var(--ink)', flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', borderRadius: '14px', padding: '11px 18px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>Start</span>
          </div>
        </Link>

        {byStage.map(group => (
          <div key={group.stageId} style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', background: group.meta.bg, padding: '4px 10px', borderRadius: '100px', display: 'inline-block', marginBottom: '12px' }}>
              Stage {group.meta.num}: {group.meta.label} · {group.meta.ages}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {group.items.map(lesson => {
                const locked = isLocked(lesson)
                const done = !locked && isDone(lesson)
                return (
                  <Link key={`${lesson.source}-${lesson.id}`} href={lesson.source === 'ai' ? `/dashboard/ai-module/${lesson.id}` : `/dashboard/lessons/${lesson.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', textDecoration: 'none', background: done ? '#EDF7F1' : 'var(--cream)', border: done ? '1px solid #B7DEC9' : '1px solid var(--border)', borderRadius: '14px', padding: '14px 16px', opacity: locked ? 0.72 : 1 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, color: 'var(--terracotta)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{CATEGORY_LABEL[lesson.category] ?? lesson.category}</span>
                        {done && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.08em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '2px 8px' }}>✓ Completed</span>}
                        {locked && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--border)', borderRadius: '100px', padding: '2px 7px' }}>Members</span>}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: '3px' }}>{lesson.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.key_message}</div>
                    </div>
                    {done ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0, whiteSpace: 'nowrap' }}>Run again ↻</span> : <span style={{ fontSize: '15px', color: 'var(--ink-light)', flexShrink: 0 }}>{locked ? '🔒' : '→'}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  )

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Every lesson, one place</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '8px' }}>Lessons</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.6 }}>
          Watch the illustrated films together, work through the interactive library, or send a lesson straight to {childName}&apos;s device.
        </p>
      </div>

      <LessonsTabs together={together} send={<StarLessons />} childName={childName} />
    </div>
  )
}
