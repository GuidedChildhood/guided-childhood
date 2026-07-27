import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The child's path polls this so a printable node flips from "?" to done the
// moment the grown up confirms, no reload. Token is the auth. Returns the
// latest status per printable key. Fails soft to empty before migration 087.

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? ''
  if (!/^[0-9a-f]{18}$/.test(token)) return NextResponse.json({ statuses: {} })

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) return NextResponse.json({ statuses: {} })

  const { data, error } = await supabase
    .from('printable_completions')
    .select('printable_key, status, created_at')
    .eq('user_id', link.user_id).eq('child_id', link.child_id)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return NextResponse.json({ statuses: {} })

  // Latest status wins per key (rows come newest first).
  const statuses: Record<string, string> = {}
  for (const r of data ?? []) {
    const k = String(r.printable_key)
    if (!(k in statuses)) statuses[k] = String(r.status)
  }
  return NextResponse.json({ statuses })
}
