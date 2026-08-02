'use client'

import { useEffect, useState } from 'react'

// While DiGi thinks, one quiet line of reassurance rotates under the dots. It
// says the true thing that sets DiGi apart from a plug in chatbot: the answer
// is drawn from research we have reviewed and held to safety guardrails, not
// scraped live off the open web. Every line here is literally what the system
// does, so it reassures without overclaiming. No dashes, Justin's voice.

// Justin: "we did have some message from DiGi whilst it was thinking, giving
// parents an idea what was happening. Looking at feedback from parents, board of
// researchers, data and research from organisations, putting it all together
// with feedback from this family to get your answer. Your feedback counts and
// helps DiGi learn."
//
// The first five lines said research and guardrails and stopped there, which
// misses the two things that actually make this different from a chatbot: other
// families, and THIS family. Both are real and both are in the same prompt
// (app/api/digi/route.ts line 407): aggregateWisdom, expertKnowledge and
// familyMemory are concatenated into one context.
//
// Every line is checked against what the code does, because a reassurance that
// overclaims is worse than none. Specifically:
//   - "other families" is lib/digi/wisdom.ts rebuildWisdom, which reads resolved
//     concerns, scripts marked as worked, and parent feedback across accounts.
//   - "never who they are" is literally true: child_id and user_id are read only
//     to join an age band and are never sent onward.
//   - "your feedback goes back in" is true because digi_feedback is one of
//     rebuildWisdom's three sources, so a parent's answer shapes later ones.
const LINES = [
  'Checking our reviewed research, not the open web.',
  'Reading what actually works at this age.',
  'Seeing what worked for other families with a child this age.',
  'What other parents found, never who they are.',
  'Your own family history is part of this answer.',
  'Every answer runs past our safety guardrails first.',
  'Putting the research and your family together.',
  'Your feedback goes back in and shapes the next answer.',
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
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 500,
        color: 'var(--ink-muted)', lineHeight: 1.4,
        animation: 'gcReassureFade 0.5s ease',
      }}
    >
      {LINES[i]}
      <style>{`@keyframes gcReassureFade { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </span>
  )
}
