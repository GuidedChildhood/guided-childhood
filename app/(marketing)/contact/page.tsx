import Link from 'next/link'
import type { CSSProperties } from 'react'

export const metadata = {
  title: 'Contact · Guided Childhood',
  description: 'How to reach the Guided Childhood team for help, questions, or anything about your account and your family’s data.',
}

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '48px 22px 80px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '10px' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)', letterSpacing: '-0.02em', margin: '34px 0 10px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: '15.5px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }
const LI: CSSProperties = { fontSize: '15.5px', lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 7px' }
const MAIL: CSSProperties = { color: 'var(--terracotta-dark)', fontWeight: 700 }

export default function ContactPage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>Contact</p>
      <h1 style={H1}>Talk to a real person</h1>

      <p style={P}>
        Guided Childhood is a small team building something we care about. If you have a question, need a hand with your account, or want to tell us something is not working, we would genuinely like to hear from you.
      </p>

      <h2 style={H2}>Email us</h2>
      <p style={P}>
        The quickest way to reach us is <a href="mailto:hello@guidedchildhood.com" style={MAIL}>hello@guidedchildhood.com</a>. We read every message and aim to reply within two working days.
      </p>

      <h2 style={H2}>What we can help with</h2>
      <ul>
        <li style={LI}>Getting started, onboarding, or anything about the pathway and lessons.</li>
        <li style={LI}>Your subscription, the founder rate, or a billing question.</li>
        <li style={LI}>Your family’s data: seeing it, correcting it, or having it deleted.</li>
        <li style={LI}>Anything that feels off, unclear, or broken. That feedback shapes what we build next.</li>
      </ul>

      <h2 style={H2}>Your data and your rights</h2>
      <p style={P}>
        If your question is about the information we hold on your family, our <Link href="/privacy" style={MAIL}>Privacy Policy</Link> explains what we collect and the rights you have under UK data protection law. Email us and we will help you exercise any of them.
      </p>

      <p style={{ ...P, marginTop: '36px' }}>
        <Link href="/privacy" style={MAIL}>Privacy Policy</Link>
        {'   ·   '}
        <Link href="/terms" style={MAIL}>Terms</Link>
      </p>
    </div>
  )
}
