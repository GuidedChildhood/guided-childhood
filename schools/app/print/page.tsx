import { db as supabase } from '@/lib/supabase/server-db'
import { isStandaloneModule } from '@/lib/taster'
import Link from 'next/link'
import { CURRICULUM, CHARACTERS, KEY_STAGE_META, KEY_STAGE_ORDER, type KeyStage, positionOf } from '@gc/shared/schools-curriculum'
import { friendFor, FriendArt } from '@/components/print/kit'
import Reveal from '@/components/Reveal'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'

// THE PRINT ROOM: every printable for every live module in one place.
// Paper pack, pupil booklets, and named quizzes per class. No Canva,
// no downloads folder: everything generates from the lesson row and
// prints from the browser.
//
// ONE ROW PER LESSON, AND THE LESSON OPENS (10 November 2026).
//
// The history, because this page has now been three shapes. It began as 25
// cards with six buttons each. The schools review of 13 September 2026 made
// it a table by key stage, so a teacher scanned one row instead of reading
// 150 buttons. That was right about scanning and it left the buttons: 34
// lessons by seven sheets is 238 identical pills, the seventh column ran off
// the edge of a laptop, and on a phone only the first column showed at all.
// Justin, 10 November: "much tidier, neater, Apple style, simpleness".
//
// So the page now asks one question at a time. First which lesson: a plain
// list, one line each, grouped by key stage. Then which sheet: the lesson
// opens in place and shows its seven, each with a line saying what it is,
// which the pills never had room for. A teacher sees 34 things, then 7,
// never 238. Nothing was removed; every sheet is still one tap from its
// lesson.
//
// NO SCRIPT. Each lesson is a native <details>, so it opens with the
// keyboard, with a screen reader, and with JavaScript off. They share a
// name, so opening one closes the last and the page never becomes the wall
// of buttons again. The page stays static and cached, as before.

export const metadata = { title: 'The print room' }

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

// The paper pack leads because it is the one most lessons need: one print
// run and the lesson can be taught with no screen at all.
const SHEETS: { path: string; label: string; note: string }[] = [
  { path: '', label: 'Paper pack', note: 'Everything for the lesson in one print run' },
  { path: '/booklet', label: 'Pupil booklet', note: 'One for each child to hold' },
  { path: '/organiser', label: 'Knowledge organiser', note: 'The key ideas on one page' },
  { path: '/overview', label: 'Unit overview', note: 'The lesson on a page, for your planning' },
  { path: '/starter-quiz', label: 'Starter quiz', note: 'Four questions before you teach, with answers' },
  { path: '/exit-quiz', label: 'Exit quiz', note: 'Five questions at the end, with answers' },
  { path: '/record', label: 'Learning record', note: 'One side of A4 for each pupil' },
]

export const revalidate = 3600

