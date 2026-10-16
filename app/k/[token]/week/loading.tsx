// The child's week while it loads: the back pill, the masthead, the week
// header with its two arrows, the strip of seven day discs, the day card and
// the add button, in the 560 column the real screen uses. See
// components/skeleton/Skeleton.tsx.

import { Bone, SkeletonPage } from '@/components/skeleton/Skeleton'

export default function KidWeekLoading() {
  return (
    <SkeletonPage style={{
      minHeight: '100dvh', background: 'var(--cream)',
      padding: 'calc(18px + env(safe-area-inset-top, 0px)) 16px 50px',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Bone tone="kid" h={38} w={92} r="var(--radius-pill)" />
        <Bone tone="kid" h={170} mb={16} />

        {/* The week header: title and line on the left, the arrows on the right */}
        <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <Bone tone="kid" h={24} w="55%" r={8} mb={6} />
            <Bone tone="kid" h={11} w={120} r={4} mb={0} />
          </div>
          <Bone tone="kid" h={44} w={44} r="var(--radius-tile)" mb={0} />
          <Bone tone="kid" h={44} w={44} r="var(--radius-tile)" mb={0} />
        </div>

        {/* Seven columns sharing the row, each disc up to 44 across, so a
            narrow phone shrinks them rather than pushing the last off screen. */}
        <div aria-hidden style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
              <Bone tone="kid" h="auto" w="100%" r="50%" mb={0} style={{ maxWidth: 44, aspectRatio: '1' }} />
            </div>
          ))}
        </div>

        <Bone tone="kid" h={220} mb={12} />
        <Bone tone="kid" h={54} r="var(--radius-btn)" />
      </div>
    </SkeletonPage>
  )
}
