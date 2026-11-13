import { PAGE } from '@gc/shared/page-scale'
import { FR_HANDBOOK, FR_PAGE } from '@/lib/languages/french'
import { body, Callout, card, Cards, Crumbs, Flow, Fold, FoldStyles, langEyebrow, Part, small } from '../_ui'

// /languages/fr/approach: HOW THE LESSONS WORK, AND WHY (11 November 2026).
//
// A teacher who is not a linguist can run these lessons because every one has
// the same shape. This page is that shape and the reasons for it, written by
// the scheme's author on her own site and synced here: the seven steps, her
// answers to "why do we do it this way", the activities and what each is for,
// the two class toys, and the four levels of work.
//
// Her reasons fold away one line each, because a teacher reads one or two of
// them, not thirteen.

export const metadata = { title: 'French: how the lessons work' }

export default function FrenchApproach() {
  const P = FR_PAGE
  const H = FR_HANDBOOK
  const acts = P.activities ?? {}
  const games = (acts.lesson ?? []).filter(r => r[0] !== 'Marie and Pierre')
  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <Crumbs trail={[{ href: '/languages/fr/plan', label: 'Plan and assess' }, { label: 'How the lessons work' }]} />
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 French · Pedagogy</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          How the lessons work
        </h1>
        <p style={{ ...body, maxWidth: '680px' }}>
          Every lesson has the same seven steps, so the class knows what is coming and you can teach it without
          being a French specialist. This is the shape, and the thinking behind it.
        </p>
      </div>

      {P.lesson && P.lesson.length > 0 && (
        <Part id="steps" title={`The ${P.lesson.length === 7 ? 'seven' : P.lesson.length} steps of every lesson`}>
          <ol className="gc-fr-seven" style={card}>
            {P.lesson.map(([step, timing, what], i) => (
              <li key={step}>
                <span aria-hidden className="gc-fr-seven-n">{i + 1}</span>
                <span style={{ minWidth: 0 }}>
                  <b style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{step}</b>{' '}
                  <span style={{ ...small }}>{timing}</span>
                  <span style={{ ...small, display: 'block', color: 'var(--ink)' }}>{what}</span>
                </span>
              </li>
            ))}
          </ol>
        </Part>
      )}

      {H.think && H.think.length > 0 && (
        <Part id="thinking" title="Our thinking">
          {H.believe && <Callout>{H.believe}</Callout>}
          <div className="gc-fr-folds">
            {H.think.map(([q, a]) => (
              <Fold key={q} label={q}><p style={{ ...body, margin: 0, color: 'var(--ink)' }}>{a}</p></Fold>
            ))}
          </div>
        </Part>
      )}

      {P.directAssociation && P.directAssociation.length > 0 && (
        <Part id="meaning" title="Meaning first, then the written word">
          <Cards rows={P.directAssociation} />
        </Part>
      )}

      {(games.length > 0 || acts.phonics || acts.assess) && (
        <Part id="activities" title="The activities, and what each is for">
          {H.goodGame && <Callout>{H.goodGame}</Callout>}
          <div className="gc-fr-folds">
            {games.length > 0 && <Fold label="Lesson activities" hint={`${games.length} games and tasks`}><Cards rows={games} /></Fold>}
            {acts.phonics && acts.phonics.length > 0 && <Fold label="Phonics games" hint={acts.phonics.map(r => r[0]).join(' · ')}><Cards rows={acts.phonics} /></Fold>}
            {acts.assess && acts.assess.length > 0 && <Fold label="Checking learning" hint={acts.assess.map(r => r[0]).join(' · ')}><Cards rows={acts.assess} /></Fold>}
          </div>
        </Part>
      )}

      {H.marie && H.marie.length > 0 && (
        <Part id="marie-and-pierre" title="Marie and Pierre">
          <p style={{ ...body, margin: 0 }}>The two toys at the heart of the lessons.</p>
          <Cards rows={H.marie} />
        </Part>
      )}

      {P.pupilResources && P.pupilResources.length > 0 && (
        <Part id="pupil-resources" title="Word mats and What I can do">
          <p style={{ ...body, margin: 0 }}>The two sheets pupils keep and use across each unit.</p>
          <Cards rows={P.pupilResources} />
        </Part>
      )}

      {(H.levels || P.inclusion) && (
        <Part id="inclusion" title="Four levels of work, for every pupil">
          {H.levels && H.levels.length > 0 && (
            <dl className="gc-fr-levels" style={card}>
              {H.levels.map(([level, who]) => (
                <div key={level}><dt>{level}</dt><dd>{who}</dd></div>
              ))}
            </dl>
          )}
          <Cards rows={P.inclusion} />
        </Part>
      )}

      {P.research && P.research.length > 0 && (
        <Part id="research" title="What this draws on">
          <p style={{ ...small, margin: 0 }}>The sources the scheme&apos;s author names for her approach.</p>
          <Cards rows={P.research} />
        </Part>
      )}

      <FoldStyles />
      <style>{`
        .gc-fr-seven { list-style: none; margin: 0; display: flex; flex-direction: column; gap: var(--space-3); }
        .gc-fr-seven > li { display: flex; gap: var(--space-3); align-items: flex-start; }
        .gc-fr-seven-n { flex: none; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--terracotta); color: var(--ink); font-family: var(--font-display); font-weight: 900; font-size: var(--text-sm); }
        .gc-fr-levels { margin: 0; display: flex; flex-direction: column; }
        .gc-fr-levels > div { display: grid; grid-template-columns: 140px minmax(0, 1fr); gap: var(--space-3); padding: var(--space-2) 0; border-top: 1px solid var(--border); }
        .gc-fr-levels > div:first-child { border-top: 0; padding-top: 0; }
        .gc-fr-levels dt { font-family: var(--font-display); font-weight: 800; font-size: var(--text-base); color: var(--ink); }
        .gc-fr-levels dd { margin: 0; font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-soft); line-height: 1.55; }
        @media (max-width: 560px) { .gc-fr-levels > div { grid-template-columns: 1fr; gap: 0; } }
      `}</style>
    </div>
  )
}
