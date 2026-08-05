'use client'

import SocialRoadNova from '@/components/pathway/SocialRoadNova'
import type { SocialRoad } from '@/lib/pathway/social-road'

// Layout harness for Nova's road to social media. Four states: nothing walked,
// the parent ahead of the child, the child ahead of the parent, and the whole
// road done. The together button posts for real, so this page is for looking.

const TITLES = [
  'Followers are not friends', 'The footprint test', 'How the machine works',
  'The deal you signed', 'Locking your doors', 'The highlight reel',
  'Bodies and filters', 'Influencers and the sell', 'How people treat each other',
  'Strangers, DMs and grooming', 'Nudes, the law and sextortion', 'The inner life',
]

function road(walked: number, parentAhead: boolean, childAhead: boolean): SocialRoad {
  const legs = TITLES.map((title, i) => ({
    lessonId: `l${i}`,
    title,
    stageNum: 4,
    keyMessage: i === walked ? 'The people who follow you are an audience, not a circle of friends.' : null,
    parentDone: i < walked || (i === walked && parentAhead),
    childDone: i < walked || (i === walked && childAhead),
  }))
  const current = legs.find(l => !(l.parentDone && l.childDone)) ?? null
  return { legs, current, complete: legs.filter(l => l.parentDone && l.childDone).length, total: legs.length, ahead: 6 }
}

export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        <SocialRoadNova road={road(0, false, false)} childId="teo" childName="Teo" onApp />
        <SocialRoadNova road={road(3, true, false)} childId="teo" childName="Teo" onApp />
        <SocialRoadNova road={road(7, false, true)} childId="alma" childName="Alma" onApp={false} />
        <SocialRoadNova road={road(12, false, false)} childId="teo" childName="Teo" onApp />
      </div>
    </main>
  )
}
