import type { WhatYouKeep } from '@/lib/paywall/what-you-keep'

// One made up family for the ref pages, so the personal ask can be looked at
// with no account: a named child, a tracked worry, check ins, a quest and
// scripts. ?empty=1 on the ref pages draws the honest empty state instead.
export const REF_KEEP: WhatYouKeep = {
  childName: 'Teo',
  worry: 'Bedtime screens',
  worryNamedOnly: false,
  checkIns: 3,
  scriptsOpened: 2,
  questJobs: 4,
  starsEarned: 7,
}
