import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MAX_CLAUSES = 20
const MAX_CLAUSE_LENGTH = 300

function cleanClauses(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((c): c is string => typeof c === 'string')
    .map(c => c.trim().slice(0, MAX_CLAUSE_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_CLAUSES)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  if (profile?.subscription_status !== 'active') {
    return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const childAgrees = cleanClauses(body.child_agrees)
  const parentAgrees = cleanClauses(body.parent_agrees)
  if (childAgrees.length === 0 || parentAgrees.length === 0) {
    return NextResponse.json(
      { error: 'An agreement needs promises on both sides' },
      { status: 400 }
    )
  }

  // The child must belong to this parent; child_id is also what the
  // one-agreement-per-child unique constraint keys on.
  const childId = typeof body.child_id === 'string' ? body.child_id : null
  if (!childId) {
    return NextResponse.json({ error: 'Missing child' }, { status: 400 })
  }
  const { data: child } = await supabase
    .from('children')
    .select('id, name, stage_id')
    .eq('id', childId)
    .eq('parent_id', user.id)
    .maybeSingle()
  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 })
  }

  const reviewDate = typeof body.review_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.review_date)
    ? body.review_date
    : null

  const { data: saved, error } = await supabase
    .from('family_agreements')
    .upsert(
      {
        user_id: user.id,
        child_id: child.id,
        stage_id: child.stage_id,
        child_name: child.name,
        child_agrees: childAgrees,
        parent_agrees: parentAgrees,
        when_it_goes_wrong: typeof body.when_it_goes_wrong === 'string'
          ? body.when_it_goes_wrong.trim().slice(0, 1000)
          : null,
        review_date: reviewDate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,child_id' }
    )
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Could not save agreement' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: saved.id })
}
