// WHEN A LESSON MISSION'S STARS WERE PAID (plan v10, item 1.5).
//
// Stars pay once, on a child's first finish of a lesson, pass or not, so the
// check stays the one place in the app where nothing rides on being right
// (decision 2 of the lessons plan). From migration 366 that moment is
// `paid_at`. A mission finished before 366 has no `paid_at` but did pay, on
// the finish that set it `done`, so its finish date stands in. Every reader
// of mission stars goes through this, so a failed first finish (which now
// leaves the mission `sent`) still pays, and no child's balance moved on the
// day 366 landed.
export function missionPaidAt(m: { paid_at?: string | null; status?: string | null; completed_at?: string | null }): string | null {
  return m.paid_at ?? (m.status === 'done' ? m.completed_at ?? null : null)
}
