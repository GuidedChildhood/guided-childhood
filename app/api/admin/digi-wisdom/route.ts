import { createClient } from '@/lib/supabase/server'
import { rebuildWisdom } from '@/lib/digi/wisdom'
import { NextResponse } from 'next/server'

// Founder facing, on demand: rebuild the aggregate wisdom corpus now and return
// what it wrote. Shares the exact implementation the weekly cron uses.

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  try {
    const result = await rebuildWisdom()
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Wisdom rebuild failed' }, { status: 502 })
  }
}
