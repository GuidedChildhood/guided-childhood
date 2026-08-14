// The method week. Four emails, one week, the thinking under the tools.
//
// Justin, 10 August 2026:
//
//   "We should also have little nudges, best way to inform them use timer when
//   child uses device, and list why this is useful, the methodology, and
//   reconsider the balance of offline online, and teaching habits that jobs
//   done equals device time. So emails to show this one week."
//
// ── The gap was timing, not content ──────────────────────────────────────────
//
// The lifecycle programme already teaches this: `week-jobs-stars` at day 147
// and `week-device-time` at day 175. That is five and six months after a family
// starts, which is months after they have either found the habit on their own
// or quietly stopped trying. Everything a parent needs to make the loop work is
// explained after the point at which they needed it.
//
// ── Anchored to first use, not to signup day ─────────────────────────────────
//
// Days 0 to 7 already carry five emails. Four more in the same week is the
// pressure Justin is asking us to avoid, and a lecture about the timer on day
// one arrives before a family has a single screen session to apply it to.
//
// So these hang off the day the loop became real for this family: their first
// job, first device session or first child link, whichever came first. For one
// family that is day two and for another it is day forty, and both get the
// method at the moment it means something. See the cron for the anchor.
//
// ── What the emails are allowed to claim ─────────────────────────────────────
//
// The same rule as the rest of the programme. Research names stay inside the
// set the code already carries (screen-balance.ts: WHO, the American Academy of
// Pediatrics, the RCPCH, Sue Atkins), described only at the breadth of their
// published positions. No studies, no percentages, no numbers we cannot trace.
// Where the honest claim is narrower than the impressive one, take the narrow
// one. Everything about our own product is checkable in the app today.

import {
  bandedWrapper, button, eyebrow, h1, rule, sectionHead, tickList,
  p as bp, type Band,
} from './blocks'
import type { EmailContent } from './templates'
import { APP_ORIGIN } from '@/lib/config/site'

const APP = APP_ORIGIN

/** The child's name, or a phrase that reads properly when we do not have one. */
const who = (childName?: string | null) =>
  childName && childName !== 'Your child' ? childName : 'your child'

