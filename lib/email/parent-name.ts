// ── WHAT WE CALL A PARENT, AND WHEN WE CALL THEM NOTHING ───────────────────
//
// Justin, 11 September 2026, with his welcome email open: "just checking this
// auto email is using the user's name?"
//
// It is. The problem is what the database thinks their name is.
//
// handle_new_user (migration 001) fills profiles.full_name with
// `coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1))`.
// The /signup form passes a name, so those accounts are right. The STARTER
// PACK does not collect one on purpose, and every CTA on /join routes to the
// starter pack, so the funnel the whole product points at is the one that
// falls through to the email address.
//
// Which is how a welcome email opens "Thank you for joining, justin+1234."
//
// On the live project that is one account of twenty three today, because the
// other twenty two predate the starter pack becoming the front door. Going
// forward it is every single new family.
//
// ── THE FIX IS TO KNOW WHEN WE DO NOT KNOW ─────────────────────────────────
//
// Guessing a name from an address is the mistake. So this spots the guess and
// returns null instead, and the templates say something warm that needs no
// name rather than something wrong that has one. A null here is not a gap in
// the copy, it is the honest version of it.
//
// Whether to ASK for a first name in the starter pack is a funnel decision and
// Justin's to make. This works either way: the day a name is collected, it is
// used, and nothing here has to change.

/** Does this look like it came off an email address rather than off a person? */
function looksMachineMade(name: string, email: string | null | undefined): boolean {
  const n = name.trim()
  if (!n) return true
  // The exact fallback the trigger writes.
  if (email && n.toLowerCase() === email.split('@')[0].toLowerCase()) return true
  // And the shapes no parent types into a name box: an address, a plus
  // addressed alias, or a run of digits.
  if (n.includes('@')) return true
  if (n.includes('+')) return true
  if (/\d{2,}/.test(n)) return true
  return false
}

/**
 * The parent's first name for an email greeting, or null when we do not have
 * one worth using.
 *
 * Null is the answer to trust: every caller should write copy that reads
 * properly without a name, because for a starter pack family that is the
 * normal case rather than the edge one.
 */
export function parentFirstName(
  fullName: string | null | undefined,
  email?: string | null,
): string | null {
  const raw = (fullName ?? '').trim()
  if (!raw || looksMachineMade(raw, email)) return null
  return raw.split(' ')[0]
}
