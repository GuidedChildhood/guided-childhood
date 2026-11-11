import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'
import Reveal from '@/components/Reveal'
import { eyebrow } from '@/components/ui'
import { assessedCodes, FRENCH_UNITS, FRENCH_YEARS, lessonsOf, SKILL_LABEL, soloName } from '@/lib/languages/french'
import { body, card, langEyebrow, small } from '../_ui'

// /languages/fr/plan: PLAN AND ASSESS, the paperwork room (10 November 2026).
//
// Three things a teacher or a subject lead looks up, none of which is
// teaching a lesson, so they share one room instead of taking a tab each:
//
//   0. the school's own record: progress, class by class (/languages/fr/progress)
//   0b. the handbook the scheme's author wrote for a head: how progress is
//       assessed, the curriculum, how the lessons work (11 November 2026)
//   1. the lesson plans, by unit, ready to print
//   2. assessment across the year: which statements each half term assesses
//   3. the coverage grid against the KS2 programme of study
//
// The assessment table is the scheme's own: every half term of both years,
// including the ones still being written, because a subject lead plans the
// year before the slides exist.

export const metadata = { title: 'French: plan and assess' }

export default function FrenchPlanRoom() {
  const withPlans = FRENCH_UNITS.filter(u => u.deck)
  const skills = Object.entries(SKILL_LABEL)

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 French</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          Plan and assess
        </h1>
        <p style={{ ...body, maxWidth: '600px' }}>
          Where each class is, the lesson plans to print, what each half term assesses, and where the national
          curriculum is covered.
        </p>
      </div>

      <Link href="/languages/fr/progress" className="gc-fr-tile" style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', textDecoration: 'none', borderLeft: '4px solid var(--terracotta)' }}>
        <span style={{ minWidth: 0 }}>
          <span style={{ ...langEyebrow, display: 'block' }}>Your school&apos;s record</span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, marginTop: 'var(--space-1)' }}>Progress, class by class</span>
          <span style={{ ...small, display: 'block' }}>Which lessons each class has had, and how pupils are doing against each statement. It fills itself in.</span>
        </span>
        <span aria-hidden style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--ink-light)' }}>›</span>
      </Link>

      <section aria-labelledby="handbook">
        <h2 id="handbook" style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>For a head or a subject lead</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
          {[
            { href: '/languages/fr/assessment', title: 'How progress is assessed', line: 'Same statements in both years: where the progress shows, and how it is recorded' },
            { href: '/languages/fr/curriculum', title: 'The curriculum', line: 'What it is for, the long term plan for each year, and how learning builds' },
            { href: '/languages/fr/approach', title: 'How the lessons work', line: 'The seven steps of every lesson, the thinking behind them, the activities' },
          ].map((t, i) => (
            <Reveal key={t.href} delay={i * 0.05} y={14}>
              <Link href={t.href} className="gc-fr-tile" style={{ ...card, display: 'block', height: '100%', textDecoration: 'none' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2 }}>{t.title}</span>
                <span style={{ ...small, display: 'block', marginTop: 'var(--space-1)' }}>{t.line}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="plans">
        <h2 id="plans" style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>Lesson plans, ready to print</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
          {withPlans.map((u, i) => (
            <Reveal key={u.key} delay={i * 0.05} y={14}>
              <Link href={`/languages/fr/${u.key}/plans`} className="gc-fr-tile" style={{ ...card, display: 'block', height: '100%', textDecoration: 'none' }}>
                <span style={{ ...langEyebrow, display: 'block' }}>Year {u.year} · Half term {u.ht}</span>
                <span lang="fr" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, marginTop: 'var(--space-1)' }}>{u.fr}</span>
                <span style={{ ...small, display: 'block' }}>Unit overview and {lessonsOf(u).length} lesson plans</span>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={withPlans.length * 0.05} y={14}>
            <Link href="/languages/fr/coverage" className="gc-fr-tile" style={{ ...card, display: 'block', height: '100%', textDecoration: 'none', background: 'var(--warm)' }}>
              <span style={{ ...langEyebrow, display: 'block' }}>Both years</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, marginTop: 'var(--space-1)' }}>Curriculum coverage</span>
              <span style={{ ...small, display: 'block' }}>Every KS2 statement against every half term</span>
            </Link>
          </Reveal>
        </div>
        <p style={{ ...small, margin: 'var(--space-2) 0 0' }}>The plans for a unit appear here when its slides are finished.</p>
      </section>

      <section aria-labelledby="assess" style={{ marginTop: 'var(--space-3)' }}>
        <h2 id="assess" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>Assessment across the year</h2>
        <p style={{ ...body, maxWidth: '680px', margin: 0 }}>
          Each half term assesses three or four national curriculum statements. The letter is the skill:{' '}
          {skills.map(([k, v], i) => <span key={k}>{i > 0 && ', '}<b style={{ color: 'var(--ink)' }}>{k}</b> {v.toLowerCase()}</span>)}.
          Pupils are recorded at {soloName(3)}, {soloName(4)} or {soloName(5)}{' '}
          on the What I can do sheet for each unit.
        </p>

        {FRENCH_YEARS.map(year => (
          <div key={year} style={{ marginTop: 'var(--space-4)' }}>
            <h3 style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>Year {year}</h3>
            <ol className="gc-fr-assess">
              {FRENCH_UNITS.filter(u => u.year === year).map(u => {
                const codes = assessedCodes(u)
                return (
                  <li key={u.key}>
                    <div className="gc-fr-assess-unit">
                      <span aria-hidden className="gc-fr-assess-ht" data-ready={u.ready || undefined}>{u.ht}</span>
                      <span style={{ minWidth: 0 }}>
                        {u.ready
                          ? <Link href={`/languages/fr/${u.key}`} lang="fr" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{u.fr}</Link>
                          : <span lang="fr" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink-muted)' }}>{u.fr}</span>}
                        <span style={{ ...small, display: 'block' }}>{u.en}{u.ready ? '' : ' · being written'}</span>
                      </span>
                    </div>
                    <ul className="gc-fr-assess-codes">
                      {codes.map(c => (
                        <li key={c.code}><span className="gc-fr-code">{c.code}</span><span>{c.pupil}</span></li>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </section>

      <style>{`
        .gc-fr-tile { transition: transform .2s cubic-bezier(0.22,1,0.36,1), border-color .15s ease; }
        .gc-fr-tile:hover { transform: translateY(-2px); border-color: var(--terracotta); }
        .gc-fr-tile:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        .gc-fr-assess { list-style: none; margin: 0; padding: 0; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden; }
        .gc-fr-assess > li { display: grid; grid-template-columns: minmax(0, 260px) minmax(0, 1fr); gap: var(--space-4); padding: var(--space-3) var(--space-4); }
        .gc-fr-assess > li + li { border-top: 1px solid var(--border); }
        .gc-fr-assess-unit { display: flex; align-items: flex-start; gap: var(--space-3); }
        .gc-fr-assess-ht {
          flex: none; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 900; font-size: var(--text-sm); color: var(--ink-muted); background: var(--warm); border: 1px solid var(--border);
        }
        .gc-fr-assess-ht[data-ready] { background: var(--terracotta); border-color: var(--terracotta); color: var(--ink); }
        .gc-fr-assess-codes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-1); font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-soft); line-height: 1.5; }
        .gc-fr-assess-codes > li { display: flex; gap: var(--space-2); align-items: baseline; }
        .gc-fr-code { flex: none; min-width: 32px; font-family: var(--font-mono); font-weight: 600; font-size: var(--text-xs); color: var(--terracotta-dark); }
        @media (max-width: 640px) { .gc-fr-assess > li { grid-template-columns: 1fr; gap: var(--space-2); padding: var(--space-3); } .gc-fr-assess-codes { padding-left: calc(32px + var(--space-3)); } }
        @media (prefers-reduced-motion: reduce) { .gc-fr-tile { transition: none; } .gc-fr-tile:hover { transform: none; } }
      `}</style>
    </div>
  )
}
