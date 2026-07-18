import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// A parent flags one of DiGi's answers as off, with a short note. We keep the
// question, the answer, and their note so the team can read it and work on it.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { question, answer, note } = await request.json().catch(() => ({}))
  if (!note?.trim() && !answer?.trim()) {
    return NextResponse.json({ error: 'nothing to flag' }, { status: 400 })
  }
  const clip = (s: unknown, n: number) => (typeof s === 'string' ? s.slice(0, n) : null)

  const { error } = await supabase.from('digi_answer_flags').insert({
    user_id: user.id,
    question: clip(question, 2000),
    answer: clip(answer, 8000),
    note: clip(note, 2000),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
