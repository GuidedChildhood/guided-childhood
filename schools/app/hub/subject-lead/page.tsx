import Link from 'next/link'
import InShort from '@/components/InShort'
import PrintButton from '@/components/PrintButton'
import { MODULE_COUNT } from '@gc/shared/schools-curriculum'
import { PAGE_SHELL } from '@gc/shared/page-scale'

export const metadata = { title: 'The subject lead kit' }

// THE SUBJECT LEAD KIT (15 November 2026).
//
// Justin asked for the gaps against the strongest paid schemes to be built.
// The review of their own pages found one thing a subject lead expects that
// we did not have: a kit for the lead's own job. Deep dive questions with
// where the answer is, a pupil voice sheet and a staff confidence audit.
// Everything else on that list we already had, scattered across the Hub, so
// the first section is a map to it and nothing here repeats another page.
//
// TWO RULES. No pupil is named anywhere: the pupil voice sheet is a show of
// hands the teacher tallies, the same as the quiz counts. And nothing here
// claims an outcome: the questions are ones a lead is asked, and each answer
// is a page they can open, never a sentence we wrote for them to recite.
//
// The last section, how the lessons are designed, is the digital scheme's
// answer to the French scheme's "Avoiding overload" page: why every lesson
// has the same shape. Each line of it is checkable in any lesson file.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7 }
const small: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6 }
const block: React.CSSProperties = { border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '16px 20px', marginBottom: '16px', background: 'var(--cream)' }
const h2: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '28px 0 10px' }
const link: React.CSSProperties = { color: 'var(--green-dark)', fontWeight: 700 }

// A question a subject lead is asked, and the page that answers it.
const DEEP_DIVE: { stage: string; rows: [string, string, string][] }[] = [
  {
    stage: 'Intent: why this, why now',
    rows: [
      ['Why do you teach this, and why in this order?', 'The progression map: each lesson, the earlier ones it builds on and the later ones it leads to.', '/hub/progression'],
      ['How do you know it meets the statutory guidance?', 'Statutory coverage, requirement by requirement, in the guidance\'s own words.', '/hub/rshe-mapping'],
      ['How does it sit beside computing?', 'Every statement of the computing curriculum, and which ones this scheme teaches.', '/hub/computing-mapping'],
      ['What does a year look like?', 'The year plan, with a suggested year and term for every lesson.', '/hub/year-plan'],
    ],
  },
  {
    stage: 'Implementation: what happens in the room',
    rows: [
      ['How does a non specialist teach it?', 'Every slide has a word for word script. Open any lesson and read the first three.', '/curriculum'],
      ['How are staff prepared for the sensitive lessons?', 'A ten minute briefing for each safeguarding flagged lesson, and the fifteen minute induction.', '/hub/cpd'],
      ['What about pupils with SEND or EAL?', 'Named adaptations on every lesson page, and the accessibility statement.', '/hub/accessibility'],
      ['What do parents see?', 'The parent pack, and a note home for every lesson.', '/hub/parents'],
    ],
  },
  {
    stage: 'Impact: how you know',
    rows: [
      ['Which classes have been taught what?', 'Class progress: every class beside every lesson, with dates.', '/hub/progress?class=all'],
      ['What have pupils actually been taught against the requirements?', 'Coverage: each requirement, its lessons, and what your school has delivered.', '/hub/coverage'],
      ['How do you know they remembered it?', 'A starter quiz and an exit quiz on every lesson, a look back quiz built from what a class has had, and the class counts beside each lesson.', '/print/look-back'],
      ['What did you change because of it?', 'The teach again list on class progress: every lesson a teacher judged as needing a revisit.', '/hub/progress'],
    ],
  },
]

const PUPIL_VOICE = [
  'I can tell you one thing I learned in our last lesson.',
  'I know what I would do if something online worried me.',
  'I know which grown up at school I would tell.',
  'The lessons are about things that really happen to people my age.',
  'I have talked about one of these lessons at home.',
  'I feel I can say what I think in these lessons.',
]

const STAFF_AUDIT = [
  'I know where to find the lesson, the script and the sheets for my year.',
  'I could teach the next lesson from the script without extra preparation.',
  'I know which lessons for my year are safeguarding flagged.',
  'I know exactly what to do, and who to tell, if a pupil discloses something.',
  'I am confident with the vocabulary the lessons use.',
  'I know how to adapt a lesson for a pupil with SEND or EAL.',
  'I mark each lesson delivered, so the school record is true.',
  'I know what to do when a pupil knows more about an app than I do.',
]

