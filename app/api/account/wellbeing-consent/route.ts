import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { WELLBEING_CONSENT_VERSION } from '@/lib/config/consent'

// Record, or withdraw, explicit consent to keeping wellbeing data.
//
// Separate from signing up on purpose. Article 9 consent has to be specific and
// unbundled, which means a parent agreeing to the terms is not agreeing to
// this, and it cannot be folded into onboarding to save a tap.
//
// Withdrawal deletes rather than just flipping a flag. A parent who says stop
// keeping this means stop having it, and leaving the rows in place with the
// consent switched off is the kind of technically true that loses trust the
// moment anybody looks.

export async function POST(req: NextRequest) {
  const { agreed } = await req.json().catch(() => ({}))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  if (agreed === true) {
    const { error } = await supabase
      .from('profiles')
      .update({
        wellbeing_consent_at: new Date().toISOString(),
        wellbeing_consent_version: WELLBEING_CONSENT_VERSION,
      })
      .eq('id', user.id)
    if (error) return NextResponse.json({ error: 'not saved' }, { status: 500 })
    return NextResponse.json({ ok: true, consented: true })
  }

  // Withdrawn. Clear the record and remove what was kept under it.
  const { error: clearErr } = await supabase
    .from('profiles')
    .update({ wellbeing_consent_at: null, wellbeing_consent_version: null })
    .eq('id', user.id)
  if (clearErr) return NextResponse.json({ error: 'not saved' }, { status: 500 })

  await supabase.from('wellbeing_checks').delete().eq('parent_id', user.id)

  return NextResponse.json({ ok: true, consented: false })
}
