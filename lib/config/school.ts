// School email forwarding: built in July, parked in August, live since
// 17 September 2026.
//
// Justin, 12 August 2026: "the forward email part is parked for now, this is
// just the alert calendar for school tasks." The pipeline kept running behind
// the flag the whole time; what was switched off was the card offering a way
// in that was not being pushed yet.
//
// Justin, 17 September 2026: "yes the MX is live, unpark it and do slice 0 but
// before we go ahead we need to make super easy for user to set up as this was
// the issue."
//
// So this went true in the same change that rebuilt the setup, not before it.
// That order matters: the reason to keep it parked was never the pipeline, it
// was that the way in asked a parent for their school's noreply address before
// it would give them anything. Turning the flag on without fixing that would
// have advertised the same dead end more loudly.
//
// The MX record on in.guidedchildhood.com resolves to Resend's inbound host,
// checked 17 September 2026, which is the one thing the whole feature rests on.
// /api/school/health answers it live if it is ever in doubt.
export const SCHOOL_EMAIL_FORWARDING_LIVE = true
