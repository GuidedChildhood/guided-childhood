import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isContractLevel } from '@/lib/content/kid-contract'

// The child taps I agree on their age based timer contract. The acceptance
// locks in on kid_links (agreed_at plus which age wording was agreed), so
// the child sees it read only in Our deal, the parent sees the quiet agreed
// line on their card, and DiGi's context can read the same columns later.
// Token scoped like every kid route, and only the first agree ever writes:
// once locked, it stays locked.

export async function POST(req: NextRequest) {
  const { token, level } = await req.json().catch(() => ({}))
  if (typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad token' }, { status: 400 })
  }
  const agreedLevel = isContractLevel(level) ? level : '11plus'

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('kid_links')
    .update({ agreed_at: new Date().toISOString(), agreed_level: agreedLevel })
    .eq('token', token)
    .is('agreed_at', null)

  // Before migration 080 the columns are missing; the child is never stuck
  // on the contract screen for that, their device remembers the agree until
  // the database can.
  if (error) return NextResponse.json({ ok: false })
  return NextResponse.json({ ok: true })
}
