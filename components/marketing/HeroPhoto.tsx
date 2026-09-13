'use client'

import { useState } from 'react'
import Image from 'next/image'
import HappyIcon from '@/components/kid/HappyIcon'

// A photo on the landing page that cannot leave a hole.
//
// The live walk of 13 September 2026 loaded / with the photo host blocked
// and found a blank circle in the first fold, the caption text showing
// through behind the chips. The photos are generated on Higgsfield and were
// hotlinked straight from its CDN in a plain img tag: full size on every
// phone, and nothing at all if that host is slow or down.
//
// Two changes. The photo goes through next/image, so Vercel fetches it once,
// resizes it for the screen asking, and serves it from our own edge; the
// host has to be up the first time, not every time. And if it still fails,
// the box draws the star on butter instead of nothing, so the first fold is
// never broken. The copy of the originals into /public is a separate step
// that needs the files (this container cannot reach the host).

export default function HeroPhoto({ src, alt, sizes, priority = false, position = 'center' }: {
  src: string
  alt: string
  /** The width the box takes at each breakpoint, for the srcset. */
  sizes: string
  priority?: boolean
  position?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div aria-label={alt} role="img" style={{
        position: 'absolute', inset: 0, background: 'var(--terracotta-lt)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <HappyIcon name="wins" size={96} />
      </div>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      style={{ objectFit: 'cover', objectPosition: position }}
    />
  )
}
