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
//
// A CLAIM MAY BE A REGEXP, and three of them are, all for the same reason
// (21 September 2026). Some claims were pinned to a capitalised string, which
// attested two things at once: the claim, and the decision to shout it. The
// must batch in migrations 326 to 336 overruled the shouting on accessibility
// grounds, E34 and the BDA style guide, which rule out capitals for emphasis
// for dyslexic readers. On ks3-24 slide 12 that is not a close call: it is the
// slide written for the dyslexic pupil in the room, about the reader they are
// allowed in an exam, and it was set in capitals.
//
// The claim is what this file is for. The case is not, so where case was only
// emphasis those three are matched case insensitively and the words are still
// required exactly. Use a string everywhere else: an exact match is the
// stronger guard and most of these claims turn on the exact words.
import fs from 'node:fs'

// A claim holds if the string appears, or if the RegExp matches.
const holds = (hay, claim) => (claim instanceof RegExp ? claim.test(hay) : hay.includes(claim))
const show = claim => (claim instanceof RegExp ? claim.source : claim)

const M = f => JSON.parse(fs.readFileSync(`content/modules/${f}.json`, 'utf8'))
const KS3_24 = 'ks3-24-is-it-doing-my-thinking'
const KS3_22 = 'ks3-22-when-an-ai-acts-like-a-friend'
const KS2_25 = 'ks2-25-stay-the-maker'
const KS3_10 = 'ks3-10-mood-and-screens'
const KS3_11 = 'ks3-11-social-workarounds'
const KS4_17 = 'ks4-17-sextortion'

// [module, source, never | null, always | null, why]
const CLAIMS = [
  // JCQ, Access Arrangements and Reasonable Adjustments 2025/26, March 2026 amended
  [KS3_24, 'JCQ', 'Nobody may read it aloud', null,
   'reversed: JCQ permits a computer reader in a paper testing reading'],
  [KS3_24, 'JCQ', 'construct relevance, computer reader', null,
   'construct is not JCQ language and the doctrine attaches to human readers'],
  [KS3_24, 'JCQ', 'Allowed, because reading is not what maths measures', null,
   'the permission does not hinge on what the paper measures'],
  // Case insensitive since 21 September 2026: the capitals were emphasis and
  // E34 took them off this slide of all slides. The rule is what is attested.
  [KS3_24, 'JCQ', null, /computer reader is allowed/i, 'the rule that actually exists'],
  [KS3_24, 'JCQ', null, /human reader is not allowed/i, 'the half that is barred'],
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

  // ks2-25. The KS2 lesson makes a DIFFERENT argument on purpose, and the line
  // it must not cross is the one the KS3 lesson stands on. Bastani is 14 to 17
  // at one Turkish school and has nothing to say about a Year 4 class, so it
  // appears in this module exactly once, in the evidence base, marked as out of
  // scope. Anything that reads like the KS3 claim has crossed the line.
  [KS2_25, 'Bastani', '17 percent', null,
   'the exam grade result is 14 to 17 year olds and must never be taught to this age group'],
  [KS2_25, 'Bastani', '48 percent', null, 'same trial, same age problem'],
  [KS2_25, 'Bastani', '127 percent', null, 'same trial, same age problem'],
  [KS2_25, 'Bastani', null, 'deliberately NOT used here',
   'the one mention is the note recording that it is out of scope. Losing that note loses the reason'],
  [KS2_25, 'Keil', null, 'works in steps',
   'the effect is weak or absent for facts and procedures, so the drill must name a mechanism'],
  [KS2_25, 'Keil', 'Most hands go up', null, 'd is about 0.49, which does not license most'],
  [KS2_25, 'metaphor', null, 'It is an analogy, not a finding about brains',
   'the muscle line is a picture, and the teacher notes have to keep saying so'],

  // The V1 evidence pass, 24 September 2026 (migrations 344 to 347).
  // Orben and Przybylski, Nature Human Behaviour 3, 173 to 182, 2019
  [KS3_10, 'Orben', 'What showed up as mattering more was what you do', null,
   'the Oxford study never measured what you do on a screen; sleep, breakfast and bullying had the bigger links'],
  [KS3_10, 'Orben', 'how you use screens really does show up in the data', null, 'same misattribution, teacher script'],
  [KS3_10, 'Orben', 'it says HOW their apps make you feel is what counts', null, 'same misattribution, quiz feedback'],
  [KS3_10, 'Orben', 'the biggest studies say what young people do', null, 'same misattribution, the note that goes home'],
  [KS3_10, 'Orben', null, '355,358 young people', 'the real base, three surveys'],
  // Beyens, Pouwels, van Driel, Keijsers and Valkenburg, Scientific Reports 10, 10763, 2020
  [KS3_10, 'Beyens', 'most linked with feeling flat', null,
   'after passive use 46 percent felt better, 44 percent no different, 10 percent worse'],
  [KS3_10, 'apps', 'no app has ever asked', null, 'mood apps ask exactly that; the claim is about feeds'],
  // DSIT, Children's circumvention behaviours online, 14 July 2026; GOV.UK, 1 August 2025
  [KS3_11, 'age checks', 'It knows the age you typed in', null,
   'since July 2025 many platforms check age with more than a typed birthday'],
  [KS3_11, 'Ofcom', 'Reports from a child account are prioritised', null,
   'no source found; the law requires clear, easy reporting for children'],
  [KS3_11, 'TikTok', 'its only job is to keep you there longer', null,
   'TikTok ranks by predicted interest, and only is more than any source says'],
  [KS3_11, 'DSIT', null, "Children's circumvention behaviours online", 'the 2026 source for the statistic slide'],
  // NCA alert for education settings, April 2024, and its press release of 29 April 2024
  [KS4_17, 'NCA', 'paying never ends it', null,
   'the NCA says there is no guarantee paying stops it, and they will likely ask for more'],
  [KS4_17, 'NCA', 'it has never been the end of it', null, 'same, hard question'],
  [KS4_17, 'NCA', 'Paying is the one move that never works', null, 'same, recap'],
  [KS4_17, 'NCA', 'why paying never makes it stop', null, 'same, the note that goes home'],
  [KS4_17, 'NCA', 'often within minutes', null, 'the NCA says some cases went from first contact to blackmail in under an hour'],
  [KS4_17, 'NCA', null, 'no guarantee', "the NCA's own wording on paying"],
  [KS4_17, 'CEOP', 'The police child protection command', null,
   'CEOP is a command of the National Crime Agency, and reports go to its Child Protection Advisors'],
  [KS4_17, 'law', 'Sending an image is not a crime committed against yourself', null,
   'under 18 it is illegal to make an image even of yourself (UKCIS), so the lesson must never imply sending is not a crime'],
  // UKCIS, Sharing nudes and semi nudes: advice for education settings, March 2024
  [KS4_17, 'UKCIS', 'send, describe or forward', null,
   'UKCIS bases the response on what the DSL is told about the image, so a pupil may describe it'],
  [KS4_17, 'NCA', 'the pathway is DSL, then CEOP report', null,
   "the alert says the DSL refers a disclosure to the police and/or children's services"],
  [KS4_17, 'NCA', null, 'refers it straight away to the police', 'the referral the alert directs'],
]

