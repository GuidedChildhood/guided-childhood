import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import { getFamilyRegion } from '@/lib/learning/region'
import SchoolActionsCard, { type SchoolAction } from '@/components/school/SchoolActionsCard'
import SchoolLetterbox from '@/components/school/SchoolLetterbox'
import SchoolCatch from '@/components/school/SchoolCatch'
import SchoolNextUp from '@/components/school/SchoolNextUp'
import SchoolMore from '@/components/school/SchoolMore'
import { getChildren } from '@/lib/children/server'

// The school section: your live alerts first (the things you need to know,
// pulled from forwarded school emails and anything added by hand, stored in
// the school_actions table), then the connection setup below. This is the
// findable in app home for school reminders, not only the push notification.

export default async function SchoolPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')

  const [actionsResult, childResult, allChildrenResult, kidLinksResult] = await Promise.all([
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
    supabase.from('children').select('id, name, no_phone').eq('parent_id', user.id),
    // Which children have their app on a phone, so the add sheet can say
    // "Teo has no phone yet" rather than offering to send it to one.
    supabase.from('kid_links').select('child_id').eq('user_id', user.id),
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

  // The early reminder plan for homework and deadlines (lib/school/lead-up.ts):
  // created_at is always there and fixes the automatic plan; remind_days is the
  // parent's own choice and lands with migration 401, so it is guarded the same
  // way. An error reads as the automatic plan.
  const leadInfo = new Map<string, { created_at: string | null; remind_days: number[] | null; remind_saved: boolean }>()
  try {
    const { data } = await supabase.from('school_actions').select('id, created_at').eq('user_id', user.id).eq('status', 'open')
    for (const r of (data ?? []) as { id: string; created_at?: string | null }[]) leadInfo.set(String(r.id), { created_at: r.created_at ?? null, remind_days: null, remind_saved: false })
    const { data: chosen, error } = await supabase.from('school_actions').select('id, remind_days').eq('user_id', user.id).eq('status', 'open')
    if (!error) for (const r of (chosen ?? []) as { id: string; remind_days?: number[] | null }[]) {
      const held = leadInfo.get(String(r.id))
      if (held) { held.remind_days = r.remind_days ?? null; held.remind_saved = true }
    }
  } catch { /* pre 401, the automatic plan */ }

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
      created_at: leadInfo.get(String(a.id))?.created_at ?? null,
      remind_days: leadInfo.get(String(a.id))?.remind_days ?? null,
      remind_ready: leadInfo.get(String(a.id))?.remind_saved ?? false,
    }
  })
  const childName = childResult.child?.name ?? null

  const kids = ((allChildrenResult.data ?? []) as { id: string; name: string | null; no_phone?: boolean | null }[]).map(k => ({
    id: k.id, name: k.name,
    // Their app is on a phone: linked, and not marked as having none.
    hasApp: k.no_phone !== true && (kidLinksResult.data ?? []).some(l => l.child_id === k.id),
  }))

  // THE PAGE IN THREE PARTS (22 November 2026, Justin: "super simple ... makes
  // sure nothing is missed ... a parent's best friend"). What is next, with a
  // tick. One button to add from school. Everything else folded to one line.
  // plans/2026-11-22-calendar-next-up.md has the references and the reasoning.
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 6vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '8px' }}>
        Coming up at school
      </h1>

      <SchoolNextUp actions={actions} region={region} />

      <div style={{ height: 18 }} />

      {/* ADD FROM SCHOOL: a photo or a screenshot first, since it needs
          nothing set up (17 November 2026), now with typing it in beside it. */}
      <SchoolCatch kids={kids} childName={childName} />

      <SchoolMore
        label="Week view, routines and settings"
        hint="The whole week, weekly routines, your child's phone, email forwarding"
        ids={['school-actions', 'letterbox']}
      >
        {/* The full card: the week as a grid, routines, send to a child's
            phone, early reminders, the calendar download. Unchanged. */}
        <div id="school-actions" style={{ marginBottom: '28px', scrollMarginTop: 80 }}>
          <SchoolActionsCard actions={actions} childName={childName} kids={kids} region={region} />
        </div>

        {/* The letterbox setup, live since 17 September 2026. */}
        <div id="letterbox" style={{ scrollMarginTop: 80 }}>
          <SchoolLetterbox />
        </div>
      </SchoolMore>
    </div>
  )
}
