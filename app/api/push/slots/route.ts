import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The parent's answer to "when do you want your daily nudge?". Reads and
// writes the slots on their own parent subscriptions (RLS scoped), so every
// device they have follows the same choice.

const VALID = ['morning', 'afternoon', 'evening'] as const

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('push_subscriptions')
    .select('slots')
    .eq('user_id', user.id)
    .is('child_id', null)
    .limit(1)
    .maybeSingle()

  return NextResponse.json({ slots: data?.slots ?? [...VALID] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({} as { slots?: string[] }))
  const slots = Array.isArray(body.slots)
    ? body.slots.filter((s: string) => (VALID as readonly string[]).includes(s))
    : null
  if (!slots || slots.length === 0) {
    return NextResponse.json({ error: 'Pick at least one time' }, { status: 400 })
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .update({ slots })
    .eq('user_id', user.id)
    .is('child_id', null)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, slots })
}
