import Link from 'next/link'
import { db as supabase } from '@/lib/supabase/server-db'
import { CURRICULUM } from '@gc/shared/schools-curriculum'
import { currentAccess } from '@/lib/licence'
import { pilotModulesFor } from '@/lib/pilot'
import { shapeOf } from '@/lib/tracker'
import PrintButton from '@/components/PrintButton'
import HubTracker, { type Row } from './HubTracker'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'

// /hub/tracker: every lesson and its tick, with the pilot's two first.
//
// The one place a subject lead can see the whole scheme at once, and the one
// page that prints as a coverage record. The explanation lives here in words;
// the ticks are the client component beside it, because the count is in this
// browser and nowhere else.
//
// WHAT IT CANNOT BE, said plainly because it is the one place the ask and the
// promise pull apart: this records that a LESSON was delivered, never who was
// in the room. The schools app holds no pupil data, no teacher accounts and
// no session, and the data processing agreement is written on that. An
// attendance register is a different product with a different legal footing.

export const metadata = { title: 'Lesson tracker' }
export const dynamic = 'force-dynamic'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

export default async function HubTrackerPage() {
  // `i can` is the only step fact not already in the manifest, so one read
  // covers every row rather than one read per lesson.
  const { data } = await supabase
    .from('school_lessons')
    .select('module_id, teacher_notes')
  const iCanByModule = new Map(
    ((data ?? []) as { module_id: string; teacher_notes: { i_can?: unknown } | null }[])
      .map(r => [r.module_id, r.teacher_notes?.i_can]),
  )

  const access = await currentAccess()
  const phase = access?.tier === 'pilot' ? access.phase : null
  const pilotIds = new Set(phase ? pilotModulesFor(phase) : [])

  const toRow = (m: typeof CURRICULUM[number]): Row => ({
    moduleId: m.moduleId,
    n: m.n,
    title: m.title,
    keyStage: m.keyStage,
    shape: shapeOf(m.moduleId, iCanByModule.get(m.moduleId)),
  })
  const rows = CURRICULUM.map(toRow)
  const pilot = rows.filter(r => pilotIds.has(r.moduleId))
  const rest = rows.filter(r => !pilotIds.has(r.moduleId))

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <style>{`@media print { @page { size: A4 portrait; margin: 12mm; } body { background: #fff !important; } .no-print { display: none !important; } }`}</style>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton label="Print the coverage sheet" />
        </div>

        <div style={{ ...mono, color: 'var(--green-dark)', margin: '18px 0 4px' }}>What is done, and what is left</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          Lesson tracker
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '640px', marginBottom: '10px' }}>
          Every lesson ticks itself as you go: reading it, printing the pack, opening it on the board,
          reaching the finish, filling the passport page. A lesson goes green when everything that applies
          to it is done, which is why the tick is worth something. Open any lesson to see what is left on it.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, maxWidth: '640px', marginBottom: '26px' }}>
          Counted on this screen only, in this browser. It records that a lesson was delivered and never who
          was in the room: we hold no pupil data and no teacher accounts, which is what lets a school start in
          a week. A different laptop shows nothing, a shared classroom machine shows the last teacher&rsquo;s,
          and clearing the browser clears it. Print it for your file before you clear it.
        </p>

        <HubTracker pilot={pilot} rest={rest} pilotPhase={phase} />
      </div>
    </main>
  )
}
