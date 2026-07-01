import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { lesson_id, lesson_source } = await req.json()
  if (!lesson_id || !['lesson', 'ai_lesson'].includes(lesson_source)) {
    return NextResponse.json({ error: 'missing or invalid lesson_id / lesson_source' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('lesson_completions')
    .upsert(
      { user_id: user.id, lesson_id, lesson_source },
      { onConflict: 'user_id,lesson_id,lesson_source' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
