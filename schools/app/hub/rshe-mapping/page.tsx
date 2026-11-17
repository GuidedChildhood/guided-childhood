import { db as supabase } from '@/lib/supabase/server-db'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import HubBackLink from '@/components/HubBackLink'
import { CURRICULUM, KEY_STAGE_ORDER, positionCode, positionLabel } from '@gc/shared/schools-curriculum'
import { RSHE_2026_COUNTS, RSHE_2026_SOURCE } from '@gc/shared/schools-rshe-2026'
import RequirementList from './RequirementList'
import { PAGE_SHELL } from '@gc/shared/page-scale'

export const metadata = {
  title: 'RSHE 2026: every online requirement, and the lesson that teaches it',
  description: 'Every digital and online requirement in the RSHE statutory guidance in force from 1 September 2026, in its own words, with the lesson that teaches it.',
}

// THE RSHE 2026 MAPPING. Renders live from the curriculum manifest and the
// requirement data in shared/schools-rshe-2026.ts, which
// scripts/check-rshe-coverage.mjs holds to the words on the live slides, so
// this page cannot claim a lesson teaches something the slides do not say.
//
// WHO READS IT. Until November it was read by a PSHE lead who already had the
// licence. Since the schools email of 17 November it is also the first page a
// teacher who has never heard of us opens. Justin: "apply Apple UX, super easy
// for teachers to understand and act on, make it really obvious and clear".
//
// SO THE ORDER IS THE ORDER OF THEIR QUESTIONS.
//   1. Is it covered?            The answer is the headline, with a ring.
//   2. Where is mine?            Primary or Secondary, a search, jump links.
//   3. What do I do with it?     Print it for the file, or try two lessons.
// The detail only a DSL or an inspector needs (KCSIE 2026 and every lesson's
// statutory hooks) folds away under a plain heading and opens when printed.
// Three paragraphs that said the same thing became one line at the foot.
//
// The headline is computed, never written: if a requirement stops being
// taught, the line changes to say how many are and what is left, and the
// status filter appears in the list below. Plans: plans/2026-11-17-rshe-mapping-clarity-plan.md.

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6,
}

function longDate(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

// The whole answer as one ring. Static SVG: it has to print, and a number that
// counts up is a show for the second visit, not the first.
function Ring({ done, total }: { done: number; total: number }) {
  const r = 52, c = 2 * Math.PI * r
  const frac = total ? done / total : 0
  return (
    <svg viewBox="0 0 128 128" width="128" height="128" role="img" aria-label={`${done} of ${total} requirements taught`} style={{ flexShrink: 0 }}>
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--border)" strokeWidth="12" />
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--retro-green)" strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${c * frac} ${c}`} transform="rotate(-90 64 64)" />
      <text x="64" y="62" textAnchor="middle" fontSize="30" fontWeight="900" fill="var(--ink)" style={{ fontFamily: 'var(--font-display)' }}>{done}</text>
      <text x="64" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink-muted)" letterSpacing="0.08em" style={{ fontFamily: 'var(--font-mono)' }}>OF {total}</text>
    </svg>
  )
}

