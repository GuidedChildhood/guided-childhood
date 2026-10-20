// DiGi while it loads. The chat is a full screen with no page scroll: the
// shell turns into a 100dvh column whenever it holds a .digi-chat, so this
// wears the same class and the composer bones sit on the same floor the real
// composer does. Header, the hero, two "try asking" buttons, then the composer
// pinned at the bottom. See components/skeleton/Skeleton.tsx.

import { Bone, Dot, SkeletonPage } from '@/components/skeleton/Skeleton'

export default function DigiLoading() {
  return (
    <SkeletonPage
      className="digi-chat"
      style={{
        display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0,
        width: '100%', maxWidth: '700px', margin: '0 auto', background: 'var(--white)',
      }}
    >
      {/* The header bar */}
      <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', borderBottom: '1px solid var(--border)' }}>
        <Dot size={36} />
        <div style={{ flex: 1 }}>
          <Bone h={10} w={90} r={4} mb={6} />
          <Bone h={16} w={56} r={6} mb={0} />
        </div>
      </div>

      {/* The messages area: the hero, then the two suggestions */}
      <div aria-hidden style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '20px 20px 0' }}>
        <Bone h={130} mb={18} />
        <Bone h={12} w={90} r={4} mb={10} />
        <Bone h={62} r="var(--radius-btn)" mb={8} />
        <Bone h={62} r="var(--radius-btn)" mb={0} />
      </div>

      {/* The composer */}
      <div aria-hidden style={{ padding: '10px 20px 14px', borderTop: '1px solid var(--border)' }}>
        <Bone h={56} r={26} mb={8} />
        <Bone h={10} w={180} r={4} mb={0} style={{ margin: '0 auto' }} />
      </div>
    </SkeletonPage>
  )
}
