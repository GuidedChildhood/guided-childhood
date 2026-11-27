# Explorer flow fixes from the expert walkthrough (27 November 2026)

Justin asked for an expert flow walkthrough of migration 407 and said yes to
all five fixes. The walkthrough found the scripts read well but parents never
reached them.

1. **Worry tiles** (`lib/content/device-issues.ts`): night_phone leads with
   "Where the phone sleeps tonight"; social_media_misery covers 11 to 13 and
   knows "came off", "off instagram" and the like, so a daughter coming off
   Instagram down no longer lands on "she wants TikTok".
2. **DiGi script match** (`lib/digi/script-match.ts`, `app/api/digi/route.ts`):
   the child's stage counts half again, the stage either side as written,
   further away at half; the floor stays on the words. "tonight", "evening",
   "today" are stop words. `scripts/lib/script-titles.mjs` reads the insert
   select form so the guard sees migration 407's script.
3. **Instagram guide** (migration 408): sleep mode, hidden words and tidying
   the feed added. The guide's age note says set these up now if the app is
   already on their phone (`components/devices/GuideBody.tsx`).
4. **9673 copy** (migration 408): the acknowledgement leads the situation with
   first phone and bedroom; every kitchen mention becomes the spot chosen
   together.
5. **601 agrees with explorer 8** (migration 408): asks how she is, points to
   script 8 for the tearful evening. **Remind me** button
   (`components/scripts/ScriptDepth.tsx`, `app/api/scripts/remind`,
   `lib/scripts/check-back.ts`) writes a digi_followups row timed from the
   script's own check back; the heading says the same timing.

Checks: live matching rerun puts 9673 and 601 first; the tile matcher picks
night_phone and social_media_misery; guards and type check pass; button
screenshotted at 390px and 1280px. 408 waits for Justin's yes.