function Fold({ title, summary, children }: { title: string; summary: string; children: React.ReactNode }) {
  return (
    <details className="gc-fold">
      <summary>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>{title}</span>
        <span style={{ display: 'block', ...body, fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>{summary}</span>
      </summary>
      <div style={{ padding: '0 var(--space-4) var(--space-4)' }}>{children}</div>
    </details>
  )
}

export const revalidate = 3600

export default async function RsheMappingPage() {
  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, statutory_hooks, efcw_strands')
  const dbByModule = new Map((lessons ?? []).map(l => [l.module_id, l]))
  const modules = KEY_STAGE_ORDER.flatMap(ks => CURRICULUM.filter(m => m.keyStage === ks))

  const C = RSHE_2026_COUNTS
  const allTaught = C.full === C.total
  const headline = allTaught
    ? `All ${C.total} online requirements are taught.`
    : `${C.full} of ${C.total} online requirements are taught.`
  const others = [
    C.partial ? `${C.partial} part taught, with the missing part named` : '',
    C.gap ? `${C.gap} not covered` : '',
    C.byDesign ? `${C.byDesign} belong to your wider RSE` : '',
  ].filter(Boolean)

  const KCSIE: { risk: string; note: string; ns: number[] }[] = [
    { risk: 'Generative AI and AI chatbots', note: 'Seeded in the early years, taught in full at KS3 and KS5.', ns: [3, 9, 12, 20] },
    { risk: 'Deepfakes and AI generated images', note: 'Real and made up from Reception, the full treatment at KS3.', ns: [3, 12] },
    { risk: 'Misinformation and disinformation', note: 'Foundations at KS1, taught substantively at KS3, applied to persuasion at KS4.', ns: [3, 12, 15] },
    { risk: 'Conspiracy theories', note: 'Taught by name at KS3, with its own tell: a claim built so that evidence against it counts as proof of the cover up. Applied at KS4 to the communities that weaponise belief.', ns: [12, 18] },
  ]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--white)', padding: PAGE_SHELL }}>
      <style>{`
        .gc-hero { display: flex; gap: var(--space-5); align-items: center; justify-content: space-between; }
        @media (max-width: 640px) { .gc-hero { flex-direction: column; align-items: flex-start; gap: var(--space-4); } .gc-hero svg { width: 96px; height: 96px; } }
        .gc-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); list-style: none; padding: 0; margin: 0; }
        @media (max-width: 640px) { .gc-steps { grid-template-columns: 1fr; } }
        .gc-steps li { background: var(--cream); border-radius: var(--radius-tile); padding: var(--space-3) var(--space-4); }
        .gc-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: var(--space-3) var(--space-4); border-radius: var(--radius-btn); font-family: var(--font-body); font-weight: 800; font-size: var(--text-base); text-decoration: none; }
        .gc-btn-primary { background: var(--terracotta); color: var(--ink); box-shadow: 0 5px 0 var(--terracotta-dark); }
        .gc-btn-quiet { background: var(--white); color: var(--ink); border: 1px solid var(--border); }
        .gc-btn:focus-visible, .gc-fold summary:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 3px; }
        .gc-fold { border: 1px solid var(--border); border-radius: var(--radius-card); background: var(--white); margin-bottom: var(--space-3); }
        .gc-fold summary { list-style: none; cursor: pointer; padding: var(--space-4); padding-right: var(--space-6); position: relative; min-height: 44px; }
        .gc-fold summary::-webkit-details-marker { display: none; }
        .gc-fold summary::after { content: '+'; position: absolute; right: var(--space-4); top: var(--space-4); font-family: var(--font-display); font-weight: 900; font-size: var(--text-xl); color: var(--ink-muted); line-height: 1; }
        .gc-fold[open] summary::after { content: '\\2212'; }
        .gc-chip { display: inline-flex; font-family: var(--font-body); font-size: var(--text-sm); font-weight: 600; padding: var(--space-1) var(--space-3); border-radius: var(--radius-pill); border: 1px solid var(--border); background: var(--cream); color: var(--ink-soft); line-height: 1.5; }
        @media print {
          .gc-btn, .gc-steps, .gc-cta { display: none !important; }
          .gc-fold summary::after { content: ''; }
          .gc-avoid-break { break-inside: avoid; }
        }
      `}</style>

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
          <HubBackLink />
          <PrintButton />
        </div>

        {/* 1. THE ANSWER */}
        <section className="gc-hero" style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={mono}>RSHE statutory guidance · in force from 1 September 2026</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.75rem)', lineHeight: 1.1, color: 'var(--ink)', margin: 'var(--space-2) 0 var(--space-3)', letterSpacing: '-0.025em' }}>
              {headline}
            </h1>
            <p style={{ ...body, fontSize: 'var(--text-lg)', margin: 0 }}>
              Every digital and online requirement in the new RSHE guidance, primary and secondary, and the
              lesson that teaches it.
              {others.length > 0 && <>{' '}The rest: {others.join(', ')}.</>}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              <a href="#requirements" className="gc-btn gc-btn-primary">Find your requirement</a>
              <Link href="/pilot" className="gc-btn gc-btn-quiet">Try two lessons free</Link>
            </div>
          </div>
          <Ring done={C.full} total={C.total} />
        </section>

        {/* 2. HOW TO USE IT */}
        <ol className="gc-steps" style={{ marginBottom: 'var(--space-6)' }}>
          {[
            ['Pick your phase', 'Primary or secondary, then the strand you are planning.'],
            ['Check the lesson', 'Each requirement names the lesson that teaches it.'],
            ['Print it for your file', 'One tap prints every requirement, ready for your subject file or an inspector.'],
          ].map(([t, d], i) => (
            <li key={t}>
              <div style={{ ...mono, color: 'var(--retro-green-dark)' }}>Step {i + 1}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: 'var(--space-1) 0' }}>{t}</div>
              <div style={{ ...body, fontSize: 'var(--text-sm)' }}>{d}</div>
            </li>
          ))}
        </ol>

        {/* 3. THE REQUIREMENTS */}
        <RequirementList />

        {/* 4. THE DETAIL, FOLDED */}
        <h2 style={{ ...mono, marginBottom: 'var(--space-3)' }}>For your DSL and inspection file</h2>

        <Fold
          title="KCSIE 2026: the four new online risks"
          summary="Generative AI, deepfakes, misinformation and conspiracy theories, and the lessons that teach each one."
        >
          <p style={{ ...body, fontSize: 'var(--text-sm)', margin: '0 0 var(--space-3)' }}>
            Keeping Children Safe in Education 2026 is in force from 1 September 2026. Its four areas of online risk are
            content, contact, conduct and commerce (paragraph 165). Contact now covers &ldquo;generative AI applications that
            simulate&rdquo; harmful interaction, conduct covers explicit images &ldquo;including those generated using AI&rdquo;,
            and deepfakes are named in the definitions and at paragraph 160.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {KCSIE.map(row => (
              <div key={row.risk} className="gc-avoid-break" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-3)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>{row.risk}</h3>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                  {row.ns.map(n => CURRICULUM.find(m => m.n === n)).filter(Boolean).map(m => (
                    <span key={m!.moduleId} className="gc-chip">{positionCode(m!.moduleId)} · {m!.title}</span>
                  ))}
                </div>
                <p style={{ ...body, fontSize: 'var(--text-sm)', margin: 0 }}>{row.note}</p>
              </div>
            ))}
          </div>
        </Fold>

        <Fold
          title="Every lesson's statutory hooks"
          summary={`The KCSIE and framework anchors for all ${modules.length} lessons, with their Education for a Connected World strands.`}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {modules.map(m => {
              const row = dbByModule.get(m.moduleId)
              const hooks: string[] = row?.statutory_hooks ?? []
              const strands: number[] = row?.efcw_strands ?? []
              return (
                <div key={m.moduleId} className="gc-avoid-break" style={{ padding: 'var(--space-3) 0', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
                    <span style={{ ...mono, color: 'var(--ink-light)' }}>{m.keyStage} · Lesson {positionLabel(m.moduleId)}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{m.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {hooks.length > 0
                      ? hooks.map(h => <span key={h} className="gc-chip">{h}</span>)
                      : <span style={{ ...body, fontSize: 'var(--text-sm)' }}>This lesson is not yet published.</span>}
                    {strands.length > 0 && (
                      <span className="gc-chip" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                        EfCW strand{strands.length === 1 ? '' : 's'} {strands.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Fold>

        {/* 5. NEXT STEP */}
        <section className="gc-cta" style={{ background: 'var(--cream)', borderRadius: 'var(--radius-card)', padding: 'var(--space-5) var(--space-4)', margin: 'var(--space-5) 0', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
            See it in your own classroom
          </h2>
          <p style={{ ...body, margin: '0 auto var(--space-4)', maxWidth: '520px' }}>
            Two lessons matched to the phase you teach, free for a term, with the script on every slide and every printable.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/pilot" className="gc-btn gc-btn-primary">Try two lessons free</Link>
            <Link href="/curriculum" className="gc-btn gc-btn-quiet">See every lesson</Link>
          </div>
        </section>

        {/* 6. HOW WE CHECK */}
        <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', margin: 0 }}>
          How we check: a requirement is marked taught only where a named lesson teaches it, and every claim is held to
          words that must appear on that lesson&apos;s slides. This is the online part of the guidance, which runs to
          {' '}{RSHE_2026_SOURCE.itemsInGuidance}{' '}items across {RSHE_2026_SOURCE.strandsInGuidance}{' '}strands, and is
          built to sit inside your wider PSHE, not replace it. What your school has delivered is on the
          {' '}<Link href="/hub/coverage" style={{ color: 'var(--retro-green-dark)', fontWeight: 700 }}>coverage page</Link>.
        </p>
        <p style={{ ...mono, letterSpacing: '0.04em', textTransform: 'none', marginTop: 'var(--space-3)' }}>
          Source: {RSHE_2026_SOURCE.title}, {RSHE_2026_SOURCE.publisher}, {RSHE_2026_SOURCE.published}. Coverage last
          reviewed {longDate(RSHE_2026_SOURCE.reviewed)}. Page generated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
        </p>
      </div>
    </main>
  )
}
