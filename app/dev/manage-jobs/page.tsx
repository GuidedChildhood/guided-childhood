'use client'

import ManageJobs from '@/app/(dashboard)/dashboard/quests/manage/ManageJobs'

// Dev harness for the Manage jobs page. It reads /api/quests, which needs auth
// and a family with jobs, pending ticks and a child request all at once, so the
// call is stubbed in Playwright.
export default function ManageJobsHarness() {
  return <ManageJobs />
}
