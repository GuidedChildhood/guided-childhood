import Link from 'next/link'
import type { CSSProperties } from 'react'

export const metadata = {
  title: 'Five questions before you hand over a screen · Guided Childhood',
  description: 'Five simple questions that help any parent make a calm, confident call about screens, no guilt and no lectures.',
}

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '48px 22px 80px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '12px' }
const P: CSSProperties = { fontSize: '15.5px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }

const QUESTIONS = [
  ['Is the screen replacing something, or adding to the day?', 'The real risk is what screens crowd out: sleep, movement, real play, and the boredom that turns into ideas. A show after a day full of those is very different from one that took their place.'],
  ['Do they know when it stops before it starts?', 'A clear end agreed up front, a number of minutes or the end of one thing, turns the hardest moment, switching off, into a plan you both already made.'],
  ['Whose idea was it to pick it up?', 'Reaching for a screen out of a real want is fine. Reaching for it out of habit, every gap filled, is the pattern worth gently noticing together.'],
  ['Would you be happy to watch it with them?', 'Not every minute, but if the answer is a flat no, that is useful information about the app, not about you.'],
  ['What does the wind down look like after?', 'A calm bridge back to the room, a snack, a chat, a job to do, makes the difference between a screen that settles a child and one that leaves them wired.'],
]

export default function FiveQuestionsPage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>Five questions</p>
      <h1 style={H1}>Five questions worth asking before you hand over a screen</h1>
      <p style={P}>
        No lecture, no guilt. Just five calm questions that help you make the call that fits your child and your day. Most parents find they already know the answers, they just needed the questions.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', margin: '30px 0 36px' }}>
        {QUESTIONS.map(([q, a], i) => (
          <div key={i} style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: 'var(--terracotta)', flexShrink: 0 }}>{i + 1}</span>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.25 }}>{q}</h2>
                <p style={{ ...P, margin: 0 }}>{a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '18px', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--ink)', margin: '0 0 12px' }}>Want a calm plan, not just questions?</p>
        <Link href="/starter-pack" className="btn btn-gold" style={{ padding: '13px 26px', fontSize: '15px' }}>Get the free starter pack</Link>
      </div>
    </div>
  )
}
