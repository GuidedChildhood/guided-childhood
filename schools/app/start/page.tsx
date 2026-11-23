import type { Metadata } from 'next'
import Link from 'next/link'
import { db as supabase } from '@/lib/supabase/server-db'
import { currentAccess } from '@/lib/licence'
import { pilotModulesFor } from '@/lib/pilot'
import { CURRICULUM, KEY_STAGE_META, KEY_STAGE_ORDER, type KeyStage, type CurriculumModule } from '@gc/shared/schools-curriculum'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'
import RememberYear from './RememberYear'

// THE FIRST VISIT (the schools UX pass, batch 6, 23 November 2026).
//
// A teacher who typed the school code used to land on the whole curriculum
// map: 34 lessons, Reception to Year 13, and no answer to "which one is
// mine?". This page is the three steps instead: code (done), your year,
// teach. One question, one big button. The year is remembered on this laptop
// so the next visit opens straight on the lessons, and "Change year" is one
// tap. A pilot school skips the question: its code already says which lessons
// it has, so it sees them.

export const metadata: Metadata = {
  title: 'Start here',
  robots: { index: false, follow: false },
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const h1: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page,
  color: 'var(--ink)', margin: 'var(--space-2) 0 var(--space-3)',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6,
}
const quietBtn: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
  padding: '15px 26px', borderRadius: 'var(--radius-btn)', textDecoration: 'none',
  color: 'var(--ink)', background: 'var(--white)', border: '1px solid var(--border)',
  boxShadow: '0 5px 0 var(--border)', justifyContent: 'center',
}

function isStage(v: string | undefined): v is KeyStage {
  return !!v && (KEY_STAGE_ORDER as string[]).includes(v)
}

/** The three steps, with the one you are on lit. */
function Steps({ at }: { at: 2 | 3 }) {
  const steps = ['School code', 'Your year', 'Teach']
  return (
    <ol aria-label="Getting started" className="gc-start-steps">
      {steps.map((s, i) => {
        const n = i + 1
        const state = n < at ? 'done' : n === at ? 'now' : 'next'
        return (
          <li key={s} data-state={state} aria-current={state === 'now' ? 'step' : undefined}>
            <span aria-hidden>{state === 'done' ? '✓' : n}</span>{s}
          </li>
        )
      })}
    </ol>
  )
}

/** The lesson to teach next: the one big button, and two quiet ones. */
function FirstLesson({ m }: { m: CurriculumModule }) {
  return (
    <section className="gc-start-first" aria-label="Your first lesson">
      <p style={{ ...eyebrow, color: 'var(--green-dark)' }}>{m.yearBand}, {m.minutes} minutes</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: 'var(--space-1) 0 var(--space-2)' }}>{m.title}</h2>
      <p style={{ ...body, marginBottom: 'var(--space-4)' }}>By the end: &ldquo;{m.outcome}&rdquo;</p>
      {m.dsl && (
        <p className="gc-start-care">
          Taught with extra safeguarding care. Read its ten minute <Link href="/hub/cpd">staff briefing</Link> first, and tell your safeguarding lead it runs this week.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Link href={`/teach/${m.moduleId}`} className="btn btn-gold" style={{ fontSize: 'var(--text-md)', padding: '15px 30px', justifyContent: 'center' }}>
          Teach this lesson
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
          <Link href={`/lesson/${m.moduleId}/run`} className="btn" style={quietBtn}>Walk me through it</Link>
          <Link href={`/lesson/${m.moduleId}`} className="btn" style={quietBtn}>Plan and print</Link>
        </div>
      </div>
      <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 'var(--space-3)' }}>
        The words to say are on every slide, so it runs with no preparation.
      </p>
    </section>
  )
}

