import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AGREEMENT_TEMPLATES } from '@/lib/content/agreements'
import type { StageId } from '@/lib/pathway/progress'
import AgreementBuilder from './AgreementBuilder'

export const dynamic = 'force-dynamic'

export default async function AgreementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: children }] = await Promise.all([
    supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single(),
    supabase
      .from('children')
      .select('id, name, stage_id, is_primary')
      .eq('parent_id', user.id)
      .order('is_primary', { ascending: false }),
  ])

  const isPaid = profile?.subscription_status === 'active'
  const child = children?.[0] ?? null

  if (!child) redirect('/onboarding')

  const stageId = (child.stage_id ?? 'builder') as StageId
  const template = AGREEMENT_TEMPLATES[stageId] ?? AGREEMENT_TEMPLATES.builder

  if (!isPaid) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 20px 48px' }}>
        <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Family agreement</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', marginBottom: '12px' }}>
          One agreement, both sides signed
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
          Not a list of rules handed down. A negotiated agreement where {child.name ?? 'your child'} makes promises and so do you, built for their exact stage, printable for the fridge.
        </p>

        {/* Locked preview: the first clause of each side */}
        <div style={{ background: 'var(--cream)', border: '2px solid var(--border)', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
            {template.stageLabel} · A taste of it
          </div>
          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '10px' }}>
            <strong>{child.name ?? 'Your child'} agrees:</strong> {template.childClauses[0]}
          </p>
          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '14px' }}>
            <strong>The grown ups agree:</strong> {template.parentClauses[0]}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, margin: 0 }}>
            Plus {template.childClauses.length + template.parentClauses.length - 2} more clauses to negotiate, your own custom promises, the repair plan for when it goes wrong, and a print ready sheet you all sign.
          </p>
        </div>

        <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '16px' }}>
          Unlock the agreement builder
        </Link>
      </div>
    )
  }

  const { data: agreement } = await supabase
    .from('family_agreements')
    .select('child_agrees, parent_agrees, when_it_goes_wrong, review_date')
    .eq('user_id', user.id)
    .eq('child_id', child.id)
    .maybeSingle()

  return (
    <AgreementBuilder
      childId={child.id}
      childName={child.name ?? 'Your child'}
      template={template}
      saved={agreement ? {
        child_agrees: (agreement.child_agrees as string[]) ?? [],
        parent_agrees: (agreement.parent_agrees as string[]) ?? [],
        when_it_goes_wrong: agreement.when_it_goes_wrong ?? null,
        review_date: agreement.review_date ?? null,
      } : null}
    />
  )
}
