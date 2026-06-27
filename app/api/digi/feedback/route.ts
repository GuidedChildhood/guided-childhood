import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Save a parent's response to today's reflective question
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { question, response } = await request.json()
  if (!question?.trim()) return NextResponse.json({ error: 'question is required' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]

  const { data: child } = await supabase
    .from('children')
    .select('id')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .single()

  const { error } = await supabase
    .from('digi_feedback')
    .upsert({
      user_id: user.id,
      child_id: child?.id ?? null,
      feedback_date: today,
      question: question.trim(),
      parent_response: response?.trim() ?? null,
      responded_at: response?.trim() ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,feedback_date' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

// Return today's pending feedback question (if any)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('digi_feedback')
    .select('question, parent_response, responded_at')
    .eq('user_id', user.id)
    .eq('feedback_date', today)
    .single()

  return NextResponse.json(data ?? null)
}
