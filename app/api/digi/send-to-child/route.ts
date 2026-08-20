import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'

// ── DIGI'S WORDS, ONTO THE CHILD'S OWN SCREEN ───────────────────────────────
//
// Justin, 19 August 2026: "when we say put this into words for children there
// should be a send to their phone option."
//
// The moment already exists and is one of the best in the product: a parent
// asks DiGi to put something in words their child can read, and DiGi writes it
// for that child at that age. Then the parent had to hand their own phone over
// or read it aloud. This closes the last metre: one tap, and the words arrive
// on the child's device, from the app the child already trusts.
//
// It lands in two places, deliberately. A kid_nudges row, so the message is
// waiting INSIDE their app whether or not the push arrives, and a push, which
// is best effort the way every push here is. A child with no app gets an
// honest refusal the button can explain, rather than a silent nothing.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { text, child_id } = await req.json().catch(() => ({})) as { text?: string; child_id?: string }
  const message = typeof text === 'string' ? text.trim().slice(0, 1200) : ''
  if (!message || !child_id || typeof child_id !== 'string') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  // Theirs, checked. And the child needs their own app for this to mean
  // anything, so no link is a 409 the button can turn into honest words.
  const [{ data: child }, { data: link }] = await Promise.all([
    supabase.from('children').select('id, name').eq('id', child_id).eq('parent_id', user.id).maybeSingle(),
    supabase.from('kid_links').select('child_id').eq('child_id', child_id).maybeSingle(),
  ])
  if (!child) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  if (!link) return NextResponse.json({ error: 'no app' }, { status: 409 })

  const { error } = await supabase.from('kid_nudges').insert({
    user_id: user.id, child_id: child.id, message,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try {
    await pushToChild(
      createAdminClient(), user.id, child.id,
      'A note from your grown up 💛',
      // The push teases rather than carries: the full words are in their app,
      // and a lock screen is nobody's place for a paragraph about bedtime.
      'DiGi helped write something for you. Open your app to read it.',
    )
  } catch { /* the nudge is already waiting in their app */ }

  return NextResponse.json({ ok: true, childName: child.name })
}
