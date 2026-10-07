// Every lesson video plays in every school browser.
//
// Justin, 7 October 2026, on the free taster: "the video here, DiGi intro not
// playing ... press play doesn't work."
//
// The generator hands back HEVC Main 10: a 10 bit hvc1 MP4. A browser plays that
// only with a hardware decoder for it, so it worked on the machines it was made
// and checked on and showed a black box with a dead play button on a school
// laptop, in Firefox, and in Chrome on Linux. Every video slide in the scheme
// was that format, both primary pilot lessons among them, and nothing could
// have told us, because the file is a perfectly good video. It is only the
// wrong one for a classroom.
//
// So the clips are converted to H.264 and ship with the schools site
// (schools/public/clips, migration 361), and this holds every video slide in
// the lesson mirrors to three things:
//
//   1. the src is a clip on the schools site, never the generator's CDN;
//   2. that clip is in schools/public/clips, so the address is not a 404;
//   3. the clip is H.264 at a profile every browser decodes (Baseline, Main or
//      High, 8 bit), read from the file's own sample description rather than
//      from its name. High 10 is H.264 too and is exactly as unplayable as
//      HEVC, which is why the profile is read and not just the codec.
//
// Converting a new clip (ffmpeg, same settings as the eleven in 361):
//   -c:v libx264 -preset slow -crf 22 -profile:v high -level:v 4.0
//   -pix_fmt yuv420p -c:a aac -b:a 128k -ar 48000 -movflags +faststart
//
// Node builtins only, so it runs in the guards job with nothing installed.
//
//   node scripts/check-lesson-clips.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['content/modules', 'content/standalone']
const CLIPS = 'schools/public/clips'
const HOME = 'https://schools.guidedchildhood.com/clips/'
// AVCProfileIndication values a browser decodes without special hardware.
const PLAYABLE_PROFILES = new Map([[66, 'Baseline'], [77, 'Main'], [100, 'High']])

// The boxes that contain other boxes on the way down to the sample description.
const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl'])

// Walks the MP4 box tree and returns every video sample entry it finds: its
// four character code and, for H.264, the profile from its avcC box.
function videoEntries(buf, start = 0, end = buf.length, out = []) {
  let at = start
  while (at + 8 <= end) {
    let size = buf.readUInt32BE(at)
    const type = buf.toString('latin1', at + 4, at + 8)
    let header = 8
    if (size === 1) { size = Number(buf.readBigUInt64BE(at + 8)); header = 16 }
    else if (size === 0) size = end - at
    if (size < header || at + size > end) break
    if (CONTAINERS.has(type)) videoEntries(buf, at + header, at + size, out)
    else if (type === 'stsd') {
      // Full box: version and flags, then the entry count, then the entries.
      let e = at + header + 8
      const count = buf.readUInt32BE(at + header + 4)
      for (let i = 0; i < count && e + 8 <= at + size; i++) {
        const eSize = buf.readUInt32BE(e)
        const code = buf.toString('latin1', e + 4, e + 8)
        const entry = { code }
        if (code === 'avc1' || code === 'avc3') {
          // A visual sample entry carries 78 bytes of fields before its own
          // child boxes; avcC is one of those children.
          for (let c = e + 8 + 78; c + 8 <= e + eSize;) {
            const cSize = buf.readUInt32BE(c)
            if (cSize < 8) break
            if (buf.toString('latin1', c + 4, c + 8) === 'avcC') entry.profile = buf[c + 9]
            c += cSize
          }
        }
        out.push(entry)
        if (eSize < 8) break
        e += eSize
      }
    }
    at += size
  }
  return out
}

const fails = []
const used = new Set()
let videos = 0

for (const root of ROOTS) {
  for (const file of readdirSync(root).filter(f => f.endsWith('.json')).sort()) {
    const path = join(root, file)
    const slides = JSON.parse(readFileSync(path, 'utf8')).slides ?? []
    slides.forEach((s, i) => {
      if (s?.type !== 'video') return
      videos += 1
      const where = `${path} slide ${i + 1}`
      const src = String(s.src ?? '')
      if (!src.startsWith(HOME)) {
        fails.push(`${where}: src is not a clip on the schools site (${src || 'empty'}). Convert it to H.264 and put it in ${CLIPS}.`)
        return
      }
      const name = src.slice(HOME.length)
      const disk = join(CLIPS, name)
      used.add(name)
      if (!existsSync(disk)) { fails.push(`${where}: ${disk} does not exist, so the slide would be a 404.`); return }
      const entries = videoEntries(readFileSync(disk))
      const codes = entries.map(e => e.code)
      const avc = entries.find(e => e.code === 'avc1' || e.code === 'avc3')
      if (!avc) { fails.push(`${where}: ${name} is ${codes.join(', ') || 'not a readable MP4'}, not H.264. A school laptop without the decoder shows a dead play button.`); return }
      if (!PLAYABLE_PROFILES.has(avc.profile)) {
        fails.push(`${where}: ${name} is H.264 profile ${avc.profile ?? 'unknown'}, which browsers do not decode in software. Re-encode at High (8 bit).`)
      }
    })
  }
}

const orphans = existsSync(CLIPS) ? readdirSync(CLIPS).filter(f => f.endsWith('.mp4') && !used.has(f)) : []

if (fails.length) {
  console.error(`check-lesson-clips: ${fails.length} video slide(s) would not play in every school browser:`)
  for (const f of fails) console.error('  ' + f)
  process.exit(1)
}
console.log(`check-lesson-clips: all ${videos} video slides play from ${CLIPS}, every clip H.264 at a playable profile.`)
if (orphans.length) console.log(`  (not used by any lesson: ${orphans.join(', ')})`)
