import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { STAGES } from '@/lib/content/stages'
import { ageFromDob, bandForAge, stageForBand, isBirthdayOn } from '@/lib/children/age'

// The daily grow up sweep. Vercel Cron hits this each morning (vercel.json)
// and, for every child with a birthday on record, checks whether the band
// derived from that birthday still matches the stored age_band. When it no
// longer does, the child moves up: age_band and stage_id update, DiGi
// remembers the moment, the parent gets one warm celebration push, and if
// the child had agreed the contract at the old age wording, agreed_at
// clears so they re agree the age right version on their next open. That
// re agree is intended behaviour, not a bug: the contract grows up too.
//
// Children with no date_of_birth are untouched, exactly as before this
// existed. Vercel adds Authorization: Bearer <CRON_SECRET> to cron calls,
// so that header is what we verify.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

type ChildRow = {
  id: string
  parent_id: string
  name: string | null
  age_band: string | null
  date_of_birth: string | null
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'service key not configured' }, { status: 500 })
  }
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey)

  const { data: children, error } = await admin
    .from('children')
    .select('id, parent_id, name, age_band, date_of_birth')
    .not('date_of_birth', 'is', null)
  if (error) {
    // Fail soft before migration 083 lands: no date_of_birth column means
    // nothing to age up yet, so the cron reports a quiet day rather than
    // erroring. The day the migration runs, this route starts working.
    return NextResponse.json({ ok: true, checked: 0, movedUp: 0, pushed: 0, skipped: error.message })
  }

  const today = new Date()
  let checked = 0
  let movedUp = 0
  let pushed = 0

  for (const child of (children ?? []) as ChildRow[]) {
    checked++
    const newBand = bandForAge(child.date_of_birth, today)
    if (!newBand || newBand === child.age_band) continue

    const newStage = stageForBand(newBand)
    const stageMeta = STAGES.find(s => s.ageBand === newBand)
    const stageName = stageMeta?.name ?? newStage.charAt(0).toUpperCase() + newStage.slice(1)
    const age = ageFromDob(child.date_of_birth, today)
    const name = child.name && child.name !== 'Your child' ? child.name : 'Your child'

    const { error: updateErr } = await admin
      .from('children')
      .update({ age_band: newBand, stage_id: newStage })
      .eq('id', child.id)
    if (updateErr) continue
    movedUp++

    // DiGi remembers the stage up, so future conversations know the move
    // happened and roughly when.
    await admin.from('digi_memory').insert({
      user_id: child.parent_id,
      child_id: child.id,
      kind: 'context',
      source: 'system',
      content: age !== null
        ? `${name} turned ${age} and moved to the ${stageName} stage`
        : `${name} moved to the ${stageName} stage`,
    })

    // The contract grows up with them. If the child agreed the old age
    // wording, clearing agreed_at asks them to agree the new wording on
    // their next open. Intended behaviour.
    const { data: link } = await admin
      .from('kid_links')
      .select('id, agreed_level, agreed_at')
      .eq('child_id', child.id)
      .maybeSingle()
    if (link?.agreed_at && link.agreed_level && link.agreed_level !== newBand) {
      await admin.from('kid_links').update({ agreed_at: null }).eq('id', link.id)
    }

    // One warm celebration to the parent's phone, best effort. Says turns N
    // today only when today really is the birthday; a birthday added after
    // the fact gets the same news without the wrong date.
    try {
      const birthdayToday = isBirthdayOn(child.date_of_birth, today)
      const title = age !== null
        ? (birthdayToday ? `${name} turns ${age} today 🎂` : `${name} is ${age} now 🎂`)
        : `${name} is growing up 🎂`
      const body = `The ${stageName} stage opens: new lessons, a new stamp to earn, and the healthy screen amount shifts. The contract is ready to re agree at the new wording.`
      const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
      const res = await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
        body: JSON.stringify({ userId: child.parent_id, title, body, url: '/dashboard/pathway' }),
      })
      const result = await res.json().catch(() => ({ sent: 0 }))
      if ((result?.sent ?? 0) > 0) pushed++
    } catch { /* best effort, the app shows the same news on next open */ }
  }

  return NextResponse.json({ checked, movedUp, pushed })
}
