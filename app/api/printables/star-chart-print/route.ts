import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// A family printed their star chart. One row in star_chart_prints (migration
// 117), which is what lets the Quests board's star chart tile say "Not printed
// yet" honestly instead of guessing.
//
// Fired from the print button rather than from any completion event, because
// pressing print IS the act. We cannot know whether paper came out the other
// end, and chasing that would mean nagging a parent to confirm something they
// have already done. Pressing print is the closest thing to the truth that
// exists, and the cost of being wrong is one badge going quiet slightly early.
//
// Deliberately silent to the caller. The chart must print whether or not this
// write lands, so the button never waits on it and never shows an error for it.

export async function POST(req: NextRequest) {
  const { childId } = await req.json().catch(() => ({}))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // A chart can be printed without picking anybody, so a child is optional.
  // When one is named it still has to be theirs.
  let child: string | null = null
  if (typeof childId === 'string' && childId) {
    const { data } = await supabase
      .from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle()
    if (data) child = data.id as string
  }

  const { error } = await supabase
    .from('star_chart_prints')
    .insert({ user_id: user.id, child_id: child })

  if (error) return NextResponse.json({ error: 'not saved' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
