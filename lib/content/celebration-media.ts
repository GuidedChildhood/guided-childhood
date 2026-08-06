// Celebration footage, in one place for the same reason the character art is.
//
// Same CloudFront bucket and the same Higgsfield naming as the Planet Friends
// in stage-characters.ts, so there is one host to allow in next.config and one
// file to edit when a clip is regenerated.

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

/**
 * The rocket journey, played when a Planet Friend is earned.
 *
 * Justin, 6 August 2026: "a rocket goes into space, lands on Mars, picks up a
 * relevant family planet friend and brings [it] home back down to earth and
 * pops up filling their screen." Approved and rendered the same evening.
 *
 * ONE clip covers all five Friends, and that is deliberate. What the rocket
 * collects on the orange planet is a glowing pod with its contents hidden, and
 * the reveal happens in the app afterwards using the child's REAL cutout art,
 * the same file their sticker book uses. So:
 *
 *   a Friend redrawn does not strand an old copy of themselves in here
 *   a sixth Friend needs no new footage
 *   the character who fills the screen is the one they go and find
 *
 * Ten seconds, 720x1280, no text and no people, so it needs no localising and
 * ages the way the character art does.
 *
 * KidFriendArrival runs a drawn CSS and GSAP flight when this is not passed,
 * which is what ships to a phone that will not play inline video and what runs
 * under prefers-reduced-motion. The arrival beat is identical either way.
 */
export const FRIEND_ARRIVAL_VIDEO =
  BASE + 'hf_20260806_213221_e9be5ab9-73ec-4125-84d6-37d161e25b5a.mp4'
