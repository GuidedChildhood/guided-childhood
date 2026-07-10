import Link from 'next/link'
import {
  STAGE_READINESS,
  PASSPORT_EVIDENCE,
  type EvidencePoint,
} from '@/lib/content/passport'

// The social media passport, made real on the dashboard. It shows a parent
// where their child is on the passport journey and, from about 13, turns the
// training heavy as the cliff edge at 16 comes into view. One evidence
// highlight travels with it, so the reason is always in sight, not buried.
//
// The heavy card is a premium warm dark panel, not a flat black box: a warm
// espresso gradient with a soft glow, raised inner surfaces with hairline
// borders, and a clear type hierarchy, so the run up to 16 feels weighty but
// crafted. Shown from Stage 3 onward; below that the dashboard stays calm.

const STAGE_EVIDENCE_INDEX: Record<number, number> = {
  3: 2, // harms and benefits, the nuance for the critical window
  4: 0, // preparing beats postponing
  5: 3, // sixteen is a cliff edge, unless you build a ramp
}

// A warm espresso gradient with a soft butter glow in the top corner. Reads as
// a premium dark panel with depth, never a flat black rectangle.
const HEAVY_SURFACE =
  'radial-gradient(120% 95% at 90% -5%, rgba(237,195,95,0.16), transparent 55%), linear-gradient(158deg, #37301F 0%, #2C2617 55%, #221D12 100%)'

export default function SocialMediaReadiness({
  stageId,
  childName,
}: {
  stageId: number
  childName?: string | null
}) {
  const readiness = STAGE_READINESS[stageId]
  if (!readiness || stageId < 3) return null

  const name = childName && childName !== 'Your child' ? childName : 'your child'
  const evidence: EvidencePoint =
    PASSPORT_EVIDENCE[STAGE_EVIDENCE_INDEX[stageId] ?? 0]
  const isHeavy = readiness.weight === 'heavy'
  const isEarned = readiness.weight === 'earned'
  const onDark = isHeavy

  const titleColor = onDark ? '#fff' : 'var(--ink)'
  const bodyColor = onDark ? 'rgba(255,255,255,0.80)' : 'var(--ink-soft)'
  const innerBg = onDark ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.7)'
  const innerBorder = onDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid var(--border)'

  return (
    <div
      style={{
        background: onDark ? HEAVY_SURFACE : 'var(--stage-4)',
        borderRadius: '24px',
        border: onDark ? '1px solid rgba(255,255,255,0.08)' : '1.5px solid var(--stage-4)',
        boxShadow: onDark ? '0 14px 40px rgba(0,0,0,0.28)' : 'none',
        padding: 'clamp(22px, 5vw, 28px)',
        marginBottom: '20px',
        overflow: 'hidden',
      }}
    >
      {/* Eyebrow: the passport, named, plus the live moment */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)',
        }}>
          Social media passport
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: onDark ? 'rgba(255,255,255,0.72)' : 'var(--ink-muted)',
          background: onDark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.65)',
          border: onDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid var(--border)',
          padding: '3px 9px', borderRadius: '100px',
        }}>
          {readiness.moment}
        </span>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 'clamp(1.35rem, 5vw, 1.7rem)', letterSpacing: '-0.025em',
        lineHeight: 1.1, color: titleColor, marginBottom: '12px',
      }}>
        {readiness.title}
      </h3>

      <p style={{ fontSize: 'clamp(1rem, 2.8vw, 1.08rem)', lineHeight: 1.65, color: bodyColor, marginBottom: '20px' }}>
        {readiness.body}
      </p>

      {/* The one thing to do this stage, a raised surface */}
      <div style={{
        background: innerBg, border: innerBorder,
        borderRadius: '16px', padding: '16px 18px', marginBottom: '14px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--terracotta)', marginBottom: '7px',
        }}>
          {isEarned ? 'Where it lands' : 'This stage'}
        </div>
        <p style={{ fontSize: '14px', lineHeight: 1.6, color: onDark ? 'rgba(255,255,255,0.92)' : 'var(--ink)', margin: 0 }}>
          {readiness.focus}
        </p>
      </div>

      {/* Evidence highlight, a raised surface with a terracotta edge */}
      <div style={{
        background: innerBg, border: innerBorder, borderLeft: '3px solid var(--terracotta)',
        borderRadius: '16px', padding: '16px 18px', marginBottom: '22px',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px',
          color: titleColor, marginBottom: '6px', lineHeight: 1.3,
        }}>
          {evidence.headline}
        </p>
        <p style={{ fontSize: '13px', lineHeight: 1.6, color: bodyColor, margin: '0 0 9px' }}>
          {evidence.detail}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.03em',
          color: onDark ? 'rgba(255,255,255,0.58)' : 'var(--ink-muted)', margin: 0,
        }}>
          {evidence.source}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(
            isHeavy
              ? `How do I start the heavy social media training for ${name} as they approach 16?`
              : `How do I build ${name}'s social media readiness at this stage?`
          )}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: '14px', padding: '13px 20px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          {isHeavy ? 'Start the training with DiGi' : 'Talk it through with DiGi'}
        </Link>
        <Link
          href="/passport"
          style={{
            display: 'inline-flex', alignItems: 'center',
            color: onDark ? '#fff' : 'var(--ink)',
            background: onDark ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: `1.5px solid ${onDark ? 'rgba(255,255,255,0.22)' : 'var(--border)'}`,
            borderRadius: '14px', padding: '13px 20px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
          }}
        >
          See the evidence
        </Link>
      </div>
    </div>
  )
}
