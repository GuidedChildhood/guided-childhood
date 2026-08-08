import DayCheckup from '@/components/home/DayCheckup'

// Layout fixture for the check on your child card.
//
// THE CASE THIS FIXTURE USED TO MISS, and it is the whole reason the card broke
// in Justin's hands on 8 August. It only ever showed two red strands, and the
// two longest names (AI and chatbots, Social media ready) were grey, which is
// the one tone that does NOT get the fix affordance. So the widest thing the
// card can draw had never once been drawn in a test, and the sideways scroll it
// caused went unseen through twenty six fixture pages and two overflow sweeps.
//
// All four red and linked is now the first case, with the real improve
// sentences, because a fixture that only shows the easy shape is a fixture that
// certifies the easy shape.

export const dynamic = 'force-dynamic'

export default function RefCheckup() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 20 }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', marginBottom: 10 }}>
        WORST CASE: all four red and linked, longest names, real fix sentences.
      </p>
      <DayCheckup
        childName="Teo" stageNum={4} stageName="Shaper"
        strands={[
          { key: 'safe', name: 'Safe online', tone: 'red', href: '/dashboard/devices', improve: 'Set up the Smart TV, the last screen without its settings done.' },
          { key: 'balance', name: 'Healthy balance', tone: 'red', href: '/dashboard/quests', improve: 'Add one job so the screen time being used is being earned.' },
          { key: 'ai', name: 'AI and chatbots', tone: 'red', href: '/dashboard/lessons', improve: 'Watch the AI lesson for this stage together.' },
          { key: 'social', name: 'Social media ready', tone: 'red', href: '/dashboard/lessons', improve: 'Three lessons left before the social media conversation.' },
        ]}
        lessonsLeft={26} lessonsTotal={29}
      />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', margin: '10px 0' }}>
        MIXED: red with no fix to go to, green, and a not yet grey.
      </p>
      <DayCheckup
        childName="Gus" stageNum={2} stageName="Builder"
        strands={[
          { key: 'safe', name: 'Safe online', tone: 'red' },
          { key: 'balance', name: 'Healthy balance', tone: 'green' },
          { key: 'ai', name: 'AI and chatbots', tone: 'grey' },
          { key: 'social', name: 'Social media ready', tone: 'grey' },
        ]}
        lessonsLeft={3} lessonsTotal={6}
      />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', margin: '10px 0' }}>
        ALL GREEN: must render nothing at all below this line.
      </p>
      <DayCheckup
        childName="Gus" stageNum={2} stageName="Builder"
        strands={[
          { key: 'safe', name: 'Safe online', tone: 'green' },
          { key: 'balance', name: 'Healthy balance', tone: 'green' },
        ]}
        lessonsLeft={0} lessonsTotal={6}
      />
    </div>
  )
}
