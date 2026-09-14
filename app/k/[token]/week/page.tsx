import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { isChildVisible } from '@/lib/school/child-items'
import { getFamilyRegion } from '@/lib/learning/region'
import KidSchoolWeek, { type KidWeekItem } from '@/components/kid/KidSchoolWeek'
import KidTermPreview from '@/components/kid/KidTermPreview'
import { buildTermPreview } from '@/lib/learning/term-preview'
import { buddyFor } from '@/lib/kid/buddy'
import { HAPPY, Plate } from '@/components/kid/HappyNewsBits'

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
    .from('children').select('name, date_of_birth, buddy').eq('id', link.child_id).maybeSingle()
  const name = child?.name && child.name !== 'Your child' ? (child.name as string) : null
  const buddy = buddyFor((child as { buddy?: string | null } | null)?.buddy ?? null)

  // What is coming at school, in the child's words. Null outside a holiday and
  // the first week back, and null without a birthday, so most of the year this
  // renders nothing at all.
  const termPreview = await buildTermPreview(
    supabase,
    { date_of_birth: (child?.date_of_birth as string | null) ?? null },
    new Date(),
    await getFamilyRegion(supabase, link.user_id).catch(() => 'uk' as const),
  )

  // Everything still open, and the week is picked on the child's own device, so
  // last week and next week work without another round trip. A family's school
  // list is a handful of rows, not a feed, so this is cheaper than paging it.
  const { data: rows } = await supabase
    .from('school_actions')
    .select('id, title, kind, due_date, due_time, recurs_weekday, sent_to_child, auto_send_to_child, cleared_on')
    .eq('user_id', link.user_id)
    .eq('status', 'open')

  // Who added what, read on its own and guarded, not folded into the select
  // above. added_by arrives with migration 179, migrations here are run by
  // hand, and naming a column that does not exist yet fails the WHOLE query it
  // is part of. That query is the child's week itself, so folding it in would
  // have taken this page down between deploy and migration. An error simply
  // means every row reads as parent added, which is what every row was.
  const addedBy = new Map<string, 'parent' | 'child'>()
  try {
    const { data, error } = await supabase
      .from('school_actions')
      .select('id, added_by')
      .eq('user_id', link.user_id)
      .eq('status', 'open')
    if (!error) {
      for (const r of (data ?? []) as { id: string; added_by?: string | null }[]) {
        addedBy.set(String(r.id), r.added_by === 'child' ? 'child' : 'parent')
      }
    }
  } catch { /* pre 179, every row is the parent's */ }

  // Which routines keep going in the school holidays, same guarded shape as
  // the provenance read above and for the same reason: runs_in_holidays lands
  // with migration 182 and this page must not break either side of it. An
  // error reads as school time, which holds every routine in the holidays.
  const runsInHolidays = new Map<string, boolean>()
  try {
    const { data, error } = await supabase
      .from('school_actions')
      .select('id, runs_in_holidays')
      .eq('user_id', link.user_id)
      .eq('status', 'open')
    if (!error) {
      for (const r of (data ?? []) as { id: string; runs_in_holidays?: boolean | null }[]) {
        runsInHolidays.set(String(r.id), r.runs_in_holidays === true)
      }
    }
  } catch { /* pre 182, every routine is school time */ }

  // Which school calendar this family keeps, so the week knows when the
  // holidays are for the hold pills.
  const region = await getFamilyRegion(supabase, link.user_id)

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
      addedBy: addedBy.get(a.id as string) ?? 'parent',
      runsInHolidays: runsInHolidays.get(a.id as string) ?? false,
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
    // ── THE WHITE PAGE, NOT THE DOTTED SKY (14 September 2026, later) ─────
    //
    // Justin, with four Kenji screenshots in the morning: "Child calendar does
    // not look great in yellow. Redesign in super fun happy news style like the
    // Kenji shop but our Planet Friends." The slab of butter became a pastel
    // sky scattered with dots. Then at lunch, with The Happy Newspaper page
    // beside it: "background blue dots is not the right look, we want happy
    // news style as the image here for calendar." That page is a white ground
    // with big flat colour discs and ink lines, so this is the white page now,
    // the days are discs (see KidSchoolWeek), and the child's own Friend sits
    // on a butter plate beside the title.
    // The chips inside keep Google's real calendar colours on their washes,
    // which is what the light ground was always for.
    //
    // Padding clears the status bar: the back link sat under the clock.
    <div style={{
      minHeight: '100dvh', fontFamily: 'var(--font-body)',
      background: HAPPY.cream,
      padding: 'calc(18px + env(safe-area-inset-top)) 16px 50px',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Link
          href={`/k/${token}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-base)', fontWeight: 800,
            color: 'var(--ink)', textDecoration: 'none', marginBottom: 14,
            background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-pill)',
            padding: '7px 14px 7px 10px', boxShadow: `0 3px 0 ${HAPPY.ink}`,
          }}
        >
          ‹ Back
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 7vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0, color: 'var(--ink)' }}>
            {name ? `${name}'s week` : 'Your week'}
          </h1>
          <Plate size={72} tint={HAPPY.butterLt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={buddy.img} alt={buddy.name} width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain', display: 'block' }} />
          </Plate>
        </div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
          School things and your own reminders, on the day they land. Tap a day to see it.
        </p>

        {/* The shape of the next few months, above the week rather than inside
            a day: it does not start on a Tuesday, and putting it on one would
            be a lie about when it begins. */}
        {termPreview && <KidTermPreview preview={termPreview} childName={name} />}

        {/* An empty diary still shows the week, because the add button lives
            under the day: since the child can put things on the diary
            themselves, an empty week is an invitation, not a dead end. */}
        {items.length === 0 && (
          <div style={{
            background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-card)',
            boxShadow: `0 5px 0 ${HAPPY.ink}`, padding: '20px 18px', marginBottom: 16,
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.3 }}>
              Nothing from school yet
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              When your grown up adds a kit day or a club, it will show up here on its day. Know something they missed? Pick a day and add it yourself.
            </p>
          </div>
        )}
        <KidSchoolWeek items={items} childName={name} token={token} region={region} />
      </div>
    </div>
  )
}
