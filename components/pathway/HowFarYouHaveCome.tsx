import { createClient } from '@/lib/supabase/server'

// How far you have come.
//
// The payoff for every number a parent taps into the check in. It reads
// concern_events (migration 164), not the concerns table, because the whole
// point is the shape of the journey rather than where it ended up: what they
// arrived with, what moved, how long it took, and what came back.
//
// WHY THIS SHIPS IN THE SAME RELEASE AS THE ASKING
//
// A rating with no visible payoff gets abandoned by month two, and then we have
// a half populated table and no evidence. If we are going to ask a parent to
// score their own week, the answer has to come back to them, in a form they
// recognise, without them having to go looking.
//
// AND WHY IT REFUSES TO SHOW OFF
//
// Everything here is honest to a fault, deliberately. Backfilled rows are
// excluded from anything time based, because their timestamps were reconstructed
// rather than observed. Concerns that came back are counted and shown, not
// quietly folded into the wins. A parent who can see the ones that did not work
// believes the ones that did, and the same is true of every other audience this
// data will ever reach.

type EventRow = {
  concern_id: string
  event: string
  score: number | null
  score_at_start: number | null
  backfilled: boolean
  created_at: string
}

type Journey = {
  label: string
  status: string
  firstAt: string | null
  resolvedAt: string | null
  startScore: number | null
  endScore: number | null
  recurrences: number
  observed: boolean
}

function daysBetween(a: string, b: string): number {
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000))
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many
}

export default async function HowFarYouHaveCome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: concerns }, { data: events }] = await Promise.all([
    supabase.from('concerns').select('id, label, status').eq('user_id', user.id),
    supabase
      .from('concern_events')
      .select('concern_id, event, score, score_at_start, backfilled, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true }),
  ])

  if (!concerns?.length || !events?.length) return null

  const byConcern = new Map<string, EventRow[]>()
  for (const e of events as EventRow[]) {
    const list = byConcern.get(e.concern_id)
    if (list) list.push(e)
    else byConcern.set(e.concern_id, [e])
  }

  const journeys: Journey[] = []
  for (const c of concerns) {
    const rows = byConcern.get(c.id as string)
    if (!rows?.length) continue

    const first = rows[0]
    // The last resolution, so a concern that came back and was sorted again
    // reads from the most recent win rather than the first one.
    const lastResolved = [...rows].reverse().find(r => r.event === 'resolved') ?? null

    // The parent's own read of the start: the look back answer given at
    // resolution if they gave one, otherwise the earliest number they ever
    // recorded. Never invented when neither exists.
    const startScore =
      lastResolved?.score_at_start ??
      rows.find(r => typeof r.score === 'number')?.score ??
      null

    const endScore =
      [...rows].reverse().find(r => typeof r.score === 'number')?.score ?? null

    journeys.push({
      label: c.label as string,
      status: c.status as string,
      firstAt: first.created_at,
      resolvedAt: lastResolved?.created_at ?? null,
      startScore,
      endScore: endScore === startScore && rows.length === 1 ? null : endScore,
      recurrences: rows.filter(r => r.event === 'recurred').length,
      // Only journeys with no reconstructed rows may carry a duration.
      observed: !rows.some(r => r.backfilled),
    })
  }

  if (journeys.length === 0) return null

  const sorted = [...journeys].sort((a, b) => {
    const rank = (j: Journey) => (j.status === 'resolved' ? 0 : j.status === 'improving' ? 1 : 2)
    if (rank(a) !== rank(b)) return rank(a) - rank(b)
    return (b.firstAt ?? '').localeCompare(a.firstAt ?? '')
  })

  // Still going at the top, sorted folded underneath. The old single list put
  // resolved FIRST, so a family with a good record opened this to a wall of
  // green before reaching anything they could act on.
  const live = sorted.filter(j => j.status !== 'resolved')
  const done = sorted.filter(j => j.status === 'resolved')

  const solved = journeys.filter(j => j.status === 'resolved').length
  const cameBack = journeys.filter(j => j.recurrences > 0).length

  // Only durations we actually watched happen.
  const timed = journeys.filter(j => j.observed && j.firstAt && j.resolvedAt)
  const medianDays = (() => {
    if (timed.length === 0) return null
    const all = timed.map(j => daysBetween(j.firstAt as string, j.resolvedAt as string)).sort((x, y) => x - y)
    const mid = Math.floor(all.length / 2)
    return all.length % 2 ? all[mid] : Math.round((all[mid - 1] + all[mid]) / 2)
  })()

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '18px 20px', marginBottom: '20px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
        How far you have come
      </div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
        {solved > 0
          ? `${solved} ${plural(solved, 'thing', 'things')} you brought here ${plural(solved, 'is', 'are')} sorted${medianDays !== null ? `, most of them inside ${medianDays} ${plural(medianDays, 'day', 'days')}` : ''}.`
          : 'Everything you have raised so far, and where each one has got to.'}
      </p>

      {/* A TABLE, NOT A STACK OF CARDS, and Justin found this the hard way:
          "this is not readable and needs to be a neat table, as Mobbin would
          advise." He was looking at a dozen identical fat cards, most of them
          the SORTED ones, every single one saying "on the list since you raised
          it" under a bold heading. A card is a container for something worth
          reading on its own. These are ROWS in a list, and drawing them as
          cards spent a whole screen saying almost nothing.

          So: one line each, the label on the left, the movement in the middle,
          the state on the right. A family with fifteen concerns can now take
          the whole picture in at a glance instead of scrolling through it. */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {live.map((j, i) => <JourneyRow key={'l' + i} j={j} first={i === 0} />)}
      </div>

      {/* The sorted ones fold away, because they are the bulk of the list and
          the least urgent part of it. Not hidden: the count is right there and
          one tap opens them. A parent scrolling for what is still live should
          not have to wade through everything that is already fine. */}
      {done.length > 0 && (
        <details style={{ marginTop: live.length > 0 ? '14px' : 0 }}>
          <summary style={{
            cursor: 'pointer', listStyle: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            padding: '9px 0', borderTop: '1px solid var(--border)',
          }}>
            {done.length} sorted, tap to see them
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {done.map((j, i) => <JourneyRow key={'d' + i} j={j} first={i === 0} />)}
          </div>
        </details>
      )}

      {cameBack > 0 && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: '14px' }}>
          {cameBack} of these came back after being sorted. That is normal, and it is worth knowing rather than
          hiding: the ones that keep returning are the ones to build a proper plan around.
        </p>
      )}
    </div>
  )
}

