import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

// Save a child's weekly kit timetable, the fuel for the Evening Reset.
export async function POST(req: NextRequest) {
  const { child_id, kit_schedule } = await req.json()
  if (!child_id || typeof kit_schedule !== 'object' || kit_schedule === null) {
    return NextResponse.json({ error: 'missing child_id or kit_schedule' }, { status: 400 })
  }

  const clean: Record<string, string[]> = {}
  for (const day of DAY_KEYS) {
    const items = (kit_schedule as Record<string, unknown>)[day]
    if (Array.isArray(items)) {
      const list = items.map(i => String(i).trim()).filter(Boolean).slice(0, 6)
      if (list.length > 0) clean[day] = list
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('children')
    .update({ kit_schedule: clean })
    .eq('id', child_id)
    .eq('parent_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
