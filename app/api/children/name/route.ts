import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Set the primary child's first name after the fact. Onboarding lets a parent
// continue without one, so the dashboard offers a one tap way to add it later.
// Data minimisation holds: the first word only, capped, nothing else stored.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await request.json().catch(() => ({} as { name?: string }))
  const raw = typeof body.name === 'string' ? body.name.trim() : ''
  const firstName = raw.split(/\s+/)[0]?.slice(0, 40) ?? ''
  if (!firstName) return NextResponse.json({ error: 'A first name is required' }, { status: 400 })

  const { data: child } = await supabase
    .from('children')
    .select('id')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()
  if (!child) return NextResponse.json({ error: 'No child on this account yet' }, { status: 404 })

  const { error } = await supabase
    .from('children')
    .update({ name: firstName })
    .eq('id', child.id)
    .eq('parent_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, name: firstName })
}
