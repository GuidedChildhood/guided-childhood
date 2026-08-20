-- Guided Childhood — Migration 216
-- Setup happens ONCE per account, and stays done.
--
-- Justin, 19 August 2026: "setup is only for the first account, and if a user
-- adds another child at a later date the only thing needed is to share a new QR
-- code. So the pathway for any additional children does not need setup at all.
-- This is only once per account."
--
-- Two faults this closes.
--
-- The rung is ACCOUNT level and was being drawn on every child's Today, so a
-- parent switching to their second child was told she needed setting up. She
-- did not. Nothing about her was outstanding.
--
-- And the quest could REOPEN months later. The share step asks that every child
-- has a code, which is right on the setup page and wrong as a gate: adding a
-- third child in November would put a finished family back into setup, months
-- after they finished it, over a QR code.
--
-- A stamp is the honest fix. Once a family has genuinely completed setup, that
-- is a fact about the account and it does not become untrue later. A newly added
-- child needs a code, which is its own small job on Today for that child, not
-- the whole quest coming back.

alter table public.profiles
  add column if not exists setup_completed_at timestamptz;

update public.profiles p
set setup_completed_at = now()
where p.setup_completed_at is null
  and (
    p.home_screen_at is not null
    or exists (select 1 from public.push_subscriptions s where s.user_id = p.id)
  )
  and exists (select 1 from public.children c where c.parent_id = p.id)
  and not exists (
    select 1 from public.children c
    where c.parent_id = p.id
      and c.no_phone is not true
      and not exists (select 1 from public.kid_links l where l.child_id = c.id)
  );
