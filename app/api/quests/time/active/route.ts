import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStarBanks } from '@/lib/quests/bank'

// What the parent's screen time card needs in one call: each child, their star
// balance, and their live device session if one is running. Scoped to the
// parent's own children by their session and RLS.

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: children } = await supabase
    .from('children').select('id, name, device_trust').eq('parent_id', user.id).order('is_primary', { ascending: false })
  const kids = children ?? []
  if (kids.length === 0) return NextResponse.json({ children: [] })

  const ids = kids.map(c => c.id as string)
  const nowIso = new Date().toISOString()
  const [banks, { data: sessions }, { data: requests }] = await Promise.all([
    getStarBanks(supabase, user.id, ids),
    supabase.from('device_sessions')
      .select('id, child_id, device, minutes, stars, ends_at, started_at')
      .eq('user_id', user.id).eq('status', 'active').gt('ends_at', nowIso),
    supabase.from('device_requests')
      .select('id, child_id, device, minutes, created_at')
      .eq('user_id', user.id).eq('status', 'pending').order('created_at', { ascending: false }),
  ])
  const bankBy = new Map(banks.map(b => [b.child_id, b.balance]))
  const sessionBy = new Map((sessions ?? []).map(s => [s.child_id as string, s]))
  const requestBy = new Map((requests ?? []).map(r => [r.child_id as string, r]))

  return NextResponse.json({
    children: kids.map(c => ({
      id: c.id,
      name: c.name,
      trust: (c as { device_trust?: string }).device_trust ?? 'watch',
      balance: bankBy.get(c.id as string) ?? 0,
      session: sessionBy.get(c.id as string) ?? null,
      request: requestBy.get(c.id as string) ?? null,
    })),
  })
}
