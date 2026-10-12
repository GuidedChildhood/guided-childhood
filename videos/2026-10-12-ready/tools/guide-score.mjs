#!/usr/bin/env node
// A guide score for cutting the rough edit of "Ready" to, until the licensed
// track arrives. Not the final music: a synthesised piano, a soft wordless
// "oo" voice and a string pad, shaped to the John Lewis curve in the
// treatment (plans/2026-10-09-ready-advert-treatment.md):
//   0 to 26   solo piano, close and unsure, 70 bpm
//   26 to 52  the voice joins the melody
//   52 to 64  the lift: strings and a low pulse swell
//   64 to 72  near silence, one note at a time
//   72 to 82  the melody returns, full and warm
//   82 to 90  one held chord under the end card
// Deterministic, nothing sampled, licence ours.
//   node tools/guide-score.mjs assets/guide-score.wav
import { writeFileSync } from 'node:fs'

// Section times can be passed as JSON: {"len":97,"voice":29,"lift":52,"hush":69,"ret":76.8,"hold":84}
const T = Object.assign({ len: 90, voice: 26, lift: 52, hush: 64, ret: 72, hold: 82 }, process.argv[3] ? JSON.parse(process.argv[3]) : {})
const SR = 44100, LEN = T.len, N = SR * LEN
const L = new Float32Array(N), R = new Float32Array(N)
const BPM = 70, BEAT = 60 / BPM, BAR = BEAT * 4
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12)

function add(t, dur, fn, gain, pan = 0) {
  const s0 = Math.floor(t * SR), n = Math.floor(dur * SR)
  for (let i = 0; i < n; i++) {
    const k = s0 + i; if (k < 0 || k >= N) continue
    const v = fn(i / SR) * gain
    L[k] += v * (1 - Math.max(0, pan)); R[k] += v * (1 + Math.min(0, pan))
  }
}
// piano: a few decaying partials, slightly inharmonic, soft attack
function piano(m, t, vel = 0.5, len = 3.2, pan = 0) {
  const f = hz(m)
  add(t, len, (x) => {
    const a = Math.min(1, x / 0.006)
    let s = 0
    const parts = [[1, 1, 1.6], [2.002, 0.45, 2.4], [3.006, 0.18, 3.6], [4.01, 0.08, 5]]
    for (const [mul, amp, dec] of parts) s += amp * Math.sin(2 * Math.PI * f * mul * x) * Math.exp(-x * dec)
    return a * s * (1 - Math.min(1, Math.max(0, (x - (len - 0.4)) / 0.4)))
  }, vel * 0.22, pan)
}
// wordless "oo": sine with vibrato and a soft formant partial
function voice(m, t, dur, gain = 0.5) {
  const f = hz(m)
  let ph = 0
  add(t, dur, (x) => {
    const env = Math.min(1, x / 0.35) * Math.min(1, (dur - x) / 0.5)
    const vib = 1 + 0.006 * Math.sin(2 * Math.PI * 5.2 * x) * Math.min(1, x / 0.6)
    ph += 2 * Math.PI * f * vib / SR
    return env * (Math.sin(ph) + 0.25 * Math.sin(2 * ph) + 0.08 * Math.sin(3 * ph))
  }, gain * 0.12)
}
// strings: detuned soft saws through a one pole low pass
function strings(notes, t, dur, gain) {
  for (const m of notes) for (const det of [-0.12, 0.1]) {
    const f = hz(m) * Math.pow(2, det / 12)
    let lp = 0, ph = Math.random()
    add(t, dur, (x) => {
      const env = Math.min(1, x / 1.8) * Math.min(1, (dur - x) / 1.6)
      ph = (ph + f / SR) % 1
      const saw = 2 * ph - 1
      lp += 0.035 * (saw - lp)
      return env * lp
    }, gain * 0.05, det < 0 ? -0.4 : 0.4)
  }
}
function pulse(t, gain = 0.5) {
  add(t, 0.6, (x) => Math.sin(2 * Math.PI * (52 * Math.exp(-x * 6) + 38) * x) * Math.exp(-x * 7), gain * 0.35)
}

