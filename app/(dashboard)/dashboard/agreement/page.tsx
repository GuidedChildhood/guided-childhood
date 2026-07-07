import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { StageId } from '@/lib/pathway/progress'
import AgreementBuilder from '@/components/agreement/AgreementBuilder'

export const dynamic = 'force-dynamic'

const STAGE_LABELS: Record<StageId, string> = {
  foundation: 'Stage 1 · Foundation',
  builder: 'Stage 2 · Builder',
  explorer: 'Stage 3 · Explorer',
  shaper: 'Stage 4 · Shaper',
  independent: 'Stage 5 · Independent',
}

export default async function AgreementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: child }, { data: agreement }] = await Promise.all([
    supabase.from('profiles').select('subscription_status').eq('id', user.id).single(),
    supabase.from('children').select('name, stage_id, phone').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
    supabase.from('family_agreements').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  const isPaid = profile?.subscription_status === 'active'
  const stageId = (child?.stage_id ?? null) as StageId | null
  const childName = child?.name ?? 'your child'

  if (!isPaid) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 20px 48px', textAlign: 'center' }}>
        <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '10px' }}>Family agreement</p>
        <h1 style={{ fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)', marginBottom: '14px' }}>
          One agreement, made together, stuck on the fridge
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-muted)', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 28px' }}>
          The builder walks you and {childName} through the five conversations that matter, gives you a starting point calibrated to their stage, and turns what you agree into a printable family agreement both of you sign.
        </p>
        <div style={{ background: 'var(--cream)', border: '2px solid var(--border)', borderRadius: '20px', padding: '26px 24px', marginBottom: '24px', textAlign: 'left' }}>
          {[
            'Our family values, in your words',
            'The bedroom rule, negotiated not imposed',
            'Social media terms based on readiness',
            'The when things go wrong promise',
            'Signed by both of you, reviewed every term',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '6px 0' }}>
              <span style={{ color: 'var(--terracotta)', fontSize: '14px' }}>✓</span>
              <span style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>{item}</span>
            </div>
          ))}
        </div>
        <Link href="/dashboard/upgrade" className="btn btn-gold" style={{ display: 'inline-flex', padding: '15px 32px' }}>
          Unlock the agreement builder
        </Link>
      </div>
    )
  }

  return (
    <AgreementBuilder
      childName={childName}
      stageId={stageId ?? 'explorer'}
      stageLabel={STAGE_LABELS[stageId ?? 'explorer']}
      saved={agreement ?? null}
      childPhone={(child as { phone?: string | null } | null)?.phone ?? null}
    />
  )
}
