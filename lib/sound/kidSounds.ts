// Gentle child-side sounds, generated with Web Audio so there are no asset
// files to load and nothing ever plays on the parent side. Sound stays silent
// until the child taps once (browsers only allow audio after a gesture) and
// can be muted, remembered in localStorage. Warm, soft tones like Duolingo,
// never harsh, and only on the moments that deserve a little lift.

let ctx: AudioContext | null = null
const KEY = 'gc_kid_sound'

export function soundEnabled(): boolean {
  if (typeof window === 'undefined') return true
  try { return localStorage.getItem(KEY) !== 'off' } catch { return true }
}

export function setSoundEnabled(on: boolean): void {
  try { localStorage.setItem(KEY, on ? 'on' : 'off') } catch { /* private mode */ }
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!ctx) ctx = new AC()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch { return null }
}

function tone(c: AudioContext, freq: number, start: number, dur: number, peak = 0.16, type: OscillatorType = 'sine'): void {
  const osc = c.createOscillator()
  const gain = c.createGain()
  const t0 = c.currentTime + start
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.03)
}

export type KidSound = 'tap' | 'star' | 'done'

// Play one of the little sounds, if sound is on and audio is available.
export function playKidSound(name: KidSound): void {
  if (!soundEnabled()) return
  const c = getCtx()
  if (!c) return
  if (name === 'tap') {
    tone(c, 620, 0, 0.08, 0.10, 'triangle')
  } else if (name === 'star') {
    // A happy little rising chime for earning a star.
    tone(c, 784, 0, 0.16, 0.15)      // G5
    tone(c, 1175, 0.085, 0.22, 0.15) // D6
    try { navigator.vibrate?.(20) } catch { /* no haptics */ }
  } else if (name === 'done') {
    // A warm three note arpeggio for finishing something.
    tone(c, 523, 0, 0.16, 0.15)    // C5
    tone(c, 659, 0.1, 0.16, 0.15)  // E5
    tone(c, 784, 0.2, 0.3, 0.17)   // G5
    try { navigator.vibrate?.([20, 40, 30]) } catch { /* no haptics */ }
  }
}
