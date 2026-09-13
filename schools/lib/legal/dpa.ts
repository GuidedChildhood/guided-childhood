import { COMPANY } from '@gc/shared/legal'
import { section, LEGAL_VERSION, LEGAL_DATED, type LegalDoc } from './types'

// THE DATA PROCESSING AGREEMENT, version 1.0, 13 September 2026.
//
// The data protection pack promised "a short data processing agreement
// covering that contact data, available for signature with the licence"
// since 10 September, and until today there was nothing to sign. This is it.
//
// Its shape follows the facts rather than the usual template. The Service
// holds no pupil data, and the contact data a school gives us is our own
// customer record, so for that data we are an independent controller and a
// processor agreement would be pretending. The Article 28 terms are still
// here, in section 5, and they apply automatically the day a feature stores
// anything on a school's behalf (the staffroom), so no school has to sign
// twice. A solicitor's pass may reshape this; the facts will not change.

export const DPA: LegalDoc = {
  slug: 'dpa',
  eyebrow: 'Data processing agreement',
  title: 'Data processing agreement',
  description: `The short agreement a school's DPO can file: what personal data passes between the school and ${COMPANY.name}, in what role, on what terms, with Article 28 clauses held in reserve. Pupil data: none.`,
  version: LEGAL_VERSION,
  dated: LEGAL_DATED,
  plain: [
    `This is the short agreement our data protection pack promises. It exists because your procurement or DPO file needs it, and it is short because the Service holds no pupil data and almost no data about your school.`,
    `Print it, sign it, and email it to ${COMPANY.email}. We sign and return it within two working days.`,
  ],
  sections: [
    section(1, 'parties', 'The parties and the purpose', [
      `This agreement is between the school, academy, trust or college named in the signature block (the "School") and ${COMPANY.name}, company number ${COMPANY.number}, of ${COMPANY.address} ("Guided Childhood"). It forms part of the agreement made under the schools licence terms.`,
      `Its purpose is to set out what personal data passes between the parties when the School pilots or licenses Guided Childhood Schools, in what role each party handles it, and the terms that apply, including the terms that Article 28 of the UK GDPR requires wherever Guided Childhood processes personal data on the School's behalf.`,
      `"UK GDPR", "Data Protection Act 2018", "controller", "processor", "personal data", "processing" and "personal data breach" have the meanings given in UK data protection law.`,
    ]),
    section(2, 'data', 'What personal data is involved', [
      `Pupils: none. The Service holds no personal data about pupils. It has no pupil accounts, names, photographs, dates of birth, contact details, free text about pupils, special category data, or record of which pupil saw which lesson. Where a pupil's name appears in the teaching, it is handwritten on paper that stays in the School.`,
      `Staff: the contact data a member of the School's staff gives Guided Childhood to run a pilot or a licence, set out in Annex 1.`,
      `Records held only on the School's own devices, such as the AI governance reviews the School writes, are never sent to Guided Childhood and are outside this agreement.`,
    ]),
    section(3, 'roles', 'The roles', [
      `For the contact data in Annex 1, Guided Childhood is an independent controller. It decides why and how that data is used, for the purposes in Annex 1 and no other, and it is responsible to the individuals concerned and to the Information Commissioner for that use. The School is a controller of its own staff data. Each party complies with UK data protection law for its own processing.`,
      `If, now or in future, the School asks Guided Childhood to process personal data on the School's behalf and on its instructions, for example if a feature is introduced that stores staff accounts, class records or pupil data at the School's request, Guided Childhood is a processor for that data and section 5 applies to it automatically, without a new agreement, unless the parties agree otherwise in writing.`,
    ]),
    section(4, 'always', 'Commitments that apply in every case', [
      `Guided Childhood will use the personal data in Annex 1 only for the purposes there, and will never sell it, use it for advertising or profiling, or use it to train an AI model.`,
      `Guided Childhood will apply the security measures in Annex 2 and will limit access to people who need it to run the Service, all of whom are bound by confidentiality.`,
      `Guided Childhood will tell the School's named contact about any personal data breach affecting the School's data without undue delay, and in any case within 48 hours of becoming aware of it, with what is known and what is being done.`,
      `Guided Childhood will help the School respond to a request from an individual about their personal data, and will pass on within two working days any such request it receives that concerns the School's staff.`,
      `Guided Childhood will delete the personal data in Annex 1 at the end of the retention periods there, or sooner on the School's written request, except for what tax law requires it to keep.`,
      `Guided Childhood will give the School the information it reasonably needs for its own data protection impact assessment, starting with the data protection pack at schools.guidedchildhood.com/hub/data-protection.`,
    ]),
    section(5, 'article28', `Terms for any processing on the School's behalf`, [
      `process the personal data only on the School's documented instructions, including for any transfer outside the United Kingdom, unless required by law to do otherwise, in which case it will tell the School first unless the law prevents it;`,
      `ensure that everyone authorised to process the data is bound by confidentiality;`,
      `take the technical and organisational measures in Annex 2, and any further measures the nature of the data requires;`,
      `engage a further processor only from the list in Annex 3 or with the School's prior written consent, give at least 30 days' notice of any intended change to that list so that the School can object, and impose on each of them the same obligations as this section;`,
      `help the School, by appropriate measures, to respond to requests from individuals exercising their rights;`,
      `help the School meet its obligations on security, breach notification, data protection impact assessments and prior consultation with the Information Commissioner, taking into account the nature of the processing and the information available;`,
      `at the School's choice, delete or return all the personal data at the end of the processing, and delete existing copies unless the law requires storage;`,
      `make available all information necessary to demonstrate compliance with this section, and allow for and contribute to audits and inspections by the School or an auditor it mandates, on at least 30 days' notice, no more than once in any twelve months unless a breach has occurred, during working hours and at the School's cost;`,
      `tell the School immediately if, in its opinion, an instruction infringes UK data protection law;`,
      `transfer personal data outside the United Kingdom only with safeguards recognised by UK law, such as an adequacy regulation or the UK International Data Transfer Addendum.`,
    ], `Where clause 3.2 applies, and for as long as it applies, Guided Childhood will, in accordance with Article 28 of the UK GDPR:`),
    section(6, 'term', 'Term, liability and law', [
      `This agreement starts when the School's pilot or licence starts and continues for as long as Guided Childhood holds any personal data covered by it.`,
      `Each party's liability under this agreement is subject to the limits in the schools licence terms, save that nothing limits either party's liability to the extent that UK data protection law does not allow it to be limited.`,
      `This agreement is governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.`,
    ]),
  ],
  annexes: [
    {
      id: 'annex1',
      title: 'The personal data',
      rows: [
        { label: 'Whose', text: `Members of the School's staff who contact Guided Childhood: the person requesting a pilot, an invoice, the sample lesson pack or a draw entry, and the contact named for the licence.` },
        { label: 'What', text: `School name, contact name, role, work email address, purchase order number, pupil count band, and anything typed in the notes box of a request form.` },
        { label: 'Why', text: `To reply, to raise and send the invoice, to send and replace the school code, to send confirmation and renewal emails, to run the class pack draw, and to keep the accounting records the law requires.` },
        { label: 'Basis', text: `Guided Childhood as controller: the steps needed to enter and perform the contract with the School, and its legitimate interest in answering leads and running the draw.` },
        { label: 'Where', text: `Stored in a database hosted by Supabase in Ireland. The invoice and billing contact in Stripe. Emails sent through Resend. Pages served by Vercel.` },
        { label: 'How long', text: `Twelve months after the last contact where no licence follows. For a licensed School, the life of the licence and six years after the last invoice, for accounting records.` },
        { label: 'Pupil data', text: `None.` },
      ],
    },
    {
      id: 'annex2',
      title: 'The security measures',
      rows: [
        { label: 'Least data', text: `No pupil data, no teacher accounts and no session data, by design. The school code is a signed cookie, not an identity, and the classroom player sends nothing to the server.` },
        { label: 'In transit', text: `Every page and every request travels over HTTPS.` },
        { label: 'At rest', text: `The request table can be read only with server side keys that never reach a browser. Row level security lets the public site insert a request and nothing else. Backups are managed by the database provider within the same region.` },
        { label: 'The code', text: `The school code cookie is signed with a keyed hash and checked against the current allow list on every request, so a withdrawn code stops at once. Codes are configuration on the server, never in the page.` },
        { label: 'People', text: `Access within ${COMPANY.name} is limited to the founder. Secrets are held in the hosting provider's encrypted configuration.` },
        { label: 'Providers', text: `Each provider in Annex 3 publishes its own security and compliance documentation, which we review before using it and on request will share with the School.` },
        { label: 'Breaches', text: `As clause 4.3: the School's named contact told without undue delay and within 48 hours, with what is known and what is being done.` },
      ],
    },
    {
      id: 'annex3',
      title: 'The sub processors',
      intro: `The providers Guided Childhood uses to run the Service, what each does, and where it is based.`,
      rows: [
        { label: 'Supabase', text: `Database hosting. A United States company. Our data is stored in its Ireland region.` },
        { label: 'Vercel', text: `Website hosting and delivery. United States, with a global delivery network.` },
        { label: 'Resend', text: `Sending our emails. United States.` },
        { label: 'Stripe', text: `Raising invoices and holding billing records. United Kingdom and United States.` },
      ],
    },
  ],
  signatures: {
    left: {
      heading: 'Signed for the School',
      lines: [{ label: 'School' }, { label: 'Name' }, { label: 'Role' }, { label: 'Signature' }, { label: 'Date' }],
    },
    right: {
      heading: `Signed for ${COMPANY.name}`,
      lines: [{ label: 'Name', value: 'Justin Phillips' }, { label: 'Role', value: 'Founder' }, { label: 'Signature' }, { label: 'Date' }],
    },
    note: `Print this page, sign it, and email it to ${COMPANY.email}. We sign and return it within two working days. A scanned copy is fine.`,
  },
  related: [
    { href: '/hub/data-protection', label: 'Data protection pack' },
    { href: '/privacy', label: 'Privacy notice for schools' },
    { href: '/terms', label: 'The terms for schools' },
  ],
}
