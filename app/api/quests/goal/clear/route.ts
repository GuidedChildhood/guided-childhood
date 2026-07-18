import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child ticks a redeemed reward off for good. The link token is the auth,
// same as ticking a quest. It only clears a goal that has actually been
// redeemed (achieved_at set), so an active goal can never be wiped by mistake.
// Deleting the finished row is what makes the tick stick everywhere, not just on
// the one device, so it never comes back on the next open.

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const { error } = await supabase
    .from('star_goals')
    .delete()
    .eq('child_id', link.child_id)
    .not('achieved_at', 'is', null)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
