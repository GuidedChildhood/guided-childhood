# Email landing pages and the school parent share (5 November 2026)

Justin, 5 November: the email links to the child's app and the family agreement
land a signed out parent on the login page ("fix create"). And schools should
share every lesson with parents, seen only by parents who sign up free ("a
secret way to get users").

Claims migration 386.

## 1. Public landing pages for the email links

- `/kids-app` (and `/app` redirecting to it): what the child sees, what the
  parent controls, how it goes on the home screen. The real screenshot
  `public/marketing/kid-page.png` (no faces).
- `/agreement`: what the one page agreement is, how it works, the real
  `FamilyDealSheet` component rendered with fixture rows.
- One CTA each: `/starter-pack?next=...` (non negotiable 9 still holds: the
  account is made in the starter pack). Members: `/login?next=...`.
- The starter pack honours `next` after the account is made, on all three
  ways in (password, Google or Apple, confirm by email), through one
  validator, `lib/auth/safe-next.ts`. Login and `/auth/callback` use it too
  (the callback concatenated an unchecked `next` onto the origin).

## 2. The school parent share

- Link: `https://www.guidedchildhood.com/from-school/<module>/<ref>.<sig>`.
  Minted by the schools app on the lesson page for a school whose code opens
  that lesson (licence: any; pilot: its two). `ref` is a pseudonym of the
  school's access code (the code itself is a password and never leaves the
  schools app). `sig` stops a parent editing the module to open lessons the
  school never shared. Both apps share `PARENT_SHARE_SECRET`.
- Signed out: title, what the child learned, the talk at home question, then a
  locked card and the free account CTA through `.../start`, which remembers the
  school (and the lesson's home code) in cookies and goes to the starter pack
  with `next` back to the lesson.
- Signed in (any account, free included): the full parent note and the lesson
  in the together register, recording nothing.
- Attribution: `/api/trial/start` writes `profiles.school_share_ref` and
  `school_share_module` once, at a fresh grant, like `school_link`. The admin
  schools page counts them by ref.
- Never the DSL note, never anything about a child, no completion written.

## Checks

tsc both apps, the source guards, the new node tests, both builds, the pages in
a browser at 390 and 1280.
