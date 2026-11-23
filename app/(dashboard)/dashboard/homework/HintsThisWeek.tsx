// DiGi hints this week, the parent's view of the child's hint card
// (23 November 2026, plans/2026-11-23-hint-card-fixes-plan.md).
//
// Before this a parent could not see the hint card being used at all. Now
// they see how many hints each child had on each of the last seven days, and
// in which subjects. That is all there is to see: the homework, the photo and
// the child's go at it are never stored (migrations 354 and 404).
//
// Server only. kid_homework_help_uses is service role, so it is read through
// the admin client, scoped to ids the parent's own RLS query returned.

import { createAdminClient } from '@/lib/supabase/admin'

type Kid = { id: string; name: string }
type Row = { child_id: string; day: string; hints: number | null; subjects: string[] | null }

const DAY = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'Europe/London' })

function sevenDaysAgo(): string {
  const d = new Date(Date.now() - 6 * 86_400_000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(d)
}

export default async function HintsThisWeek({ kids }: { kids: Kid[] }) {
  if (kids.length === 0) return null
  let rows: Row[] = []
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.from('kid_homework_help_uses')
      .select('child_id, day, hints, subjects')
      .in('child_id', kids.map(k => k.id))
      .gte('day', sevenDaysAgo())
      .order('day', { ascending: false })
    if (error) return null // before migration 404 the columns are not there
    rows = ((data ?? []) as Row[]).filter(r => (r.hints ?? 0) > 0)
  } catch {
    return null
  }

  const many = kids.length > 1
  return (
    <section data-hints-this-week style={{ background: 'var(--white)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)', padding: '18px 20px', marginTop: 22 }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        DiGi hints this week
      </p>
      {rows.length === 0 ? (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          No hints asked for in the last seven days. From age 10 your child can ask DiGi for a hint on a homework question, and you will see it here.
        </p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px' }}>
            {rows.map(r => {
              const kid = kids.find(k => k.id === r.child_id)
              const n = r.hints ?? 0
              const subjects = (r.subjects ?? []).filter(Boolean)
              return (
                <li key={`${r.child_id}-${r.day}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderTop: '1px solid rgba(26,26,46,0.06)', fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                  <span style={{ minWidth: 0 }}>
                    <strong>{DAY.format(new Date(`${r.day}T12:00:00Z`))}</strong>
                    {many && kid ? `, ${kid.name}` : ''}
                    {subjects.length > 0 && <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>{subjects.join(', ')}</span>}
                  </span>
                  <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>{n} {n === 1 ? 'hint' : 'hints'}</span>
                </li>
              )
            })}
          </ul>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: 0 }}>
            DiGi gives hints, never answers, and asks for their own go before a second one. The homework itself is not kept, so this is all there is to see. Ask them what the hint helped with.
          </p>
        </>
      )}
    </section>
  )
}
