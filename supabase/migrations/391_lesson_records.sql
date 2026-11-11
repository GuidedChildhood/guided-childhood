-- The school's record of what it taught (10 November 2026).
--
-- Justin, 9 November: "One lesson. One click. All relevant records updated."
-- And the question a head asked on 10 November: how do we record progress,
-- and how children are learning against a fixed progression?
--
-- Until now the tracker lived in one browser (shared/schools-progress.ts), so
-- a school with three teachers on three laptops had three partial records.
-- This is the record that survives the laptop. Specification:
-- plans/2026-11-09-one-click-tracking-spec.md, and the build plan:
-- plans/2026-11-10-lesson-run-and-records-plan.md.
--
-- THE NAME. The specification called this lesson_deliveries. A table of that
-- name already sits in the schools schema, empty and unread since the first
-- build of the schools product (migration 023: class_id, lesson_id,
-- teacher_id, from the design that had accounts and a pupils table). It is
-- left exactly as it is. This is a different thing with a different shape, so
-- it has its own name, and `create table if not exists` cannot quietly land on
-- the old one.
--
-- THE ONE RULE. Store the event once and work everything else out when a page
-- is read. A row says: this school taught this lesson to these classes on this
-- date, and optionally how they did. It holds no curriculum credits. Coverage,
-- progression and every report join the row to the mapping files at read time,
-- so a lesson mapped to three frameworks is still one delivery, and correcting
-- a mapping corrects every past report with no data change.
--
-- NO PUPIL, EVER. Nothing here names or counts a child as an individual.
--   groups           class names typed by staff ("4B", "Maple")
--   objective_marks  the class against each objective. For the digital
--                    lessons a judgement per "I can"; for French the number of
--                    pupils at each level of the scheme's own model, which is
--                    a count and never a list.
--   note             280 characters written by staff, with "no pupil names"
--                    under the box.
--
-- WHO A SCHOOL IS. There are no accounts. school_ref is a pseudonym of the
-- school's access code (an HMAC under the access secret, schools/lib/records.ts).
-- The code itself is never stored, and the browser never sends a school: every
-- read and write runs in a server action that derives school_ref from the
-- signed cookie.
--
-- ISOLATION IS STRUCTURAL. Row level security is on with no policy for anon or
-- authenticated, and neither role is granted anything, so the tables cannot be
-- reached through the Data API at all. Only the schools server, which holds
-- the service role key, can read or write them.

create table schools.lesson_records (
  id              uuid primary key default gen_random_uuid(),
  school_ref      text not null check (school_ref ~ '^[0-9a-f]{32}$'),
  subject         text not null check (subject in ('digital', 'fr', 'es')),
  -- The module id for a digital lesson; unit and lesson for a language ("y3-ht2/3").
  lesson_key      text not null check (lesson_key ~ '^[a-z0-9]+(-[a-z0-9]+)*(/[0-9]{1,2})?$' and length(lesson_key) between 3 and 80),
  -- The version of the lesson that was taught, hashed when the row is written.
  content_hash    text check (content_hash is null or content_hash ~ '^[0-9a-f]{32}$'),
  delivered_on    date not null default current_date,
  -- September to August, "2026-27".
  academic_year   text not null check (academic_year ~ '^[0-9]{4}-[0-9]{2}$'),
  groups          text[] not null check (cardinality(groups) between 1 and 12),
  year_groups     int[] not null default '{}',
  -- Optional initials. Off by default (decision C, 9 November).
  taught_by       text check (taught_by is null or length(taught_by) between 1 and 4),
  -- Delivered is never assessed. Skipping the judgement stores not_assessed.
  -- 'levels' means the counts are in objective_marks (French).
  assessment      text not null default 'not_assessed'
                    check (assessment in ('secure', 'developing', 'revisit', 'levels', 'not_assessed')),
  objective_marks jsonb not null default '{}'::jsonb check (jsonb_typeof(objective_marks) = 'object'),
  note            text check (note is null or length(note) <= 280),
  status          text not null default 'delivered' check (status in ('delivered', 'withdrawn')),
  -- 'imported' is a tick lifted from a browser's own record, dated as it was.
  source          text not null default 'button' check (source in ('button', 'imported')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_lesson_records_school_year
  on schools.lesson_records (school_ref, subject, academic_year);

-- The audit trail. Append only: a record is corrected or withdrawn, never
-- silently changed, and this is where the before and after are kept.
create table schools.lesson_record_events (
  id           uuid primary key default gen_random_uuid(),
  delivery_id  uuid not null references schools.lesson_records(id) on delete cascade,
  school_ref   text not null check (school_ref ~ '^[0-9a-f]{32}$'),
  action       text not null check (action in ('created', 'assessed', 'corrected', 'withdrawn', 'undone')),
  before       jsonb,
  after        jsonb,
  reason       text check (reason is null or length(reason) <= 280),
  at           timestamptz not null default now()
);

create index if not exists idx_lesson_record_events_delivery
  on schools.lesson_record_events (delivery_id);

alter table schools.lesson_records enable row level security;
alter table schools.lesson_record_events enable row level security;

revoke all on schools.lesson_records from anon, authenticated;
revoke all on schools.lesson_record_events from anon, authenticated;

-- The server role gets exactly what the actions use and no more, whatever the
-- schema's default privileges would have handed it. It can add and change a
-- record but not delete one (a record is withdrawn, never removed), and it can
-- only ever add to the trail. The retention job, when it is built, gets its
-- own grant in its own migration.
revoke all on schools.lesson_records from service_role;
revoke all on schools.lesson_record_events from service_role;
grant select, insert, update on schools.lesson_records to service_role;
grant select, insert on schools.lesson_record_events to service_role;

comment on table schools.lesson_records is
  'One row per lesson a school taught to one or more classes. No pupil data. school_ref is a pseudonym of the access code. Reached only through the schools server (schools/lib/records.ts).';
comment on table schools.lesson_record_events is
  'Append only audit trail for schools.lesson_records: created, assessed, corrected, withdrawn, undone.';
