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

import { isSchoolHoliday, type Region } from '@/lib/learning/holidays'

export type JobBand = 'morning' | 'after_school' | 'evening'

/**
 * The permanent name of the slot, used where a parent is setting up a routine
 * that will run across terms and holidays alike.
 *
 * NOT used in anything a child or parent reads about TODAY. See bandLabelOn.
 */
export const BAND_LABEL: Record<JobBand, string> = {
  morning: 'before school',
  after_school: 'after school',
  evening: 'before bed',
}

/** What today is: a school day, a weekend, or the holidays. */
export function isSchoolDay(on: Date, region: Region = 'uk'): boolean {
  const day = on.getDay()
  if (day === 0 || day === 6) return false
  return !isSchoolHoliday(on, region)
}

/**
 * What to call this slot TODAY.
 *
 * Justin: "there are jobs set for after school but it is now the UK holidays,
 * so a little misleading."
 *
 * He is right, and it is worse than misleading on two counts he did not have to
 * point out, because the screenshot was taken on SATURDAY 1 AUGUST. The copy
 * said "after school" on a weekend in the middle of the summer holidays, so it
 * was wrong twice over, and it would be wrong every Saturday and Sunday of the
 * year as well as for the thirteen weeks of holidays.
 *
 * The slot itself is not wrong and does not move. Half past three is still the
 * hour a child has time and standing to go and do something, in August as in
 * October. It is only the NAME that stops being true, so only the name changes.
 * The band id, the schedule and the reminder hour all stay exactly as they are,
 * which means nothing a family has already set up is touched.
 *
 * Evening keeps its name in every season. Bedtime survives the holidays, even
 * if it slides an hour later, and "before bed" is true on a Sunday in August.
 */
export function bandLabelOn(band: JobBand, on: Date, region: Region = 'uk'): string {
  if (band === 'evening') return 'before bed'
  if (isSchoolDay(on, region)) return BAND_LABEL[band]
  return band === 'morning' ? 'this morning' : 'this afternoon'
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

/**
 * The band to actually remind on: what the parent chose, or the guess.
 *
 * Every read of a job's band goes through here rather than calling bandForJob
 * directly, so a family who has said when they do a job is never overruled by
 * the words in its title. "Feed the cat" reads as after school because it
 * contains "cat", which is wrong in a house that feeds the cat before school,
 * and until this column existed there was no way to say so.
 *
 * A null band keeps the guess, so every job written before the picker existed
 * behaves exactly as it always has.
 */
export function bandForQuest(quest: { band?: string | null; title: string }): JobBand {
  return isBand(quest.band) ? quest.band : bandForJob(quest.title)
}
