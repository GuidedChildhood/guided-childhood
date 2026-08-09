import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { STEPS, ukToday, type StepKey } from '@/lib/kid/five-a-day'

// One nudge a day about the five, on the child's own phone.
//
// Justin, 9 August 2026: "we need to make this really work and add a reminder
// somewhere and track if done somehow."
//
// Built to the same rules as job-reminders, which is the restraint this product
// already argued out once and should not argue out twice:
//
//   ONE push per child per day, however many steps are open. A child with four
//   left gets one message, not four.
//
//   NOTHING AT ALL when the day is done, or when the child never opened the app
//   today and so has no row. Being quiet when there is nothing to say is what
//   makes the message mean anything on the day it arrives. It also means a
//   child who is on top of it never hears from us, which is the point.
//
//   Only children with their own app and a push subscription. No fallback to
//   telling the parent, because handing a grown up a list of what their child
//   has not done yet is the nagging this product exists to replace.
//
// ── The wording, and why it is dull on purpose ──────────────────────────────
//
// It names what is open and stops. No streak at risk, no "we miss you", no
// count of days, nothing about tomorrow. The ICO Children's Code is explicit
// that nudges must not be used to keep a child engaged, and a reminder that a
// thing they agreed to is still open is a different animal from a reminder
// designed to pull them back in. job-reminders says the same at length and the
// line has to hold in both places or it holds in neither.
//
// ── Why 18:30 ──────────────────────────────────────────────────────────────
//
// After the evening job band at 17:45, with enough evening left to read a book,
// do something kind or tidy a room. A reminder that arrives once the moment has
// gone is not a reminder, it is a telling off, which is the rule the job bands
// were built on. Quiet hours are enforced inside pushToChild, so a family in
// another timezone cannot be woken by this.

export const dynamic = 'force-dynamic'

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const today = ukToday()

  // Only children who actually have their own app.
  const { data: links } = await admin.from('kid_links').select('child_id, user_id')
  if (!links || links.length === 0) return NextResponse.json({ ok: true, sent: 0, reason: 'no linked children' })

  const childIds = links.map(l => l.child_id as string)

  const [{ data: dayRows }, { data: kidRows }] = await Promise.all([
    admin.from('kid_days').select('child_id, steps, done, completed_at').eq('day', today).in('child_id', childIds),
    admin.from('children').select('id, name').in('id', childIds),
  ])

  const dayOf = new Map((dayRows ?? []).map(d => [d.child_id as string, d]))
  const nameOf = new Map((kidRows ?? []).map(k => [k.id as string, (k.name as string) ?? '']))

  let sent = 0
  for (const link of links) {
    const childId = link.child_id as string
    const row = dayOf.get(childId)

    // No row means the child has not opened the app today, so no five was ever
    // drawn for them. There is nothing outstanding to name, and inventing a
    // list to chase them with would turn this into a re engagement push, which
    // is the one thing it must not be.
    if (!row) continue
    if (row.completed_at) continue

    const steps = (row.steps ?? []) as StepKey[]
    const done = new Set((row.done ?? []) as StepKey[])
    const open = steps.filter(k => !done.has(k))
    if (open.length === 0) continue

    // Name the first one. A number a child learns to swipe away is worth less
    // than one concrete thing they can picture doing, which is the same finding
    // that shaped the job reminder.
    const first = STEPS[open[0]]?.label ?? 'one thing'
    const name = nameOf.get(childId)
    const title = open.length === 1 ? 'One left today' : `${open.length} left today`
    const body = open.length === 1
      ? `${first}. There is still time.`
      : `${first}, and ${open.length - 1} more. There is still time.`

    try {
      await pushToChild(admin, link.user_id as string, childId, `${title}${name && name !== 'Your child' ? `, ${name}` : ''}`, body)
      sent++
    } catch { /* one child's dead subscription never stops the rest */ }
  }

  return NextResponse.json({ ok: true, day: today, sent })
}

export const GET = withHeartbeat('/api/cron/five-a-day', handler)
