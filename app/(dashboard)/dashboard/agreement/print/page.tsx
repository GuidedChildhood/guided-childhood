import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/agreement/PrintButton'
import PrintFit from '@/components/agreement/PrintFit'
import { PrintBrandHeader, PrintBrandFooter } from '@gc/shared/components/PrintBrand'
import { getChildren } from '@/lib/children/server'

export const dynamic = 'force-dynamic'

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function AgreementPrintPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // The printed name follows ?child= like the agreement page it comes from.
  const [{ data: agreement }, { child }] = await Promise.all([
    supabase.from('family_agreements').select('*').eq('user_id', user.id).maybeSingle(),
    getChildren<{ id: string; name: string | null; is_primary: boolean | null }>(supabase, user.id, childParam, 'id, name'),
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
    <div className="ag-page">
      {/*
        ONE PAGE, ALWAYS. This is the fridge copy, and a fridge copy that runs
        to two sheets is a signature page stuck up on its own.

        The screen sizes and the print sizes are the same handful of tokens
        wearing different values, so the layout below is written once. Screen
        keeps the comfortable reading size it has today; print drops to a set
        cut for A4 and takes the paper's own margin as the padding.

        The two token blocks are deliberately identical: ag-measure is what
        PrintFit puts on the sheet to lay it out as the printer will and
        measure it. If you change one, change both.
      */}
      <style>{`
        .ag-page { max-width: 680px; margin: 0 auto; padding: 32px 20px 48px; }

        .ag-sheet {
          --ag-pad: clamp(28px, 5vw, 44px);
          --ag-gap: 22px;
          --ag-title: clamp(1.6rem, 4vw, 2.1rem);
          --ag-lead: 30px;
          --ag-sign: 36px;

          background: #fff;
          border: 2px solid var(--ink);
          border-radius: 20px;
          padding: var(--ag-pad);
        }

        .ag-head { text-align: center; margin-bottom: var(--ag-lead); }
        .ag-eyebrow {
          font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase; color: var(--terracotta);
          margin-bottom: 10px;
        }
        .ag-title { font-size: var(--ag-title); line-height: 1.1; margin: 0 0 8px; }
        .ag-date {
          font-family: var(--font-mono); font-size: var(--text-xs);
          color: var(--ink-muted); letter-spacing: 0.04em; margin: 0;
        }

        .ag-section { margin-bottom: var(--ag-gap); break-inside: avoid; }
        .ag-section-title {
          font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--terracotta);
          margin-bottom: 6px;
        }
        .ag-section-body {
          font-size: var(--text-md); color: var(--ink); line-height: 1.7; margin: 0;
          overflow-wrap: break-word;
        }

        .ag-signatures {
          display: flex; gap: 24px; flex-wrap: wrap; break-inside: avoid;
          margin-top: var(--ag-sign); padding-top: 24px; border-top: 1.5px solid var(--border);
        }
        .ag-sig { flex: 1; min-width: 180px; }
        .ag-sig-line {
          font-family: var(--font-display); font-weight: 800; font-size: var(--text-lg);
          color: var(--ink); border-bottom: 2px solid var(--ink);
          padding-bottom: 6px; margin-bottom: 6px; min-height: 30px;
        }
        .ag-sig-role {
          font-family: var(--font-mono); font-size: var(--text-xs);
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted);
        }

        .ag-review {
          font-family: var(--font-mono); font-size: var(--text-xs); color: var(--ink-muted);
          letter-spacing: 0.04em; margin: 26px 0 0; text-align: center; break-inside: avoid;
        }

        /* The floor, and what prints if the fit script never runs: the A4
           cut at its base size, which fits one page for any realistic
           agreement. The scaled block after it grows that to fill the sheet. */
        @media print {
          @page { size: A4 portrait; margin: 8mm; }

          header, .bottom-tab-bar, .no-print { display: none !important; }
          main { padding: 0 !important; }
          html, body { background: #fff !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

          .ag-page { max-width: none; margin: 0; padding: 0; }

          .ag-sheet {
            --ag-pad: 0;
            --ag-gap: 11px;
            --ag-title: 20pt;
            --ag-lead: 16px;
            --ag-sign: 20px;

            --text-xs: 6.5pt;
            --text-sm: 8pt;
            --text-base: 9.5pt;
            --text-md: 10.5pt;
            --text-lg: 12pt;
            --text-xl: 14pt;

            border: none;
            border-radius: 0;
          }
          .ag-sheet .ag-section-body { line-height: 1.5; }
          .ag-sheet .ag-signatures { gap: 18px; padding-top: 16px; }
          .ag-sheet .ag-sig-line { min-height: 24px; padding-bottom: 4px; }
          .ag-sheet .ag-review { margin-top: 16px; }
        }
        /* ── The A4 cut, filled ─────────────────────────────────────
           Every size here is a multiple of --ag-k, the scale PrintFit settles
           on, so the sheet grows to fill the paper or shrinks to stay on it
           without any of these numbers being touched again.

           Two classes, one block. PrintFit puts .ag-measure on the sheet to
           lay it out as the printer will and measure it, and .ag-print on it
           for the print itself, so what was measured is exactly what prints.

           This sits AFTER the @media print block below on purpose. That block
           is the same cut at k of 1 and is the floor if this script never
           runs: the agreement still prints at A4 sizes on one page for any
           realistic length, it just does not grow to fill the sheet. These
           rules then win over it, on equal specificity, by source order. */
        .ag-measure, .ag-print {
          --ag-k: 1;
          --ag-pad: 0;
          --ag-gap: calc(11px * var(--ag-k));
          --ag-title: calc(20pt * var(--ag-k));
          --ag-lead: calc(16px * var(--ag-k));
          --ag-sign: calc(20px * var(--ag-k));

          --text-xs: calc(6.5pt * var(--ag-k));
          --text-sm: calc(8pt * var(--ag-k));
          --text-base: calc(9.5pt * var(--ag-k));
          --text-md: calc(10.5pt * var(--ag-k));
          --text-lg: calc(12pt * var(--ag-k));
          --text-xl: calc(14pt * var(--ag-k));

          border: none;
          border-radius: 0;
          width: 100%;
        }
        .ag-measure .ag-section-body,
        .ag-print .ag-section-body { line-height: 1.5; }
        .ag-measure .ag-section-title,
        .ag-print .ag-section-title { margin-bottom: calc(4px * var(--ag-k)); }
        .ag-measure .ag-eyebrow,
        .ag-print .ag-eyebrow { margin-bottom: calc(7px * var(--ag-k)); }
        .ag-measure .ag-title,
        .ag-print .ag-title { margin-bottom: calc(6px * var(--ag-k)); }
        .ag-measure .ag-signatures,
        .ag-print .ag-signatures {
          gap: calc(18px * var(--ag-k));
          padding-top: calc(16px * var(--ag-k));
        }
        .ag-measure .ag-sig-line,
        .ag-print .ag-sig-line {
          min-height: calc(24px * var(--ag-k));
          padding-bottom: calc(4px * var(--ag-k));
          margin-bottom: calc(4px * var(--ag-k));
        }
        .ag-measure .ag-review,
        .ag-print .ag-review { margin-top: calc(16px * var(--ag-k)); }

      `}</style>

      {/* Screen chrome */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/dashboard/agreement" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '0.04em' }}>
          ← Back to the builder
        </Link>
        <PrintButton />
      </div>

      {/* The document */}
      <div className="ag-sheet">
        <PrintBrandHeader />
        <div className="ag-head">
          <div className="ag-eyebrow">
            Family agreement{agreement.version > 1 ? ` · Version ${agreement.version}` : ''}
          </div>
          <h1 className="ag-title">Our family agreement</h1>
          {agreement.agreed_date && (
            <p className="ag-date">Agreed together on {formatDate(agreement.agreed_date)}</p>
          )}
        </div>

        {sections.map((section, i) => (
          <div key={i} className="ag-section">
            <div className="ag-section-title">{section.title}</div>
            <p className="ag-section-body">{section.body}</p>
          </div>
        ))}

        {/* Signatures */}
        <div className="ag-signatures">
          {[
            { name: 'Parent', signed: agreement.signed_by_parent },
            { name: childName, signed: agreement.signed_by_child },
          ].map((sig, i) => (
            <div key={i} className="ag-sig">
              <div className="ag-sig-line">{sig.signed ? sig.name : ''}</div>
              <div className="ag-sig-role">{sig.name === 'Parent' ? 'Parent' : 'Child'}</div>
            </div>
          ))}
        </div>

        {agreement.review_date && (
          <p className="ag-review">
            We will sit down and review this together on {formatDate(agreement.review_date)}
          </p>
        )}
        <PrintBrandFooter />
      </div>

      <PrintFit target=".ag-sheet" />
    </div>
  )
}
