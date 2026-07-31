import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { readHealth, type Health, type Level } from '@/lib/ops/health'

// Founder only. Is anything broken right now?
//
// The page exists because of a fault that ran for seventeen days without
// anybody being able to see it. The weekly digest was gated to Mondays while
// its idempotency key was the ISO week, so from 13 July it skipped every
// parent, every week. No error was raised, no log line looked wrong, and the
// only evidence was an absence of rows, which is exactly what a quiet week
// looks like too.
//
// So this board never argues from absence. Each job says it ran, and silence
// past a job's own schedule is what turns a square red.

export const metadata = { title: 'Service health · Guided Childhood' }
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
  letterSpacing: '0.13em', textTransform: 'uppercase',
}

const TONE: Record<Level, { bg: string; border: string; text: string; dot: string; word: string }> = {
  ok:   { bg: 'var(--tint-green)',  border: 'var(--green)',           text: 'var(--green-dark)',      dot: '🟢', word: 'Healthy' },
  warn: { bg: 'var(--tint-amber)',  border: 'var(--gold)',            text: 'var(--gold-dark)',       dot: '🟡', word: 'Worth a look' },
  down: { bg: 'var(--danger-bg)',   border: 'var(--danger-border)',   text: 'var(--danger)',          dot: '🔴', word: 'Something is down' },
}

/** "3 hours ago", or "never". Kept plain, because this gets read in a hurry. */
function ago(iso: string | null): string {
  if (!iso) return 'never'
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 2) return 'just now'
  if (mins < 60) return `${mins} minutes ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

/** The one line under a job name: what happened, and whether it is late. */
function jobLine(j: Health['jobs'][number]): string {
  if (!j.lastRunAt) return 'Has never run since monitoring started. If its schedule has not come round yet, that is expected.'
  if (j.overdueBy !== null) {
    return `Last ran ${ago(j.lastRunAt)}, which is ${j.overdueBy} hour${j.overdueBy === 1 ? '' : 's'} past when it was next due. It has stopped running.`
  }
  if (j.lastOk === false) return `Ran ${ago(j.lastRunAt)} and failed. ${j.lastError ?? 'No error recorded.'}`
  if (j.lastOk === null) return `Started ${ago(j.lastRunAt)} and never reported back, so it was probably killed part way.`
  const count = j.lastProcessed === null ? 'count not recorded' : `${j.lastProcessed} handled`
  const fails = j.failures7d > 0 ? ` ${j.failures7d} of its ${j.runs7d} runs this week failed.` : ''
  return `Ran ${ago(j.lastRunAt)}, ${count}.${fails}`
}

export default async function HealthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  let h: Health | null = null
  let readError: string | null = null
  try {
    h = await readHealth()
  } catch (e) {
    readError = e instanceof Error ? e.message : 'Could not read the health data.'
  }

  const tone = h ? TONE[h.level] : TONE.warn

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px 60px' }}>
      <Link href="/dashboard" style={{ ...eyebrow, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← Dashboard
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px, 7vw, 32px)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '14px 0 6px' }}>
        Service health
      </h1>
      <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 22px' }}>
        Every scheduled job records that it ran. A job that has gone quiet past its own schedule shows up here rather than being noticed weeks later.
      </p>

      {readError && (
        <div style={{ background: 'var(--danger-bg)', border: '1.5px solid var(--danger-border)', borderRadius: 18, padding: '16px 18px', marginBottom: 18 }}>
          <div style={{ ...eyebrow, color: 'var(--danger)', marginBottom: 5 }}>Could not read</div>
          <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>{readError}</p>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 0' }}>
            If that names a missing table, migration 130 has not been run yet.
          </p>
        </div>
      )}

      {h && (
        <>
          {/* The verdict, in one word, at the top. */}
          <div style={{ background: tone.bg, border: `1.5px solid ${tone.border}`, borderRadius: 20, padding: '18px 20px', marginBottom: 18 }}>
            <div style={{ ...eyebrow, color: tone.text, marginBottom: 4 }}>Right now</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: 'var(--ink)', lineHeight: 1.15, marginBottom: 6 }}>
              {tone.word}
            </div>
            <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
              {h.summary.down > 0
                ? `${h.summary.down} thing${h.summary.down === 1 ? '' : 's'} need${h.summary.down === 1 ? 's' : ''} you now${h.summary.warn > 0 ? `, and ${h.summary.warn} more worth a look` : ''}.`
                : h.summary.warn > 0
                  ? `Nothing is down. ${h.summary.warn} thing${h.summary.warn === 1 ? '' : 's'} worth a look.`
                  : `All ${h.summary.ok} checks pass. Every job is running on schedule.`}
            </p>
          </div>

          {/* Services: config only, never a secret's value. */}
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px', marginBottom: 18 }}>
            <div style={{ ...eyebrow, color: 'var(--terracotta-dark)', marginBottom: 12 }}>Services</div>
            {h.services.map(s => (
              <div key={s.key} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 14 }}>
                <span aria-hidden style={{ flexShrink: 0, fontSize: 16, lineHeight: 1.4 }}>{TONE[s.level].dot}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5, color: 'var(--ink)' }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: 15, color: TONE[s.level].text, fontWeight: 700, marginLeft: 8 }}>{s.headline}</span>
                  <span style={{ display: 'block', fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>
                    {s.detail}
                  </span>
                </span>
              </div>
            ))}
            <p style={{ fontSize: 14.5, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '4px 0 0' }}>
              Only whether each key is set is shown, never its value.
            </p>
          </div>

          {/* Jobs, worst first, because the top of the list is what gets read. */}
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px' }}>
            <div style={{ ...eyebrow, color: 'var(--terracotta-dark)', marginBottom: 12 }}>
              Scheduled jobs ({h.jobs.length})
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[...h.jobs]
                .sort((a, b) => ({ down: 0, warn: 1, ok: 2 })[a.level] - ({ down: 0, warn: 1, ok: 2 })[b.level])
                .map(j => (
                  <li key={j.job.path} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px dotted var(--border)' }}>
                    <span aria-hidden style={{ flexShrink: 0, fontSize: 15, lineHeight: 1.5 }}>{TONE[j.level].dot}</span>
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>
                        {j.job.label}
                      </span>
                      <span style={{ display: 'block', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>
                        {jobLine(j)}
                      </span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-muted)', marginTop: 3, wordBreak: 'break-all' }}>
                        {j.job.schedule}  ·  {j.job.path}
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
            <p style={{ fontSize: 14.5, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 0' }}>
              Read from the run log, written by each job as it starts, so this is what really happened and not what was scheduled to.
            </p>
          </div>

          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '18px 0 0' }}>
            For what has actually gone out to parents, see{' '}
            <Link href="/dashboard/admin/email" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>email health</Link>.
          </p>
        </>
      )}
    </div>
  )
}
