import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { APP_ORIGIN } from '@/lib/config/site'
import SchoolLinks, { type SchoolLinkRow } from './SchoolLinks'

// The school links, and what each one did (migration 353).
//
// Justin, 25 September 2026, choosing between a paid school family pass and a
// cheaper test first: "Idea 1". A school shares a link in its newsletter, the
// families get the ordinary offer, and this page says how many signed up and
// how many went on to pay. That number is the case for, or against, building
// the paid pass.
//
// PAYING MEANS PAYING. A Founder card trial reads 'active' in
// subscription_status while its free days run, so counting 'active' alone
// would call a family who has not been charged yet a customer. Those are
// shown on their own as "card on, still free".

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
}

export default async function SchoolLinksPage() {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  const admin = createAdminClient()
  const [{ data: links, error }, { data: families }] = await Promise.all([
    admin.from('school_links').select('code, school_name, active, created_at').order('created_at', { ascending: false }),
    admin.from('profiles').select('school_link, subscription_status, trial_ends_at').not('school_link', 'is', null),
  ])

  const now = Date.now()
  const rows: SchoolLinkRow[] = (links ?? []).map(l => {
    const mine = (families ?? []).filter(f => f.school_link === l.code)
    const inTrialWindow = (f: { trial_ends_at: string | null }) =>
      Boolean(f.trial_ends_at) && new Date(f.trial_ends_at as string).getTime() > now
    const onPaidStatus = (f: { subscription_status: string | null }) =>
      f.subscription_status === 'active' || f.subscription_status === 'past_due'
    return {
      code: l.code as string,
      name: l.school_name as string,
      active: Boolean(l.active),
      url: `${APP_ORIGIN}/s/${l.code}`,
      signedUp: mine.length,
      cardOn: mine.filter(f => onPaidStatus(f) && inTrialWindow(f)).length,
      paying: mine.filter(f => onPaidStatus(f) && !inTrialWindow(f)).length,
    }
  })

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 18px 60px' }}>
      <Link href="/dashboard/admin/health" style={{ ...MONO, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← Admin
      </Link>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--ink)', margin: '10px 0 6px' }}>
        School links
      </h1>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.55, color: 'var(--ink-soft)', margin: '0 0 22px' }}>
        A link a school puts in its newsletter. Families get the same four free days
        and founder rate as everyone else. This page shows who came through each one,
        so you can see whether a school is worth a paid pass.
      </p>
      {error ? (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>
          The school links table is not there yet. It arrives with migration 353.
        </p>
      ) : (
        <SchoolLinks rows={rows} />
      )}
    </div>
  )
}
