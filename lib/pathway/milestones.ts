// THE NEXT AGE MILESTONE ON THE PASSPORT (plans/2026-10-16-passport-journey-plan.md, PR 4).
//
// Justin, 15 October 2026: the passport should "make the child more
// protected as they get nearer the age of social media". So the passport
// names the next real line a family is walking toward, in one sentence, with
// the page that prepares for it: the first phone around Years 5 and 6, 13
// (most apps' minimum age) and 16 (the UK line for social media). The
// birthday drives these, not the school year: the law and the apps count
// birthdays.
//
// Never allow or deny, never "banned", never a workaround, and only sourced
// figures: the phone line is Ofcom's Children and Parents report 2026 ("from
// 56% of 10-year-olds to more than eight in ten (83%) of 11-year-olds"),
// recorded in content/packs/2026-10-09-digi-shorts/research/02-parent-voice-
// mumsnet-and-uk-data.md, row 4. The 13 and 16 lines follow the three states
// of shared/social-media-law.ts, so the copy is true whichever way the law
// lands. Pure, so the guard runs it under every state.

import type { SocialMediaLaw } from '@gc/shared/social-media-law'

export type Milestone = {
  key: 'phone' | '13' | '16'
  /** The pill: "Phone", "13", "16". */
  badge: string
  /** "13 in about 8 months". */
  title: string
  line: string
  link: { label: string; href: string } | null
}

const LINE_13: Record<SocialMediaLaw, string> = {
  none: 'Most apps say 13. The skills come first, on this page.',
  partial_ban: 'Most apps say 13. The UK is moving social media to 16.',
  full_ban_u16: 'Most messaging apps say 13. Group chats and games are where the practice starts.',
}
const LINE_16: Record<SocialMediaLaw, string> = {
  none: 'The Making choices page plans the first week.',
  partial_ban: 'The UK line for social media, expected from spring 2027 once the rules are made.',
  full_ban_u16: 'The UK line for social media. The Making choices page plans the first week.',
}

/** "in about 8 months", "in about 2 years". */
export function inAbout(monthsLeft: number): string {
  if (monthsLeft <= 1) return 'this month'
  if (monthsLeft < 18) return `in about ${monthsLeft} months`
  const years = Math.round(monthsLeft / 12)
  return `in about ${years} year${years === 1 ? '' : 's'}`
}

function monthsUntil(dob: Date, age: number, now: Date): number {
  const at = new Date(Date.UTC(dob.getUTCFullYear() + age, dob.getUTCMonth(), dob.getUTCDate()))
  return Math.ceil((at.getTime() - now.getTime()) / (30.44 * 86400000))
}

export function nextMilestone(args: {
  dob: string | null | undefined
  schoolYear: number | null
  law: SocialMediaLaw
  childParam?: string | null
  now?: Date
}): Milestone | null {
  const now = args.now ?? new Date()
  const dob = args.dob ? new Date(args.dob) : null
  if (!dob || Number.isNaN(dob.getTime())) return null
  const q = args.childParam ? `?child=${encodeURIComponent(args.childParam)}` : ''
  const to13 = monthsUntil(dob, 13, now)
  const to16 = monthsUntil(dob, 16, now)

  if (args.schoolYear !== null && args.schoolYear >= 5 && args.schoolYear <= 6) {
    return {
      key: 'phone', badge: 'Phone', title: 'The first phone, around now',
      line: '8 in 10 children have their own phone by 11 (Ofcom, 2026). Talk before secondary school.',
      link: { label: 'How to set it up, our way', href: `/dashboard/phone-setup${q}` },
    }
  }
  if (to13 > 0 && to13 <= 36) {
    return { key: '13', badge: '13', title: `13 ${inAbout(to13)}`, line: LINE_13[args.law], link: null }
  }
  if (to13 <= 0 && to16 > 0) {
    return { key: '16', badge: '16', title: `16 ${inAbout(to16)}`, line: LINE_16[args.law], link: null }
  }
  return null
}
