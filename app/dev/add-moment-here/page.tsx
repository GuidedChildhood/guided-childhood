'use client'

import RightNowButton from '@/components/rightnow/RightNowButton'
import AddMomentHere from '@/components/daily/AddMomentHere'
import { notFound } from 'next/navigation'

// Dev only: proves the inline control opens the ONE mounted sheet rather than
// a second copy of it. The layout mounts RightNowButton once in the real app;
// this fixture mounts it once too, then asks it to open by name.
export default function AddMomentHereFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '24px 20px 120px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <p className="eyebrow" style={{ margin: '0 0 10px' }}>The check in ending</p>
        <div style={{ background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '26px 22px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 6px' }}>
            That is today&apos;s check in done
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
            Add any new moments from today and they go on the tracker with the rest, then each check in asks how they
            are going until they reach five stars.
          </p>
          <p style={{ margin: '0 0 18px' }}><AddMomentHere /></p>
        </div>
      </div>
      <RightNowButton variant="fab" />
    </div>
  )
}
