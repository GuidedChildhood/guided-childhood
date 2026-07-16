import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SchoolSetup from '@/components/school/SchoolSetup'
import SchoolActionsCard, { type SchoolAction } from '@/components/school/SchoolActionsCard'

// The school section: your live alerts first (the things you need to know,
// pulled from forwarded school emails and anything added by hand, stored in
// the school_actions table), then the connection setup below. This is the
// findable in app home for school reminders, not only the push notification.

export default async function SchoolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [actionsResult, childResult] = await Promise.all([
    supabase
      .from('school_actions')
      .select('id, kind, title, detail, due_date, due_time, sent_to_child, recurs_weekday, auto_send_to_child, cleared_on')
      .eq('user_id', user.id)
      .eq('status', 'open')
      .order('due_date', { ascending: true, nullsFirst: false })
      .limit(30),
    supabase.from('children').select('name').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
  ])

  const actions: SchoolAction[] = actionsResult.data ?? []
  const childName = childResult.data?.name ?? null

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '10px' }}>School</p>
      <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '8px' }}>
        School alerts and reminders
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.6, marginBottom: '18px' }}>
        Everything from school in one place. Tick a thing off to clear it, or add your own weekly routine so the PE kit never gets forgotten again.
      </p>

      {/* Live alerts, stored in school_actions, shown here in the app itself */}
      <div id="school-actions" style={{ marginBottom: '28px' }}>
        <SchoolActionsCard actions={actions} childName={childName} />
      </div>

      {/* The connection and setup */}
      <SchoolSetup />
    </div>
  )
}
