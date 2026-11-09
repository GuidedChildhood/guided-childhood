import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'
import PrintButton from '@/components/PrintButton'
import { eyebrow } from '@/components/ui'
import { FRENCH_UNITS, KS2_STATEMENTS } from '@/lib/languages/french'
import { body, card, Crumbs, langEyebrow, small } from '../_ui'

// /languages/fr/coverage: the KS2 languages programme of study against every
// unit. Generated from the statements each unit names as assessed, so the
// grid is the scheme's own plan and cannot drift from it. A unit that is not
// ready yet is shown faint: its statements are planned, not yet teachable,
// and a subject lead must be able to tell those apart.

export const metadata = { title: 'French curriculum coverage' }

export default function FrenchCoverage() {
  const codes = Object.keys(KS2_STATEMENTS)
  const units = FRENCH_UNITS
  const has = (key: string, code: string) => !!units.find(u => u.key === key)?.plan.codes?.some(c => c.code === code)
  const readyCount = (code: string) => units.filter(u => u.ready && has(u.key, code)).length
  const plannedCount = (code: string) => units.filter(u => has(u.key, code)).length
  const gaps = codes.filter(c => plannedCount(c) === 0)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Crumbs trail={[{ href: '/languages', label: 'Languages' }, { href: '/languages/fr', label: 'French' }, { label: 'Coverage' }]} />
          <PrintButton label="Print the coverage grid" />
        </div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 languages programme of study</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
          Where each statement is assessed
        </h1>
        <p style={{ ...body, maxWidth: '680px' }}>
          Each column is a half term, each row a statement from the national curriculum for languages at key
          stage 2. A filled mark means the unit assesses it and is ready to teach; an outlined mark means it is
          planned in a unit still being written.
          {gaps.length === 0 ? ' Every statement is planned somewhere across the two years.' : ` ${gaps.length} statement${gaps.length === 1 ? ' is' : 's are'} not yet planned in any unit.`}
        </p>
      </div>

      <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '880px' }}>
          <thead>
            <tr>
              <th scope="col" style={{ ...eyebrow, textAlign: 'left', padding: 'var(--space-3)' }}>Statement</th>
              {units.map(u => (
                <th key={u.key} scope="col" style={{ ...eyebrow, padding: 'var(--space-2) var(--space-1)', textAlign: 'center', color: u.ready ? 'var(--ink)' : 'var(--ink-light)' }}>
                  {u.ready ? <Link href={`/languages/fr/${u.key}`} style={{ color: 'inherit' }}>Y{u.year} HT{u.ht}</Link> : <>Y{u.year} HT{u.ht}</>}
                </th>
              ))}
              <th scope="col" style={{ ...eyebrow, padding: 'var(--space-2)', textAlign: 'center' }}>Ready</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(code => (
              <tr key={code} style={{ borderTop: '1px solid var(--border)' }}>
                <th scope="row" style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', fontWeight: 400, maxWidth: '340px' }}>
                  <span style={{ ...langEyebrow, display: 'block' }}>{code}</span>
                  <span style={{ ...small, color: 'var(--ink)' }}>{KS2_STATEMENTS[code]}</span>
                </th>
                {units.map(u => {
                  const on = has(u.key, code)
                  return (
                    <td key={u.key} style={{ textAlign: 'center', padding: 'var(--space-1)' }}>
                      {on && (
                        <span role="img" aria-label={u.ready ? 'assessed, ready' : 'planned'} style={{
                          display: 'inline-block', width: 16, height: 16, borderRadius: '50%',
                          background: u.ready ? 'var(--retro-green)' : 'transparent',
                          border: `2px solid ${u.ready ? 'var(--retro-green)' : 'var(--ink-light)'}`,
                        }} />
                      )}
                    </td>
                  )
                })}
                <td style={{ ...small, textAlign: 'center', color: 'var(--ink)', fontWeight: 700 }}>{readyCount(code)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={small}>
        This shows where the scheme plans each statement and which units are ready. It is not a record of what a
        class has been taught.
      </p>
    </div>
  )
}
