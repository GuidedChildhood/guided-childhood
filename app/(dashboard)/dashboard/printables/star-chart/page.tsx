import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import StarChartBuilder from './StarChartBuilder'
import FridgeChartLog from '@/components/quests/FridgeChartLog'
import { chartWeekStart, starWeekEnd, formatWeekBeginning } from '@/lib/quests/star-week'
import { getTimeSettings } from '@/lib/quests/time-tiers'
import { streakCurrency } from '@/lib/pathway/streak-unlock'
import { schoolItemsForWeek, type SchoolActionRow } from '@/lib/school/week-items'

// The star chart, typed before it is printed.
//
// Not behind the paywall, unlike the bucket list builder. The Starter Pack is
// the free lead magnet the whole marketing site hands out, and a builder for a
// free product that is not itself free is a door with no room behind it.
//
// It now starts from the jobs this family ACTUALLY set, rather than from our
// menu of suggestions.
//
// The builder had its own hard coded list of eighteen jobs and no idea the
// quests board existed. So a parent who had already set "Feed the dog" and
// "Practise piano" in the app had to find them again in our menu, or type them
// again by hand, and the two drifted from that moment on: change a job in the
// app and the chart on the fridge silently still says the old one. Two places
// to keep the same truth is one too many, and the paper one is the copy nobody
// remembers to update.
//
// This matters most for exactly the family the paper chart is FOR: the child
// with no phone, whose jobs live in the app only because a parent ticks them.
// For them the printed chart is the whole interface.

export const metadata = { title: 'Star Chart Builder · Guided Childhood' }

// Force dynamic: the jobs are per family and read per request, so a cached
// render would hand one parent another parent's chart.
export const dynamic = 'force-dynamic'

export default async function StarChartPage() {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  // Signed out still gets the builder, just with our menu and no prefill. The
  // page is a free lead magnet and the Starter Pack links straight at it, so a
  // redirect to login here would close the door the marketing site opens.
  if (!user) return <StarChartBuilder />

  const [{ data: quests }, { data: kids }] = await Promise.all([
    supabase.from('family_quests')
      .select('title, emoji, stars, child_id')
      .eq('user_id', user.id)
      .eq('active', true)
      .order('created_at', { ascending: true }),
    supabase.from('children')
      .select('id, name, is_primary')
      .eq('parent_id', user.id)
      .order('is_primary', { ascending: false }),
  ])

  const named = (kids ?? []).filter(k => k.name && k.name !== 'Your child')
  const childName = (named[0]?.name as string | undefined) ?? ''
  const childOptions = named.map(k => ({ id: k.id as string, name: k.name as string }))

  // Each child's star rate (migration 225), so the deal printed on the sheet
  // is the deal the app actually pays. Fails soft to the default.
  const rateByChild: Record<string, number> = {}
  try {
    const settings = await getTimeSettings(supabase, user.id, named.map(k => ({ id: k.id as string })))
    for (const [id, s] of settings) rateByChild[id] = s.starMinutes
  } catch { /* deployment default */ }
  const defaultRate = named[0] ? rateByChild[named[0].id as string] ?? 5 : 5

  // Full days each child already has in the app, counted the one way the rest
  // of the app counts them, so the sheet's Planet Friends trail prints the
  // same progress the child's phone shows (17 November 2026 fridge redesign).
  const fullDaysByChild: Record<string, number> = {}
  try {
    await Promise.all(named.map(async k => {
      const [{ count: jobStreaks }, { count: completedDays }] = await Promise.all([
        supabase.from('job_streaks').select('id', { count: 'exact', head: true }).eq('child_id', k.id),
        supabase.from('kid_days').select('id', { count: 'exact', head: true })
          .eq('child_id', k.id).not('completed_at', 'is', null),
      ])
      fullDaysByChild[k.id as string] = streakCurrency(jobStreaks ?? 0, completedDays ?? 0)
    }))
  } catch { /* the trail prints without progress */ }

  // Whole family jobs (child_id null) belong to every child, so they carry a
  // null and the builder shows them whichever child is picked.
  const yourJobs = (quests ?? []).map(q => ({
    emoji: (q.emoji as string) || '⭐',
    text: q.title as string,
    stars: Number(q.stars) || 1,
    childId: (q.child_id as string | null) ?? null,
  }))

  // WHICH WEEKS ARE ON OFFER, and what they are honestly called.
  //
  // chartWeekStart hands back next Monday on a Sunday and this Monday on every
  // other day, which is the Sunday rhythm Justin asked for: make it on Sunday
  // and it is for the week about to start.
  //
  // The name is computed here rather than from a position in the list, because
  // on a Sunday the first entry IS next week, and a chip reading "This week"
  // over a Monday that has not arrived would be a small lie on the one control
  // whose whole job is saying which week you are printing.
  const first = chartWeekStart()
  const second = starWeekEnd(first)
  const startsTomorrow = first > new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date())
  const weeks = [
    { start: first, label: formatWeekBeginning(first), name: startsTomorrow ? 'The week ahead' : 'This week' },
    { start: second, label: formatWeekBeginning(second), name: startsTomorrow ? 'The one after' : 'Next week' },
  ]

  // What school told us, for the Our school week sheet: every open dated item
  // and every weekly routine, placed into each printable week by the shared
  // helper. Best effort: the sheet prints blank lines without it.
  const schoolItemsByWeek: Record<string, ReturnType<typeof schoolItemsForWeek>> = {}
  try {
    const { data: actions } = await supabase
      .from('school_actions')
      .select('title, kind, due_date, child_id, recurs_weekday, status')
      .eq('user_id', user.id)
      .eq('status', 'open')
      .or(`due_date.gte.${first},recurs_weekday.not.is.null`)
      .limit(200)
    const childIndex = named.map(k => k.id as string)
    for (const w of weeks) schoolItemsByWeek[w.start] = schoolItemsForWeek((actions ?? []) as SchoolActionRow[], w.start, childIndex)
  } catch { /* blank lines */ }

  return (
    <>
      <StarChartBuilder
        yourJobs={yourJobs}
        childOptions={childOptions}
        defaultChildName={childName}
        weeks={weeks}
        rateByChild={rateByChild}
        defaultRate={defaultRate}
        fullDaysByChild={fullDaysByChild}
        defaultChildId={(named[0]?.id as string | undefined) ?? null}
        schoolKids={named.map(k => k.name as string)}
        schoolItemsByWeek={schoolItemsByWeek}
      />
      {/* End of the paper week: the same entry card as the printables page,
          here because THIS is where the quest board's star chart tile lands.
          Print the week and enter the week from one place. no-print, so a
          parent printing the chart never gets this card on the sheet. The
          negative margin claws back most of the builder wrapper's 120px page
          end padding, so the card sits near the builder rather than a screen
          below it. */}
      {childOptions.length > 0 && (
        <div id="paper-week" className="no-print" style={{ scrollMarginTop: 24, maxWidth: 820, margin: '0 auto', padding: '0 20px 120px', marginTop: -80 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
            End of the paper week?
          </h2>
          <FridgeChartLog kids={childOptions} />
        </div>
      )}
    </>
  )
}
