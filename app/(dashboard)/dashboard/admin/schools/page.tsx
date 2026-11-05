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
  const [{ data: links, error }, { data: families }, shared] = await Promise.all([
    admin.from('school_links').select('code, school_name, active, created_at').order('created_at', { ascending: false }),
    admin.from('profiles').select('school_link, subscription_status, trial_ends_at').not('school_link', 'is', null),
    // Families who made an account from a lesson a school shared (migration
    // 386). An error here means the migration has not run yet, and the
    // section below says so rather than counting nothing as zero.
    admin.from('profiles').select('school_share_ref, school_share_module, subscription_status, trial_ends_at').not('school_share_ref', 'is', null),
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

  // The share refs, busiest first. A ref is a school's pseudonym (shared/
  // parent-share.ts): `PARENT_SHARE_SECRET=... node scripts/school-share-ref.mjs
  // <access code>` prints the ref for a code, which is how a row gets a name.
  type ShareRow = { ref: string; signedUp: number; paying: number; lessons: string[] }
  const byRef = new Map<string, ShareRow>()
  for (const f of shared.data ?? []) {
    const ref = f.school_share_ref as string
    const row = byRef.get(ref) ?? { ref, signedUp: 0, paying: 0, lessons: [] }
    row.signedUp += 1
    const live = Boolean(f.trial_ends_at) && new Date(f.trial_ends_at as string).getTime() > now
    if ((f.subscription_status === 'active' || f.subscription_status === 'past_due') && !live) row.paying += 1
    const lesson = f.school_share_module as string | null
    if (lesson && !row.lessons.includes(lesson)) row.lessons.push(lesson)
    byRef.set(ref, row)
  }
  const shareRows = [...byRef.values()].sort((a, b) => b.signedUp - a.signedUp)

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

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--ink)', margin: '40px 0 6px' }}>
        Lesson share links
      </h2>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.55, color: 'var(--ink-soft)', margin: '0 0 16px' }}>
        Parents who opened a lesson their school shared and made a free account to read the rest. Each school is a
        ref, never its access code. To name one, run the school-share-ref script with the school&rsquo;s code.
      </p>
      {shared.error ? (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>
          Not counted yet. The columns arrive with migration 386.
        </p>
      ) : shareRows.length === 0 ? (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>No families through a lesson link yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          <p style={{ ...MONO, margin: 0 }}>{shareRows.reduce((t, r) => t + r.signedUp, 0)} families in all</p>
          {shareRows.map(r => (
            <div key={r.ref} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink)' }}>{r.ref}</span>
                <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{r.signedUp} signed up · {r.paying} paying</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '6px 0 0' }}>{r.lessons.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
