import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LABEL, waitingOn, type State } from '@/publishing/engine/workflow'

// The Guided Planet, every edition at a glance (migration 377).
//
// Justin is the Editor in Chief, not the production department: this page
// shows only what is waiting on him. Each edition asks him twice, once for the
// stories and once for the finished paper, and everything between the two is
// the monthly routine's job (publishing/automation/cycle.ts).

export const metadata = { title: 'The Guided Planet · Guided Childhood' }
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
}

export default async function PlanetIssuesPage() {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  const admin = createAdminClient()
  const { data: issues, error } = await admin.from('planet_issues').select('number, slug, edition, month, state, updated_at').order('number', { ascending: false })

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 18px 60px' }}>
      <Link href="/dashboard/admin/health" style={{ ...MONO, color: 'var(--ink-muted)', textDecoration: 'none' }}>← Admin</Link>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--ink)', margin: '10px 0 6px' }}>The Guided Planet</h1>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.55, color: 'var(--ink-soft)', margin: '0 0 22px' }}>
        The monthly newspaper. Each edition needs you twice: once to approve the stories,
        once to approve the finished paper. Nothing is published without the second.
      </p>
      {error ? (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>The newspaper tables are not there yet. They arrive with migration 377.</p>
      ) : !issues?.length ? (
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>No editions synced yet. The routine syncs each issue as it works; by hand it is <code>npm run planet -- sync 1</code>.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
          {issues.map(i => {
            const ask = waitingOn({ number: i.number, state: i.state as State, updatedAt: i.updated_at })
            return (
              <li key={i.number}>
                <Link href={`/dashboard/admin/planet/${i.number}`} style={{ display: 'block', textDecoration: 'none', color: 'var(--ink)', background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)', padding: '16px 18px' }}>
                  <div style={MONO}>Issue {String(i.number).padStart(3, '0')} · {i.month}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '4px 0' }}>{i.edition}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: ask ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: ask ? 800 : 600 }}>
                    {LABEL[i.state as State]}{ask ? `. ${ask}` : ''}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
