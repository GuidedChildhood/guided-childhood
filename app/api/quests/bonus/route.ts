import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'

// The in the moment star: a parent spots kindness, a job done without being
// asked, a sibling looked after, and rewards it right there. Lands in the
// star_bonuses ledger (migration 086), folds straight into the child's bank,
// and pings their app with the reason, because the naming of the good thing
// is half the reinforcement. Auth is the parent's own session and the child
// must be theirs.

export async function POST(req: NextRequest) {
  const { childId, stars, note } = await req.json().catch(() => ({}))
  if (!childId || typeof childId !== 'string') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const n = Number(stars)
  if (!Number.isFinite(n) || n < 1 || n > 5) {
    return NextResponse.json({ error: 'bad stars' }, { status: 400 })
  }
  const reason = typeof note === 'string' ? note.trim().slice(0, 140) : ''

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: child } = await supabase
    .from('children').select('id, name').eq('id', childId).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'unknown child' }, { status: 404 })

  const { error } = await supabase.from('star_bonuses').insert({
    user_id: user.id, child_id: childId, stars: Math.round(n),
    note: reason || 'Spotted being brilliant',
  })
  if (error) {
    // Before migration 086 the ledger does not exist yet: say so plainly so
    // the card can tell the parent what to do, rather than a raw error.
    if (/relation|does not exist|schema|constraint/i.test(error.message)) {
      return NextResponse.json({ error: 'not ready', needsMigration: true }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // The good news lands on their device with the reason named, best effort.
  try {
    const admin = createAdminClient()
    await pushToChild(
      admin, user.id, childId,
      `${Math.round(n)} bonus star${Math.round(n) === 1 ? '' : 's'} from your grown up 💛`,
      reason ? `For ${reason.charAt(0).toLowerCase()}${reason.slice(1)}. Straight into your bank.` : 'Spotted being brilliant. Straight into your bank.',
    )
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true })
}
