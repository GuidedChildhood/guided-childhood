import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, type AdminClient } from '@/lib/supabase/admin'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import { getStageProgress, type StageId } from '@/lib/pathway/progress'
import { sendEmail } from '@/lib/email/send'
import {
  welcomeEmail,
  stageGuideEmail,
  digiNudgeEmail,
  founderRateEmail,
  weeklyDigestEmail,
} from '@/lib/email/templates'

// Called by Vercel Cron once a day (see vercel.json). Walks every profile
// through the drip sequence (day0 backstop, day2 stage guide, day4 DiGi,
// day7 founder rate) and sends the weekly digest on Mondays. email_sends
// keys make every step idempotent, so a missed day never double sends.

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const FOUNDER_CAP = 50
const DRIP_BATCH = 500
const DIGEST_BATCH = 100

const STAGE_LABELS: Record<StageId, string> = {
  foundation: 'Foundation · Ages 4 to 7',
  builder: 'Builder · Ages 8 to 10',
  explorer: 'Explorer · Ages 11 to 13',
  shaper: 'Shaper · Ages 13 to 15',
  independent: 'Independent · Ages 16 and above',
}

type Admin = AdminClient

// Claims the send by writing the log row first; a unique violation means
// another run already has it. Returns a release function for failed sends.
async function claim(admin: Admin, userId: string, key: string): Promise<boolean> {
  const { error } = await admin.from('email_sends').insert({ user_id: userId, email_key: key })
  return !error
}

async function release(admin: Admin, userId: string, key: string) {
  await admin.from('email_sends').delete().eq('user_id', userId).eq('email_key', key)
}

