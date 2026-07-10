import type { createClient } from '@/lib/supabase/server'
import { getJourney } from '@/lib/pathway/journey'
import type { StageId } from '@/lib/pathway/progress'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// Smart alerts: one read and rank over what a family has and has not done,
// returning the single most useful things they could do now. The home shows
// the top one or two. Pure read, no new tables. Ranked by urgency with a
// calm cap, so it surfaces the service without ever nagging. See
// plans/smart-alerts-plan.md.

export type SuggestionKind = 'school' | 'script' | 'device' | 'quest' | 'ping' | 'lesson' | 'digi' | 'win'

export interface Suggestion {
  key: string       // stable id for the dismiss cool off
  kind: SuggestionKind
  urgency: number   // higher first
  emoji: string
  title: string
  body: string
  cta: string
  href: string      // the single action
}

export async function getSuggestions(
  supabase: SupabaseClient,
  userId: string,
  opts: { childName: string | null; childId: string | null; stageId: StageId; ukHour: number },
): Promise<Suggestion[]> {
  const { childId, stageId, ukHour } = opts
  const name = (opts.childName && opts.childName !== 'Your child') ? opts.childName : 'your child'

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const todayIso = todayStart.toISOString()
  const todayDate = new Date().toISOString().slice(0, 10)
  const in2days = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)

  const win21 = new Date(Date.now() - 21 * 86400000).toISOString()
  const [journey, schoolSoon, questCount, concernToday, recurringConcern, recentWin] = await Promise.all([
    getJourney(supabase, userId, stageId),
    supabase.from('school_actions').select('title, due_date').eq('user_id', userId).eq('status', 'open').not('due_date', 'is', null).gte('due_date', todayDate).lte('due_date', in2days).order('due_date', { ascending: true }).limit(1),
    supabase.from('family_quests').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('active', true),
    supabase.from('concerns').select('label, slug').eq('user_id', userId).eq('status', 'open').gte('last_flagged_at', todayIso).order('last_flagged_at', { ascending: false }).limit(1),
    supabase.from('concerns').select('label, slug, times_flagged').eq('user_id', userId).eq('status', 'open').gte('times_flagged', 3).order('times_flagged', { ascending: false }).limit(1),
    // A recent win to celebrate: a concern turned around in the last three
    // weeks. Momentum, not only problems, so the family in view is one that is
    // making progress. The dismiss cool off keeps it from repeating.
    supabase.from('concerns').select('label, slug, status').eq('user_id', userId).in('status', ['resolved', 'improving']).gte('last_flagged_at', win21).order('last_flagged_at', { ascending: false }).limit(1),
  ])

  // Only look for a kid link when it can pay off, at screen off time.
  let hasKidLink = false
  if (childId && ukHour >= 17 && ukHour < 20) {
    const { data } = await supabase.from('kid_links').select('token').eq('child_id', childId).maybeSingle()
    hasKidLink = !!data?.token
  }

  const s: Suggestion[] = []

  const school = schoolSoon.data?.[0]
  if (school) s.push({
    key: `school:${school.title}`, kind: 'school', urgency: 9, emoji: '🎒',
    title: `Coming up: ${school.title}`,
    body: 'Sort it tonight while it is easy, or send the reminder to their phone.',
    cta: 'Open school reminders', href: '/dashboard/school',
  })

  const flagged = concernToday.data?.[0]
  if (flagged) s.push({
    key: `script:${flagged.slug}`, kind: 'script', urgency: 8, emoji: '💬',
    title: `You flagged ${flagged.label.toLowerCase()} today`,
    body: 'There are word for word scripts for exactly this. Open one for tonight.',
    cta: 'Find the words', href: '/dashboard/scripts',
  })

  if (journey.devices.total > 0 && journey.devices.done < journey.devices.total) s.push({
    key: 'device:next', kind: 'device', urgency: 6, emoji: '🛡️',
    title: `Set up ${journey.devices.nextName ?? 'the next device'}`,
    body: 'One setup protects a screen your family uses. A few minutes now.',
    cta: 'Set it up', href: journey.devices.href,
  })

  if ((questCount.count ?? 0) === 0) s.push({
    key: 'quest:none', kind: 'quest', urgency: 6, emoji: '⭐',
    title: `Set ${name}'s first quests`,
    body: 'Everyday jobs earn stars, stars buy the screen time you agree. Two minutes.',
    cta: 'Set up quests', href: '/dashboard/quests',
  })

  if (hasKidLink) s.push({
    key: 'ping:evening', kind: 'ping', urgency: 5, emoji: '📲',
    title: `A gentle nudge to ${name}`,
    body: 'Send a come off screens ping straight to their phone.',
    cta: 'Send a ping', href: '/dashboard/quests',
  })

  const rc = recurringConcern.data?.[0]
  if (rc) s.push({
    key: `digi:${rc.slug}`, kind: 'digi', urgency: 5, emoji: '◎',
    title: `${rc.label} keeps coming up`,
    body: `It has come up ${rc.times_flagged} times. Let DiGi build you a proper plan.`,
    cta: 'Talk to DiGi', href: `/dashboard/digi?q=${encodeURIComponent('Help me with ' + rc.label)}`,
  })

  if (journey.lessons.total > 0 && journey.lessons.done < journey.lessons.total && journey.lessons.nextTitle) s.push({
    key: 'lesson:next', kind: 'lesson', urgency: 3, emoji: '✦',
    title: `Do a lesson with ${name}`,
    body: `Next up: ${journey.lessons.nextTitle}. Calm, a few minutes, together.`,
    cta: 'Open the lesson', href: journey.lessons.href,
  })

  const win = recentWin.data?.[0]
  if (win) s.push({
    key: `win:${win.slug}`, kind: 'win', urgency: 4, emoji: '🎉',
    title: win.status === 'resolved' ? `You turned ${win.label.toLowerCase()} around` : `${win.label} is getting better`,
    body: 'That is a real win, and you earned it. See it land on the passport, and the next stamp waiting.',
    cta: 'See your passport', href: '/dashboard/tracker',
  })

  return s.sort((a, b) => b.urgency - a.urgency)
}
