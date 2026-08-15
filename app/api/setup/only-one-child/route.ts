import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// "It is just the one." The second door on the fourth Setup Quest step.
//
// This IS a parent's assertion, and unlike the home screen step that is exactly
// right: only they know who lives in their house, and there is nothing to
// detect. The rule the plan sets is that a step must not tick from being LOOKED
// at, and an answer typed by the parent is not looking, it is answering. The
// share step's "no phone, keep it on the fridge" works the same way.
//
// Stamped once and never moved, so the date records when they told us rather
// than when they last opened the page. That matters for asking again: a family
// who said one child two years ago may not have one child now.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('profiles')
    .update({ only_one_child_at: new Date().toISOString() })
    .eq('id', user.id)
    .is('only_one_child_at', null)

  if (error) return NextResponse.json({ error: 'save failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
