#!/usr/bin/env node
// WHAT THE SOURCES ACTUALLY SAY.
//
// Every claim below was checked against its PRIMARY document on 11 September
// 2026 by four adversarial verifiers, one per source cluster. They returned 14
// confirmations, 14 corrections and 4 demotions on a lesson that had already
// been applied to production, which is the argument for this file existing:
// the module contract checks structure, the council checks density, and
// neither of them can tell whether a number is true.
//
// The worst one was not a number. We told teachers, on a slide, that a computer
// reader is barred from the GCSE English Language reading paper. JCQ says the
// exact opposite by name, and the bar falls on a HUMAN reader, and on sections
// rather than whole papers. A SENCO could have been told that.
//
// So each entry here is a sentence we must never say again, or one we must
// keep saying, pinned to the source that settles it. Add to it whenever a
// verification pass corrects something: a correction that lives only in a
// commit message comes back the next time someone rewrites the slide.
import fs from 'node:fs'

const M = f => JSON.parse(fs.readFileSync(`content/modules/${f}.json`, 'utf8'))
const KS3_24 = 'ks3-24-is-it-doing-my-thinking'
const KS3_22 = 'ks3-22-when-an-ai-acts-like-a-friend'

// [module, source, never | null, always | null, why]
const CLAIMS = [
  // JCQ, Access Arrangements and Reasonable Adjustments 2025/26, March 2026 amended
  [KS3_24, 'JCQ', 'Nobody may read it aloud', null,
   'reversed: JCQ permits a computer reader in a paper testing reading'],
  [KS3_24, 'JCQ', 'construct relevance, computer reader', null,
   'construct is not JCQ language and the doctrine attaches to human readers'],
  [KS3_24, 'JCQ', 'Allowed, because reading is not what maths measures', null,
   'the permission does not hinge on what the paper measures'],
  [KS3_24, 'JCQ', null, 'computer reader IS allowed', 'the rule that actually exists'],
  [KS3_24, 'JCQ', null, 'human reader is NOT allowed', 'the half that is barred'],
  [KS3_24, 'JCQ', null, '50 percent extra time', 'what a barred candidate gets instead'],
  [KS3_24, 'JCQ', null, 'sections, not whole papers', 'the scope of the bar'],

  // Bastani et al, PNAS 122(26) e2422633122, 2025
  [KS3_24, 'Bastani', 'came out ahead', null,
   'no arm beat the control. The hints arm was indistinguishable from it'],
  [KS3_24, 'Bastani', 'and kept it', null, 'implies retained gain, which the paper denies'],
  [KS3_24, 'Bastani', 'did best on the exam', null, 'false premise, nobody did best'],
  [KS3_24, 'Bastani', 'Years 10 and 11', null,
   'the sample was Turkish grades 9 to 11, roughly ages 14 to 17'],
  [KS3_24, 'Bastani', 'hints only removed the harm', null,
   'the paper says largely mitigated, and observes no positive effect'],
  [KS3_24, 'Bastani', null, 'aged about 14 to 17', 'the real age band'],
  [KS3_24, 'Bastani', null, 'no positive effect observed', 'the limit the paper states itself'],
  [KS3_24, 'Bastani', null, 'measure performance rather than learning',
   'the practice figures were scored with the tool still in hand'],
  [KS3_24, 'Bastani', null, 'e2422633122', 'the article locator, so the claim is findable'],
  [KS3_22, 'Bastani', 'harm disappearing when guardrails', null, 'same overstatement, other module'],
  [KS3_22, 'Bastani', 'guardrails removed the harm', null, 'same overstatement, other module'],

  // Oxford University Press, Navigating AI in Education, 9 June 2026
  [KS3_24, 'OUP', 'Three thousand pupils', null,
   'the 72 percent is from the 704 pupil qualitative strand, not the 3,100 survey'],
  [KS3_24, 'OUP', 'offered AI during a piece of school work', null,
   'it was a paragraph about AI inside a study, not ordinary schoolwork'],
  [KS3_24, 'OUP', null, '704 pupils across 20 schools', 'the real base'],
  [KS3_24, 'OUP', null, 'ceiling rather than the everyday rate',
   'demand characteristics: the setting plausibly inflates the decline rate'],
  [KS3_24, 'OUP', null, 'Teaching the AI Native Generation',
   'the 62 percent belongs to the October 2025 report, not this one'],

  // Ofcom, Children and Parents: Media Use and Attitudes Report 2025/26, 21 May 2026
  [KS3_24, 'Ofcom', 'failed the test', null, 'it was one image, not a test with a pass mark'],
  [KS3_24, 'Ofcom', 'Media Use and Attitudes, May 2026', null, 'incomplete title and date'],
  [KS3_24, 'Ofcom', null, 'Media Use and Attitudes Report 2025/26', 'the full title'],
  [KS3_24, 'Ofcom', null, 'do not say children your age',
   "Ofcom's base is 13 to 17, and a Year 7 class sits below it"],

  // Rozenblit and Keil 2002, Mills and Keil 2004
  [KS3_24, 'Keil', 'fall sharply', null, 'unquantified. It is a medium effect, d about 0.49'],
  [KS3_24, 'Keil', 'Most hands go up', null, 'd of 0.49 does not license most on a single item'],
  [KS3_24, 'Keil', null, '1 to 7 scale', 'their instrument, which is not our out of 5 drill'],
  [KS3_24, 'Keil', null, 'No study covers 11 to 13', 'this class is an inference, not a finding'],
]

