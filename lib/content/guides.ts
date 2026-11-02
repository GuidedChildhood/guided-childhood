import { DEVICE_ISSUES, type DeviceIssue } from './device-issues'

// THE GUIDES: one public page per question a parent actually types.
//
// Justin, 2 November 2026: "Yes on guides". The plan, and the line on what is
// free, is plans/2026-11-02-guides-plan.md. The short version:
//
//   Free on the page: the problem, why it keeps happening, what works, how to
//   start earlier, and the source. Named, not shown: the word for word scripts,
//   which are paid (Justin, 11 August 2026) and stay in the scripts table.
//
// Each guide stands on a DEVICE_ISSUES entry, so the mechanism, the response,
// the source and the script titles are written once, in the place DiGi and the
// dashboard already read them. A guide adds only what search needs: the
// question in the parent's words, a short opening, and the ages it is for.
//
// Order after these three comes from the gum search report (npm run seo --
// report): a striking distance query with a proof path here becomes a guide.

export type Guide = {
  /** The URL: /guides/<slug>. Lower case words joined by hyphens. */
  slug: string
  /** The H1 and the page title: the question as a parent would type it. */
  question: string
  /** The meta description, under 160 characters. */
  description: string
  /** Who it is for, shown as the eyebrow. */
  ages: string
  /** Two or three sentences in the parent's words, every number sourced. */
  intro: string
  /** The DEVICE_ISSUES key the rest of the page is built from. */
  issueKey: string
  /** When the guide was last checked, for the page and the structured data. */
  updated: string
}

export const GUIDES: Guide[] = [
  {
    slug: 'screen-time-arguments',
    question: 'How do I stop the screen time argument every night?',
    description: 'Why the five more minutes fight comes back every evening, and the change that ends it: agree the structure once, then let the timer be the referee.',
    ages: 'Ages 8 to 13',
    intro: 'If every evening ends in the same row about five more minutes, you are not doing it wrong and you are not on your own. Ofcom found a third of parents find it hard to control their child\'s screen time. The fight is usually not about the minutes at all.',
    issueKey: 'negotiation',
    updated: '2026-11-02',
  },
  {
    slug: 'when-should-my-child-get-a-phone',
    question: 'When should my child get their first phone?',
    description: 'Most UK children get a phone at ten or eleven. What to decide before the box is opened, so the phone lands on a plan rather than an argument.',
    ages: 'Ages 9 to 12',
    intro: 'In the UK, phone ownership jumps from 56 percent at ten to 83 percent at eleven, the same year as the move to secondary school. So when your child says everyone in the class has one, they are close to right. The question worth your time is what the phone arrives into.',
    issueKey: 'first_phone',
    updated: '2026-11-02',
  },
  {
    slug: 'roblox-robux-spending',
    question: 'How do I stop my child spending money on Roblox?',
    description: 'Robux, skins and loot boxes are built to ask your child, not you. A simple monthly plan that stops the surprise on your card statement.',
    ages: 'Ages 8 to 13',
    intro: 'Robux, V Bucks, skins and loot boxes are designed to ask your child, never you. Ofcom found 53 percent of 8 to 17 year old gamers spend money in games. The answer is not a lock, it is a plan your child agreed to before the first ask.',
    issueKey: 'in_game_spending',
    updated: '2026-11-02',
  },
]

export type GuideWithIssue = Guide & { issue: DeviceIssue }

/** A guide joined to its issue. Throws on a missing key, so a typo fails the build. */
export function withIssue(guide: Guide): GuideWithIssue {
  const issue = DEVICE_ISSUES.find(i => i.key === guide.issueKey)
  if (!issue) throw new Error(`Guide ${guide.slug} names issue ${guide.issueKey}, which is not in DEVICE_ISSUES`)
  return { ...guide, issue }
}

export function guideBySlug(slug: string): GuideWithIssue | null {
  const guide = GUIDES.find(g => g.slug === slug)
  return guide ? withIssue(guide) : null
}

/** The stage check hook, word for word as THE-STORY.md section 9 has it. */
export const STAGE_CHECK_HOOK = 'What stage is your child? Three questions, no sign up.'
