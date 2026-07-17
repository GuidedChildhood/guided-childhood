import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import WellbeingCheckin from '@/components/wellbeing/WellbeingCheckin'

export const dynamic = 'force-dynamic'

export default async function CheckinPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('full_name').eq('id', user.id).maybeSingle()
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
          ← Home
        </Link>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <p className="eyebrow" style={{ marginBottom: '6px' }}>Monthly check in</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>
          A minute for you
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px', lineHeight: 1.55 }}>
          Once a month we check in on how the family has been, and on how you are doing. It shapes the pathway ahead, and it keeps you in view, not just your child.
        </p>
      </div>

      <WellbeingCheckin firstName={firstName} />
    </div>
  )
}
