// The setup path steps, in one place so both the dashboard UI (SetupPath, a
// client component) and the server side that computes the next step (the
// SetupNextBar API) share exactly the same list and order. Foundations first:
// the two minute daily habit, then the birthday, then check ins so the nudges
// land, then quests, then school routines, then the child's own phone link once
// they are old enough, then the family agreement when ready.
//
// The birthday used to live only as a welcome card, which was the wrong home
// for it. It is one missing fact that the parent, and only the parent, can
// supply, and setup is where a parent goes to find out what is still missing.
// As a card it was something the app said in passing; as a step it is something
// with a tick, a place in the sequence, and a nudge that comes back. Second in
// the order because it is the shortest job on the list and the only one whose
// absence leaves a service the family has already paid for saying "not written
// yet" on every page it touches.

export type SetupFlags = {
  agreement: boolean
  quests: boolean
  school: boolean
  push: boolean
  daily: boolean
  childLink: boolean
  birthday: boolean
}

export type SetupStep = {
  key: keyof SetupFlags
  title: string
  what: string
  href: string
}

export const STEPS: SetupStep[] = [
  { key: 'daily',     title: 'Do your first daily practice', what: 'Two minutes: the moment, the words, the check in. This is the habit everything else hangs on.', href: '/dashboard/daily' },
  { key: 'birthday',  title: "Add your child's birthday",    what: 'One date, and the shortest step here. School places a child by their age on 31 August, so without it we cannot say which school year they are in, and we will not guess. It is what puts the real curriculum for their year in front of you.', href: '/dashboard/settings' },
  { key: 'push',      title: 'Turn on check ins',          what: 'Three gentle nudges a day at the moments your child faces screens.', href: '/dashboard#turn-on-check-ins' },
  { key: 'quests',    title: 'Set up Family Quests',       what: 'Their everyday jobs earn stars, stars buy the screen time you agree. They tick, you approve. Two minutes to set up, and the kids love it.', href: '/dashboard/quests' },
  { key: 'school',    title: 'Set up school routines',      what: 'Add PE kit, library day or a Saturday activity by hand, once, and it reminds you and your child every week from then on. Forwarding school email is there too if you want it.', href: '/dashboard/school' },
  { key: 'childLink', title: 'Send your child their phone link', what: 'Only if your older child already has their own device. Send their private link by message, it opens like a mini app, nothing to install. For younger children you do it together on your device instead, no child device needed.', href: '/dashboard/quests?tab=share' },
  { key: 'agreement', title: 'Build your family agreement', what: 'When you are ready: decided together and signed, it makes every boundary something you both chose, and it powers what the stars buy.', href: '/dashboard/agreement' },
]

// The child's own phone link only belongs in the path once they are old
// enough to have a phone. We record around 9 as the point the conversation
// usually starts, so anything below the 4 to 7 band shows the step, and
// Foundation age children do not.
//
// ── AND ONLY IF THEY HAVE NOT ALREADY SAID NO (14 August 2026) ──────────────
//
// Justin: "if a parent selects that they want to co view and use printable star
// charts instead of share device we don't want to keep telling them to share or
// set up child device."
//
// Age was the only filter, so a family who had explicitly answered no still
// carried this step on their setup path FOR EVER. That is worse than an
// ordinary nag: setup is the one screen whose entire promise is to tell you
// what is still missing, and a step that can never be ticked means the path can
// never be finished. The family is left permanently at six of seven, being told
// they are incomplete because of a decision they made on purpose.
//
// `settled` comes from lib/handover/settled.ts, the one predicate every surface
// asks now, so paper, no_phone and a deliberate co-view all drop the step. The
// default is false, which keeps every existing caller behaving exactly as it
// did until it passes the flag.
export function visibleSteps(phoneAge: boolean, settled = false): SetupStep[] {
  return STEPS.filter(s => s.key !== 'childLink' || (phoneAge && !settled))
}
