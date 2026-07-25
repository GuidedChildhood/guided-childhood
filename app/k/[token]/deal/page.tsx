import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import FamilyDealSheet, { type DealQuest } from '@/components/deal/FamilyDealSheet'
import PrintButton from '@/components/agreement/PrintButton'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { contractLevelFor, contractRule } from '@/lib/content/kid-contract'

export const dynamic = 'force-dynamic'

// The child's own door to the fridge sheet. A child who wants the deal on the
// wall should not have to go and ask a grown up to log in and print it, so the
// same sheet is one tap from their family deal popup. The token is the auth,
// exactly like every other child surface, and this page reads only, it can
// change nothing.

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function KidDealPrintPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const [childRes, questsRes, goalRes] = await Promise.all([
    supabase.from('children').select('name, age_band, device_trust').eq('id', link.child_id).maybeSingle(),
    supabase.from('family_quests').select('title, emoji, stars').eq('user_id', link.user_id).eq('active', true).order('created_at'),
    supabase.from('star_goals').select('title, stars_needed, achieved_at').eq('child_id', link.child_id).is('achieved_at', null).maybeSingle(),
  ])

  const child = childRes.data as { name?: string; age_band?: string | null; device_trust?: string | null } | null
  const ageBand = child?.age_band ?? null

  // The agreed date lives on the link, written when the child accepted the
  // timer rule on their first run. Absent before that migration, which is fine.
  let agreedAt: string | null = null
  try {
    const { data } = await supabase.from('kid_links').select('agreed_at').eq('token', token).maybeSingle()
    agreedAt = (data?.agreed_at as string | null) ?? null
  } catch { agreedAt = null }

  const quests: DealQuest[] = (questsRes.data ?? []).map(q => ({
    title: q.title as string,
    emoji: (q.emoji as string | null) ?? null,
    stars: (q.stars as number) ?? 1,
  }))

  const goalRow = goalRes.data as { title?: string; stars_needed?: number } | null

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 48px', background: '#fff', minHeight: '100dvh' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <Link href={`/k/${token}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>
          ← Back to my app
        </Link>
        <PrintButton />
      </div>

      <FamilyDealSheet
        childName={child?.name ?? 'Our child'}
        starMinutes={STAR_MINUTES}
        recommendedMinutes={recommendedDailyMinutes(ageBand)}
        timerRule={contractRule(contractLevelFor(ageBand), child?.device_trust ?? null)}
        agreedDate={formatDate(agreedAt)}
        quests={quests}
        goal={goalRow?.title ? { title: goalRow.title, starsNeeded: goalRow.stars_needed ?? 0 } : null}
      />
    </div>
  )
}
