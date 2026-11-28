import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { comebackTokenValid, checkComeback, grantComeback, COMEBACK_KEY, COMEBACK_DAYS, type ComebackDb, type ComebackProfile } from '@/lib/comeback'
import { getTrialConfig } from '@/lib/config/trial'
import { comebackPage as page } from '@/lib/comeback-page'
import { APP_ORIGIN } from '@/lib/config/site'

export const dynamic = 'force-dynamic'

// The free week back (lib/comeback.ts holds the rule and the why).
//
// GET only ever SHOWS the offer. Mail scanners and link previews open every
// link in an email before the parent does, so a GET that granted the week
// would spend a family's one chance while they were asleep, and they would tap
// it the next morning to be told it was gone. The grant is the button on the
// page, a POST, which a scanner does not press.

function db(): ComebackDb {
  const supabase = createAdminClient()
  return {
    async profile(userId) {
      const { data } = await supabase.from('profiles').select('subscription_status, trial_ends_at, created_at').eq('id', userId).maybeSingle()
      return (data as ComebackProfile | null) ?? null
    },
    async used(userId) {
      const { count } = await supabase.from('email_log').select('user_id', { count: 'exact', head: true }).eq('user_id', userId).eq('email_key', COMEBACK_KEY)
      return (count ?? 0) > 0
    },
    async claim(userId) {
      // email_log is unique on (user_id, email_key), so the second insert fails.
      const { error } = await supabase.from('email_log').insert({ user_id: userId, email_key: COMEBACK_KEY })
      return !error
    },
    async setTrialEnd(userId, iso) {
      const { error } = await supabase.from('profiles').update({ trial_ends_at: iso }).eq('id', userId)
      return !error
    },
    async unclaim(userId) {
      await supabase.from('email_log').delete().eq('user_id', userId).eq('email_key', COMEBACK_KEY)
    },
  }
}

const EXPIRED = () => page('This link has expired.', 'It may have been copied only in part. The link in the email still works.')

function refusal(reason: 'paying' | 'still_free' | 'used'): NextResponse {
  if (reason === 'paying') return page('You already have everything.', 'Your plan is active, so there is nothing to unlock. Everything is waiting in your dashboard.')
  if (reason === 'still_free') return page('Your free days are still running.', 'Everything is open for you right now, so keep this week for later. Your dashboard is one tap away.')
  return page('Your free week has been used.', 'Each family gets one free week back, and yours has gone. Everything you set up is saved, and the plans are on the upgrade page whenever you want them.')
}

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get('u')
  const k = req.nextUrl.searchParams.get('k')
  if (!comebackTokenValid(u, k)) return EXPIRED()
  const { days } = await getTrialConfig()
  const out = await checkComeback(db(), u!, Date.now(), days)
  if (out.kind === 'missing') return EXPIRED()
  if (out.kind === 'refused') return refusal(out.reason)
  return page(
    `A free week, on me.`,
    `One tap opens everything again for ${COMEBACK_DAYS} days: the scripts, DiGi, the star chart and your child's app. No card, and nothing is charged when it ends. Each family gets this once.`,
    { u: u!, k: k! },
  )
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const u = String(form.get('u') ?? '')
  const k = String(form.get('k') ?? '')
  if (!comebackTokenValid(u, k)) return EXPIRED()
  const { days } = await getTrialConfig()
  const out = await grantComeback(db(), u, Date.now(), days)
  if (out.kind === 'missing') return EXPIRED()
  if (out.kind === 'refused') return refusal(out.reason)
  if (out.kind === 'failed') return page('That did not work.', 'Nothing was used up. Please try the button in the email again in a minute.')
  return NextResponse.redirect(`${APP_ORIGIN}/dashboard?comeback=1`, 303)
}
