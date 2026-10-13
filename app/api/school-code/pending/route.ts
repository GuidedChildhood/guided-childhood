import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { HOME_CODE_COOKIE, recordCoverage } from '@/lib/school/home-code'

// THE END OF THE STARTER PACK REDEEMS THE CODE IN THE BOOK BAG (sync plan B).
//
// The remember route put a scanned home code in a cookie before the parent
// signed up; this is the other half. Called best effort from
// lib/starter/finish-setup.ts once the first child exists, it records that
// the child's class met the lesson and spends the cookie. With no cookie it
// does nothing and says so. The child it lands on is the primary one, which
// at the end of the starter pack is the only one.

export async function POST(req: NextRequest) {
  const code = req.cookies.get(HOME_CODE_COOKIE)?.value
  if (!code) return NextResponse.json({ ok: false, reason: 'none' })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, reason: 'unauthorized' }, { status: 401 })

  let admin
  try { admin = createAdminClient() } catch {
    return NextResponse.json({ ok: false, reason: 'unavailable' }, { status: 503 })
  }

  const { data: kids } = await supabase
    .from('children').select('id').eq('parent_id', user.id)
    .order('is_primary', { ascending: false }).order('created_at', { ascending: true }).limit(1)
  const child = kids?.[0]
  if (!child) return NextResponse.json({ ok: false, reason: 'no_child' })

  const result = await recordCoverage(supabase, admin, user.id, child.id, code)
  const res = NextResponse.json(result.ok
    ? { ok: true, title: result.title, moduleId: result.moduleId, already: result.already }
    : { ok: false, reason: result.error })
  // The cookie is spent on a result, good or bad. A code that could not be
  // recorded today (wrong, or for no lesson) is not worth carrying for a
  // month; only a server fault keeps it for another try.
  if (result.ok || result.status < 500) {
    res.cookies.set(HOME_CODE_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  }
  return res
}
