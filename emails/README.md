# Email series

Five Mailchimp ready HTML emails in the butter and ink brand, Good Inside
style structure (bold centered heading, yellow underline rule, single white
card, chunky yellow CTA). Merge tags in 05 (*|CHILD_NAME|* etc.) map to
Mailchimp merge fields.

## The app now sends these itself (Resend)

As of July 2026 the platform sends this whole series directly: templates
live in lib/email/templates.ts, sending in lib/email/send.ts (Resend REST,
a logged no-op without RESEND_API_KEY), the welcome fires from onboarding
via /api/email/welcome, and /api/email/cron (daily, Vercel Cron) walks the
day 2, 4 and 7 steps plus the Monday digest with real per family data. The
email_sends table stops double sends. The files in this folder remain the
Mailchimp fallback and the canonical copy reference. Do not run the
Mailchimp journey and the app sender at the same time or families get
everything twice.

## Fallback trigger: Supabase registration into Mailchimp

Better than polling: a Supabase Database Webhook.
1. Supabase dashboard, Database, Webhooks: create webhook on INSERT into
   public.profiles, pointing at a Mailchimp adding endpoint. Simplest is a
   tiny Next route /api/email/subscribe (add later) that calls the Mailchimp
   API: add member to the audience with tag "registered".
2. In Mailchimp, the Customer Journey starts on tag "registered": send 01
   immediately, 02 after 2 days, 03 after 4, 04 after 7.
3. The weekly digest (05) is better sent from the app itself later (it needs
   live per family data), which is the Resend build on the roadmap. Use 05
   in Mailchimp only as a static template until then.

Voice rules: Justin's voice, no dashes anywhere, numbers over vague claims.
