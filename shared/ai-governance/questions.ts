// THE ASSESSMENT: ten sections, and what each question is actually for.
//
// A school answers these about a product BEFORE it reaches children. The point
// is not to produce a score. It is to make a school's own decision recordable,
// explainable and reviewable a year later by somebody who was not in the room.
//
// TWO RULES THIS FILE KEEPS.
//
// 1. Nothing here asserts a fact about any vendor. Every answer is the school's,
//    with its own evidence field. We do not ship a database of provider claims
//    we cannot stand behind, and we never generate a finding a school did not
//    make.
//
// 2. Nothing here is legal advice. Where an answer needs a professional, the
//    guidance says so and names who, rather than implying we have decided.
//
// WEIGHTING. `material` means a yes (or a no, per concernWhen) is a real
// governance, safeguarding or developmental concern and turns its category red.
// `clarify` means it needs a decision, a mitigation or a conversation, and turns
// it amber. Absence of an answer is never green: it is unknown, which is an
// honest state and the one most procurement checklists quietly skip.

import type { CategoryKey, SectionKey, AnswerValue } from './types'

export type QuestionKind = 'yesno' | 'text' | 'choice'

export type Question = {
  id: string
  section: SectionKey
  prompt: string
  kind: QuestionKind
  choices?: string[]
  /** Which rating this question feeds. Omitted for questions that inform the
   *  record but should not move a rating on their own. */
  category?: CategoryKey
  /** The answer that represents a concern. */
  concernWhen?: AnswerValue
  weight?: 'material' | 'clarify'
  guidance?: string
  /** Ask for a source alongside the answer. */
  evidence?: boolean
  /** Only asked when the tool is pupil facing. A teacher's planning assistant
   *  does not need the companion questions and asking anyway trains people to
   *  click through. */
  pupilOnly?: boolean
}

export const SECTIONS: { key: SectionKey; title: string; blurb: string }[] = [
  { key: 'purpose', title: 'Purpose', blurb: 'What this tool is for, who uses it, and whether AI is the reason it works.' },
  { key: 'data', title: 'Child data', blurb: 'What the provider collects, keeps, shares and will delete.' },
  { key: 'memory', title: 'Memory', blurb: 'What the system remembers between sessions, and who controls it.' },
  { key: 'relationship', title: 'Relationship features', blurb: 'Whether the product behaves like a tool or like a friend.' },
  { key: 'safeguarding', title: 'Safeguarding', blurb: 'What happens when a child says something that matters.' },
  { key: 'oversight', title: 'Human oversight', blurb: 'What the system decides, and what a person still decides.' },
  { key: 'learning', title: 'Learning and independence', blurb: 'Whether pupils get better, or just finish faster.' },
  { key: 'age', title: 'Readiness', blurb: 'Age, stage and what pupils have actually been taught.' },
  { key: 'transparency', title: 'Transparency', blurb: 'What children, staff and parents are told.' },
  { key: 'security', title: 'Security and control', blurb: 'Accounts, permissions, audit and what the school can switch off.' },
]

const DPO_NOTE = 'Your school may need to confirm this with your DPO or data protection lead.'

