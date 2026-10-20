import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// The free printables, in one place (13 October 2026). Each one is a whole
// thing to print and do, in the Happy News finish, and each ends at the stage
// check. Issue 1 of The Planet Post leads; the other four approved in
// plans/2026-10-13-free-printables-lead-magnets-plan.md join this list as
// they are made.

export const metadata = {
  title: 'Free printables for kids and screens · Guided Childhood',
  description: 'Free, print at home activities that help kids and grown ups get screen time right together.',
}

const FREE = [
  {
    href: '/free/planet-post', img: '/printables/free/planet-post-1-p1.png',
    title: 'The Planet Post, Issue 1', sub: 'A four page newspaper for kids about how screens work in your house. Ages 6 to 11.',
  },
]

const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 12px', color: 'var(--ink)' }

export default function FreePrintables() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '44px 18px 80px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 10px' }}>Free printables</p>
      <h1 style={H1}>Print it, do it together</h1>
      <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 26px' }}>
        Free things for kids to read, colour and fill in, each one a small step to getting screens right in your house.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 20 }}>
        {FREE.map(f => (
          <Link key={f.href} href={f.href} style={{ textDecoration: 'none', color: 'var(--ink)', background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)', padding: 12, display: 'block' }}>
            <Image src={f.img} alt="" width={740} height={1000} sizes="(max-width: 760px) 100vw, 280px" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8, border: '1.5px solid var(--border)' }} />
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', marginTop: 12 }}>{f.title}</span>
            <span style={{ display: 'block', fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--ink-soft)', marginTop: 4 }}>{f.sub}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
