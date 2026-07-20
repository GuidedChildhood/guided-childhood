import { STAR_MINUTES } from './templates'

// Device time: the spend side of the star bank. A child turns earned stars
// into minutes on an agreed device, on their own screen, with the parent
// able to watch the same countdown. Minutes buy in whole star blocks (one
// star is STAR_MINUTES minutes) so the maths is always clean.

export type DeviceKey = 'phone' | 'tablet' | 'tv' | 'console'

export const DEVICES: { key: DeviceKey; label: string; emoji: string }[] = [
  { key: 'phone', label: 'Phone', emoji: '📱' },
  { key: 'tablet', label: 'Tablet', emoji: '📲' },
  { key: 'tv', label: 'TV', emoji: '📺' },
  { key: 'console', label: 'Console', emoji: '🎮' },
]

export function deviceLabel(key: string): string {
  return DEVICES.find(d => d.key === key)?.label ?? 'device'
}
export function deviceEmoji(key: string): string {
  return DEVICES.find(d => d.key === key)?.emoji ?? '📱'
}
export function isDeviceKey(v: unknown): v is DeviceKey {
  return typeof v === 'string' && DEVICES.some(d => d.key === v)
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
