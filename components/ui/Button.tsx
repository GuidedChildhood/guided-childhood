import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

// The one button. Every call to action across the app renders through here,
// so the radius, the chunky drop shadow, the display type and the sizes are
// identical everywhere, the Mobbin rule: one button, used consistently, not
// twenty hand rolled ones. Renders a link when given href, a real button
// otherwise, so it drops into either place with the same look.

type Variant = 'primary' | 'secondary' | 'quiet' | 'teal' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const SIZE: Record<Size, { padding: string; fontSize: string; radius: string; lift: string }> = {
  sm: { padding: '8px 14px', fontSize: '12.5px', radius: '11px', lift: '3px' },
  md: { padding: '11px 18px', fontSize: '14px', radius: '13px', lift: '4px' },
  lg: { padding: '14px 22px', fontSize: '15px', radius: '15px', lift: '5px' },
}

function surface(variant: Variant): { bg: string; color: string; border: string; shadowColor: string | null } {
  switch (variant) {
    case 'primary': return { bg: 'var(--terracotta)', color: 'var(--ink)', border: 'none', shadowColor: 'var(--terracotta-dark)' }
    case 'teal':    return { bg: 'var(--deep-teal)', color: '#fff', border: 'none', shadowColor: 'rgba(0,0,0,0.28)' }
    case 'danger':  return { bg: '#E5484D', color: '#fff', border: 'none', shadowColor: '#B93B3F' }
    case 'secondary': return { bg: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)', shadowColor: null }
    case 'quiet':   return { bg: 'transparent', color: 'var(--ink-soft)', border: 'none', shadowColor: null }
  }
}

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  icon?: ReactNode
  disabled?: boolean
  style?: CSSProperties
}

function styleFor({ variant = 'primary', size = 'md', fullWidth, disabled }: CommonProps): CSSProperties {
  const s = SIZE[size]
  const c = surface(variant)
  return {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : undefined,
    alignItems: 'center', justifyContent: 'center', gap: '7px',
    padding: s.padding, borderRadius: s.radius,
    background: c.bg, color: c.color, border: c.border,
    boxShadow: c.shadowColor ? `0 ${s.lift} 0 ${c.shadowColor}` : 'none',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: s.fontSize, lineHeight: 1.2,
    textDecoration: 'none', whiteSpace: 'nowrap', cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    transition: 'transform 0.06s ease',
  }
}

// Link button
export function ButtonLink(props: CommonProps & { href: string; target?: string; rel?: string }) {
  const { href, target, rel, children, icon, style } = props
  return (
    <Link href={href} target={target} rel={rel} style={{ ...styleFor(props), ...style }}>
      {icon}{children}
    </Link>
  )
}

// Action button
export default function Button(props: CommonProps & { onClick?: () => void; type?: 'button' | 'submit' }) {
  const { onClick, type = 'button', disabled, children, icon, style } = props
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...styleFor(props), ...style }}>
      {icon}{children}
    </button>
  )
}
