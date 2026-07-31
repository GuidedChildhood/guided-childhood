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

import { recommendedDailyMinutes, bandLabelFor, screenStatusForAge, bucketDailyGuide, bucketBalanceStatus, BUCKET_KIND, type ScreenStatus, type BucketKind, type BucketStatus } from '@/lib/quests/screen-balance'

export type Bucket = 'gaming' | 'watching' | 'social' | 'learning'

export const BUCKET_META: Record<Bucket, { label: string; emoji: string; tone: string }> = {
  gaming: { label: 'Gaming', emoji: '🎮', tone: '#7CB342' },
  watching: { label: 'Watching', emoji: '📺', tone: '#4C9FD6' },
  social: { label: 'Social and phone', emoji: '📱', tone: '#C4574D' },
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
  kind: BucketKind
  recommendedDailyMins: number
  recommendedWeekMins: number
  actualWeekMins: number
  status: BucketStatus
}

// The one glanceable state for the whole child, so a parent reads the level in
// a second before any bars. Priority order, most worth their eye first: a young
// child on the phone, then over the healthy guide, then a calm week with room
// to make more, then in balance, then a quiet week.
export type TopState = {
  key: 'phone' | 'over' | 'grow' | 'balanced' | 'quiet'
  label: string
  tone: 'flag' | 'watch' | 'grow' | 'good' | 'quiet'
  sub: string
}

export type ParentReport = {
  childName: string
  bandLabel: string
  totalWeekMins: number
  healthyWeekMins: number
  status: ScreenStatus
  // The single family wall state for the child, read before any detail.
  topState: TopState
  buckets: BucketSummary[]
  // The recommended amount per device type for this age, all four always
  // present so a parent sees the full picture even for a type not used yet.
  typeGuides: TypeGuide[]
  offscreen: { activities: number; stars: number; minutes: number }
  guidance: string
  /** Days of the star week gone, including today. Divide ACTUAL usage by this,
   *  never by 7: the week now starts on Monday rather than rolling back seven
   *  days, so on a Tuesday a flat /7 reports a child at a fifth of the screen
   *  time they have really been having. The GUIDE stays /7, because a weekly
   *  guide is seven days' worth whatever day it is read on. */
  daysSoFar: number
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
  /** Days of the star week gone, including today. Defaults to a full 7 so a
   *  caller reporting a finished week needs to say nothing. */
  daysSoFar?: number
}

function guidanceFor(status: ScreenStatus, busiest: BucketSummary | null, name: string): string {
  const who = name && name !== 'Your child' ? name : 'they'
  if (status === 'under') return `A light screen week for ${who}. Balance is looking healthy.`
  if (status === 'healthy') return `A nicely balanced week. Screen time is inside the healthy level for this age.`
  const b = busiest ? busiest.label.toLowerCase() : 'screen time'
  if (status === 'over') return `Screen time is a little over the healthy level, with ${b} the busiest. One screen free evening brings the week back into the green.`
  return `Screen time is well over the healthy level this week, mostly ${b}. A calmer plan for a few days will help ${who} find the balance again.`
}

