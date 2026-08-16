import { redirect } from 'next/navigation'

// The tracker was the second passport page. Its report now reads as a section
// of the pathway, so this is only here to keep old links working: bookmarks,
// the links inside emails already sent, and anywhere in the app still pointing
// here. It lands on the report itself rather than the top of the page, so a
// parent who followed a link to "is it working" still arrives at the answer.
export default async function TrackerRedirect({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child } = await searchParams
  redirect(`/dashboard/pathway${child ? `?child=${encodeURIComponent(child)}` : ''}#is-it-working`)
}
