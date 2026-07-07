import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Turn a school action into something the child actually does, not just
// something the parent reads. It lands as a one off quest on the
// child's own quest page, ticks and approves through the normal star
// rails, and a push goes straight to the child's phone if they have
// reminders on.

const KIND_EMOJI: Record<string, string> = {
  kit: '🎒', payment: '💷', homework: '📖', event: '📅', deadline: '⏰', notice: '📌',
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { id } = await req.json().catch(() => ({}))
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { data: action } = await supabase
    .from('school_actions')
    .select('id, kind, title, sent_to_child')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!action) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (action.sent_to_child) return NextResponse.json({ ok: true, already: true })

  const { data: child } = await supabase
    .from('children')
    .select('id, name')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()
  if (!child) return NextResponse.json({ error: 'No child on the account yet' }, { status: 400 })

  const { data: quest, error: questError } = await supabase
    .from('family_quests')
    .insert({
      user_id: user.id,
      child_id: child.id,
      title: action.title,
      emoji: KIND_EMOJI[action.kind] ?? '📌',
      stars: 1,
      schedule: 'once',
    })
    .select('id')
    .single()
  if (questError || !quest) {
    return NextResponse.json({ error: questError?.message ?? 'could not save' }, { status: 500 })
  }

  await supabase.from('school_actions').update({ sent_to_child: true }).eq('id', action.id)

  // Straight to the child's phone, best effort.
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: user.id,
        audience: 'kids',
        title: 'From home ⭐',
        body: `${action.title}. Tick it off on your quests when it is sorted.`,
        url: '/',
      }),
    })
  } catch { /* best effort */ }

  return NextResponse.json({ ok: true, childName: child.name })
}
