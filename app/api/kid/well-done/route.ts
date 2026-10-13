import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { readCallsGrownUp, senderWord } from '@/lib/kid/calls-grown-up'
import { ukToday } from '@/lib/kid/five-a-day'

// SEND A WELL DONE (13 October 2026). Justin approved the parent side of the
// child's home: the child's finished days and passed lessons reach the bell,
// each with one tap that sends a well done the child reads on their own home.
// It is a note like every other (kid_nudges), named the way the child names
// the grown up ("Dad says well done ..."), and marked kind 'well_done' with a
// ref for what it was for, so the win leaves the bell and is never sent twice
// (a unique index in migration 376). Before that migration the note still
// lands, plain; the win then simply stays in the bell for its two days.

const REF = /^(day:\d{4}-\d{2}-\d{2}|lesson:[0-9a-f-]{36})$/

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { childId, ref } = await req.json().catch(() => ({}))
  if (typeof childId !== 'string' || typeof ref !== 'string' || !REF.test(ref)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const { data: child } = await supabase.from('children').select('id').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  const who = senderWord(await readCallsGrownUp(supabase, childId))
  const what = ref.startsWith('lesson:')
    ? 'passing your lesson'
    : ref === `day:${ukToday()}` ? 'finishing your five today' : 'finishing your five'
  const message = `${who} says well done for ${what}! ⭐`

  let stored = false
  const row = { user_id: user.id, child_id: childId, quest_id: null, message }
  const { error } = await supabase.from('kid_nudges').insert({ ...row, kind: 'well_done', ref })
  if (!error) stored = true
  else if (error.code === '23505') return NextResponse.json({ ok: true, stored: true, already: true })
  else {
    // Before migration 376: no kind or ref column. The note still lands.
    const { error: plainErr } = await supabase.from('kid_nudges').insert(row)
    stored = !plainErr
  }
  if (!stored) return NextResponse.json({ error: 'could not send' }, { status: 500 })

  try { await pushToChild(createAdminClient(), user.id, childId, 'Well done ⭐', message) } catch { /* best effort, the note is on their home */ }
  return NextResponse.json({ ok: true, stored })
}
