-- Guided Childhood — Migration 039
-- The 14 day free trial. A new family gets full access from the moment they
-- finish setup, no card, so they feel the whole thing and form the habit
-- before any wall. trial_ends_at is set once at onboarding completion. Full
-- access means an active subscription OR a trial that has not yet passed, so
-- when the trial ends the family simply settles onto the free tier, never a
-- lockout. Null means no trial has started.

alter table public.profiles
  add column if not exists trial_ends_at timestamptz;
