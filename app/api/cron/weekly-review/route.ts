import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildWeeklyReview } from '@/lib/digi/weekly-review'
import { sendEmail, emailConfigured, unsubscribeUrl } from '@/lib/email'
import { weeklyReviewEmail } from '@/lib/email/templates'
import { sendPush } from '@/lib/push/send'
import { getMovements, spanWords } from '@/lib/working/movement'

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

  // Families with signs of life this week get a review; a dead account gets
  // nothing rather than an empty note. Two signs count, and both must be
  // read: an approved quest tick, and a scored daily check in. The check in
  // audit of 1 September 2026 found this gate read ticks alone, so a family
  // faithfully rating their worries every morning but running no quests
  // never received the very email that reports their movement back to them.
  const [{ data: active }, { data: checked }] = await Promise.all([
    admin
      .from('quest_ticks')
      .select('user_id')
      .eq('status', 'approved')
      .gte('tick_date', sinceIso)
      .limit(5000),
    admin
      .from('concern_events')
      .select('user_id')
      .not('score', 'is', null)
      .gte('created_at', sinceIso)
      .limit(5000),
  ])
  const userIds = [...new Set([
    ...(active ?? []).map(t => t.user_id),
    ...(checked ?? []).map(t => t.user_id),
  ])]

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
      await sendPush({
          userId,
          title: 'Your week with DiGi ✨',
          body: review.summary.slice(0, 120),
          url: '/dashboard',
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

              // WHAT MOVED. The one thing this email has never carried, and the
              // only part of it that answers whether any of the effort worked.
              // Read from the same helper the What is working page uses, so the
              // email and the page can never quote different numbers for the
              // same week, which is the fastest way to make an email
              // untrustworthy. Fails soft: a family with no scored check ins
              // simply gets the email it always got.
              let movement: { label: string; from: number; to: number; span: string }[] | null = null
              try {
                const ms = await getMovements(admin, userId)
                // Whose line is whose: every child is seeded the same four
                // worries, so with two children named the label alone reads
                // as a duplicate. The name joins the label only when it
                // distinguishes anything.
                const named = new Set(ms.map(m => m.childName).filter(Boolean))
                movement = ms
                  .filter(m => m.points.length >= 2 && m.startScore != null && m.endScore != null)
                  .map(m => ({
                    label: named.size > 1 && m.childName ? `${m.label} · ${m.childName}` : m.label,
                    from: m.startScore as number,
                    to: m.endScore as number,
                    span: m.observed && m.weeks >= 1 ? spanWords(m.weeks) : '',
                  }))
                if (movement.length === 0) movement = null
              } catch { /* the rest of the email is worth sending without it */ }

              const content = weeklyReviewEmail({ parentName, childLabel, review, unsubscribe: unsubscribeUrl(userId), poll, movement })
              const sent = await sendEmail({ to: prof.email as string, subject: content.subject, html: content.html, key })
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
