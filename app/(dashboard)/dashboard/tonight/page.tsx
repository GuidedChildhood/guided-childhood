import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getChildren } from '@/lib/children/server'
import { readTonight } from '@/lib/pathway/tonight'
import { londonToday } from '@/lib/pathway/today'
import BackTo from '@/components/nav/BackTo'
import HappyIcon from '@/components/kid/HappyIcon'
import TonightConfirm from './TonightConfirm'

// The Tonight rung's page: what is on tonight for this child, in one card,
// with one tap to say it is. Justin, 5 September 2026, from the loop review.

export const dynamic = 'force-dynamic'

export default async function TonightPage({ searchParams }: { searchParams: Promise<{ child?: string; from?: string }> }) {
  const { child: childParam, from } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { child } = await getChildren<{ id: string; name: string | null; age_band: string | null }>(supabase, user.id, childParam, 'name, age_band')
  if (!child) redirect('/dashboard')

  const withChild = (href: string) => `${href}${href.includes('?') ? '&' : '?'}child=${child.id}`
  const plan = await readTonight(supabase, user.id, child, withChild('/dashboard/scripts')).catch(() => null)
  const { data: doneRow } = await supabase
    .from('tonight_confirmations').select('id')
    .eq('user_id', user.id).eq('child_id', child.id).eq('day', londonToday()).maybeSingle()

  const kid = child.name && child.name !== 'Your child' ? child.name : 'your child'
  const ICON = { bedtime: 'phonebed', timer: 'time', words: 'tell', morning: 'cheer', gaming: 'games' } as const

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 20px 48px' }}>
      <BackTo from={from ?? 'today'} />
      <p className="eyebrow" style={{ marginBottom: 6 }}>Tonight</p>
      {plan ? (
        <>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 7vw, 2.3rem)', letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 14px', color: 'var(--ink)' }}>
            {plan.label}
          </h1>
          <div style={{
            background: '#fff', border: '2px solid var(--ink)', borderRadius: 20, boxShadow: '0 4px 0 var(--ink)',
            padding: '20px 18px 18px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span aria-hidden style={{
                width: 56, height: 56, borderRadius: 16, background: 'var(--terracotta-lt)', border: '2px solid var(--ink)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box',
              }}>
                <HappyIcon name={ICON[plan.key]} size={38} />
              </span>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                {plan.line}
              </p>
            </div>
          </div>
          <TonightConfirm childId={child.id} mechanism={plan.key} href={plan.href} hrefLabel={plan.hrefLabel} done={!!doneRow} />
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '16px 0 0' }}>
            One tap says it is on. Tomorrow's check in asks how {kid}'s evening went, and that is how the number moves.
          </p>
        </>
      ) : (
        <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 20, boxShadow: '0 4px 0 var(--ink)', padding: '22px 18px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px' }}>
            Nothing on tonight yet
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
            Name a worry at the check in and tonight's step appears here, built from {kid}'s own settings.
          </p>
          <Link href={withChild('/dashboard/checkin')} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)' }}>Go to the check in →</Link>
        </div>
      )}
    </div>
  )
}
