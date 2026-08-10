import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// A parent says where they are with a script: read it, used it, or it does not
// apply.
//
// Small route, and the only way a script_completions row ever leaves 'opened'.
// Everything else about scripts writes 'opened' and nothing else, so this is
// the single door through which a script can start counting on the passport.
// Worth keeping it that way: the last version of this feature had one row
// meaning three things because there was no single place that decided.
//
// RLS scopes the upsert to the signed in user on its own, so a guessed sort
// order writes nothing but a row of their own.

export const dynamic = 'force-dynamic'

// 'read' joins these with migration 183. Justin, twice: reading a script
// through has to move the pathway. It is written by the end of the reader
// coming into view, never by arriving, so a glance still counts for nothing and
// migration 157's reasoning survives.
const VALID = new Set(['read', 'used', 'not_needed'])

export async function POST(req: NextRequest) {
  const { sortOrder, status, awayDays } = await req.json().catch(() => ({}))

  if (typeof sortOrder !== 'number' || !Number.isFinite(sortOrder) || !VALID.has(status)) {
    return NextResponse.json({ error: 'missing or invalid sortOrder / status' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // When a set aside script comes back round. Only ever set on not_needed, and
  // cleared when a parent changes their mind and marks it used, so a row can
  // never claim to be both finished and pending a return.
  let notNeededUntil: string | null = null
  if (status === 'not_needed') {
    const days = Number.isFinite(awayDays) && awayDays > 0 ? Math.min(365, Math.round(awayDays)) : 90
    const d = new Date(Date.now() + days * 86_400_000)
    notNeededUntil = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(d)
  }

  // READ NEVER DEMOTES. A parent who marked a script used months ago and opens
  // it again to reread should not have it quietly drop back to read, losing the
  // fact that they actually had the conversation. Used and not needed are both
  // things a person deliberately said; read is something we inferred from a
  // scroll, and an inference must not overwrite a statement.
  if (status === 'read') {
    const { data: held } = await supabase
      .from('script_completions')
      .select('status')
      .eq('user_id', user.id)
      .eq('script_sort_order', sortOrder)
      .maybeSingle()
    const now = (held as { status?: string } | null)?.status
    if (now === 'used' || now === 'not_needed') {
      return NextResponse.json({ ok: true, status: now, unchanged: true })
    }
  }

  const { error } = await supabase
    .from('script_completions')
    .upsert({
      user_id: user.id,
      script_sort_order: sortOrder,
      status,
      not_needed_until: notNeededUntil,
      // Refreshed, because saying "we used this" today is the truest possible
      // signal that today is the day it counted, and the daily path reads this.
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,script_sort_order' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, status, notNeededUntil })
}
