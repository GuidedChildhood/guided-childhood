import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { checkStartsAt } from '@/lib/lessons/watch-bookings'

// Watch together booking (migration 400). A parent books, moves or cancels a
// time to watch one film with one of their own children.
//
//   POST   { child_id, lesson_code, starts_at, buzz_child? }   book
//   PATCH  { id, starts_at?, buzz_child? }                      move the time
//   DELETE { id }                                               cancel
//
// The parent session is the auth, and every write checks the child is this
// parent's own, the same way the completion route does. Writes go through the
// service role because the table has no browser policies on purpose.
//
// Stage: a film above the child's own stage cannot be booked, the same gate the
// child's page uses for their adventures (stage_id <= the child's stage). The
// booking stores the lesson code only; the stage is always read from the
// lesson, never copied.
//
// Nothing here sends anything. The reminder and the child's buzz go from the
// watch bookings cron at the time, inside quiet hours rules.

type Admin = ReturnType<typeof createAdminClient>

async function parentId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

async function ownChild(admin: Admin, parent: string, childId: unknown) {
  if (typeof childId !== 'string' || !/^[0-9a-f-]{36}$/i.test(childId)) return null
  const { data } = await admin.from('children').select('id, parent_id, age_band').eq('id', childId).maybeSingle()
  if (!data || data.parent_id !== parent) return null
  return data as { id: string; parent_id: string; age_band: string | null }
}

async function ownBooking(admin: Admin, parent: string, id: unknown) {
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return null
  const { data } = await admin.from('watch_bookings').select('id, parent_id, status').eq('id', id).maybeSingle()
  if (!data || data.parent_id !== parent) return null
  return data as { id: string; parent_id: string; status: string }
}

export async function POST(req: NextRequest) {
  const parent = await parentId()
  if (!parent) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  let body: { child_id?: unknown; lesson_code?: unknown; starts_at?: unknown; buzz_child?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const admin = createAdminClient()
  const child = await ownChild(admin, parent, body.child_id)
  if (!child) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const code = body.lesson_code
  if (typeof code !== 'string' || !/^\d{1,2}\.\d{1,2}$/.test(code)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const { data: lesson } = await admin.from('parent_lessons')
    .select('lesson_code, stage_id').eq('lesson_code', code).eq('active', true).maybeSingle()
  if (!lesson) return NextResponse.json({ error: 'unknown lesson' }, { status: 404 })

  const childStage = child.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 2
  if (Number(lesson.stage_id) > childStage) {
    return NextResponse.json({ error: 'This film is for an older stage than your child is on.' }, { status: 422 })
  }

  const when = checkStartsAt(body.starts_at)
  if (!when.ok) return NextResponse.json({ error: when.reason }, { status: 422 })

  // One live booking per child per film: booking again moves the time.
  const { data: existing } = await admin.from('watch_bookings').select('id')
    .eq('child_id', child.id).eq('lesson_code', code).eq('status', 'booked').maybeSingle()
  const row = {
    starts_at: when.at.toISOString(),
    buzz_child: body.buzz_child === false ? false : true,
    reminded_at: null, child_pinged_at: null,
    updated_at: new Date().toISOString(),
  }
  const res = existing
    ? await admin.from('watch_bookings').update(row).eq('id', existing.id).select('id, starts_at, buzz_child').single()
    : await admin.from('watch_bookings').insert({ ...row, parent_id: parent, child_id: child.id, lesson_code: code }).select('id, starts_at, buzz_child').single()
  if (res.error) {
    console.error('watch_bookings write failed:', res.error.message)
    return NextResponse.json({ error: 'Booking is not switched on yet.' }, { status: 503 })
  }
  return NextResponse.json({ ok: true, booking: res.data })
}

export async function PATCH(req: NextRequest) {
  const parent = await parentId()
  if (!parent) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  let body: { id?: unknown; starts_at?: unknown; buzz_child?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const admin = createAdminClient()
  const booking = await ownBooking(admin, parent, body.id)
  if (!booking) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (booking.status !== 'booked' && booking.status !== 'missed') {
    return NextResponse.json({ error: 'That booking is finished.' }, { status: 409 })
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.starts_at !== undefined) {
    const when = checkStartsAt(body.starts_at)
    if (!when.ok) return NextResponse.json({ error: when.reason }, { status: 422 })
    // A new time is a new booking as far as the reminders go, and a missed one
    // picked up again is live again.
    Object.assign(patch, { starts_at: when.at.toISOString(), status: 'booked', reminded_at: null, child_pinged_at: null })
  }
  if (typeof body.buzz_child === 'boolean') patch.buzz_child = body.buzz_child

  const { data, error } = await admin.from('watch_bookings').update(patch).eq('id', booking.id)
    .select('id, starts_at, buzz_child, status').single()
  if (error) {
    // The one live row per film rule: a missed row moved onto a film that
    // already has a newer live booking.
    console.error('watch_bookings move failed:', error.message)
    return NextResponse.json({ error: 'There is already a time booked for this film.' }, { status: 409 })
  }
  return NextResponse.json({ ok: true, booking: data })
}

export async function DELETE(req: NextRequest) {
  const parent = await parentId()
  if (!parent) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  let body: { id?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const admin = createAdminClient()
  const booking = await ownBooking(admin, parent, body.id)
  if (!booking) return NextResponse.json({ error: 'not found' }, { status: 404 })
  // Cancelled, not deleted, so the cron never mistakes it for a missed one;
  // the retention sweep removes it with the rest after 90 days.
  const { error } = await admin.from('watch_bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', booking.id).in('status', ['booked', 'missed'])
  if (error) return NextResponse.json({ error: 'write failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
