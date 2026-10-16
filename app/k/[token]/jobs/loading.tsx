// The child's jobs while they load: the back link, the heading and its line,
// the buddy with a speech bubble, then the single column of job rows, in the
// 560 column the real screen uses. See components/skeleton/Skeleton.tsx.

import { Bone, Dot, Lines, SkeletonPage } from '@/components/skeleton/Skeleton'

export default function KidJobsLoading() {
  return (
    <SkeletonPage style={{
      minHeight: '100dvh', background: 'var(--cream)',
      padding: '22px 16px calc(96px + env(safe-area-inset-bottom, 0px))',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Bone tone="kid" h={18} w={70} r={6} mb={16} />
        <Bone tone="kid" h={34} w="60%" r={8} mb={10} />
        <Lines tone="kid" n={2} h={15} mb={18} />

        <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Dot tone="kid" size={48} />
          <Bone tone="kid" h={40} w="62%" r="var(--radius-tile)" mb={0} />
        </div>
        <Bone tone="kid" h={12} w={110} r={4} mb={10} />

        <div aria-hidden style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {Array.from({ length: 5 }, (_, i) => <Bone key={i} tone="kid" h={62} r="var(--radius-btn)" mb={0} />)}
        </div>
      </div>
    </SkeletonPage>
  )
}
