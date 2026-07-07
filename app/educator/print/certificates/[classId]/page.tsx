import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'

// Certificates: one per pupil, names pre printed from the class list,
// two per A4 page (print design system 4.7). The one artefact where a
// decorative frame is expected. DiGi the golden star presides.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }

export default async function CertificatesPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: cls } = await supabase
    .from('school_classes')
    .select('id, name, year_group')
    .eq('id', classId)
    .maybeSingle()
  if (!cls) notFound()

  const { data: pupils } = await supabase
    .from('pupils')
    .select('id, display_name')
    .eq('class_id', classId)
    .order('display_name')

  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', background: '#fff', color: 'var(--ink)', padding: '24px 8px 60px' }}>
      <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link href="/educator/print" style={{ ...mono, textDecoration: 'none' }}>← Print room</Link>
        <PrintButton label={`Print ${(pupils ?? []).length} certificates`} />
      </div>
      <p className="gc-print-btn" style={{ ...mono, marginBottom: '14px' }}>
        {cls.name} · {cls.year_group} · two per page, cut along the middle
      </p>

      {(pupils ?? []).map(p => (
        <div key={p.id} style={{
          border: '3px solid var(--gold, #F2C94C)', borderRadius: '18px',
          margin: '0 0 18px', padding: '30px 26px', textAlign: 'center',
          pageBreakInside: 'avoid', position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: '7px', border: '1.5px solid var(--gold-hover, #E3B53A)', borderRadius: '12px', pointerEvents: 'none' }} />
          <div style={{ fontSize: '40px', lineHeight: 1, marginBottom: '8px' }}>⭐</div>
          <div style={{ ...mono, color: 'var(--gold-dark, #7A5A0E)', marginBottom: '6px' }}>Guided Childhood Schools</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            Digital Detective Award
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 6px' }}>This is to certify that</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            {p.display_name}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 20px' }}>
            ran the checks, asked the questions, and built judgement most people never learn.
            The internet is lucky to have you.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-muted)' }}>
            <span>Signed ▁▁▁▁▁▁▁▁▁▁▁▁</span>
            <span>Date ▁▁▁▁▁▁▁▁</span>
          </div>
        </div>
      ))}
      {(pupils ?? []).length === 0 && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>No pupils in this class yet.</p>
      )}
    </main>
  )
}