// ── Day 1 · email_key 'method-timer' ─────────────────────────────────────────
//
// The timer, and why a visible clock is different from a parent saying stop.
// The claim is deliberately about WHO IS ASKING rather than about outcomes: we
// can say what the timer changes in the room, and we cannot say what it does to
// a child over a year.
export function methodTimerEmail(params: { childName?: string | null; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  const name = who(childName)
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The method, part one', tone) +
        h1('Start the timer when the screen goes on', tone) +
        bp(`Not to police it. To take the argument off you.`, tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#9200;', 'Why a clock beats a warning') +
        bp('Five more minutes, said by a parent, is a negotiation. Everybody in the room knows it can be pushed, because the person holding the time is also the person who loves them.') +
        bp('A timer both of you can see is not a negotiation. The end of the time is a fact that arrived on its own. Switching off stops being a thing you did to them and becomes a thing that happened, and that one change is what takes the heat out of the handover.') +
        rule() +
        sectionHead('&#128273;', 'The two rules that make it work') +
        tickList([
          'Start it BEFORE the screen goes on, never once it has already begun',
          'When it ends, it ends. A timer you override twice is a timer nobody believes again',
        ]) +
        button('Set up the timer', `${APP}/dashboard/quests`) +
        bp(`One thing to do today: the next time ${name} picks up a device, start the timer first. Nothing else has to change this week.`),
    },
  ]
  return {
    subject: 'The timer, and why it works',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Day 3 · email_key 'method-earned' ────────────────────────────────────────
//
// Jobs done equals device time, and why earned is a different thing from given.
// Careful here: this is the one place where it would be easy to slide into
// claiming we have solved motivation. We have not. The honest claim is about
// what the child can now answer, not about what they will feel.
export function methodEarnedEmail(params: { childName?: string | null; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  const name = who(childName)
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The method, part two', tone) +
        h1('Jobs done equals device time', tone) +
        bp('The equals sign is the whole product. Everything else is scaffolding around it.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#11088;', 'Given time and earned time are not the same thing') +
        bp('Screen time handed over is something a child can lose. It makes you the person who gives and takes away, and it makes every evening a question about your mood rather than about their week.') +
        bp('Screen time earned is something a child owns. They can tell you exactly where it came from, because they did the thing it came from. That is a different conversation, and it is one you are not in the middle of.') +
        rule() +
        sectionHead('&#128203;', 'What that looks like here') +
        tickList([
          'A job on the board is worth stars, and you set what it is worth',
          'They tick it, you say yes, and the stars land',
          'Stars become minutes, and the minutes are theirs to spend',
        ]) +
        bp('The yes matters more than it looks. A job that is ticked and never approved teaches a child that ticking it does nothing, and that is the one lesson we cannot undo later. If nothing else this week, clear the yeses.') +
        button('See the board', `${APP}/dashboard/quests`) +
        bp(`One thing to do today: put ONE job on the board for ${name}. One. A board with three jobs on day one is a board nobody finishes.`),
    },
  ]
  return {
    subject: 'Earned time is a different thing',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Day 5 · email_key 'method-offline' ───────────────────────────────────────
//
// The offline half. This is the one Justin asked us to reconsider, and the
// reconsideration is real rather than rhetorical: an earned time system with
// nothing on the other side of it is rationing with extra steps.
export function methodOfflineEmail(params: { childName?: string | null; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  const name = who(childName)
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The method, part three', tone) +
        h1('The half that is not a screen', tone) +
        bp('Earning time only works if there is something on the other side of it worth having.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#127912;', 'Otherwise it is rationing with extra steps') +
        bp('A system that measures screen time and offers nothing else has quietly made the screen the only thing worth wanting. The child learns the currency and nothing about what to spend the rest of the day on.') +
        bp('So the offline half is not a punishment and it is not a lecture. It is a pack of games, made of paper, that happen to teach the same digital thinking the lessons do. Robot Parent teaches that a computer only does exactly what it is told. Password Monster teaches that three silly words beat one clever short one. They are games first, and the teaching is underneath.') +
        rule() +
        sectionHead('&#128196;', 'It is free, and it is on paper') +
        tickList([
          'Thirteen sheets, sorted by age, print what you want',
          'Every finished one counts as a job and pays out in stars',
          'No screen involved at any point, including for them',
        ]) +
        button('Open the game pack', `${APP}/dashboard/quests/crafts`) +
        bp(`One thing to do today: print one sheet for ${name}. The whole pack is a lot; one game on the kitchen table is a Saturday.`),
    },
  ]
  return {
    subject: 'The half that is not a screen',
    html: bandedWrapper({ bands, unsubscribe }),
  }
}

// ── Day 7 · email_key 'method-week' ──────────────────────────────────────────
//
// What a week of this actually looks like, and the one number worth watching.
// Ends on the honest note rather than a triumphant one: the balance is a mirror
// and not a score, which is the same thing the child's own balance page says.
export function methodWeekEmail(params: { childName?: string | null; unsubscribe: string }): EmailContent {
  const { childName, unsubscribe } = params
  const name = who(childName)
  const bands: Band[] = [
    {
      tone: 'auto',
      html: tone =>
        eyebrow('The method, part four', tone) +
        h1('What a week of this looks like', tone) +
        bp('Three habits, and none of them takes longer than a minute.', tone),
    },
    {
      tone: 'white',
      html:
        sectionHead('&#128197;', 'The whole thing, honestly') +
        tickList([
          'Start the timer before the screen goes on',
          'Say yes to what they ticked, once a day, whenever suits',
          'One offline thing a week, on paper, that nobody has to be talked into',
        ]) +
        bp('That is it. There is no fourth habit and we are not going to invent one.') +
        rule() +
        sectionHead('&#128200;', 'The one number worth watching') +
        bp(`Not minutes. Minutes go up in the holidays and down in exam week and tell you almost nothing on their own. Watch whether ${name} can tell you where their time came from. A child who can answer that has understood the deal, and a child who cannot is still being given screen time by a grown up, whatever the board says.`) +
        bp('The balance page is deliberately not a score. Neither is anything else here. A child cannot control the number and grading them on one would turn a mirror into a test they can fail.') +
        button('See where you are', `${APP}/dashboard/quests`) +
        bp('One thing to do today: ask them. That question is the whole method in six words.'),
    },
  ]
  return {
    subject: 'The one number worth watching',
    html: bandedWrapper({ bands, unsubscribe, signOff: 'Any time,' }),
  }
}

/**
 * The series, in order, as days after the anchor.
 *
 * Exported as data rather than wired one by one in the cron so the shape can be
 * checked: the gaps, the keys, and the fact that nobody gets two on one day.
 */
export const METHOD_WEEK: {
  day: number
  key: string
  make: (p: { childName?: string | null; unsubscribe: string }) => EmailContent
  counter: string
}[] = [
  { day: 1, key: 'method-timer', make: methodTimerEmail, counter: 'methodTimer' },
  { day: 3, key: 'method-earned', make: methodEarnedEmail, counter: 'methodEarned' },
  { day: 5, key: 'method-offline', make: methodOfflineEmail, counter: 'methodOffline' },
  { day: 7, key: 'method-week', make: methodWeekEmail, counter: 'methodWeek' },
]
