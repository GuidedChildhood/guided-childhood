import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'
import { eyebrow } from '@/components/ui'
import {
  FRENCH_UNITS, LEVEL_LABEL, lessonLabel, lessonsOf, mediaUrl, sheetList,
  type FrenchUnit, type Level, type SheetFile,
} from '@/lib/languages/french'
import { body, card, langEyebrow, small } from '../_ui'

// /languages/fr/print: THE FRENCH PRINT ROOM (10 November 2026).
//
// Justin: "a way to get to the resources". A sheet used to be two taps deep,
// inside its unit and then its lesson, which is right for teaching a lesson
// and wrong for the Sunday evening photocopy run. This is every printable in
// the scheme on one page, by unit, the way /print is for the digital lessons.
//
// THREE VERSIONS, ONE ROW. The scheme makes most sheets three times: for the
// class, adapted, and inclusion. A teacher wants one of those for a given
// child, so each resource is one row with its versions side by side, and the
// chips at the top narrow the page to a single version. The filter is a link
// (?level=), so it works with no script and a filtered page can be bookmarked.
//
// Generated from the scheme's own data, so a unit finished on the author's
// site appears here on the next sync.

export const metadata = { title: 'French print room' }

const LEVELS: Level[] = ['class', 'challenge', 'adapted', 'inclusion']
const isLevel = (v: string | undefined): v is Level => !!v && (LEVELS as string[]).includes(v)
const levelOf = (f: SheetFile): Level => f.lv ?? 'class'

type Group = { label: string; files: SheetFile[] }

/** Everything printable in one unit, in the order a teacher meets it. */
function groupsOf(u: FrenchUnit): Group[] {
  const d = u.deck
  if (!d) return []
  return [
    { label: 'Word mats', files: sheetList(d.wordMats) },
    { label: 'What I can do', files: sheetList(d.whatICanDo) },
    ...lessonsOf(u).map(l => ({ label: `${lessonLabel(l)}: ${l.title}`, files: sheetList(l.deck?.files) })),
    { label: 'Extra activities', files: sheetList(d.activities) },
    { label: 'Assessment', files: sheetList(d.assessment) },
    { label: 'For the teacher', files: sheetList(d.teacher) },
  ].filter(g => g.files.length > 0)
}

const chip = (on: boolean): React.CSSProperties => ({
  ...eyebrow, display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 var(--space-3)',
  borderRadius: 'var(--radius-tile)', textDecoration: 'none',
  border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
  background: on ? 'var(--stage-1)' : 'var(--white)', color: on ? 'var(--ink)' : 'var(--ink-muted)',
})

export default async function FrenchPrintRoom({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams
  const only = isLevel(level) ? level : null
  const show = (f: SheetFile) => !only || levelOf(f) === only
  const units = FRENCH_UNITS.filter(u => u.deck && u.slug)
  const waiting = FRENCH_UNITS.filter(u => u.ready && !u.deck)
  const total = units.reduce((n, u) => n + groupsOf(u).reduce((m, g) => m + g.files.filter(show).length, 0), 0)

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>Every sheet in one place</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          French print room
        </h1>
        <p style={{ ...body, maxWidth: '660px' }}>
          Word mats, worksheets, games, assessments and the teacher sheets for every unit that has its slides.
          Most come in three versions: for the class, adapted, and inclusion. Each opens ready to print.
        </p>
      </div>

      <nav aria-label="Version" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
        <Link href="/languages/fr/print" style={chip(!only)} aria-current={!only ? 'true' : undefined}>All versions</Link>
        {LEVELS.map(lv => (
          <Link key={lv} href={`/languages/fr/print?level=${lv}`} style={chip(only === lv)} aria-current={only === lv ? 'true' : undefined}>
            {LEVEL_LABEL[lv]}
          </Link>
        ))}
        <span style={{ ...small, marginLeft: 'var(--space-2)' }}>{total} to print</span>
      </nav>

      {units.length > 1 && (
        <nav aria-label="Units" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          {units.map(u => (
            <a key={u.key} href={`#${u.key}`} style={{ ...small, color: 'var(--terracotta-dark)', fontWeight: 700 }}>
              Year {u.year}: <span lang="fr">{u.fr}</span>
            </a>
          ))}
        </nav>
      )}

      {units.map(u => {
        const groups = groupsOf(u).map(g => ({ ...g, files: g.files.filter(show) })).filter(g => g.files.length > 0)
        const songs = u.deck?.songs ?? []
        return (
          <section key={u.key} id={u.key} style={{ ...card, scrollMarginTop: 'var(--space-7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <div>
                <div style={langEyebrow}>Year {u.year} · Half term {u.ht}</div>
                <h2 lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: 'var(--space-1) 0 0' }}>{u.fr}</h2>
                <div style={small}>{u.en}</div>
              </div>
              <Link href={`/languages/fr/${u.key}`} style={{ ...small, color: 'var(--terracotta-dark)', fontWeight: 700 }}>Open the unit</Link>
            </div>

            {groups.length === 0 && <p style={{ ...small, marginTop: 'var(--space-3)' }}>Nothing in this version for this unit.</p>}

            {groups.map(g => (
              <div key={g.label} style={{ borderTop: '1px solid var(--border)', marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>{g.label}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-2)' }}>
                  {g.files.map(f => (
                    <li key={f.f}>
                      <a href={mediaUrl(u.slug!, f.f, 'sheet')} target="_blank" rel="noopener" className="gc-fr-sheet" style={{
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 56, height: '100%',
                        background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)',
                        padding: 'var(--space-2) var(--space-3)', textDecoration: 'none',
                      }}>
                        <span style={{ ...eyebrow, color: levelOf(f) === 'class' ? 'var(--ink-muted)' : 'var(--terracotta-dark)' }}>{LEVEL_LABEL[levelOf(f)]}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.4 }}>{f.t}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {!only && songs.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>Songs to play</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {songs.map(s => (
                    <li key={s.f}>
                      <a href={mediaUrl(u.slug!, s.f, 'deck')} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                        ▶ {s.t}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )
      })}

      {waiting.length > 0 && (
        <p style={small}>
          Still to come: the sheets for{' '}
          {waiting.map((u, i) => (
            <span key={u.key}>{i > 0 ? (i === waiting.length - 1 ? ' and ' : ', ') : ''}Year {u.year} <span lang="fr">{u.fr}</span></span>
          ))}
          , which arrive with their slides.
        </p>
      )}
      <style>{`.gc-fr-sheet:hover { border-color: var(--terracotta) !important; } .gc-fr-sheet:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }`}</style>
    </div>
  )
}
