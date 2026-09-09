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
export const ANSWERS: Record<string, Answer> = {
  wont_put_down: {
    question: 'How do I stop policing it without giving up?',
    answer: 'A slice of time that is theirs without asking, more earned through real jobs at a rate you set, and windows no stars can buy. You set the shape once, the app holds it every day.',
    proof: ['The star bank and jobs', 'Protected windows'],
  },
  bedtime_screens: {
    question: 'How do I get the screens out of the bedroom without a war?',
    answer: 'The one rule worth having, and the words for the night they push back. Wind down time is built into the day so the ending is expected rather than announced.',
    proof: ['The bedroom rule', 'Wind down in the daily path'],
  },
  mood_after_screens: {
    question: 'Is it the screens, or is it them?',
    answer: 'You rate it in ten seconds a day and we show you the line over weeks, so you are answering that from what happened rather than from last night. DiGi reads the same scores you do.',
    proof: ['The daily check in', 'Your worry rated over time'],
  },
  controller_fights: {
    question: 'How do I get them off it without a meltdown?',
    answer: 'Warnings that land, an ending they can see coming, and lessons on why the game wants one more go. Then jobs that pay for the next session honestly.',
    proof: ['Timer and warning nudges', 'Jobs that buy game time'],
  },
  morning_tv: {
    question: 'How do we get out of the house without the screen?',
    answer: 'The morning is its own routine in the child app, with the jobs that have to happen first and a reward that is not more screen. The five a day is done before school.',
    proof: ['The morning routine', 'Five a day in the child app'],
  },
  asking_for_phone: {
    question: 'What age, and how would I know they are ready?',
    answer: 'No magic number. A readiness ladder for your own child, the settings for the day it arrives, and the words for the day you say not yet.',
    proof: ['The readiness ladder', 'Device setting guides'],
  },
  social_media: {
    question: 'When do I let them on, and what do I do until then?',
    answer: 'A deadline is not a plan. Stage 4 teaches the feed, the pressure and the exit, and a switch in the product moves the content to whatever the law finally does.',
    proof: ['Stage 4 lessons', 'Ready for the 2027 law'],
  },
  ai_chatbots: {
    question: 'How do I make their AI use safe, and get them ready for it?',
    answer: 'Taught before they meet it, and most already have. What a chatbot is at 6, honesty in homework at 11, why it is never a counsellor at 14, and using it well by 16.',
    proof: [`${AI_LESSONS} AI lessons`, 'The AI readiness thread'],
  },
  seen_something: {
    question: 'What do I switch on, and is it even enough?',
    answer: 'The settings worth setting, per age and per device, done together rather than in secret. Then the part settings cannot do: a child who comes to you first.',
    proof: ['Setting checklists per screen', 'What to say the night it happens'],
  },
}
