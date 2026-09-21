#!/usr/bin/env node
// MIGRATION 322: THE PHOTO IS ON THE WALL WHILE THE FILM NAMES IT.
//
// Justin, watching the taster on a phone on 21 September 2026: "This animation
// timing is out as he says this photo and the photo has gone. He needs to hold
// up the photo as he says it."
//
// Slide 7 of ks3-12 is a twelve second film: Orbit holds a photo up and says
// "Detective question. This photo got two million shares. It is completely
// fake." The prop leaves Orbit's hands before the line lands. This is the
// second half of the hole migration 308 opened on 18 September, when Justin
// first said the clip pointed at a photo nobody had. 308 answered it by
// putting the Bloop moon post in the deck, on slide 8, immediately after the
// film. So the exhibit now exists, and it still is not on the wall at the
// moment the film names it.
//
// WHY NOT RE-RENDER. That beat was made on Seedance 2.5 on 11 September and
// cost 108 credits; the balance on 21 September is 8.54. And a generated clip
// cannot be directed to hold a prop up on a particular word, so a re-render
// could come back with the same fault and spend the credits anyway. Justin
// chose the fix that costs nothing and works today: put the exhibit on the
// film's own slide, so the reference lands whatever Orbit's hands are doing.
// The re-render stays open for when there are credits, and this is undone by
// deleting one key if it ever happens.
//
// WHAT CHANGES. Slide 7 gains a `post`, drawn under the film by the same
// ScenarioBlock the deck uses everywhere, carrying only what is looked at:
// the label, the handle, the meta, the text, the stats and the picture. The
// prompt and the teacher script stay on slide 8, which still runs the laugh
// and the question. Slide 8's script opens differently, because a teacher can
// no longer be told to present as new a post the class has been looking at
// for a minute. No slide is added or removed, no minute changes, and the
// timing string is untouched.
//
// Usage: node scripts/gen-322.mjs   writes supabase/migrations/322_the_photo_while_the_film_names_it.sql
//                                   and applies the same change to content/modules

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(import.meta.dirname, '..')
const ID = 'ks3-12-misinfo-deepfakes'
const FILE = path.join(ROOT, 'content/modules', `${ID}.json`)
const q = s => `'${String(s).replace(/'/g, "''")}'`

const m = JSON.parse(fs.readFileSync(FILE, 'utf8'))
const filmPos = m.slides.findIndex(s => s.type === 'video' && s.caption === 'Opening the case: real or made?')
const postPos = m.slides.findIndex(s => s.type === 'scenario' && s.handle === 'bloop.official')
if (filmPos < 0 || postPos < 0) { console.error('the film or the Bloop post is not where this expects it'); process.exit(1) }
if (m.slides[filmPos].post) { console.log('slide already carries the exhibit. Nothing to do.'); process.exit(0) }

const src = m.slides[postPos]
// Only what the class looks at. The prompt and the script run the discussion
// on slide 8 and must not be duplicated onto the film.
const post = {
  type: 'scenario',
  label: 'The photo from the clip',
  avatar: src.avatar,
  handle: src.handle,
  meta: src.meta,
  text: src.text,
  stats: src.stats,
  picture: src.picture,
  platform: src.platform,
}

const OLD_SCRIPT = m.slides[postPos].script
const NEW_SCRIPT = 'The class has had this on the wall since the clip, so do not present it as a reveal. Go straight at it: two million people shared this, and Bloop has never been to the moon, so why did it travel? Hold them on the answer, because almost nobody who shared it was fooled. They shared it because it was FUN. Write that word on the board, it is the engine for the whole hour. Then check one arriving early: look at the handle. It says official. Anyone can type the word official.'

if (/[‐-―]|(?<=[a-z]) - (?=[a-z])|(?<=[a-z])-(?=[a-z])/i.test(NEW_SCRIPT)) { console.error('the new script carries a dash'); process.exit(1) }

