import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pushToChild } from '@/lib/quests/kid-push'
import { gatherChildPassportToDo, type ToDoChild } from '@/lib/pathway/passport-todo-gather'
import { childToDoMessage, childToDoTitle } from '@/lib/pathway/passport-todo'
import type { createClient } from '@/lib/supabase/server'

// The monthly passport check.
//
// Justin: "maybe we could have a check each month and send / provide child's
// app with anything they need to do to keep passport on track".
//
// WHY MONTHLY AND NOT WEEKLY. The passport is the five year arc. Its rows move
// in months, not days: a stage's lessons take weeks, a stage check comes round
// once a stage. A weekly version of this message would be the same three items
// four times over, which is how a child learns to swipe it away without
// reading. Once a month is slow enough that the list has genuinely changed by
// the time it arrives.
//
// WHY IT CAN BE QUIET. Most months, for a family who are on top of it, this
// sends nothing at all. That is the design, not a failure: see
// lib/pathway/passport-todo.ts for the child's list and what is left out of it.
//
// The parent has the same send on a button above the passport, for the month
// they do not want to wait for. Both go through gatherChildPassportToDo, so
// there is one definition of what a child is being asked to do.

export const dynamic = 'force-dynamic'

// How many children one run will look at. The gather is a dozen queries per
// child, so an unbounded loop on the first of the month is a way to time a
// function out and send nobody anything. Anything past this is reported in the
// reply as skipped rather than quietly dropped.
const MAX_CHILDREN = 400
// Small batches so the reads overlap without opening four hundred at once.
const BATCH = 5

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  // gatherChildPassportToDo is typed against the request scoped server client,
  // which is what every other caller hands it. The admin client is the same
  // shape with the row policies off, which is what a sweep across every family
  // needs, so the cast is the honest one rather than a workaround.
  const db = admin as unknown as Awaited<ReturnType<typeof createClient>>

  // Only children who actually have their own app. There is nowhere to put
  // this for a child who does not, and the parent's own page already carries
  // the full list either way.
  const { data: links } = await admin.from('kid_links').select('child_id, user_id')
  if (!links || links.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, reason: 'no linked children' })
  }

  const take = links.slice(0, MAX_CHILDREN)
  const skipped = links.length - take.length

  const { data: kidRows } = await admin
    .from('children').select('id, name, stage_id, streak_weeks')
    .in('id', take.map(l => l.child_id as string))
  const childById = new Map((kidRows ?? []).map(k => [k.id as string, k as ToDoChild]))

  let sent = 0
  let quiet = 0

  for (let i = 0; i < take.length; i += BATCH) {
    await Promise.all(take.slice(i, i + BATCH).map(async link => {
      const childId = link.child_id as string
      const userId = link.user_id as string
      const child = childById.get(childId)
      if (!child) return

      const items = await gatherChildPassportToDo(db, userId, child)
      const message = childToDoMessage(items)
      if (!message) { quiet++; return }

      // One unread passport note at a time, refreshed rather than stacked, the
      // same rule the parent's Send button keeps. A child who never opened last
      // month's note gets this month's in its place, not two.
      try {
        const { data: existing } = await admin
          .from('kid_nudges').select('id')
          .eq('child_id', childId).eq('seen', false).is('quest_id', null)
          .like('message', 'Your passport this month:%')
          .limit(1).maybeSingle()
        if (existing?.id) {
          await admin.from('kid_nudges').update({ message }).eq('id', existing.id)
        } else {
          await admin.from('kid_nudges').insert({
            user_id: userId, child_id: childId, quest_id: null, message,
          })
        }
      } catch { /* the push can still carry it */ }

      try {
        await pushToChild(admin, userId, childId, childToDoTitle(child.name ?? null), message)
      } catch { /* one dead subscription never stops the rest */ }
      sent++
    }))
  }

  return NextResponse.json({ ok: true, sent, quiet, skipped })
}

export const GET = withHeartbeat('/api/cron/passport-check', handler)
