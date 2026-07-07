import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// The parent's own verdict on a concern from the Progress page: solved,
// still going, or stuck and wanting help. Solved marks it resolved, stuck
// keeps it open and stamps that it was looked at today so the daily loop
// does not nag about it again the same day. Need help is handled on the
// client for now as an email to the team, no status change.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { slug, status } = await request.json() as { slug?: string; status?: string }
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  if (status !== 'resolved' && status !== 'open') {
    return NextResponse.json({ error: 'status must be resolved or open' }, { status: 400 })
  }

  const { error } = await supabase
    .from('concerns')
    .update({ status, last_checked_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('slug', slug)

  if (error) return NextResponse.json({ error: 'could not update' }, { status: 500 })
  return NextResponse.json({ saved: true, status })
}
