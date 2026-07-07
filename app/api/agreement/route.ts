import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SECTION_FIELDS = [
  'family_values',
  'bedroom_rule_time',
  'bedroom_rule_location',
  'social_media_terms',
  'when_things_go_wrong',
  'extra_agreements',
] as const

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()
  if (profile?.subscription_status !== 'active') {
    return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const sections: Record<string, string | null> = {}
  for (const field of SECTION_FIELDS) {
    const value = body[field]
    sections[field] = typeof value === 'string' ? value.slice(0, 4000) : null
  }

  const signedByParent = body.signed_by_parent === true
  const signedByChild = body.signed_by_child === true
  const bothSigned = signedByParent && signedByChild
  const reviewDate = typeof body.review_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.review_date)
    ? body.review_date
    : null
  const stageId = typeof body.stage_id === 'string' ? body.stage_id : null

  const { data: existing } = await supabase
    .from('family_agreements')
    .select('id, version, signed_by_parent, signed_by_child, agreed_date, family_values, bedroom_rule_time, bedroom_rule_location, social_media_terms, when_things_go_wrong, extra_agreements')
    .eq('user_id', user.id)
    .maybeSingle()

  // Changing a fully signed agreement counts as a new version. The agreed
  // date is stamped the moment both signatures are in place.
  const wasFullySigned = existing?.signed_by_parent && existing?.signed_by_child
  const contentChanged = existing
    ? SECTION_FIELDS.some(f => (existing[f] ?? null) !== sections[f])
    : false
  const version = existing ? (wasFullySigned && contentChanged ? existing.version + 1 : existing.version) : 1
  const agreedDate = bothSigned
    ? (wasFullySigned && !contentChanged && existing?.agreed_date
        ? existing.agreed_date
        : new Date().toISOString().slice(0, 10))
    : null

  // The structured version (migration 034): which type was chosen and the
  // clauses with their picked options, so the builder reopens exactly what
  // was agreed. Retried without these keys if the columns are not in the
  // database yet, so saving never breaks on a pending migration.
  const agreementType = typeof body.agreement_type === 'string' ? body.agreement_type.slice(0, 40) : null
  const clauses = body.clauses && typeof body.clauses === 'object' ? body.clauses : null

  const row: Record<string, unknown> = {
    user_id: user.id,
    ...sections,
    stage_id: stageId,
    signed_by_parent: signedByParent,
    signed_by_child: signedByChild,
    agreed_date: agreedDate,
    review_date: reviewDate,
    version,
    updated_at: new Date().toISOString(),
    agreement_type: agreementType,
    clauses,
  }

  let { error } = existing
    ? await supabase.from('family_agreements').update(row).eq('id', existing.id)
    : await supabase.from('family_agreements').insert(row)

  if (error && (error.message.includes('agreement_type') || error.message.includes('clauses'))) {
    delete row.agreement_type
    delete row.clauses
    const retry = existing
      ? await supabase.from('family_agreements').update(row).eq('id', existing.id)
      : await supabase.from('family_agreements').insert(row)
    error = retry.error
  }

  if (error) {
    return NextResponse.json({ error: 'Could not save the agreement' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, version, agreed_date: agreedDate })
}
