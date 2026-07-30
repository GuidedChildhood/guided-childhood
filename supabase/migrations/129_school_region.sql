-- Guided Childhood — Migration 129
--
-- Which country's school holidays a family actually keeps.
--
-- Migration 127 and lib/learning/holidays.ts built two sets of windows, England
-- and the US, and then nothing anywhere could choose between them. Every caller
-- passed the 'uk' default, so a family in Ohio got the English half terms:
-- relaxed in late October when their child is at school, and term time through
-- the whole Thanksgiving week. Two full sets of dates, and one of them
-- unreachable.
--
-- ── On the family, not on the child ─────────────────────────────────────────
--
-- Siblings go to school in the same country. Putting this on children would
-- invite a household split across two calendars, which is not a real family and
-- would make the holiday bank ambiguous the moment two children disagreed about
-- whether it is the holidays.
--
-- ── Defaulting to uk is a real decision, not laziness ───────────────────────
--
-- Every family on the platform today is English, the curriculum data is the
-- England national curriculum, and the whole product is written in British
-- English. A US family setting this is opting into the half of the holiday
-- calendar that already existed for them; nobody is opted into a guess.
--
-- Deliberately not geolocated. A holiday calendar quietly chosen by IP address
-- is wrong for anyone on holiday, on a VPN, or living abroad, and it is wrong
-- in the direction that changes a child's screen time without anyone asking.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.profiles
  add column if not exists school_region text not null default 'uk';

-- Named so a later region can be added by altering one constraint rather than
-- hunting for the places that assumed two.
alter table public.profiles
  drop constraint if exists profiles_school_region_check;
alter table public.profiles
  add constraint profiles_school_region_check check (school_region in ('uk', 'us'));

comment on column public.profiles.school_region is
  'Which school holiday calendar this family keeps, uk or us. Drives the holiday windows in lib/learning/holidays.ts: the relaxed screen guide during a break, and when banked holiday minutes become spendable. Set by the parent in settings and never guessed from location, because a wrong guess changes a child screen time without anyone asking for it.';
