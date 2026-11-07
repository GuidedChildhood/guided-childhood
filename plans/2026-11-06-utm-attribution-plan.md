# UTMs kept with the sign up (6 November 2026)

Source: the funnel audit, `~/Carousels/Research Pack/11-funnel-audit.md`, fixes 4, 7 and 8 and section 2 (attribution). Fix 6 is the Social Billboard, whose code is not in this repo.

1. `/v/<code>` keeps `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` on its redirect, counts them on the opened row and remembers them in a `gc_utm` cookie. `/starter-pack` posts them to `/api/video-link/follow` with or without `src`.
2. The start counter writes them on the started row; `/api/trial/start` writes them on the profile beside `video_link`. Migration 388 adds the columns and `video_link_utm_counts`; the founder page gets a By post table.
3. `tiktok` and `youtube` become channels (388 and `lib/video/link.ts`).
4. The stage check intro reads "Your free stage check". A visit through `/v/`, `?src=` or a social `utm_source` opens on question one.
5. The schools pilot form records `?src=` and the UTMs in the request's notes.

Rule throughout: a UTM value is a slug about the post (shared/utm.ts), so an email or a phone number in a link is dropped, and the database checks the same pattern.

Not code: `NEXT_PUBLIC_POSTHOG_KEY` is not set in the live build. Justin sets it in Vercel and redeploys.
