// The jobs page while it loads: the back link, the status board (132 tall,
// the same as the spacer the board itself holds before its data lands, so the
// swap does not move it), the shortcut tiles two across, and the "spot
// something good" card. See components/skeleton/Skeleton.tsx.

import { Bone, SkeletonPage } from '@/components/skeleton/Skeleton'

export default function QuestsLoading() {
  return (
    <SkeletonPage style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <Bone h={20} w={140} r={6} mb={24} />
      <Bone h={132} mb={18} />
      <div aria-hidden style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        {Array.from({ length: 6 }, (_, i) => <Bone key={i} h={84} mb={0} r="var(--radius-tile)" />)}
      </div>
      <Bone h={92} />
    </SkeletonPage>
  )
}
