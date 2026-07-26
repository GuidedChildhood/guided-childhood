import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// How a family answered the child phone handover prompt.
//
// 'asked' is the quiet one: they closed it without deciding, so we count the
// ask and leave them alone after a few. 'paper' and 'linked' are real answers
// and the prompt is finished for good either way.

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const action = body?.action

  if (action === 'asked') {
    // Read then write, because the count is per family and there is only ever
    // one tab doing this at a time. A lost increment here costs one extra ask,
    // which is not worth a stored procedure.
    const { data } = await supabase
      .from('profiles').select('handover_asks').eq('id', user.id).maybeSingle()
    const asks = Number((data as { handover_asks?: number } | null)?.handover_asks ?? 0)
    const { error } = await supabase
      .from('profiles').update({ handover_asks: asks + 1 }).eq('id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, asks: asks + 1 })
  }

  if (action === 'paper' || action === 'linked') {
    const { error } = await supabase
      .from('profiles').update({ handover_choice: action }).eq('id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, choice: action })
  }

  return NextResponse.json({ error: 'bad request' }, { status: 400 })
}
