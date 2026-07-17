// DiGi's occasional social media insight for the parent, by the child's age. Two
// evidence bases, used together: Candace Odgers on what the data actually shows
// (effects are small on average and uneven, some children are far more
// vulnerable than others, context and what screens displace matter more than the
// clock), and Catherine Knibbs on the psychology (the trusted adult and
// co-regulation are the safeguard, a child needs a calm place to bring what they
// see, never shame). Calm, named to the child, never alarmist. Shown sparingly so
// it lands as a gentle check, not a lecture.

export type SocialInsight = { text: string; source: string }

const BY_BAND: Record<string, SocialInsight[]> = {
  '4-7': [
    { text: 'At NAME’s age the research is reassuring: it is less about the screen and more about what is around it. Co watch, and talk about what you both see. Talking about screens now is the habit that protects later.', source: 'Candace Odgers' },
    { text: 'NAME cannot yet tell real from pretend online, so you are their filter, and that is exactly right for now. Same room, same screen, and you are the calm place they bring anything odd to.', source: 'Catherine Knibbs' },
  ],
  '8-10': [
    { text: 'Around now NAME may start to compare themselves to what they see. The evidence says the child who can talk to you about it is the protected one, not the child kept away from it. Keep the door open.', source: 'Candace Odgers' },
    { text: 'NAME does not need social media yet, and the wait is a gift, not a punishment. If something online ever unsettles them, the thing that keeps them safe is knowing you will not overreact.', source: 'Catherine Knibbs' },
  ],
  '11-13': [
    { text: 'This is the age the algorithm starts to learn NAME. The data is clear it is not the same for every child: the ones already struggling feel it most. Watch the mood, not just the clock.', source: 'Candace Odgers' },
    { text: 'If NAME sees something upsetting online, they need you to be a calm place to bring it, not a reason to hide it. A child processes what they see through a trusted adult. That is the whole safeguard.', source: 'Catherine Knibbs' },
  ],
  '13-15': [
    { text: 'For NAME now, social media is where friendships live, and the evidence says pulling them off it can cost more than it protects. The work is helping them notice how it makes them feel.', source: 'Candace Odgers' },
    { text: 'A teenager who hits something distressing online carries it alone unless a trusted adult helps them hold it. Be that adult for NAME before anything happens, so the first call is to you.', source: 'Catherine Knibbs' },
  ],
  '16+': [
    { text: 'NAME is at the age our platform keeps supporting, not stops. The research says self awareness is the real skill now: does this give me what I want, or just take my time?', source: 'Candace Odgers' },
    { text: 'Even at 16 and beyond the brain is still forming, and NAME still needs you as the calm sounding board when something online goes wrong. The relationship does not retire.', source: 'Catherine Knibbs' },
  ],
}

export function socialInsightFor(ageBand: string | null, childName: string, index: number): SocialInsight | null {
  const list = (ageBand && BY_BAND[ageBand]) || BY_BAND['8-10']
  if (!list || list.length === 0) return null
  const pick = list[Math.abs(index) % list.length]
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  return { text: pick.text.replace(/NAME/g, name), source: pick.source }
}
