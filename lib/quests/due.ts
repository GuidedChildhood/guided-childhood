import { isSchoolHoliday, type Region } from '@/lib/learning/holidays'
// Which quests are due today, by schedule. A once quest stays due until
// it has ever been approved. When a quest names specific days (schedule_days,
// a list of weekday numbers 0 Sunday through 6 Saturday), those win, so tidy
// the room Monday Wednesday Friday is due only on those days. Otherwise the
// schedule text decides.

export function questDueToday(
  schedule: string,
  scheduleDays?: number[] | null,
  today = new Date(),
  region: Region = 'uk',
): boolean {
  if (scheduleDays && scheduleDays.length > 0) return scheduleDays.includes(today.getDay())
  const weekend = today.getDay() === 0 || today.getDay() === 6
  // "School days" means school days. In the holidays there is no school run,
  // no uniform and no book bag, so a job written for that morning has nothing
  // to attach to. It used to fire straight through August, which turned six
  // weeks of perfectly reasonable holiday into six weeks of missed jobs and a
  // broken streak.
  //
  // Only the school day schedule pauses. Every day still means every day,
  // because feeding the cat does not stop for half term.
  if (schedule === 'weekdays') return !weekend && !isSchoolHoliday(today, region)
  if (schedule === 'weekend') return weekend
  return true
}
