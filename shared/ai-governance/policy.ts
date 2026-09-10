// WORDING A SCHOOL CAN ACTUALLY USE, BUILT FROM WHAT THEY ANSWERED.
//
// Two outputs: paragraphs for the school's own AI or online safety policy, and
// a letter to parents. Both follow the pattern /hub/policy already set, which
// is text a school pastes and adapts rather than a document we pretend to own.
//
// THREE RULES.
//
// 1. Nothing here is legal advice, and where a professional is needed the text
//    names them rather than implying we have decided.
// 2. Nothing is generated about a product the school did not tell us. Every
//    sentence below traces to an answer or to the school's own decision.
// 3. Nothing overwrites. These are suggestions shown next to what the school
//    already has, for a person to accept.

import type { Review } from './types'
import { STATUS_LABEL } from './rating'

const yes = (r: Review, id: string) => r.answers[id]?.value === 'yes'
const no = (r: Review, id: string) => r.answers[id]?.value === 'no'

export type PolicyClause = { heading: string; body: string; because: string }

export function policyClauses(review: Review): PolicyClause[] {
  const name = review.product || 'this tool'
  const out: PolicyClause[] = []

  out.push({
    heading: 'Acceptable use',
    body: `${name} is approved for ${review.yearGroups.length ? review.yearGroups.join(', ') : 'the year groups named in the review record'}` +
      `${review.facing === 'pupil' ? ' and may be used by pupils in supervised lessons' : review.facing === 'teacher' ? ' for staff use only, and is not to be given to pupils' : ' for administrative use only'}.` +
      ` It is used for ${review.purpose || 'the purpose recorded in the review'}. Any other use needs a new review.`,
    because: 'Every approval is for a named purpose and a named group, so a tool cannot quietly spread.',
  })

  if (review.facing === 'pupil') {
    out.push({
      heading: 'What pupils put into it',
      body: yes(review, 'd-prompts') || yes(review, 'd-training')
        ? `What pupils type into ${name} is stored by the provider. Pupils are taught, before they use it, not to enter their own or anyone else's personal information, and staff supervise its use.`
        : `Pupils are taught, before they use it, not to enter their own or anyone else's personal information into ${name}, and staff supervise its use.`,
      because: 'The rule is the same either way. Where the provider stores prompts, the rule matters more.',
    })
  }

  out.push({
    heading: 'Staff responsibility',
    body: `The member of staff responsible for ${name} is ${review.owner || 'named in the review record'}.` +
      ` Staff check what it produces before it is used with pupils, and are accountable for that check.` +
      (no(review, 'o-override') ? ' Where its output cannot be overridden, it is not used for anything that affects a pupil.' : ''),
    because: 'A named owner is what makes a review reviewable a year later.',
  })

  out.push({
    heading: 'Human oversight',
    body: 'No decision that affects a pupil is made by a system on its own. Grading, intervention, SEND support, ' +
      'behaviour and safeguarding judgements are made by a person, who may use a tool to inform them and remains responsible for the decision.',
    because: 'The one line that has to be true whatever the product does.',
  })

  out.push({
    heading: 'Safeguarding',
    body: (review.facing === 'pupil'
      ? `If a pupil discloses something concerning while using ${name}, staff follow the school's normal safeguarding procedure. `
      : '') +
      (no(review, 's-escalation')
        ? `${name} has no route from the system to a person, so staff are told that anything a pupil raises through it will not reach anyone unless a member of staff sees it.`
        : `Where ${name} can escalate to a person, that route is recorded here and staff know it does not replace our own.`),
    because: 'A product with no escalation is not disqualified. It is a thing staff have to be told.',
  })

  if (yes(review, 'r-friendship') || yes(review, 'r-affection') || yes(review, 'r-confidant')) {
    out.push({
      heading: 'Products that behave like a friend',
      body: `${name} uses friendship or companionship features. Where a product speaks to children as a friend, ` +
        'we teach the difference explicitly before it is used, we do not use it for pastoral or emotional support, ' +
        'and we do not present it to children as someone who cares about them.',
      because: 'Raised because the review recorded companion behaviour. This clause disappears if that changes.',
    })
  }

  out.push({
    heading: 'Telling parents',
    body: `Parents are told which AI tools their children use, what those tools do with what a child types, and who to ask. ` +
      `A plain language note about ${name} is available from the school office and on the school website.`,
    because: 'Transparency is a policy commitment, not a one off letter.',
  })

  out.push({
    heading: 'Review',
    body: `${name} was reviewed on ${review.reviewedOn || 'the date in the review record'} and is due for review again on ` +
      `${review.nextReviewOn || 'the date in the review record'}. It is reviewed sooner if the provider changes what it does with data, ` +
      'adds memory or companion features, or changes its minimum age.',
    because: 'AI products change faster than annual policy cycles, so the trigger is a change, not just a date.',
  })

  return out
}

export function parentLetter(review: Review): string {
  const name = review.product || 'a new tool'
  const provider = review.provider ? ` from ${review.provider}` : ''
  const groups = review.yearGroups.length ? review.yearGroups.join(', ') : 'some year groups'

  const lines: string[] = []
  lines.push(`Dear parents and carers,`)
  lines.push('')
  lines.push(
    `We are starting to use ${name}${provider} with ${groups}. It is a tool that uses artificial intelligence, ` +
    `and we wanted to tell you what it does and what we have checked before your child uses it.`,
  )
  lines.push('')
  lines.push(`What it is for. ${review.purpose || 'The purpose is recorded in our review of this tool.'}`)
  lines.push('')

  if (yes(review, 'd-prompts') || yes(review, 'd-conversations')) {
    lines.push(
      'What your child types into it is stored by the company that makes it. We teach children, before they use it, ' +
      'not to put their own or anyone else\'s personal information into it, and an adult is with them when they do.',
    )
  } else {
    lines.push(
      'We teach children, before they use it, not to put their own or anyone else\'s personal information into it, ' +
      'and an adult is with them when they do.',
    )
  }
  lines.push('')

  if (yes(review, 'd-training')) {
    lines.push(
      'We have asked the company whether what pupils type is used to improve their systems, and their answer is ' +
      'recorded in our review. If you would like to see it, please ask.',
    )
    lines.push('')
  }

  lines.push(
    'It is a machine, not a person, and we teach children that plainly. It can be confidently wrong, so we teach them ' +
    'to check what it tells them, and every task has a part they do without it.',
  )
  lines.push('')
  lines.push(
    'If you would rather your child did not use it, or you have any questions at all, please contact ' +
    `${review.owner || 'the school office'} and we will talk it through.`,
  )
  lines.push('')
  lines.push('With best wishes,')

  return lines.join('\n')
}

/** The one line summary a governor or an inspector reads first. */
export function decisionLine(review: Review): string {
  if (!review.decision) return 'No decision recorded yet.'
  const when = review.reviewedOn ? ` on ${review.reviewedOn}` : ''
  const cond = review.decision === 'approve-with-conditions' && review.conditions
    ? ` Conditions: ${review.conditions}`
    : ''
  return `${STATUS_LABEL[review.decision]}${when}.${cond}`
}
