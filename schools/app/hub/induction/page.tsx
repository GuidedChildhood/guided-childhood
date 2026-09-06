import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

// STAFF INDUCTION: the fifteen minute meeting that starts the scheme.
// The audit (Report 9) found the onboarding story right for sales but with
// no single page a head could run a staff room through. This is that page:
// seven agenda items with timings, each ending in the one thing staff do.
// Everything it names already exists and is linked, nothing is promised.

export const metadata = { title: 'Staff induction', robots: { index: false, follow: false } }

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7 }
const h2: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px' }
const doLine: React.CSSProperties = { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }

const AGENDA = [
  {
    minutes: '2 minutes',
    title: 'What this is',
    text: 'The digital literacy and online safety spine, Reception to Year 13: 21 modules, one per year group, teaching the judgement to handle screens, feeds, strangers and AI. It slots inside your wider PSHE provision and covers the online safety strand of the statutory RSHE guidance. It is not a filtering product, not a monitoring product, and it holds no pupil data at all.',
    action: 'Staff hear the one line: we teach judgement, not fear.',
  },
  {
    minutes: '3 minutes',
    title: 'How a lesson runs',
    text: 'One projector teaches the whole class, no pupil devices. Every slide carries a word for word script, so a non specialist can teach any module without winging a sentence. The night before takes five minutes: read the teacher one pager, tick the prep list. Each lesson ends with the printed worksheet, the exit cards and the learning record the child colours in their book.',
    action: 'Everyone opens one lesson from the curriculum page and reads one scripted slide aloud.',
    href: '/curriculum', linkLabel: 'The curriculum',
  },
  {
    minutes: '2 minutes',
    title: 'The print room',
    text: 'Every worksheet, booklet, run sheet, answer key and learning record generates from the taught curriculum in two clicks, so paper never drifts from what was taught. If the projector dies, the printed pack runs the whole lesson with no screen at all.',
    action: 'The subject lead shows where the print room lives and prints one pack.',
    href: '/print', linkLabel: 'The print room',
  },
  {
    minutes: '3 minutes',
    title: 'The flagged modules',
    text: 'Ten modules are safeguarding flagged. Each carries disclosure handling written into its scripts, a DSL note, and a ten minute staff briefing: the register to hold, what to watch for in the room, and exactly what to do with a disclosure. Nobody teaches a flagged module without reading its briefing the night before.',
    action: 'Staff teaching a flagged module this term open their briefing now.',
    href: '/hub/cpd', linkLabel: 'The staff briefings',
  },
  {
    minutes: '2 minutes',
    title: 'Disclosures and the DSL',
    text: 'The platform records nothing about pupils, so every disclosure follows your own safeguarding policy and your own systems, exactly as it should. The crosswalk gives your DSL every flagged module, its statutory hook and its disclosure guidance on one page. The message pupils hear again and again: you are not in trouble for telling.',
    action: 'The DSL takes the crosswalk away to file beside the safeguarding policy.',
    href: '/hub/dsl', linkLabel: 'The safeguarding crosswalk',
  },
  {
    minutes: '2 minutes',
    title: 'No pupil data, and what that means day to day',
    text: 'Your school signs in with a class code, not accounts. No pupil names, no logins, no tracking, nothing to breach. The record of learning is paper in the child’s book. Evidence for Ofsted is the statutory mapping, the year plan, the run sheets and the coloured learning records, generated from the taught curriculum.',
    action: 'Staff hear where the class code lives and who holds it.',
  },
  {
    minutes: '1 minute',
    title: 'Parents',
    text: 'Any parent can see any material on request, and the licence explicitly permits it. The parent pack in the Hub is built for consultation. If a parent asks, the answer is yes, straight away, with the page open.',
    action: 'Everyone knows the answer to a parent asking to see a lesson: yes.',
    href: '/hub/parents', linkLabel: 'The parent pack',
  },
]

export default function InductionPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton label="Print the induction" />
        </div>

        <div style={mono}>Staff induction · one fifteen minute meeting before the scheme starts</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px' }}>
          The fifteen minute induction
        </h1>
        <p style={{ ...body, marginBottom: '22px' }}>
          Run this as one staff meeting, with the projector on this page. Seven items, each with a
          timing and the one thing staff actually do. A teacher who missed the meeting can read this
          page alone in the same fifteen minutes and be ready to teach.
        </p>

        {AGENDA.map((a, i) => (
          <div key={a.title} style={{ border: '1.5px solid var(--border)', borderRadius: '14px', padding: '18px 22px', marginBottom: '16px', pageBreakInside: 'avoid' }}>
            <div style={{ ...mono, marginBottom: '4px' }}>{i + 1} · {a.minutes}</div>
            <h2 style={h2}>{a.title}</h2>
            <p style={{ ...body, marginBottom: '8px' }}>{a.text}</p>
            <p style={{ ...body, marginBottom: a.href ? '8px' : 0 }}>
              <span style={doLine}>The one thing: </span>{a.action}
            </p>
            {a.href && (
              <Link href={a.href} style={{ ...mono, color: 'var(--green-dark)', textDecoration: 'none' }}>
                {a.linkLabel} →
              </Link>
            )}
          </div>
        ))}

        <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
          This induction supports your safeguarding training, it does not replace it. Your school&rsquo;s
          safeguarding policy and DSL always take precedence.
        </p>
      </div>
    </main>
  )
}
