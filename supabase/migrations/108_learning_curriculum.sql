-- Guided Childhood — Migration 108
-- The curriculum spine for the learning printables.
--
-- Our printables are colouring in, which is right for a four year old and wrong
-- for a nine year old. An older child needs sheets that reflect what school
-- expects them to know at their age AT THIS POINT IN THE YEAR, so a parent can
-- see where their child actually is without waiting for a report.
--
-- This is the spine only: the objectives, keyed so a sheet can be assembled for
-- one year group, one subject, one term. The sheet generator, the questions and
-- the help flag build on top of it.
--
-- ── Why the term matters, and why it is a column ─────────────────────────────
--
-- What a Year 4 should know is useless in September and true in June. English
-- primaries run a three term year and the dominant maths scheme sequences it the
-- same way almost everywhere, so an autumn Year 4 sheet tests place value and
-- column methods while a summer one tests tables, area and time. Same year, a
-- different sheet. A model without term would produce sheets that are wrong for
-- most of the year they are printed in.
--
-- ── Why curriculum is a column from day one ──────────────────────────────────
--
-- England only for now. Scotland, Wales and Northern Ireland are genuinely
-- different curricula, not variants, so they get their own rows rather than a
-- fudge. The column exists now so they slot in later without a rebuild, and
-- nothing is claimed about them until they are built.
--
-- ── Why source is NOT NULL, which is the important bit ───────────────────────
--
-- Accuracy is the whole product here. A sheet that tests the wrong thing for the
-- year is worse than no sheet, because a parent will believe it and act on it.
-- So every objective has to carry where its wording came from, and the column is
-- not nullable: an objective nobody can trace cannot be inserted at all. That is
-- deliberately awkward. It is the one thing standing between this feature and a
-- confident, plausible, wrong worksheet.
--
-- `verbatim` records whether the text is the statutory wording exactly as
-- published or our own paraphrase, because those are different promises to make
-- to a parent and only one of them can be quoted.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