function mondayOf(d: Date): string {
  const day = d.getUTCDay()
  const diff = (day + 6) % 7
  const monday = new Date(d)
  monday.setUTCDate(d.getUTCDate() - diff)
  return monday.toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  const [{ data: profiles }, { count: founderCount }] = await Promise.all([
    admin
      .from('profiles')
      .select('id, email, created_at, subscription_status, onboarding_answers, onboarding_complete')
      .not('email', 'is', null)
      .order('created_at', { ascending: false })
      .limit(DRIP_BATCH),
    admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_founder', true)
      .eq('subscription_status', 'active'),
  ])

  const founderRemaining = Math.max(0, FOUNDER_CAP - (founderCount ?? 0))
  const now = Date.now()
  const stats = { drip: 0, digest: 0, failed: 0 }

  const userIds = (profiles ?? []).map(p => p.id)
  const { data: sends } = userIds.length
    ? await admin.from('email_sends').select('user_id, email_key').in('user_id', userIds)
    : { data: [] }
  const sent = new Set((sends ?? []).map(s => `${s.user_id}:${s.email_key}`))
  const has = (userId: string, key: string) => sent.has(`${userId}:${key}`)

  // ── Drip sequence ─────────────────────────────────────────────────────
  for (const profile of profiles ?? []) {
    if (!profile.email || !profile.onboarding_complete) continue

    const days = Math.floor((now - new Date(profile.created_at).getTime()) / 86_400_000)
    const isPaid = profile.subscription_status === 'active'

    // Every step currently due, oldest first.
    const due: string[] = []
    if (days >= 0 && !has(profile.id, 'day0')) due.push('day0')
    if (days >= 2 && !has(profile.id, 'day2')) due.push('day2')
    if (days >= 4 && !has(profile.id, 'day4')) due.push('day4')
    if (days >= 7 && !has(profile.id, 'day7') && !isPaid && founderRemaining > 0) due.push('day7')
    if (due.length === 0) continue

    // One email per user per day: send the newest due step and mark the
    // older ones as done, so a backfilled account never gets the whole
    // sequence dumped on it at once.
    const key = due[due.length - 1]
    for (const skipped of due.slice(0, -1)) {
      await claim(admin, profile.id, skipped)
    }
    if (!(await claim(admin, profile.id, key))) continue

    let email
    if (key === 'day0') {
      const challenge = (profile.onboarding_answers as Record<string, string> | null)?.challenge ?? null
      const { data: child } = await admin
        .from('children')
        .select('stage_id')
        .eq('parent_id', profile.id)
        .eq('is_primary', true)
        .maybeSingle()
      const recommended = child?.stage_id
        ? await getRecommendedScript(admin, profile.id, child.stage_id as StageId, challenge, { preferFree: !isPaid })
        : null
      email = welcomeEmail(recommended ? { title: recommended.title, sort_order: recommended.sort_order } : null)
    } else if (key === 'day2') {
      email = stageGuideEmail()
    } else if (key === 'day4') {
      email = digiNudgeEmail()
    } else {
      email = founderRateEmail(founderRemaining)
    }

    const result = await sendEmail({ to: profile.email, subject: email.subject, html: email.html })
    if (result.sent) {
      stats.drip++
    } else {
      stats.failed++
      await release(admin, profile.id, key)
      if (result.reason === 'no_api_key') break
    }
  }

  // ── Weekly digest, Mondays only ───────────────────────────────────────
  const ukWeekday = new Date().toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Europe/London' })
  if (ukWeekday === 'Monday') {
    const digestKey = `digest-${mondayOf(new Date())}`
    const weekAgoIso = new Date(now - 7 * 86_400_000).toISOString()
    let digestsSent = 0

    for (const profile of profiles ?? []) {
      if (digestsSent >= DIGEST_BATCH) break
      if (!profile.email || !profile.onboarding_complete) continue
      // First week belongs to the drip sequence, not the digest.
      if (now - new Date(profile.created_at).getTime() < 7 * 86_400_000) continue
      if (has(profile.id, digestKey)) continue

      const { data: child } = await admin
        .from('children')
        .select('id, name, stage_id, streak_weeks')
        .eq('parent_id', profile.id)
        .eq('is_primary', true)
        .maybeSingle()
      if (!child?.stage_id) continue

      if (!(await claim(admin, profile.id, digestKey))) continue

      const stageId = child.stage_id as StageId
      const challenge = (profile.onboarding_answers as Record<string, string> | null)?.challenge ?? null
      const childName = child.name ?? 'your child'

      const [progress, recommended, { data: weekScripts }, { data: weekCheck }] = await Promise.all([
        getStageProgress(admin, profile.id, stageId, child.streak_weeks ?? 0),
        getRecommendedScript(admin, profile.id, stageId, challenge, {
          preferFree: profile.subscription_status !== 'active',
        }),
        admin
          .from('script_completions')
          .select('id')
          .eq('user_id', profile.id)
          .gte('completed_at', weekAgoIso),
        admin
          .from('wellbeing_checks')
          .select('id')
          .eq('child_id', child.id)
          .gte('created_at', weekAgoIso)
          .limit(1),
      ])

      const scriptCount = weekScripts?.length ?? 0
      const win = scriptCount > 0
        ? `You used ${scriptCount} script${scriptCount === 1 ? '' : 's'} this week. That is real practice, not just reading.`
        : `The pathway is mapped and ${childName}'s stage is set. Showing up at all puts you ahead of most houses.`
      const watchFor = (weekCheck?.length ?? 0) > 0
        ? 'Wellbeing check logged this week. Keep an eye on the trend line as it builds.'
        : 'No wellbeing check logged this week yet. Two taps on the tracker keeps the trend honest.'
      const nextStep = recommended
        ? `The script called ${recommended.title}. It is already picked out on your dashboard.`
        : 'Open DiGi and tell it about your week. It will point you to the next right thing.'

      const email = weeklyDigestEmail({
        childName,
        win,
        watchFor,
        nextStep,
        progressPct: progress.overallPct,
        stageLabel: STAGE_LABELS[stageId] ?? stageId,
      })

      const result = await sendEmail({ to: profile.email, subject: email.subject, html: email.html })
      if (result.sent) {
        stats.digest++
        digestsSent++
      } else {
        stats.failed++
        await release(admin, profile.id, digestKey)
        if (result.reason === 'no_api_key') break
      }
    }
  }

  return NextResponse.json(stats)
}
