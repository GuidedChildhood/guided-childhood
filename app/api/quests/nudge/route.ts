import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'

// The Remind button on a blocking job: one tap sends the child a warm nudge.
// The push is best effort (their phone may not be set up), but the in app
// nudge ALWAYS lands, so the child sees it on their own dashboard next open:
// "Your grown up asked: tidy your bedroom, then your timer can start". Scoped
// to the parent's own child and quest by session and RLS.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // questId is OPTIONAL now.
  //
  // Justin, looking at a Quests board reading "Nothing waiting on you, 10 jobs
  // on their app" while Teo had done none of them: "could also add send a
  // reminder to Teo to ask him to check jobs before device timer".
  //
  // The board was right and useless in the same breath. Nothing is waiting on
  // the PARENT, so the row says all clear, while ten jobs sit untouched on the
  // child's side and the only thing that would move them is a tap the parent
  // has no way to send. Remind existed but only ever attached to one named
  // blocking job, which is the wrong shape here: there is no single job to
  // point at, there are ten, and the ask is simply go and look.
  //
  // So a nudge with no quest is a general one. Same table, same push, same
  // dedupe, different sentence.
  const { childId, questId } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string') {
    return NextResponse.json({ error: 'childId required' }, { status: 400 })
  }
  const oneJob = typeof questId === 'string' && questId.length > 0

  const [{ data: child }, { data: quest }] = await Promise.all([
    supabase.from('children').select('id, name').eq('id', childId).eq('parent_id', user.id).maybeSingle(),
    oneJob
      ? supabase.from('family_quests').select('id, title').eq('id', questId).eq('user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })
  if (oneJob && !quest) return NextResponse.json({ error: 'unknown quest' }, { status: 404 })

  // The general one names the timer, because that is the thing the child
  // actually wants and the honest reason to go and look. It is not a telling
  // off and it does not count anything at them.
  const message = quest
    ? `Your grown up asked: ${quest.title}, then your timer can start 🌱`
    : 'Have a look at your jobs before you start your timer 🌱'

  // The nudge row always lands, once: an unread nudge for the same job is
  // not stacked again, so tapping Remind twice never piles up the child's
  // screen. Fails soft before migration 081, when only the push can carry it.
  let stored = false
  try {
    // Matched on the same shape it would be written as, so a general reminder
    // dedupes against another general reminder and not against a job specific
    // one. is null rather than eq for the general case: eq(null) matches
    // nothing in Postgres, which would have let them stack up.
    const seek = supabase
      .from('kid_nudges').select('id')
      .eq('child_id', childId).eq('seen', false)
    const { data: existing, error: readErr } = await (oneJob
      ? seek.eq('quest_id', questId)
      : seek.is('quest_id', null)
    ).limit(1).maybeSingle()
    if (!readErr && existing?.id) {
      stored = true
    } else if (!readErr) {
      const { error: insErr } = await supabase.from('kid_nudges').insert({
        user_id: user.id, child_id: childId, quest_id: oneJob ? questId : null, message,
      })
      stored = !insErr
    }
  } catch { /* pre migration database, push only this time */ }

  // The push, if their device is set up for reminders.
  try {
    await pushToChild(createAdminClient(), user.id, childId, quest ? 'A job to do 🌱' : 'Your jobs are waiting 🌱', message)
  } catch { /* best effort */ }

  return NextResponse.json({ ok: true, stored })
}