const name = '322_the_photo_while_the_film_names_it'
const sql = `-- 322: the photo is on the wall while the film names it
--
-- Justin, on a phone, 21 September 2026: "he says this photo and the photo has
-- gone. He needs to hold up the photo as he says it." Slide ${filmPos + 1} of ${ID}
-- is a twelve second film in which Orbit holds a photo up and says "This photo
-- got two million shares", and the prop leaves Orbit's hands before the line
-- lands. Migration 308 put the exhibit in the deck on slide ${postPos + 1}; this puts
-- it on the film's own slide so the reference lands. A re-render of the beat
-- costs about 108 credits against a balance of 8.54, and a generated clip
-- cannot be directed to hold a prop on a particular word, so this is the fix
-- that works today and is undone by deleting one key if a re-render lands.
--
-- Guarded on the exact current state of both slides. Any miss aborts the whole
-- migration and writes nothing.

begin;

create table schools.school_lessons_backup_322 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_322 enable row level security;

create temp table miss(module text, target text);

do $$
declare have_film jsonb; have_post jsonb;
begin
  select l.slides->${filmPos}, l.slides->${postPos} into have_film, have_post
  from schools.school_lessons l where l.module_id = ${q(ID)};

  if have_film is null or have_post is null then
    insert into miss values (${q(ID)}, 'the row or one of the two slides is missing'); return;
  end if;
  if have_film->>'type' is distinct from 'video' or have_film->>'caption' is distinct from ${q(m.slides[filmPos].caption)} then
    insert into miss values (${q(ID)}, 'slide ${filmPos + 1} is not the opening film'); return;
  end if;
  if have_film ? 'post' then
    insert into miss values (${q(ID)}, 'slide ${filmPos + 1} already carries an exhibit'); return;
  end if;
  if have_post->>'type' is distinct from 'scenario' or have_post->>'handle' is distinct from ${q(src.handle)}
     or have_post->>'text' is distinct from ${q(src.text)} or have_post->>'stats' is distinct from ${q(src.stats)}
     or have_post->'picture' is distinct from ${q(JSON.stringify(src.picture))}::jsonb then
    insert into miss values (${q(ID)}, 'slide ${postPos + 1} is not the Bloop post this expects'); return;
  end if;
  if have_post->>'script' is distinct from ${q(OLD_SCRIPT)} then
    insert into miss values (${q(ID)}, 'slide ${postPos + 1} does not carry the script this rewrites'); return;
  end if;

  update schools.school_lessons l
     set slides = jsonb_set(
           jsonb_set(l.slides, array['${filmPos}', 'post'], ${q(JSON.stringify(post))}::jsonb, true),
           array['${postPos}', 'script'], to_jsonb(${q(NEW_SCRIPT)}::text), false)
   where l.module_id = ${q(ID)};
end $$;

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- ── the proof: the film carries the exhibit, and it is the same post ──
do $$
declare film jsonb; post jsonb;
begin
  select l.slides->${filmPos}, l.slides->${postPos} into film, post
  from schools.school_lessons l where l.module_id = ${q(ID)};
  if not (film ? 'post') then raise exception '322: the film still carries no exhibit'; end if;
  if film->'post'->>'handle' is distinct from post->>'handle'
     or film->'post'->>'text' is distinct from post->>'text'
     or film->'post'->'picture' is distinct from post->'picture' then
    raise exception '322: the exhibit on the film is not the post on the next slide';
  end if;
  if film->'post' ? 'prompt' or film->'post' ? 'script' then
    raise exception '322: the exhibit carries a prompt or a script, which belong to the discussion slide';
  end if;
  if post->>'script' is distinct from ${q(NEW_SCRIPT)} then
    raise exception '322: the discussion script was not rewritten';
  end if;
end $$;

-- ── the proof: nothing else moved ──
do $$
declare n int; total int;
begin
  select jsonb_array_length(slides) into n from schools.school_lessons where module_id = ${q(ID)};
  if n is distinct from ${m.slides.length} then raise exception '322: slide count is % not ${m.slides.length}', n; end if;
  select sum((s->>'minutes')::int) into total
    from schools.school_lessons l, jsonb_array_elements(l.slides) s where l.module_id = ${q(ID)};
  if total is distinct from ${m.slides.reduce((a, s) => a + (Number(s.minutes) || 0), 0)} then
    raise exception '322: the lesson now runs % minutes, not ${m.slides.reduce((a, s) => a + (Number(s.minutes) || 0), 0)}', total;
  end if;
end $$;

HASH_BLOCK

commit;
`

// Apply the same change to the mirror, then compute the post state hash from it.
m.slides[filmPos].post = post
m.slides[postPos].script = NEW_SCRIPT
fs.writeFileSync(FILE, JSON.stringify(m, null, 2) + '\n')

const out = execFileSync('node', [path.join(ROOT, 'scripts/module-string-hash.mjs'), FILE], { encoding: 'utf8' })
const slides = out.match(/slides\s+(\d+)/)[1]
const strings = out.match(/strings\s+(\d+)/)[1]
const md5 = out.match(/md5\s+([0-9a-f]{32})/)[1]

const hashBlock = `-- ── the proof: the row equals the file in content/modules, string for string ──
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x where l.module_id = ${q(ID)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x where l.module_id = ${q(ID)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x where l.module_id = ${q(ID)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x where l.module_id = ${q(ID)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x where l.module_id = ${q(ID)} and jsonb_typeof(x) = 'string'
    union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x where l.module_id = ${q(ID)} and jsonb_typeof(x) = 'string'
    union all select module_id from schools.school_lessons where module_id = ${q(ID)}
    union all select title from schools.school_lessons where module_id = ${q(ID)}
    union all select key_stage from schools.school_lessons where module_id = ${q(ID)}
    union all select year_band from schools.school_lessons where module_id = ${q(ID)}
    union all select audience from schools.school_lessons where module_id = ${q(ID)}
    union all select evidence_anchor from schools.school_lessons where module_id = ${q(ID)}
    union all select single_action_outcome from schools.school_lessons where module_id = ${q(ID)}
    union all select character_cast from schools.school_lessons where module_id = ${q(ID)}
    union all select scaffold from schools.school_lessons where module_id = ${q(ID)}
    union all select unnest(statutory_hooks) from schools.school_lessons where module_id = ${q(ID)}
    union all select unnest(ailit_domains) from schools.school_lessons where module_id = ${q(ID)}
  ) t;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = ${q(ID)};
  if got_slides is distinct from ${slides} or got_n is distinct from ${strings} or got_hash is distinct from ${q(md5)} then
    raise exception '322: ${ID} is not the file (slides %, strings %, hash %)', got_slides, got_n, got_hash;
  end if;
end $$;`

// The replacement is a FUNCTION, not a string. A `$$` in a replacement string
// is String.replace's escape for one literal `$`, which silently turned every
// plpgsql dollar quote in this block into a single `$` and produced SQL that
// does not parse. Caught by reading the generated file before applying it.
fs.writeFileSync(path.join(ROOT, 'supabase/migrations', `${name}.sql`), sql.replace('HASH_BLOCK', () => hashBlock))
console.log(`supabase/migrations/${name}.sql written (${sql.length + hashBlock.length} chars)`)
console.log(`content/modules/${ID}.json: slide ${filmPos + 1} carries the exhibit, slide ${postPos + 1} has the rewritten script`)
console.log(`post state: ${slides} slides, ${strings} strings, md5 ${md5}`)
