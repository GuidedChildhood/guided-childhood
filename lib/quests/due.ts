// Which quests are due today, by schedule. A once quest stays due until
// it has ever been approved.

export function questDueToday(schedule: string, today = new Date()): boolean {
  const weekend = today.getDay() === 0 || today.getDay() === 6
  if (schedule === 'weekdays') return !weekend
  if (schedule === 'weekend') return weekend
  return true
}
