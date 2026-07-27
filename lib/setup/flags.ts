import { visibleSteps, type SetupFlags, type SetupStep } from './steps'

// The setup state in one place, so the Home entry and the dedicated Setup
// hub read exactly the same flags and step list. Setup is one time work; it
// lives on its own page, and Home only carries a compact way in until it is
// done. This is the read that powers both.

type FlagClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export type SetupState = {
  flags: SetupFlags
  phoneAge: boolean
  steps: SetupStep[]
  doneCount: number
  total: number
  complete: boolean
  current: SetupStep | null
}

export async function getSetupState(supabase: FlagClient, userId: string): Promise<SetupState> {
  const [child, agreement, questsCount, school, anySchool, push, daily, kidLinks, birthdays] = await Promise.all([
    supabase.from('children').select('id, age_band').eq('parent_id', userId).eq('is_primary', true).maybeSingle(),
    supabase.from('family_agreements').select('id').eq('user_id', userId).limit(1).maybeSingle(),
    supabase.from('family_quests').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('active', true),
    supabase.from('school_connections').select('id').eq('user_id', userId).eq('active', true).maybeSingle(),
    supabase.from('school_actions').select('id').eq('user_id', userId).limit(1).maybeSingle(),
    supabase.from('push_subscriptions').select('endpoint').eq('user_id', userId).limit(1).maybeSingle(),
    supabase.from('daily_sessions').select('id').eq('user_id', userId).limit(1).maybeSingle(),
    supabase.from('kid_links').select('child_id').eq('user_id', userId),
    supabase.from('children').select('date_of_birth').eq('parent_id', userId),
  ])

  const phoneAge = !!child.data?.age_band && child.data.age_band !== '4-7'
  const flags: SetupFlags = {
    agreement: !!agreement.data,
    quests: (questsCount.count ?? 0) > 0,
    school: !!school.data || !!anySchool.data,
    push: !!push.data,
    daily: !!daily.data,
    childLink: (kidLinks.data ?? []).some(k => k.child_id === child.data?.id),
    birthday: allBirthdaysIn(birthdays),
  }

  const steps = visibleSteps(phoneAge)
  const doneCount = steps.filter(s => flags[s.key]).length
  const current = steps.find(s => !flags[s.key]) ?? null

  return { flags, phoneAge, steps, doneCount, total: steps.length, complete: current === null, current }
}

// Done means every child on the account has a birthday, not just the primary
// one. A second child with no date is a second learning sheet that cannot be
// built, so the step stays open until the whole family is in.
//
// It reads done in two cases where we genuinely have nothing to ask for: an
// account with no children yet, which onboarding is about to fix anyway, and an
// error on the read. That second one matters. The column arrives with migration
// 083, and on a deploy where it has not run the select fails, so failing to
// "done" is the difference between a quiet path and a step every parent is
// shown, cannot complete, and cannot get rid of.
export function allBirthdaysIn(
  result: { data: { date_of_birth?: string | null }[] | null; error?: unknown } | null,
): boolean {
  if (!result || result.error || !result.data) return true
  return !result.data.some(row => !row.date_of_birth)
}
