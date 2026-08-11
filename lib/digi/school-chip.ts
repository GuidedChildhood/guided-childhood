// When a parent's question to DiGi is really a school question.
//
// Justin, 11 August 2026: "we need to run informative emails linking this
// service, and DiGi prompts now and again, not too often, especially when tired
// questions or homework questions are asked in DiGi, as this is a good
// resource."
//
// ── WHY THIS IS A MATCHER AND NOT A PERMANENT CHIP ───────────────────────────
//
// "Not too often" is the whole design. A chip that sits under every DiGi answer
// advertising the curriculum checker becomes furniture in a week, and furniture
// does not get tapped. The frequency cap is not a counter, it is relevance: the
// chip appears only when the parent has actually asked about school, homework,
// or a morning that is going wrong, and stays away the rest of the time. A
// parent who asks about homework twice in a day should see it twice, because
// both times it was the right answer.
//
// TIRED QUESTIONS COUNT, and that is Justin's line rather than an invention. A
// parent asking why their child is exhausted every morning is usually asking a
// school question wearing pyjamas, and the term ahead is the thing that makes
// the week make sense.
//
// Pure, dependency free, so scripts/check-school-chip.mjs can run it without a
// browser or a database.

export type SchoolChip = {
  icon: string
  label: string
  href: string
  /** Which rule matched, so a check can assert the reason and not just the result. */
  kind: 'homework' | 'school'
}

/**
 * Homework first, because it is the most specific and the most urgent. A parent
 * typing at half past six with a worksheet in front of them wants the decoder,
 * not a term overview.
 *
 * Every entry is a whole word or a phrase, never a fragment. "sat" inside
 * "Saturday" and "test" inside "latest" are exactly how a keyword list starts
 * serving the wrong thing, and the Right Now situation map already carries a
 * comment learning that lesson the hard way.
 */
const HOMEWORK = /\bhome\s?work\b|\bworksheet\b|\bspellings?\b|\btimes? tables?\b|\bmaths? (?:question|problem|sheet)\b|\bhow (?:do|are) they teach\b|\bnew method\b|\bcolumn method\b|\bnumber ?line\b|\bcarrying over\b|\brevision\b|\bpast papers?\b/i

/**
 * The wider school question: what the class is on, what is coming, and the
 * tired mornings that are usually about it.
 */
const SCHOOL = /\bat school\b|\bin class\b|\bteacher\b|\bcurriculum\b|\byear \d\b|\bkey stage\b|\bsats?\b|\bparents? evening\b|\bschool report\b|\bfalling behind\b|\bkeeping up\b|\bwhat (?:are|is) they learning\b|\bnew term\b|\bback to school\b|\bstart of term\b/i

/**
 * Tired mornings, which Justin named specifically. Narrower than it looks on
 * purpose: "tired" alone is not enough, because a parent can be tired, a
 * conversation can be tiring, and neither is a school question. It needs the
 * child and the shape of a school morning around it.
 */
const TIRED_MORNING = /\b(?:exhaust\w*|shattered|knackered|so tired|always tired|tired every)\b[\s\S]{0,60}\b(?:morning|school|class|week ?day)\b|\b(?:morning|school|class)\b[\s\S]{0,60}\b(?:exhaust\w*|shattered|knackered|so tired|always tired|tired every)\b/i

/**
 * The chip to offer under a DiGi answer, or null when this was not a school
 * question and the honest thing is to offer nothing.
 *
 * @param ask the parent's own words, most recent message
 */
export function schoolChipFor(ask: string | null | undefined): SchoolChip | null {
  const text = (ask ?? '').trim()
  // Too short to be a question about anything. "ok", "thanks", "yes".
  if (text.length < 8) return null

  if (HOMEWORK.test(text)) {
    return {
      icon: '📐',
      label: 'Make sense of that homework',
      href: '/dashboard/learning?tab=homework',
      kind: 'homework',
    }
  }
  if (SCHOOL.test(text) || TIRED_MORNING.test(text)) {
    return {
      icon: '🎒',
      label: 'What their class is on now',
      href: '/dashboard/learning',
      kind: 'school',
    }
  }
  return null
}
