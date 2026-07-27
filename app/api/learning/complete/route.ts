import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// A learning sheet has been worked through. What comes back is the list of
// things the child found hard, and the stars.
//
// The flags arrive as objective ids, never as text, so the parent summary can
// always name the exact statutory line rather than an approximation of it. Ids
// that do not belong to the sheet that was asked for are dropped rather than
// trusted: the client is a form, not an authority.
//
// No score is recorded and none is returned. Not an oversight, a decision, and
// the one most likely to be undone by accident later: a child who is given a
// mark stops flagging what they found hard, and that flag is the entire point
// of the sheet. The parent gets the substance without a number on their child.

export const dynamic = 'force-dynamic'

const SUBJECTS = ['maths', 'english', 'reading']
const TERMS = ['autumn', 'spring', 'summer']
// A sheet is a decent chunk of focused work away from a screen, so it pays like
// the better printables rather than like a two minute job.
const SHEET_STARS = 5

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const childId = typeof body.child_id === 'string' ? body.child_id : null
  const yearGroup = Number(body.year_group)
  const subject = SUBJECTS.includes(body.subject) ? body.subject : null
  const term = TERMS.includes(body.term) ? body.term : null
  const tricky: string[] = Array.isArray(body.tricky) ? body.tricky.filter((t: unknown) => typeof t === 'string') : []

  if (!childId || !subject || !term || !Number.isInteger(yearGroup) || yearGroup < 1 || yearGroup > 6) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  // The child must belong to this parent.
  const { data: child } = await supabase
    .from('children').select('id, name').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  // Only flags that are genuinely on this sheet. A posted id for some other
  // year's objective would otherwise show up in the parent summary as a thing
  // their child struggles with, which is worse than losing the flag.
  let valid: string[] = []
  if (tricky.length > 0) {
    const { data: onSheet } = await supabase
      .from('curriculum_objectives')
      .select('id')
      .eq('year_group', yearGroup).eq('subject', subject).eq('term', term)
      .in('id', tricky.slice(0, 100))
    valid = (onSheet ?? []).map(o => o.id as string)
  }

  const { data: saved, error } = await supabase
    .from('learning_sheet_results')
    .insert({
      user_id: user.id, child_id: childId,
      year_group: yearGroup, subject, term,
      tricky: valid, stars: SHEET_STARS,
    })
    .select('id')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // The stars land through the same ledger the bank already reads, so a sheet
  // counts exactly like a job or a printable and shows on the off screen total.
  try {
    await supabase.from('star_bonuses').insert({
      user_id: user.id, child_id: childId, stars: SHEET_STARS,
      note: `Learning sheet done: Year ${yearGroup} ${subject} 📄`,
    })
  } catch { /* the result still stands */ }

  return NextResponse.json({ ok: true, id: saved.id, stars: SHEET_STARS, flagged: valid.length })
}
