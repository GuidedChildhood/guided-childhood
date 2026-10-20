import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { recordCoverage } from '@/lib/school/home-code'

// Redeem a home code (migration 230): the code printed on the parent note
// sheet a class lesson sends home. Since 12 October 2026 (sync plan B,
// migration 373) entering it records that this child's class MET the
// module, as a lesson_coverage row, and writes no completion: only the
// child's own check at home ticks the passport. The reasoning, and what the
// old write got wrong, is in lib/school/home-code.ts. Home educators enter
// the same codes from the pack, which is why the row never says which door
// it came through.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { code?: unknown; child_id?: unknown }
  if (typeof body.code !== 'string' || !body.code.trim()) {
    return NextResponse.json({ error: 'That code does not look right. It is four letters or numbers, like HOME 7K3F.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let admin
  try { admin = createAdminClient() } catch {
    return NextResponse.json({ error: 'Codes are not available right now' }, { status: 503 })
  }

  const childId = typeof body.child_id === 'string' ? body.child_id : null
  const result = await recordCoverage(supabase, admin, user.id, childId, body.code)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status })

  return NextResponse.json({
    ok: true,
    title: result.title,
    yearBand: result.yearBand,
    alreadyDone: result.already,
    moduleId: result.moduleId,
    lessonId: result.lessonId,
  })
}
