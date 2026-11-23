import { db as supabase } from '@/lib/supabase/server-db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import HubBackLink from '@/components/HubBackLink'
import { SchoolFacts } from '@/components/YourSchoolLead'
import YourSchoolPanel from '../YourSchoolPanel'
import { CURRICULUM, positionLabel } from '@gc/shared/schools-curriculum'
import { PAGE_SHELL } from '@gc/shared/page-scale'
import InShort from '@/components/InShort'
import { RefFold, JumpChips, RefGroup, RefPageKit } from '@/components/RefFold'

export const metadata = { title: 'Safeguarding crosswalk' }

// The DSL crosswalk: every safeguarding flagged module, its statutory
// hook and its disclosure guidance on one page. DSL notes pull live from
// the lesson rows so this page and the taught content can never disagree.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7 }

type DslNote = { required?: boolean; note?: string }

export const revalidate = 3600

export default async function DslCrosswalkPage() {

  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, statutory_hooks, dsl_note')
  const dbByModule = new Map((lessons ?? []).map(l => [l.module_id, l]))

  const flagged = CURRICULUM.filter(m => {
    const db = dbByModule.get(m.moduleId)
    const note = (db?.dsl_note ?? {}) as DslNote
    return m.dsl || note.required
  })
  const stages = [...new Set(flagged.map(m => m.keyStage))]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--white)', padding: PAGE_SHELL }}>
      <RefPageKit />
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <HubBackLink />
          <PrintButton />
        </div>

        <div style={mono}>For the Designated Safeguarding Lead · link it from your policy</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px' }}>
          Safeguarding crosswalk
        </h1>
        <p style={{ ...body, marginBottom: 'var(--space-4)' }}>
          {flagged.length}{' '}of the{' '}{CURRICULUM.length}{' '}modules are safeguarding flagged. Open one for its statutory ground and the note its teachers receive.
        </p>

        <div style={{ margin: '0 0 var(--space-4)' }}>
          <InShort accent="var(--coral)" ink="var(--coral-dark)" points={[
            <>Content is age appropriate and <b>never graphic</b>, in every module.</>,
            <>The platform <b>records no disclosures</b>. Every concern follows your school&rsquo;s own reporting systems.</>,
            <>The PSHE Association advises linking your safeguarding policy to the RSHE curriculum under the renewed Ofsted framework. This page is written to be that link: file it or reference it from the policy.</>,
          ]} />
        </div>

        <JumpChips items={stages.map(k => ({ href: `#${k.toLowerCase()}`, label: k }))} />

        {/* THE SCHOOL'S OWN COPY (23 September 2026). A DSL reviewing the
            scheme asked for material she could adapt. On screen, the form;
            on paper, what was typed, or ruled lines to write it in. Both
            read the browser only: this page stays a server page, and no
            member of staff's name ever reaches it. */}
        <RefFold title="Your school's details" hint="Type your DSL and reporting route once, for every printed copy">
          <YourSchoolPanel variant="crosswalk" />
        </RefFold>
        <SchoolFacts mode="paper" />

        {stages.map(k => (
          <section key={k}>
            <RefGroup id={k.toLowerCase()}>{k}</RefGroup>
            {flagged.filter(m => m.keyStage === k).map(m => {
              const db = dbByModule.get(m.moduleId)
              const note = (db?.dsl_note ?? {}) as DslNote
              return (
                <RefFold key={m.moduleId} tone="care" title={m.title} hint={`Lesson ${positionLabel(m.moduleId)}, ${m.yearBand}`}>
                  <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '8px' }}>
                    <strong>Statutory ground:</strong> {(db?.statutory_hooks ?? []).join(' · ') || 'Loads from the module row.'}
                  </p>
                  <p style={{ ...body, fontSize: 'var(--text-base)' }}>
                    <strong>The note teachers receive:</strong>{' '}
                    {note.note ?? 'The DSL note loads from the module row when the lesson is live.'}
                  </p>
                </RefFold>
              )
            })}
          </section>
        ))}

        <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '10px' }}>
          Generated live from the curriculum data on {new Date().toLocaleDateString('en-GB')}. Staff
          briefings for teaching these modules are in the Hub under Staff briefings.
        </p>
      </div>
    </main>
  )
}
