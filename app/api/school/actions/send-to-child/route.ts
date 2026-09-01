import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendPush } from '@/lib/push/send'

// Send a school reminder to the child's phone.
//
// A REMINDER, not a job. This route used to convert the action into a one
// off family_quests row worth a star, which predates the child app having a
// school diary of its own. Justin, 11 August 2026, from Teo's balance page
// with Cubs sitting in the job list: "surely that does not affect balance,
// as just alerts not jobs." He is right: an alert that earns stars is a job
// by another name, it crowds the balance page, the star chart and the five
// a day's all jobs done gate, and it teaches the child that being reminded
// of Cubs is worth the same as making their bed.
//
// So sending now does exactly two things: marks the action sent_to_child,
// which is precisely what makes it appear in the child's own school diary
// (lib/school/child-items isChildVisible), and pushes their phone pointing
// at that diary. The reminder lives its whole life on the school rails,
// which are already holiday aware and editable from the child's own tap.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { id } = await req.json().catch(() => ({}))
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { data: action } = await supabase
    .from('school_actions')
    .select('id, kind, title, sent_to_child, child_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!action) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (action.sent_to_child) return NextResponse.json({ ok: true, already: true })

  // The action row names its own child since migration 215; the primary
  // child is only the fallback for legacy rows. This read is_primary
  // unconditionally and pushed to the whole household, so sending the older
  // child's exam reminder buzzed the younger one's phone under the wrong
  // name.
  const { data: kids } = await supabase
    .from('children')
    .select('id, name, is_primary')
    .eq('parent_id', user.id)
  const child = (action.child_id && (kids ?? []).find(k => k.id === action.child_id))
    || (kids ?? []).find(k => k.is_primary)
    || (kids ?? [])[0]
    || null
  if (!child) return NextResponse.json({ error: 'No child on the account yet' }, { status: 400 })

  const { error } = await supabase
    .from('school_actions').update({ sent_to_child: true }).eq('id', action.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Straight to THIS child's phone, best effort.
  try {
    await sendPush({
        userId: user.id,
        audience: 'kids',
        childId: child.id,
        title: 'On your calendar 🗓️',
        body: `${action.title}. It is on your calendar.`,
        url: '/',
      })
  } catch { /* best effort */ }

  return NextResponse.json({ ok: true, childName: child.name })
}
