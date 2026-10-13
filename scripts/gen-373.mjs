#!/usr/bin/env node
// MIGRATION 373: THE HOME CODE RECORDS COVERAGE, AND THE CONTENT THE LOOP READS.
//
// Plans: plans/2026-10-08-lessons-hub-plan.md (version 10, PR 2) and
// plans/2026-10-09-curriculum-sync-plan.md (B, D, G3, G5). The plan named
// this migration 367; 367 to 372 were taken by other sessions while it was
// held for the model change, so it is 373.
//
// WHAT THIS WRITES, read straight from content/modules:
//   1. public.lesson_coverage: a class lesson met, per child (sync plan B).
//   2. public.children.lessons_together: "does lessons with me" (G3).
//   3. On all 34 scheme rows: parent_note, rewritten so the family question
//      teaches, with listen_for and then_ask under it, a private say_this on
//      the six lessons a parent hears about first, and a passport line that
//      says the class met the lesson and the child's own check fills the
//      page. And teacher_notes.passport_stage, moved onto the one stage map
//      (KS3 Explorer, KS4 Shaper, KS5 Independent): 18 rows change.
//   4. On the first two Foundation decks: together_prompt on every slide the
//      together deck shows (plan v10, 2.2). No slide loses or changes any
//      other key, no option count moves, no minute moves.
//
// WHAT IT REFUSES. A file whose note lacks any of the four fields, a heavy
// lesson without say_this or a light one with it, a question opening with a
// banned stem, a dash anywhere in the new words, a passport_stage that is
// not the one map's answer, a slide changed in anything but together_prompt,
// and, in the SQL, a live row that is neither what production held when the
// files were read nor already what this writes.
//
// THE ROWS AS PRODUCTION HELD THEM come from origin/main's content/modules,
// which is hash proved equal to the live rows (scripts/module-string-hash),
// so the guard in the SQL is the string that was actually there.
//
// Usage: node scripts/gen-373.mjs           preview only, writes nothing
//        node scripts/gen-373.mjs --write   writes the migration
//        BASE_REF=<ref> to read the old rows from somewhere else

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(import.meta.dirname, '..')
const WRITE = process.argv.includes('--write')
const NAME = '373_the_home_code_records_coverage'
const BASE = process.env.BASE_REF || 'origin/main'
const DIR = path.join(ROOT, 'content/modules')

const HEAVY = new Set(['ks3-14-bodies-image-pressure', 'ks3-27-when-it-turns-on-you', 'ks4-16-consent-images-law', 'ks4-17-sextortion', 'ks4-18-radicalisation-misogyny', 'ks4-29-did-not-go-looking'])
const TEACH_STEM = /^(Can you teach me|Explain to me|What would you tell a friend)/
const BANNED_STEM = /^(Which app|What did you|Did you)/i
const DASH = /[–—]|(^|\s)-(\s|$)/

// The one stage map, read as text from shared/stage-map.ts.
const mapSrc = fs.readFileSync(path.join(ROOT, 'shared/stage-map.ts'), 'utf8')
const mapLine = mapSrc.match(/^export const STAGE_OF_KEY_STAGE[^=]*= \{([^}]+)\}/m)?.[1]
if (!mapLine) throw new Error('shared/stage-map.ts: STAGE_OF_KEY_STAGE not found on one line')
const STAGE_OF_KS = Object.fromEntries([...mapLine.matchAll(/(\w+): '(\w+)'/g)].map(m => [m[1], m[2]]))

const lit = s => `'${String(s).replace(/'/g, "''")}'`
const old = f => JSON.parse(execFileSync('git', ['show', `${BASE}:content/modules/${f}`], { cwd: ROOT, encoding: 'utf8' }))
const noDash = (id, k, v) => { if (typeof v === 'string' && DASH.test(v)) throw new Error(`${id}: ${k} carries a dash`) }

