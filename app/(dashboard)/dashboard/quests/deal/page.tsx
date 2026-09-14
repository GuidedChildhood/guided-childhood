import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FamilyDealSheet, { type DealQuest } from '@/components/deal/FamilyDealSheet'
import PrintButton from '@/components/agreement/PrintButton'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { contractLevelFor, contractRule } from '@/lib/content/kid-contract'
import { pickChild } from '@/lib/children/select'
import { promisesFrom, agreementTypeLabel } from '@/lib/content/agreement-promises'
import { scienceForType } from '@/lib/content/agreement-clauses'
import { buddyFor } from '@/lib/kid/buddy'

export const dynamic = 'force-dynamic'

// The parent's door to the same fridge sheet the child can print. Deliberately
// the same component, so the copy on the fridge is identical whichever of them
// pressed print, and neither ends up holding a different version of the deal.

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function ParentDealPrintPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { child: childParam } = await searchParams

  const { data: children } = await supabase
    .from('children').select('id, name, age_band, device_trust, is_primary')
    .eq('parent_id', user.id).order('is_primary', { ascending: false })

  const child = pickChild((children ?? []) as never[], childParam) as
    { id: string; name: string; age_band: string | null; device_trust: string | null } | null

  const [questsRes, goalRes, linkRes, agreementRes] = await Promise.all([
    supabase.from('family_quests').select('title, emoji, stars, child_id').eq('user_id', user.id).eq('active', true).order('created_at'),
    child ? supabase.from('star_goals').select('title, stars_needed').eq('child_id', child.id).is('achieved_at', null).maybeSingle() : Promise.resolve({ data: null }),
    child ? supabase.from('kid_links').select('agreed_at').eq('child_id', child.id).maybeSingle() : Promise.resolve({ data: null }),
    // The agreement itself, so the promises are on the sheet (14 September 2026).
    supabase.from('family_agreements')
      .select('agreement_type, clauses, family_values, bedroom_rule_time, bedroom_rule_location, social_media_terms, when_things_go_wrong, extra_agreements, signed_by_parent, signed_by_child, review_date')
      .eq('user_id', user.id).maybeSingle(),
  ])
  const agreement = (agreementRes.data ?? null) as Parameters<typeof promisesFrom>[0] & { signed_by_parent?: boolean | null; signed_by_child?: boolean | null; review_date?: string | null } | null
  const buddy = buddyFor((child as { buddy?: string | null } | null)?.buddy ?? null)

  // A quest with no child set belongs to everyone, so it stays on the sheet.
  const quests: DealQuest[] = (questsRes.data ?? [])
    .filter(q => !q.child_id || !child || q.child_id === child.id)
    .map(q => ({ title: q.title as string, emoji: (q.emoji as string | null) ?? null, stars: (q.stars as number) ?? 1 }))

  const goalRow = goalRes.data as { title?: string; stars_needed?: number } | null
  const agreedAt = (linkRes.data as { agreed_at?: string | null } | null)?.agreed_at ?? null

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 48px' }}>
      <style>{`
        @media print {
          header, .bottom-tab-bar, .no-print { display: none !important; }
          main { padding: 0 !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <Link href="/dashboard/quests" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>
          ← Back to quests
        </Link>
        <PrintButton />
      </div>

      <FamilyDealSheet
        childName={child?.name ?? 'Our child'}
        starMinutes={STAR_MINUTES}
        recommendedMinutes={recommendedDailyMinutes(child?.age_band ?? null)}
        timerRule={contractRule(contractLevelFor(child?.age_band ?? null), child?.device_trust ?? null)}
        agreedDate={formatDate(agreedAt)}
        quests={quests}
        goal={goalRow?.title ? { title: goalRow.title, starsNeeded: goalRow.stars_needed ?? 0 } : null}
        promises={promisesFrom(agreement)}
        typeLabel={agreementTypeLabel(agreement?.agreement_type)}
        reviewDate={agreement?.review_date ? formatDate(`${agreement.review_date}T12:00:00`) : null}
        signedByParent={!!agreement?.signed_by_parent}
        signedByChild={!!agreement?.signed_by_child}
        friend={{ name: buddy.name, img: buddy.img }}
        science={scienceForType(agreement?.agreement_type ?? null)}
      />
    </div>
  )
}