export default async function PrintRoomPage() {
  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band')
    .order('sort_order')

  const manifestByModule = new Map(CURRICULUM.map(m => [m.moduleId, m]))
  // The print room is the scheme's, so a standalone lesson (lib/taster.ts)
  // stays out of it: its pack opens from its own lesson page. The manifest is
  // the test as well as the standalone list (26 September 2026): a standalone
  // row is applied to production before the code naming it merges, and in that
  // window "not standalone" read it as a scheme lesson. Only the manifest's
  // own lessons are the scheme's, so only they are listed here.
  const live = (lessons ?? []).filter(l => manifestByModule.has(l.module_id) && !isStandaloneModule(l.module_id))
  const byStage = KEY_STAGE_ORDER
    .map(ks => ({ ks, rows: live.filter(l => (manifestByModule.get(l.module_id)?.keyStage ?? l.key_stage) === ks) }))
    .filter(g => g.rows.length > 0)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: 'var(--space-1)' }}>Everything on paper, one place</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          The print room
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '600px', margin: '0 0 var(--space-4)' }}>
          Every sheet is made from the lesson itself, so it always matches what is on the board.
          Choose a lesson to see what you can print.
        </p>

        {byStage.length > 1 && (
          <nav aria-label="Key stages" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
            {byStage.map(({ ks, rows }) => (
              <a key={ks} href={`#${ks}`} className="gc-pr-stage">
                {KEY_STAGE_META[ks as KeyStage].years}
                <span style={{ color: 'var(--ink-muted)', fontWeight: 600 }}>{rows.length}</span>
              </a>
            ))}
          </nav>
        )}

        {byStage.map(({ ks, rows }) => {
          const meta = KEY_STAGE_META[ks as KeyStage]
          // A year band is worth a line only where it differs from its
          // neighbours' ("Years 7 and 8" inside Years 7 to 9). Repeated on
          // every row it is noise the heading has already said.
          const counts = new Map<string, number>()
          for (const r of rows) counts.set(r.year_band, (counts.get(r.year_band) ?? 0) + 1)
          const usual = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
          return (
            <Reveal as="section" key={ks} style={{ marginBottom: 'var(--space-5)' }}>
              <h2 id={ks} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 var(--space-3)', scrollMarginTop: 'var(--space-7)' }}>
                <FriendArt friend={friendFor(null, ks)} mood="wave" size={9} />
                <span>{meta.years} <span style={{ ...eyebrow, marginLeft: 'var(--space-1)' }}>{meta.label}</span></span>
              </h2>
              <div className="gc-pr-list">
                {rows.map(l => {
                  const manifest = manifestByModule.get(l.module_id)
                  const n = manifest ? positionOf(manifest.moduleId)?.index : null
                  return (
                    <details key={l.module_id} name="print-room-lesson" className="gc-pr-lesson">
                      <summary>
                        <span aria-hidden className="gc-pr-n">{n ?? ''}</span>
                        <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.3 }}>{l.title}</span>
                          {l.year_band !== usual && <span style={{ ...eyebrow, display: 'block', marginTop: 'var(--space-1)' }}>{l.year_band}</span>}
                        </span>
                        <span aria-hidden className="gc-pr-chev">›</span>
                      </summary>
                      <ul className="gc-pr-sheets">
                        {SHEETS.map((s, i) => (
                          <li key={s.path}>
                            <Link href={`/print/${l.module_id}${s.path}`} className={i === 0 ? 'gc-pr-sheet gc-pr-sheet-lead' : 'gc-pr-sheet'} aria-label={`${s.label}: ${l.title}`}>
                              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{s.label}</span>
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{s.note}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )
                })}
              </div>
            </Reveal>
          )
        })}
        {live.length === 0 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-muted)' }}>
            No live modules yet. Sheets appear here the moment a module ships.
          </p>
        )}

        {/* The passport is not a lesson's sheet, so it sits after the lessons
            rather than above them, where it used to be the first thing on a
            page about something else. */}
        <Reveal>
          <Link className="gc-tap gc-pr-passport" href="/print/passport">
            <div style={{ display: 'flex', flexShrink: 0 }}>
              {(['pebble', 'bloop', 'orbit', 'nova'] as const).map((k, i) => <span key={k} style={{ marginLeft: i ? '-10px' : 0 }}><FriendArt friend={{ key: k, ...CHARACTERS[k] }} mood="wave" size={11} /></span>)}
            </div>
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <div style={{ ...eyebrow, color: 'var(--terracotta-dark)' }}>Also here · print, fold, cut, stick</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', lineHeight: 1.2, color: 'var(--ink)' }}>The passport print out</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>One sheet folds into a passport, one sheet of stickers fills it. One per child, four editions, Reception to Year 11.</div>
            </div>
            <span aria-hidden className="gc-pr-chev" style={{ color: 'var(--terracotta-dark)' }}>›</span>
          </Link>
        </Reveal>
      </div>
      <style>{`
        .gc-pr-stage {
          display: inline-flex; align-items: center; gap: var(--space-2); min-height: 44px; padding: 0 var(--space-3);
          font-family: var(--font-display); font-weight: 800; font-size: var(--text-sm); color: var(--ink);
          text-decoration: none; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-tile);
          transition: border-color .15s ease, transform .15s ease;
        }
        .gc-pr-stage:hover { border-color: var(--terracotta); transform: translateY(-1px); }
        .gc-pr-list {
          background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden;
          box-shadow: 0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28);
        }
        .gc-pr-lesson + .gc-pr-lesson { border-top: 1px solid var(--border); }
        .gc-pr-lesson > summary {
          display: flex; align-items: center; gap: var(--space-3); min-height: 60px;
          padding: var(--space-2) var(--space-4); cursor: pointer; list-style: none;
          transition: background-color .15s ease;
        }
        .gc-pr-lesson > summary::-webkit-details-marker { display: none; }
        .gc-pr-lesson > summary:hover { background: var(--warm); }
        .gc-pr-lesson > summary:focus-visible { outline: none; box-shadow: inset 0 0 0 3px var(--terracotta); }
        .gc-pr-lesson[open] > summary { background: var(--warm); }
        .gc-pr-n {
          flex: none; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
          background: var(--butter-lt); font-family: var(--font-display); font-weight: 900; font-size: var(--text-sm); color: var(--ink);
        }
        .gc-pr-chev {
          flex: none; font-family: var(--font-display); font-weight: 800; font-size: var(--text-xl); line-height: 1; color: var(--ink-light);
          transition: transform .22s cubic-bezier(0.22,1,0.36,1), color .15s ease;
        }
        .gc-pr-lesson[open] > summary .gc-pr-chev { transform: rotate(90deg); color: var(--terracotta-dark); }
        .gc-pr-sheets {
          list-style: none; margin: 0; padding: var(--space-3) var(--space-4) var(--space-4);
          display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--space-2);
          background: var(--warm); animation: gc-pr-open .28s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes gc-pr-open { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .gc-pr-sheet {
          display: flex; flex-direction: column; gap: var(--space-1); height: 100%; min-height: 72px; justify-content: center;
          padding: var(--space-3); text-decoration: none; background: var(--white);
          border: 1px solid var(--border); border-radius: var(--radius-tile);
          transition: border-color .15s ease, transform .15s ease, box-shadow .15s ease;
        }
        .gc-pr-sheet:hover { border-color: var(--terracotta); transform: translateY(-2px); box-shadow: 0 10px 20px -14px rgba(23,60,70,0.45); }
        .gc-pr-sheet:focus-visible, .gc-pr-stage:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        .gc-pr-sheet-lead { background: var(--stage-1); border-color: var(--terracotta); }
        .gc-pr-passport {
          display: flex; align-items: center; gap: var(--space-4); text-decoration: none;
          background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card);
          padding: var(--space-4);
          box-shadow: 0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28);
        }
        @media (max-width: 560px) {
          .gc-pr-lesson > summary { padding: var(--space-2) var(--space-3); }
          .gc-pr-sheets { padding: var(--space-3); grid-template-columns: 1fr; }
          .gc-pr-passport { flex-wrap: wrap; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gc-pr-sheets { animation: none; }
          .gc-pr-chev, .gc-pr-sheet, .gc-pr-stage, .gc-pr-lesson > summary { transition: none; }
          .gc-pr-sheet:hover, .gc-pr-stage:hover { transform: none; }
        }
        @media print { .gc-pr-lesson > .gc-pr-sheets { display: grid; } }
      `}</style>
    </main>
  )
}