create table if not exists public.curriculum_objectives (
  id          uuid        primary key default gen_random_uuid(),
  -- england for now. Never assume a nation, always state it.
  curriculum  text        not null default 'england',
  year_group  integer     not null,
  -- maths, english, reading
  subject     text        not null,
  -- autumn, spring, summer. The term a sheet covering this would be printed in.
  term        text        not null,
  -- The strand it sits under, as the programme of study groups them, so a sheet
  -- can be built one strand at a time rather than as a soup of objectives.
  strand      text        not null,
  -- The objective itself.
  objective   text        not null,
  -- Where the wording came from. Not nullable on purpose, see above.
  source      text        not null,
  -- True when the text is the published statutory wording exactly, false when it
  -- is our paraphrase. Only the first may be quoted to a parent as the standard.
  verbatim    boolean     not null default false,
  -- Statutory checkpoints are what parents are actually anxious about, and they
  -- are the sharpest hook we have: the times tables check in Year 4, phonics in
  -- Year 1, SATs in Year 6. Flagged so a run up sheet can pull just these.
  checkpoint  text,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists idx_curriculum_objectives_sheet
  on public.curriculum_objectives (curriculum, year_group, subject, term, sort_order);

create index if not exists idx_curriculum_objectives_checkpoint
  on public.curriculum_objectives (checkpoint) where checkpoint is not null;

-- The same objective must not land twice when a seed is re run.
create unique index if not exists idx_curriculum_objectives_unique
  on public.curriculum_objectives (curriculum, year_group, subject, term, objective);

alter table public.curriculum_objectives enable row level security;

drop policy if exists "curriculum_objectives_read" on public.curriculum_objectives;

-- Reference content. Every signed in parent reads it, nobody writes it from the
-- app: objectives change by migration, with a source, or they do not change.
create policy "curriculum_objectives_read" on public.curriculum_objectives
  for select using (auth.role() = 'authenticated');

-- ── Year 4, the proof, and only what has been verified ───────────────────────
--
-- Year 4 first because the multiplication tables check in June is the sharpest
-- hook in the primary calendar and the thing parents search for most.
--
-- IMPORTANT, AND THE REASON THIS SEED IS SHORT. The statutory documents on
-- gov.uk, and the NCETM curriculum tool, are blocked by this workspace egress
-- policy, so they could not be read directly. Everything below was confirmed
-- through retrieved search results carrying the published wording, and only the
-- strands that came back confirmed are here. The rest of Year 4, and Years 1 to
-- 3, 5 and 6, are deliberately absent rather than written from memory: a
-- plausible objective is exactly the failure this table is shaped to prevent.
--
-- To finish the map, either allow assets.publishing.service.gov.uk and
-- ncetm.org.uk through egress, or paste the programmes of study in.

insert into public.curriculum_objectives (year_group, subject, term, strand, objective, source, verbatim, checkpoint, sort_order) values
  (4, 'maths', 'autumn', 'Number and place value', 'count in multiples of 6, 7, 9, 25 and 1000', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 10),
  (4, 'maths', 'autumn', 'Number and place value', 'find 1000 more or less than a given number', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 20),
  (4, 'maths', 'autumn', 'Number and place value', 'count backwards through zero to include negative numbers', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 30),
  (4, 'maths', 'autumn', 'Number and place value', 'recognise the place value of each digit in a four-digit number (thousands, hundreds, tens, and ones)', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 40),
  (4, 'maths', 'autumn', 'Number and place value', 'order and compare numbers beyond 1000', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 50),
  (4, 'maths', 'autumn', 'Number and place value', 'identify, represent and estimate numbers using different representations', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 60),
  (4, 'maths', 'autumn', 'Number and place value', 'round any number to the nearest 10, 100 or 1000', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 70),
  (4, 'maths', 'autumn', 'Number and place value', 'solve number and practical problems that involve all of the above and with increasingly large positive numbers', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 80),
  (4, 'maths', 'autumn', 'Number and place value', 'read Roman numerals to 100 (I to C) and know that over time, the numeral system changed to include the concept of zero and place value', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 90),
  (4, 'maths', 'autumn', 'Addition and subtraction', 'add and subtract numbers with up to 4 digits using the formal written methods of columnar addition and subtraction where appropriate', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 100)
on conflict (curriculum, year_group, subject, term, objective) do nothing;

insert into public.curriculum_objectives (year_group, subject, term, strand, objective, source, verbatim, checkpoint, sort_order) values
  (4, 'maths', 'spring', 'Multiplication and division', 'recall multiplication and division facts for multiplication tables up to 12 x 12', 'National curriculum in England, mathematics programmes of study, year 4', true, 'multiplication_tables_check', 10)
on conflict (curriculum, year_group, subject, term, objective) do nothing;

insert into public.curriculum_objectives (year_group, subject, term, strand, objective, source, verbatim, checkpoint, sort_order) values
  (4, 'maths', 'summer', 'Multiplication and division', 'recall multiplication and division facts for multiplication tables up to 12 x 12', 'National curriculum in England, mathematics programmes of study, year 4', true, 'multiplication_tables_check', 10),
  (4, 'maths', 'summer', 'Measurement', 'convert between different units of measure', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 20),
  (4, 'maths', 'summer', 'Measurement', 'measure and calculate the perimeter of a rectilinear figure (including squares) in centimetres and metres', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 30),
  (4, 'maths', 'summer', 'Measurement', 'find the area of rectilinear shapes by counting squares', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 40),
  (4, 'maths', 'summer', 'Measurement', 'estimate, compare and calculate different measures, including money in pounds and pence', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 50),
  (4, 'maths', 'summer', 'Measurement', 'read, write and convert time between analogue and digital 12- and 24-hour clocks', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 60),
  (4, 'maths', 'summer', 'Geometry properties of shapes', 'compare and classify geometric shapes, including quadrilaterals and triangles, based on their properties and sizes', 'National curriculum in England, mathematics programmes of study, year 4', true, null, 70)
on conflict (curriculum, year_group, subject, term, objective) do nothing;
