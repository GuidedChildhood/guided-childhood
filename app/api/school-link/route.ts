import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { SCHOOL_LINK_COOKIE, normaliseLinkCode } from '@/lib/school/link'

// The school a family came through, by name, for the one line the stage check
// shows them: "For families at St Mary's". Read from the cookie /s/<code> set,
// never from the address bar, so nobody can put words of their choosing on
// our page by editing a link.

export async function GET(req: NextRequest) {
  const code = normaliseLinkCode(req.cookies.get(SCHOOL_LINK_COOKIE)?.value)
  if (!code) return NextResponse.json({ name: null })
  try {
    const { data } = await createAdminClient()
      .from('school_links').select('school_name').eq('code', code).eq('active', true).maybeSingle()
    return NextResponse.json({ name: data?.school_name ?? null })
  } catch {
    return NextResponse.json({ name: null })
  }
}
