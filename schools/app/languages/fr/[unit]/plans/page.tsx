import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PAGE } from '@gc/shared/page-scale'
import PrintButton from '@/components/PrintButton'
import { eyebrow } from '@/components/ui'
import {
  activitiesFor, assessedCodes, assessedIn, byLevel, cultureLessons, FRENCH_UNITS, frenchUnit, LEVEL_LABEL, lessonLabel,
  lessonsOf, mediaUrl, planSequence, sheetList, teachingLessons,
} from '@/lib/languages/french'
import { body, card, Crumbs, langEyebrow, small } from '../../_ui'
import PrintLesson from './PrintLesson'

// /languages/fr/[unit]/plans: THE UNIT OVERVIEW AND ITS LESSON PLANS, TO PRINT
// (10 November 2026).
//
// The scheme's own site has this page and ours did not: one sheet for the
// half term, then one plan per lesson (the new language, the sequence, the
// main task, the resources at each level, what is assessed). A teacher prints
// the unit for their planning file, or one lesson for a cover teacher.
//
// Nothing is retyped. Each row is read from the same data the lesson pages
// use, and the sequence is the lesson's own slide titles, so a plan cannot
// say something the slides do not do.

export function generateStaticParams() {
  return FRENCH_UNITS.filter(u => u.deck).map(u => ({ unit: u.key }))
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string }> }) {
  const u = frenchUnit((await params).unit)
  return { title: u ? `${u.fr} · lesson plans` : 'French' }
}

function Row({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="gc-fr-plan-row">
      <dt style={eyebrow}>{name}</dt>
      <dd style={{ ...body, margin: 0, color: 'var(--ink)' }}>{children}</dd>
    </div>
  )
}

