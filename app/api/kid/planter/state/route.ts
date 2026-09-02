import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { loadGardenView } from '@/lib/planter/server'

// The child's garden, brought up to now. Same trust model as every child
// route: the link token is the auth, there is no account and no login, and
// the token scopes everything to one child. No model runs here or anywhere
// near here (scripts/check-child-has-no-model.mjs covers this directory).

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  if (!/^[0-9a-f]{18}$/.test(token)) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
  const admin = createAdminClient()
  const { data: link } = await admin
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
  const { data: child } = await admin
    .from('children').select('name, age_band, date_of_birth').eq('id', link.child_id).maybeSingle()
  const view = await loadGardenView(admin, link.user_id as string, link.child_id as string, child ?? {})
  return NextResponse.json(view)
}
