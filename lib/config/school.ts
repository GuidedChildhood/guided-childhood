// School email forwarding: built, working, and not being advertised yet.
//
// Justin, 12 August 2026, on the From school card: "the forward email part is
// parked for now, this is just the alert calendar for school tasks."
//
// PARKED IS NOT REMOVED, and the distinction is the whole reason this file
// exists rather than a deletion. Everything behind the flag still runs: the
// inbound address and its signing secret, the parser, the reminder cron, and
// every school action that arrives by email still lands in the parent's list
// exactly as it did yesterday. What is switched off is the card offering it as
// a thing to go and set up, because right now the card is the alert calendar
// and nothing else.
//
// Flip this to true and the explainer, the Send a test button and the whole
// route back in are there, unchanged.
export const SCHOOL_EMAIL_FORWARDING_LIVE = false