// Some claims have to be pinned to ONE field. "works in steps" also appears in
// the teacher script for the same slide, so a whole module search still finds
// it after the pupil facing body has lost it, which is precisely the regression
// that matters: the class is told to pick anything they learned this week, and
// the demonstration then fails in front of them.
const FIELD_CLAIMS = [
  [KS3_24, 'Keil', m => m.slides[16].body, null, 'works in steps',
   'the illusion is weak or absent for facts and procedures, so the pupil facing drill must name a mechanism'],
]

// The exit quiz and starter quiz each exist TWICE, in teacher_notes and in
// assessment. Correcting one and not the other is exactly the mistake that got
// past the first pass, so the copies must stay identical.
const TWINS = [['exit_quiz', 'exit_quiz'], ['starter_quiz', 'retrieval_starter']]

const cache = {}
const text = id => (cache[id] ??= JSON.stringify(M(id)))
let bad = 0
for (const [id, source, never, always, why] of CLAIMS) {
  const hay = text(id)
  if (never && hay.includes(never)) {
    bad++; console.error(`  FAIL ${id} [${source}] says "${never}"\n         ${why}`)
  }
  if (always && !hay.includes(always)) {
    bad++; console.error(`  FAIL ${id} [${source}] no longer says "${always}"\n         ${why}`)
  }
}
for (const [id, source, pick, never, always, why] of FIELD_CLAIMS) {
  let v
  try { v = String(pick(M(id))) } catch { v = '' }
  if (never && v.includes(never)) {
    bad++; console.error(`  FAIL ${id} [${source}] that field says "${never}"\n         ${why}`)
  }
  if (always && !v.includes(always)) {
    bad++; console.error(`  FAIL ${id} [${source}] that field no longer says "${always}"\n         ${why}`)
  }
}
for (const id of [KS3_24]) {
  const m = M(id)
  for (const [a, b] of TWINS) {
    const x = m.teacher_notes?.[a], y = m.assessment?.[b]
    if (!x || !y) continue
    if (JSON.stringify(x) !== JSON.stringify(y)) {
      bad++
      console.error(`  FAIL ${id}: teacher_notes.${a} and assessment.${b} have drifted apart.\n` +
                    `         They are the same quiz. Correct one and you must correct both.`)
    }
  }
}
console.log(bad
  ? `\ncheck-source-claims: ${bad} failing`
  : `check-source-claims: ${CLAIMS.length + FIELD_CLAIMS.length} verified claims hold, quiz copies in sync.`)
process.exit(bad ? 1 : 0)
