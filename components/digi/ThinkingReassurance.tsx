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
// Justin, 24 September 2026, choosing to keep DiGi at medium effort for
// accuracy rather than trade it for speed: "keep DiGi accurate and maybe just
// give a bit more info as it's thinking, on our philosophy, the science,
// the safety checks." So the wait now says more of what is genuinely
// happening in it, in the order a parent most needs to hear it. Each new line
// was checked against the code the same way:
//   - "never a flat yes or no" is non negotiable one, enforced in the prompt
//     rails (lib/digi/system.ts) and in the route.
//   - "connection before control" is digi/07-trust-framework.md, which
//     lib/digi/system.ts loads into every conversation.
//   - "where your child is on their pathway" is getPathwayPosition in the
//     route, read from the child's stage.
//   - "the scientists we trust" is digi/02-scientists.md, also loaded.
//   - "the words for this" is the matching and recommended scripts the route
//     fetches before the model is called.
//   - the safety pair replaces "every answer runs past our safety guardrails
//     first", which overclaimed: the verifier (lexicalFlags) runs on the
//     FINISHED reply and records what it catches for review, it does not
//     stand in front of the reply. What stands in front is the prompt's
//     safeguarding rule, which routes any crisis to real people first.
//   - no line claims neuroscience: 4 of 142 active research rows touch the
//     brain, which is not enough to say it out loud.
const LINES = [
  'Checking our reviewed research, not the open web.',
  'Reading what the research says for a child this age.',
  'Finding where your child is on their pathway.',
  'Never a flat yes or no. Working out your next step.',
  'Connection before control. Keeping your bond at the centre.',
  'Weighing it against the scientists we trust.',
  'Seeing what worked for other families with a child this age.',
  'What other parents found, never who they are.',
  'Your own family history is part of this answer.',
  'Looking for the words you can actually use.',
  'If it is ever serious, DiGi points you to real people first.',
  'Every answer is checked afterwards, and anything worrying is reviewed.',
  'Your feedback goes back in and shapes the next answer.',
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
