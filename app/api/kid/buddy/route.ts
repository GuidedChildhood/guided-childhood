import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child saves their own buddy and accent colour from their app. The kid
// link token is the auth, exactly like the tick endpoint. Both values are
// validated against the known sets so the child can only ever set a real buddy
// and a real colour, never arbitrary data.

const BUDDIES = ['digi', 'oliver', 'sofia', 'zara']
const ACCENTS = ['sunshine', 'grass', 'ocean', 'coral', 'berry']

export async function POST(req: NextRequest) {
  const { token, buddy, accent } = await req.json().catch(() => ({}))
  if (!token || typeof token !== 'string' || !/^[0-9a-f]{18}$/.test(token)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { data: link } = await supabase.from('kid_links').select('child_id').eq('token', token).maybeSingle()
  const childId = (link as { child_id?: string } | null)?.child_id
  if (!childId) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const patch: { buddy?: string; accent?: string } = {}
  if (typeof buddy === 'string' && BUDDIES.includes(buddy)) patch.buddy = buddy
  if (typeof accent === 'string' && ACCENTS.includes(accent)) patch.accent = accent
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: 'nothing to set' }, { status: 400 })

  const { error } = await supabase.from('children').update(patch).eq('id', childId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
