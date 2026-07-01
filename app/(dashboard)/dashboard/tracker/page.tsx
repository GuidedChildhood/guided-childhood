import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TrackerForm, { type WellbeingCheck } from './TrackerForm'

export default async function TrackerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('id, streak_weeks, actions_this_week')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .single()

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const { data: history } = await supabase
    .from('wellbeing_checks')
    .select('week_start, mood_score, sleep_score, social_score, screen_mood_score, open_communication, concern_level, notes')
    .eq('parent_id', user.id)
    .order('week_start', { ascending: false })
    .limit(8)

  const checks = (history ?? []) as WellbeingCheck[]
  const currentWeekCheck = checks.find(c => c.week_start === weekStartStr) ?? null

  return (
    <TrackerForm
      history={checks}
      currentWeekCheck={currentWeekCheck}
      streakWeeks={child?.streak_weeks ?? 0}
      actionsThisWeek={child?.actions_this_week ?? 0}
    />
  )
}
