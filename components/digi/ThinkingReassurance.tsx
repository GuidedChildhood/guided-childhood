'use client'

import { useEffect, useState } from 'react'

// While DiGi thinks, one quiet line of reassurance rotates under the dots. It
// says the true thing that sets DiGi apart from a plug in chatbot: the answer
// is drawn from research we have reviewed and held to safety guardrails, not
// scraped live off the open web. Every line here is literally what the system
// does, so it reassures without overclaiming. No dashes, Justin's voice.

const LINES = [
  'Checking our reviewed research, not the open web.',
  'Reading what actually works at this age.',
  'Every answer runs past our safety guardrails first.',
  'Pulling the calm, evidence based answer for you.',
  'Grounded in child development science we trust.',
]

export default function ThinkingReassurance() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % LINES.length), 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <span
      key={i}
      style={{
        fontFamily: 'var(--font-body)', fontSize: '12.5px', fontWeight: 500,
        color: 'var(--ink-muted)', lineHeight: 1.4,
        animation: 'gcReassureFade 0.5s ease',
      }}
    >
      {LINES[i]}
      <style>{`@keyframes gcReassureFade { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </span>
  )
}
