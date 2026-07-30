// Which quests are due today, by schedule. A once quest stays due until
// it has ever been approved. When a quest names specific days (schedule_days,
// a list of weekday numbers 0 Sunday through 6 Saturday), those win, so tidy
// the room Monday Wednesday Friday is due only on those days. Otherwise the
// schedule text decides.

export function questDueToday(schedule: string, scheduleDays?: number[] | null, today = new Date()): boolean {
  if (scheduleDays && scheduleDays.length > 0) return scheduleDays.includes(today.getDay())
  const weekend = today.getDay() === 0 || today.getDay() === 6
  // Weekday jobs DO run in the holidays. This paused them for a day, on the
  // reasoning that a school day job has no school to attach to, and Justin
  // corrected it: "I am not saying they should not do jobs, brush teeth etc."
  //
  // He is right, and the mistake was reading the label too literally. A parent
  // picking Monday to Friday is describing the rhythm of their week, not
  // tagging a job as school related. Teeth, beds and the dishwasher carry on in
  // August. Pausing them removed the structure a holiday needs MOST, since the
  // real holiday risk is not too many jobs, it is a day with no shape at all.
  if (schedule === 'weekdays') return !weekend
  if (schedule === 'weekend') return weekend
  return true
}
