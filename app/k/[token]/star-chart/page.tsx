import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { chartWeekStart, starWeekEnd, formatWeekBeginning } from '@/lib/quests/star-week'
import StarChartBuilder from '@/app/(dashboard)/dashboard/printables/star-chart/StarChartBuilder'

// The child's own star chart builder.
//
// Justin, 10 August 2026, twice. First, from Teo's printables tab: "Where is
// the star chart on child's app, this is a key printable." Then, on the first
// cut of this page being a fixed sheet: "This is not right as we create a
// custom version where they add the tasks... make sure we revert back to
// custom version on both parents and child's."
//
// So this is the SAME StarChartBuilder the parent dashboard runs, the whole
// custom version: their real jobs ticked to start, the suggestion menu, the
// write your own box, the week chips, then print. One component on both
// phones, so the two experiences can never drift.
//
// The starting jobs are filtered IN SQL to the whole family ones plus this
// child's own, so a sibling's jobs never leave the database. The print
// record posts to the token authed kid route (the builder's default route
// needs a parent session this app does not have), writing the same
// star_chart_prints row, so a child's print quiets the parent quest board's
// To print badge exactly like a parent's.
//
// Same trust model as the rest of the child app: the link token scopes
// everything to one child.

export const dynamic = 'force-dynamic'

export const metadata = { title: 'My star chart ⭐' }

export default async function KidStarChartPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children').select('name').eq('id', link.child_id).maybeSingle()
  const name = child?.name && child.name !== 'Your child' ? (child.name as string) : ''

  const { data: quests } = await supabase
    .from('family_quests')
    .select('title, emoji, stars, child_id')
    .eq('user_id', link.user_id)
    .eq('active', true)
    .or(`child_id.is.null,child_id.eq.${link.child_id}`)
    .order('created_at', { ascending: true })

  // childId null on every row: the SQL filter already scoped the list to this
  // child, and the builder's own child switcher never shows (childOptions is
  // empty), so the rows just need to all be visible.
  const yourJobs = (quests ?? []).map(q => ({
    emoji: (q.emoji as string) || '⭐',
    text: q.title as string,
    stars: Number(q.stars) || 1,
    childId: null,
  }))

  // The same two weeks, named the same honest way, as the parent's builder.
  const first = chartWeekStart()
  const second = starWeekEnd(first)
  const startsTomorrow = first > new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date())
  const weeks = [
    { start: first, label: formatWeekBeginning(first), name: startsTomorrow ? 'The week ahead' : 'This week' },
    { start: second, label: formatWeekBeginning(second), name: startsTomorrow ? 'The one after' : 'Next week' },
  ]

  return (
    // A light surface, because the sheet is white paper and the anthracite
    // child background would swallow its edges.
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
      <StarChartBuilder
        variant="kid"
        yourJobs={yourJobs}
        defaultChildName={name}
        weeks={weeks}
        recordUrl="/api/kid/star-chart-print"
        recordBody={{ token }}
        backHref={`/k/${token}?tab=print`}
        backLabel="My quests"
      />
    </div>
  )
}
