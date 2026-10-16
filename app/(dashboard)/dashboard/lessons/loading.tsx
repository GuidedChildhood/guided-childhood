// The lessons page while it loads: the heading, the two way switch and the
// stage chips, then the film cards in the same auto fill grid the browser
// uses (three across on a laptop, one on a phone). Without this it borrowed
// Home's shape and jumped. See components/skeleton/Skeleton.tsx.

import { Bone, ChipBones, HeadingBones, Lines, SkeletonPage } from '@/components/skeleton/Skeleton'

export default function LessonsLoading() {
  return (
    <SkeletonPage style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 48px' }}>
      {/* The back link */}
      <Bone h={20} w={140} r={6} mb={24} />
      <HeadingBones lede={1} />

      {/* Films with them / lessons you lead, then the stage chips */}
      <Bone h={50} r="var(--radius-pill)" mb={10} />
      <ChipBones n={6} mb={20} />
      <Lines n={2} h={17} mb={18} />

      <div aria-hidden style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <Bone h="auto" mb={0} r="var(--radius-card) var(--radius-card) 0 0" style={{ aspectRatio: '16 / 10' }} />
            <Bone h={150} mb={0} r="0 0 var(--radius-card) var(--radius-card)" style={{ opacity: 0.35 }} />
          </div>
        ))}
      </div>
    </SkeletonPage>
  )
}
