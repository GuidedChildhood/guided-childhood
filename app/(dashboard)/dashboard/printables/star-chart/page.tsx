import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StarChartBuilder from './StarChartBuilder'

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

export const metadata = { title: 'Star Chart Builder — Guided Childhood' }

// Force dynamic: the jobs are per family and read per request, so a cached
// render would hand one parent another parent's chart.
export const dynamic = 'force-dynamic'

export default async function StarChartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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

  // Whole family jobs (child_id null) belong to every child, so they carry a
  // null and the builder shows them whichever child is picked.
  const yourJobs = (quests ?? []).map(q => ({
    emoji: (q.emoji as string) || '⭐',
    text: q.title as string,
    stars: Number(q.stars) || 1,
    childId: (q.child_id as string | null) ?? null,
  }))

  return <StarChartBuilder yourJobs={yourJobs} childOptions={childOptions} defaultChildName={childName} />
}
