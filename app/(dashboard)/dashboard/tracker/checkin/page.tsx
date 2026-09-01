import { createClient } from '@/lib/supabase/server'
import { getChildren } from '@/lib/children/server'
import { redirect } from 'next/navigation'
import { type WellbeingCheck } from '../TrackerForm'
import CheckinGate from './CheckinGate'

// The weekly check in form, moved to its own route: the ritual, not the
// destination. The Progress page is what the tab opens.

export default async function CheckinPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Has this parent said yes to us keeping wellbeing data? Article 9 consent,
  // asked separately from signing up, so it lives on its own column rather than
  // being assumed from having an account.
  const { data: profile } = await supabase
    .from('profiles')
    .select('wellbeing_consent_at')
    .eq('id', user.id)
    .maybeSingle()

  // The check in is about ONE child: honour ?child= like the rest of the
  // dashboard. Also .single() errored outright with two primaries or none.
  const { child } = await getChildren<{ id: string; streak_weeks: number | null; actions_this_week: number | null; is_primary: boolean | null }>(
    supabase, user.id, childParam, 'id, streak_weeks, actions_this_week')

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]

  // THIS child's weeks (legacy rows with no child speak for the household),
  // so one child's history never reads as the other's.
  const historyQuery = supabase
    .from('wellbeing_checks')
    .select('week_start, mood_score, sleep_score, social_score, screen_mood_score, open_communication, concern_level, notes')
    .eq('parent_id', user.id)
    .order('week_start', { ascending: false })
    .limit(8)
  const { data: history } = await (child
    ? historyQuery.or(`child_id.eq.${child.id},child_id.is.null`)
    : historyQuery)

  const checks = (history ?? []) as WellbeingCheck[]
  const currentWeekCheck = checks.find(c => c.week_start === weekStartStr) ?? null

  return (
    <CheckinGate
      hasConsent={!!profile?.wellbeing_consent_at}
      history={checks}
      currentWeekCheck={currentWeekCheck}
      streakWeeks={child?.streak_weeks ?? 0}
      actionsThisWeek={child?.actions_this_week ?? 0}
    />
  )
}
