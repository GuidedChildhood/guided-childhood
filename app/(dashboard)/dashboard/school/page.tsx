import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getFamilyRegion } from '@/lib/learning/region'
import SchoolActionsCard, { type SchoolAction } from '@/components/school/SchoolActionsCard'

// The school section: your live alerts first (the things you need to know,
// pulled from forwarded school emails and anything added by hand, stored in
// the school_actions table), then the connection setup below. This is the
// findable in app home for school reminders, not only the push notification.

export default async function SchoolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [actionsResult, childResult, allChildrenResult] = await Promise.all([
    supabase
      .from('school_actions')
      .select('id, kind, title, detail, due_date, due_time, sent_to_child, recurs_weekday, auto_send_to_child, cleared_on, child_id')
      .eq('user_id', user.id)
      .eq('status', 'open')
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(30),
    supabase.from('children').select('name').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('children').select('id, name').eq('parent_id', user.id),
  ])

  // Who added what, read on its own and guarded rather than folded into the
  // select above: added_by lands with migration 179, migrations run by hand,
  // and naming a missing column fails the whole query it is part of, which
  // here would blank the parent's school list between deploy and migration.
  // An error just means every row reads as the parent's, which it was.
  const provenance = new Map<string, { by: string; childId: string | null }>()
  try {
    const { data, error } = await supabase
      .from('school_actions')
      .select('id, added_by, added_by_child_id')
      .eq('user_id', user.id)
      .eq('status', 'open')
    if (!error) {
      for (const r of (data ?? []) as { id: string; added_by?: string | null; added_by_child_id?: string | null }[]) {
        provenance.set(String(r.id), { by: r.added_by === 'child' ? 'child' : 'parent', childId: r.added_by_child_id ?? null })
      }
    }
  } catch { /* pre 179, every row is the parent's */ }
  const childNames = new Map((allChildrenResult.data ?? []).map(c => [String(c.id), c.name as string]))

  // Which routines keep going in the school holidays, guarded the same way
  // and for the same reason: runs_in_holidays lands with migration 182. An
  // error reads as school time, which rests every routine in the holidays.
  const runsInHolidays = new Map<string, boolean>()
  try {
    const { data, error } = await supabase
      .from('school_actions')
      .select('id, runs_in_holidays')
      .eq('user_id', user.id)
      .eq('status', 'open')
    if (!error) {
      for (const r of (data ?? []) as { id: string; runs_in_holidays?: boolean | null }[]) {
        runsInHolidays.set(String(r.id), r.runs_in_holidays === true)
      }
    }
  } catch { /* pre 182, every routine is school time */ }

  const region = await getFamilyRegion(supabase, user.id)

  const actions: SchoolAction[] = (actionsResult.data ?? []).map(a => {
    const p = provenance.get(String(a.id))
    return {
      ...a,
      added_by: p?.by ?? 'parent',
      added_by_child_name: p?.childId ? childNames.get(p.childId) ?? null : null,
      // Whose item it is (migration 215), not who typed it in. The card shows
      // it beside the title so a parent of two knows whose PE kit.
      child_name: (a as { child_id?: string | null }).child_id
        ? childNames.get((a as { child_id?: string | null }).child_id as string) ?? null
        : null,
      runs_in_holidays: runsInHolidays.get(String(a.id)) ?? false,
    }
  })
  const childName = childResult.data?.name ?? null

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '10px' }}>School</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 6vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '12px' }}>
        School alerts and reminders
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-lg)', lineHeight: 1.6, marginBottom: '20px', maxWidth: '46ch' }}>
        Everything from school in one place. Tick a thing off to clear it, or add your own weekly routine so the PE kit never gets forgotten again.
      </p>

      {/* Live alerts, stored in school_actions, shown here in the app itself */}
      <div id="school-actions" style={{ marginBottom: '28px' }}>
        <SchoolActionsCard actions={actions} childName={childName} region={region} />
      </div>

      {/* Email forwarding is coming soon: the automatic pull from school emails
          is being finished alongside the app wrap for Apple. The manual weekly
          routines above are live and do the everyday job now. */}
      <div style={{ background: '#fff', border: '1.5px dashed var(--border)', borderRadius: '18px', padding: '20px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 8px' }}>
          Forward your school emails · coming soon
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25, margin: '0 0 8px' }}>
          Automatic school email reminders are on the way
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-md)', lineHeight: 1.6, margin: 0 }}>
          Soon you will forward your school&apos;s emails to a private address and DiGi will pull out the kit days, trips, payments and homework for you, no typing. We are finishing it off alongside the phone app. For now, add your weekly routines above and they will remind you and your child every week.
        </p>
      </div>
    </div>
  )
}
