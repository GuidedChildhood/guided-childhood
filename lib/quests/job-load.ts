// The healthy job load: the science behind not swamping a child with chores.
// Responsibility is genuinely good for children, it builds competence, belonging
// and self worth, but only while it stays a manageable part of the day. Piled
// too high it stops being a helpful routine and starts being pressure, and the
// wellbeing benefit flips. This module reads a child's jobs due today against a
// calibrated sweet spot for their age so the parent app, and DiGi, can say when
// the day is balanced and when it is worth spreading across the week.
//
// Honest framing, the same as the screen guide: these are calibrated steers, not
// a clinical prescription. No body sets an exact number of chores. What the
// literature agrees on is the shape: a few age appropriate responsibilities help,
// an overloaded child does not, and play and rest must still win the day.

export type JobLoadStatus = 'light' | 'healthy' | 'busy' | 'over'

export type JobLite = { title: string; stars?: number; minutes?: number }

// The bodies and research the steer draws on, surfaced so the advice reads as
// grounded, not asserted.
export const JOB_LOAD_SOURCES = [
  { body: 'NHS / Start for Life', note: 'Routines and small responsibilities support children’s wellbeing and self esteem' },
  { body: 'NSPCC', note: 'Age appropriate responsibilities build confidence; expectations must fit the child, never overwhelm' },
  { body: 'Child development research (e.g. Rossmann, longitudinal chores studies)', note: 'Children who help from a young age fare better, in balance with play and downtime' },
] as const

// A rough, honest minute estimate for a job, so the parent sees the real time it
// asks of a child rather than only its star value (stars are the reward, not the
// effort). Matched on keywords, with a gentle default. Play and learning jobs are
// longer by design, and that is the good kind of time.
const MINUTE_RULES: { re: RegExp; mins: number }[] = [
  { re: /(hour of outside|screen free (saturday|morning)|whole screen free)/i, mins: 60 },
  { re: /(football|kickabout|bike|scoot|run about|outside play|family game)/i, mins: 30 },
  { re: /(homework|read|book|reading|spelling|times table|instrument|practice|practise|draw|build|make something)/i, mins: 20 },
  { re: /(clean bedroom|tidy the garden|wash the car|make dinner|help make dinner|cook)/i, mins: 20 },
  { re: /(room tidy|tidy|washing away|dishwasher|lay|clear|set the table|bag packed|walk the pet)/i, mins: 10 },
  { re: /(shoes|teeth|dressed|charge|feed|bins|water the plant|kind thing|screen off)/i, mins: 5 },
]

export function jobMinutes(job: JobLite): number {
  if (typeof job.minutes === 'number' && job.minutes > 0) return job.minutes
  const t = job.title || ''
  for (const rule of MINUTE_RULES) if (rule.re.test(t)) return rule.mins
  return 10
}

// The sweet spot per age: how many jobs in a day, and how many minutes of them,
// still sit comfortably alongside school, play, food and sleep. Younger children
// carry less; older children can hold a little more, but the day is still theirs.
type SweetSpot = { label: string; maxJobs: number; maxMins: number }
const SWEET: Record<string, SweetSpot> = {
  '4-7':   { label: '4 to 7',   maxJobs: 3, maxMins: 30 },
  '8-10':  { label: '8 to 10',  maxJobs: 4, maxMins: 45 },
  '11-13': { label: '11 to 13', maxJobs: 5, maxMins: 60 },
  '13-15': { label: '13 to 15', maxJobs: 6, maxMins: 75 },
  '16+':   { label: '16 plus',  maxJobs: 6, maxMins: 90 },
}
function sweetFor(ageBand: string | null): SweetSpot {
  return (ageBand && SWEET[ageBand]) || SWEET['8-10']
}

export type JobLoadAssessment = {
  count: number
  totalMins: number
  status: JobLoadStatus
  maxJobs: number
  maxMins: number
  bandLabel: string
  headline: string
  advice: string
  // True when the day is heavy enough that spreading some jobs across the week
  // would help, so the UI can offer the one tap fix.
  suggestSpread: boolean
}

// Read a child's jobs due today against their sweet spot. The status leans on
// whichever is tighter, the count of jobs or the total minutes, because five
// tiny jobs and one long one both fill a child up in different ways.
export function assessJobLoad(ageBand: string | null, jobsDueToday: JobLite[]): JobLoadAssessment {
  const sweet = sweetFor(ageBand)
  const count = jobsDueToday.length
  const totalMins = jobsDueToday.reduce((s, j) => s + jobMinutes(j), 0)

  const countRatio = count / sweet.maxJobs
  const minsRatio = totalMins / sweet.maxMins
  const ratio = Math.max(countRatio, minsRatio)

  const status: JobLoadStatus =
    count === 0 ? 'light'
    : ratio <= 0.6 ? 'light'
    : ratio <= 1 ? 'healthy'
    : ratio <= 1.4 ? 'busy'
    : 'over'

  const suggestSpread = status === 'busy' || status === 'over'

  const headline =
    status === 'light' ? (count === 0 ? 'No jobs set for today' : 'A light day, room to spare')
    : status === 'healthy' ? 'A balanced day'
    : status === 'busy' ? 'A busy day for them'
    : 'A lot for one day'

  const advice =
    status === 'light'
      ? 'A few small responsibilities a day is the sweet spot, they build confidence without becoming pressure. There is room to add one or two.'
    : status === 'healthy'
      ? `About right for age ${sweet.label}. Enough to feel useful and earn their screen time, with the day still mostly theirs for play and rest.`
    : status === 'busy'
      ? `This is getting full for age ${sweet.label}. It still works, but keep an eye on it: jobs help most while they stay a small part of the day, not the whole afternoon.`
    : `This is more than most children this age carry well in a day. Chores help wellbeing in the right dose and start to feel like pressure past it. Spreading some across the week keeps the good and drops the swamp.`

  return {
    count,
    totalMins,
    status,
    maxJobs: sweet.maxJobs,
    maxMins: sweet.maxMins,
    bandLabel: sweet.label,
    headline,
    advice,
    suggestSpread,
  }
}
