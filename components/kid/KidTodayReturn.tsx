import { createAdminClient } from '@/lib/supabase/admin'
import { readTodayState } from '@/lib/kid/today-state'

// The way back to today, on every page that is not the home.
//
// Justin, 14 September 2026: "the home tab on the app always has a Duolingo
// type reminder to return to daily tasks until done so they don't get lost on
// other tabs." Seven of the home tiles open separate pages (jobs, lessons,
// the planet, ask for a job, telling a grown up, printing) where the five a
// day does not exist at all, and the only way back was a chevron not every
// page had. This pill sits at the foot of each of them: what is left, and one
// tap home to the five a day. Green with a tick once the day is done, so a
// finished day reads as finished from anywhere.
//
// A server component, token scoped like the pages it sits on: one read of the
// day's row, the same reading both Homes already use, failing soft to a plain
// "Back to today" when there is nothing to say.

export default async function KidTodayReturn({ token }: { token: string }) {
  if (!/^[0-9a-f]{18}$/.test(token)) return null
  let state: Awaited<ReturnType<typeof readTodayState>> | null = null
  try {
    const admin = createAdminClient()
    const { data: link } = await admin.from('kid_links').select('child_id').eq('token', token).maybeSingle()
    if (link?.child_id) state = await readTodayState(admin, link.child_id as string)
  } catch { state = null }

  const opened = (state?.steps.length ?? 0) > 0
  const complete = !!state?.complete
  const left = state?.left ?? 0
  const label = complete
    ? 'Today is done'
    : opened && left > 0
      ? `${left} of ${state?.steps.length} left today`
      : 'Back to today'

  return (
    <a
      href={`/k/${token}#kid-five`}
      data-today-return
      data-state={complete ? 'done' : opened ? 'going' : 'fresh'}
      style={{
        position: 'fixed', left: '50%', bottom: 'calc(14px + env(safe-area-inset-bottom))', transform: 'translateX(-50%)',
        zIndex: 60, display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
        padding: '11px 18px', borderRadius: 'var(--radius-pill)', textDecoration: 'none',
        background: complete ? 'var(--retro-green)' : 'var(--terracotta)',
        color: complete ? '#fff' : 'var(--ink)',
        border: '2px solid var(--ink)', boxShadow: '0 5px 0 var(--ink)',
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
      }}
    >
      <span aria-hidden>{complete ? '✓' : '🔥'}</span>
      {label}
      {!complete && <span aria-hidden>›</span>}
    </a>
  )
}
