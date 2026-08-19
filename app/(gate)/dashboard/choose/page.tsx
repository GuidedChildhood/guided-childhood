import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { needsPlanChoice, trialDaysToGrant, type AccessProfile } from '@/lib/access'
import { getTrialConfig } from '@/lib/config/trial'
import { getFounderCount, FOUNDER_CAP } from '@/lib/stripe'
import TwoDoors from '@/components/access/TwoDoors'

export const dynamic = 'force-dynamic'

// The two paths, shown once, at the end of sign up. The middleware sends
// people here and the argument for that placement is in lib/access.ts.
//
// A server component so the founder count is real on first paint. The counter
// is the one piece of scarcity in this product that is true, and a number
// that arrives late reads as invented.
export default async function ChoosePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_ends_at, plan_choice, onboarding_complete')
    .eq('id', user.id)
    .maybeSingle()

  // Where they were going before the block caught them, so both doors put
  // them back on it rather than on Home. Internal dashboard paths only, and
  // never this page, which would be a loop.
  const next = from && from.startsWith('/dashboard') && !from.startsWith('//') && from !== '/dashboard/choose'
    ? from
    : '/dashboard'

  // Reached with nothing owed: a founder who tapped back, a family who chose
  // an hour ago, anybody arriving by typing the address. Never strand
  // somebody on a decision they have already made.
  if (!needsPlanChoice(profile as AccessProfile | null)) {
    redirect(next)
  }

  // Fail open on a Stripe blip, exactly as /api/founder-spots does: showing
  // the founder path when the places are gone costs one apologetic redirect at
  // checkout, and hiding it when they are not costs the sale.
  //
  // The trial length is platform_config.trial_days, and it is the SAME value
  // the checkout route hands Stripe as trial_period_days. That is the point of
  // reading it here rather than showing the constant: the sentence on the
  // button screen and the date the card is charged come from one number.
  const [held, { days: trialDays }] = await Promise.all([
    getFounderCount().catch(() => 0),
    getTrialConfig(),
  ])

  return (
    <TwoDoors
      remaining={Math.max(0, FOUNDER_CAP - held)}
      cap={FOUNDER_CAP}
      freeDays={trialDaysToGrant(profile as AccessProfile | null, trialDays)}
      trialDays={trialDays}
      next={next}
    />
  )
}
