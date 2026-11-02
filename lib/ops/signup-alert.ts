import type { User } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, emailConfigured } from '@/lib/email'
import { sendPush } from '@/lib/push/send'

// ONE EMAIL TO JUSTIN FOR EVERY NEW ACCOUNT.
//
// Justin, 2 November 2026: "Do we have users? Can you let me know each new
// sign up?" The starter quiz already pushed his phone for a new quiz email
// (app/api/starter/lead), but nothing told him when an ACCOUNT was made, and a
// push only arrives on a phone that has allowed it. So the moment an account
// first gets a session, he gets an email.
//
// Two ways an account first gets a session, and both call this:
//   GOOGLE, APPLE AND EMAIL CONFIRMATION come back through /auth/callback,
//     which calls it server side straight after the code exchange.
//   EMAIL AND PASSWORD with confirmation off never leaves the starter pack, so
//     the page posts to /api/signup/notify once the session exists.
//
// Once per account, ever. A flag in app_metadata (which only the service role
// can write, so a user cannot set or clear it) marks it sent, and an account
// older than two days is never announced, so an old member logging in with
// Google for the first time is not reported as new. No table and no
// migration: the flag lives on the auth user.

const NEW_FOR_MS = 2 * 86_400_000

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

function howTheyJoined(user: User): string {
  const p = (user.app_metadata?.provider as string | undefined) ?? 'email'
  if (p === 'google') return 'Google'
  if (p === 'apple') return 'Apple'
  return 'email and password'
}

/** Best effort and silent: a signup must never fail because the alert did. */
export async function announceSignup(user: User | null | undefined): Promise<void> {
  try {
    if (!user?.id || !user.email) return
    if (user.app_metadata?.signup_announced) return
    const made = Date.parse(user.created_at)
    if (!Number.isFinite(made) || Date.now() - made > NEW_FOR_MS) return

    const admin = createAdminClient()

    // Mark it first, so two tabs racing through the callback send one email,
    // not two. Losing an alert to a failed send is the smaller harm.
    const { error: markError } = await admin.auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, signup_announced: new Date().toISOString() },
    })
    if (markError) return

    const founderEmail = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()
    // Never announce the founder to himself.
    if (user.email.toLowerCase() === founderEmail) return

    const name = (user.user_metadata?.full_name as string | undefined)?.trim() || null
    const how = howTheyJoined(user)

    // The running total, so each email also answers "do we have users".
    const { count } = await admin.from('profiles').select('id', { count: 'exact', head: true })

    if (emailConfigured()) {
      const subject = `New signup: ${name ?? user.email}`
      const html = `
        <p><strong>Someone just made a Guided Childhood account.</strong></p>
        <p>Email: ${esc(user.email)}<br>
        Name: ${name ? esc(name) : 'not given'}<br>
        Joined with: ${how}<br>
        Accounts in total: ${count ?? 'unknown'}</p>`
      await sendEmail({ to: founderEmail, subject, html, kind: 'operational' })
    }

    // The phone too, when the founder has allowed pushes.
    const { data: founder } = await admin.from('profiles').select('id').eq('email', founderEmail).maybeSingle()
    if (founder?.id) {
      await sendPush({ userId: founder.id, title: 'New Guided Childhood account', body: name ?? user.email, url: '/dashboard' })
    }
  } catch { /* the alert is best effort, the signup is not */ }
}
