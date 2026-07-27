import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The settled subscriber nudge. Once a family is paying, one gentle push
// every few weeks for the single most valuable thing still missing in their
// setup, always sold on the benefit, never a chore list. Priority order:
// the birthday (the growing up switch, month and year is plenty), then the
// device safety guides, then handing an old enough child their own link.
// One nudge per user per run, each user lands in a four week bucket by a
// stable hash so nobody hears from this more than about once a month, and
// families with no push subscription are skipped entirely. Runs weekly,
// gated on CRON_SECRET like the other crons.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

function bucketOf(userId: string): number {
  let sum = 0
  for (const ch of userId) sum = (sum + ch.charCodeAt(0)) % 997
  return sum % 4
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const admin = createAdminClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 4

  // Paying families only: the nudge is aftercare, not acquisition.
  const { data: paid } = await admin
    .from('profiles')
    .select('id')
    .eq('subscription_status', 'active')
    .limit(500)

  let sent = 0
  for (const p of paid ?? []) {
    const userId = p.id as string
    if (bucketOf(userId) !== week) continue

    try {
      // No push channel means nothing to say here; the in app asks cover it.
      const { data: subs } = await admin
        .from('push_subscriptions').select('endpoint').eq('user_id', userId).is('child_id', null).limit(1)
      if (!subs?.length) continue

      // The children, with the birthday read failing soft before 083.
      let kids: { id: string; name: string | null; age_band: string | null; date_of_birth?: string | null }[] = []
      const withDob = await admin.from('children')
        .select('id, name, age_band, date_of_birth').eq('parent_id', userId)
      if (!withDob.error) kids = withDob.data ?? []
      else {
        const plain = await admin.from('children').select('id, name, age_band').eq('parent_id', userId)
        kids = (plain.data ?? []).map(k => ({ ...k, date_of_birth: 'unknown' }))
      }
      if (kids.length === 0) continue
      const nameOf = (k: { name: string | null }) => k.name && k.name !== 'Your child' ? k.name : 'your child'

      let title: string | null = null
      let body: string | null = null
      let url = '/dashboard/settings'

      const noBirthday = kids.find(k => !k.date_of_birth)
      if (noBirthday) {
        title = `One date and it all grows up with ${nameOf(noBirthday)} 🎂`
        body = `DiGi here. Add ${nameOf(noBirthday)}'s birthday in Settings, month and year is plenty, and the stage, the lessons and the screen time guide all move up on their own as they grow. Nothing to remember later.`
      } else {
        const [{ data: setup }, { data: links }] = await Promise.all([
          admin.from('device_setup_progress').select('device_key').eq('user_id', userId).limit(1),
          admin.from('kid_links').select('child_id').eq('user_id', userId),
        ])
        const linked = new Set((links ?? []).map(l => l.child_id))
        const handover = kids.find(k => k.age_band && k.age_band !== '4-7' && !linked.has(k.id))
        if (!setup?.length) {
          title = 'Ten minutes that turns Safe online green 🛡️'
          body = 'DiGi here. The device guides walk each screen with you, step by step. Families who finish them see the safety tick go green on the progress report, and the settings hold when you are not looking.'
          url = '/dashboard/devices'
        } else if (handover) {
          title = `${nameOf(handover)} can run their own side now 📲`
          body = `DiGi here. Share ${nameOf(handover)}'s own link and the jobs, the timer and the lessons land on their device. No install, no account, and you approve everything from yours.`
          url = '/dashboard/quests?tab=share'
        }
      }

      if (!title || !body) continue

      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ userId, title, body, url }),
      })
      sent += 1
    } catch { /* best effort per family */ }
  }

  return NextResponse.json({ ok: true, sent })
}
