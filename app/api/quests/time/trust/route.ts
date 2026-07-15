import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The parent sets how much a child can do alone with their screen time:
// ask, watch or trusted. Scoped to their own children by session and RLS.

const LEVELS = ['ask', 'watch', 'trusted'] as const

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId, trust } = await req.json().catch(() => ({}))
  if (!childId || !LEVELS.includes(trust)) {
    return NextResponse.json({ error: 'childId and trust required' }, { status: 400 })
  }
  const { error } = await supabase
    .from('children').update({ device_trust: trust }).eq('id', childId).eq('parent_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
