import Link from 'next/link'

// The phone conversation, looked ahead to. It usually starts around 9 to 10,
// with independence as the reason, not apps. This gentle Builder stage heads up
// carries our belief: not a brick phone, but a locked down phone released bit
// by bit, used as a tutor. Light and calm, links to the full setup and the
// habit lessons. Rotates with the social media heads up so only one shows at a
// time. Additive, no redesign.

export default function PhoneHeadsUp({ childName }: { childName?: string | null }) {
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  return (
    <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--tint-sage)', borderRadius: '20px', padding: '20px 22px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
        <span aria-hidden style={{ width: 34, height: 34, borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>⭐</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          DiGi, looking ahead
        </span>
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)', marginBottom: '8px' }}>
        The phone conversation starts around now
      </h3>
      <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 16px' }}>
        Around 9 to 10 the question of a first phone arrives, usually for independence rather than apps. Our take is not a brick phone. Start a real one locked right down, hand back a little time and one app at a time, and let the good apps do the teaching. Used well, {name}'s first phone can be one of their best tutors.
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link href="/dashboard/phone-setup" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '13px', padding: '12px 18px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
          How to set it up, our way
        </Link>
        <Link href="/dashboard/digi?q=When%20should%20my%20child%20get%20their%20first%20phone%2C%20and%20how%20do%20I%20set%20it%20up%3F" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '13px', padding: '12px 18px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px' }}>
          Ask DiGi
        </Link>
      </div>
    </div>
  )
}
