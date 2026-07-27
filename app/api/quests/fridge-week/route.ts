import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The paper chart, folded into the app. A family who ran the week on the fridge
// Starter Pack chart taps in the stars the child earned offline, and they land
// in the same star_bonuses ledger the bank reads, so the offline week and the
// app balance agree and those stars can be spent as screen time exactly like
// the earned ones. The ledger caps a single row at 20 stars, so a bigger week
// is written as a few rows that sum to the total. Parent session plus the
// child must be theirs. For jobs done on paper, not ones already ticked in the
// app, so nothing is counted twice.

const MAX_WEEK = 70 // five daily jobs across a week, plus a generous margin

export async function POST(req: NextRequest) {
  const { childId, stars } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const total = Math.round(Number(stars))
  if (!Number.isFinite(total) || total < 1 || total > MAX_WEEK) {
    return NextResponse.json({ error: 'bad stars' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: child } = await supabase
    .from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  // Chunk into rows of at most 20 to respect the ledger's per row check.
  const rows: { user_id: string; child_id: string; stars: number; note: string }[] = []
  let left = total
  while (left > 0) {
    const chunk = Math.min(20, left)
    rows.push({ user_id: user.id, child_id: childId, stars: chunk, note: 'Fridge chart, this week' })
    left -= chunk
  }

  const { error } = await supabase.from('star_bonuses').insert(rows)
  if (error) {
    if (/relation|does not exist|schema|constraint/i.test(error.message)) {
      return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, added: total })
}
