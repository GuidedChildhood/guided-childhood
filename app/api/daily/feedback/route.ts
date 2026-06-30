import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Store which daily moments happened today so tomorrow's card can be personalised
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { moments } = await request.json() as { moments: string[] }

  const today = new Date().toISOString().split('T')[0]

  await supabase
    .from('daily_sessions')
    .upsert(
      { user_id: user.id, session_date: today, moment_feedback: moments },
      { onConflict: 'user_id,session_date' }
    )

  return NextResponse.json({ saved: true })
}
