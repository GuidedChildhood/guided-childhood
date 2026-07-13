import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Founder only export of the live scripts, so the voice batch is generated
// from the real sort_order to say_this mapping rather than the seed files
// (whose sort_orders collide across expansions). Returns plain JSON.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  const admin = createAdminClient()
  const { data } = await admin
    .from('scripts')
    .select('sort_order, title, say_this')
    .order('sort_order', { ascending: true })

  // Download as a file so it is a one tap save on a phone, not raw JSON to
  // select and copy by hand.
  const body = JSON.stringify({ count: data?.length ?? 0, scripts: data ?? [] }, null, 2)
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="scripts.json"',
    },
  })
}