// Some claims have to be pinned to ONE field. "works in steps" also appears in
// the teacher script for the same slide, so a whole module search still finds
// it after the pupil facing body has lost it, which is precisely the regression
// that matters: the class is told to pick anything they learned this week, and
// the demonstration then fails in front of them.
const FIELD_CLAIMS = [
  [KS3_24, 'Keil', m => m.slides[17].body, null, 'works in steps',
   'the illusion is weak or absent for facts and procedures, so the pupil facing drill must name a mechanism'],
  // Was 'WORKS IN STEPS', and the note here used to say it was shouted on
  // purpose so seven year olds could not miss the constraint. E34 took the
  // capitals off on 21 September 2026 for the same reason as the JCQ pair, and
  // the same edit swapped column subtraction for how a circuit lights a bulb,
  // because a procedure is exactly the kind of thing this lesson's own evidence
  // base says the explain it back effect was NOT found for. The mechanism
  // constraint is what is attested; how loudly it is said is not.
  [KS2_25, 'Keil', m => m.slides[16].body, null, /works in steps/i,
   'same rule, KS2 drill. The drill only works on something with a mechanism'],
  // Pinned to the evidence base row rather than the module, because the same
  // phrase also appears in subject_knowledge. Gutting the row while leaving the
  // teacher note intact would otherwise pass, and the row is the load bearing
  // one: it is the only age matched claim this lesson stands on.
  [KS2_25, 'Keil', m => m.teacher_notes.evidence_base[0].claim, null, 'grades 2 and 4, roughly ages 7 to 10',
   'the age matched evidence this lesson actually rests on'],
  // The slide pupils read is the one that has to say what the Oxford data found
  // mattered more. The teacher script alone would not stop the wall reverting.
  [KS3_10, 'Orben', m => m.slides[7].body, null, 'Sleep, breakfast and being bullied',
   'what the same data found mattered far more than screen time'],
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
  if (never && holds(hay, never)) {
    bad++; console.error(`  FAIL ${id} [${source}] says "${show(never)}"\n         ${why}`)
  }
  if (always && !holds(hay, always)) {
    bad++; console.error(`  FAIL ${id} [${source}] no longer says "${show(always)}"\n         ${why}`)
  }
}
for (const [id, source, pick, never, always, why] of FIELD_CLAIMS) {
  let v
  try { v = String(pick(M(id))) } catch { v = '' }
  if (never && holds(v, never)) {
    bad++; console.error(`  FAIL ${id} [${source}] that field says "${show(never)}"\n         ${why}`)
  }
  if (always && !holds(v, always)) {
    bad++; console.error(`  FAIL ${id} [${source}] that field no longer says "${show(always)}"\n         ${why}`)
  }
}
for (const id of [KS3_24, KS2_25]) {
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