// C major, I V vi IV with a turn to ii V for the lift
const prog = [[48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60]]
const lift = [[50, 57, 62, 65], [43, 55, 59, 62]]
const melody = [76, 74, 72, 74, 76, 79, 76, 74, 72, 72, 74, 76, 74, 72, 71, 72]
let bar = 0
const at = (b) => b * BAR

// 0 to 26: solo piano arpeggios, melody enters at bar 3
for (; at(bar) < T.voice; bar++) {
  const c = prog[bar % 4]
  c.forEach((m, i) => piano(m, at(bar) + i * BEAT * 0.5, 0.42, 3, -0.2 + i * 0.12))
  piano(c[1] + 12, at(bar) + BEAT * 2.5, 0.3, 2.5, 0.2)
  if (bar >= 2) melody.slice((bar * 4) % 16, (bar * 4) % 16 + 4).forEach((m, i) => piano(m, at(bar) + i * BEAT, 0.5, 2.2, 0.15))
}
// 26 to 52: the voice doubles the melody
for (; at(bar) < T.lift; bar++) {
  const c = prog[bar % 4]
  c.forEach((m, i) => piano(m, at(bar) + i * BEAT * 0.5, 0.45, 3, -0.2 + i * 0.12))
  const ms = melody.slice((bar * 4) % 16, (bar * 4) % 16 + 4)
  ms.forEach((m, i) => { piano(m, at(bar) + i * BEAT, 0.52, 2.2, 0.15); voice(m - 12, at(bar) + i * BEAT, BEAT * 1.05, 0.9) })
}
// 52 to 64: the lift
const liftStart = at(bar)
for (; at(bar) < T.hush; bar++) {
  const c = bar % 2 === 0 ? lift[0] : lift[1]
  c.forEach((m, i) => piano(m, at(bar) + i * BEAT * 0.5, 0.55, 3, -0.2 + i * 0.12))
  strings(c.map((m) => m + 12), at(bar), BAR + 0.4, 0.9 + (at(bar) - liftStart) / (T.hush - T.lift))
  for (let b = 0; b < 4; b++) pulse(at(bar) + b * BEAT, 0.5 + (at(bar) - liftStart) / (T.hush - T.lift) * 0.6)
  melody.slice(4, 8).forEach((m, i) => { piano(m + 2, at(bar) + i * BEAT, 0.62, 2.2, 0.1); voice(m - 10, at(bar) + i * BEAT, BEAT * 1.05, 1.1) })
}
// 64 to 72: near silence, one note at a time
{ const g = (T.ret - T.hush) / 4; [72, 76, 74, 79].forEach((m, i) => piano(m, T.hush + 0.4 + i * g, 0.4, 3.2, 0.1)) }
// 72 to 82: the melody returns, full and warm
for (let t = T.ret, k = 0; t < T.hold; t += BAR, k++) {
  const c = prog[k % 4]
  c.forEach((m, i) => piano(m, t + i * BEAT * 0.5, 0.5, 3, -0.2 + i * 0.12))
  strings(c.map((m) => m + 12), t, BAR + 0.4, 1.2)
  melody.slice(0, 4).forEach((m, i) => { piano(m, t + i * BEAT, 0.58, 2.2, 0.15); voice(m - 12, t + i * BEAT, BEAT * 1.05, 1.1) })
}
// 82 to 90: one held chord
for (const m of [48, 55, 60, 64, 67]) piano(m, T.hold, 0.45, LEN - T.hold - 0.3, 0)
strings([60, 64, 67, 72], T.hold, LEN - T.hold - 0.2, 1.0)

// soft room: two short delays, then normalise to -1 dBFS
const d1 = Math.floor(0.031 * SR), d2 = Math.floor(0.047 * SR)
for (let i = N - 1; i >= d2; i--) { L[i] += 0.22 * R[i - d1] + 0.12 * L[i - d2]; R[i] += 0.22 * L[i - d2] + 0.12 * R[i - d1] }
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
const g = 0.89 / peak
const buf = Buffer.alloc(44 + N * 4)
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12)
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24)
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40)
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4)
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4)
}
writeFileSync(process.argv[2] || 'guide-score.wav', buf)
console.log('wrote', process.argv[2], 'peak gain', g.toFixed(2))
