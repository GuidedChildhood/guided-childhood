// When in the day does this job actually happen?
//
// Justin: "jobs are still outstanding but around job time, either before school
// or after school, so clever enough that bed not made before, clothes ready for
// tomorrow, so looks at job type and works out timely reminder."
//
// A reminder at the wrong hour is worse than no reminder. Telling a child at
// 8pm that their bed is not made is pointless, because the moment has gone and
// all it does is end the day on a telling off. Telling them at 7:15 is useful.
// So every job gets a band, and each band fires once at the hour it can still
// be acted on.
//
// The signal is already in the words. These titles come from our own templates
// and routine packs, which were written around the shape of a school day, so
// the matching is against language we control rather than free text guessing.
// A parent's own wording falls through to the after school band, which is the
// safest default: it is the longest stretch of a child's own time, and it is
// when they can actually go and do something about it.

export type JobBand = 'morning' | 'after_school' | 'evening'

export const BAND_LABEL: Record<JobBand, string> = {
  morning: 'before school',
  after_school: 'after school',
  evening: 'before bed',
}

// Ordered, and first match wins, so the more specific phrases come first.
// "ready for tomorrow" has to beat "ready", or getting dressed in the morning
// and laying clothes out at night collapse into the same band.
const RULES: { band: JobBand; any: string[] }[] = [
  {
    // Anything about tomorrow is done tonight, whatever else is in the title.
    band: 'evening',
    any: [
      'tomorrow', 'tonight', 'bed time', 'bedtime', 'pyjama', 'pjs', 'bath', 'wind down',
      'lay out', 'laid out', 'before bed', 'tidy before', 'charge', 'downstairs',
      'screens off', 'story', 'read together', 'teeth at night',
    ],
  },
  {
    band: 'morning',
    any: [
      'bed made', 'make your bed', 'make my bed', 'made the bed',
      'teeth brushed', 'dressed', 'breakfast', 'shoes on', 'ready on time',
      'out the door', 'bag packed for', 'school bag packed', 'morning',
    ],
  },
  {
    band: 'after_school',
    any: [
      'homework', 'reading', 'lost in a book', 'practice', 'practise',
      'instrument', 'spellings', 'times tables', 'outside', 'bike', 'scoot',
      'run about', 'play', 'dinner', 'table', 'washing up', 'dishwasher',
      'bins', 'plants', 'pet', 'cat', 'dog', 'tidy', 'washing away',
    ],
  },
]

/**
 * Which part of the day this job belongs to.
 *
 * Unknown wording lands in after school on purpose rather than being dropped.
 * A job with no reminder at all is a job a child forgets, and after school is
 * the hour where they have both the time and the standing to go and do it.
 */
export function bandForJob(title: string): JobBand {
  const t = title.toLowerCase()
  for (const rule of RULES) {
    if (rule.any.some(k => t.includes(k))) return rule.band
  }
  return 'after_school'
}

/** Is this band the one being reminded right now? */
export function isBand(value: unknown): value is JobBand {
  return value === 'morning' || value === 'after_school' || value === 'evening'
}
