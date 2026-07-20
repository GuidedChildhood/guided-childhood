import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'

// The shared voice and arithmetic of the daily loop, in one server safe
// module with no client or server-only imports, so the home page (server),
// the one card and the path strip (both client) all count the day and speak
// about it exactly the same way.

// Roughly how long each step really takes, so the day is counted done when
// about that many minutes have actually been spent, not the instant a couple
// of quick taps land. A short reflection, a couple of cards, a script to read,
// a question to DiGi: the honest minute weight of each, summed as they are
// ticked. Five minutes is still a couple of small things and genuinely enough
// to keep the streak; ten and fifteen ask for a little more, for the days
// there is room.
export const TASK_MINUTES: Record<TodayLoopTask['key'], number> = {
  checkin: 2, moment: 3, script: 4, digi: 4, done: 0,
}

// What each step actually involves, shown before the parent taps in. The
// wording follows the clock: the same step reads differently at breakfast and
// at bedtime, so the day always feels like it belongs to this moment.
export function nextHint(key: TodayLoopTask['key']): string {
  const hour = new Date().getHours()
  const daypart = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const hints: Record<TodayLoopTask['key'], Record<string, string>> = {
    checkin: {
      morning: 'Start the day: thirty seconds on how yesterday’s worry went',
      afternoon: 'Thirty seconds on how yesterday’s worry went',
      evening: 'Before the day closes: how did yesterday’s worry go?',
    },
    moment: {
      morning: 'Two minutes with today’s cards, best before the day runs off',
      afternoon: 'Two minutes with today’s cards',
      evening: 'Two minutes with today’s cards while the kettle boils',
    },
    script: {
      morning: 'Today’s words, ready for the after school moment',
      afternoon: 'The words for the tricky moment coming after school',
      evening: 'Tonight’s words for the wind down, ready to read',
    },
    digi: {
      morning: 'Ask DiGi the thing on your mind before the day starts',
      afternoon: 'Ask DiGi one question about your day',
      evening: 'Tell DiGi how today actually went',
    },
    done: {
      morning: 'Tap to see your progress',
      afternoon: 'Tap to see your progress',
      evening: 'Tap to see your progress',
    },
  }
  return hints[key][daypart]
}

// The minutes actually invested so far today: the summed weight of the steps
// ticked, the one honest number the greeting and the card both read.
export function investedMinutesOf(tasks: TodayLoopTask[]): number {
  return tasks
    .filter(t => t.key !== 'done' && t.done)
    .reduce((sum, t) => sum + (TASK_MINUTES[t.key] ?? 0), 0)
}

// Whether the day is done at the parent's chosen budget: the minutes are
// spent, or every step is ticked. Anything after that is bonus, never debt.
export function isDayDone(tasks: TodayLoopTask[], minutes: number): boolean {
  const steps = tasks.filter(t => t.key !== 'done')
  return investedMinutesOf(tasks) >= minutes
    || (steps.length > 0 && steps.every(t => t.done))
}
