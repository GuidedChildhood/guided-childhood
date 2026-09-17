// Turn whatever the phone hands us into something the model can actually read.
//
// Three problems, one answer.
//
// 1. AN IPHONE PHOTO IS OFTEN HEIC, and the Anthropic API does not accept HEIC.
//    A parent photographing a school letter on an iPhone is the single most
//    likely user of this feature, so "unsupported format" would have been the
//    normal case rather than the edge case. Safari can decode HEIC into a
//    canvas, so drawing it and re-exporting gives us a JPEG for free.
// 2. A MODERN PHONE CAMERA IS TWELVE MEGAPIXELS. Sent whole that is several
//    megabytes of base64 over a school gate 4G connection, for a letter whose
//    text is perfectly legible at a fraction of the size.
// 3. ROTATION. Browsers apply EXIF orientation when drawing to a canvas via
//    createImageBitmap with imageOrientation set, so the letter arrives the way
//    up it was taken rather than sideways.
//
// Runs in the browser. Never imported by a server route.

/** Long edge in pixels. Comfortably enough to read body text on a school
 *  letter, small enough to upload on a bad connection. */
const MAX_EDGE = 1600
const JPEG_QUALITY = 0.85

export type PreparedPhoto = { mediaType: 'image/jpeg'; base64: string }

/**
 * Read a file from a camera or photo library and return downscaled JPEG base64.
 *
 * Throws with a message worth showing a parent if the file cannot be decoded,
 * which on a phone almost always means it was not really an image.
 */
export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    .catch(() => { throw new Error('That file could not be opened as a picture.') })

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('This browser cannot prepare the picture.')
  // White underneath, because a transparent PNG flattened onto nothing comes
  // out black and a black page reads as an empty one.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  const base64 = dataUrl.split(',')[1] ?? ''
  if (!base64) throw new Error('That picture could not be prepared. Try taking it again.')
  return { mediaType: 'image/jpeg', base64 }
}
