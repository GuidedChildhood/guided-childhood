import { db as supabase } from '@/lib/supabase/server-db'
import { isStandaloneModule } from '@/lib/taster'
import Link from 'next/link'
import { CURRICULUM, CHARACTERS, KEY_STAGE_META, KEY_STAGE_ORDER, type KeyStage, positionOf } from '@gc/shared/schools-curriculum'
import { friendFor, FriendArt } from '@/components/print/kit'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'

// THE PRINT ROOM: every printable for every live module in one place.
// Paper pack, pupil booklets, and named quizzes per class. No Canva,
// no downloads folder: everything generates from the lesson row and
// prints from the browser.
//
// A TABLE BY KEY STAGE, not 25 identical cards with six buttons each. A
// teacher looking for the Year 8 exit quiz scans one row in one block and
// is done; the cards made them read 150 buttons (the schools review, 13
// September 2026). On a phone the table scrolls inside its own frame and the
// page never scrolls sideways.

export const metadata = { title: 'The print room' }

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const cell: React.CSSProperties = {
  padding: 'var(--space-3) var(--space-3)', borderTop: '1px solid var(--border)', verticalAlign: 'middle',
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)',
}
const head: React.CSSProperties = {
  ...eyebrow, padding: '0 10px 8px', textAlign: 'left', whiteSpace: 'nowrap',
}
const sheet: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', minHeight: '40px', padding: '0 12px',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
  color: 'var(--ink)', textDecoration: 'none', whiteSpace: 'nowrap',
  border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', background: '#fff',
}

const SHEETS: { path: string; label: string }[] = [
  { path: '', label: 'Pack' },
  { path: '/booklet', label: 'Booklet' },
  { path: '/organiser', label: 'Organiser' },
  { path: '/overview', label: 'Overview' },
  { path: '/starter-quiz', label: 'Starter' },
  { path: '/exit-quiz', label: 'Exit' },
  { path: '/record', label: 'Record' },
]

export const revalidate = 3600

export default async function PrintRoomPage() {
  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band')
    .order('sort_order')

  const manifestByModule = new Map(CURRICULUM.map(m => [m.moduleId, m]))
  // The print room is the scheme's, so a standalone lesson (lib/taster.ts)
  // stays out of it: its pack opens from its own lesson page.
  const live = (lessons ?? []).filter(l => !isStandaloneModule(l.module_id))
  const byStage = KEY_STAGE_ORDER
    .map(ks => ({ ks, rows: live.filter(l => (manifestByModule.get(l.module_id)?.keyStage ?? l.key_stage) === ks) }))
    .filter(g => g.rows.length > 0)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '4px' }}>Everything on paper, one place</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          The print room
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '620px', marginBottom: '26px' }}>
          Every sheet generates from the lesson itself, so a wording change updates every page.
          Print from your browser: the paper pack for the classroom, the booklet per pupil, the
          knowledge organiser, the unit overview, and the two quizzes with their answer versions one tap away.
        </p>

        <Link className="gc-tap" href="/print/passport" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', textDecoration: 'none', color: 'var(--ink)', background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4) var(--space-4)', marginBottom: '28px', boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)' }}>
          <div style={{ display: 'flex' }}>
            {(['pebble', 'bloop', 'orbit', 'nova'] as const).map((k, i) => <span key={k} style={{ marginLeft: i ? '-10px' : 0 }}><FriendArt friend={{ key: k, ...CHARACTERS[k] }} mood="wave" size={11} /></span>)}
          </div>
          <div style={{ flex: '1 1 auto' }}>
            <div style={{ ...eyebrow, color: 'var(--terracotta-dark)' }}>New · print, fold, cut, stick</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', lineHeight: 1.2 }}>The passport print out</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>One sheet folds into a passport, one sheet of stickers fills it. One per child, four editions, Reception to Year 11.</div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', whiteSpace: 'nowrap' }}>Open →</span>
        </Link>
        {byStage.map(({ ks, rows }) => {
          const meta = KEY_STAGE_META[ks as KeyStage]
          return (
            <section key={ks} style={{ marginBottom: '28px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 8px' }}>
                <FriendArt friend={friendFor(null, ks)} mood="wave" size={9} />
                <span>{meta.label} <span style={{ fontWeight: 700, fontSize: '0.8em', color: 'var(--ink-muted)' }}>{meta.years}</span></span>
              </h2>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'var(--space-3) var(--space-2) var(--space-2)', overflowX: 'auto', boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '640px' }}>
                  <thead>
                    <tr>
                      <th style={head}>Module</th>
                      {SHEETS.map(s => <th key={s.path} style={head}>{s.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(l => {
                      const manifest = manifestByModule.get(l.module_id)
                      return (
                        <tr key={l.module_id}>
                          <td style={{ ...cell, minWidth: '220px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              {manifest && <FriendArt friend={{ key: manifest.character, ...CHARACTERS[manifest.character] }} mood="happy" size={8} />}
                              <span>
                                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.25 }}>
                                  {manifest ? `${positionOf(manifest.moduleId)?.index ?? ''}. ` : ''}{l.title}
                                </span>
                                <span style={{ ...eyebrow, fontSize: 'var(--text-xs)' }}>{l.year_band}</span>
                              </span>
                            </div>
                          </td>
                          {SHEETS.map(s => (
                            <td key={s.path} style={cell}>
                              <Link href={`/print/${l.module_id}${s.path}`} style={sheet} aria-label={`${s.label}: ${l.title}`}>{s.label}</Link>
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )
        })}
        {live.length === 0 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-muted)' }}>
            No live modules yet. Sheets appear here the moment a module ships.
          </p>
        )}
      </div>
    </main>
  )
}