// One journey, one line.
//
// The movement is the only number worth showing and it is shown as "8 to 9"
// rather than "8 out of 10 at the start, 9 now", because the sentence was
// three times the width of the fact and every row repeated it. Out of ten is
// the scale the whole check in uses, so it does not need restating fifteen
// times down one page.
function JourneyRow({ j, first }: { j: Journey; first: boolean }) {
  const moved = typeof j.startScore === 'number' && typeof j.endScore === 'number'
  const state = j.status === 'resolved' ? 'Sorted' : j.status === 'improving' ? 'Turning' : 'Live'
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: '10px',
      padding: '9px 0',
      borderTop: first ? 'none' : '1px solid var(--border)',
    }}>
      <span style={{
        flex: 1, minWidth: 0,
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)',
        lineHeight: 1.35,
      }}>
        {j.label}
        {j.recurrences > 0 && (
          <span style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-sm)' }}>
            {' '}· back {j.recurrences}x
          </span>
        )}
      </span>
      {moved && (
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
          fontWeight: 700, color: 'var(--ink-soft)', minWidth: '48px', textAlign: 'right',
        }}>
          {j.startScore} to {j.endScore}
        </span>
      )}
      <span style={{
        flexShrink: 0, width: '58px', textAlign: 'right',
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '.06em', textTransform: 'uppercase',
        color: j.status === 'resolved' ? 'var(--stage-1-text)' : 'var(--ink-muted)',
      }}>
        {state}
      </span>
    </div>
  )
}
