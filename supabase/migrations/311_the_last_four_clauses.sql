-- THE LAST FOUR CLAUSES THAT FIT INSIDE AN EXISTING LESSON.
--
-- Third and last of the top up migrations. 309 did nine clauses at secondary,
-- 310 did nine at primary, this does the four that were left. Same rule
-- throughout: no slide added, no minute changed, every clause a sentence
-- inside an idea the lesson already teaches.
--
-- After this, two requirements are still PARTIAL and nine are still GAP. None
-- of them fits inside an existing lesson: violent and weapons content, peer
-- conflict escalating online, the age 13 minimum, why services are age
-- restricted, bullying and harassment and coercive control at secondary,
-- online gambling and its mental health harms, illegal supply, and content
-- promoting self harm or suicide. Those get four new modules, because a
-- statutory requirement that needs its own teaching moment should not be
-- smuggled into the end of somebody else's lesson.
--
-- Requirements closed here:
--   RSHE-S-OSA-12  how information and data is generated, collected and used
--   RSHE-S-OSA-13  websites sharing personal data for commercial purposes
--   RSHE-S-RR-12   the sexual ethics endorsed by incel and influencer cultures
--   RSHE-S-PS-6    the SIGNS of grooming, not only the risk

begin;

create table if not exists schools.school_lessons_backup_311 as
select * from schools.school_lessons;

create temp table miss (module text, target text) on commit drop;

-- Address the Nth slide of a type. Every module has exactly one recap, which
-- makes type a stabler handle than a heading a migration has to guess from
-- outside the deck. 310 learned that the hard way.
create or replace function schools.append_by_type(
  p_module text, p_type text, p_n int, p_field text, p_add text
) returns void language plpgsql as $$
declare pos int;
begin
  select ord - 1 into pos
  from (select ord, slide, row_number() over (order by ord) as rn
        from schools.school_lessons l,
             lateral jsonb_array_elements(l.slides) with ordinality as s(slide, ord)
        where l.module_id = p_module and s.slide->>'type' = p_type) t
  where rn = p_n;
  if pos is null then insert into miss values (p_module, p_type || ' #' || p_n); return; end if;
  update schools.school_lessons l
     set slides = jsonb_set(l.slides, array[pos::text, p_field],
           to_jsonb(coalesce(l.slides->pos->>p_field, '') || p_add))
   where l.module_id = p_module;
end $$;

-- ── ks4-15, where the data comes from and where it goes ──────────────────
-- RSHE-S-OSA-12 asks how information and data is generated, collected, shared
-- and used online. RSHE-S-OSA-13 asks that websites may share personal data
-- for commercial purposes, for example to enable targeted advertising. The
-- module teaches the attention business model in full and never opened the
-- machine: one slide in the whole scheme matched advertisers or sold to.
select schools.append_by_type(
  'ks4-15-manipulation-persuasion', 'recap', 1, 'body',
  ' Worth knowing where the fuel comes from, because it is you. Every scroll, pause, search and like is collected: not what you post, what you DO. That behaviour is packaged into a profile, and the profile is what is actually for sale. Advertisers do not buy your name, they buy the right to reach the kind of person you have been measured to be. It is why the advert feels like it read your mind, and why the free app was never free.');

-- ── ks4-18, the sexual ethics half of the pipeline ───────────────────────
-- RSHE-S-RR-12 asks pupils to discuss how sub cultures influence our
-- understanding of sexual ethics, including the norms endorsed by so called
-- involuntary celibates and online influencers. The module teaches the
-- recruitment mechanism, which is the harder and better half, and stopped
-- short of the content being sold.
select schools.append_by_type(
  'ks4-18-radicalisation-misogyny', 'recap', 1, 'body',
  ' And know what is actually being sold underneath the pipeline, because it is an idea about other people. These communities teach that attraction is a ranking, that women owe men something, and that anyone struggling has been cheated rather than is simply young. Every part of that is a claim about how people should be treated, and every part of it falls apart the moment it meets a real relationship, which is exactly why it is sold to people who do not have one yet.');

-- ── ks4-17, grooming as signs a pupil can notice ─────────────────────────
-- RSHE-S-PS-6 asks for the risks AND THE SIGNS that a pupil may be at risk of
-- grooming or exploitation. The module taught the sextortion script from the
-- outside, as a thing criminals run. From the inside it does not feel like a
-- script at all, it feels like being liked, and that is the part a pupil needs
-- to recognise in time.
select schools.append_by_type(
  'ks4-17-sextortion', 'recap', 1, 'body',
  ' Learn the shape from the inside too, because from the inside it never feels like a script. It feels like being noticed by someone who gets you. The signs are always the same four: it moves fast, it moves private, it flatters harder than anyone in your actual life, and at some point it asks you to keep it from everyone. Any one of those on its own is nothing. Three or four together is the shape, and the answer to the shape is to tell someone before it asks for anything.');

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not found: %', n, list; end if;
end $$;

drop function if exists schools.append_by_type(text, text, int, text, text);

commit;
