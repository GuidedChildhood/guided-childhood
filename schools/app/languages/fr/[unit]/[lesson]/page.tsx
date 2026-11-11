import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PAGE } from '@gc/shared/page-scale'
import { frLessonKey } from '@gc/shared/lesson-records'
import RecordLesson from '@/components/records/RecordLesson'
import { eyebrow } from '@/components/ui'
import {
  activitiesFor, assessedIn, codesToRecord, deckSequence, FR_PAGE, FRENCH_UNITS, frenchLesson, frenchUnit, lessonLabel, lessonsOf, mediaUrl,
  sheetList, SKILL_LABEL, soloName, teachingLessons,
} from '@/lib/languages/french'
import { body, card, Crumbs, Fold, FoldStyles, langEyebrow, Sheets, small } from '../../_ui'
import DeckPreview from '../../DeckPreview'

// /languages/fr/[unit]/[lesson]: ONE LESSON, START TO FINISH (10 November 2026).
//
// Justin: "a one click button flow from start to finish for each lesson,
// including prep and what they need to do to teach, step by step, and how it
// records." This page was a lesson's contents in the order they were stored.
// It is now the three things a teacher does, in the order they do them:
//
//   1  Get ready   what to print, the words, what to look for today
//   2  Teach       the board, the order of the slides, the task, the song
//   3  Record      one button, saved for the school
//
// Every line of it is the scheme's own (the plan, the slide titles, the
// assessment plan). Nothing a teacher is told to say or do is written here;
// when the author adds to her plan, the next sync brings it in.
//
// The page stays static and cached. The record step asks for its own state
// (components/records/RecordLesson.tsx), so nothing about a school is ever
// rendered into it.

export function generateStaticParams() {
  return FRENCH_UNITS.filter(u => u.ready).flatMap(u => lessonsOf(u).map(l => ({ unit: u.key, lesson: String(l.n) })))
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string; lesson: string }> }) {
  const { unit, lesson } = await params
  const u = frenchUnit(unit)
  const l = u ? frenchLesson(u, Number(lesson)) : null
  return { title: l ? l.title : 'French' }
}