const rows = []
const lines = []
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort()) {
  const now = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'))
  const was = old(f)
  const id = now.module_id
  if (was.module_id !== id) throw new Error(`${f}: module id moved`)
  const n = now.parent_note, w = was.parent_note
  for (const k of ['headline', 'taught', 'try_this', 'family_question', 'listen_for', 'then_ask', 'passport']) {
    if (typeof n[k] !== 'string' || !n[k].trim()) throw new Error(`${id}: parent_note.${k} missing`)
    noDash(id, k, n[k])
  }
  if (n.say_this) noDash(id, 'say_this', n.say_this)
  if (HEAVY.has(id) !== (typeof n.say_this === 'string' && n.say_this.trim().length > 0)) throw new Error(`${id}: say_this disagrees with the heavy list`)
  if (BANNED_STEM.test(n.family_question)) throw new Error(`${id}: the question opens with a banned stem`)
  if (!HEAVY.has(id) && !TEACH_STEM.test(n.family_question)) throw new Error(`${id}: the question does not teach`)
  if (!/\byou\b/i.test(n.listen_for)) throw new Error(`${id}: listen_for is not in the second person`)
  if (n.listen_for === w.taught || w.taught.includes(n.listen_for)) throw new Error(`${id}: listen_for is trimmed from taught`)
  if (!/\?\s*$/.test(n.then_ask)) throw new Error(`${id}: then_ask is not a question`)
  for (const k of ['headline', 'taught', 'try_this', 'no_login_required']) {
    if (JSON.stringify(n[k]) !== JSON.stringify(w[k])) throw new Error(`${id}: parent_note.${k} changed, which this migration does not carry`)
  }
  const ps = now.teacher_notes.passport_stage
  if (ps !== STAGE_OF_KS[now.key_stage]) throw new Error(`${id}: passport_stage ${ps} is not the map's ${STAGE_OF_KS[now.key_stage]}`)
  const tnNow = { ...now.teacher_notes }, tnWas = { ...was.teacher_notes }
  delete tnNow.passport_stage; delete tnWas.passport_stage
  if (JSON.stringify(tnNow) !== JSON.stringify(tnWas)) throw new Error(`${id}: teacher_notes changed beyond passport_stage`)

  // Slides: identical except together_prompt, and only on decks that gained lines.
  if (now.slides.length !== was.slides.length) throw new Error(`${id}: slide count moved`)
  const deckLines = []
  now.slides.forEach((s, i) => {
    const a = { ...s }, b = { ...was.slides[i] }
    const line = a.together_prompt
    delete a.together_prompt; delete b.together_prompt
    if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${id}: slide ${i} changed beyond together_prompt`)
    if (was.slides[i].together_prompt !== undefined) throw new Error(`${id}: slide ${i} already carried a line on ${BASE}`)
    if (typeof line === 'string') { noDash(id, `slide ${i}`, line); deckLines.push({ idx: i, type: s.type, line }) }
  })
  for (const l of deckLines) lines.push({ id, ...l })
  for (const k of Object.keys(now)) {
    if (['parent_note', 'teacher_notes', 'slides'].includes(k)) continue
    if (JSON.stringify(now[k]) !== JSON.stringify(was[k])) throw new Error(`${id}: ${k} changed, which this migration does not carry`)
  }
  rows.push({ id, wasQ: w.family_question, wasPs: was.teacher_notes.passport_stage, note: n, ps, nSlides: now.slides.length, lineCount: deckLines.length })
}
if (rows.length !== 34) throw new Error(`expected 34 scheme modules, found ${rows.length}`)
const moved = rows.filter(r => r.wasPs !== r.ps)
const ids = rows.map(r => lit(r.id)).join(', ')

const sql = `-- Guided Childhood, Migration 373
-- THE HOME CODE RECORDS COVERAGE, AND THE CONTENT THE LOOP READS.
--
-- Plans: plans/2026-10-08-lessons-hub-plan.md (version 10, PR 2) and
-- plans/2026-10-09-curriculum-sync-plan.md (items B, D, G3 and G5). Justin
-- decided on 9 October 2026: a class lesson's home code records "met in
-- class", and only the child's own check at home ticks the passport.
--
-- ── 1. lesson_coverage ─────────────────────────────────────────────────────
-- A class lesson met, per child: the parent's own rows, no school, class or
-- pupil id ever crosses. The home code used to write a school_lesson
-- completion with passed: true, which the legacy credit rule counted as a
-- pass (lib/school/home-code.ts says what that broke). Coverage ticks
-- nothing and pays nothing until PR 5's child only check questions exist.
-- source: home_code today; child_said arrives with PR 5's "We did this at
-- school" chip.
--
-- ── 2. children.lessons_together ───────────────────────────────────────────
-- "Does lessons with me" (sync plan G3): the parent can set it for any
-- child, which plays the together deck with a read aloud button and counts a
-- pass on every check question answered. Under 7 it is the audience by age
-- and needs no column.
--
-- ── 3. The parent notes, all 34 ───────────────────────────────────────────
-- family_question rewritten to teach ("Can you teach me", "Explain to me"),
-- listen_for (the idea in one sentence, second person) and then_ask (one
-- question in the parent's own life) under it, say_this on the six lessons
-- a parent hears about first (ks3-14, ks3-27, ks4-16, ks4-17, ks4-18, ks4-29)
-- and a passport line that says the class met the lesson and the child's
-- own check fills the page. Nothing else in a note moves.
--
-- ── 4. teacher_notes.passport_stage, 18 rows ──────────────────────────────
-- Onto the one stage map (shared/stage-map.ts): KS3 fills Explorer, KS4
-- Shaper, KS5 Independent, as the child's own lessons have always counted
-- them. ${moved.map(r => `${r.id.split('-').slice(0, 2).join('-')} ${r.wasPs} to ${r.ps}`).join('; ')}.
--
-- ── 5. together_prompt on the first two Foundation decks ───────────────────
-- The grown up's line per slide the together deck shows (plan v10, 2.2):
-- ${lines.length} lines on ${[...new Set(lines.map(l => l.id))].join(' and ')}. A slide
-- gains one key and nothing else: no option count, no minute, no word of the
-- classroom deck moves, and the classroom renderer ignores the key.
--
-- GUARDED before anything is written: every row must hold the exact
-- question and page read from production (origin/main's content/modules,
-- hash proved equal), or already what this writes (a rerun); every deck
-- gaining lines must have the slide count and slide types the lines name.
-- PROVED before commit: every column of every row equals its start except
-- the three this touches; teacher_notes beyond passport_stage is untouched;
-- every slide beyond together_prompt is untouched; and every row holds
-- exactly the note, page and lines content/modules holds. Idempotent, and
-- backed up first.
--
-- Generated from content/modules by scripts/gen-373.mjs, never by hand.

begin;

-- 1. Coverage.
create table if not exists public.lesson_coverage (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  child_id    uuid        not null references public.children(id) on delete cascade,
  module_id   text        not null,
  source      text        not null check (source in ('home_code', 'child_said')),
  covered_on  date        not null default current_date,
  created_at  timestamptz not null default now(),
  unique (child_id, module_id, source)
);
create index if not exists lesson_coverage_child_idx on public.lesson_coverage (child_id);
alter table public.lesson_coverage enable row level security;
drop policy if exists "Parents manage own lesson coverage" on public.lesson_coverage;
create policy "Parents manage own lesson coverage" on public.lesson_coverage
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke all on public.lesson_coverage from anon;
grant select, insert, update, delete on public.lesson_coverage to authenticated;
grant all on public.lesson_coverage to service_role;

-- 2. Does lessons with me.
alter table public.children add column if not exists lessons_together boolean not null default false;

-- 3, 4 and 5. The content.
create table if not exists schools.school_lessons_backup_373 as
  select module_id, parent_note, teacher_notes, slides, now() as backed_up_at
  from schools.school_lessons
  where module_id in (${ids});

alter table schools.school_lessons_backup_373 enable row level security;

create temp table before_373 on commit drop as select * from schools.school_lessons;

create temp table notes_373 (module_id text primary key, was_q text not null, was_ps text not null, note jsonb not null, ps text not null, n_slides int not null, n_lines int not null) on commit drop;
insert into notes_373 (module_id, was_q, was_ps, note, ps, n_slides, n_lines) values
${rows.map(r => `  (${lit(r.id)}, ${lit(r.wasQ)}, ${lit(r.wasPs)}, ${lit(JSON.stringify(r.note))}::jsonb, ${lit(r.ps)}, ${r.nSlides}, ${r.lineCount})`).join(',\n')};

create temp table lines_373 (module_id text not null, idx int not null, slide_type text not null, line text not null, primary key (module_id, idx)) on commit drop;
insert into lines_373 (module_id, idx, slide_type, line) values
${lines.map(l => `  (${lit(l.id)}, ${l.idx}, ${lit(l.type)}, ${lit(l.line)})`).join(',\n')};

do $$
declare bad text;
begin
  select string_agg(t.module_id, ', ') into bad
    from notes_373 t
    left join schools.school_lessons l using (module_id)
   where l.module_id is null
      or ((l.parent_note ->> 'family_question') is distinct from t.was_q and l.parent_note is distinct from t.note)
      or ((l.teacher_notes ->> 'passport_stage') is distinct from t.was_ps and (l.teacher_notes ->> 'passport_stage') is distinct from t.ps)
      or jsonb_array_length(l.slides) <> t.n_slides;
  if bad is not null then raise exception '373: not the rows the files were read from, in %', bad; end if;

  select string_agg(x.module_id || ' slide ' || x.idx, ', ') into bad
    from lines_373 x
    join schools.school_lessons l using (module_id)
   where (l.slides -> x.idx ->> 'type') is distinct from x.slide_type;
  if bad is not null then raise exception '373: a slide is not the type its line was written for: %', bad; end if;
end $$;

update schools.school_lessons l
   set parent_note = t.note,
       teacher_notes = jsonb_set(l.teacher_notes, '{passport_stage}', to_jsonb(t.ps))
  from notes_373 t
 where l.module_id = t.module_id;

update schools.school_lessons l
   set slides = (
     select jsonb_agg(case when x.line is null then e.s else e.s || jsonb_build_object('together_prompt', x.line) end order by e.i)
       from jsonb_array_elements(l.slides) with ordinality as e(s, i)
       left join lines_373 x on x.module_id = l.module_id and x.idx = e.i - 1
   )
 where l.module_id in (select distinct module_id from lines_373);

do $$
declare bad text; n int;
begin
  if (select count(*) from schools.school_lessons) <> (select count(*) from before_373)
     or exists (select module_id from before_373 except select module_id from schools.school_lessons) then
    raise exception '373: the set of lessons changed';
  end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join before_373 b using (module_id)
    left join notes_373 t using (module_id)
   where (to_jsonb(l) - 'parent_note' - 'teacher_notes' - 'slides') is distinct from (to_jsonb(b) - 'parent_note' - 'teacher_notes' - 'slides')
      or (l.teacher_notes - 'passport_stage') is distinct from (b.teacher_notes - 'passport_stage')
      or (l.teacher_notes ->> 'passport_stage') is distinct from coalesce(t.ps, b.teacher_notes ->> 'passport_stage')
      or l.parent_note is distinct from coalesce(t.note, b.parent_note);
  if bad is not null then raise exception '373: changed beyond the note and the page: %', bad; end if;

  -- Slides: byte equal where no lines were written; equal beyond
  -- together_prompt where they were, and every line in its place.
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join before_373 b using (module_id)
   where l.module_id not in (select module_id from lines_373)
     and l.slides is distinct from b.slides;
  if bad is not null then raise exception '373: slides moved on a deck that gained no lines: %', bad; end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join before_373 b using (module_id)
    join notes_373 t using (module_id)
   where l.module_id in (select module_id from lines_373)
     and ((select jsonb_agg(s - 'together_prompt' order by i) from jsonb_array_elements(l.slides) with ordinality as e(s, i))
          is distinct from
          (select jsonb_agg(s - 'together_prompt' order by i) from jsonb_array_elements(b.slides) with ordinality as e(s, i))
       or (select count(*) from jsonb_array_elements(l.slides) s where s ? 'together_prompt') <> t.n_lines);
  if bad is not null then raise exception '373: a deck changed beyond its lines: %', bad; end if;

  select string_agg(x.module_id || ' slide ' || x.idx, ', ') into bad
    from lines_373 x
    join schools.school_lessons l using (module_id)
   where (l.slides -> x.idx ->> 'together_prompt') is distinct from x.line;
  if bad is not null then raise exception '373: a line did not land: %', bad; end if;

  select count(*) into n from notes_373 t join schools.school_lessons l using (module_id)
   where (l.parent_note ->> 'listen_for') is null or (l.parent_note ->> 'then_ask') is null;
  if n <> 0 then raise exception '373: % rows still lack listen_for or then_ask', n; end if;
end $$;

commit;
`

const out = path.join(ROOT, 'supabase/migrations', `${NAME}.sql`)
if (WRITE) {
  fs.writeFileSync(out, sql)
  console.log(`wrote ${path.relative(ROOT, out)}: ${rows.length} notes, ${moved.length} pages moved, ${lines.length} together lines, ${Buffer.byteLength(sql)} bytes`)
} else {
  process.stdout.write(sql)
}
