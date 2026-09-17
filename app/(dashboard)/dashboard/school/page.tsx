import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getFamilyRegion } from '@/lib/learning/region'
import SchoolActionsCard, { type SchoolAction } from '@/components/school/SchoolActionsCard'
import SchoolLetterbox from '@/components/school/SchoolLetterbox'
import SchoolCatch from '@/components/school/SchoolCatch'
import { getChildren } from '@/lib/children/server'

// The school section: your live alerts first (the things you need to know,
// pulled from forwarded school emails and anything added by hand, stored in
// the school_actions table), then the connection setup below. This is the
// findable in app home for school reminders, not only the push notification.

export default async function SchoolPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
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
    // The selected child rather than always the primary one; the page's own
    // per action child chips still name whoever a row is for.
    getChildren<{ id: string; name: string | null; is_primary: boolean | null }>(supabase, user.id, childParam, 'id, name'),
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
  const childName = childResult.child?.name ?? null

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
        <SchoolActionsCard
          actions={actions}
          childName={childName}
          kids={(allChildrenResult.data ?? []) as { id: string; name: string | null }[]}
          region={region}
        />
      </div>

      {/* TWO WAYS IN, EASIEST FIRST.
          Snap it needs nothing set up at all and also catches the paper that
          forwarding can never reach, so it leads. The letterbox is the one that
          becomes automatic and never needs touching again, so it follows.
          Justin, 17 September 2026: "Is there a way without having to set up
          forward?" This order is the answer to that, on the screen. */}
      <SchoolCatch />

      {/* The letterbox, live since 17 September 2026.
          This is where the Home promo card has always pointed, and until now
          what it landed on was a dashed box saying the feature was coming. The
          setup itself lives here rather than in Settings, because this is the
          page a parent is on when they think about school. */}
      <SchoolLetterbox />
    </div>
  )
}
