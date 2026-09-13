import { COMPANY } from '@gc/shared/legal'
import { PILOT_PLACES, PILOT_TERM_WEEKS } from '@/lib/pilot'
import { section, LEGAL_VERSION, LEGAL_DATED, type LegalDoc } from './types'

// THE TERMS FOR SCHOOLS, version 1.0, 13 September 2026.
//
// Decision 3 of the six Justin agreed on 13 September 2026: drafted now, from
// what the product actually does, for a solicitor's pass. Every fact about
// the company reads from shared/legal.ts and every pilot number from
// lib/pilot.ts, so the terms cannot say one thing and the invoice another.
// A change from the solicitor becomes version 1.1 and a line in decisions.md.

const SITE = 'schools.guidedchildhood.com'

export const TERMS: LegalDoc = {
  slug: 'terms',
  eyebrow: 'Schools licence terms',
  title: 'The terms for schools',
  description: 'The terms between a school and Guided Digital Childhood Ltd for a pilot or a licence of Guided Childhood Schools: one code, every teacher, a year, one invoice, no pupil data.',
  version: LEGAL_VERSION,
  dated: LEGAL_DATED,
  plain: [
    `These are the terms between your school and ${COMPANY.name} when you take a free pilot or buy a licence for Guided Childhood Schools. They are written to be read in one sitting.`,
    `In short: one code opens the whole scheme for every teacher in your school for a year. You pay one invoice with 30 day terms and no VAT. We hold no pupil data. And if it is not right for your school in the first 30 days, tell us and we cancel the invoice.`,
  ],
  sections: [
    section(1, 'who', 'Who we are, and who these terms are for', [
      `We are ${COMPANY.name}, company number ${COMPANY.number}, registered in ${COMPANY.jurisdiction} at ${COMPANY.address} ("we", "us"). We run Guided Childhood Schools at ${SITE} (the "Service").`,
      `These terms apply to the school, academy, trust or college named on a pilot request or an invoice (the "School", "you"). The person who requests a pilot or an invoice confirms that they are authorised to accept these terms for the School.`,
      `The agreement between us is these terms, the pilot email or the invoice, and the pricing page as it read on the day you ordered. If your purchase order carries its own terms, these terms apply unless we have agreed otherwise in writing.`,
      `The agreement starts on the day we send your school code and lasts as set out in section 4.`,
    ]),
    section(2, 'licence', 'What the licence opens', [
      `A licence gives the School one code that opens the whole Service for every member of its staff: every module in the scheme, the classroom player with the word for word teacher script, every printable pack, the Hub, the staff briefings, the parent notes, and every update we publish during the licence.`,
      `A licence covers one school. A trust or federation takes one licence per school unless its invoice says otherwise.`,
      `There is no seat counting. Any member of the School's staff may use the code, on any device, in any classroom of the School.`,
    ]),
    section(3, 'use', 'What you may do, and what you may not', [
      `You may display the lessons in class, print and photocopy the materials for pupils on the School's roll and for its staff, send the parent notes and the home code home with pupils, and adapt the printables for pupils with additional needs.`,
      `You may not share the code with anyone outside the School's staff, publish or host the materials anywhere else, sell, lend or give them to another school or organisation, remove our name or notices from them, or use them to train or build an AI model or a competing product.`,
      `If the code leaks, tell us and we will issue a new one. We may also replace the code at any time for security, and we will send the new one to your contact before the old one stops.`,
      `A member of staff who leaves the School should not carry the code with them. The code belongs to the School.`,
    ]),
    section(4, 'term', 'How long it lasts, and renewing', [
      `A licence runs for twelve months from the start date on your invoice. A pilot runs for one school term of ${PILOT_TERM_WEEKS} weeks from the day we send the code.`,
      `Nothing renews on its own. Before a licence ends we write to your contact with the renewal price, and the licence continues only if you ask us to invoice again. A renewed School keeps its code.`,
      `When a licence or a pilot ends without renewal, the code stops opening the Service. Printed materials already made for pupils on the School's roll may be used up. No new copies may be made.`,
    ]),
    section(5, 'price', 'Price, invoice and payment', [
      `The price is the one on the pricing page for your band on the day you order, and it is fixed for the twelve months of the licence.`,
      `We invoice against your purchase order and the invoice is payable within 30 days. We are not VAT registered, so no VAT is added. If that changes, we will tell you before any invoice that is affected.`,
      `If an invoice is more than 30 days overdue we will remind you, and we may pause the code until it is paid. We may also charge statutory interest under the Late Payment of Commercial Debts (Interest) Act 1998.`,
      `If, in the first 30 days of a licence, the scheme is not right for your School, tell us and we will cancel the invoice, or refund it in full if it has been paid, and the code will stop. After that the licence fee is not refundable except where these terms or the law say otherwise.`,
    ]),
    section(6, 'pilot', 'The free pilot', [
      `We offer a free one term pilot to the first ${PILOT_PLACES} schools that ask, one code per school. A pilot carries no charge, no purchase order and no obligation to buy.`,
      `The pilot opens everything a licence opens. When the term ends the code stops unless the School takes a licence, and nothing needs cancelling or returning, because we hold no pupil data and no School data other than your contact details.`,
      `We may end a pilot early if the code is shared outside the School or the materials are used outside section 3.`,
    ]),
    section(7, 'service', 'What the Service is, and what it is not', [
      `The Service is a scheme of teaching materials and supporting documents for relationships, sex and health education, PSHE, computing and personal development. It is written by us with care and from cited evidence, and we keep it up to date as the law and the platforms children use change.`,
      `It is not legal advice. The policy text, the statutory mapping, the data protection pack, the AI governance framework and the safeguarding notes are templates and support for the School's own professional judgement. The School remains responsible for its own policies, its own data protection impact assessments and its own compliance.`,
      `Safeguarding stays with the School. The Service records no disclosures and holds no pupil data. Where a module is flagged as sensitive, the staff briefing tells the teacher what to know first, and the School decides who teaches it and how.`,
      `As with any published scheme, a teacher should read a lesson before teaching it. We may update, replace or retire content during a licence. Where we retire something a School relies on, we say so, and the printed version stays available for the rest of the licence.`,
    ]),
    section(8, 'availability', 'Availability and support', [
      `We aim to keep the Service available at all times and we plan maintenance outside school hours where we can. We do not promise that it will be uninterrupted or free of faults.`,
      `Every lesson has a printable pack, so a lesson can still be taught if the site is unavailable.`,
      `Support is by email to ${COMPANY.email}. We reply within two working days, usually the same day.`,
    ]),
    section(9, 'ownership', 'Ownership', [
      `The Service and everything in it, including the lessons, scripts, printables, characters, illustrations and documents, belongs to us or to those who license it to us, and stays ours. The licence gives the School a right to use it under these terms, not ownership.`,
      `Anything the School creates in the course of using the Service, such as its own policies built from our templates, its AI governance reviews and its filled learning records, belongs to the School.`,
    ]),
    section(10, 'data', 'Personal data', [
      `The Service holds no pupil data by design. The only personal data we hold about the School is the contact data your staff give us to run a pilot or a licence. Our privacy notice for schools says what we collect and why, and our data processing agreement is ready to print and sign at ${SITE}/dpa.`,
      `Each of us complies with UK data protection law for the personal data we hold.`,
    ]),
    section(11, 'liability', 'Our responsibility to you', [
      `Nothing in these terms excludes or limits our liability for death or personal injury caused by our negligence, for fraud, or for anything that cannot be excluded or limited by law.`,
      `Subject to 11.1, we are not liable for any indirect or consequential loss, for loss of profit, revenue or goodwill, or for any loss arising from use of the materials outside these terms.`,
      `Subject to 11.1, our total liability to the School under or in connection with the agreement, in any twelve month period, is limited to the fees paid by the School for that period, or £500 where no fee has been paid.`,
    ]),
    section(12, 'ending', 'Ending the agreement', [
      `Either of us may end the agreement by writing to the other if the other breaks these terms in a material way and does not put it right within 30 days of being asked.`,
      `We may end a licence or a pilot immediately if the code is shared outside the School and the School does not stop when asked.`,
      `When the agreement ends, clause 4.3 applies, and any part of these terms that by its nature should continue, such as sections 9 and 11, continues.`,
    ]),
    section(13, 'changes', 'Changes to these terms', [
      `We may update these terms from time to time. The version and date at the top tell you which one applies. A change applies to a School from its next renewal, not in the middle of a paid licence, unless the law requires it sooner. We will email licensed Schools about any significant change.`,
    ]),
    section(14, 'general', 'General', [
      `Notices between us are by email: to the School at the contact address on its request or invoice, and to us at ${COMPANY.email}.`,
      `Neither of us may transfer the agreement without the other's written agreement, except that we may transfer it to a company that takes over our business, and we will tell you if we do.`,
      `If any part of these terms is found to be invalid, the rest continues.`,
      `These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.`,
    ]),
  ],
  related: [
    { href: '/privacy', label: 'Privacy notice for schools' },
    { href: '/dpa', label: 'Data processing agreement' },
    { href: '/hub/data-protection', label: 'Data protection pack' },
    { href: '/pricing', label: 'Pricing' },
  ],
}
