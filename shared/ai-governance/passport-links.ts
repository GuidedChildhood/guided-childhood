// THE JOIN: A FINDING ABOUT A PRODUCT BECOMES SOMETHING A CLASS CAN BE TAUGHT.
//
// This is the part that stops the whole feature being another checklist in an
// admin menu. When a review turns up a risk that is genuinely a child's to
// learn, the result page names the competency and links the lesson that already
// teaches it. The lessons are real module ids from shared/schools-curriculum.ts
// and a test asserts every one of them exists.
//
// WHAT IS DELIBERATELY NOT HERE, and the brief is right about this: processor
// agreements, retention schedules, breach terms and subprocessor lists have no
// child facing competency. They belong to adults. Turning them into a lesson
// would be the moment this stopped being honest, so risks with no genuine
// pupil skill simply do not appear in this table.
//
// WHERE WE HAVE A GAP WE SAY SO. The scheme has no module on an AI that behaves
// like a friend, because it was written before that was the common case. That
// gap is named in `gap` rather than papered over by pointing at the nearest
// lesson and hoping. Naming it is how it gets written.

import type { AnswerValue } from './types'
import type { PassportStage } from '../passport-stages'

export type PassportLink = {
  id: string
  /** Any one of these firing raises the link. */
  when: { questionId: string; value: AnswerValue }[]
  /** The finding, in a sentence a governor would understand. */
  risk: string
  /** The child facing competency, phrased as the child would meet it. */
  competency: string
  stages: PassportStage[]
  /** Real module ids. Empty only when `gap` explains why. */
  modules: string[]
  gap?: string
}

export const PASSPORT_LINKS: PassportLink[] = [
  {
    id: 'hallucination',
    when: [
      { questionId: 'l-hallucination', value: 'no' },
      { questionId: 'l-challenge', value: 'no' },
    ],
    risk: 'Pupils may take a confident answer as a correct one.',
    competency: 'Can I check an AI answer against another source?',
    stages: ['explorer', 'shaper'],
    modules: ['ks3-12-misinfo-deepfakes', 'ks5-20-ai-mastery-data-rights'],
  },
  {
    id: 'dependence',
    when: [
      { questionId: 'l-still-practise', value: 'no' },
      { questionId: 'l-explain', value: 'no' },
      { questionId: 'l-with-without', value: 'no' },
    ],
    risk: 'The tool may be doing the part of the work that was the learning.',
    competency: 'Can I do part of this without AI, and explain what I did?',
    // ks3-24 first, and it is the reason migration 292 exists. This link used
    // to resolve ONLY to the two KS5 modules, so a primary or secondary school
    // that answered no to all three questions was pointed at Years 12 to 13.
    // That is worse than the empty `companion` gap was, because it resolved to
    // something and therefore looked answered. The KS5 pair stay for sixth form.
    stages: ['explorer', 'shaper', 'independent'],
    modules: ['ks3-24-is-it-doing-my-thinking', 'ks5-20-ai-mastery-data-rights', 'ks5-21-digital-identity-future-work'],
  },
  {
    id: 'personal-data',
    when: [
      { questionId: 'd-prompts', value: 'yes' },
      { questionId: 'd-training', value: 'yes' },
      { questionId: 't-child-understands', value: 'no' },
    ],
    risk: 'What a pupil types may be stored, and they may not realise it.',
    competency: 'Can I recognise information I should not type into something?',
    stages: ['builder', 'explorer'],
    modules: ['ks2-07-privacy-reputation'],
  },
  {
    id: 'engagement-design',
    when: [
      { questionId: 'r-continued', value: 'yes' },
    ],
    risk: 'The product is designed to be returned to, not just used.',
    competency: 'Can I notice when a system is trying to keep me there?',
    stages: ['builder', 'explorer', 'shaper'],
    modules: ['ks2-06-how-algorithms-work', 'ks4-15-manipulation-persuasion'],
  },
  {
    id: 'is-it-real',
    when: [
      { questionId: 't-knows-ai', value: 'no' },
      { questionId: 't-identifies', value: 'no' },
    ],
    risk: 'A child may not be clear they are talking to a machine.',
    competency: 'Can I tell what was made by a person and what was made by a computer?',
    stages: ['foundation', 'builder'],
    modules: ['ks1-03-real-pretend-computer', 'ks2-09-copyright-ownership'],
  },
  {
    id: 'companion',
    when: [
      { questionId: 'r-friendship', value: 'yes' },
      { questionId: 'r-affection', value: 'yes' },
      { questionId: 'r-confidant', value: 'yes' },
      { questionId: 'r-personal-questions', value: 'yes' },
    ],
    risk: 'The product behaves like a friend rather than a tool.',
    competency: 'Can I explain the difference between an AI that talks like a friend and a friend?',
    // `builder` joined on 10 September 2026 with the KS2 lesson. The competency
    // was always written for explorer and shaper, which was the honest reach
    // while only the KS3 lesson existed. A ten year old meets these inside a
    // game helper and the speaker in the kitchen, so the stage list follows the
    // teaching rather than the other way round.
    stages: ['builder', 'explorer', 'shaper'],
    // Filled 10 September 2026. This link shipped with an empty modules list
    // and a gap note shown to schools in amber, on the argument that naming a
    // hole honestly beats linking a near miss. The hole is now two lessons, one
    // either side of the move to secondary.
    modules: ['ks2-23-when-a-machine-talks-like-a-friend', 'ks3-22-when-an-ai-acts-like-a-friend'],
  },
  {
    id: 'secrecy',
    when: [
      { questionId: 'r-secrecy', value: 'yes' },
    ],
    risk: 'The product encourages keeping things from adults.',
    competency: 'Can I say who I would tell, and know that telling is never trouble?',
    stages: ['foundation', 'builder', 'explorer'],
    modules: ['ks2-08-kind-safe-online', 'ks4-17-sextortion'],
  },
]

/** Which links a set of answers raises. Order is the table order, which runs
 *  from most common to most serious rather than by severity, because a school
 *  reads this as a list of teaching to do. */
export function raisedLinks(answers: Record<string, { value?: AnswerValue }>): PassportLink[] {
  return PASSPORT_LINKS.filter(link =>
    link.when.some(w => answers[w.questionId]?.value === w.value),
  )
}
