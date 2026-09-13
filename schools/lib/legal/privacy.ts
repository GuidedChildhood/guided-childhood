import { COMPANY } from '@gc/shared/legal'
import { section, LEGAL_VERSION, LEGAL_DATED, type LegalDoc } from './types'

// THE PRIVACY NOTICE FOR SCHOOLS, version 1.0, 13 September 2026.
//
// Written from what the schools app actually does (13 September 2026): two
// tables, one signed cookie, no pupil data, no accounts, no trackers, no
// model calls, and four providers. Section 2 is the data map; if the code
// starts collecting something new, this file is the second place it has to
// change, and scripts/check-schools-legal.mjs holds the provider list here
// and in the DPA to the same four names.

export const PRIVACY: LegalDoc = {
  slug: 'privacy',
  eyebrow: 'Privacy notice for schools',
  title: `How we handle your school's information`,
  description: `What Guided Childhood Schools collects about a school's staff, why, who sees it, how long we keep it and your rights. No pupil data, ever.`,
  version: LEGAL_VERSION,
  dated: LEGAL_DATED,
  plain: [
    `We hold no data about pupils. None. The only personal data we keep is what a member of your staff gives us to reply, raise an invoice or send a school code: a name, a role, a work email, a purchase order number and anything typed in the notes box.`,
    `We never sell it, never advertise with it, never track you across the web and never use it to train an AI model. Questions go to ${COMPANY.email} and get a person.`,
  ],
  sections: [
    section(1, 'who', 'Who we are, and who this notice is for', [
      `${COMPANY.name}, company number ${COMPANY.number}, registered office ${COMPANY.address}, is the data controller for the personal data described in this notice. We are not required to appoint a Data Protection Officer. Our privacy lead is Justin Phillips, the founder, at ${COMPANY.email}.`,
      `This notice is for the staff of schools, trusts and colleges that enquire about, pilot or license Guided Childhood Schools, and for anyone who visits schools.guidedchildhood.com. It is not about pupils, because we hold no pupil data, and it is not about families, who use the separate Guided Childhood app under its own privacy policy at guidedchildhood.com/privacy.`,
    ]),
    section(2, 'what', 'What we collect, why, and on what basis', [
      `When you ask for an invoice, a pilot, the sample lesson pack or a place in the class pack draw, we keep what the form asks for: your school's name, your name, your role, your work email address, a purchase order number if you gave one, the pupil count band, and anything you typed in the notes box. We use it to reply to you, to raise the invoice, to send your school code and to run the draw. Our basis is the steps needed to enter and perform a contract with the School and, for a lead or a draw entry, our legitimate interest in answering a school that has asked us something.`,
      `When a school code is entered, we set one cookie, gc_schools_access. It holds the code and an expiry date, signed so that it cannot be forged, and it lasts 180 days. It holds no name and no email address. It is strictly necessary for the Service to work, so no consent banner is needed under the Privacy and Electronic Communications Regulations.`,
      `We send a confirmation email to the address you gave, and a copy of each request to the founder, so that nothing waits. Our basis is the same as in 2.1.`,
      `Our hosting provider keeps short lived technical logs of requests to the site, which include an IP address, the time and the page requested. They exist to keep the Service secure and running. We do not use them to identify anyone, and our basis is our legitimate interest in running a secure service.`,
      `Some things live only in your browser and never reach us: the AI governance reviews your school writes, which may name a member of staff, and the record of which passport pages a classroom screen has filled. They are stored on that device, they can be exported as a file or printed, and clearing the browser clears them.`,
      `The classroom player sends us nothing. There is no record of which teacher taught which lesson, which class saw it, or how any pupil answered.`,
    ]),
    section(3, 'never', 'What we never do', [
      `We do not collect any personal data about pupils. There are no pupil accounts, logins, names, photographs or profiles anywhere in the Service.`,
      `We do not sell personal data, use it for advertising, profile anyone, use analytics or tracking cookies, or use any personal data to train an AI model.`,
      `We do not track whether you open our emails or which links you follow.`,
    ]),
    section(4, 'share', 'Who we share it with', [
      {
        text: `We use a small number of providers who process data on our instructions to run the Service. They see only what the job needs:`,
        bullets: [
          `Supabase, which hosts our database in Ireland, where the requests in 2.1 are stored.`,
          `Vercel, which hosts the website and sends the pages to your browser.`,
          `Resend, which sends our emails.`,
          `Stripe, in which we raise your invoice, so it holds the School's billing contact and the invoice itself.`,
        ],
      },
      `We do not share personal data with anyone else, except where the law requires it.`,
      `Some of these providers are based in, or may process data in, the United States. Where personal data leaves the United Kingdom we rely on the safeguards UK law provides, including the UK International Data Transfer Addendum to the EU standard contractual clauses and, for Ireland, the UK's adequacy decision for the European Economic Area.`,
    ]),
    section(5, 'keep', 'How long we keep it', [
      `A request that does not lead to a licence, whether a lead, a sample lesson pack or a draw entry, is deleted twelve months after our last contact with you.`,
      `A licensed School's contact details are kept for the life of its licence and for six years after the last invoice, because tax law requires us to keep accounting records for that long. We keep only what that requires.`,
      `The cookie expires after 180 days, or sooner if the code is withdrawn. Technical logs are kept briefly by our hosting provider and then deleted.`,
    ]),
    section(6, 'rights', 'Your rights', [
      `Under UK GDPR you can ask to see the personal data we hold about you, have it corrected or deleted, restrict or object to how we use it, or receive a copy to take elsewhere. Email ${COMPANY.email} and a person will reply within two working days. We do not charge for this.`,
      `You also have the right to complain to the Information Commissioner's Office at ico.org.uk or on 0303 123 1113. We would welcome the chance to put things right first.`,
    ]),
    section(7, 'security', 'How we keep it safe', [
      `Everything travels over HTTPS. The school code cookie is signed with a keyed hash and checked against the current list of codes on every request, so a withdrawn code stops at once. The database sits behind row level security, and the keys that can read the request table are held only on the server. Access within ${COMPANY.name} is limited to the founder. Above all, we keep the least data possible, so there is very little to protect.`,
    ]),
    section(8, 'children', 'Children', [
      `The Service is used by adults teaching children. Pupils never operate it, never sign in and never give us data. The home code a teacher sends home identifies a lesson, not a pupil or a school, and what a family does with it in the Guided Childhood app is covered by that app's privacy policy, under the parent's own account.`,
    ]),
    section(9, 'changes', 'Changes to this notice', [
      `The version and date at the top tell you which notice applies. If we change anything significant we will email every licensed School.`,
    ]),
  ],
  related: [
    { href: '/terms', label: 'The terms for schools' },
    { href: '/dpa', label: 'Data processing agreement' },
    { href: '/hub/data-protection', label: 'Data protection pack' },
  ],
}
