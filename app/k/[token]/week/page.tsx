import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { isChildVisible } from '@/lib/school/child-items'
import KidSchoolWeek, { type KidWeekItem } from '@/components/kid/KidSchoolWeek'

// The child's own week from school.
//
// Justin, 8 August 2026, on the parent's new week calendar: "we could build
// same viewer on child's phone so they can see their week."
//
// The child's home screen already tells them what is on today and tomorrow, and
// that is the right thing to lead with. What it cannot do is answer "is Cubs on
// Thursday or Friday", which is the question that gets asked in the car on the
// way home and the one a child currently has to ask a grown up to find out.
//
// Only the reminders meant for them. The rule is shared with the today banner
// rather than written twice, because the way two copies of that rule drift is a
// payment reminder turning up on a nine year old's phone.
//
// Same trust model as the rest of the child app: no account, no login, the link
// token scopes everything to one child.

export const dynamic = 'force-dynamic'

export default async function KidWeekPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children').select('name').eq('id', link.child_id).maybeSingle()
  const name = child?.name && child.name !== 'Your child' ? (child.name as string) : null

  // Everything still open, and the week is picked on the child's own device, so
  // last week and next week work without another round trip. A family's school
  // list is a handful of rows, not a feed, so this is cheaper than paging it.
  const { data: rows } = await supabase
    .from('school_actions')
    .select('id, title, kind, due_date, due_time, recurs_weekday, sent_to_child, auto_send_to_child, cleared_on')
    .eq('user_id', link.user_id)
    .eq('status', 'open')

  const items: KidWeekItem[] = (rows ?? [])
    .filter(a => isChildVisible(a as { kind: string; recurs_weekday?: number | null; sent_to_child?: boolean | null; auto_send_to_child?: boolean | null }))
    .map(a => ({
      id: a.id as string,
      title: a.title as string,
      kind: a.kind as string,
      dueDate: (a.due_date as string | null) ?? null,
      weekday: (a.recurs_weekday as number | null) ?? null,
      time: typeof a.due_time === 'string' ? (a.due_time as string).slice(0, 5) : null,
      clearedOn: (a.cleared_on as string | null) ?? null,
    }))

  return (
    // A LIGHT CALENDAR SURFACE, not the anthracite the other child sub pages
    // use. Justin: "the colours of this page need to match Google Calendar
    // colours mixed with touches of our brand."
    //
    // Every calendar worth copying is light: Google's own, Outlook, Toggl,
    // Finch, Runna. The reason is not taste, it is that a calendar's whole job
    // is to let coloured chips mean something, and colour coding on a dark
    // ground either glows or goes muddy. The kind colours in KidSchoolWeek are
    // Google's real palette, and they need a pale ground under them.
    //
    // Scoped to THIS page rather than changed on the --kid-bg token, which five
    // other child pages also use and which Justin has not asked about. A colour
    // token is the wrong place to make a one page decision.
    <div style={{ minHeight: '100dvh', background: 'var(--butter)', padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Link
          href={`/k/${token}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.04em',
            color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: 16,
          }}
        >
          ← Back
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 7vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 6px', color: 'var(--ink)' }}>
          {name ? `${name}'s week` : 'Your week'}
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
          Everything from school, on the day it lands. Tap a day to see it.
        </p>

        {items.length === 0 ? (
          <div style={{
            background: '#fff', border: '2px solid var(--border)', borderRadius: 20,
            boxShadow: '0 5px 0 rgba(0,0,0,0.25)', padding: '20px 18px',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.3 }}>
              Nothing from school yet
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              When your grown up adds a kit day or a club, it will show up here on its day.
            </p>
          </div>
        ) : (
          <KidSchoolWeek items={items} childName={name} />
        )}
      </div>
    </div>
  )
}
