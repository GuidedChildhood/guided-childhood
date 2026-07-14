import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/agreement/PrintButton'
import { PrintBrandHeader, PrintBrandFooter } from '@/components/brand/PrintBrand'

export const dynamic = 'force-dynamic'

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function AgreementPrintPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: agreement }, { data: child }] = await Promise.all([
    supabase.from('family_agreements').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('children').select('name').eq('parent_id', user.id).eq('is_primary', true).maybeSingle(),
  ])

  if (!agreement) redirect('/dashboard/agreement')

  const childName = child?.name ?? 'Our child'
  const sections = [
    { title: 'What screens are for in our family', body: agreement.family_values },
    { title: 'When screens stop', body: agreement.bedroom_rule_time },
    { title: 'Where devices sleep', body: agreement.bedroom_rule_location },
    { title: 'Social media', body: agreement.social_media_terms },
    { title: 'When things go wrong', body: agreement.when_things_go_wrong },
    { title: 'Our extra agreements', body: agreement.extra_agreements },
  ].filter(s => s.body && s.body.trim().length > 0)

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 20px 48px' }}>
      <style>{`
        @media print {
          header, .bottom-tab-bar, .no-print { display: none !important; }
          main { padding: 0 !important; }
          body { background: #fff !important; }
        }
      `}</style>

      {/* Screen chrome */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/dashboard/agreement" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '0.04em' }}>
          ← Back to the builder
        </Link>
        <PrintButton />
      </div>

      {/* The document */}
      <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: '20px', padding: 'clamp(28px, 5vw, 44px)' }}>
        <PrintBrandHeader />
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
            Family agreement{agreement.version > 1 ? ` · Version ${agreement.version}` : ''}
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', lineHeight: 1.1, marginBottom: '8px' }}>
            Our family agreement
          </h1>
          {agreement.agreed_date && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.04em' }}>
              Agreed together on {formatDate(agreement.agreed_date)}
            </p>
          )}
        </div>

        {sections.map((section, i) => (
          <div key={i} style={{ marginBottom: '22px', breakInside: 'avoid' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
              {section.title}
            </div>
            <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.7, margin: 0 }}>
              {section.body}
            </p>
          </div>
        ))}

        {/* Signatures */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '36px', paddingTop: '24px', borderTop: '1.5px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { name: 'Parent', signed: agreement.signed_by_parent },
            { name: childName, signed: agreement.signed_by_child },
          ].map((sig, i) => (
            <div key={i} style={{ flex: 1, minWidth: '180px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', borderBottom: '2px solid var(--ink)', paddingBottom: '6px', marginBottom: '6px', minHeight: '30px' }}>
                {sig.signed ? sig.name : ''}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                {sig.name === 'Parent' ? 'Parent' : 'Child'}
              </div>
            </div>
          ))}
        </div>

        {agreement.review_date && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.04em', marginTop: '26px', textAlign: 'center' }}>
            We will sit down and review this together on {formatDate(agreement.review_date)}
          </p>
        )}
        <PrintBrandFooter />
      </div>
    </div>
  )
}
