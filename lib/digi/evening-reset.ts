// The Evening Reset: compose tomorrow's checklist for a family from each
// child's weekly kit timetable, any open school email actions, and the
// standing items that lost Conversation 1's morning (bags, water, lunches,
// clothes). Pure function over data, so the cron and any future UI agree.

export type KitSchedule = Partial<Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', string[]>>

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export interface ResetChild {
  name: string
  kit_schedule: KitSchedule | null
}

export interface ResetAction {
  title: string
  due_date: string | null
}

export function composeEveningReset(
  children: ResetChild[],
  openActions: ResetAction[],
  now: Date
): { title: string; lines: string[] } | null {
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const dayIdx = tomorrow.getDay()
  const dayKey = DAY_KEYS[dayIdx]
  const dayName = DAY_NAMES[dayIdx]
  const isSchoolNight = dayIdx >= 1 && dayIdx <= 5
  const tomorrowIso = tomorrow.toISOString().slice(0, 10)

  const lines: string[] = []

  for (const child of children) {
    const kit = (child.kit_schedule ?? {})[dayKey] ?? []
    for (const item of kit) lines.push(`${child.name}: ${item}`)
  }

  for (const action of openActions) {
    if (!action.due_date || action.due_date <= tomorrowIso) {
      lines.push(action.title)
    }
  }

  if (isSchoolNight) {
    lines.push('Bags emptied and repacked', 'Water bottles filled and in the fridge', 'Lunches booked or packed', 'Clothes out for the morning')
  }

  if (lines.length === 0) return null

  return { title: `Tomorrow is ${dayName}. Five minutes tonight buys a calm morning.`, lines }
}
