import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'

// The kid finished everything on today's list and wants more. Same
// trust model as ticking: the link token is the auth. The parent gets
// a nudge pointing at the quest manager, nothing else happens.

export async function POST(req: NextRequest) {
  const { token } = await req.json()
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const { data: child } = await supabase
    .from('children')
    .select('name')
    .eq('id', link.child_id)
    .maybeSingle()
  const name = child?.name ?? 'Your child'

  try {
    await sendPush({
        userId: link.user_id,
        title: `${name} wants more quests ⭐`,
        body: `Everything on today's list is done and ${name} is asking for more. Add one or two?`,
        url: '/dashboard/quests/manage',
      })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true })
}
