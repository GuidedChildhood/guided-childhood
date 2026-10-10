#!/usr/bin/env node
// Where the speech sits in every voice file: ffmpeg silencedetect finds the
// first and last sound, so the build can trim the lead in (data-media-start)
// and time each part from the words, not from the file length.
// Writes assets/audio/timing.json: { "en/listen": { lead, speech, file } }.
import { execFileSync } from 'node:child_process'
import { readdirSync, writeFileSync } from 'node:fs'
const root = new URL('../', import.meta.url).pathname
const out = {}
for (const dir of ['en', 'es', 'fr']) {
  for (const f of readdirSync(root + 'assets/audio/' + dir).filter((x) => x.endsWith('.mp3')).sort()) {
    const path = `assets/audio/${dir}/${f}`
    const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', root + path]).toString())
    let err = ''
    try { err = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i "${root + path}" -af silencedetect=noise=-40dB:d=0.08 -f null - 2>&1`]).toString() } catch (e) { err = String(e.stdout) }
    const starts = [...err.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1])
    const ends = [...err.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1])
    let lead = 0, tail = dur
    if (starts.length && starts[0] < 0.01 && ends.length) lead = ends[0]
    const lastStart = starts[starts.length - 1]
    if (lastStart != null && lastStart > lead && (ends.length < starts.length || ends[ends.length - 1] >= dur - 0.02)) tail = lastStart
    lead = Math.max(0, lead - 0.03)
    const speech = Math.min(dur - lead, tail - lead + 0.08)
    // Sounding stretches inside the speech, relative to the trimmed start, so
    // a two phrase line (¡Hola! ¡Buenos días!) can light each phrase on time.
    const segs = []
    let s0 = lead + 0.03
    starts.forEach((st, i) => { if (st > s0 + 0.02 && st < tail) { segs.push([s0 - lead, st - lead]); s0 = ends[i] ?? tail } })
    if (s0 < tail) segs.push([s0 - lead, tail - lead])
    out[`${dir}/${f.replace('.mp3', '')}`] = { file: path, dur: +dur.toFixed(3), lead: +lead.toFixed(3), speech: +speech.toFixed(3), segs: segs.map(([a, b]) => [+a.toFixed(3), +b.toFixed(3)]) }
  }
}
writeFileSync(root + 'assets/audio/timing.json', JSON.stringify(out, null, 1))
for (const [k, v] of Object.entries(out)) console.log(k.padEnd(22), v.dur.toFixed(2), 'lead', v.lead.toFixed(2), 'speech', v.speech.toFixed(2))
