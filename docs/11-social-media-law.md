# 11. The social_media_law flag

CLAUDE.md non negotiable 7: the `social_media_law` flag drives Stage 4 content
without a rewrite. This is the short version of how, written 17 October 2026
with the passport journey plan (`plans/2026-10-16-passport-journey-plan.md`,
PR 4), because this file was named in CLAUDE.md and did not exist.

## The flag

`NEXT_PUBLIC_SOCIAL_MEDIA_LAW` on Vercel, read once in
`shared/social-media-law.ts` through `normaliseSocialMediaLaw`. Three states:

| State | Means |
|---|---|
| `none` | No UK law on under 16 social media. |
| `partial_ban` | The under 16 ban is confirmed (15 June 2026), regulations are being made, it goes live spring 2027. **The value to hold today.** |
| `full_ban_u16` | The ban is in force. |

An unset or mistyped value reads as `none`, with a server warning, so every
surface agrees. A change needs a redeploy.

## What reads it

- DiGi's system prompt (`lib/digi/system.ts`, `banContextForDigi`).
- The ban note on a script (`app/(dashboard)/dashboard/scripts/[id]/page.tsx`).
- The passport's 13 and 16 lines (`lib/pathway/milestones.ts`), shown on the
  passport picture.
- The child's road lines (`lib/content/readiness.ts`, `KID_STAGE_DEALS`): no
  account is ever promised, no age number, practice rather than outcomes.

## The passport lines, by state

| Flag | 13 | 16 |
|---|---|---|
| none | Most apps say 13. The skills come first, on this page. | The Making choices page plans the first week. |
| partial_ban | Most apps say 13. The UK is moving social media to 16. | The UK line for social media, expected from spring 2027 once the rules are made. |
| full_ban_u16 | Most messaging apps say 13. Group chats and games are where the practice starts. | The UK line for social media. The Making choices page plans the first week. |

## The rules every line keeps

Ban neutral (a deadline is not a plan; the product is the plan). Never allow
or deny. Never the word "banned", never a workaround. Only the platforms in
`BANNED_PLATFORMS` are named. Figures only with a source on the page.
