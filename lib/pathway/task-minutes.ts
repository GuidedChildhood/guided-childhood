import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'

// Roughly how long each step really takes, so the day is counted done when
// about that many minutes have actually been spent, not the instant a couple
// of quick taps land. A short reflection, a couple of cards, a script to read,
// a question to DiGi: the honest minute weight of each, summed as they are
// ticked. Five minutes is still a couple of small things and genuinely enough
// to keep the streak; ten and fifteen ask for a little more, for the days
// there is room. Shared here so the server (DiGi's greeting) and the client
// (the big path) count the same minutes.

export const TASK_MINUTES: Record<TodayLoopTask['key'], number> = {
  checkin: 2, moment: 3, script: 4, digi: 4, done: 0,
}

export function investedMinutes(tasks: TodayLoopTask[]): number {
  return tasks
    .filter(t => t.key !== 'done' && t.done)
    .reduce((sum, t) => sum + (TASK_MINUTES[t.key] ?? 0), 0)
}
