// Last Monday's review of what actually worked, at the top of the founder board.
//
// Justin: "so that we are saving data gathering on my management board and
// weekly meetings where an agent reviews it for findings."
//
// Presentational only, and fed server side. management_findings has no client
// readable policy on purpose: it is aggregate across every family, so it is read
// by the page after the founder email check rather than by a browser holding a
// session. A founder dashboard that quietly becomes reachable is the kind of
// mistake that is only ever found afterwards.
//
// Sits ABOVE the daily insight board because it answers the more important
// question. That board says what parents asked. This says what helped.

export type ManagementFindingRow = {
  week_start: string
  summary: string
  findings: { observation: string; suggestion: string; area: string }[]
  metrics: Record<string, unknown>
  model: string | null
}

const AREA_TINT: Record<string, { bg: string; fg: string }> = {
  growth: { bg: 'var(--stage-2)', fg: 'var(--stage-2-text)' },
  product: { bg: 'var(--stage-4)', fg: 'var(--stage-4-text)' },
  content: { bg: 'var(--stage-3)', fg: 'var(--stage-3-text)' },
  risk: { bg: '#FDECEC', fg: '#A33A3A' },
}

/** The handful worth seeing at a glance, in the order they answer "how did the week go". */
const HEADLINE: { key: string; label: string }[] = [
  { key: 'new_families', label: 'New families' },
  { key: 'script_success_rate', label: 'Scripts that worked' },
  { key: 'jobs_approved', label: 'Jobs approved' },
  { key: 'days_all_five_done', label: 'Full days done' },
  { key: 'sticker_credits_awarded', label: 'Credits earned' },
  { key: 'questions_asked', label: 'Questions asked' },
]

export default function ManagementReviewPanel({ row }: { row: ManagementReviewRowOrNull }) {
  if (!row) {
    return (
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px', marginBottom: 20 }}>
        <p className="eyebrow" style={{ marginBottom: 6 }}>Weekly review</p>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          No review yet. It runs at half past midnight every Monday, on the week just gone. Until the first one lands there is nothing here, which is the honest state rather than an empty chart.
        </p>
      </div>
    )
  }

  const m = row.metrics ?? {}
  const val = (k: string) => {
    const v = m[k]
    if (v == null) return null
    // The success rate is a percentage and nothing else here is.
    return k === 'script_success_rate' ? `${v}%` : String(v)
  }

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18, padding: '20px 22px', marginBottom: 22, boxShadow: '0 3px 0 rgba(26,26,46,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        <p className="eyebrow" style={{ margin: 0 }}>Week of {row.week_start}</p>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)' }}>
          {row.model ? `Reviewed by ${row.model}` : 'Numbers only, agent unavailable'}
        </span>
      </div>

      <p style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 16px' }}>
        {row.summary}
      </p>

      {/* The numbers the words were built from, so a finding can be checked
          rather than taken on trust. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 18 }}>
        {HEADLINE.map(h => {
          const v = val(h.key)
          return (
            <div key={h.key} style={{ background: 'var(--cream)', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', lineHeight: 1.1 }}>
                {v ?? '—'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 2 }}>
                {h.label}
              </div>
            </div>
          )
        })}
      </div>

      {row.findings.length === 0 ? (
        <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          No findings this week. A quiet week with nothing worth acting on is a real result, and inventing three bullet points for it would only teach you to stop reading these.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {row.findings.map((f, i) => {
            const tint = AREA_TINT[f.area] ?? { bg: 'var(--cream)', fg: 'var(--ink-soft)' }
            return (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 14, padding: '13px 15px' }}>
                <span style={{ display: 'inline-block', background: tint.bg, color: tint.fg, borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>
                  {f.area}
                </span>
                <p style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 5px', fontWeight: 600 }}>
                  {f.observation}
                </p>
                <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
                  {f.suggestion}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

type ManagementReviewRowOrNull = ManagementFindingRow | null