export default async function StartPage({ searchParams }: { searchParams: Promise<{ stage?: string; pick?: string }> }) {
  const { stage: raw, pick } = await searchParams
  const access = await currentAccess()
  const { data: lessons } = await supabase.from('school_lessons').select('module_id')
  const live = new Set((lessons ?? []).map(l => l.module_id as string))
  const pilotSet = access?.tier === 'pilot' ? new Set(pilotModulesFor(access.phase)) : null
  const opens = (id: string) => live.has(id) && (access?.tier === 'licence' || (pilotSet?.has(id) ?? false))
  const stagesWithLessons = KEY_STAGE_ORDER.filter(ks => CURRICULUM.some(m => m.keyStage === ks))

  // A pilot school: its code already names the lessons, so no question.
  if (pilotSet) {
    const mine = CURRICULUM.filter(m => pilotSet.has(m.moduleId) && live.has(m.moduleId))
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
        <StartStyles />
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <Steps at={3} />
          <h1 style={h1}>Your pilot lessons</h1>
          <p style={{ ...body, marginBottom: 'var(--space-5)' }}>Pick one and press Teach. One tap at the end marks it taught.</p>
          {mine.map(m => <FirstLesson key={m.moduleId} m={m} />)}
          <MoreLinks />
        </div>
      </main>
    )
  }

  const stage = isStage(raw) ? raw : null

  // Step two: which year.
  if (!stage) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
        <StartStyles />
        <RememberYear stage={null} stages={stagesWithLessons} picking={pick === '1'} />
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <Steps at={2} />
          <h1 style={h1}>Which year do you teach?</h1>
          <p style={{ ...body, marginBottom: 'var(--space-5)' }}>We will open the lessons for your class.</p>
          <nav aria-label="Pick your year" className="gc-start-years">
            {stagesWithLessons.map(ks => (
              <Link key={ks} href={`/start?stage=${ks}`}>
                <span className="gc-start-years-main">{KEY_STAGE_META[ks].years}</span>
                <span className="gc-start-years-sub">{KEY_STAGE_META[ks].label}</span>
              </Link>
            ))}
          </nav>
          <MoreLinks />
        </div>
      </main>
    )
  }

  // Step three: teach.
  const modules = CURRICULUM.filter(m => m.keyStage === stage)
  const first = modules.find(m => opens(m.moduleId))
  const rest = modules.filter(m => m !== first)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <StartStyles />
      <RememberYear stage={stage} stages={stagesWithLessons} picking={false} />
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        <Steps at={3} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <h1 style={h1}>{KEY_STAGE_META[stage].years}</h1>
          <Link href="/start?pick=1" className="gc-start-change">Change year</Link>
        </div>
        <p style={{ ...body, marginBottom: 'var(--space-5)' }}>{KEY_STAGE_META[stage].strapline}</p>

        {first ? <FirstLesson m={first} /> : (
          <p style={{ ...body, marginBottom: 'var(--space-5)' }}>None of these lessons is open on your code yet. <Link href="/curriculum" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>See the whole map</Link>.</p>
        )}

        {rest.length > 0 && (
          <section aria-label="The rest of the year" style={{ marginTop: 'var(--space-5)' }}>
            <h2 style={{ ...eyebrow, marginBottom: 'var(--space-2)' }}>The rest of the year, in teaching order</h2>
            <ul className="gc-start-rest">
              {rest.map(m => (
                <li key={m.moduleId}>
                  <Link href={`/lesson/${m.moduleId}`}>
                    <span className="gc-start-rest-title">{m.title}</span>
                    <span className="gc-start-rest-meta">{opens(m.moduleId) ? `${m.minutes} minutes` : 'Licence needed'}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <MoreLinks />
      </div>
    </main>
  )
}

function MoreLinks() {
  return (
    <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 'var(--space-6)', textAlign: 'center' }}>
      Looking for something else? <Link href="/hub" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>The Hub</Link> has the records, safeguarding and parent pack, and <Link href="/curriculum" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the map</Link> has every lesson.
    </p>
  )
}

function StartStyles() {
  return (
    <style>{`
      .gc-start-steps { list-style: none; padding: 0; margin: 0 0 var(--space-5); display: flex; gap: var(--space-2); flex-wrap: wrap; }
      .gc-start-steps li { display: inline-flex; align-items: center; gap: var(--space-2); font-family: var(--font-body); font-weight: 700; font-size: var(--text-sm); color: var(--ink-muted); }
      .gc-start-steps li span { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 999px; border: 1.5px solid var(--border); background: var(--white); font-family: var(--font-mono); font-size: var(--text-xs); }
      .gc-start-steps li[data-state="done"] span { background: var(--ink); border-color: var(--ink); color: var(--white); }
      .gc-start-steps li[data-state="now"] { color: var(--ink); }
      .gc-start-steps li[data-state="now"] span { background: var(--butter); border-color: var(--ink); color: var(--ink); }
      .gc-start-steps li + li::before { content: ''; width: var(--space-4); height: 1.5px; background: var(--border); }
      .gc-start-years { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: var(--space-3); }
      .gc-start-years a { display: flex; flex-direction: column; gap: var(--space-1); min-height: 88px; justify-content: center; padding: var(--space-3) var(--space-4); background: var(--white); border: 1.5px solid var(--border); border-radius: var(--radius-tile); box-shadow: 0 5px 0 var(--border); text-decoration: none; color: var(--ink); transition: transform 120ms ease; }
      .gc-start-years a:hover { transform: translateY(-2px); border-color: var(--ink); }
      .gc-start-years-main { font-family: var(--font-display); font-weight: 900; font-size: var(--text-lg); }
      .gc-start-years-sub { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); }
      .gc-start-first { background: var(--white); border: 1.5px solid var(--ink); border-radius: var(--radius-card); padding: var(--space-5) var(--space-4); margin-bottom: var(--space-4); box-shadow: 0 5px 0 var(--butter); }
      .gc-start-care { font-family: var(--font-body); font-size: var(--text-sm); line-height: 1.5; color: var(--ink); border: 1.5px solid var(--coral); border-radius: var(--radius-tile); padding: var(--space-2) var(--space-3); margin: 0 0 var(--space-4); }
      .gc-start-care a { color: var(--coral-dark); font-weight: 700; }
      .gc-start-change { font-family: var(--font-body); font-weight: 700; font-size: var(--text-sm); color: var(--terracotta-dark); min-height: 44px; display: inline-flex; align-items: center; }
      .gc-start-rest { list-style: none; padding: 0; margin: 0; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-tile); }
      .gc-start-rest li + li { border-top: 1px solid var(--border); }
      .gc-start-rest a { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); min-height: 56px; padding: var(--space-2) var(--space-4); text-decoration: none; color: var(--ink); }
      .gc-start-rest-title { font-family: var(--font-display); font-weight: 800; font-size: var(--text-base); }
      .gc-start-rest-meta { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-muted); white-space: nowrap; }
      .gc-start-years a:focus-visible, .gc-start-rest a:focus-visible, .gc-start-change:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }
      @media (prefers-reduced-motion: reduce) { .gc-start-years a { transition: none; } }
    `}</style>
  )
}
