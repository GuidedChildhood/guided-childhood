-- 083: the birthday that makes the whole platform grow up with the child.
--
-- Nullable on purpose. A child without a birthday keeps the age_band the
-- parent set by hand, exactly as today. The moment a birthday is set, the
-- daily age up cron (app/api/cron/age-up) derives the band from it with
-- lib/children/age.ts and moves age_band and stage_id on its own.

alter table public.children
  add column if not exists date_of_birth date;

comment on column public.children.date_of_birth is
  'Optional. When set, the age up cron derives age_band and stage_id from it daily. When null, age_band stays as the parent set it.';
