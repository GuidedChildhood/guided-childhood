// The share action on the stage result (review board task
// stage-result-share-action, 13 October 2026; step 1.2 of
// plans/DISTRIBUTION-PLAYBOOK-step-by-step.md).
//
// A parent who has just been told their child's stage, and what to say
// tonight, is the best advert we will ever have, and the only share surface
// sat in settings after sign up. So the result offers it at the moment it is
// felt: "send this to a parent who has this fight".
//
// Two links, one rule each:
//   a visitor shares /v/stage-share, the source link the founder page counts
//     under "Shared from the stage result" (migration 379), with no reward
//     because there is no account to pay one to;
//   a member shares their own /r/<code>, so the friend gets £5 off and they get
//     £5, and the message says so, as CAP Code rule 2.1 requires of any
//     incentivised recommendation (the same rule as lib/referrals shareMessage).
//
// The message never names the worry. A parent's typed worry is about their own
// child, and it is not ours to put in somebody else's WhatsApp.
//
// Pure, so the guard can test it without a browser.

/** The source link a visitor shares (seeded in migration 379). */
export const STAGE_SHARE_CODE = 'stage-share'

/** The link to share: the member's referral link when there is one, else the counted source link. */
export function stageShareLink(origin: string, referralCode: string | null): string {
  const base = origin.replace(/\/+$/, '')
  return referralCode ? `${base}/r/${encodeURIComponent(referralCode)}` : `${base}/v/${STAGE_SHARE_CODE}`
}

/** The words that go with it, in the sharer's voice. */
export function stageShareMessage(link: string, member: boolean): string {
  const opener = 'This told me what stage my child is at with screens, and what to say tonight. Three questions, no sign up.'
  return member
    ? `${opener} If you join with my link you get £5 off your first month, and I get £5 too. ${link}`
    : `${opener} ${link}`
}

/** A WhatsApp send with the message filled in, on a phone or the desktop app. */
export function whatsappHref(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}