function Step({ n, id, title, lead, children }: { n: number; id: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="gc-fr-stepcard" style={{ ...card, scrollMarginTop: 'var(--space-7)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <span aria-hidden className="gc-fr-stepnum">{n}</span>
        <div style={{ minWidth: 0 }}>
          <h2 id={`${id}-title`} style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', lineHeight: 1.2, margin: 0 }}>{title}</h2>
          <p style={{ ...small, margin: 0 }}>{lead}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>{children}</div>
    </section>
  )
}

const label: React.CSSProperties = { ...eyebrow, display: 'block', marginBottom: 'var(--space-1)' }

export default async function FrenchLessonPage({ params }: { params: Promise<{ unit: string; lesson: string }> }) {
  const { unit, lesson } = await params
  const u = frenchUnit(unit)
  if (!u || !u.ready) notFound()
  const l = frenchLesson(u, Number(lesson))
  if (!l) notFound()
  // A culture lesson sits outside the unit's numbered lessons, so it is not
  // "lesson 7 of 7" and it has no neighbours: it goes back to its unit.
  const all = teachingLessons(u)
  const prev = l.culture ? undefined : all.find(x => x.n === l.n - 1)
  const next = l.culture ? undefined : all.find(x => x.n === l.n + 1)
  const assess = l.culture ? [] : assessedIn(u, l.n)
  const toRecord = codesToRecord(u, l)
  const deck = l.deck
  const songs = deck?.songs?.map(i => u.deck?.songs?.[i]).filter((s): s is NonNullable<typeof s> => !!s) ?? []
  const order = deckSequence(deck?.slides)
  const sheets = [...sheetList(deck?.files), ...activitiesFor(u, l.n)]
  const classMats = sheetList(u.deck?.wordMats).filter(m => (m.lv ?? 'class') === 'class')
  const teachHref = `/languages/fr/${u.key}/${l.n}/teach`
  // The scheme zips every sheet for a lesson into one pack, beside its decks.
  const pack = u.deck && u.slug ? mediaUrl(u.slug, `zip/Y${u.year}_HT${u.ht}_Lesson_${l.n}.zip`, 'deck') : null
  const seven = FR_PAGE.lesson ?? []

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Crumbs trail={[
        { href: '/languages', label: 'Languages' },
        { href: '/languages/fr', label: 'French' },
        { href: `/languages/fr/${u.key}`, label: u.fr },
        { label: lessonLabel(l) },
      ]} />

      <div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>Year {u.year} · {u.fr} · {l.culture ? `Culture · ${l.culture}` : `Lesson ${l.n} of ${all.length}`}</p>
        <h1 lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: 0 }}>{l.title}</h1>
        {deck?.en && <p style={{ ...body, fontWeight: 700, color: 'var(--ink)', margin: 'var(--space-1) 0 0' }}>{deck.en}</p>}
        <p style={{ ...body, margin: 'var(--space-2) 0 0', maxWidth: '620px' }}>Pupils will: {(deck?.ican ?? l.detail).replace(/^./, c => c.toLowerCase())}</p>
        {l.culture && <p style={{ ...small, margin: 'var(--space-2) 0 0' }}>A culture lesson. It is taught with this unit and is not assessed.</p>}
        <nav aria-label="The three steps of this lesson" className="gc-fr-steps">
          <a href="#ready"><span aria-hidden>1</span> Get ready</a>
          <a href="#teach"><span aria-hidden>2</span> Teach</a>
          <a href="#record"><span aria-hidden>3</span> Record</a>
        </nav>
      </div>

      <Step n={1} id="ready" title="Get ready" lead="Before the class comes in. About five minutes.">
        {u.slug && (sheets.length > 0 || classMats.length > 0) && (
          <div>
            <span style={label}>Print</span>
            <Sheets slug={u.slug} files={sheets} />
            {classMats.length > 0 && (
              <p style={{ ...small, margin: 'var(--space-2) 0 0' }}>
                And the word mat on each table:{' '}
                {classMats.map((m, i) => (
                  <span key={m.f}>{i > 0 && ' · '}<a href={mediaUrl(u.slug!, m.f, 'sheet')} target="_blank" rel="noopener" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>{m.t}</a></span>
                ))}
              </p>
            )}
          </div>
        )}
        {deck?.words && (
          <div>
            <span style={label}>The words today</span>
            <p lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.4, margin: 0 }}>{deck.words}</p>
          </div>
        )}
        {assess.length > 0 && (
          <div>
            <span style={label}>What to look for today</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {assess.map(a => (
                <li key={a.code} style={{ ...body, color: 'var(--ink)' }}>
                  <b>{a.code}</b> <span style={{ color: 'var(--ink-muted)' }}>({a.how === 'written' ? 'written' : 'observed'})</span> {a.what}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!deck && <p style={{ ...body, margin: 0 }}>{l.detail}</p>}
        {u.deck && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <Link href={`/languages/fr/${u.key}/plans#lesson-${l.n}`} className="btn btn-outline">Open the lesson plan</Link>
            {pack && sheets.length > 0 && <a href={pack} download className="btn btn-outline">Download every sheet</a>}
          </div>
        )}
      </Step>

      <Step n={2} id="teach" title="Teach" lead={deck?.slides ? 'Everything is on the board. Press play and follow the slides.' : 'The slides for this lesson are still being made.'}>
        {deck?.slides && u.slug ? (
          <div className="gc-fr-hero">
            <DeckPreview src={mediaUrl(u.slug, deck.slides, 'deck')} href={teachHref} title={l.title} />
            <div>
              <Link href={teachHref} className="btn btn-gold">Teach it on the board</Link>
              <p style={{ ...small, margin: 'var(--space-2) 0 0' }}>It opens full screen. When the lesson ends, the bar at the top brings you back here to record it.</p>
            </div>
          </div>
        ) : (
          <p style={{ ...body, margin: 0 }}>Teach from the plan for now. This step gains its play button when the slides arrive.</p>
        )}
        {order.length > 0 && (
          <div>
            <span style={label}>The order of the lesson, {order.length} slides</span>
            <ol style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', listStyle: 'none', padding: 0, margin: 0 }}>
              {order.map((t, i) => (
                <li key={i} lang="fr" style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-1) var(--space-3)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>
                  <span style={{ color: 'var(--ink-muted)' }}>{i + 1}</span> {t}
                </li>
              ))}
            </ol>
          </div>
        )}
        {seven.length > 0 && !l.culture && (
          <div className="gc-fr-folds">
            <Fold label="How the lesson runs, step by step" hint={`The same ${seven.length} steps every lesson, so the class knows what is coming`}>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {seven.map(([step, timing, what], i) => (
                  <li key={step} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                    <span aria-hidden className="gc-fr-stepnum" style={{ width: 32, height: 32, fontSize: 'var(--text-sm)' }}>{i + 1}</span>
                    <span style={{ minWidth: 0 }}>
                      <b style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{step}</b>{' '}
                      <span style={small}>{timing}</span>
                      <span style={{ ...small, display: 'block', color: 'var(--ink)' }}>{what}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <Link href="/languages/fr/approach" style={{ ...small, display: 'inline-flex', alignItems: 'center', minHeight: 44, color: 'var(--terracotta-dark)', fontWeight: 700 }}>Why the lessons run this way</Link>
            </Fold>
          </div>
        )}
        {deck?.book && (
          <div>
            <span style={label}>The main task, in their books</span>
            <p style={{ ...body, margin: 0, color: 'var(--ink)' }}>{deck.book}</p>
          </div>
        )}
        {songs.length > 0 && u.slug && (
          <div>
            <span style={label}>The song</span>
            {songs.map(s => (
              <figure key={s.f} style={{ margin: 0 }}>
                <video controls preload="none" playsInline poster={s.poster ? mediaUrl(u.slug!, s.poster, 'deck') : undefined}
                  src={mediaUrl(u.slug!, s.f, 'deck')} style={{ width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-tile)', background: 'var(--ink)' }} />
                <figcaption style={{ ...small, marginTop: 'var(--space-1)' }}>{s.t}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </Step>

      <Step n={3} id="record" title="Record" lead="One tap when the lesson is done. It is saved for your school, on every laptop.">
        <RecordLesson
          subject="fr"
          lessonKey={frLessonKey(u.key, l.n)}
          statements={toRecord.map(c => ({ code: c.code, skill: SKILL_LABEL[c.code[0]] ?? 'Statement', pupil: c.pupil }))}
          levelNames={['Below SOLO 4', 'SOLO 4', 'SOLO 5']}
          levelKey={`This is how the scheme reports each statement. Below SOLO 4 is ${soloName(3)}, and anyone not there yet.`}
          recordHref="/languages/fr/progress"
        />
      </Step>

      <nav aria-label="Lessons in this unit" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {prev ? <Link href={`/languages/fr/${u.key}/${prev.n}`} className="btn btn-outline">‹ Lesson {prev.n}</Link> : <span />}
        {next ? <Link href={`/languages/fr/${u.key}/${next.n}`} className="btn btn-outline">Lesson {next.n} ›</Link> : <Link href={`/languages/fr/${u.key}`} className="btn btn-outline">Back to the unit</Link>}
      </nav>

      <FoldStyles />
      <style>{`
        .gc-fr-steps { display: inline-flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-4); }
        .gc-fr-steps a {
          display: inline-flex; align-items: center; gap: var(--space-2); min-height: 44px; padding: 0 var(--space-3) 0 var(--space-1);
          background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-btn); text-decoration: none;
          font-family: var(--font-display); font-weight: 800; font-size: var(--text-sm); color: var(--ink);
          transition: border-color .15s ease, transform .2s cubic-bezier(0.22,1,0.36,1);
        }
        .gc-fr-steps a:hover { border-color: var(--terracotta); transform: translateY(-1px); }
        .gc-fr-steps a:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        .gc-fr-steps a span, .gc-fr-stepnum {
          flex: none; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%;
          background: var(--terracotta); color: var(--ink); font-family: var(--font-display); font-weight: 900;
        }
        .gc-fr-steps a span { width: 32px; height: 32px; font-size: var(--text-sm); }
        .gc-fr-stepnum { width: 40px; height: 40px; font-size: var(--text-base); }
        .gc-fr-hero { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: var(--space-4); align-items: center; }
        @media (max-width: 720px) { .gc-fr-hero { grid-template-columns: 1fr; } .gc-fr-steps { display: flex; } .gc-fr-steps a { flex: 1 1 0; justify-content: flex-start; } }
        @media (prefers-reduced-motion: reduce) { .gc-fr-steps a { transition: none; } .gc-fr-steps a:hover { transform: none; } }
      `}</style>
    </div>
  )
}
