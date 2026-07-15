// Which quests are due today, by schedule. A once quest stays due until
// it has ever been approved. When a quest names specific days (schedule_days,
// a list of weekday numbers 0 Sunday through 6 Saturday), those win, so tidy
// the room Monday Wednesday Friday is due only on those days. Otherwise the
// schedule text decides.

export function questDueToday(schedule: string, scheduleDays?: number[] | null, today = new Date()): boolean {
  if (scheduleDays && scheduleDays.length > 0) return scheduleDays.includes(today.getDay())
  const weekend = today.getDay() === 0 || today.getDay() === 6
  if (schedule === 'weekdays') return !weekend
  if (schedule === 'weekend') return weekend
  return true
}
