import DayCheckup from '@/components/home/DayCheckup'

export const dynamic = 'force-dynamic'

export default function RefCheckup() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 20 }}>
      <DayCheckup
        childName="Gus" stageNum={2} stageName="Builder"
        strands={[
          { key: 'safe', name: 'Safe online', tone: 'red', href: '/dashboard/lessons' },
          { key: 'balance', name: 'Healthy balance', tone: 'red', href: '/dashboard/quests' },
          { key: 'ai', name: 'AI and chatbots', tone: 'grey' },
          { key: 'social', name: 'Social media ready', tone: 'grey' },
        ]}
        lessonsLeft={3} lessonsTotal={6}
      />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>ABOVE: something to do. BELOW: all green, must render nothing.</p>
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
