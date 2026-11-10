import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PAGE } from '@gc/shared/page-scale'
import { eyebrow } from '@/components/ui'
import {
  assessedCodes, cultureLessons, FRENCH_UNITS, frenchUnit, KS2_STATEMENTS, mediaUrl, sheetList, SKILL_LABEL, soloName,
  teachingLessons, type SheetFile,
} from '@/lib/languages/french'
import { body, Crumbs, Fold, FoldStyles, langEyebrow, LessonRow, LessonRowStyles, Sheets, small, Words } from '../_ui'

// /languages/fr/[unit]: one half term.
//
// 10 November 2026, Justin: "really simplify the flow so it is easy to flow
// through". This page was seven long sections, and the thing a teacher opens
// it for, the lessons, came third. It now leads with them: the unit's name,
// three buttons, and the lessons, each with its play button. Everything a
// teacher looks up rather than uses (the sound and grammar, the words, the
// songs, the assessment, the unit's sheets, the exit questions) is one line
// each underneath and opens on a tap.
//
// A culture lesson is listed after the numbered ones with a star, as the
// scheme has it: taught with the unit, outside its lessons, not assessed.

export function generateStaticParams() {
  return FRENCH_UNITS.filter(u => u.ready).map(u => ({ unit: u.key }))
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string }> }) {
  const u = frenchUnit((await params).unit)
  return { title: u ? `${u.fr} · Year ${u.year}` : 'French' }
}

const label: React.CSSProperties = { ...eyebrow, display: 'block', marginBottom: 'var(--space-1)' }

