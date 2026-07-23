import Link from 'next/link'

// One vetted tool, in the honest shape DiGi always uses: the problem in a
// parent's words, the fix and the science behind it, and the benefit of
// signing up. An evidence grade sits on show so nothing is oversold, and until
// Justin has attached a specific service the card routes to DiGi for a pick
// rather than naming an unvetted brand.

export type Tool = {
  id: string
  category: string
  name: string
  problem: string
  fix: string
  science: string
  benefit: string
  url: string | null
  cost_note: string | null
  evidence_grade: string
  affiliate: boolean
}

const GRADE: Record<string, { label: string; bg: string; fg: string }> = {
  strong: { label: 'Strong evidence', bg: 'var(--tint-sage)', fg: 'var(--deep-teal)' },
  moderate: { label: 'Good evidence', bg: 'var(--stage-2)', fg: 'var(--stage-2-text)' },
  emerging: { label: 'Emerging, parents rate it', bg: 'var(--stage-5)', fg: 'var(--stage-5-text)' },
}

export default function ToolCard({ tool }: { tool: Tool }) {
  const grade = GRADE[tool.evidence_grade] ?? GRADE.emerging

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '18px 20px', marginBottom: '14px', boxShadow: '0 4px 16px rgba(26,26,46,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          {tool.category}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: grade.fg, background: grade.bg, borderRadius: '100px', padding: '4px 10px', whiteSpace: 'nowrap' }}>
          {grade.label}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
        <Row label="The problem" body={tool.problem} />
        <Row label="The fix" body={tool.fix} />
        <Row label="Why it works" body={tool.science} />
        <Row label="The benefit" body={tool.benefit} accent />
      </div>

      {tool.cost_note && (
        <p style={{ fontSize: '12px', color: 'var(--ink-muted)', margin: '12px 0 0', fontFamily: 'var(--font-body)' }}>
          {tool.cost_note}
        </p>
      )}

      <div style={{ marginTop: '14px' }}>
        {tool.url ? (
          <a href={tool.url} target="_blank" rel="noopener noreferrer" style={ctaStyle}>
            See it{tool.affiliate ? '' : ''} →
          </a>
        ) : (
          <Link href={`/dashboard/digi?q=${encodeURIComponent(`I am looking at ${tool.category.toLowerCase()} to help with: ${tool.problem} Which specific one would you recommend for our family and what should I check before signing up?`)}`} style={ctaStyle}>
            Ask DiGi which one fits us →
          </Link>
        )}
        {tool.affiliate && tool.url && (
          <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--ink-muted)', marginTop: '7px' }}>
            We may earn a little if you sign up through this link. We only recommend what we would use ourselves.
          </span>
        )}
      </div>
    </div>
  )
}

const ctaStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
  border: 'none', borderRadius: '12px', padding: '10px 16px',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
  boxShadow: '0 4px 0 var(--terracotta-dark)',
}

function Row({ label, body, accent = false }: { label: string; body: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent ? 'var(--deep-teal)' : 'var(--ink-muted)', marginBottom: '3px' }}>
        {label}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.55, margin: 0, fontWeight: accent ? 600 : 400 }}>
        {body}
      </p>
    </div>
  )
}
