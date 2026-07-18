import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// A parent asks DiGi for a script we do not have yet, in their own words. We log
// it so the founder sees real demand in the insights dashboard and can write the
// next script from what parents actually need. The closest existing script we
// pointed them at is stored too, so patterns are easy to read.

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { problem, matchedSortOrder } = await request.json().catch(() => ({}))
  const p = typeof problem === 'string' ? problem.trim() : ''
  if (p.length < 4) return NextResponse.json({ error: 'Tell DiGi a little more' }, { status: 400 })

  const { error } = await supabase.from('script_requests').insert({
    user_id: user.id,
    problem: p.slice(0, 1000),
    matched_sort_order: typeof matchedSortOrder === 'number' ? matchedSortOrder : null,
  })
  if (error) return NextResponse.json({ error: 'Could not send' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
