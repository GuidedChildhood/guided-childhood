import { yearGroupFromDob } from '@/lib/learning/calendar'

// Year 6 into Year 7, and the first phone.
//
// This is the highest value moment this product has, and until the curriculum
// data landed we had no reliable way to know a family was in it. A birthday
// gives the year group, and Year 6 from May onwards is, for most families in
// England, the exact window where the phone conversation actually happens.
//
// ── Why this window and not an age ───────────────────────────────────────────
//
// Because the trigger is not the child, it is the school. In Year 7 they walk
// or bus to school on their own, the year group organises itself in a WhatsApp
// group nobody invited the parents to, and the friendship group scatters across
// three secondaries. Every one of those is a reason for a phone that did not
// exist in June of Year 6, and they all arrive on the same September morning.
// Two children the same age, one in Year 6 and one in Year 7, are in completely
// different situations, and age alone cannot tell them apart. The school year
// can.
//
// ── What this must never do ──────────────────────────────────────────────────
//
// Never say give them a phone. Never say do not. That is the first
// non negotiable and it matters most exactly here, where a parent is most
// looking for someone to make the decision for them. What we have that nobody
// else does is the order: the things worth settling BEFORE the handset, which
// is the part almost every family gets backwards and then cannot undo.
//
// The steps are a fixed list in code rather than database rows, the same shape
// as lib/setup/steps.ts. They are a pathway, not scripts. The words DiGi hands
// a parent to say still live in the scripts table where the rule puts them.

export type TransitionPhase =
  // Year 6, from May. SATs are done or nearly, and secondary is real now.
  | 'approaching'
  // Year 6 summer term end and the holidays. This is when the phone is bought.
  | 'imminent'
  // Year 7 has started. The phone is usually already in the house.
  | 'landed'

export type TransitionStep = {
  key: string
  title: string
  // Why this one comes here rather than later.
  why: string
  what: string
  href?: string
  cta?: string
}

// In order, and the order is the whole point. Every step before the handset is
// a step that cannot be taken afterwards without it feeling like a punishment.
export const TRANSITION_STEPS: TransitionStep[] = [
  {
    key: 'what_changes',
    title: 'Know what actually changes in September',
    why: 'Most of the pressure for a phone is not about the phone. It is about six things that all change at once, and naming them turns one big argument into six smaller decisions.',
    what: 'They travel without you. The year group organises itself in group chats. Their friends split across different schools. Clubs and matches finish at different times. Nobody rings the house phone any more. And for the first time, being the only one without is a real social cost rather than a line in an argument.',
  },
  {
    key: 'what_for',
    title: 'Decide what the phone is for, before you shop',
    why: 'A phone bought for getting home safely and a phone bought for group chats are different phones with different rules. Families who skip this step end up arguing about the rules for a device whose job was never agreed.',
    what: 'Write down the one or two things it genuinely needs to do in September. Getting home is a different job from staying in touch with primary friends, and both are different from social media. You are allowed to say yes to one and not yet to the others.',
    href: '/dashboard/digi',
    cta: 'Talk it through with DiGi',
  },
  {
    key: 'agreement_first',
    title: 'Write the agreement before the handset arrives',
    why: 'This is the step that cannot be taken later. Rules added to a phone a child already owns are experienced as something being taken away. The same rules agreed beforehand are just how it works.',
    what: 'Bedroom, bedtime, what happens if something upsetting turns up, and what you will do if a rule gets broken. Signed by everyone, on the fridge. Ten minutes now saves a year of it.',
    href: '/dashboard/agreement',
    cta: 'Build the agreement',
  },
  {
    key: 'staged_start',
    title: 'Start narrow and widen on purpose',
    why: 'A phone that arrives fully loaded has nowhere left to go, so every later conversation can only ever be a restriction. Starting narrow means every step after it is something earned.',
    what: 'Calls and messages first. Add each app deliberately, one at a time, with a reason. What they can reach in September does not have to be what they can reach at Christmas, and saying so out loud makes the widening feel like growing up rather than wearing you down.',
    href: '/dashboard/road',
    cta: 'See the stages',
  },
  {
    key: 'first_term',
    title: 'Plan the first half term, then look again',
    why: 'September is not a fair test of anything. Everyone is tired, the routine is new, and the first weeks always look worse than the term turns out to be.',
    what: 'Agree now that you will sit down together at October half term and change whatever is not working. A review date stops the first bad week from becoming a permanent rule, and it gives your child a reason to make it work.',
  },
]

export type TransitionState = {
  phase: TransitionPhase
  yearGroup: number
  // The line Home leads with, matched to how close September is.
  headline: string
  line: string
}

// Where this child is in the transition, or null when they are not in it.
//
// Null is the common answer and that is correct: this is one window in one
// school year, and a card that turns up for a Year 3 family is noise. No
// birthday means null too, because we will not guess this one either.
export function transitionFor(dob: string | null | undefined, on = new Date()): TransitionState | null {
  const yearGroup = yearGroupFromDob(dob, on)
  if (yearGroup === null) return null
  const month = on.getUTCMonth() + 1

  // Year 6, May and June. SATs are done or in hand and secondary is suddenly
  // real, but there is still time to do this in order rather than in a rush.
  if (yearGroup === 6 && (month === 5 || month === 6)) {
    return {
      phase: 'approaching', yearGroup,
      headline: 'September is the phone conversation',
      line: 'Most families settle this over the summer, and the ones it goes well for settle the rules first. There is time to do it in the right order.',
    }
  }

  // Year 6 July and August. The handset is usually bought in these weeks.
  if (yearGroup === 6 && (month === 7 || month === 8)) {
    return {
      phase: 'imminent', yearGroup,
      headline: 'The summer before secondary',
      line: 'This is the fortnight most first phones get bought. Anything you agree before it arrives is just how it works. Anything added after feels like something being taken away.',
    }
  }

  // Year 7, September to December. Often the phone is already here, so the
  // useful thing is no longer preparation, it is the first review.
  if (yearGroup === 7 && month >= 9 && month <= 12) {
    return {
      phase: 'landed', yearGroup,
      headline: 'The first term with a phone',
      line: 'Whatever you started with, the first half term tells you what actually needed to be different. This is the moment to change it together rather than let it drift.',
    }
  }

  return null
}

// The question this puts in a parent's head, ready to hand to DiGi.
export function transitionAsk(state: TransitionState): string {
  if (state.phase === 'landed') return 'My child started secondary with a phone. What should we change after the first half term?'
  if (state.phase === 'imminent') return 'We are about to get my child their first phone before secondary. What do we agree before it arrives?'
  return 'My child starts secondary in September. How do we handle the first phone?'
}
