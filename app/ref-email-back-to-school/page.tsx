import { backToSchoolEmail } from '@/lib/email/templates'
import { yearGroupFromDob } from '@/lib/learning/calendar'

// Look at the email without sending one.
//
// Justin sent the Good Inside August roundup and asked for the style, in our
// colours, alternating. Copy in a pull request is not a thing you can judge, so
// this is the same reference page pattern as ref-roundup-card and the rest:
// open a URL, see the actual rendered email.
//
// Two variants side by side, because the whole point of this email is that it
// is not the same email for everybody. One family is in the Year 6 phone
// window and gets a block nobody else sees. The other is not, and their version
// is shorter for it.

export const metadata = { title: 'Back to school email · reference' }
export const dynamic = 'force-dynamic'

// Fixed so the page reads the same in December as it does today. The email
// itself takes `on` for exactly this reason.
const ON = new Date('2026-08-12T00:00:00Z')

// Year 6 in the 2026/27 school year: born in the 2014/15 intake year.
const YEAR_6_DOB = '2015-03-14'
// A younger child, well outside the phone window.
const YEAR_3_DOB = '2018-06-02'

function Frame({ title, note, html }: { title: string; note: string; html: string }) {
  return (
    <div style={{ flex: '1 1 420px', minWidth: 0 }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
        margin: '0 0 4px',
      }}>
        {title}
      </p>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '0 0 12px', lineHeight: 1.5 }}>
        {note}
      </p>
      <iframe
        title={title}
        srcDoc={html}
        style={{
          width: '100%', height: 1400, border: '1.5px solid var(--border)',
          borderRadius: 16, background: '#fff',
        }}
      />
    </div>
  )
}

export default function RefBackToSchoolEmail() {
  const withPhone = backToSchoolEmail({
    childName: 'Teo',
    dob: YEAR_6_DOB,
    stageNumber: 3,
    unsubscribe: '#',
    on: ON,
  })
  const without = backToSchoolEmail({
    childName: 'Alma',
    dob: YEAR_3_DOB,
    stageNumber: 1,
    unsubscribe: '#',
    on: ON,
  })

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 20px 60px' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 6 }}>The back to school roundup</h1>
      <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-md)', marginBottom: 8, lineHeight: 1.6 }}>
        The Good Inside roundup shape in our own palette, alternating through the five stage colours instead of one blue.
        Each band starts at the child&rsquo;s own stage, so the first colour is the one they already know from the app.
      </p>
      <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-sm)', marginBottom: 24, lineHeight: 1.6 }}>
        Rendered as at 12 August 2026. Teo is in Year {yearGroupFromDob(YEAR_6_DOB, ON)}, Alma is in Year{' '}
        {yearGroupFromDob(YEAR_3_DOB, ON)}.
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Frame
          title={withPhone.subject}
          note="Year 6 in August: the phone window block appears, because this is the family it is actually for."
          html={withPhone.html}
        />
        <Frame
          title={without.subject}
          note="Year 3: no phone block at all. Shorter, and nothing in it is aimed at somebody else's child."
          html={without.html}
        />
      </div>
    </div>
  )
}
