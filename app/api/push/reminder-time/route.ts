import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { REMINDER_EARLIEST, REMINDER_LATEST } from '@/lib/push/evening'

// The parent's evening reminder time (migration 298). Null means learn it
// from when they usually finish; see lib/push/evening.ts for the rule.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { data } = await supabase.from('profiles').select('reminder_minutes').eq('id', user.id).maybeSingle()
  return NextResponse.json({ minutes: (data?.reminder_minutes as number | null) ?? null })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({} as { minutes?: number | null }))
  const raw = body.minutes
  let minutes: number | null = null
  if (raw !== null && raw !== undefined) {
    const n = Number(raw)
    if (!Number.isInteger(n) || n < REMINDER_EARLIEST || n > REMINDER_LATEST || n % 30 !== 0) {
      return NextResponse.json({ error: 'Pick a half hour between 5pm and 10pm, or let it learn' }, { status: 400 })
    }
    minutes = n
  }
  const { error } = await supabase.from('profiles').update({ reminder_minutes: minutes }).eq('id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, minutes })
}
