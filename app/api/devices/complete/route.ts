import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Marking a device setup guide done, or undoing it.
//
// TWO SCOPES, AND THE DIFFERENCE IS THE WHOLE POINT.
//
// A row with no family_device_id is about a GUIDE: this family has worked
// through the Screen Time walkthrough. That is what the coverage board and the
// catalogue read, and it is unchanged.
//
// A row with a family_device_id is about a SCREEN: this iPad, in this house,
// has had its settings done. Migration 169 added it, because one guide covers
// more than one screen and ticking the iPhone was ticking the iPad with it.
//
// Both are written when a screen is ticked, so the board still goes green off
// the back of real work and nothing that reads guide keys had to change.
//
// Every write falls back to the pre 169 shape if the column is not there yet.
// Migrations here are run by hand, so deployed code has to survive the window
// where the table is one migration behind it.

const STATUSES = new Set(['done', 'not_owned'])

/** The column is missing when 169 has not been run. Postgres 42703, PostgREST PGRST204. */
function isMissingDeviceColumn(err: { code?: string; message?: string } | null): boolean {
  if (!err) return false
  if (err.code === '42703' || err.code === 'PGRST204') return true
  return /family_device_id/.test(err.message ?? '')
}

export async function POST(req: NextRequest) {
  const { device_key, status, family_device_id, child_id } = await req.json()
  if (!device_key || typeof device_key !== 'string') {
    return NextResponse.json({ error: 'missing device_key' }, { status: 400 })
  }
  const value = typeof status === 'string' && STATUSES.has(status) ? status : 'done'
  const deviceId = typeof family_device_id === 'string' && family_device_id ? family_device_id : null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Whose setup this is (migration 217, key 219): the guide walked for Jody is
  // not walked for Tray. Checked; null keeps the household row.
  let forChild: string | null = null
  if (typeof child_id === 'string' && child_id) {
    const { data: ownedChild } = await supabase
      .from('children').select('id').eq('id', child_id).eq('parent_id', user.id).maybeSingle()
    forChild = ownedChild?.id ?? null
  }

  // The guide level row, exactly as before. Ticking a screen implies the guide
  // has been worked through, so this is written in both cases and the coverage
  // board never goes quiet because a parent used the newer control.
  //
  // onConflict names all three columns after 169, because that is the shape of
  // the constraint now. Before it, the two column form is still right.
  let { error } = await supabase
    .from('device_setup_progress')
    .upsert(
      { user_id: user.id, child_id: forChild, device_key, status: value, family_device_id: null },
      { onConflict: 'user_id,child_id,device_key,family_device_id' }
    )
  if (isMissingDeviceColumn(error)) {
    ;({ error } = await supabase
      .from('device_setup_progress')
      .upsert({ user_id: user.id, child_id: forChild, device_key, status: value }, { onConflict: 'user_id,child_id,device_key,family_device_id' }))
    // Pre 169 there is nowhere to record the screen, so the guide row is all
    // there is and the answer is the old one rather than an error.
    if (error && /status/.test(error.message)) {
      ;({ error } = await supabase
        .from('device_setup_progress')
        .upsert({ user_id: user.id, child_id: forChild, device_key }, { onConflict: 'user_id,child_id,device_key,family_device_id' }))
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, perDevice: false })
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!deviceId) return NextResponse.json({ ok: true, perDevice: true })

  // The screen itself. Ownership checked rather than trusted: RLS scopes the
  // write, but a parent's own id from another family's list would otherwise be
  // accepted and quietly do nothing useful.
  const { data: owned } = await supabase
    .from('family_devices').select('id').eq('id', deviceId).eq('user_id', user.id).maybeSingle()
  if (!owned) return NextResponse.json({ error: 'unknown device' }, { status: 404 })

  const { error: devError } = await supabase
    .from('device_setup_progress')
    .upsert(
      { user_id: user.id, child_id: forChild, device_key, status: value, family_device_id: deviceId },
      { onConflict: 'user_id,child_id,device_key,family_device_id' }
    )
  if (devError) return NextResponse.json({ error: devError.message }, { status: 500 })

  return NextResponse.json({ ok: true, perDevice: true })
}

export async function DELETE(req: NextRequest) {
  const { device_key, family_device_id } = await req.json()
  if (!device_key || typeof device_key !== 'string') {
    return NextResponse.json({ error: 'missing device_key' }, { status: 400 })
  }
  const deviceId = typeof family_device_id === 'string' && family_device_id ? family_device_id : null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Untick one screen. The guide row only goes with it when no other screen in
  // the house that this guide covers is still set up, so unticking the iPad
  // does not quietly untick the iPhone on the board behind it.
  if (deviceId) {
    const { error } = await supabase
      .from('device_setup_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('family_device_id', deviceId)
    if (isMissingDeviceColumn(error)) return clearGuide(supabase, user.id, device_key)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: others } = await supabase
      .from('device_setup_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('device_key', device_key)
      .eq('status', 'done')
      .not('family_device_id', 'is', null)
      .limit(1)
    if ((others ?? []).length === 0) {
      await supabase
        .from('device_setup_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('device_key', device_key)
        .is('family_device_id', null)
    }
    return NextResponse.json({ ok: true })
  }

  return clearGuide(supabase, user.id, device_key)
}

/**
 * Undo at guide level, from the catalogue or the coverage board.
 *
 * Deliberately takes the screens with it. "I have not actually done this" said
 * about the Screen Time guide cannot leave two screens claiming their settings
 * are in place off the back of it, and this is the same sweep the route always
 * did before there was anything else in the table.
 */
async function clearGuide(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  deviceKey: string,
) {
  const { error } = await supabase
    .from('device_setup_progress')
    .delete()
    .eq('user_id', userId)
    .eq('device_key', deviceKey)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
