import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
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

      {/* Email forwarding is coming soon: the automatic pull from school emails
          is being finished alongside the app wrap for Apple. The manual weekly
          routines above are live and do the everyday job now. */}
      <div style={{ background: '#fff', border: '1.5px dashed var(--border)', borderRadius: '18px', padding: '20px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 8px' }}>
          Forward your school emails · coming soon
        </p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.25, margin: '0 0 8px' }}>
          Automatic school email reminders are on the way
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
          Soon you will forward your school&apos;s emails to a private address and DiGi will pull out the kit days, trips, payments and homework for you, no typing. We are finishing it off alongside the phone app. For now, add your weekly routines above and they will remind you and your child every week.
        </p>
      </div>
    </div>
  )
}
