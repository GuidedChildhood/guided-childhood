import { continueRender, delayRender, staticFile } from 'remotion'

// The self hosted brand fonts, the same files the app serves from app/fonts.
// Rendering waits until all three faces are loaded, so no frame is ever drawn
// in a fallback face (which is what makes type look soft or jump).

const FACES: Array<{ family: string; file: string; weight: string }> = [
  { family: 'GC Nunito', file: 'fonts/nunito-latin-wght-normal.woff2', weight: '200 1000' },
  { family: 'GC Plex Mono', file: 'fonts/ibm-plex-mono-latin-500-normal.woff2', weight: '500' },
  { family: 'GC Plex Mono', file: 'fonts/ibm-plex-mono-latin-600-normal.woff2', weight: '600' },
]

let started = false

export function loadBrandFonts() {
  if (started || typeof document === 'undefined') return
  started = true
  const handle = delayRender('Loading the brand fonts')
  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, { weight: f.weight, style: 'normal' })
      await face.load()
      const set = document.fonts as unknown as { add: (f: FontFace) => void }
      set.add(face)
    }),
  )
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch((err) => {
      // A missing font is a failed render, never a quiet fallback.
      throw new Error(`Brand fonts did not load: ${String(err)}`)
    })
}
