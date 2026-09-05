import Link from 'next/link'
import HappyIcon from '@/components/kid/HappyIcon'

// The pre warning, before it becomes a discussion. Social media turns into a
// real conversation at the secondary school move, around 11, so this gentle
// heads up shows a stage earlier (Builder, 8 to 10): you have time, here is how
// to get ahead of it. Light and calm, never the heavy run up to 16 panel, which
// takes over from Stage 3. Additive, only rendered for Stage 2 from Home.

export default function SocialMediaHeadsUp({ childName }: { childName?: string | null }) {
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  return (
    <div style={{ background: 'var(--tint-blue)', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)', borderRadius: '20px', padding: '20px 22px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
        <span aria-hidden style={{ width: 38, height: 38, borderRadius: '11px', background: '#fff', border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><HappyIcon name="friends" size={26} /></span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          DiGi, looking ahead
        </span>
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)', marginBottom: '8px' }}>
        Social media becomes a real conversation at secondary school
      </h3>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 16px' }}>
        You have time, and that is the point. Around 11, when {name} starts secondary, the group chats and the first apps arrive fast. Families who meet it early meet it calm. Here is the ramp, and the exact settings for when each app turns up.
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link href="/dashboard/social-settings" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'var(--terracotta)', color: 'var(--ink)', border: '2px solid var(--ink)', borderRadius: '13px', padding: '12px 18px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', boxShadow: '0 4px 0 var(--ink)' }}>
          See the settings, app by app
        </Link>
        <Link href="/dashboard/lessons" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--ink)', background: '#fff', border: '2px solid var(--ink)', borderRadius: '13px', padding: '12px 18px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 4px 0 var(--ink)' }}>
          The lessons for this
        </Link>
      </div>
    </div>
  )
}
