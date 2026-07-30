import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildWeeklyReview } from '@/lib/digi/weekly-review'
import { sendEmail, emailConfigured, unsubscribeUrl } from '@/lib/email'
import { weeklyReviewEmail } from '@/lib/email/templates'

// The Sunday evening DiGi weekly review cron. Finds families that did anything
// this week, builds each one a private review off their own numbers, stores it,
// and pushes the parent a nudge to read it and set up next week. Gated on
// CRON_SECRET like every other cron, so only Vercel's scheduler can run it.

export const dynamic = 'force-dynamic'
export const maxDuration = 300

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const admin = createAdminClient()
  const sinceIso = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10)

  // Families with at least one approved tick this week get a review; a dead
  // account gets nothing rather than an empty note.
  const { data: active } = await admin
    .from('quest_ticks')
    .select('user_id')
    .eq('status', 'approved')
    .gte('tick_date', sinceIso)
    .limit(5000)
  const userIds = [...new Set((active ?? []).map(t => t.user_id))]

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin
  let built = 0

  // The community bite, once a month: on the first Sunday, the review email
  // carries what every family answered. Counted once for the whole run rather
  // than per family, since the crowd is the same crowd for everyone. Fails soft
  // before migration 099, and a poll nobody answered simply does not appear.
  let poll: { question: string; results: { label: string; pct: number }[]; total: number } | null = null
  const isFirstSunday = new Date().getUTCDate() <= 7
  if (isFirstSunday) {
    try {
      const { data: row } = await admin
        .from('community_polls')
        .select('id, question, options')
        .eq('active', true)
        .order('month', { ascending: false })
        .limit(1).maybeSingle()
      const options = Array.isArray(row?.options) ? (row!.options as string[]) : []
      if (row && options.length > 0) {
        const { data: votes } = await admin
          .from('community_poll_votes').select('choice').eq('poll_id', row.id).limit(20000)
        const total = (votes ?? []).length
        if (total > 0) {
          const counts = new Array(options.length).fill(0) as number[]
          for (const v of votes ?? []) {
            const c = Number(v.choice)
            if (Number.isInteger(c) && c >= 0 && c < options.length) counts[c] += 1
          }
          poll = {
            question: String(row.question),
            total,
            // Heaviest first, so the email opens on what most families said.
            results: options
              .map((label, i) => ({ label, pct: Math.round((counts[i] / total) * 100) }))
              .sort((a, b) => b.pct - a.pct),
          }
        }
      }
    } catch { /* pre 099, the review goes out without the bite */ }
  }

  for (const userId of userIds) {
    try {
      const review = await buildWeeklyReview(userId)
      built++
      // Nudge the parent, best effort.
      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
        body: JSON.stringify({
          userId,
          title: 'Your week with DiGi ✨',
          body: review.summary.slice(0, 120),
          url: '/dashboard',
        }),
      }).catch(() => {})

      // The same review as an email, so the clever weekly read also reaches a
      // parent who lives in their inbox. Guarded by the email opt out and the
      // email log, so it never double sends and honours the unsubscribe. Best
      // effort: the review and the push have already landed regardless.
      if (emailConfigured()) {
        try {
          const { data: prof } = await admin
            .from('profiles').select('email, full_name, email_opt_out').eq('id', userId).maybeSingle()
          if (prof?.email && !prof.email_opt_out) {
            const key = `digi-review-${review.week_start}`
            const { error: logErr } = await admin.from('email_log').insert({ user_id: userId, email_key: key })
            if (!logErr) {
              const parentName = (prof.full_name as string | null)?.split(' ')[0] ?? 'there'
              const childLabel = review.stats.children.filter(Boolean).join(' and ') || 'your child'
              const content = weeklyReviewEmail({ parentName, childLabel, review, unsubscribe: unsubscribeUrl(userId), poll })
              const sent = await sendEmail({ to: prof.email as string, subject: content.subject, html: content.html })
              if (!sent.ok) await admin.from('email_log').delete().eq('user_id', userId).eq('email_key', key)
            }
          }
        } catch { /* email is best effort; the push already landed */ }
      }
    } catch { /* one family failing never stops the run */ }
  }

  return NextResponse.json({ ok: true, families: userIds.length, built })
}

export const GET = withHeartbeat('/api/cron/weekly-review', handler)
