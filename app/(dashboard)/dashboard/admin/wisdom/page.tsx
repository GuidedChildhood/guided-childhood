import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import WisdomReview, { type WisdomRow } from '@/components/admin/WisdomReview'

// Founder only. What DiGi is about to start telling people.
//
// digi_wisdom is the one corpus that goes into every DiGi conversation, with an
// instruction to offer the closest pattern first. It is rebuilt weekly by a cron
// from what has actually worked across families, and until migration 165 that
// rebuild went live unread: whatever the model distilled at six on a Sunday
// morning was what DiGi said all week.
//
// Now it lands here first. This page is the only route to a parent.

export const metadata = { title: 'DiGi wisdom review · Guided Childhood' }
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

function ago(iso: string | null): string {
  if (!iso) return 'never'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days < 1) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

export default async function WisdomReviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  const admin = createAdminClient()
  const [{ data: pending }, { data: live }] = await Promise.all([
    admin.from('digi_wisdom')
      .select('id, topic, age_band, what_works, evidence_count')
      .eq('pending', true)
      .order('evidence_count', { ascending: false }),
    admin.from('digi_wisdom')
      .select('id, topic, age_band, what_works, evidence_count, approved_at')
      .eq('active', true)
      .order('evidence_count', { ascending: false }),
  ])

  const lastApproved = (live ?? [])
    .map(r => r.approved_at as string | null)
    .filter(Boolean)
    .sort()
    .reverse()[0] ?? null

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 18px 60px' }}>
      <Link href="/dashboard/admin/health" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← Admin
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--ink)', margin: '10px 0 6px' }}>
        What DiGi is about to start saying
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '22px' }}>
        These patterns go into every DiGi conversation, with an instruction to offer the closest one first. The weekly
        rebuild leaves its suggestions here rather than putting them live, so nothing reaches a parent until you have
        read it. Last approved {ago(lastApproved)}.
      </p>

      <WisdomReview pending={(pending ?? []) as WisdomRow[]} liveCount={live?.length ?? 0} />

      {(live?.length ?? 0) > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
            Live now, {live?.length}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(live ?? []).map(w => (
              <div key={w.id as string} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)', marginBottom: '2px' }}>
                  {w.topic as string}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{w.what_works as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
