// The school link (migration 353): a newsletter link, /s/<code>, that tells us
// which school sent a family. Attribution only; the offer is the ordinary one.
//
// Pure, so the check script can import it without a database.

/** The cookie the link sets and the trial grant reads. */
export const SCHOOL_LINK_COOKIE = 'gc_school'

/** Long enough to cover a newsletter read on a Friday and a signup weeks later. */
export const SCHOOL_LINK_MAX_AGE_SECONDS = 60 * 24 * 60 * 60

/** A code as the table stores it, or null when it could not be one. */
export function normaliseLinkCode(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null
  const code = raw.trim().toLowerCase()
  if (code.length < 3 || code.length > 40) return null
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(code) ? code : null
}

/** A code made from a school's name: "St Mary's C of E Primary" becomes st-marys-c-of-e-primary. */
export function codeFromSchoolName(name: string): string | null {
  const slug = name
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '')
  return normaliseLinkCode(slug)
}
