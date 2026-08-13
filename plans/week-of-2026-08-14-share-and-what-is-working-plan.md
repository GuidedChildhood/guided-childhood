# 14 August 2026 — The share button, the signup tidy, and what is working

Branch `claude/mobbin-ux-references-i142dd`, built on top of the four commits
another session had already pushed to it that morning (migration 192, the
duplicate check in bar, the Today check in rung). Rebased onto their tip rather
than onto main, so nothing of theirs was overwritten.

## SHIPPED

1. **The share to phone button.** Diagnosed correctly in the brief and fixed at
   the cause: the card was a Link to the page it was already on. It opens the
   sheet directly now. The sheet was rebuilt: bigger QR, WhatsApp, text and
   email that all work, the printed chart as an equal second door, and the
   generic device share removed.
2. **The stage flash at signup**, dropped from the birthday screen per Justin's
   answer.
3. **The rest of the signup tidy.** Six concern icons redrawn solid and two
   tone. "Take me straight in" became "Let's get started" in the stage pastel.
   The floating bar wears the same pastel instead of near black.
4. **The what is working dashboard**, its own page at
   `/dashboard/what-is-working`, with the movement material moved out of the
   passport.
5. **The check in movement in the weekly summary email.**
6. **`scripts/check-concern-dots.mjs` rewritten** against the design that
   shipped on 12 August. 27 checks, all passing.

`check-checkin-shifts` and `check-child-has-no-model` both still pass. Nothing
in this work touches `DIGI_MODEL`, the knowledge bank, the refresh cron,
`lib/learning/digi-context.ts` or `lib/digi/`.

## NOT STARTED, and carried forward

- **Setup Quest reshape.** `/dashboard/setup` and `lib/setup/steps.ts` are
  untouched. The whole of it is still owed: Duolingo path via `TodayPathBig`,
  one step lit at a time, a chest at the end, a real no device door, a second
  child step, the weekly reminder that stops after the same step is skipped
  twice, and the check that the top card and `SetupNextBar` both disappear once
  every step is green.
- **The passport tidy** beyond the one card that moved out. The what is working
  material has gone; the rest of the page has not been read for what else does
  not belong.
- **The monthly shop pop up.** Not started. `lib/pathway/rotation.ts` and
  friend of the day are still the right engines to reuse.
- **The Planet Friend that leads to the what is working page** at the end of
  each week. The page exists and has an address; nothing puts a friend in the
  daily loop pointing at it yet.
- **The back to school email and the founder offer email.**
- **Planet Friend art in emails**, from `public/digi-squad/friends`.
- **The star quest line on Home** and as a setup step done with the child.
- **Stripe self heal.** Offered, and Justin said not yet.

## Two notes worth carrying

- Email links build from `NEXT_PUBLIC_APP_URL`, falling back to
  `https://guidedchildhood.com` with no www, while `SITE_URL` is the www form.
  It redirects, so nothing is broken, but every email link takes a hop it does
  not need to. One line to fix, in `lib/email/templates.ts`.
- "Remove the share with devices option" was read as the generic operating
  system share sheet, not as the co view Own app / Together toggle, which is a
  persisted setting rather than a share route. If that reading is wrong it is a
  small change in `QrHandoverModal.tsx` and `ChildLinkShare.tsx`.

## House rules held

No dashes in copy. No migration taken; the highest is still 192, claimed by the
other session. 390 and 1280 checked in a browser for every screen touched,
through `/dev/share-sheet`, `/dev/what-is-working`, `/dev/weekly-review-email`
and the live `/starter-pack`, because the container blocks supabase.co and a
headless signup cannot authenticate.
