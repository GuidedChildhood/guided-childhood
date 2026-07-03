import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import type { StageId } from '@/lib/pathway/progress'
import { sendEmail } from '@/lib/email/send'
import { welcomeEmail } from '@/lib/email/templates'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Fired once from the end of onboarding. The email_sends log makes it
// idempotent, and the daily email cron acts as the backstop if this call
// never lands (closed tab, flaky connection).
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // The send log is written with the service role since users cannot
  // insert into email_sends themselves.
  const admin = createAdminClient()

  const { error: dedupeError } = await admin
    .from('email_sends')
    .insert({ user_id: user.id, email_key: 'day0' })
  if (dedupeError) {
    // Unique violation means it already went out. Anything else, skip
    // quietly too: a missing welcome email must never break onboarding.
    return NextResponse.json({ ok: true, skipped: 'already_sent' })
  }

  const [{ data: profile }, { data: child }] = await Promise.all([
    supabase.from('profiles').select('email, subscription_status, onboarding_answers').eq('id', user.id).single(),
    supabase.from('children').select('stage_id').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
  ])

  const to = profile?.email ?? user.email
  if (!to) {
    return NextResponse.json({ ok: true, skipped: 'no_email' })
  }

  let firstScript: { title: string; sort_order: number } | null = null
  if (child?.stage_id) {
    const challenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge ?? null
    const recommended = await getRecommendedScript(
      supabase, user.id, child.stage_id as StageId, challenge,
      { preferFree: profile?.subscription_status !== 'active' }
    )
    if (recommended) {
      firstScript = { title: recommended.title, sort_order: recommended.sort_order }
    }
  }

  const email = welcomeEmail(firstScript)
  const result = await sendEmail({ to, subject: email.subject, html: email.html })

  if (!result.sent) {
    // Free the dedupe key so the cron backstop can retry tomorrow.
    await admin.from('email_sends').delete().eq('user_id', user.id).eq('email_key', 'day0')
  }

  return NextResponse.json({ ok: true, sent: result.sent })
}
