import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import BackTo from '@/components/nav/BackTo'
import { pickChild } from '@/lib/children/select'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { getStarLesson } from '@/lib/quests/star-lesson-catalogue'
import { createAdminClient } from '@/lib/supabase/admin'
import { isTogetherStage } from '@/lib/lessons/school-path'
import { loadChildLessonPath } from '@/lib/pathway/lesson-path-server'
import type { StageId } from '@/lib/pathway/progress'
import { withChild } from '@/components/passport/Application'

// The child's lessons, from the parent's side (29 September 2026).
//
// Justin chose "the child learns, the parent closes it". The child plays the
// school version of each lesson in their own app; this page is where the
// parent sees the same list, the same ticks the passport counts, and the one
// question to ask at tea for each lesson passed. Under 7 there is a Do it
// together button that opens the child's own lesson on this phone, so the pass
// still lands on the child. The passport's Lessons and tests row opens here,
// which is what keeps its "2 of 10" and this page's "2 of 10" the same number.
//
// The parent library (/dashboard/lessons) stays as the parent's own learning.

export const metadata = { title: 'Their lessons · Guided Childhood' }

const STAGE_IDS: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

type Note = { family_question?: string; taught?: string }

export default async function ChildLessonPathPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; stage?: string; lesson?: string; from?: string }>
}) {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  const { child: childParam, stage: stageParam, lesson: focusId, from } = await searchParams

  const { data: childRows } = await supabase
    .from('children').select('id, name, age_band, is_primary')
    .eq('parent_id', user.id).order('is_primary', { ascending: false })
  const child = pickChild(childRows ?? [], childParam)
  if (!child) redirect('/dashboard')

  const own = getStageFromAgeBand(((child as { age_band?: string | null }).age_band as AgeBand | null) ?? '8-10')
  const ownId = own.name.toLowerCase() as StageId
  // ?stage= arrives as a name or as the stage number (the passport and the
  // stamp card pass the number), so both land on the same page.
  const asNum = Number(stageParam)
  const stageId: StageId = STAGE_IDS.includes(stageParam as StageId) ? stageParam as StageId
    : Number.isInteger(asNum) && asNum >= 1 && asNum <= 5 ? STAGE_IDS[asNum - 1]
    : ownId
  const kidName = child.name && child.name !== 'Your child' ? child.name : 'Your child'

  const admin = createAdminClient()
  const [{ modules, path }, { data: link }] = await Promise.all([
    // The one lesson count (lib/pathway/lesson-path.ts), the same function the
    // passport reads, so this heading and the passport's row cannot quote
    // different numbers. Until 9 October 2026 this page counted the child's
    // own school rows alone and the passport also credited a household pass
    // and migration 162's who passed rows, which is how the two drifted.
    loadChildLessonPath(supabase, { userId: user.id, childId: child.id, stageId }),
    supabase.from('kid_links').select('token').eq('child_id', child.id).maybeSingle(),
  ])
  const passed = new Set(modules.filter(m => path.statusById[m.id]?.state === 'passed').map(m => m.id))

  // The parent notes, for the tea question on each passed lesson. One read of
  // the stage's modules, through the same one door as every school read.
  const notes = new Map<string, Note>()
  {
    const rows = await Promise.all(modules.filter(m => passed.has(m.id) || m.id === focusId)
      .map(m => getStarLesson(admin, m.id, 'id, parent_note')))
    for (const r of rows) if (r) notes.set(r.id, ((r as { parent_note?: Note }).parent_note ?? {}) as Note)
  }

  const token = (link as { token?: string } | null)?.token ?? null
  const together = isTogetherStage(stageId)
  const doneCount = path.school.done
  const nextId = path.school.next?.id ?? null
  const backHref = withChild('/dashboard/pathway#passport', childParam)

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 640, margin: '0 auto' }}>
      <BackTo from={from ?? 'passport'} fallback={{ href: backHref, label: 'Passport' }} />
      <p className="eyebrow" style={{ marginBottom: 4 }}>Lessons and tests</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.2 }}>
        {kidName}&apos;s lessons: {doneCount} of {modules.length} passed
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        {together
          ? `At this age you do them together: open one on your phone, read it out, and let ${kidName} answer. One a week is plenty.`
          : `${kidName} does these in their own app, one a week. When they pass one, you get a question to ask at tea, and it ticks off here and on the passport.`}
      </p>

      {!token && (
        <div style={{ background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '12px 14px', margin: '0 0 16px', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5 }}>
          {kidName} is not on their app yet. Set it up from <Link href="/dashboard" style={{ color: 'var(--ink)', fontWeight: 800 }}>Home</Link>, and these lessons appear there.
        </div>
      )}

      {modules.length === 0 ? (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>No lessons for this stage yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {modules.map(m => {
            const done = passed.has(m.id)
            const q = notes.get(m.id)?.family_question
            const focused = m.id === focusId
            return (
              <div key={m.id} id={`lesson-${m.id}`} data-path-lesson={done ? 'passed' : m.id === nextId ? 'next' : 'ahead'} style={{
                background: '#fff', border: focused ? '2px solid var(--ink)' : 'var(--edge)', borderRadius: 'var(--radius-tile)',
                boxShadow: focused ? '0 5px 0 var(--ink)' : 'var(--lift)', padding: '13px 15px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span aria-hidden style={{
                    width: 28, height: 28, flexShrink: 0, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? 'var(--tint-green)' : 'var(--cream)', border: done ? '1.5px solid #2D5016' : 'var(--edge)',
                    color: '#2D5016', fontWeight: 900,
                  }}>{done ? '✓' : ''}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>{m.title}</span>
                    {m.single_action_outcome && (
                      <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>{m.single_action_outcome}</span>
                    )}
                  </span>
                </div>
                {done && q && (
                  <p style={{ margin: '10px 0 0', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 2 }}>Ask at tea</span>
                    {q}
                  </p>
                )}
                {token && (together || focused) && !done && (
                  <a href={`/k/${token}/school/${m.id}`} data-do-together style={{
                    display: 'inline-block', marginTop: 10, padding: '10px 16px', borderRadius: 'var(--radius-btn)',
                    background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none', border: 'var(--edge)',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 5px 0 var(--terracotta-dark)',
                  }}>
                    Do it together now
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55, marginTop: 18 }}>
        Your own lessons, written for grown ups, are in the <Link href="/dashboard/lessons" style={{ color: 'var(--ink)', fontWeight: 700 }}>lesson library</Link>.
      </p>
    </div>
  )
}