// The one glanceable line for the child. Order matters: a young child on the
// phone is the thing a parent should see first, ahead of a merely busy week.
function deriveTopState(o: {
  name: string
  bandLabel: string
  weekStatus: ScreenStatus
  typeGuides: TypeGuide[]
  totalWeekMins: number
  offscreenActivities: number
  busiest: BucketSummary | null
}): TopState {
  const who = o.name && o.name !== 'Your child' ? o.name : 'Your child'
  const social = o.typeGuides.find(t => t.bucket === 'social')
  const phoneCreeping = !!social && social.recommendedDailyMins <= 0 && social.actualWeekMins > 0
  const anyKeeperFlag = o.typeGuides.some(t => t.kind === 'keep' && t.status === 'flag')
  const weekOver = o.weekStatus === 'over' || o.weekStatus === 'well_over'
  const lowBuilder = o.typeGuides.find(t => t.kind === 'build' && t.status === 'grow')

  if (o.totalWeekMins === 0 && o.offscreenActivities === 0) {
    return { key: 'quiet', tone: 'quiet', label: 'A quiet week', sub: `Nothing recorded yet this week for ${who}. The balance builds itself again as the quests and screen check ins start flowing.` }
  }
  if (phoneCreeping) {
    return {
      key: 'phone', tone: 'flag',
      label: 'Phone is creeping in for their age',
      sub: `${who} had ${fmtMins(social!.actualWeekMins)} on phone and social this week. At ${o.bandLabel} we keep this near zero, so a quick swap to something hands on is worth it.`,
    }
  }
  if (anyKeeperFlag || weekOver) {
    const b = o.busiest ? o.busiest.label.toLowerCase() : 'screen time'
    return { key: 'over', tone: 'watch', label: 'Worth a look this week', sub: `Screen time ran ahead of the healthy guide, mostly ${b}. One swap for a real world thing brings the week back into balance.` }
  }
  if (lowBuilder) {
    return { key: 'grow', tone: 'grow', label: 'In balance, room to make more', sub: `Screen time is healthy for ${o.bandLabel}. ${who} did little making or learning this week, so that is the easy thing to grow.` }
  }
  return { key: 'balanced', tone: 'good', label: 'In balance', sub: `A nicely balanced week for ${who}, screen time inside the healthy level for their age with real world time around it.` }
}

export function buildParentReport(input: ParentReportInput): ParentReport {
  const dailyGuide = input.dailyLimitMins && input.dailyLimitMins > 0
    ? input.dailyLimitMins
    : recommendedDailyMinutes(input.ageBand)
  const healthyWeekMins = dailyGuide * 7
  const daysSoFar = Math.min(7, Math.max(1, Math.round(input.daysSoFar ?? 7)))

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

  const status = screenStatusForAge(input.ageBand, Math.round(total / daysSoFar))
  const busiest = buckets.reduce<BucketSummary | null>((top, b) => (!top || b.minutes > top.minutes ? b : top), null)
  const name = input.childName ?? 'Your child'

  // The per type healthy amounts for this age, every type shown so a parent
  // reads the full picture. Actual weekly minutes come from the bucketed total,
  // and the status compares the daily average of each type to its own guide.
  const typeDaily = bucketDailyGuide(input.ageBand)
  const typeGuides: TypeGuide[] = BUCKET_ORDER.map(b => {
    const meta = BUCKET_META[b]
    const actualWeekMins = byBucket.get(b)?.minutes ?? 0
    const recommendedDailyMins = typeDaily[b]
    const kind = BUCKET_KIND[b]
    return {
      bucket: b,
      label: meta.label,
      emoji: meta.emoji,
      kind,
      recommendedDailyMins,
      recommendedWeekMins: recommendedDailyMins * 7,
      actualWeekMins,
      status: bucketBalanceStatus(kind, recommendedDailyMins, Math.round(actualWeekMins / daysSoFar)),
    }
  })

  const topState = deriveTopState({
    name,
    bandLabel: bandLabelFor(input.ageBand),
    weekStatus: status,
    typeGuides,
    totalWeekMins: total,
    offscreenActivities: Math.max(0, Math.round(input.offscreen?.activities ?? 0)),
    busiest,
  })

  return {
    childName: name,
    bandLabel: bandLabelFor(input.ageBand),
    totalWeekMins: total,
    healthyWeekMins,
    status,
    topState,
    buckets,
    typeGuides,
    offscreen: {
      activities: Math.max(0, Math.round(input.offscreen?.activities ?? 0)),
      stars: Math.max(0, Math.round(input.offscreen?.stars ?? 0)),
      minutes: Math.max(0, Math.round(input.offscreen?.minutes ?? 0)),
    },
    daysSoFar,
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
