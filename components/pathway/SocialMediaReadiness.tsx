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
// Shown from Stage 3 (the critical window) onward, where social media
// readiness becomes the live question. Below that the passport is quietly
// building and the dashboard stays calm.

// The evidence point that fits each stage best. Stage 4 leads with the two
// that matter most as 16 approaches: preparing over postponing, and the cliff
// edge itself.
const STAGE_EVIDENCE_INDEX: Record<number, number> = {
  3: 2, // harms and benefits, the nuance for the critical window
  4: 0, // preparing beats postponing
  5: 3, // sixteen is a cliff edge, unless you build a ramp
}

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

  // The heavy stage (13 to 15) reads as an alert: deep teal, brighter, because
  // this is the run up Justin wants a parent to feel. The others sit calmer.
  const accent = isHeavy ? 'var(--terracotta)' : 'var(--terracotta)'
  const surface = isHeavy ? 'var(--deep-teal)' : 'var(--stage-4)'
  const onDark = isHeavy
  const titleColor = onDark ? '#fff' : 'var(--ink)'
  const bodyColor = onDark ? 'rgba(255,255,255,0.82)' : 'var(--ink-soft)'
  const eyebrowColor = onDark ? 'var(--terracotta)' : 'var(--terracotta)'

  return (
    <div
      style={{
        background: surface,
        borderRadius: '20px',
        border: onDark ? 'none' : '1.5px solid var(--stage-4)',
        padding: '22px 22px 20px',
        marginBottom: '20px',
        overflow: 'hidden',
      }}
    >
      {/* Eyebrow: the passport, named, plus the live moment */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: eyebrowColor,
        }}>
          Social media passport
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: onDark ? 'rgba(255,255,255,0.7)' : 'var(--ink-muted)',
          background: onDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.6)',
          padding: '3px 8px', borderRadius: '100px',
        }}>
          {readiness.moment}
        </span>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 'clamp(1.15rem, 3.5vw, 1.35rem)', letterSpacing: '-0.02em',
        lineHeight: 1.15, color: titleColor, marginBottom: '10px',
      }}>
        {readiness.title}
      </h3>

      <p style={{ fontSize: '14px', lineHeight: 1.6, color: bodyColor, marginBottom: '16px' }}>
        {readiness.body}
      </p>

      {/* The one thing to do this stage */}
      <div style={{
        background: onDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.65)',
        borderRadius: '12px', padding: '13px 15px', marginBottom: '16px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: eyebrowColor, marginBottom: '5px',
        }}>
          {isEarned ? 'Where it lands' : 'This stage'}
        </div>
        <p style={{ fontSize: '13px', lineHeight: 1.55, color: onDark ? 'rgba(255,255,255,0.9)' : 'var(--ink)', margin: 0 }}>
          {readiness.focus}
        </p>
      </div>

      {/* Evidence highlight: the reason, in sight, with a name on it */}
      <div style={{
        borderLeft: `3px solid ${accent}`,
        paddingLeft: '13px', marginBottom: '18px',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
          color: titleColor, marginBottom: '4px', lineHeight: 1.35,
        }}>
          {evidence.headline}
        </p>
        <p style={{ fontSize: '12.5px', lineHeight: 1.55, color: bodyColor, margin: '0 0 6px' }}>
          {evidence.detail}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.04em',
          color: onDark ? 'rgba(255,255,255,0.6)' : 'var(--ink-muted)', margin: 0,
        }}>
          {evidence.source}
        </p>
      </div>

      {/* Actions: talk it through with DiGi, and see the full evidence */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(
            isHeavy
              ? `How do I start the heavy social media training for ${name} as they approach 16?`
              : `How do I build ${name}'s social media readiness at this stage?`
          )}`}
          style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'var(--terracotta)', color: onDark ? 'var(--ink)' : '#fff',
            borderRadius: '13px', padding: '11px 18px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}
        >
          {isHeavy ? 'Start the training with DiGi' : 'Talk it through with DiGi'}
        </Link>
        <Link
          href="/passport"
          style={{
            display: 'inline-flex', alignItems: 'center',
            color: onDark ? '#fff' : 'var(--ink)',
            border: `1.5px solid ${onDark ? 'rgba(255,255,255,0.35)' : 'var(--border)'}`,
            borderRadius: '13px', padding: '11px 18px', textDecoration: 'none',
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          See the evidence
        </Link>
      </div>
    </div>
  )
}
