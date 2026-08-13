import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TRIAL_DAYS, needsPlanChoice, trialDaysToGrant, type AccessProfile } from '@/lib/access'
import { getFounderCount, FOUNDER_CAP } from '@/lib/stripe'
import TwoDoors from '@/components/access/TwoDoors'

export const dynamic = 'force-dynamic'

// The two doors, shown once, after the first check in. The middleware sends
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
    .select('subscription_status, trial_ends_at, plan_choice, first_checkin_at')
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
  // the founder door when the seats are gone costs one apologetic redirect at
  // checkout, and hiding it when they are not costs the sale.
  const held = await getFounderCount().catch(() => 0)

  return (
    <TwoDoors
      remaining={Math.max(0, FOUNDER_CAP - held)}
      cap={FOUNDER_CAP}
      freeDays={trialDaysToGrant(profile as AccessProfile | null)}
      trialDays={TRIAL_DAYS}
      next={next}
    />
  )
}
