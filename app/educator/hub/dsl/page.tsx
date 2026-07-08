import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'
import { CURRICULUM } from '@/lib/content/schools-curriculum'

// The DSL crosswalk: every safeguarding flagged module, its statutory
// hook and its disclosure guidance on one page. DSL notes pull live from
// the lesson rows so this page and the taught content can never disagree.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.7 }

type DslNote = { required?: boolean; note?: string }

export default async function DslCrosswalkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, statutory_hooks, dsl_note')
  const dbByModule = new Map((lessons ?? []).map(l => [l.module_id, l]))

  const flagged = CURRICULUM.filter(m => {
    const db = dbByModule.get(m.moduleId)
    const note = (db?.dsl_note ?? {}) as DslNote
    return m.dsl || note.required
  })

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/educator/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>For the Designated Safeguarding Lead · reference from your safeguarding policy</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', margin: '6px 0 8px' }}>
          Safeguarding crosswalk
        </h1>
        <p style={{ ...body, marginBottom: '8px' }}>
          {flagged.length} of the 21 modules are safeguarding flagged. Each is listed below with the
          statutory ground it stands on and the note its teachers receive before teaching. Two standing
          rules across every module: content is age appropriate and never graphic, and the platform
          records no disclosures, so every concern follows your school&rsquo;s own reporting systems.
        </p>
        <p style={{ ...body, fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '22px' }}>
          The PSHE Association advises linking your safeguarding policy explicitly to the RSHE
          curriculum under the renewed Ofsted framework. This page is written to be that link: file it
          or reference it from the policy.
        </p>

        {flagged.map(m => {
          const db = dbByModule.get(m.moduleId)
          const note = (db?.dsl_note ?? {}) as DslNote
          return (
            <div key={m.moduleId} style={{ border: '2px solid var(--coral)', borderRadius: '14px', padding: '16px 20px', marginBottom: '14px' }}>
              <div style={{ ...mono, color: 'var(--coral-dark)', marginBottom: '4px' }}>
                {m.keyStage} · Module {String(m.n).padStart(2, '0')} · {m.yearBand}
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)', margin: '0 0 6px' }}>
                {m.title}
              </h2>
              <p style={{ ...body, fontSize: '12.5px', marginBottom: '8px' }}>
                <strong>Statutory ground:</strong> {(db?.statutory_hooks ?? []).join(' · ') || 'Loads from the module row.'}
              </p>
              <p style={{ ...body, fontSize: '13px' }}>
                <strong>The note teachers receive:</strong>{' '}
                {note.note ?? 'The DSL note loads from the module row when the lesson is live.'}
              </p>
            </div>
          )
        })}

        <p style={{ ...body, fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '10px' }}>
          Generated live from the curriculum data on {new Date().toLocaleDateString('en-GB')}. Staff
          briefings for teaching these modules are in the Hub under Staff briefings.
        </p>
      </div>
    </main>
  )
}
