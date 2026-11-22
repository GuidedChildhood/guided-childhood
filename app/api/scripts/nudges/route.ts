import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DID IT WORK? One tap on a script reminder (migration 402). The answer ranks
// what is sent next: "not this time" means that script is never sent again
// (lib/scripts/nudge.ts pickScript). The parent's own session answers their
// own row (RLS allows update of their own nudges only).

const ANSWERS = ['worked', 'sort_of', 'not_this_time'] as const

export async function POST(req: NextRequest) {
  const { id, worked } = await req.json().catch(() => ({}))
  if (typeof id !== 'string' || !(ANSWERS as readonly string[]).includes(worked)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { error } = await supabase
    .from('script_nudges')
    .update({ worked, answered_at: new Date().toISOString() })
    .eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
