-- Guided Childhood — Migration 030
-- A phone number on the child record (optional, parent entered). Used to
-- send the quest link, agreements and craft sheets straight to the
-- child's phone through the parent's own Messages app (sms: links, no
-- SMS provider, nothing sent by us directly).

alter table public.children
  add column if not exists phone text;
