-- Watch together booking (Justin, 16 November 2026).
--
-- A parent books a time to watch one Watch together film with one child. At
-- that time the film leads the child's own page, the parent gets a reminder a
-- little before, and after watching the parent gets one short thing to do or
-- ask. Plan and the privacy and safeguarding notes:
-- plans/2026-11-16-watch-together-booking-plan.md.
--
-- What a booking holds is deliberately small: whose child, which film, what
-- time. No free text, no location, nothing from the device. The film's stage
-- is read from parent_lessons when needed, never copied here, so it cannot
-- drift from the lesson.
--
-- Written and read by the server only (service role), like parent_answers:
-- the parent routes check that the child is theirs, and the child's page reads
-- through its token. No browser session reads this table directly.

create table if not exists public.watch_bookings (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  lesson_code text not null references public.parent_lessons(lesson_code) on delete cascade,
  starts_at timestamptz not null,
  status text not null default 'booked'
    check (status in ('booked', 'watched', 'cancelled', 'missed')),
  -- One buzz on the child's phone at the time, daytime only (quiet hours
  -- still win). On by default, the parent can untick it (Justin's answer 5).
  buzz_child boolean not null default true,
  reminded_at timestamptz,      -- the parent's push, sent once
  child_pinged_at timestamptz,  -- the child's buzz, sent once, or marked skipped at night
  watched_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One live booking per child per film. Rescheduling moves the time on the
-- same row; a cancelled, watched or missed row does not block a new one.
create unique index if not exists watch_bookings_one_live
  on public.watch_bookings (child_id, lesson_code) where status = 'booked';

create index if not exists watch_bookings_due_idx
  on public.watch_bookings (starts_at) where status = 'booked';
create index if not exists watch_bookings_parent_idx
  on public.watch_bookings (parent_id, starts_at desc);

alter table public.watch_bookings enable row level security;

revoke all on public.watch_bookings from anon, authenticated;
grant select, insert, update, delete on public.watch_bookings to service_role;

-- The short thing to do or ask after watching. Content lives in the database
-- (non negotiable 6). Nullable: a film without one simply shows nothing extra.
alter table public.parent_lessons add column if not exists after_prompt text;

update public.parent_lessons set after_prompt = v.prompt
from (values
  ('1.1', 'Ask: "If something on a screen made you feel funny inside, what would you do?" Then cheer the answer.'),
  ('1.2', 'Ask: "Who shall we send one kind message to?" Then send it together.'),
  ('1.3', 'Say: "Stop. Ask. Then share. Shall we make our sign?" Then make it and pop it near the tablet.'),
  ('1.4', 'Say: "You will never be in trouble for telling me." Then keep that promise the first time it is tested.'),
  ('1.5', 'Next time they ask "Is this real?", say: "Good question. Let''s look together."'),
  ('1.6', 'Pick the spot where every screen sleeps tonight, yours too, and choose your three cosy things together.'),
  ('1.7', 'Draw the shield together, then ask: "What would you do if a game asked which school you go to?"'),
  ('1.8', 'Make something together tonight and sign it with both your names.'),
  ('1.9', 'Next time a voice assistant answers, ask together: "Person or machine?"'),
  ('1.10', 'Next time a pop up appears, say: "Let''s read it together before anyone presses yes."')
) as v(code, prompt)
where public.parent_lessons.lesson_code = v.code
  and public.parent_lessons.after_prompt is null;
