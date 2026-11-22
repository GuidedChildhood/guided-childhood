import { bandForYears } from '@/lib/children/age'
import { getStageFromAgeBand } from '@/lib/content/stages'

import type { Age, AppEntry } from './types'

// WHAT IS DIFFERENT ABOUT EACH AGE.
//
// The age pages must not be one page with the number swapped (Justin, 19
// November 2026: "each age band needs genuinely different advice"). Each page
// differs in three real ways:
//
//   1. AGE_NOTES below: what changes for a child at that age, written once per
//      year, from the product's own stage content (lib/content/stages.ts) and
//      the school moments the Road to 16 guide checked (the Year 6 phone ask,
//      Year 7 group chats, the thirteenth birthday). Guidance in our voice, no
//      statistics: a number here would need a source and a page per age.
//   2. gapFor(): where the child sits against the app's own minimum age, from
//      well under to past it, and what that means for this app.
//   3. The app's own facts and settings (lib/app-safety/apps.ts).

export type AgeNote = {
  /** England school years a child of this age is usually in. */
  years: string
  /** What changes at this age, two or three sentences. */
  changes: string
  /** The one thing worth doing this month, whatever the app. */
  thisMonth: string
}

export const AGE_NOTES: Record<Age, AgeNote> = {
  6: {
    years: 'Year 1 or Year 2',
    changes: 'At six most children are still learning to read, so what they meet on a screen is chosen by pictures, autoplay and whatever comes next. They pick up screen habits from what they see at home as much as from what they are told.',
    thisMonth: 'Use apps together on a shared screen in a shared room, and narrate what you are doing: "I am stopping because the episode finished."',
  },
  7: {
    years: 'Year 2 or Year 3',
    changes: 'At seven children start to notice what friends have and play, and the first "everyone else is allowed" arrives. Turning a screen off is still hard work for them, and it goes better with warning than by surprise.',
    thisMonth: 'Agree a two minute warning and a clear stopping point, the end of a level or an episode, rather than a sudden off.',
  },
  8: {
    years: 'Year 3 or Year 4',
    changes: 'At eight online games become social, and chat, friends lists and in game money start to matter. Children can follow rules they helped write much better than rules handed down.',
    thisMonth: 'Write three screen rules together, put them somewhere you both see, and let your child suggest one of them.',
  },
  9: {
    years: 'Year 4 or Year 5',
    changes: 'At nine the asks get more specific, a particular app or a particular game, often because of one friend. Children this age can understand how an app makes money, and knowing it changes how they see it.',
    thisMonth: 'Ask how they think the app makes money, then look it up together. It turns the next ask into a conversation rather than a negotiation.',
  },
  10: {
    years: 'Year 5 or Year 6',
    changes: 'At ten the first phone conversation usually starts, and with it the apps that come with a phone. What you agree now becomes the default the phone arrives into.',
    thisMonth: 'Decide what the first phone is for, and what it is not for yet, before the box is opened.',
  },
  11: {
    years: 'Year 6 or Year 7',
    changes: 'At eleven many children move to secondary school, and the class group chat often arrives before the first week is out. Who is in their group starts to matter more than what any rule says.',
    thisMonth: 'Agree what happens if a group chat turns unkind: they screenshot it and show you, and it never costs them the phone. The one exception is a nude or sexual image of anyone under 18, which is never screenshotted or forwarded; they just tell you.',
  },
  12: {
    years: 'Year 7 or Year 8',
    changes: 'At twelve the pull towards the apps friends use gets strong, a year before most of them set their own minimum age. A plain no tends to send it out of sight; a plan for thirteen keeps it in the open.',
    thisMonth: 'Agree what will change at thirteen and what will not, so the birthday is a step you both planned.',
  },
  13: {
    years: 'Year 8 or Year 9',
    changes: 'Thirteen is the minimum age most big apps set, but a birthday is not a readiness test. Teen accounts and their default protections are designed for exactly this age, if the date of birth entered is real.',
    thisMonth: 'Set up any new account together with their real date of birth, so the teen protections switch on, and go through the settings side by side.',
  },
  14: {
    years: 'Year 9 or Year 10',
    changes: 'At fourteen privacy from parents matters more, and checking up on them in secret can cost the trust that keeps them talking. What they post and share starts to follow them.',
    thisMonth: 'Swap checking for asking: one calm question a week about what they have seen, with no consequence for the answer.',
  },
  15: {
    years: 'Year 10 or Year 11',
    changes: 'At fifteen the job is handing over: they will soon set every one of these settings for themselves. Exams make sleep and focus worth protecting this year.',
    thisMonth: 'Ask them to show you how they would set the app up safely on their own, and let them lead.',
  },
}

export type Gap = 'designed-for' | 'well-under' | 'under' | 'nearly' | 'at' | 'past'

/** Where a child of this age sits against the app's own minimum age. */
export function gapFor(age: number, minAge: number): Gap {
  const d = age - minAge
  if (minAge <= 6 && d >= 0) return 'designed-for'
  if (d <= -4) return 'well-under'
  if (d <= -2) return 'under'
  if (d === -1) return 'nearly'
  if (d === 0) return 'at'
  return 'past'
}

/** The child's Guided Childhood stage at this age, for the stage check link. */
export function stageFor(age: number) {
  return getStageFromAgeBand(bandForYears(age))
}

/** One sentence placing this age against this app's own rules, for the direct answer. */
export function gapSentence(app: AppEntry, age: number): string {
  const min = app.minAge.value
  switch (gapFor(age, min)) {
    case 'designed-for':
      return `${app.name} allows children of ${age}${app.minAge.note ? ` (${lowerFirst(app.minAge.note)})` : ''}, so the question is how it is set up rather than whether it is allowed.`
    case 'well-under':
      return `A ${age} year old is ${min - age} years below the age ${app.name} sets for its own accounts${app.underAge.text ? `, and ${app.maker} offers ${lowerFirst(app.underAge.text)}` : ''}.`
    case 'under':
      return `A ${age} year old is ${min - age} years below the age ${app.name} sets for its own accounts, which is often when the asking starts.`
    case 'nearly':
      return `A ${age} year old is one year below the age ${app.name} sets for its own accounts, so this is the year to agree what having it will look like.`
    case 'at':
      return `${age} is the age ${app.name} sets for its own accounts, which means a child can sign up, not that every child is ready to.`
    case 'past':
      return `A ${age} year old is past the age ${app.name} sets for its own accounts, so the work now is the settings and the habits rather than the yes or no.`
  }
}

function lowerFirst(s: string): string {
  return s ? s[0].toLowerCase() + s.slice(1) : s
}
