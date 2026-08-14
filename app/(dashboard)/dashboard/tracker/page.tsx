import { redirect } from 'next/navigation'

// The tracker was the second passport page. Its report is the Is it working tab
// of /dashboard/passport now, so this is only here to keep old links working:
// bookmarks, the links inside emails already sent, and anywhere in the app
// still pointing here. It lands on the tab itself rather than the cover, so a
// parent who followed a link to "is it working" still arrives at the answer.
export default async function TrackerRedirect({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child } = await searchParams
  redirect(`/dashboard/passport?tab=working${child ? `&child=${encodeURIComponent(child)}` : ''}`)
}
