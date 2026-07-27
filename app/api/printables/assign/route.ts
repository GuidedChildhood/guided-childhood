import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPrintable } from '@/lib/printables/registry'
import { pushToChild } from '@/lib/quests/kid-push'

// A parent sends a printable to a child (or all their children). It lands as
// an open assignment the child app lifts to the top of their to do. The child
// prints it and does it at home; sending it to be confirmed clears the
// assignment through the existing printable done route. Session auth, scoped
// by RLS. Fails soft to needsMigration before 089.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { printable_key, child_id } = await req.json().catch(() => ({}))
  if (!printable_key || typeof printable_key !== 'string') {
    return NextResponse.json({ error: 'printable_key required' }, { status: 400 })
  }
  const printable = getPrintable(printable_key)
  if (!printable) return NextResponse.json({ error: 'unknown printable' }, { status: 404 })

  // Which children get it: the named one, or every child the parent has.
  const { data: kids } = await supabase.from('children').select('id, name').eq('parent_id', user.id)
  const targets = (kids ?? []).filter(k => !child_id || k.id === child_id)
  if (targets.length === 0) return NextResponse.json({ error: 'no child' }, { status: 400 })

  const rows = targets.map(k => ({
    user_id: user.id, child_id: k.id as string,
    printable_key: printable.key, title: printable.title, emoji: printable.emoji,
  }))
  const { error } = await supabase.from('printable_assignments').insert(rows)
  if (error) {
    if (/relation|column|schema/i.test(error.message)) return NextResponse.json({ needsMigration: true })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Tell each child, the reliable nudge plus a best effort push, so it shows
  // at the top of their app right away.
  const admin = createAdminClient()
  for (const k of targets) {
    const name = (k.name && k.name !== 'Your child') ? k.name : 'you'
    const message = `A new printable for you: ${printable.emoji} ${printable.title}. Print it, do it, then show your grown up for ${printable.stars} stars.`
    try {
      await supabase.from('kid_nudges').insert({ user_id: user.id, child_id: k.id, quest_id: null, message })
    } catch { /* pre 081, push only */ }
    try {
      await pushToChild(admin, user.id, k.id as string, `A printable for ${name} ${printable.emoji}`, message)
    } catch { /* best effort */ }
  }

  return NextResponse.json({ ok: true, sent: targets.length })
}
