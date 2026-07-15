import Link from 'next/link'
import type { CSSProperties } from 'react'

export const metadata = {
  title: 'The evidence behind Guided Childhood',
  description: 'The research stance Guided Childhood is built on: calm, balanced, and honest about what we know and what we do not.',
}

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '48px 22px 80px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '12px' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)', margin: '34px 0 10px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: '15.5px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }

// DRAFT: the evidence stance, plain and defensible. Swap in the full cited
// library from the kids-research briefings when ready.
const POINTS = [
  ['It is not the screen, it is what it displaces', 'The strongest, most agreed finding is that the harm from screens is mostly about what they crowd out: sleep, movement, real play, and unstructured time. Guided Childhood is built to protect those, not to demonise devices.'],
  ['Balance beats bans', 'Outright bans tend to push behaviour underground and teach nothing for the years when a parent is not in the room. A calm, agreed structure that grows with the child is what the developmental research supports.'],
  ['Repair matters more than perfection', 'Warm relationships are out of step much of the time. What builds a child security is coming back together after a rough patch, not never slipping. Our tone with parents follows that.'],
  ['Boredom is not the enemy', 'Empty time is where children learn to generate their own ideas. We treat I am bored as a doorway, not a problem to fix with a screen.'],
]

export default function EvidencePage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>The evidence</p>
      <h1 style={H1}>What Guided Childhood is built on</h1>
      <p style={P}>
        We try to be honest about what the research does and does not say. The headlines are often louder than the science. Here is the stance the whole product rests on, calm, balanced, and open to being updated as the evidence moves.
      </p>

      {POINTS.map(([h, b], i) => (
        <div key={i}>
          <h2 style={H2}>{h}</h2>
          <p style={P}>{b}</p>
        </div>
      ))}

      <h2 style={H2}>Where DiGi gets its answers</h2>
      <p style={P}>
        Inside the app, DiGi draws on a growing library of expert positions and real research, grounded to named sources rather than invented, and it is honest when something is unsettled. The full cited briefings sit behind the product and are refreshed as new work lands.
      </p>

      <div style={{ marginTop: '30px' }}>
        <Link href="/starter-pack" className="btn btn-gold" style={{ padding: '13px 26px', fontSize: '15px' }}>Start with the free pack</Link>
      </div>
    </div>
  )
}
