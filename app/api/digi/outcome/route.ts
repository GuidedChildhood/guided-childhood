import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isVerdict } from '@/lib/digi/outcomes'

// The parent answers "how did that go?".
//
// This is the smallest route in the product and the one the whole learning loop
// runs through. Before it existed DiGi asked the question, the card was
// labelled "Checking back, as promised", and the only thing a parent could do
// with it was dismiss it. The promise was kept and the answer was thrown away.
//
// Three taps and an optional line. Nothing here is required reading for the
// parent and nothing chases them: a card left alone stays a card left alone,
// and "we never heard back" is itself a true thing worth being able to count.
//
// RLS does the real work. The update is scoped to the signed in user on both
// tables, so a guessed id gets nothing.

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { outcomeId, promptId, verdict, note } = await req.json().catch(() => ({}))
  if (!outcomeId || !isVerdict(verdict)) {
    return NextResponse.json({ error: 'missing or invalid outcomeId / verdict' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const parentNote = typeof note === 'string' && note.trim() ? note.trim().slice(0, 1000) : null

  const { data: row, error } = await supabase
    .from('digi_outcomes')
    .update({ verdict, parent_note: parentNote, answered_at: new Date().toISOString() })
    .eq('id', outcomeId)
    .eq('user_id', user.id)
    .select('id, suggestion, trigger, followup_id')
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // Close the card and the follow up behind it. Both are best effort: the
  // verdict is the thing that had to land, and losing a status tidy up is a
  // cosmetic problem where losing the verdict is the whole feature.
  if (promptId) {
    await supabase.from('digi_prompts')
      .update({ status: 'acted', response: parentNote })
      .eq('id', promptId).eq('user_id', user.id)
  }
  if (row.followup_id) {
    await supabase.from('digi_followups')
      .update({ status: 'answered' })
      .eq('id', row.followup_id).eq('user_id', user.id)
  }

  // "Not really" is the answer that should OPEN something rather than close it.
  // A parent who tells us a suggestion failed has just done us a favour and the
  // worst possible response is a tick and silence. The client uses this to send
  // them into DiGi with the thread already loaded, so the next thing they get
  // is a different idea rather than a form submission.
  const nextStep = verdict === 'no'
    ? {
        href: '/dashboard/digi',
        message: `We tried this and it did not work for us: ${row.suggestion}${row.trigger ? ` (${row.trigger})` : ''}. What else could we try?`,
      }
    : null

  return NextResponse.json({ ok: true, nextStep })
}
