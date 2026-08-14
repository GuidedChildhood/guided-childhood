import { redirect, notFound } from 'next/navigation'

// The road is gone from the child's app.
//
// Justin: "is pathway overkill? should we just have the 5 jobs to achieve a
// streak each day... what's your advice on the pathway is that too much to
// manage?" and then, plainly: "yes lets lose the pathway as advised for children
// only NOT parents".
//
// WHAT IT WAS AND WHY IT WENT. This was a Duolingo style trail for the child's
// stage: their lessons, games, printables, jobs, tips, a chest and a quiz. Every
// one of those, except the chest and the tips, is on the home screen too, where
// the five a day lives. So a child had two lists asking for the same five
// things, and finishing the day in one of them left the other one still looking
// unfinished. That is the "too much to manage", and it is the child who pays for
// it, not the parent.
//
// THE PARENT'S PASSPORT IS UNTOUCHED. /dashboard/passport is a different thing
// with a similar name: the ramp to 16, the five rows, the stamps. That is for
// the grown up and it stays exactly as it is.
//
// WHY A REDIRECT AND NOT A 404. This URL is on home screens, in the PWA cache
// and in old push notifications. A child tapping the icon they saved in June
// must land on their app, not on an error page in an app that has no back
// button. components/kid/KidPath.tsx is left where it is, still rendered by the
// reference page, so nothing is lost if this proves wrong.
//
// The sticker book that lived at the foot of this page moved to My wins on the
// home screen, along with its once only pop.

export const dynamic = 'force-dynamic'

export default async function KidPathRedirect({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  // The same token shape check the real pages do, so a junk URL is still a 404
  // rather than a redirect to a junk home screen.
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()
  redirect(`/k/${token}`)
}
