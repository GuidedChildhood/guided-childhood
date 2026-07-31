import { STAR_MINUTES } from './templates'

// Device time: the spend side of the star bank. A child turns earned stars
// into minutes on an agreed device, on their own screen, with the parent
// able to watch the same countdown. Minutes buy in whole star blocks (one
// star is STAR_MINUTES minutes) so the maths is always clean.

// The KIND of a device, not its identity. Which iPad, and whose, is
// family_devices' job (lib/devices/family); this is the four (now five) word
// bucket that every session, request and weekly breakdown has always been
// keyed on, so it stays exactly as it was and simply gained computer, the one
// real device a child uses that the four words could not describe.
export type DeviceKind = 'phone' | 'tablet' | 'tv' | 'console' | 'computer'

/** @deprecated The older name for DeviceKind, kept so nothing has to churn. */
export type DeviceKey = DeviceKind

// The device rule in child words, said the same way everywhere a device
// could be used: the Use my time tile, the timer card, and the quiet line
// under the Today list. A child should always know what using any device
// means here.
export const TIMER_RULE = 'Any screen goes through my timer. Do jobs, earn stars, start the timer.'

export const DEVICES: { key: DeviceKey; label: string; emoji: string }[] = [
  { key: 'phone', label: 'Phone', emoji: '📱' },
  { key: 'tablet', label: 'Tablet', emoji: '📲' },
  { key: 'tv', label: 'TV', emoji: '📺' },
  { key: 'console', label: 'Console', emoji: '🎮' },
  { key: 'computer', label: 'Computer', emoji: '💻' },
]

// The same four devices in the child's own picker: TV first because that is
// the most common ask, and the phone in their hands relabelled so the tile
// reads as the thing they are actually holding. Same keys, same engine.
export const KID_DEVICES: { key: DeviceKey; label: string; emoji: string }[] = [
  { key: 'tv', label: 'TV', emoji: '📺' },
  { key: 'phone', label: 'Stay on this phone', emoji: '📱' },
  { key: 'tablet', label: 'Tablet', emoji: '📲' },
  { key: 'console', label: 'Console', emoji: '🎮' },
  { key: 'computer', label: 'Computer', emoji: '💻' },
]

// ── What they are on, not just what they are holding ─────────────────
//
// The whole balance model sorts screen time by activity rather than by object:
// a guide of 27 minutes watching and 24 learning at 4 to 7, and learning is the
// one bucket invited upward instead of capped. That only works if the activity
// can actually be known.
//
// For four of the five devices it can be read off the device itself. A console
// is gaming, a TV is watching, a phone is social. A computer is genuinely all
// four, and the mapper had no answer: it listed chromebook, laptop, desktop and
// pc under learning and never listed `computer`, which is the key the app
// actually stores, so every computer session fell through to watching. A child
// doing homework had it counted against the watching guide while the learning
// bucket they were filling stayed empty and kept nudging them to do more.
//
// Guessing harder was the wrong fix. The child is sitting there and knows the
// answer, so this asks them. One tap, only for the device that needs it.
export type ActivityKey = 'learning' | 'watching' | 'gaming' | 'social'

/** Devices whose bucket cannot be told from the device alone. */
const ASKS_ACTIVITY: DeviceKey[] = ['computer']

export function asksActivity(device: string): boolean {
  return (ASKS_ACTIVITY as string[]).includes(device)
}

// In the child's words, and in the order a computer actually gets used at these
// ages. Homework leads because it is the answer we most want counted correctly:
// it is the only one of the four that earns the child credit in a build bucket
// rather than spending from a keep one.
export const ACTIVITIES: { key: ActivityKey; label: string; emoji: string }[] = [
  { key: 'learning', label: 'Homework or learning', emoji: '📚' },
  { key: 'watching', label: 'Watching something', emoji: '📺' },
  { key: 'gaming', label: 'Playing a game', emoji: '🎮' },
  { key: 'social', label: 'Talking to friends', emoji: '💬' },
]

export function isActivityKey(v: unknown): v is ActivityKey {
  return v === 'learning' || v === 'watching' || v === 'gaming' || v === 'social'
}

export function activityLabel(key: string): string {
  return ACTIVITIES.find(a => a.key === key)?.label ?? 'Screen'
}

export type TrustLevel = 'ask' | 'watch' | 'trusted'

// Unset or unknown trust reads as ask first: the calibrated default for
// everyone, which the parent can loosen in "Who starts the timer?".
export function readTrust(v: unknown): TrustLevel {
  return v === 'watch' || v === 'trusted' ? v : 'ask'
}

export function deviceLabel(key: string): string {
  return DEVICES.find(d => d.key === key)?.label ?? 'device'
}
export function deviceEmoji(key: string): string {
  return DEVICES.find(d => d.key === key)?.emoji ?? '📱'
}
export function isDeviceKey(v: unknown): v is DeviceKey {
  return typeof v === 'string' && DEVICES.some(d => d.key === v)
}

// Is a screen time ask still worth showing the child? A pending or declined ask
// goes stale after twelve hours so yesterday's answer never greets them, but an
// approved ask stays startable for a full day, so a yes given near the twelve
// hour edge never disappears before the child taps Start. One rule, used by the
// child banner (server render and live poll) so both agree.
export function isAskLive(status: string, createdAtIso: string): boolean {
  const ageMs = Date.now() - new Date(createdAtIso).getTime()
  if (Number.isNaN(ageMs) || ageMs < 0) return true
  return status === 'approved' ? ageMs < 24 * 3600000 : ageMs < 12 * 3600000
}

// Minutes cost one star per STAR_MINUTES, rounded up: a part block still
// costs a whole star, so there is never a fractional spend.
export function minutesToStars(minutes: number): number {
  return Math.ceil(Math.max(0, minutes) / STAR_MINUTES)
}
export function starsToMinutes(stars: number): number {
  return Math.max(0, stars) * STAR_MINUTES
}

export type ActiveSession = {
  id: string
  device: DeviceKey
  minutes: number
  stars: number
  endsAt: string
  startedAt: string
  // The parent knowingly granted this block beyond the day's healthy guide.
  // A treat runs its full length untouched by the guide crossing divert.
  treat: boolean
}

type SessionClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

// The child's one live session, if any: the most recent still marked
// active whose end time has not yet passed. A session past its end time is
// finished, whether or not the stop has been recorded, so it never shows
// as a stuck countdown.
export async function getActiveSession(supabase: SessionClient, childId: string): Promise<ActiveSession | null> {
  const { data } = await supabase
    .from('device_sessions')
    .select('id, device, minutes, stars, ends_at, started_at, status, treat')
    .eq('child_id', childId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!data) return null
  if (new Date(data.ends_at as string).getTime() <= Date.now()) return null
  return {
    id: data.id as string,
    device: data.device as DeviceKey,
    minutes: data.minutes as number,
    stars: data.stars as number,
    endsAt: data.ends_at as string,
    startedAt: data.started_at as string,
    treat: Boolean((data as { treat?: boolean }).treat),
  }
}
