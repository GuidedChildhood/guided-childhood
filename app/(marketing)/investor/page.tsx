import Link from 'next/link'
import type { CSSProperties } from 'react'

export const metadata = {
  title: 'For investors · Guided Childhood',
  description: 'Guided Childhood is the calm operating system for modern parenting. A short overview for investors.',
}

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '48px 22px 80px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '12px' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)', margin: '34px 0 10px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: '15.5px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }

// DRAFT overview for investors. JP to refine the numbers and story.
export default function InvestorPage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>For investors</p>
      <h1 style={H1}>The calm operating system for modern parenting</h1>
      <p style={P}>
        Every parent of a young child is being asked to make hard calls about screens, school and growing up, with more noise and less help than any generation before them. Guided Childhood turns that pressure into a calm, guided daily practice, powered by DiGi, a warm AI guide, and a real world reward system that gets children off screens without a fight.
      </p>

      <h2 style={H2}>The problem</h2>
      <p style={P}>
        The market is full of blockers and trackers that police children and shame parents. None of them teach the habits that matter for the years when the adult is not in the room. Parents are left anxious, and children learn nothing durable.
      </p>

      <h2 style={H2}>The approach</h2>
      <p style={P}>
        A guided pathway from ages four to sixteen, an AI guide that always returns a calibrated next step rather than a yes or no, and a family star economy that pays real world play and jobs, then trades stars for agreed screen time. Calm, evidence led, and built to be used every day.
      </p>

      <h2 style={H2}>The model</h2>
      <p style={P}>
        A simple family subscription, with a founder tier at launch, plus a schools route that brings the same pathway into classrooms. One product, two doors, the same mission.
      </p>

      <h2 style={H2}>Talk to us</h2>
      <p style={P}>
        For the deck and the detail, see <Link href="/investor-deck" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the investor deck</Link>, or reach the founder directly at <a href="mailto:hello@guidedchildhood.com" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>hello@guidedchildhood.com</a>.
      </p>
    </div>
  )
}
