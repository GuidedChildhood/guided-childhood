import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { chartWeekStart, formatWeekBeginning } from '@/lib/quests/star-week'
import StarChartSheet, { MAX_ROWS, type SheetJob } from '@/components/printables/StarChartSheet'
import KidChartToolbar from './KidChartToolbar'

// The child's own way to the star chart.
//
// Justin, 10 August 2026, from Teo's printables tab: "Where is the star chart
// on child's app, this is a key printable." The chart was parent only, built
// and printed from the dashboard. This page prints the SAME sheet (the shared
// StarChartSheet the builder renders) with the family's real jobs and this
// child's name, straight from the child's app, no login.
//
// The jobs are filtered IN SQL to the whole family ones plus this child's
// own, so a sibling's jobs never leave the database. No jobs at all still
// prints a perfectly usable chart: every missing row is a dashed pen line,
// which is the paper workflow anyway. The builder's suggestion menu is
// deliberately NOT used here: printing our guesses onto a named child's
// chart invents jobs the parent never agreed to, and jobs that earn nothing
// in the app teach the child the chart lies.
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

  const jobs: SheetJob[] = (quests ?? [])
    .slice(0, MAX_ROWS)
    .map(q => ({ emoji: (q.emoji as string) || '⭐', text: q.title as string, stars: Number(q.stars) || 1 }))

  // The same Europe/London week rule the parent's builder uses: this week
  // every day except Sunday, when the chart is for the week about to start.
  const weekStart = chartWeekStart()
  const weekLabel = formatWeekBeginning(weekStart)

  return (
    // A light surface like the week page, because the sheet is white paper
    // and the anthracite child background would swallow its edges.
    <div style={{ minHeight: '100dvh', background: 'var(--butter)', padding: '18px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <KidChartToolbar token={token} weekStart={weekStart} hasJobs={jobs.length > 0} />
        {/* On a narrow phone the seven day columns crush the headers into each
            other, so the preview scrolls sideways instead. Print ignores the
            wrapper entirely: the A4 page is wider than the minimum anyway. */}
        <style>{`@media print { .sheet-scroll { overflow: visible !important } .sheet-scroll > div { min-width: 0 !important } }`}</style>
        <div className="sheet-scroll" style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 560 }}>
            <StarChartSheet name={name} weekLabel={weekLabel} jobs={jobs} />
          </div>
        </div>
      </div>
    </div>
  )
}
