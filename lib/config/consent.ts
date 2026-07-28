// The version of the wellbeing consent wording a parent has agreed to.
//
// Bump this whenever the WORDING changes in a way that changes what we are
// asking permission for. Consent is to a specific promise, so a parent who
// agreed to the old one has not agreed to the new one, and everybody is asked
// again. Do not bump it for a typo.
export const WELLBEING_CONSENT_VERSION = '2026-07-v1'
