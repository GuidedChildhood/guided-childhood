import { ImageResponse } from 'next/og'
import fs from 'node:fs/promises'
import path from 'node:path'

// The Home Screen icon for a child's quest page: DiGi the star on the
// deep teal of their screen, so the icon on their phone is a character
// they like, never a corporate logo. Served by Next's icon convention,
// so Add to Home Screen picks it up automatically.

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const svg = await fs.readFile(path.join(process.cwd(), 'public', 'digi-squad', 'DiGi-star.svg'))
  const src = `data:image/svg+xml;base64,${svg.toString('base64')}`
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#173C46',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={136} height={136} alt="" />
      </div>
    ),
    size
  )
}
