import ManageJobs from '@/app/(dashboard)/dashboard/quests/manage/ManageJobs'

// Fixture reference page: the REAL add a job page, so the three tabs and the
// composer can be seen and screenshotted without a logged in parent. Not
// linked from anywhere, the same as every other ref- page here.
//
// ManageJobs fetches /api/quests itself, which needs a session, so a browser
// checking this page stubs that one response. That keeps the component honest:
// nothing here is a copy of it with different markup, it is the component.
//
// ?tab=agree and ?tab=theirs open the other two tabs, ?child= picks the child,
// which is the same contract the real page has.

export const dynamic = 'force-dynamic'

export default async function RefAddJobPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string; tab?: string }>
}) {
  const { child, tab } = await searchParams
  return <ManageJobs initialChild={child ?? null} initialTab={tab ?? null} />
}
