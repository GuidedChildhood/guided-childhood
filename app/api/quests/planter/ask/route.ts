import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { answerGardenAsk } from '@/lib/planter/server'

// The grown up's answer to "can the plants wake up early", from AskPopup.
// Scoped to the parent's own family by their session and RLS on
// planter_gardens. Yes wakes the plants now; Not now keeps the nap and the
// child's screen says so kindly. Never a flat block on either side.

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { childId?: string; askId?: string; status?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }
  const { childId, askId, status } = body
  if (typeof childId !== 'string' || typeof askId !== 'string' || (status !== 'approved' && status !== 'declined')) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const result = await answerGardenAsk(supabase, childId, askId, status)
  if (!result.ok) return NextResponse.json({ error: result.reason }, { status: 404 })
  return NextResponse.json({ ok: true, status })
}