export default async function FrenchPlansPage({ params }: { params: Promise<{ unit: string }> }) {
  const u = frenchUnit((await params).unit)
  if (!u || !u.deck || !u.slug) notFound()
  const p = u.plan
  const d = u.deck
  const slug = u.slug
  const codes = assessedCodes(u)
  const culture = cultureLessons(u)
  const classMats = sheetList(d.wordMats).filter(m => (m.lv ?? 'class') === 'class')

  return (
    <div className="gc-fr-plans" style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="no-print">
        <Crumbs trail={[{ href: '/languages/fr/plan', label: 'Plan and assess' }, { href: `/languages/fr/${u.key}`, label: u.fr }, { label: 'Lesson plans' }]} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href={`/languages/fr/${u.key}`} className="btn btn-outline">Back to the unit</Link>
          <PrintButton label="Print the whole unit" />
        </div>
      </div>

      <section className="gc-fr-plan" style={card}>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>Year {u.year} · Half term {u.ht}{p.theme ? ` · ${p.theme}` : ''} · Unit overview</p>
        <h1 lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: 0 }}>{u.fr}</h1>
        <p style={{ ...body, fontWeight: 700, color: 'var(--ink)', margin: 'var(--space-1) 0 var(--space-3)' }}>{u.en}</p>
        {(d.summary || p.summary) && <p style={{ ...body, margin: '0 0 var(--space-3)' }}>{d.summary ?? p.summary}</p>}
        <dl className="gc-fr-plan-rows">
          <Row name="Lessons">
            <ol style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
              {teachingLessons(u).map(l => <li key={l.n} value={l.n} lang="fr">{l.title}</li>)}
            </ol>
            {culture.length > 0 && <span style={{ ...small, display: 'block' }}>Plus a culture lesson: {culture.map(l => l.culture).join(', ')}</span>}
          </Row>
          {(p.sound || d.sound) && (
            <Row name="Sound">
              <b lang="fr">{p.sound ?? d.sound}</b> {p.soundHint}{p.soundSays ? ` (${p.soundSays})` : ''}
              {p.phonicsNote && <span style={{ ...small, display: 'block' }}>{p.phonicsNote}</span>}
            </Row>
          )}
          {p.grammar && <Row name="Grammar">{p.grammar}</Row>}
          {p.culture && <Row name="Culture">{p.culture}</Row>}
          {codes.length > 0 && (
            <Row name="Assessed">
              {codes.map(c => <span key={c.code} style={{ display: 'block' }}><b>{c.code}</b> {c.pupil}</span>)}
            </Row>
          )}
          <Row name="Every lesson">Slides, word mats and the What I can do record sheet. Mon bilan in lesson {d.assessLesson ?? 6}.</Row>
        </dl>
        {p.vocab && p.vocab.length > 0 && (
          <>
            <h2 style={{ ...eyebrow, margin: 'var(--space-4) 0 var(--space-2)' }}>Key vocabulary</h2>
            <dl className="gc-fr-plan-vocab">
              {p.vocab.map(([fr, en]) => (
                <div key={fr}><dt lang="fr">{fr}</dt><dd>{en}</dd></div>
              ))}
            </dl>
          </>
        )}
      </section>

      {lessonsOf(u).map(l => {
        const deck = l.deck
        const seq = planSequence(deck?.slides)
        const files = [...sheetList(deck?.files), ...activitiesFor(u, l.n)]
        const assess = l.culture ? [] : assessedIn(u, l.n)
        return (
          <section key={l.n} id={`lesson-${l.n}`} className="gc-fr-plan" style={{ ...card, scrollMarginTop: 'var(--space-7)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                <p style={{ ...langEyebrow, marginBottom: 'var(--space-1)' }}>Year {u.year} · Half term {u.ht} · {u.fr} · {l.culture ? `Culture, ${l.culture}` : lessonLabel(l)}</p>
                <h2 lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1.2, margin: 0 }}>{l.title}</h2>
                {deck?.en && <p style={{ ...small, margin: 0, color: 'var(--ink)' }}>{deck.en}</p>}
                <p style={{ ...small, margin: 'var(--space-1) 0 0' }}>I can: {l.detail}</p>
              </div>
              <PrintLesson id={`lesson-${l.n}`} label="Print this lesson" />
            </div>
            <dl className="gc-fr-plan-rows" style={{ marginTop: 'var(--space-3)' }}>
              {deck?.words && <Row name="New language"><span lang="fr">{deck.words}</span></Row>}
              <Row name="Sequence">{seq.length > 0 ? seq.join(' → ') : 'See the slides'}</Row>
              {deck?.book && <Row name="Main task">{deck.book}</Row>}
              <Row name="Resources">
                {deck?.slides && (
                  <span style={{ display: 'block' }}>
                    <b>Slides:</b>{' '}
                    <Link href={`/languages/fr/${u.key}/${l.n}/teach`} style={{ color: 'inherit' }}>open on the board</Link>
                  </span>
                )}
                {byLevel(files).map(([lv, fs]) => (
                  <span key={lv} style={{ display: 'block' }}>
                    <b>{LEVEL_LABEL[lv]}:</b>{' '}
                    {fs.map((f, i) => (
                      <span key={f.f}>{i > 0 && ' · '}<a href={mediaUrl(slug, f.f, 'sheet')} target="_blank" rel="noopener" style={{ color: 'inherit' }}>{f.t}</a></span>
                    ))}
                  </span>
                ))}
                {classMats.length > 0 && <span style={{ display: 'block' }}><b>Word mats:</b> {classMats.map(m => m.t).join(' · ')}</span>}
              </Row>
              {assess.length > 0 && (
                <Row name="Assess">
                  {assess.map(a => <span key={a.code} style={{ display: 'block' }}><b>{a.code}</b> ({a.how === 'written' ? 'written' : 'observed'}): {a.what}</span>)}
                </Row>
              )}
            </dl>
          </section>
        )
      })}

      <style>{`
        .gc-fr-plan-rows { margin: 0; display: flex; flex-direction: column; }
        .gc-fr-plan-row { display: grid; grid-template-columns: 140px minmax(0, 1fr); gap: var(--space-3); padding: var(--space-2) 0; border-top: 1px solid var(--border); }
        .gc-fr-plan-row > dt { padding-top: var(--space-1); }
        .gc-fr-plan-vocab { margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0 var(--space-4); }
        .gc-fr-plan-vocab > div { display: flex; gap: var(--space-2); justify-content: space-between; padding: var(--space-1) 0; border-top: 1px solid var(--border); font-family: var(--font-body); font-size: var(--text-sm); }
        .gc-fr-plan-vocab dt { font-weight: 700; color: var(--ink); }
        .gc-fr-plan-vocab dd { margin: 0; color: var(--ink-muted); text-align: right; }
        .gc-fr-print-one {
          flex: none; min-height: 44px; padding: 0 var(--space-3); cursor: pointer; background: var(--white); color: var(--ink);
          border: 1.5px solid var(--border); border-radius: var(--radius-btn);
          font-family: var(--font-display); font-weight: 800; font-size: var(--text-sm);
          transition: border-color .15s ease, background-color .15s ease;
        }
        .gc-fr-print-one:hover { border-color: var(--terracotta); background: var(--warm); }
        .gc-fr-print-one:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        @media (max-width: 560px) { .gc-fr-plan-row { grid-template-columns: 1fr; gap: 0; } }
        @media (prefers-reduced-motion: reduce) { .gc-fr-print-one { transition: none; } }
        @media print {
          .gc-fr-plan { box-shadow: none !important; border: 0 !important; padding: 0 !important; break-after: page; }
          .gc-fr-plan:last-of-type { break-after: auto; }
          .gc-fr-plan a { text-decoration: none; }
          body.gc-fr-printing-one .gc-fr-plan:not(.gc-fr-print-me) { display: none !important; }
          body.gc-fr-printing-one .gc-fr-print-me { break-after: auto; }
        }
      `}</style>
    </div>
  )
}
