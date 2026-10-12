import { LEGAL_LINE } from '@gc/shared/legal'
import { CHARACTERS, CURRICULUM } from '@gc/shared/schools-curriculum'
import { APP_ORIGIN } from '@/lib/config/site'

// THE SCHOOL'S OWN CONFIRMATION, one per kind of row in the schools letterbox.
//
// Until 13 September 2026 the letterbox told Justin and told the school
// nothing. A head who had just requested an invoice, a teacher who asked for
// the taster pack and a school asking for a pilot all saw "request received"
// on screen and then silence until a reply arrived by hand. These are that
// reply's first half, sent by the cron the moment it sees the row, in
// Justin's voice, with what happens next and when.
//
// Transactional on purpose: the school is waiting for it, so the one a week
// programme floor does not apply and nothing suppresses it.

const SITE = 'https://schools.guidedchildhood.com'

export type LetterboxRow = {
  school_name: string
  band: string
  contact_name: string
  email: string
  po_number: string
  notes: string | null
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const firstName = (name: string) => name.trim().split(/\s+/)[0] || 'there'

// The taster row carries its module id at the end of the notes line
// ("Sample lesson taster · Head of PSHE · ks3-12-misinfo-deepfakes").
const moduleFromNotes = (notes: string | null) => {
  const last = (notes ?? '').split('·').map(s => s.trim()).pop() ?? ''
  return /^(eyfs|ks\d)-\d\d-/.test(last) ? last : null
}

// THE CAST IN THE LETTERS (8 October 2026). Justin: the characters in the
// relevant automated emails, and on the school side too. The rule is the one
// lib/email/friends.ts sets for parents: a character marks the lessons, never
// money. So the pilot letter carries DiGi, who closes every lesson; the taster
// letter carries the friend who teaches the lesson they asked for; the invoice
// letter carries nobody. The images are the email sized copies on the parent
// app's origin, 192 square and displayed at 72, with alt text that reads as a
// caption for the readers whose client blocks images on a first open.
type Mark = { key: string; name: string; line: string }

const markFor = (moduleId: string | null): Mark => {
  const m = CURRICULUM.find(c => c.moduleId === (moduleId ?? 'ks3-12-misinfo-deepfakes'))
  const key = m?.character ?? 'orbit'
  const name = CHARACTERS[key]?.name ?? 'Orbit'
  return { key, name, line: `${name} teaches this lesson, and the class meets ${name} at the door.` }
}

function markRow(m: Mark): string {
  const src = `${APP_ORIGIN}/digi-squad/friends/email/${m.key}.png`
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px"><tr>
        <td width="72" style="padding-right:14px" valign="middle"><img src="${src}" width="72" height="72" alt="${esc(`${m.name}, from the lessons`)}" style="display:block;border:0;width:72px;height:72px"></td>
        <td valign="middle" style="font-size:15px;line-height:1.55;color:#4A4A63">${esc(m.line)}</td>
      </tr></table>`
}

function wrap(paragraphs: string[], mark?: Mark): string {
  return `
    <div style="font-family:Nunito,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#1A1A2E;max-width:560px">
      ${mark ? markRow(mark) : ''}
      ${paragraphs.map(p => `<p style="margin:0 0 14px">${p}</p>`).join('')}
      <p style="margin:22px 0 0;font-size:13px;line-height:1.5;color:#65657C">${esc(LEGAL_LINE)}</p>
    </div>`
}

/** The letter for this row, or null where the kind has no letter of its own
 *  (the draw already tells people what happens, on the page). */
export function schoolLetter(r: LetterboxRow): { subject: string; html: string } | null {
  const name = esc(firstName(r.contact_name))
  const school = esc(r.school_name)

  if (r.band === 'pilot') {
    const q = new URLSearchParams({ school: r.school_name, name: r.contact_name, email: r.email }).toString()
    return {
      subject: `Your pilot request for ${r.school_name}`,
      html: wrap([
        `Hello ${name},`,
        `Thank you for asking for a pilot for ${school}. It is in, and I will reply within two working days, usually the same day, with your school code.`,
        `The code opens two lessons for a term, matched to the phase you teach, with the classroom player and the script on every slide, every printable for both, and the Hub. The rest of the scheme stays visible on the map and opens with a licence. One code for the whole staff room, no card, no contract, no pupil data.`,
        `To start on the day the code arrives: open <a href="${SITE}/curriculum" style="color:#C99A28;font-weight:700">the curriculum map</a>, find the two marked In your pilot, and press Teach this lesson. The night before takes five minutes with the run sheet.`,
        `When the term ends you decide. Carrying on is one click, with your details already filled in: <a href="${SITE}/pricing?${esc(q)}" style="color:#C99A28;font-weight:700">turn the pilot into a licence</a>. Stopping is fine too, and I would still like to hear what you thought.`,
        `If your data protection officer wants the paperwork first, the privacy notice and the data processing agreement are at <a href="${SITE}/dpa" style="color:#C99A28;font-weight:700">${SITE}/dpa</a>, ready to print and sign.`,
        `If you want to try something before the code lands, <a href="${SITE}/lesson/ks3-12-misinfo-deepfakes" style="color:#C99A28;font-weight:700">the sample lesson</a> is open now. It is the real thing, nothing locked.`,
        `Justin`,
      ], { key: 'digi', name: 'DiGi', line: 'DiGi, the golden star, closes every lesson your classes will see.' }),
    }
  }

  if (r.band === 'taster') {
    const moduleId = moduleFromNotes(r.notes)
    const packLink = moduleId ? `${SITE}/print/${moduleId}` : `${SITE}/lesson/ks3-12-misinfo-deepfakes`
    return {
      subject: 'Your printable pack is open',
      html: wrap([
        `Hello ${name},`,
        `The pack for the sample lesson is open for ${school}: <a href="${packLink}" style="color:#C99A28;font-weight:700">open the printable pack</a>. The pupil booklet, the knowledge organiser, the two quizzes and the learning record, all set for printing.`,
        `Take it into a lesson and see how it lands. When you want the rest of the scheme, the whole staff room runs on one code: <a href="${SITE}/pilot" style="color:#C99A28;font-weight:700">ask for a free term</a> or <a href="${SITE}/pricing" style="color:#C99A28;font-weight:700">see the prices</a>.`,
        `If anything in the lesson did not land the way you expected, reply to this email and tell me. That is how it gets better.`,
        `Justin`,
      ], markFor(moduleId)),
    }
  }

  if (r.band !== 'draw') {
    // An invoice request: the order itself.
    return {
      subject: `Your Guided Childhood invoice for ${r.school_name}`,
      html: wrap([
        `Hello ${name},`,
        `Thank you. Your invoice request for ${school} is in, quoting purchase order ${esc(r.po_number)}.`,
        `The invoice will be with you within two working days, payable on 30 day terms, with no VAT added because we are not VAT registered. Your school code comes with it, and that one code opens everything for your whole staff.`,
        `Between now and then, <a href="${SITE}/curriculum" style="color:#C99A28;font-weight:700">the curriculum map</a> is open to read, and the sample lesson is yours to teach today.`,
        `The terms are at <a href="${SITE}/terms" style="color:#C99A28;font-weight:700">${SITE}/terms</a>, and the data processing agreement your DPO may ask for is at <a href="${SITE}/dpa" style="color:#C99A28;font-weight:700">${SITE}/dpa</a>, ready to print and sign.`,
        `Reply to this email if anything on the invoice needs to read differently for your finance team.`,
        `Justin`,
      ]),
    }
  }

  return null
}
