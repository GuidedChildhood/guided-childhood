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

// How often this job happens, in a child's words.
//
// Justin: "if it's set for weekdays it sends a notification for exact day so 5,
// but only need to send one that job has been added and say if weekly etc."
//
// The five pushes are the daily reminder cron doing its job, not the add doing
// it five times. But the add never SAID the cadence, so a child met "Tidy your
// room is worth 1 star" and then five nudges across the week with nothing ever
// having told them it was a weekday job. The reminders read as pestering
// because the agreement was never stated.
//
// Said once, at the point it is added, they read as the thing already agreed.
export function scheduleLabel(schedule: string | null, days?: number[] | null): string {
  // Chosen days win over the schedule word: a parent who picked Tuesday and
  // Thursday means those, whatever the dropdown says.
  if (Array.isArray(days) && days.length > 0) {
    const NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const picked = [...new Set(days)].sort().map(d => NAMES[d]).filter(Boolean)
    if (picked.length === 1) return `every ${picked[0]}`
    if (picked.length === 7) return 'every day'
    const last = picked.pop()
    return `every ${picked.join(', ')} and ${last}`
  }
  switch (schedule) {
    case 'daily': return 'every day'
    case 'weekdays': return 'every weekday'
    case 'weekend': return 'at the weekend'
    // A one off says nothing about repeating, because it does not.
    case 'once': return ''
    default: return ''
  }
}
