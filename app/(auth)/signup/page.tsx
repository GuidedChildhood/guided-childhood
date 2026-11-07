import { redirect } from 'next/navigation'

// ONE DOOR. This one sends you to it.
//
// Justin, 15 September 2026: "a yes to one door but the best designed door, so
// fluid flows, and as a top expert app would advise." And, in the same breath,
// "don't rewire what we have though as this may break it."
//
// So this is the part that needs no rewiring at all. There were two ways to
// create an account and they left families with different things:
//
//   /starter-pack   three questions about your child, a personalised reveal,
//                   then email and password at the END. Asks how much time you
//                   have, which DiGi caps its advice to. Every advert, every
//                   marketing page, the site header and the emails point here.
//
//   /signup         name, email and password first, then a four screen wizard.
//                   Never asked the time question. Linked from exactly ONE
//                   place in the whole product: the "New here?" line under the
//                   login form, which is how Justin arrived on it.
//
// A parent who came through here had no time budget on record, so DiGi was
// told "not specified" and sized its advice to nobody (app/api/digi/route.ts).
// That is not a worse looking form, it is a worse product for that family.
//
// Rather than merge the two flows, which IS the rewiring, this door simply
// closes and points at the good one. Nothing inside either flow moves.
//
// Nothing is lost by coming this way: /starter-pack carries the same
// ProviderButtons, so Google sign up still works. The wizard at
// /onboarding is untouched and still reached by anyone part way through setup
// (app/(dashboard)/dashboard/page.tsx redirects there while onboarding_complete
// is false), so a family mid setup today finishes exactly as before.

//
// NO EMAIL IN THE REDIRECT (6 November 2026). This used to forward ?email= on
// to /starter-pack, which never read it, so all it did was copy an address
// into one more URL, and a URL lands in request logs, analytics and browser
// history (the funnel audit, fix 8). Nothing links here with ?email= now
// either. Anything on the query string is dropped on purpose.
export default function SignupPage() {
  redirect('/starter-pack')
}
