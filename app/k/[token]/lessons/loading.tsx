// The child's lessons while they load: the back row, the friend and the
// heading beside it, a line, then the single column of lesson rows and the
// stage check card, in the 560 column the real screen uses. Cream, because the
// child's own colour is not known until the data is. See
// components/skeleton/Skeleton.tsx.

import { Bone, Dot, Lines, SkeletonPage } from '@/components/skeleton/Skeleton'

export default function KidLessonsLoading() {
  return (
    <SkeletonPage style={{
      minHeight: '100dvh', background: 'var(--cream)',
      padding: '22px 16px calc(96px + env(safe-area-inset-bottom, 0px))',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div aria-hidden style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <Bone tone="kid" h={26} w={80} r={8} mb={0} />
          <Bone tone="kid" h={26} w={64} r="var(--radius-pill)" mb={0} />
        </div>
        <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Dot tone="kid" size={56} />
          <div style={{ flex: 1 }}>
            <Bone tone="kid" h={30} w="70%" r={8} mb={8} />
            <Bone tone="kid" h={12} w={110} r={4} mb={0} />
          </div>
        </div>
        <Lines tone="kid" n={2} h={15} mb={20} />
        <div aria-hidden style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
          {Array.from({ length: 5 }, (_, i) => <Bone key={i} tone="kid" h={88} mb={0} />)}
        </div>
        <Bone tone="kid" h={80} />
      </div>
    </SkeletonPage>
  )
}
