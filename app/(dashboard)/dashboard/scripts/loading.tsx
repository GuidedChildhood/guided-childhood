// The scripts page while it loads: the heading, the finder, the "when they
// come to you" banner, the recommended card, the category chips and the tile
// grid (two across on a phone, four on a laptop), in that order, at the sizes
// the page draws them. See components/skeleton/Skeleton.tsx.

import { Bone, ChipBones, HeadingBones, SkeletonPage } from '@/components/skeleton/Skeleton'

export default function ScriptsLoading() {
  return (
    <SkeletonPage style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px' }}>
      <HeadingBones lede={1} />
      {/* The finder, then the banner */}
      <Bone h={100} mb={20} />
      <Bone h={76} mb={20} />
      {/* Recommended next */}
      <Bone h={140} mb={20} />
      <ChipBones n={6} h={36} />
      {/* The child's own stage, open */}
      <Bone h={28} w={150} r="var(--radius-pill)" mb={12} />
      <div aria-hidden style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {Array.from({ length: 8 }, (_, i) => <Bone key={i} h={128} mb={0} />)}
      </div>
    </SkeletonPage>
  )
}