export default async function FrenchUnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const u = frenchUnit((await params).unit)
  if (!u || !u.ready) notFound()
  const p = u.plan
  const d = u.deck
  const lessons = teachingLessons(u)
  const culture = cultureLessons(u)
  const codes = assessedCodes(u)
  const paperwork: { label: string; files: SheetFile[] }[] = d ? [
    { label: 'Word mats', files: sheetList(d.wordMats) },
    { label: 'What I can do', files: sheetList(d.whatICanDo) },
    { label: 'Extra activities', files: sheetList(d.activities) },
    { label: 'Assessment', files: sheetList(d.assessment) },
    { label: 'For the teacher', files: sheetList(d.teacher) },
  ].filter(x => x.files.length > 0) : []
  const sheetCount = paperwork.reduce((n, g) => n + g.files.length, 0)
  const about = [p.sound && 'the sound', p.grammar && 'the grammar', p.culture && 'the culture', p.ican?.length && 'what pupils can do by the end'].filter(Boolean) as string[]

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <Crumbs trail={[{ href: '/languages', label: 'Languages' }, { href: u.year === FRENCH_UNITS[0].year ? '/languages/fr' : `/languages/fr?year=${u.year}`, label: `French, Year ${u.year}` }, { label: `Half term ${u.ht}` }]} />
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>Year {u.year} · Half term {u.ht}{p.theme ? ` · ${p.theme}` : ''}</p>
        <h1 lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: 0 }}>{u.fr}</h1>
        <p style={{ ...body, fontWeight: 700, color: 'var(--ink)', margin: 'var(--space-1) 0 var(--space-3)' }}>{u.en}</p>
        {(d?.summary || p.summary) && <p style={{ ...body, maxWidth: '620px' }}>{d?.summary ?? p.summary}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          {lessons[0]?.deck?.slides && <Link href={`/languages/fr/${u.key}/${lessons[0].n}/teach`} className="btn btn-gold">Teach lesson {lessons[0].n}</Link>}
          {d && <Link href={`/languages/fr/print#${u.key}`} className="btn btn-outline">Print the sheets</Link>}
          {d && <Link href={`/languages/fr/${u.key}/plans`} className="btn btn-outline">Lesson plans</Link>}
        </div>
        {!d && <p style={{ ...small, marginTop: 'var(--space-3)' }}>The plan for this unit is ready. Its slides and sheets are still being made, and each lesson gains a play button as they arrive.</p>}
      </div>

      <section aria-labelledby="lessons">
        <h2 id="lessons" style={{ ...eyebrow, margin: '0 0 var(--space-2)' }}>The lessons</h2>
        <ol className="gc-fr-list">
          {lessons.map(l => (
            <LessonRow key={l.n} unitKey={u.key} n={l.n} mark={String(l.n)} title={l.title} detail={l.detail} hasSlides={!!l.deck?.slides} />
          ))}
          {culture.map(l => (
            <LessonRow key={l.n} unitKey={u.key} n={l.n} mark="★" title={l.title} detail={`${l.culture} culture lesson · taught with this unit, not assessed`} hasSlides={!!l.deck?.slides} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="look-up">
        <h2 id="look-up" style={{ ...eyebrow, margin: 'var(--space-3) 0 var(--space-2)' }}>To look up</h2>
        <div className="gc-fr-folds">
          {about.length > 0 && (
            <Fold label="About this unit" hint={about.join(', ').replace(/^./, c => c.toUpperCase())}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                {p.sound && (
                  <div>
                    <span style={label}>The sound</span>
                    <div lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1.1 }}>{p.sound}</div>
                    {p.soundHint && <div style={small}>{p.soundHint}</div>}
                    {p.soundSays && <div style={{ ...small, color: 'var(--ink)' }}>Say it {p.soundSays}</div>}
                    {d?.phonics && u.slug && (
                      <a href={mediaUrl(u.slug, d.phonics, 'deck')} target="_blank" rel="noopener" style={{ ...small, display: 'inline-flex', alignItems: 'center', minHeight: 44, color: 'var(--terracotta-dark)', fontWeight: 700 }}>
                        Open the phonics slides
                      </a>
                    )}
                  </div>
                )}
                {p.grammar && <div><span style={label}>Grammar</span><p style={{ ...body, margin: 0 }}>{p.grammar}</p></div>}
                {p.culture && <div><span style={label}>Culture</span><p style={{ ...body, margin: 0 }}>{p.culture}</p></div>}
              </div>
              {p.phonicsNote && <p style={{ ...small, margin: 'var(--space-3) 0 0' }}>{p.phonicsNote}</p>}
              {p.ican && p.ican.length > 0 && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <span style={label}>By the end, pupils can</span>
                  <ul style={{ ...body, margin: 0, paddingLeft: 'var(--space-4)' }}>
                    {p.ican.map(c => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              )}
            </Fold>
          )}

          {p.vocab && p.vocab.length > 0 && (
            <Fold label="The words" hint={`${p.vocab.length} words and phrases, French and English`}>
              <Words rows={p.vocab} />
            </Fold>
          )}

          {d?.songs && d.songs.length > 0 && u.slug && (
            <Fold label="Songs" hint={`${d.songs.length} to play on the board`}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                {d.songs.map(s => (
                  <figure key={s.f} style={{ margin: 0 }}>
                    <video controls preload="none" playsInline poster={s.poster ? mediaUrl(u.slug!, s.poster, 'deck') : undefined}
                      src={mediaUrl(u.slug!, s.f, 'deck')} style={{ width: '100%', borderRadius: 'var(--radius-tile)', background: 'var(--ink)' }} />
                    <figcaption style={{ ...small, marginTop: 'var(--space-1)' }}>{s.t}</figcaption>
                  </figure>
                ))}
              </div>
            </Fold>
          )}

          {codes.length > 0 && (
            <Fold label="Assessment" hint={`${codes.map(c => c.code).join(' · ')} · what each looks like at SOLO 3, 4 and 5`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {codes.map((c, i) => {
                  const plan = d?.assessPlan?.find(a => a.code === c.code)
                  const when = plan?.lessons?.length ? (plan.lessons.length > 4 ? 'every lesson' : `lesson ${plan.lessons.join(' and ')}`) : null
                  return (
                    <div key={c.code} style={{ borderTop: i ? '1px solid var(--border)' : 0, paddingTop: i ? 'var(--space-4)' : 0 }}>
                      <div style={langEyebrow}>
                        {c.code} · {SKILL_LABEL[c.code[0]] ?? 'Statement'}
                        {plan && <span style={{ color: 'var(--ink-muted)' }}> · {plan.how === 'written' ? 'Written' : 'Observed'}{when ? `, ${when}` : ''}</span>}
                      </div>
                      <p style={{ ...body, fontWeight: 700, color: 'var(--ink)', margin: 'var(--space-1) 0' }}>{c.pupil}</p>
                      <p style={{ ...small, margin: 0 }}>National curriculum: {KS2_STATEMENTS[c.code] ?? c.nc}</p>
                      <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', margin: 'var(--space-3) 0 0' }}>
                        <div><dt style={eyebrow}>{soloName(3)}</dt><dd style={{ ...small, margin: 0 }}>{c.s3}</dd></div>
                        <div><dt style={eyebrow}>{soloName(4)}</dt><dd style={{ ...small, margin: 0 }}>{c.s4}</dd></div>
                        {plan?.s5 && <div><dt style={eyebrow}>{soloName(5)}</dt><dd style={{ ...small, margin: 0 }}>{plan.s5}</dd></div>}
                      </dl>
                      {(plan?.what || c.idea) && <p style={{ ...small, margin: 'var(--space-2) 0 0' }}><b style={{ color: 'var(--ink)' }}>Evidence:</b> {plan?.what ?? c.idea}</p>}
                    </div>
                  )
                })}
              </div>
              <p style={{ ...small, margin: 'var(--space-4) 0 0' }}>
                Speaking and listening are observed in class. Written statements come from the sheets. Record each
                pupil at SOLO 3, 4 or 5 on the What I can do sheet.{' '}
                <Link href="/languages/fr/plan" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Assessment across the year</Link>
              </p>
            </Fold>
          )}

          {paperwork.length > 0 && u.slug && (
            <Fold label="Sheets for the whole unit" hint={`${sheetCount} to print · ${paperwork.map(g => g.label).join(' · ')}`}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
                {paperwork.map(g => (
                  <div key={g.label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>{g.label}</div>
                    <Sheets slug={u.slug!} files={g.files} />
                  </div>
                ))}
              </div>
              <Link href={`/languages/fr/print#${u.key}`} style={{ ...small, display: 'inline-flex', alignItems: 'center', minHeight: 44, marginTop: 'var(--space-2)', color: 'var(--terracotta-dark)', fontWeight: 700 }}>
                Every sheet for this unit, lesson by lesson, in the print room
              </Link>
            </Fold>
          )}

          {p.exit && p.exit.length > 0 && (
            <Fold label="Exit questions" hint={`${p.exit.length} to ask at the door`}>
              <ol style={{ ...body, margin: 0, paddingLeft: 'var(--space-4)' }}>
                {p.exit.map(q => <li key={q}>{q}</li>)}
              </ol>
            </Fold>
          )}
        </div>
      </section>

      <LessonRowStyles />
      <FoldStyles />
    </div>
  )
}
