#!/usr/bin/env node
// Prepare the Bloop clips from assets/clips/raw (the Seedance files as made):
//  - remove the native Seedance audio (the ElevenLabs line replaces it);
//  - blur out the small generated text tags some clips carry in a corner;
//  - a keyframe every second, so HyperFrames can seek them without stalling;
//  - find where Bloop's mouth is talking, from the clip's own audio: the
//    loudest 0.3 s run, walked back while it stays within 10 dB of that peak.
// Writes assets/clips/<name>.mp4 and assets/clips/clips.json { name: { file, dur, speechAt } }.
import { execFileSync, execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const root = new URL('../', import.meta.url).pathname
const CLIPS = {
  'hello-es': { spoken: true, delogo: 'x=16:y=659:w=82:h=42' },
  'hello-fr': { spoken: true },
  'bye-es': { spoken: true, delogo: 'x=2:y=706:w=92:h=13' },
  'bye-fr': { spoken: true },
  listening: { delogo: 'x=18:y=674:w=74:h=32' },
  celebrate: {},
}
const out = {}
for (const [name, c] of Object.entries(CLIPS)) {
  const raw = `${root}assets/clips/raw/${name}.mp4`, dst = `assets/clips/${name}.mp4`
  const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', raw]).toString())
  let speechAt = null
  if (c.spoken) {
    const sr = parseInt(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=sample_rate', '-of', 'csv=p=0', raw]).toString())
    const rms = execSync(`ffmpeg -v error -i "${raw}" -vn -af "asetnsamples=${sr / 10},astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-" -f null - 2>/dev/null | grep RMS`).toString()
      .trim().split('\n').map((l) => parseFloat(l.split('=')[1]))
    const step = 0.1
    let best = 0, bestV = -999
    for (let i = 3; i < rms.length - 2; i++) { const v = (rms[i] + rms[i + 1] + rms[i + 2]) / 3; if (v > bestV) { bestV = v; best = i } }
    let i = best
    // walk back through the word, over a one window dip between syllables
    while (i > 3 && (rms[i - 1] > bestV - 10 || (rms[i - 2] > bestV - 10 && i > 4))) i--
    speechAt = +(i * step).toFixed(2)
  }
  const vf = [c.delogo ? `delogo=${c.delogo}` : null, 'format=yuv420p'].filter(Boolean).join(',')
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-an', '-vf', vf, '-c:v', 'libx264', '-r', '30', '-g', '30', '-keyint_min', '30', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', root + dst])
  out[name] = { file: dst, dur: +dur.toFixed(3), speechAt }
  console.log(name.padEnd(10), dur.toFixed(2) + 's', speechAt != null ? `speech at ${speechAt}s` : 'silent')
}
writeFileSync(root + 'assets/clips/clips.json', JSON.stringify(out, null, 1))
