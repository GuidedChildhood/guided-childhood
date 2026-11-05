// THE WORKSHOPS (4 November 2026). Justin visits a school and teaches one
// class at a time, the class teacher in the room. Every workshop is built
// from lessons already in the scheme (the workshop audit, plans/
// 2026-11-04-workshops-phase-3.md), so each card names only what pupils will
// DO in the room, never what a school found afterwards: nothing has been
// delivered yet, so there is nothing to claim.
//
// An enquiry posts into schools.invoice_requests with band WORKSHOP_BAND,
// the same letterbox the pilot uses, and the parent app's cron emails Justin
// and sends the school its confirmation. No new table, no second cron.

export const WORKSHOP_BAND = 'workshop'

// Off until the enhanced DBS check and the insurance are in hand. While it is
// off the page is noindex and nothing links to it, because the audit holds
// all workshop marketing until those two lines are true. Turning it on is the
// only change needed to launch: it lifts the noindex and adds the sitemap row.
export const WORKSHOPS_LAUNCHED = false

export type Workshop = {
  id: 'a' | 'b' | 'c' | 'd'
  years: string
  title: string
  minutes: string
  flagship?: boolean
  does: [string, string, string]
}

export const WORKSHOPS: Workshop[] = [
  {
    id: 'a', years: 'Years 3 to 4', title: 'My first digital world', minutes: '45 or 60 minutes',
    does: [
      'Sort what is fine to share online and what stays private',
      'Spot when a game is asking for money',
      'Practise the words for telling a trusted adult',
    ],
  },
  {
    id: 'b', years: 'Years 5 to 6', title: 'Ready for your first smartphone?', minutes: '45 or 60 minutes', flagship: true,
    does: [
      'Sort age from readiness: what an app age limit is really for',
      'Choose what to do when a class group chat turns unkind, then practise the words',
      'Build a five line phone plan to take home',
    ],
  },
  {
    id: 'c', years: 'Years 7 to 8', title: 'Who is really in control?', minutes: '45 or 60 minutes',
    does: [
      'Work out why a feed showed them a video',
      'Name the persuasion tricks built into the apps they use',
      'Decide what to do when a group chat turns on someone',
    ],
  },
  {
    id: 'd', years: 'Years 9 to 11', title: 'AI, influence and digital independence', minutes: '45 or 60 minutes',
    does: [
      'Check a deepfake and a post that is too good to be true',
      'Spot the sell inside an influencer post',
      'Audit a made up digital footprint and decide what to change',
    ],
  },
]

export const DELIVERY = [
  { key: 'in_person', label: 'In person', line: 'Justin teaches one class at a time, with the class teacher in the room throughout.' },
  { key: 'online', label: 'Online', line: 'The same workshop live on your classroom screen, with the class teacher leading the room.' },
  { key: 'parent', label: 'Parent session', line: 'An evening session for parents of the year group, built from the workshop their children have just done.' },
] as const

export type DeliveryKey = (typeof DELIVERY)[number]['key']
