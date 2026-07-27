// The parent balance report: the data behind the balance graph. Pure functions
// only, no data access, so any surface (the passport, the tracker, a report
// page) can fetch its rows however it likes and hand them here to get the
// shape the BalanceReport component draws.
//
// Screen time is grouped by what the device is for, not the brand, because the
// health guidance keys on the activity: passive watching, interactive gaming,
// social and phone use, and creating or learning all sit differently. Each
// device maps to one of four buckets, inferred from its name for now, with room
// for a parent set override later.

import { recommendedDailyMinutes, bandLabelFor, screenStatusForAge, statusForGuide, bucketDailyGuide, type ScreenStatus } from '@/lib/quests/screen-balance'

export type Bucket = 'gaming' | 'watching' | 'social' | 'learning'

export const BUCKET_META: Record<Bucket, { label: string; emoji: string; tone: string }> = {
  gaming: { label: 'Gaming', emoji: '🎮', tone: '#7CB342' },
  watching: { label: 'Watching', emoji: '📺', tone: '#4C9FD6' },
  social: { label: 'Social and phone', emoji: '📱', tone: '#9B72CF' },
  learning: { label: 'Creating and learning', emoji: '✏️', tone: '#E6B93E' },
}

// Order the buckets read in, most health sensitive first so a parent's eye
// lands on social before the gentler learning time.
export const BUCKET_ORDER: Bucket[] = ['social', 'gaming', 'watching', 'learning']

// Infer the bucket from a device name. Deliberately forgiving, and defaults to
// watching (the most common recreational default) when nothing matches.
export function bucketForDevice(device: string): Bucket {
  const d = (device || '').toLowerCase()
  if (/(switch|xbox|playstation|\bps[45]\b|nintendo|console|steam|gaming)/.test(d)) return 'gaming'
  if (/(phone|iphone|android|mobile|social|tiktok|snap|insta|whatsapp|messages)/.test(d)) return 'social'
  if (/(chromebook|laptop|homework|kindle|learn|school|pc\b|desktop)/.test(d)) return 'learning'
  if (/(tv|telly|television|fire ?stick|firetv|roku|youtube|netflix|tablet|ipad)/.test(d)) return 'watching'
  return 'watching'
}

export type DeviceUsage = { device: string; minutes: number; bucket: Bucket }
export type BucketSummary = { bucket: Bucket; label: string; emoji: string; tone: string; minutes: number; devices: DeviceUsage[] }

// The healthy amount for one device type at this age, with what was actually
// used this week set against it, so the report can show each type as under, on
// track or over on its own line, not just the week as a whole.
export type TypeGuide = {
  bucket: Bucket
  label: string
  emoji: string
  recommendedDailyMins: number
  recommendedWeekMins: number
  actualWeekMins: number
  status: ScreenStatus
}

export type ParentReport = {
  childName: string
  bandLabel: string
  totalWeekMins: number
  healthyWeekMins: number
  status: ScreenStatus
  buckets: BucketSummary[]
  // The recommended amount per device type for this age, all four always
  // present so a parent sees the full picture even for a type not used yet.
  typeGuides: TypeGuide[]
  offscreen: { activities: number; stars: number; minutes: number }
  guidance: string
}

export type ParentReportInput = {
  childName?: string | null
  ageBand: string | null
  // Optional parent set daily limit; falls back to the science based age guide.
  dailyLimitMins?: number | null
  // This week's screen minutes per device (any labels; bucketed here).
  deviceMinutes: { device: string; minutes: number }[]
  // What the child did away from a screen this week.
  offscreen?: { activities?: number; stars?: number; minutes?: number }
}

function guidanceFor(status: ScreenStatus, busiest: BucketSummary | null, name: string): string {
  const who = name && name !== 'Your child' ? name : 'they'
  if (status === 'under') return `A light screen week for ${who}. Balance is looking healthy.`
  if (status === 'healthy') return `A nicely balanced week. Screen time is inside the healthy level for this age.`
  const b = busiest ? busiest.label.toLowerCase() : 'screen time'
  if (status === 'over') return `Screen time is a little over the healthy level, with ${b} the busiest. One screen free evening brings the week back into the green.`
  return `Screen time is well over the healthy level this week, mostly ${b}. A calmer plan for a few days will help ${who} find the balance again.`
}

export function buildParentReport(input: ParentReportInput): ParentReport {
  const dailyGuide = input.dailyLimitMins && input.dailyLimitMins > 0
    ? input.dailyLimitMins
    : recommendedDailyMinutes(input.ageBand)
  const healthyWeekMins = dailyGuide * 7

  // Bucket the devices.
  const byBucket = new Map<Bucket, BucketSummary>()
  let total = 0
  for (const row of input.deviceMinutes) {
    const mins = Math.max(0, Math.round(row.minutes || 0))
    if (mins <= 0) continue
    total += mins
    const bucket = bucketForDevice(row.device)
    const meta = BUCKET_META[bucket]
    const existing = byBucket.get(bucket) ?? { bucket, label: meta.label, emoji: meta.emoji, tone: meta.tone, minutes: 0, devices: [] }
    existing.minutes += mins
    existing.devices.push({ device: row.device, minutes: mins, bucket })
    byBucket.set(bucket, existing)
  }

  const buckets = BUCKET_ORDER
    .map(b => byBucket.get(b))
    .filter((b): b is BucketSummary => !!b)
    .map(b => ({ ...b, devices: [...b.devices].sort((a, z) => z.minutes - a.minutes) }))

  const status = screenStatusForAge(input.ageBand, Math.round(total / 7))
  const busiest = buckets.reduce<BucketSummary | null>((top, b) => (!top || b.minutes > top.minutes ? b : top), null)
  const name = input.childName ?? 'Your child'

  // The per type healthy amounts for this age, every type shown so a parent
  // reads the full picture. Actual weekly minutes come from the bucketed total,
  // and the status compares the daily average of each type to its own guide.
  const typeDaily = bucketDailyGuide(input.ageBand)
  const typeGuides = BUCKET_ORDER.map(b => {
    const meta = BUCKET_META[b]
    const actualWeekMins = byBucket.get(b)?.minutes ?? 0
    const recommendedDailyMins = typeDaily[b]
    return {
      bucket: b,
      label: meta.label,
      emoji: meta.emoji,
      recommendedDailyMins,
      recommendedWeekMins: recommendedDailyMins * 7,
      actualWeekMins,
      status: statusForGuide(recommendedDailyMins, Math.round(actualWeekMins / 7)),
    }
  })

  return {
    childName: name,
    bandLabel: bandLabelFor(input.ageBand),
    totalWeekMins: total,
    healthyWeekMins,
    status,
    buckets,
    typeGuides,
    offscreen: {
      activities: Math.max(0, Math.round(input.offscreen?.activities ?? 0)),
      stars: Math.max(0, Math.round(input.offscreen?.stars ?? 0)),
      minutes: Math.max(0, Math.round(input.offscreen?.minutes ?? 0)),
    },
    guidance: guidanceFor(status, busiest, name),
  }
}

// Minutes to a short human label, e.g. 135 => "2h 15m", 40 => "40m".
export function fmtMins(mins: number): string {
  const m = Math.max(0, Math.round(mins))
  const h = Math.floor(m / 60)
  const r = m % 60
  if (h <= 0) return `${r}m`
  if (r === 0) return `${h}h`
  return `${h}h ${r}m`
}
