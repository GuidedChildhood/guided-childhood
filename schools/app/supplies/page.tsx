import type { Metadata } from 'next'
import Link from 'next/link'
import { EDITIONS } from '@/lib/passport-print'
import SupplyForm from './SupplyForm'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'

// PRINTED PASSPORT BOOKS AND STICKER SHEETS, BY QUOTE.
//
// Justin, 16 September 2026, approving plans/2026-09-16-per-child-passport-
// plan.md: "yes build and quote form."
//
// A QUOTE AND NOT A SHOP, deliberately. There is no supplier, no stock and
// no landed cost yet, and a price on a school page is a promise finance will
// hold us to. A quote form with a real reply in a day is a better first
// version than a shop that cannot ship.
//
// THE FREE VERSION IS NAMED FIRST on this page, which looks like selling
// against ourselves and is not: a school that has folded the paper passport
// knows exactly what the printed one is worth. The paper one also means no
// school is ever blocked on us having stock.
//
// Nothing here touches a pupil. No class list, no child name, no home
// address. The box goes to the school office and the books arrive blank for
// the children to write their own names, which is the same reason the paper
// passport carries a rule on panel one rather than a printed name.

export const metadata: Metadata = {
  title: 'Passport books and stickers for your classes',
  description: 'Printed Guided Childhood passport books and sticker sheets for a class or a whole school. Ask for a quote: no card, no minimum order, no pupil data.',
  alternates: { canonical: 'https://schools.guidedchildhood.com/supplies' },
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.7,
}

export default function SuppliesPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'start' }}>
        <div>
          <p style={{ ...eyebrow, marginBottom: '12px' }}>Books and stickers</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.hero, color: 'var(--ink)', marginBottom: 'var(--space-4)', textWrap: 'balance' }}>
            The printed passport, one per child
          </h1>
          <p style={{ ...body, marginBottom: '18px' }}>
            A proper bound booklet with the five pages already printed, and a sheet of stickers to fill them.
            The same passport the children fold from paper in class, made to last the years it records.
          </p>
          <p style={{ ...body, marginBottom: '22px' }}>
            Tell us roughly what you need and we reply within two working days with a price, a lead time and
            the postage. Nothing is ordered and nothing is charged until you say yes.
          </p>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '20px 22px', marginBottom: '18px' }}>
            <p style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '10px' }}>What is in a book</p>
            <ul style={{ ...body, margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {EDITIONS.map(e => (
                <li key={e.stage}><strong style={{ color: 'var(--ink)' }}>{e.years}:</strong> {e.strap.toLowerCase()}</li>
              ))}
              <li>Four areas on every page, a ring per lesson, and the Planet Friend&rsquo;s stamp when the page is full.</li>
            </ul>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '20px 22px' }}>
            <p style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '10px' }}>Free, today, no waiting</p>
            <p style={{ ...body, marginBottom: '12px' }}>
              Every passport prints from your own printer on one sheet of A4. One slit, three folds, and a
              child has a passport the size of a real one. Print one per child and nothing here blocks a lesson.
            </p>
            <Link href="/print/passport" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Print the paper passport ›
            </Link>
          </div>
        </div>

        <div>
          <SupplyForm />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, marginTop: '16px' }}>
            We hold no pupil data, so we never ask for a class list and the books arrive blank. Every child
            writes their own name on the front, which is the nicest part anyway.
          </p>
        </div>
      </div>
    </main>
  )
}
