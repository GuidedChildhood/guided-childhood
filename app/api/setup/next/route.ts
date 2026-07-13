import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { visibleSteps, type SetupFlags } from '@/lib/setup/steps'

// The next setup step for this parent, so the guided next step bar can walk
// them from one to the next across the app. Same flags the dashboard setup
// path computes, in one focused read. Returns the next incomplete step, or
// null when setup is done.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [child, daily, push, quests, agreement, schoolConn, schoolAction, kidLinks] = await Promise.all([
    supabase.from('children').select('id, age_band').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('daily_sessions').select('id').eq('user_id', user.id).limit(1).maybeSingle(),
    supabase.from('push_subscriptions').select('endpoint').eq('user_id', user.id).limit(1).maybeSingle(),
    supabase.from('family_quests').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('active', true),
    supabase.from('family_agreements').select('id').eq('user_id', user.id).limit(1).maybeSingle(),
    supabase.from('school_connections').select('id').eq('user_id', user.id).eq('active', true).maybeSingle(),
    supabase.from('school_actions').select('id').eq('user_id', user.id).limit(1).maybeSingle(),
    supabase.from('kid_links').select('child_id').eq('user_id', user.id),
  ])

  const phoneAge = !!child.data?.age_band && child.data.age_band !== '4-7'
  const flags: SetupFlags = {
    daily: !!daily.data,
    push: !!push.data,
    quests: (quests.count ?? 0) > 0,
    school: !!schoolConn.data || !!schoolAction.data,
    childLink: (kidLinks.data ?? []).some(k => k.child_id === child.data?.id),
    agreement: !!agreement.data,
  }

  const next = visibleSteps(phoneAge).find(s => !flags[s.key]) ?? null
  return NextResponse.json({ next, done: next === null })
}
