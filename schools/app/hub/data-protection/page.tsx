import { db as supabase } from '@/lib/supabase/server-db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

// The data protection pack: written for the school DPO. Data minimisation
// is the design, so this document is short because there is little to say,
// and that IS the point.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7 }
const block: React.CSSProperties = { border: '1.5px solid var(--border)', borderRadius: '14px', padding: '16px 20px', marginBottom: '14px' }
const h2: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 8px' }

export default async function DataProtectionPage() {

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>For your Data Protection Officer · DPIA support</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px' }}>
          Data protection pack
        </h1>
        <p style={{ ...body, marginBottom: '20px' }}>
          This programme was designed backwards from one principle: the least pupil data that can
          possibly deliver the teaching. Pupils have no accounts, no logins, no passwords, no email
          addresses and no profiles. This document gives your DPO what a data protection impact
          assessment needs.
        </p>

        <div style={block}>
          <h2 style={h2}>1. What pupil data is processed, and why</h2>
          <p style={body}>
            <strong>None.</strong> The schools platform processes no pupil data at all. A school signs in
            with a class code, which identifies the school and nothing else: no pupil names, no dates of
            birth, no photographs, no contact details, no free text about pupils, no special category
            data, and no record of which pupil saw which lesson. Where a name appears in the teaching, it
            is handwritten on a printed worksheet or learning record that never leaves your school.
            Children in the family product interact through a parent held link token, never an account.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>2. Lawful basis and roles</h2>
          <p style={body}>
            Because no pupil data is processed, there is no controller and processor relationship to
            paper over pupils. The only personal data we hold is what the school gives us to run the
            licence: a contact name and email for invoicing. A short data processing agreement covering
            that contact data is available for signature with the licence. We never use any data for
            advertising, profiling, product analytics or model training, and we never sell or share it.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>3. Age appropriate design, by phase</h2>
          <p style={body}>
            The service spans ages 4 to 18, and the design differentiates by phase as the ICO&rsquo;s
            Age Appropriate Design Code expects. EYFS to KS2: pupils never operate the platform, the
            teacher projects, and pupil participation is on paper. KS3 to KS5: pupils still hold no
            accounts, and any classroom interaction is through the teacher&rsquo;s session. The family
            product&rsquo;s child screen is reached only through a link the parent creates, holds and can
            revoke, shows only that child&rsquo;s own first name, quests and stars, and carries no
            navigation to any other data.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>4. Storage, subprocessors and retention</h2>
          <p style={body}>
            Data is stored with Supabase (database, EU hosted project region) behind row level security,
            and the application is served by Vercel. Transport is encrypted throughout. There are no
            pupil rows to retain or delete. On licence termination the school&rsquo;s account and contact
            details are deleted on request or after the retention window agreed in the data processing
            agreement. Access within Guided Childhood is limited to what operating the service requires.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>5. What this platform deliberately does not do</h2>
          <p style={body}>
            No pupil accounts. No behavioural tracking or advertising. No third party trackers in the
            lesson player. No pupil generated free text stored from lessons. No disclosure recording:
            safeguarding concerns belong in the school&rsquo;s own systems, and every safeguarding
            flagged module says so to the teacher in writing.
          </p>
        </div>

        <div style={block}>
          <h2 style={h2}>6. Consultation evidence for your DPIA</h2>
          <p style={body}>
            The ICO expects the views of children and parents to inform a DPIA for services used by
            children. The parent consultation your school runs before adopting this programme (using the
            parent pack in this Hub) doubles as that evidence: record the consultation date, what was
            shared, and any concerns raised, and file it with the DPIA.
          </p>
        </div>

        <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
          This pack supports your DPIA but does not replace it: the school remains responsible for its
          own assessment. Questions to justin@thesocialbillboard.com and our DPO contact named in the
          data processing agreement.
        </p>
      </div>
    </main>
  )
}
