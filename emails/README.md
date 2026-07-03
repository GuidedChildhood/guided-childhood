# Email series

Five Mailchimp ready HTML emails in the butter and ink brand, Good Inside
style structure (bold centered heading, yellow underline rule, single white
card, chunky yellow CTA). Merge tags in 05 (*|CHILD_NAME|* etc.) map to
Mailchimp merge fields.

## Trigger: Supabase registration into Mailchimp

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
