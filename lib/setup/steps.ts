// The setup path steps, in one place so both the dashboard UI (SetupPath, a
// client component) and the server side that computes the next step (the
// SetupNextBar API) share exactly the same list and order. Foundations first:
// the two minute daily habit, then check ins so the nudges land, then quests,
// then school routines, then the child's own phone link once they are old
// enough, then the family agreement when ready.

export type SetupFlags = {
  agreement: boolean
  quests: boolean
  school: boolean
  push: boolean
  daily: boolean
  childLink: boolean
}

export type SetupStep = {
  key: keyof SetupFlags
  title: string
  what: string
  href: string
}

export const STEPS: SetupStep[] = [
  { key: 'daily',     title: 'Do your first daily practice', what: 'Two minutes: the moment, the words, the check in. This is the habit everything else hangs on.', href: '/dashboard/daily' },
  { key: 'push',      title: 'Turn on check ins',          what: 'Three gentle nudges a day at the moments your child faces screens.', href: '/dashboard#turn-on-check-ins' },
  { key: 'quests',    title: 'Set up Family Quests',       what: 'Their everyday jobs earn stars, stars buy the screen time you agree. They tick, you approve. Two minutes to set up, and the kids love it.', href: '/dashboard/quests' },
  { key: 'school',    title: 'Set up school routines',      what: 'Add PE kit, library day or a Saturday activity by hand, once, and it reminds you and your child every week from then on. Forwarding school email is there too if you want it.', href: '/dashboard/school' },
  { key: 'childLink', title: 'Send your child their phone link', what: 'Only if your older child already has their own device. Send their private link by message, it opens like a mini app, nothing to install. For younger children you do it together on your device instead, no child device needed.', href: '/dashboard/quests?tab=share' },
  { key: 'agreement', title: 'Build your family agreement', what: 'When you are ready: decided together and signed, it makes every boundary something you both chose, and it powers what the stars buy.', href: '/dashboard/agreement' },
]

// The child's own phone link only belongs in the path once they are old
// enough to have a phone. We record around 9 as the point the conversation
// usually starts, so anything below the 4 to 7 band shows the step, and
// Foundation age children do not. Everything else is always in the path.
export function visibleSteps(phoneAge: boolean): SetupStep[] {
  return STEPS.filter(s => s.key !== 'childLink' || phoneAge)
}