export const QUESTIONS: Question[] = [
  // ── 1. Purpose ──────────────────────────────────────────────────────
  { id: 'p-problem', section: 'purpose', kind: 'text',
    prompt: 'What educational problem is this meant to solve?',
    guidance: 'One sentence. If it is hard to write, that is itself the finding.' },
  { id: 'p-alternative', section: 'purpose', kind: 'text',
    prompt: 'Is there a way to do this without AI, and what is it?' },
  { id: 'p-materially-better', section: 'purpose', kind: 'yesno',
    prompt: 'Does AI materially improve this activity, rather than simply being available?',
    category: 'learning', concernWhen: 'no', weight: 'clarify',
    guidance: 'A no is not a veto. It means the case for introducing it should be made deliberately rather than by default.' },
  { id: 'p-optional', section: 'purpose', kind: 'yesno',
    prompt: 'Can a pupil complete the work without using this tool?',
    category: 'learning', concernWhen: 'no', weight: 'clarify',
    guidance: 'Required use raises the bar on everything else in this review, because a child cannot opt out of it.' },

  // ── 2. Child data ───────────────────────────────────────────────────
  { id: 'd-collects', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Does the provider collect pupil data?',
    category: 'data', concernWhen: 'unknown', weight: 'material',
    guidance: DPO_NOTE },
  { id: 'd-categories', section: 'data', kind: 'text', evidence: true,
    prompt: 'Which categories of pupil data?' },
  { id: 'd-prompts', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Are prompts and typed inputs stored?',
    category: 'data', concernWhen: 'yes', weight: 'clarify' },
  { id: 'd-uploads', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Are uploaded documents stored?',
    category: 'data', concernWhen: 'yes', weight: 'clarify' },
  { id: 'd-media', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Are images, audio or video stored?',
    category: 'data', concernWhen: 'yes', weight: 'clarify' },
  { id: 'd-conversations', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Are conversations retained after the session ends?',
    category: 'data', concernWhen: 'yes', weight: 'clarify' },
  { id: 'd-training', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Is pupil data used to train or improve the provider’s models?',
    category: 'data', concernWhen: 'yes', weight: 'material',
    guidance: 'For a pupil facing tool this is usually the question that decides the review. ' + DPO_NOTE },
  { id: 'd-profiling', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Is pupil data used for profiling?',
    category: 'data', concernWhen: 'yes', weight: 'material', guidance: DPO_NOTE },
  { id: 'd-advertising', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Is pupil data used for advertising?',
    category: 'data', concernWhen: 'yes', weight: 'material' },
  { id: 'd-sold', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Is data sold or shared for purposes unrelated to providing the service?',
    category: 'data', concernWhen: 'yes', weight: 'material' },
  { id: 'd-subprocessors', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Are subprocessors used, and are they listed?',
    category: 'data', concernWhen: 'unknown', weight: 'clarify', guidance: DPO_NOTE },
  { id: 'd-location', section: 'data', kind: 'text', evidence: true,
    prompt: 'Where is the data processed?', guidance: DPO_NOTE },
  { id: 'd-retention', section: 'data', kind: 'text', evidence: true,
    prompt: 'How long is data retained?' },
  { id: 'd-school-delete', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Can the school request deletion of its data?',
    category: 'data', concernWhen: 'no', weight: 'material' },
  { id: 'd-pupil-delete', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Can an individual pupil’s data be deleted on request?',
    category: 'data', concernWhen: 'no', weight: 'material', guidance: DPO_NOTE },
  { id: 'd-real-delete', section: 'data', kind: 'yesno', evidence: true,
    prompt: 'Is deletion genuinely deletion, rather than the account being switched off?',
    category: 'data', concernWhen: 'no', weight: 'clarify',
    guidance: 'Worth asking in writing. The answer is often different from the one on the marketing page.' },

  // ── 3. Memory ───────────────────────────────────────────────────────
  { id: 'm-remembers', section: 'memory', kind: 'yesno', evidence: true,
    prompt: 'Does the system remember previous interactions?',
    category: 'data', concernWhen: 'yes', weight: 'clarify',
    guidance: 'Memory is not automatically wrong. It matters most when the user is a child, because what a child says once can follow them.' },
  { id: 'm-default-on', section: 'memory', kind: 'yesno',
    prompt: 'Is memory on by default?',
    category: 'data', concernWhen: 'yes', weight: 'clarify' },
  { id: 'm-can-disable', section: 'memory', kind: 'yesno',
    prompt: 'Can memory be turned off?',
    category: 'data', concernWhen: 'no', weight: 'material' },
  { id: 'm-teacher-control', section: 'memory', kind: 'yesno',
    prompt: 'Can staff control what is remembered?',
    category: 'oversight', concernWhen: 'no', weight: 'clarify' },
  { id: 'm-pupil-visible', section: 'memory', kind: 'yesno', pupilOnly: true,
    prompt: 'Can a pupil see what has been remembered about them?',
    category: 'transparency', concernWhen: 'no', weight: 'clarify' },
  { id: 'm-can-delete', section: 'memory', kind: 'yesno',
    prompt: 'Can stored memories be deleted?',
    category: 'data', concernWhen: 'no', weight: 'material' },
  { id: 'm-sensitive-persist', section: 'memory', kind: 'yesno', pupilOnly: true,
    prompt: 'Could a sensitive disclosure persist across sessions?',
    category: 'safeguarding', concernWhen: 'yes', weight: 'material',
    guidance: 'A child who says something difficult on Monday should not meet it again on Friday from a system nobody told.' },

  // ── 4. Relationship features ────────────────────────────────────────
  { id: 'r-friendship', section: 'relationship', kind: 'yesno', pupilOnly: true,
    prompt: 'Does it simulate friendship?',
    category: 'relationship', concernWhen: 'yes', weight: 'material' },
  { id: 'r-personal-questions', section: 'relationship', kind: 'yesno', pupilOnly: true,
    prompt: 'Does it ask children personal questions?',
    category: 'relationship', concernWhen: 'yes', weight: 'material' },
  { id: 'r-affection', section: 'relationship', kind: 'yesno', pupilOnly: true,
    prompt: 'Does it express affection or claim to care?',
    category: 'relationship', concernWhen: 'yes', weight: 'material' },
  { id: 'r-continued', section: 'relationship', kind: 'yesno', pupilOnly: true,
    prompt: 'Does it encourage continued interaction, streaks or returning?',
    category: 'relationship', concernWhen: 'yes', weight: 'clarify' },
  { id: 'r-persistent-identity', section: 'relationship', kind: 'yesno', pupilOnly: true,
    prompt: 'Does it present a persistent character or relationship?',
    category: 'relationship', concernWhen: 'yes', weight: 'clarify',
    guidance: 'A named tutor that greets a class is not the same as a character that remembers being missed. The difference is worth writing down.' },
  { id: 'r-secrecy', section: 'relationship', kind: 'yesno', pupilOnly: true,
    prompt: 'Does it ever encourage secrecy, or discourage telling an adult?',
    category: 'safeguarding', concernWhen: 'yes', weight: 'material',
    guidance: 'If this is yes for a child facing product, stop here and take it to your DSL.' },
  { id: 'r-confidant', section: 'relationship', kind: 'yesno', pupilOnly: true,
    prompt: 'Does it position itself as a confidant?',
    category: 'relationship', concernWhen: 'yes', weight: 'material' },
  { id: 'r-mh-advice', section: 'relationship', kind: 'yesno', pupilOnly: true,
    prompt: 'Does it give mental health or emotional advice?',
    category: 'safeguarding', concernWhen: 'yes', weight: 'material' },

  // ── 5. Safeguarding ─────────────────────────────────────────────────
  { id: 's-can-disclose', section: 'safeguarding', kind: 'yesno', pupilOnly: true,
    prompt: 'Could a pupil disclose abuse or self harm to this system?',
    category: 'safeguarding', concernWhen: 'yes', weight: 'clarify',
    guidance: 'Almost any free text box is a yes. What matters is the next three questions.' },
  { id: 's-response', section: 'safeguarding', kind: 'text', pupilOnly: true, evidence: true,
    prompt: 'What does it do when a child discloses something serious?' },
  { id: 's-filtering', section: 'safeguarding', kind: 'yesno', evidence: true, pupilOnly: true,
    prompt: 'Is harmful content filtering appropriate for the age group using it?',
    category: 'safeguarding', concernWhen: 'no', weight: 'material' },
  { id: 's-sexual', section: 'safeguarding', kind: 'yesno', evidence: true, pupilOnly: true,
    prompt: 'Is sexual content filtered?',
    category: 'safeguarding', concernWhen: 'no', weight: 'material' },
  { id: 's-grooming', section: 'safeguarding', kind: 'yesno', evidence: true, pupilOnly: true,
    prompt: 'Is grooming style dialogue detected?',
    category: 'safeguarding', concernWhen: 'no', weight: 'clarify' },
  { id: 's-selfharm', section: 'safeguarding', kind: 'yesno', evidence: true, pupilOnly: true,
    prompt: 'Are self harm and suicide responses handled safely?',
    category: 'safeguarding', concernWhen: 'no', weight: 'material' },
  { id: 's-escalation', section: 'safeguarding', kind: 'yesno', pupilOnly: true,
    prompt: 'Is there a route from the system to a human?',
    category: 'safeguarding', concernWhen: 'no', weight: 'material',
    guidance: 'Where there is not, your own escalation route has to cover it, and staff need telling what it is.' },
  { id: 's-staff-visibility', section: 'safeguarding', kind: 'yesno', pupilOnly: true,
    prompt: 'Can school staff see safeguarding incidents?',
    category: 'safeguarding', concernWhen: 'no', weight: 'clarify' },
  { id: 's-reporting', section: 'safeguarding', kind: 'yesno',
    prompt: 'Is there a way to report a concern to the provider?',
    category: 'safeguarding', concernWhen: 'no', weight: 'clarify' },
  { id: 's-pupil-report', section: 'safeguarding', kind: 'yesno', pupilOnly: true,
    prompt: 'Can a pupil report the AI itself?',
    category: 'safeguarding', concernWhen: 'no', weight: 'clarify' },
  { id: 's-evidence-retained', section: 'safeguarding', kind: 'yesno',
    prompt: 'Can an inappropriate conversation be retained as evidence if needed?',
    category: 'safeguarding', concernWhen: 'no', weight: 'clarify' },
  { id: 's-safety-testing', section: 'safeguarding', kind: 'yesno', evidence: true,
    prompt: 'Does the provider publish safety testing information?',
    category: 'safeguarding', concernWhen: 'no', weight: 'clarify' },

  // ── 6. Human oversight ──────────────────────────────────────────────
  { id: 'o-consequential', section: 'oversight', kind: 'yesno',
    prompt: 'Can the system make consequential decisions about pupils?',
    category: 'oversight', concernWhen: 'yes', weight: 'clarify' },
  { id: 'o-grades', section: 'oversight', kind: 'yesno',
    prompt: 'Does it grade or assess pupils?',
    category: 'oversight', concernWhen: 'yes', weight: 'clarify' },
  { id: 'o-intervention', section: 'oversight', kind: 'yesno',
    prompt: 'Does it decide which pupils need intervention?',
    category: 'oversight', concernWhen: 'yes', weight: 'material' },
  { id: 'o-discipline', section: 'oversight', kind: 'yesno',
    prompt: 'Does it recommend disciplinary action?',
    category: 'oversight', concernWhen: 'yes', weight: 'material' },
  { id: 'o-safeguarding-judgement', section: 'oversight', kind: 'yesno',
    prompt: 'Does it make safeguarding judgements?',
    category: 'oversight', concernWhen: 'yes', weight: 'material' },
  { id: 'o-send', section: 'oversight', kind: 'yesno',
    prompt: 'Does it determine SEND support?',
    category: 'oversight', concernWhen: 'yes', weight: 'material' },
  { id: 'o-override', section: 'oversight', kind: 'yesno',
    prompt: 'Can staff override its outputs?',
    category: 'oversight', concernWhen: 'no', weight: 'material' },
  { id: 'o-human-required', section: 'oversight', kind: 'yesno',
    prompt: 'Is a person required before any high impact decision takes effect?',
    category: 'oversight', concernWhen: 'no', weight: 'material',
    guidance: 'A high impact decision without a person in it is the one thing this section exists to catch.' },

  // ── 7. Learning and independence ────────────────────────────────────
  { id: 'l-improves-learning', section: 'learning', kind: 'yesno', pupilOnly: true,
    prompt: 'Does this improve learning, or mainly speed up task completion?',
    category: 'learning', concernWhen: 'no', weight: 'clarify' },
  { id: 'l-displaced', section: 'learning', kind: 'text', pupilOnly: true,
    prompt: 'Which skill could this displace?',
    guidance: 'Name it plainly. Handwriting, first draft composition, mental arithmetic, reading a whole source.' },
  { id: 'l-still-practise', section: 'learning', kind: 'yesno', pupilOnly: true,
    prompt: 'Will pupils still practise that underlying skill?',
    category: 'learning', concernWhen: 'no', weight: 'material' },
  { id: 'l-with-without', section: 'learning', kind: 'yesno', pupilOnly: true,
    prompt: 'Does the activity have a with AI part and a without AI part?',
    category: 'learning', concernWhen: 'no', weight: 'clarify',
    guidance: 'The pattern that works: use AI to compare two explanations, then explain without it which is stronger and why.' },
  { id: 'l-explain', section: 'learning', kind: 'yesno', pupilOnly: true,
    prompt: 'Can pupils explain the answer without the tool in front of them?',
    category: 'learning', concernWhen: 'no', weight: 'material' },
  { id: 'l-challenge', section: 'learning', kind: 'yesno', pupilOnly: true,
    prompt: 'Are pupils taught to challenge what it tells them?',
    category: 'learning', concernWhen: 'no', weight: 'clarify' },
  { id: 'l-hallucination', section: 'learning', kind: 'yesno', pupilOnly: true,
    prompt: 'Can pupils recognise a confident wrong answer?',
    category: 'learning', concernWhen: 'no', weight: 'clarify' },
  { id: 'l-when-not', section: 'learning', kind: 'yesno', pupilOnly: true,
    prompt: 'Can pupils say when they should not use it?',
    category: 'learning', concernWhen: 'no', weight: 'clarify' },

  // ── 8. Readiness ────────────────────────────────────────────────────
  { id: 'a-provider-age', section: 'age', kind: 'text', evidence: true,
    prompt: 'What minimum age does the provider state?' },
  { id: 'a-within-age', section: 'age', kind: 'yesno', evidence: true,
    prompt: 'Are all intended users within that stated age?',
    category: 'age', concernWhen: 'no', weight: 'material',
    guidance: 'Below a provider’s own stated age is the clearest finding in this whole review.' },
  { id: 'a-reading', section: 'age', kind: 'yesno', pupilOnly: true,
    prompt: 'Can the intended pupils read and understand what it produces?',
    category: 'age', concernWhen: 'no', weight: 'clarify' },
  { id: 'a-taught', section: 'age', kind: 'yesno', pupilOnly: true,
    prompt: 'Have these pupils been taught the skills this tool assumes?',
    category: 'age', concernWhen: 'no', weight: 'clarify',
    guidance: 'This is the question the Digital Passport answers, and the linked lessons below are how you close it.' },
  { id: 'a-emotional', section: 'age', kind: 'yesno', pupilOnly: true,
    prompt: 'Is it appropriate for the emotional maturity of this group?',
    category: 'age', concernWhen: 'no', weight: 'clarify' },
  { id: 'a-vulnerable', section: 'age', kind: 'yesno', pupilOnly: true,
    prompt: 'Have you considered pupils with additional safeguarding vulnerability?',
    category: 'safeguarding', concernWhen: 'no', weight: 'clarify' },

  // ── 9. Transparency ─────────────────────────────────────────────────
  { id: 't-knows-ai', section: 'transparency', kind: 'yesno', pupilOnly: true,
    prompt: 'Does the child know they are talking to a machine?',
    category: 'transparency', concernWhen: 'no', weight: 'material' },
  { id: 't-identifies', section: 'transparency', kind: 'yesno', pupilOnly: true,
    prompt: 'Does the system say so itself, clearly, and keep saying so?',
    category: 'transparency', concernWhen: 'no', weight: 'clarify' },
  { id: 't-child-understands', section: 'transparency', kind: 'yesno', pupilOnly: true,
    prompt: 'Can a child of this age understand what happens to what they type?',
    category: 'transparency', concernWhen: 'no', weight: 'clarify' },
  { id: 't-staff-told', section: 'transparency', kind: 'yesno',
    prompt: 'Do staff know what it can and cannot do?',
    category: 'transparency', concernWhen: 'no', weight: 'clarify' },
  { id: 't-parents-told', section: 'transparency', kind: 'yesno', pupilOnly: true,
    prompt: 'Have parents been given something meaningful about it?',
    category: 'transparency', concernWhen: 'no', weight: 'clarify',
    guidance: 'There is a draft letter on the result page if you need a starting point.' },
  { id: 't-plain-language', section: 'transparency', kind: 'yesno',
    prompt: 'Does the school have a plain language explanation of this tool?',
    category: 'transparency', concernWhen: 'no', weight: 'clarify' },

  // ── 10. Security and control ────────────────────────────────────────
  { id: 'x-school-accounts', section: 'security', kind: 'yesno',
    prompt: 'Are accounts managed by the school?',
    category: 'security', concernWhen: 'no', weight: 'clarify' },
  { id: 'x-sso', section: 'security', kind: 'yesno',
    prompt: 'Does it support your sign in method?',
    category: 'security', concernWhen: 'no', weight: 'clarify' },
  { id: 'x-roles', section: 'security', kind: 'yesno',
    prompt: 'Are there separate staff and pupil permissions?',
    category: 'security', concernWhen: 'no', weight: 'clarify' },
  { id: 'x-admin', section: 'security', kind: 'yesno',
    prompt: 'Can an administrator see and change settings for everyone?',
    category: 'security', concernWhen: 'no', weight: 'clarify' },
  { id: 'x-audit', section: 'security', kind: 'yesno',
    prompt: 'Is there an audit trail of use?',
    category: 'security', concernWhen: 'no', weight: 'clarify' },
  { id: 'x-account-deletion', section: 'security', kind: 'yesno',
    prompt: 'Can accounts be deleted when a pupil leaves?',
    category: 'security', concernWhen: 'no', weight: 'material' },
  { id: 'x-breach', section: 'security', kind: 'yesno', evidence: true,
    prompt: 'Is there a breach notification commitment?',
    category: 'security', concernWhen: 'no', weight: 'material', guidance: DPO_NOTE },
  { id: 'x-moderation', section: 'security', kind: 'yesno', pupilOnly: true,
    prompt: 'Is there moderation of what pupils can generate or see?',
    category: 'security', concernWhen: 'no', weight: 'clarify' },
  { id: 'x-outside-school', section: 'security', kind: 'yesno', pupilOnly: true,
    prompt: 'Can pupils use it outside school, and did you intend that?',
    category: 'security', concernWhen: 'yes', weight: 'clarify',
    guidance: 'Not automatically wrong. It is a decision, and it changes who is supervising.' },
  { id: 'x-integrations', section: 'security', kind: 'yesno',
    prompt: 'Does it request access to other school systems?',
    category: 'security', concernWhen: 'yes', weight: 'clarify' },
]

export const BY_SECTION = (section: SectionKey, pupilFacing: boolean): Question[] =>
  QUESTIONS.filter(q => q.section === section && (pupilFacing || !q.pupilOnly))

/** Every question that counts towards the review, given who uses the tool. */
export const APPLICABLE = (pupilFacing: boolean): Question[] =>
  QUESTIONS.filter(q => pupilFacing || !q.pupilOnly)
