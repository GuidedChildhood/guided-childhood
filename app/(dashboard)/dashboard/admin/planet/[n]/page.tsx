import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { LABEL, STATES, waitingOn, type State } from '@/publishing/engine/workflow'
import PlanetDesk, { type DeskData } from './PlanetDesk'

// One edition of The Guided Planet: the two approvals, the proof, the art, the
// sources and the audit trail, on one page. Reads the tables of migration 377
// and the private guided-planet bucket (previews by signed URL, an hour each).

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-soft)',
}

export default async function PlanetIssuePage({ params }: { params: Promise<{ n: string }> }) {
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  const n = Number((await params).n)
  if (!Number.isInteger(n) || n < 1) notFound()
  const NNN = String(n).padStart(3, '0')
  const admin = createAdminClient()

  const { data: issue } = await admin.from('planet_issues').select('*').eq('number', n).maybeSingle()
  if (!issue) notFound()
  const [{ data: version }, { data: stories }, { data: events }, { data: generations }, { data: budget }, { data: releases }] = await Promise.all([
    admin.from('planet_issue_versions').select('content, render_report, content_hash, created_at').eq('issue', n).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    admin.from('planet_stories').select('id, record, total, decision, decision_note').eq('issue', n).order('total', { ascending: false }),
    admin.from('planet_issue_events').select('at, actor_kind, actor_id, action, from_state, to_state, detail').eq('issue', n).order('at', { ascending: false }).limit(60),
    admin.from('planet_generations').select('id, slot, recipe, tier, model, status, credits, url, reason, at').eq('issue', n).order('at', { ascending: false }),
    admin.from('planet_budgets').select('credits, approved_by, at').eq('issue', n).maybeSingle(),
    admin.from('planet_releases').select('channel, status, at, external, detail').eq('issue', n),
  ])

  // Signed links to the proof, an hour each. The bucket is private.
  const sign = async (path: string) => (await admin.storage.from('guided-planet').createSignedUrl(`issue-${NNN}/${path}`, 3600)).data?.signedUrl ?? null
  const previews = await Promise.all(Array.from({ length: 12 }, (_, i) => sign(`pages/page-${String(i + 1).padStart(2, '0')}.png`)))
  const pdf = await sign(`guided-planet-${NNN}.pdf`)
  const sourcesPdf = await sign(`guided-planet-${NNN}-sources.pdf`)

  const state = issue.state as State
  const data: DeskData = {
    issue: n,
    state,
    storiesHash: issue.stories_hash,
    contentHash: issue.content_hash,
    pdfHash: issue.pdf_hash,
    stories: (stories ?? []).map(s => ({ id: s.id, record: s.record, total: s.total, decision: s.decision, note: s.decision_note })),
    sources: ((version?.content as { sources?: DeskData['sources'] } | null)?.sources ?? []),
    report: version?.render_report ?? null,
    previews,
    pdf,
    sourcesPdf,
    generations: generations ?? [],
    budget: budget ?? null,
    releases: releases ?? [],
  }
  const ask = waitingOn({ number: n, state, updatedAt: issue.updated_at })

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 18px 80px' }}>
      <Link href="/dashboard/admin/planet" style={{ ...MONO, color: 'var(--ink-muted)', textDecoration: 'none' }}>← All editions</Link>
      <div style={{ ...MONO, marginTop: 12 }}>Issue {NNN} · {issue.month}</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--ink)', margin: '4px 0 12px' }}>{issue.edition}</h1>

      <ol aria-label="Where this edition is" style={{ listStyle: 'none', margin: '0 0 18px', padding: 0, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {STATES.map((s, i) => {
          const here = s === state, done = STATES.indexOf(state) > i
          return <li key={s} style={{ ...MONO, fontSize: 11, padding: '6px 10px', borderRadius: 999, background: here ? 'var(--terracotta)' : done ? 'var(--tint-sage)' : '#fff', color: 'var(--ink)', border: 'var(--edge)' }}>{LABEL[s]}</li>
        })}
      </ol>

      {ask && (
        <div role="status" style={{ background: 'var(--tint-butter)', border: '2px solid var(--terracotta-dark)', borderRadius: 'var(--radius-card)', padding: '14px 16px', margin: '0 0 22px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
          {ask}
        </div>
      )}

      <PlanetDesk data={data} />

      <section style={{ marginTop: 34 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '0 0 10px' }}>Audit trail</h2>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
          {(events ?? []).map((e, i) => (
            <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
              <span style={{ ...MONO, fontSize: 11 }}>{new Date(e.at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>{' '}
              <b style={{ color: 'var(--ink)' }}>{e.actor_kind === 'founder' ? 'You' : 'The routine'}</b>{' '}
              {e.action === 'transition' ? `moved it to ${LABEL[e.to_state as State] ?? e.to_state}` : e.action.replace(/-/g, ' ')}
              {(e.detail as { note?: string; why?: string } | null)?.note ? `: ${(e.detail as { note: string }).note}` : ''}
              {(e.detail as { why?: string } | null)?.why ? ` (refused: ${(e.detail as { why: string }).why})` : ''}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
