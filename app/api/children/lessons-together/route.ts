import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DOES LESSONS WITH ME (sync plan G3, migration 373).
//
// The lesson's key stage decides whether a grown up reads it, so an eight
// year old reads a KS2 deck alone. The SEND lens asked for a switch a parent
// can set for any child: on, the child's lessons play the together version
// (the deck a grown up reads out, the pass counting every check question
// answered rather than every one right) and carry a read aloud button. Off
// is the age's default. Scoped to their own children by session and RLS,
// mirroring the no phone route.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId, on } = await req.json().catch(() => ({}))
  if (typeof childId !== 'string' || !childId || typeof on !== 'boolean') {
    return NextResponse.json({ error: 'childId and on required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('children').update({ lessons_together: on }).eq('id', childId).eq('parent_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, on })
}
