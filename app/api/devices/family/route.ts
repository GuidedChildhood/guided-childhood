import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isDeviceKind, toFamilyDevice, type FamilyDeviceRow } from '@/lib/devices/family'

// The family's own device list. Read it, add to it when something new arrives
// in the house, rename it, retire it when it is sold or broken.
//
// Nothing here is destructive. Retiring sets a date rather than deleting the
// row, because months of timer sessions point at it and a sold iPad should not
// take last spring's screen time record with it.

export const dynamic = 'force-dynamic'

const MAX_DEVICES = 30

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [{ data, error }, { data: profile }] = await Promise.all([
    supabase.from('family_devices')
      .select('id, label, kind, guide_key, shared, retired_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true }),
    supabase.from('profiles').select('devices_asked_at').eq('id', user.id).maybeSingle(),
  ])
  // Before migration 106 the table is not there yet. The list reads as empty
  // and never asked, which is exactly how the app behaved before it existed.
  if (error) return NextResponse.json({ devices: [], askedAt: null })

  return NextResponse.json({
    devices: ((data ?? []) as FamilyDeviceRow[]).map(toFamilyDevice),
    askedAt: (profile as { devices_asked_at?: string | null } | null)?.devices_asked_at ?? null,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Adding nothing is a real answer: a family with no devices to list has
  // still told us, and should stop being asked.
  const incoming: unknown[] = Array.isArray(body.devices) ? body.devices : [body]
  const rows = incoming
    .map(d => d as { label?: unknown; kind?: unknown; guideKey?: unknown; shared?: unknown })
    .filter(d => typeof d.label === 'string' && d.label.trim().length > 0 && isDeviceKind(d.kind))
    .slice(0, MAX_DEVICES)
    .map(d => ({
      user_id: user.id,
      label: String(d.label).trim().slice(0, 60),
      kind: d.kind as string,
      guide_key: typeof d.guideKey === 'string' && d.guideKey ? d.guideKey : null,
      shared: d.shared === true,
    }))

  let added: unknown[] = []
  if (rows.length > 0) {
    const { data, error } = await supabase.from('family_devices')
      .insert(rows).select('id, label, kind, guide_key, shared, retired_at')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    added = ((data ?? []) as FamilyDeviceRow[]).map(toFamilyDevice)
  }

  // Stamp the ask so the passport switches from our catalogue to their home,
  // and the prompts stop. Best effort: the devices are saved either way.
  if (body.markAsked === true) {
    await supabase.from('profiles').update({ devices_asked_at: new Date().toISOString() }).eq('id', user.id)
  }

  return NextResponse.json({ ok: true, devices: added })
}

export async function PATCH(req: NextRequest) {
  const { id, label, retired } = await req.json().catch(() => ({}))
  if (!id || typeof id !== 'string') return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const patch: Record<string, unknown> = {}
  if (typeof label === 'string' && label.trim()) patch.label = label.trim().slice(0, 60)
  if (retired === true) patch.retired_at = new Date().toISOString()
  if (retired === false) patch.retired_at = null
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'nothing to change' }, { status: 400 })

  // RLS scopes this to their own rows, and the explicit user_id makes that
  // true of the query as well as the policy.
  const { error } = await supabase.from('family_devices')
    .update(patch).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
