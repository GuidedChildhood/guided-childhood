import type { MethodId } from '@/components/starter/MethodIcon'
import { CHALLENGE_TO_CATEGORY } from '@/lib/content/challenge-map'

// What we can actually point at, counted rather than claimed.
//
// ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
//
// Justin, 9 September 2026, on the reveal at the end of the starter quiz:
// "though we redesigned and simplify this page with the problems and what we
// do to fix?" The page explained how the platform works and never named the
// problem a parent walked in with, or what we do about it.
//
// The moment you put "what we do about it" on a page you are making claims,
// and this is the page immediately before we ask for money, so every number
// here is counted, not estimated. The marketing page has been wrong about this
// before in the direction that undersells (160 scripts and 100 lessons, when
// there were 335 and 147), and being wrong in the generous direction is worse.
//
// ── HOW TO CHANGE A NUMBER ──────────────────────────────────────────────────
//
// Do not edit one from memory. Re-run the queries in the comments below
// against the live database and move the whole block at once, with the date.
//
//   select category, count(*) from scripts group by category;
//   select count(*) from scripts;
//   select count(*) from scripts where is_free;
//   select category, count(*) from lessons group by category;
//
// Counted 9 September 2026 on project zgkdfiwtnzqmtfgfsxzo.

/** Scripts per live category. Keys are the eight values migration 151 left. */
export const SCRIPTS_BY_CATEGORY: Record<string, number> = {
  'mood-confidence': 62,
  'family-rules': 47,
  'everyday-routines': 43,
  'social-media': 43,
  'screen-time': 42,
  'staying-safe': 40,
  'school-and-ai': 33,
  'gaming': 25,
}

export const SCRIPTS_TOTAL = 335
export const SCRIPTS_FREE = 90
export const LESSONS_TOTAL = 147
/** ai_safety 10, chatbots and ai 2, deepfakes and ai 1. */
export const AI_LESSONS = 13

/** How many scripts sit behind one worry, through the category it maps to. */
export function scriptsForWorry(worryId: string): number {
  const category = CHALLENGE_TO_CATEGORY[worryId]
  return category ? SCRIPTS_BY_CATEGORY[category] ?? 0 : 0
}

export type Answer = {
  /** The question underneath the worry, in the words a parent asks it. */
  question: string
  /** What we do about it. Two sentences at most: this is read on a phone. */
  answer: string
  /** Named things in the product, not adjectives. The script count is added. */
  proof: string[]
  /** Which parts of the product pick this worry up. Drawn on the card as the
   *  method row, and the reason the long mechanism paragraph could go. */
  methods: MethodId[]
}

// ── THE ANSWER TO EACH WORRY ────────────────────────────────────────────────
//
// One entry per id in lib/onboarding/worries. The research behind the wording
// is in plans/2026-09-06-first-page-plan.md and the ProblemMap artboard on the
// design canvas; the statistics from that research are deliberately NOT here,
// because they have not been through the citation pass and an unverified
// percentage on the page before the price is the one thing we cannot risk.
//
// The rule for the answer column: say the mechanism, not the benefit. "A
// warning that lands and an ending they can predict" is a thing we built. "We
// help with gaming" is a thing anybody can type.
// ── SAY THE METHOD, NOT AN EXAMPLE ──────────────────────────────────────────
//
// Justin, 9 September 2026: "this is still offering examples and becomes long
// to read. We just need to acknowledge the problem and say how we help solve
// it via scripts, moments, daily check in etc. The METHOD not examples."
//
// So `answer` is now ONE line naming what actually happens, and `methods` is
// the list of parts that pick the worry up, drawn on the card instead of
// described. The old answers ran to forty words each; three ticked worries
// meant a wall of prose on the screen immediately before the price.
//
// The rule that survives from before, and is the reason these are not
// marketing lines: say the mechanism, not the benefit. "A warning that lands
// and an ending they can predict" is a thing we built. "We help with gaming"
// is a thing anybody can type.
export const ANSWERS: Record<string, Answer> = {
  wont_put_down: {
    question: 'How do I stop policing it without giving up?',
    answer: 'Time that is theirs without asking, more of it earned through real jobs, and windows no stars can buy.',
    proof: ['The star bank and jobs', 'Protected windows'],
    methods: ['balance','script','kidapp','checkin'],
  },
  bedtime_screens: {
    question: 'How do I get the screens out of the bedroom without a war?',
    answer: 'One rule you set once, a wind down the day expects, and the words for the night they push back.',
    proof: ['The bedroom rule', 'Wind down in the daily path'],
    methods: ['script','balance','checkin','digi'],
  },
  mood_after_screens: {
    question: 'Is it the screens, or is it them?',
    answer: 'Ten seconds a day turns a feeling into a line you can actually read over weeks.',
    proof: ['The daily check in', 'Your worry rated over time'],
    methods: ['checkin','moment','digi','passport'],
  },
  controller_fights: {
    question: 'How do I get them off it without a meltdown?',
    answer: 'An ending they can see coming, and the next session paid for honestly rather than argued for.',
    proof: ['Timer and warning nudges', 'Jobs that buy game time'],
    methods: ['balance','script','kidapp','lesson'],
  },
  morning_tv: {
    question: 'How do we get out of the house without the screen?',
    answer: 'The morning gets a shape the night before, so nothing has to be decided at half seven.',
    proof: ['The morning routine', 'Five a day in the child app'],
    methods: ['checkin','script','balance','moment'],
  },
  asking_for_phone: {
    question: 'What age, and how would I know they are ready?',
    answer: 'A readiness answer built from what they can already do, not from what their friends have.',
    proof: ['The readiness ladder', 'Device setting guides'],
    methods: ['digi','lesson','script','passport'],
  },
  social_media: {
    question: 'When do I let them on, and what do I do until then?',
    answer: 'They learn the feed before they meet it, and you get the words for the day they ask.',
    proof: ['Stage 4 lessons', 'Ready for the 2027 law'],
    methods: ['lesson','script','kidapp','digi'],
  },
  ai_chatbots: {
    question: 'How do I make their AI use safe, and get them ready for it?',
    answer: 'Lessons on what these things are and are not, and a guide you can ask the moment it comes up.',
    proof: [`${AI_LESSONS} AI lessons`, 'The AI readiness thread'],
    methods: ['lesson','digi','script','moment'],
  },
  seen_something: {
    question: 'What do I switch on, and is it even enough?',
    answer: 'A calm first hour, the words that keep them telling you, and a plan for the week after.',
    proof: ['Setting checklists per screen', 'What to say the night it happens'],
    methods: ['script','digi','moment','checkin'],
  },
}
