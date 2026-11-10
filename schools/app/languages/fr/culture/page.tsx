import { PAGE } from '@gc/shared/page-scale'
import { eyebrow } from '@/components/ui'
import { cultureLessons, FRENCH_UNITS, FRENCH_YEARS } from '@/lib/languages/french'
import { body, Crumbs, langEyebrow, LessonRow, LessonRowStyles, small } from '../_ui'

// /languages/fr/culture: every culture lesson in the scheme, by year
// (10 November 2026). On the Teach page a year shows its own; this is the
// whole list, for the teacher planning the last week of term. The scheme
// keeps these outside the units, taught but not assessed, and says so.

export const metadata = { title: 'French culture lessons' }

export default function FrenchCulture() {
  const years = FRENCH_YEARS
    .map(year => ({ year, rows: FRENCH_UNITS.filter(u => u.year === year).flatMap(u => cultureLessons(u).map(l => ({ u, l }))) }))
    .filter(y => y.rows.length > 0)

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <Crumbs trail={[{ href: '/languages/fr', label: 'French' }, { label: 'Culture lessons' }]} />
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 French · Culture</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          Culture lessons
        </h1>
        <p style={{ ...body, maxWidth: '600px' }}>
          Lessons about life in France and French speaking countries. They sit outside the units and are not assessed.
        </p>
      </div>

      {years.map(({ year, rows }) => (
        <section key={year} aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`} style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>Year {year}</h2>
          <ul className="gc-fr-list">
            {rows.map(({ u, l }) => (
              <LessonRow key={`${u.key}-${l.n}`} unitKey={u.key} n={l.n} mark="★" title={l.title} detail={`${l.culture} · half term ${u.ht}, goes with ${u.fr}`} hasSlides={!!l.deck?.slides} />
            ))}
          </ul>
        </section>
      ))}
      {years.length === 0 && <p style={small}>The first culture lessons are still being written.</p>}

      <LessonRowStyles />
    </div>
  )
}
