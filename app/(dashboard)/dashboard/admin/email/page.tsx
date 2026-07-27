import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { readEmailConfig, judge, type EmailHealth } from '@/lib/email/health'

// Founder only. Is the email programme actually sending?
//
// It is a fair question that had no answer. The lifecycle cron runs at eight
// every morning and, with no Resend key, returns skipped and stops. From the
// outside that is indistinguishable from a morning where nobody was due an
// email: no error, no alert, nothing recorded. A dead programme and a quiet one
// look identical, and you find out weeks later when a parent mentions they never
// got anything.
//
// Read with the service key because email_log and lead_email_log are not a
// family's own rows to read, and the whole point is the total across everyone.

export const metadata = { title: 'Email health — Guided Childhood' }
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

async function readHealth(): Promise<EmailHealth> {
  const config = readEmailConfig()
  const admin = createAdminClient()
  const dayAgo = new Date(Date.now() - 86400000).toISOString()
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  // Every send writes its log row before the email leaves, so the most recent
  // row across both logs is the honest heartbeat. Leads and accounts are two
  // different tables for good reasons, so both are read and merged here.
  const [accountRecent, leadRecent] = await Promise.all([
    admin.from('email_log').select('email_key, sent_at').gte('sent_at', weekAgo).limit(5000),
    admin.from('lead_email_log').select('email_key, sent_at').gte('sent_at', weekAgo).limit(5000),
  ])

  type Row = { email_key: string; sent_at: string }
  const rows: Row[] = [
    ...((accountRecent.data ?? []) as Row[]),
    ...((leadRecent.data ?? []) as Row[]),
  ].filter(r => r?.sent_at)

  // The last seven days may genuinely be empty, so the heartbeat needs its own
  // unbounded read rather than being inferred from a window that found nothing.
  const [lastAccount, lastLead] = await Promise.all([
    admin.from('email_log').select('sent_at').order('sent_at', { ascending: false }).limit(1).maybeSingle(),
    admin.from('lead_email_log').select('sent_at').order('sent_at', { ascending: false }).limit(1).maybeSingle(),
  ])
  const candidates = [
    (lastAccount.data as { sent_at?: string } | null)?.sent_at,
    (lastLead.data as { sent_at?: string } | null)?.sent_at,
  ].filter(Boolean) as string[]
  const lastSendAt = candidates.length
    ? candidates.sort().slice(-1)[0]
    : null

  const sent7d = rows.length
  const sent24h = rows.filter(r => r.sent_at >= dayAgo).length

  const counts = new Map<string, number>()
  for (const r of rows) counts.set(r.email_key, (counts.get(r.email_key) ?? 0) + 1)
  const byKey = [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)

  const verdict = judge(config, lastSendAt, sent7d)
  return { ...verdict, config, lastSendAt, sent24h, sent7d, byKey }
}

export default async function EmailHealthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  let h: EmailHealth | null = null
  let readError: string | null = null
  try {
    h = await readHealth()
  } catch (e) {
    // A missing table is itself the answer, so say so rather than crashing on
    // the one page whose job is telling you what is wrong.
    readError = e instanceof Error ? e.message : 'Could not read the email logs.'
  }

  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
    letterSpacing: '0.13em', textTransform: 'uppercase',
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      <Link href="/dashboard" style={{ ...eyebrow, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← Dashboard
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px, 7vw, 32px)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '14px 0 6px' }}>
        Email health
      </h1>
      <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 22px' }}>
        The lifecycle run goes at eight every morning. With no Resend key it returns skipped and stops, which looks exactly like a quiet morning, so this says which it is.
      </p>

      {readError && (
        <div style={{ background: 'var(--danger-bg)', border: '1.5px solid var(--danger-border)', borderRadius: 18, padding: '16px 18px', marginBottom: 18 }}>
          <div style={{ ...eyebrow, color: 'var(--danger)', marginBottom: 5 }}>Could not read</div>
          <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>{readError}</p>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 0' }}>
            If that names a missing table, the migration behind it has not been run yet.
          </p>
        </div>
      )}

      {h && (
        <>
          {/* The verdict, in one word, at the top. */}
          <div style={{
            background: h.live ? 'var(--tint-sage)' : 'var(--terracotta-lt)',
            border: `1.5px solid ${h.live ? 'var(--retro-green)' : 'var(--terracotta)'}`,
            borderRadius: 20, padding: '18px 20px', marginBottom: 18,
          }}>
            <div style={{ ...eyebrow, color: h.live ? 'var(--retro-green-dark)' : 'var(--terracotta-dark)', marginBottom: 4 }}>
              Right now
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: 'var(--ink)', lineHeight: 1.15, marginBottom: 6 }}>
              {h.headline}
            </div>
            <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{h.detail}</p>
          </div>

          {/* The settings. Never a secret's value, only whether it is there. */}
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px', marginBottom: 18 }}>
            <div style={{ ...eyebrow, color: 'var(--terracotta-dark)', marginBottom: 12 }}>Settings</div>
            {h.config.map(c => (
              <div key={c.key} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 14 }}>
                <span aria-hidden style={{ flexShrink: 0, fontSize: 18, lineHeight: 1.3 }}>
                  {c.set ? '✅' : c.fatal ? '🛑' : '⚠️'}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{c.key}</span>
                  <span style={{ display: 'block', fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>
                    {c.why}
                  </span>
                  {c.value && (
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink-muted)', marginTop: 3, wordBreak: 'break-all' }}>
                      {c.value}
                    </span>
                  )}
                </span>
              </div>
            ))}
            <p style={{ fontSize: 14.5, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '4px 0 0' }}>
              Only whether each one is set is shown, never its value.
            </p>
          </div>

          {/* What actually went out. */}
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px' }}>
            <div style={{ ...eyebrow, color: 'var(--terracotta-dark)', marginBottom: 12 }}>What has gone out</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              {[
                { n: h.sent24h, label: 'last 24 hours' },
                { n: h.sent7d, label: 'last 7 days' },
              ].map(s => (
                <span key={s.label} style={{ flex: 1, minWidth: 120, background: 'var(--cream)', borderRadius: 14, padding: '12px 13px' }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, color: 'var(--ink)', lineHeight: 1 }}>{s.n}</span>
                  <span style={{ display: 'block', ...eyebrow, fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>{s.label}</span>
                </span>
              ))}
            </div>

            {h.byKey.length === 0 ? (
              <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                Nothing in the last seven days.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {h.byKey.map(k => (
                  <li key={k.key} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px dotted var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--ink)', wordBreak: 'break-all' }}>{k.key}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink)', flexShrink: 0 }}>{k.count}</span>
                  </li>
                ))}
              </ul>
            )}

            <p style={{ fontSize: 14.5, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 0' }}>
              Counted from the send logs, which are written before each email leaves, so this is what was really sent and not what was intended.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
