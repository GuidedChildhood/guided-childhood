import { redirect } from 'next/navigation'

// The standalone watch together shelf has been folded into the single
// Lessons hub at /dashboard/lessons, where the illustrated films sit
// above the interactive library in one clean scroll. This route stays
// as a redirect so older links, bookmarks and the completion push all
// land in the one hub. The player itself still lives at
// /dashboard/lessons/together/[code].
export default function WatchTogetherRedirect() {
  redirect('/dashboard/lessons')
}
