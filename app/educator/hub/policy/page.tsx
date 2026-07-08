import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'

// Policy ready text: paragraphs a school pastes into its published RSE
// and online safety policy. Written to the 2025 guidance requirements,
// including the parental transparency wording.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.7 }
const block: React.CSSProperties = { border: '1.5px solid var(--border)', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', background: 'var(--cream)' }
const h2: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', margin: '0 0 8px' }

export default async function PolicyTextPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/educator/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>For your published RSE and online safety policy · paste and adapt</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', margin: '6px 0 8px' }}>
          Policy ready text
        </h1>
        <p style={{ ...body, marginBottom: '20px' }}>
          The paragraphs below are written to drop into your school&rsquo;s published RSE and online
          safety policy. Adapt names and details to your context. Your policy must be published online
          and available free of charge, and must be consulted on with parents before it is finalised:
          the parent pack in this Hub provides the sample materials for that consultation.
        </p>

        <div style={block}>
          <h2 style={h2}>The programme (for your curriculum section)</h2>
          <p style={body}>
            Digital literacy and online safety are taught through the Guided Childhood Schools programme:
            a sequenced scheme of twenty one modules from Reception to Year 13, covering all eight strands
            of the UKCIS Education for a Connected World framework and mapped to the DfE RSHE statutory
            guidance (2025), Keeping Children Safe in Education (2025), and the Citizenship and Computing
            programmes of study. Each lesson is taught by a class teacher from a fully scripted interactive
            lesson, with printed materials for pupils, an action for home in every lesson, and a note to
            parents that requires no login or sign up. The programme supplements and does not replace the
            school&rsquo;s wider PSHE provision.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>Parental transparency (required wording territory)</h2>
          <p style={body}>
            Parents and carers may view any teaching material used in this programme on request, at any
            time. The school&rsquo;s licence with Guided Childhood explicitly permits sharing lesson
            materials with parents of pupils taught from them, and no contractual term restricts this.
            Sample materials for every module, including all safeguarding flagged content, were shared
            with parents as part of the consultation on this policy, and remain available from the school
            office or via the programme&rsquo;s parent pack.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>Sensitive content and safeguarding (for your safeguarding section)</h2>
          <p style={body}>
            Five modules carry content the school treats with additional care: online bullying (Years 3
            to 6), body image and the harms of pornography (Years 7 to 9), consent and image sharing,
            sextortion, and radicalisation and misogyny (Years 10 to 11). Each carries a written note for
            the Designated Safeguarding Lead, staff briefing guidance, and teacher scripts that include
            disclosure handling in line with our safeguarding policy. Content in these modules is
            age appropriate, non graphic, and centred on recognising harm, refusing pressure, reporting
            routes, and the message that a young person who discloses is not in trouble. The platform
            records no pupil disclosures: all safeguarding concerns follow the school&rsquo;s own
            reporting systems.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>Pupil data (for your data protection section)</h2>
          <p style={body}>
            The programme is designed for data minimisation. Pupils do not have accounts, logins or
            passwords. The only pupil data processed is a first name and initial, entered by the teacher
            for class organisation and printed quiz personalisation, and lesson participation records.
            No behavioural profiling, no advertising, no data sharing with third parties beyond the
            infrastructure providers named in the programme&rsquo;s data protection pack, which is
            available to our Data Protection Officer.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>Right to withdraw (adapt to your school&rsquo;s position)</h2>
          <p style={body}>
            The content of this programme sits within health education, online safety and citizenship,
            from which there is no parental right of withdrawal. Where any lesson touches sex education
            content beyond the national curriculum for science, parents have the right to request
            withdrawal in line with statutory guidance, and the school will consider such requests as
            set out in this policy. In practice this programme teaches digital literacy and online
            safety and does not deliver sex education.
          </p>
        </div>

        <p style={{ ...body, fontSize: '11.5px', color: 'var(--ink-muted)' }}>
          This text is a starting point, not legal advice. Your policy remains your school&rsquo;s own
          document and should be reviewed by your PSHE lead, DSL and governing body in the normal way.
        </p>
      </div>
    </main>
  )
}
