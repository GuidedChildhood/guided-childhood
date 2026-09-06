// The horizons: what typically arrives next for a child of this age, so DiGi
// can say it BEFORE it lands. Justin, 6 September 2026: "forecasting what
// potentially happens when the child gets a new phone and they start to love
// a game on the Switch, how they can learn AI in a safe way." A parent who
// hears about the first group chat a term early has a plan; one who hears
// about it in October has a fight.
//
// Every row carries the source it leans on and the country the figure comes
// from, because an adoption figure is a UK or a US number, never a world one.
// Rows are filled from the verified situations and forecasts briefing
// (briefings/2026-09-06-digi-situations-and-forecasts-v2.html); nothing here
// is a guess. Empty bands say nothing rather than something invented.

import type { AgeBand } from '@/lib/content/stages'

export type Horizon = {
  /** The age band the milestone typically lands in. */
  band: AgeBand
  /** What arrives, in plain words. */
  what: string
  /** Why it matters and the one move to make before it lands. */
  before: string
  /** The named source and the figure, verbatim where a number is used. */
  source: string
  /** Which country the figure describes. */
  country: 'UK' | 'US' | 'global'
}

export const HORIZONS: Horizon[] = [
  // Stage 1, 4 to 7: the screen is already here, and so is the first game.
  { band: '4-7', what: 'Nearly nine in ten 3 to 7 year olds are already online, and online gaming among 5 to 7s has jumped to 41%.', before: 'The first device belongs in a shared room with autoplay off and a grown up beside them naming what is on the screen; that habit, not a timer, is what the 1958 television study and Sesame Street both found made the difference.', source: 'Ofcom Children and Parents 2026, 88% of 3 to 7s online, 41% of 5 to 7s gaming', country: 'UK' },
  { band: '4-7', what: 'The ending becomes the daily fight.', before: 'Let the episode end itself or set the device to end it, agreed before it starts. In 55 families of preschoolers, endings set by the technology went far better than a parent calling time, and the spoken two minute warning made it worse.', source: 'Hiniker et al, CHI 2016', country: 'US' },
  { band: '4-7', what: 'The screen becomes the calming tool, most of all for boys and big feelers.', before: 'Occupying a child with a screen so you can cook is fine; calming an upset child with it every time is the pattern to break. In 422 three to five year olds, calming with a device predicted more emotional reactivity six months on.', source: 'Radesky et al, JAMA Pediatrics 2023', country: 'US' },
  // Stage 2, 7 to 10: the money and the first account arrive before the phone.
  { band: '8-10', what: 'The first in game purchase. 97% of 8 to 17s play online and 53% of them spend real money, and the games do not ask a parent.', before: 'Agree a fixed monthly amount before the first ask, buy the gift card together, and turn off one tap purchase on every store. None of the top 100 iPhone games with loot boxes sought parental consent.', source: 'Ofcom Children’s Online Experiences 2026; Xiao and Lund 2025', country: 'UK' },
  { band: '8-10', what: 'The first AI use, usually for homework on a parent’s device. In the US 81% of 9 to 12 year olds already use some form of AI.', before: 'Have the first AI conversation now, not at 13: ask it something together, then check the answer against a book or a person. The rule that works is that AI may explain and quiz, it may not answer.', source: 'Common Sense AI census 2026, 81% of 9 to 12s; Bastani et al, PNAS 2025', country: 'US' },
  { band: '8-10', what: 'The phone is coming: 56% of ten year olds already have one.', before: 'Plan it in Year 6 while it is still a plan. Decide together where it charges at night and say the no confiscation promise out loud before the box is opened: if you show me something bad, the phone stays yours.', source: 'Ofcom Children and Parents 2026', country: 'UK' },
  // Stage 3, 10 to 13: the phone lands and shows up in sleep first.
  { band: '11-13', what: 'The phone. Ownership jumps from 56% at ten to 83% at eleven; Ofcom calls starting senior school the tipping point.', before: 'Expect it to show up in sleep first. In 10,588 US children, twelve year olds with a phone had 1.6 times the odds of too little sleep, so the bedtime charging spot outside the bedroom is the rule to set the day the phone arrives.', source: 'Ofcom Children and Parents 2026 (ownership); Barzilay et al, Pediatrics 2025 (sleep, US)', country: 'UK' },
  { band: '11-13', what: 'The first group chat and the class WhatsApp, with 63% of 8 to 14s already on WhatsApp.', before: 'The first problems are social, not technical: being left out, pile ons, screenshots travelling. Agree that a screenshot of anything upsetting comes to you and costs nothing.', source: 'Ofcom Children and Parents 2026', country: 'UK' },
  { band: '11-13', what: 'The girls’ sensitivity window for social media, ages 11 to 13.', before: 'Heavier use in this window predicted lower life satisfaction a year later for girls (boys’ window is 14 to 15). Watch mood and sleep a little more closely and ask how she feels after scrolling, not how long.', source: 'Orben, Przybylski, Blakemore and Kievit, Nature Communications 2022', country: 'UK' },
  { band: '11-13', what: 'AI as a friend. 11% of UK 8 to 17s have used AI as someone to talk to, and the lonely or SEND child leans hardest.', before: 'If your child says the chatbot is their friend, that is a prompt to increase real contact, not a crisis. Ask who else they talk to before asking them to stop.', source: 'Ofcom Children and Parents 2026; Internet Matters 2025', country: 'UK' },
  // Stage 4, 13 to 16: the chatbot every day, the companion, the ban.
  { band: '13-15', what: 'The daily chatbot. In the US 64% of teens use one and about three in ten use it every day, mainly for schoolwork.', before: 'Ask what they used it for today the way you ask about a lesson. Half of parents know their teen uses one; three in ten have no idea.', source: 'Pew Research Center, Teens, Social Media and AI Chatbots 2025', country: 'US' },
  { band: '13-15', what: 'The AI companion. 72% of US teens have tried one and a third of users have taken a serious conversation to it instead of a person.', before: 'Say plainly that it is a tool, not a friend, and why. Younger teens trust it more than older ones, and 80% still put real friends first, so the conversation lands.', source: 'Common Sense Media, Talk, Trust, and Trade Offs 2025', country: 'US' },
  { band: '13-15', what: 'The notifications. A teenager’s phone asks for attention a median of 237 times a day.', before: 'Turn notifications off together, as the first setting done side by side, not the parent’s secret. It is the one change teenagers say they can feel.', source: 'Common Sense Media, Constant Companion 2023', country: 'US' },
  { band: '13-15', what: 'The under 16 ban, spring 2027, set to cover the big social platforms, with messaging apps outside it and games not named.', before: 'Expect the pull to move to games, group chats and AI rather than vanish; Australia’s regulator found eight in ten 10 to 15 year olds still on social media four months after its ban. Frame it as protection from the platforms, not from your child: 62% of 10 to 16 year olds say a ban feels like punishment.', source: 'UK Government 15 June 2026; eSafety Australia 2026; Girlguiding poll 2025', country: 'UK' },
  { band: '13-15', what: 'Your own phone comes into view: 46% of teens say a parent is at least sometimes distracted by their phone when they are trying to talk.', before: 'Keep the same rule you set for them at the table and at bedtime. A rule the parent visibly keeps is the only kind children call fair.', source: 'Pew Research Center 2024', country: 'US' },
  // Stage 5, 16 plus: their own money, their own judgement.
  { band: '16+', what: 'Spending moves from the gift card to their own bank account (62% of 14 to 17s pay for in game items that way).', before: 'The lever changes from the card to the conversation: what did it buy, and did it feel worth it a week later. A third of children who spend in games say they often regret it.', source: 'Gambling Commission, Young People and Gambling 2025; Ofcom Children’s Online Spending 2025', country: 'UK' },
  { band: '16+', what: 'AI use peaks at two thirds of 16 to 17 year olds, and 40% of teenage AI users would trust an AI written news article as much as a human one.', before: 'Teach checking as a habit before they leave home: who made it, and can two other sources confirm it. A quarter of teenagers who said they could spot AI content failed when tested.', source: 'Ofcom Children and Parents 2026', country: 'UK' },
  { band: '16+', what: 'They start cutting back themselves: 44% of US teens say they have cut back on social media.', before: 'Treat a teenager who says they want to use it less as an ally with a plan to protect, not a problem to police. They think it harms others far more than themselves, so "for your own good" misses.', source: 'Pew Research Center, Teens, Social Media and Mental Health 2025', country: 'US' },
]

const ORDER: AgeBand[] = ['4-7', '8-10', '11-13', '13-15', '16+']

/** This band's horizons, then the next band's, so the forecast reaches ahead. */
export function horizonsFor(band: AgeBand | null): Horizon[] {
  if (!band) return []
  const i = ORDER.indexOf(band)
  if (i === -1) return []
  const bands = ORDER.slice(i, i + 2)
  return HORIZONS.filter(h => bands.includes(h.band))
}

/** The horizons as prompt text, or an empty string when there is nothing to say. */
export function renderHorizons(band: AgeBand | null, childName = 'your child'): string {
  const rows = horizonsFor(band)
  if (rows.length === 0) return ''
  return `\n\nWHAT IS COMING FOR ${childName.toUpperCase()} (the milestones that typically arrive at this age and the next; when one fits the conversation, name it before it lands and give the move to make now, and say which country the figure is from):\n` +
    rows.map(h => `- ${h.band}: ${h.what} ${h.before} (${h.source}, ${h.country})`).join('\n')
}