export default function SubjectLeadKit() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--white)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>For the subject lead · monitoring, pupil voice, staff confidence</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px' }}>
          The subject lead kit
        </h1>
        <p style={{ ...body, marginBottom: '20px' }}>
          The three jobs a subject lead does that no lesson plan does for them: answering for the subject,
          hearing from pupils, and knowing how confident staff feel. Each one is a page to print.
        </p>

        <InShort points={[
          <><b>Deep dive questions</b>, grouped the way they are asked, each with the page that answers it.</>,
          <>A <b>pupil voice sheet</b>: six statements, a show of hands, a tally for the class. No pupil is named.</>,
          <>A <b>staff confidence audit</b>: eight statements, two minutes, before and after a term.</>,
          <><b>How the lessons are designed</b>, so you can explain why all {MODULE_COUNT} have the same shape.</>,
        ]} />

        <h2 style={h2}>1. Deep dive questions, and where the answer is</h2>
        <p style={{ ...small, margin: '0 0 12px' }}>
          Open the page beside the question and show it. The answer is your school&apos;s own record, not a sentence to learn.
        </p>
        {DEEP_DIVE.map(group => (
          <div key={group.stage} style={block} className="gc-lead-block">
            <h3 style={{ ...mono, color: 'var(--green-dark)', margin: '0 0 8px' }}>{group.stage}</h3>
            <dl style={{ margin: 0 }}>
              {group.rows.map(([q, a, href], i) => (
                <div key={q} style={{ borderTop: i ? '1px solid var(--border)' : 0, padding: '10px 0' }}>
                  <dt style={{ ...body, fontWeight: 700 }}>{q}</dt>
                  <dd style={{ ...small, margin: '2px 0 0', color: 'var(--ink-soft)' }}>
                    {a}{' '}
                    <Link href={href} style={{ ...link, display: 'inline-flex', alignItems: 'center', minHeight: 44 }} className="no-print">Open it</Link>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <h2 style={h2}>2. Pupil voice: one show of hands a term</h2>
        <p style={{ ...small, margin: '0 0 12px' }}>
          Read each statement, ask for hands, and write the number in each box. It takes five minutes and
          belongs to the class, not to a child. Do it again next term and put the two sheets side by side.
        </p>
        <div style={block} className="gc-lead-block">
          <p style={{ ...small, margin: '0 0 10px' }}>Class: ____________ &nbsp; Date: ____________ &nbsp; Pupils in the room: ______</p>
          <table className="gc-lead-table">
            <thead><tr><th scope="col">Statement</th><th scope="col">Yes</th><th scope="col">Not sure</th><th scope="col">Not yet</th></tr></thead>
            <tbody>
              {PUPIL_VOICE.map(s => <tr key={s}><th scope="row">{s}</th><td /><td /><td /></tr>)}
            </tbody>
          </table>
          <p style={{ ...small, margin: '10px 0 0' }}>One thing pupils asked for: ______________________________________________</p>
        </div>

        <h2 style={h2}>3. Staff confidence audit</h2>
        <p style={{ ...small, margin: '0 0 12px' }}>
          Hand it out at the start of a staff meeting and collect it unnamed. Any statement where most of the
          room is unsure is next term&apos;s ten minutes. The briefings and the induction in the Hub are written for exactly that.
        </p>
        <div style={block} className="gc-lead-block">
          <table className="gc-lead-table">
            <thead><tr><th scope="col">Statement</th><th scope="col">Sure</th><th scope="col">Fairly sure</th><th scope="col">Not sure</th></tr></thead>
            <tbody>
              {STAFF_AUDIT.map(s => <tr key={s}><th scope="row">{s}</th><td /><td /><td /></tr>)}
            </tbody>
          </table>
        </div>

        <h2 style={h2}>4. How the lessons are designed</h2>
        <div style={block} className="gc-lead-block">
          <p style={{ ...body, margin: '0 0 10px' }}>
            Every lesson has the same shape, so pupils spend their effort on the idea and not on working out what
            is happening, and a teacher who has taught one can teach any of them.
          </p>
          <ol style={{ ...body, margin: 0, paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <li><b>Starter.</b> A short look back at an earlier lesson before anything new.</li>
            <li><b>Teach.</b> One idea at a time, with the words to say on every slide.</li>
            <li><b>Practise.</b> The class tries it together: sorting, voting, deciding, out loud and on paper.</li>
            <li><b>Prove.</b> Real choices to make, so a teacher can see who has it.</li>
            <li><b>Close.</b> One thing each pupil can now do, and the question that goes home.</li>
          </ol>
          <p style={{ ...small, margin: '12px 0 0' }}>
            One of the Planet Friends hosts each lesson and voices the struggle, so a pupil can agree with the
            character without having to own up to anything. Each lesson names three misconceptions with the
            correction, carries SEND and EAL adaptations, and runs on paper with no screen if it has to. The
            lessons are tagged to the strands of Education for a Connected World, the national framework for online safety.
          </p>
        </div>

        <style>{`
          .gc-lead-table { width: 100%; border-collapse: collapse; font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink); }
          .gc-lead-table th, .gc-lead-table td { border: 1px solid var(--border); padding: 10px; text-align: left; font-weight: 400; line-height: 1.45; }
          .gc-lead-table thead th { font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-muted); }
          .gc-lead-table td { width: 15%; height: 44px; background: var(--white); }
          @media (max-width: 560px) { .gc-lead-table th, .gc-lead-table td { padding: 8px 6px; } }
          @media print { .gc-lead-block { break-inside: avoid; } }
        `}</style>
      </div>
    </main>
  )
}
