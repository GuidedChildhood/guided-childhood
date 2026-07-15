import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarBanks } from '@/lib/quests/bank'

// The child cashes in the reward they have been saving for. The link token is
// the auth, same as ticking. It only goes through when the bank truly holds
// enough stars, spends exactly the goal's cost (so the bank stays honest),
// marks the goal redeemed, and tells the parent so they can hand over the real
// reward. One redemption per goal, until the parent sets a new one.

export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const { data: goal } = await supabase
    .from('star_goals').select('id, title, stars_needed, achieved_at')
    .eq('child_id', link.child_id).maybeSingle()
  if (!goal) return NextResponse.json({ error: 'no goal' }, { status: 404 })
  if (goal.achieved_at) return NextResponse.json({ error: 'already redeemed', already: true }, { status: 400 })

  const cost = goal.stars_needed
  const [bank] = await getStarBanks(supabase, link.user_id, [link.child_id])
  if (!bank || bank.balance < cost) {
    return NextResponse.json({ error: 'not enough stars', balance: bank?.balance ?? 0 }, { status: 400 })
  }

  // Spend the stars (a reward has no minutes) and mark the goal redeemed.
  const { error: spendError } = await supabase.from('star_spends').insert({
    user_id: link.user_id, child_id: link.child_id, stars: cost, minutes: 0,
    note: `🎁 Reward: ${goal.title}`,
  })
  if (spendError) return NextResponse.json({ error: spendError.message }, { status: 500 })
  await supabase.from('star_goals').update({ achieved_at: new Date().toISOString() }).eq('id', goal.id)

  // Tell the parent so they can hand the reward over.
  try {
    const { data: kid } = await supabase.from('children').select('name').eq('id', link.child_id).maybeSingle()
    const name = kid?.name ?? 'Your child'
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: link.user_id,
        title: `${name} earned their reward! 🎉`,
        body: `They saved ${cost} stars for "${goal.title}". Time to make it happen, then set the next goal.`,
        url: '/dashboard/quests',
      }),
    })
  } catch { /* best effort */ }

  return NextResponse.json({ ok: true, balance: bank.balance - cost })
}
