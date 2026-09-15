import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import KidScreenChrome from '@/components/kid/KidScreenChrome'
import { readTodayState } from '@/lib/kid/today-state'
import FamilyDealSheet, { type DealQuest } from '@/components/deal/FamilyDealSheet'
import PrintButton from '@/components/agreement/PrintButton'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { contractLevelFor, contractRule } from '@/lib/content/kid-contract'
import { promisesFrom, agreementTypeLabel } from '@/lib/content/agreement-promises'
import { scienceForType } from '@/lib/content/agreement-clauses'
import { buddyFor } from '@/lib/kid/buddy'

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

  const [childRes, questsRes, goalRes, agreementRes] = await Promise.all([
    supabase.from('children').select('name, age_band, device_trust, buddy').eq('id', link.child_id).maybeSingle(),
    // THIS CHILD'S JOBS, plus the shared ones. It had no child filter at all,
    // so the deal a child printed and put on their wall listed their sibling's
    // jobs, at their sibling's star rates, under their own name. On the child's
    // OWN device, which is the one place the app should only ever be about
    // them.
    //
    // The same read is done correctly one directory along in star-chart, line
    // 47. This is that line.
    supabase.from('family_quests').select('title, emoji, stars').eq('user_id', link.user_id).eq('active', true)
      .or(`child_id.is.null,child_id.eq.${link.child_id}`).order('created_at'),
    supabase.from('star_goals').select('title, stars_needed, achieved_at').eq('child_id', link.child_id).is('achieved_at', null).maybeSingle(),
    // THE AGREEMENT ITSELF (14 September 2026). This sheet printed the jobs
    // and the timer rule and never read the promises the family had signed.
    supabase.from('family_agreements')
      .select('agreement_type, clauses, family_values, bedroom_rule_time, bedroom_rule_location, social_media_terms, when_things_go_wrong, extra_agreements, signed_by_parent, signed_by_child, review_date')
      .eq('user_id', link.user_id).maybeSingle(),
  ])

  const child = childRes.data as { name?: string; age_band?: string | null; device_trust?: string | null; buddy?: string | null } | null
  const agreement = (agreementRes.data ?? null) as Parameters<typeof promisesFrom>[0] & { signed_by_parent?: boolean | null; signed_by_child?: boolean | null; review_date?: string | null } | null
  const promises = promisesFrom(agreement)
  const buddy = buddyFor(child?.buddy ?? null)
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

  const todayState = await readTodayState(supabase, link.child_id)
  const todayTab = {
    left: todayState.left,
    total: todayState.steps.length,
    complete: todayState.complete,
    opened: todayState.done.length > 0,
  }

  return (
    <KidScreenChrome token={token} current="print" today={todayTab}>
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px calc(96px + env(safe-area-inset-bottom, 0px))', background: '#fff', minHeight: '100dvh' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <Link href={`/k/${token}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>
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
        promises={promises}
        typeLabel={agreementTypeLabel(agreement?.agreement_type)}
        reviewDate={agreement?.review_date ? formatDate(`${agreement.review_date}T12:00:00`) : null}
        signedByParent={!!agreement?.signed_by_parent}
        signedByChild={!!agreement?.signed_by_child}
        friend={{ name: buddy.name, img: buddy.img }}
        science={scienceForType(agreement?.agreement_type ?? null)}
      />
    </div>
    </KidScreenChrome>
  )
}
