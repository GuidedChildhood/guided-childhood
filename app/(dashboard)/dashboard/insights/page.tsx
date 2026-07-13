import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import InsightsBoard from '@/components/insights/InsightsBoard'

// Founder only. The daily insight agent's dashboard: run it on demand, read
// what parents asked DiGi, and see what to build next. Gated server side so
// the route and the page share one rule.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export default async function InsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) notFound()

  return <InsightsBoard />
}
