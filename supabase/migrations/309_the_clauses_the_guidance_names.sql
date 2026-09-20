-- THE CLAUSES THE GUIDANCE NAMES AND THE LESSONS DID NOT SAY.
--
-- The coverage audit (GDC_SCHOOLS_2026_COMPLIANCE_AUDIT.md) checked all 732
-- production slides against the fifty seven digital and online requirements of
-- the July 2025 RSHE statutory guidance. Twenty four came back PARTIAL: the
-- topic was taught well and one named clause inside the requirement was never
-- said out loud.
--
-- This closes nine of them, at secondary, by extending sentences that are
-- already there. NO SLIDE IS ADDED AND NO MINUTE CHANGES, on purpose: a new
-- slide moves the teach phase total, which moves the cycle minutes, which
-- check-cycle-anchors then holds against the cycle map. Every clause here is a
-- sentence inside an idea the lesson already teaches, so a sentence is what it
-- gets. Where a clause genuinely needs its own teaching moment it is not in
-- this migration, it is in one of the four new modules.
--
-- Each update appends to the CURRENT value rather than replacing it, so the
-- lesson's own wording survives whatever it is, and each is guarded by the
-- slide's heading so a renumbered deck cannot be written to blindly.
--
-- Requirements closed here:
--   RSHE-S-OSA-5   images generated using AI, and over 18s without consent
--   RSHE-S-BS-6    what sexual harassment covers, including upskirting
--   RSHE-S-OSA-11  pornography's effect on behaviour towards partners
--   RSHE-S-RR-11   how it disempowers, and sexual entitlement
--   RSHE-S-WO-5    conspiracy theories
--   RSHE-S-OSA-3   fake accounts, and why people go further online
--   RSHE-S-OSA-1   the same expectations of behaviour in all contexts
--   RSHE-S-OSA-2   the difference between public and private online spaces
--   RSHE-S-WO-2    over reliance on relationships formed through social media

begin;

create table if not exists schools.school_lessons_backup_309 as
select * from schools.school_lessons;

-- A helper: append `add` to the text at `path` on the slide at `i`, but only
-- when the slide's heading is the one this migration was written against.
create or replace function schools.append_slide_text(
  p_module text, p_idx int, p_heading text, p_field text, p_add text
) returns boolean language plpgsql as $$
declare
  cur text;
begin
  select l.slides->(p_idx - 1)->>'heading' into cur
  from schools.school_lessons l where l.module_id = p_module;
  if cur is distinct from p_heading then
    raise notice 'SKIP %[%]: heading is %, expected %', p_module, p_idx, cur, p_heading;
    return false;
  end if;
  update schools.school_lessons l
     set slides = jsonb_set(
           l.slides, array[(p_idx - 1)::text, p_field],
           to_jsonb((l.slides->(p_idx - 1)->>p_field) || p_add))
   where l.module_id = p_module;
  return true;
end $$;

-- ── ks4-16, the two clauses the law slide never said ──────────────────────
-- RSHE-S-OSA-5 requires pupils to know the offence holds "even if the image
-- was created by the child and/or using AI generated imagery", and that
-- "sharing indecent images of people over 18 without consent is a crime".
-- KCSIE 2026 names the same point twice: para 165 conduct covers explicit
-- images "including those generated using AI", and its definitions section
-- covers images "wholly generated using artificial intelligence, including
-- what are sometimes described as deepfakes or deep nudes". The module taught
-- the law well and said neither.

select schools.append_slide_text(
  'ks4-16-consent-images-law', 11, 'Why it is written that bluntly', 'body',
  ' Past eighteen the rule changes shape rather than disappearing: sharing an intimate image of an adult without their consent is also a crime.');

select schools.append_slide_text(
  'ks4-16-consent-images-law', 11, 'Why it is written that bluntly', 'script',
  ' One more sentence before you move on, and say it plainly: the protection does not stop on someone''s eighteenth birthday, it changes shape. Sharing an intimate image of an adult without their consent is its own offence. Pupils often assume the whole subject expires at eighteen and it does not.');

-- The diagram gains a fourth thing the law covers. Three became four, so the
-- heading, the caption and the script all move with it rather than leaving a
-- slide that says three and shows four.
update schools.school_lessons
   set slides = jsonb_set(
         jsonb_set(
           jsonb_set(
             jsonb_set(slides, '{11,steps}',
               (slides->11->'steps') || jsonb_build_object(
                 'title', 'Generating',
                 'emoji', '🤖',
                 'text', 'Making one with an app. An image a computer generated, or edited onto someone under 18, is treated exactly like a photograph.')),
             '{11,heading}', to_jsonb('Four things the law covers'::text)),
           '{11,caption}', to_jsonb('All four are offences when the person in the image is under 18. There is no consent exception, no same age exception, and no exception for an image a computer made.'::text)),
         '{11,script}', to_jsonb((slides->11->>'script') ||
           ' The fourth one is the newest and the one adults get wrong too. An image generated or edited by an app is treated the same as a photograph, so a face pasted onto a body by an app is the same offence. Say that once, flatly, and do not dwell: the point is that the word real is not a defence.'::text))
 where module_id = 'ks4-16-consent-images-law'
   and slides->11->>'heading' = 'Three things the law covers';

-- RSHE-S-BS-6 asks pupils to know what sexual harassment covers: unsolicited
-- sexual language, attention or touching, taking or sharing intimate images
-- without consent, public sexual harassment, pressuring, and upskirting. The
-- module taught the image half in full and named none of the rest.
select schools.append_slide_text(
  'ks4-16-consent-images-law', 16, 'A threat is never your fault', 'body',
  ' Sharing an image without consent sits inside a bigger group of behaviours with a name: sexual harassment. It covers unwanted sexual messages or attention, pressuring someone into anything sexual, and taking a photo up someone''s clothing without them knowing, which is the offence called upskirting. None of it is banter and none of it is the fault of the person it happens to.');

select schools.append_slide_text(
  'ks4-16-consent-images-law', 16, 'A threat is never your fault', 'script',
  ' Read the second half at the same steady pace. You are naming a category, not starting a new topic: sharing without consent is one member of a family of behaviours, and the family has a name. Upskirting is worth saying out loud because it is a specific criminal offence and most classes have never heard it named by an adult. Do not invite examples.');

-- ── ks3-14, what pornography does rather than only what it is ─────────────
-- RSHE-S-OSA-11 and RSHE-S-RR-11 both go further than the module did. The
-- lesson taught that it is produced content and not a guide to real bodies,
-- which is the calm half. The guidance also requires the effect: that it can
-- change how people behave towards sexual partners, that it can portray
-- misogynistic attitudes, and that it can leave some people feeling entitled
-- to other people's bodies.
select schools.append_slide_text(
  'ks3-14-bodies-image-pressure', 15, 'What it is, and what it is not', 'body',
  ' There is one more thing worth knowing, because it is the part that reaches other people. Watching a lot of it can quietly change what someone expects of a partner, and a lot of it is made as though one person matters and the other is there to be used. That is where it does its damage: not in the watching, but in someone carrying that expectation into a real relationship, as though another person owes them something.');

select schools.append_slide_text(
  'ks3-14-bodies-image-pressure', 15, 'What it is, and what it is not', 'script',
  ' The added lines are the ones to deliver most steadily, because they are the reason this is in a relationships curriculum at all. The harm being named is an attitude travelling into a real relationship, not a private act. Keep it short, keep it factual, take no questions into detail, and move straight on to the check.');

-- ── ks3-12, the word the Hub was claiming and the lesson never said ───────
-- RSHE-S-WO-5 names conspiracy theories, and KCSIE 2026 para 165 lists them
-- under content alongside misinformation and disinformation. The Hub's KCSIE
-- table pointed a conspiracy theories row at this module. The word appeared
-- nowhere in it. That is the claim this closes.
select schools.append_slide_text(
  'ks3-12-misinfo-deepfakes', 10, 'Content can be manufactured', 'body',
  ' There is a third shape to know: a conspiracy theory, a story that explains something big by saying a group is hiding the truth. They spread because they feel like being let in on a secret, and because they are built so that any evidence against them counts as proof of the cover up. That last part is the tell. A claim that cannot be proved wrong by anything is not strong, it is unfalsifiable.');

select schools.append_slide_text(
  'ks3-12-misinfo-deepfakes', 10, 'Content can be manufactured', 'script',
  ' The conspiracy lines are new and they are the ones to slow down for. Land the tell rather than any example: a claim built so that counter evidence becomes more proof is the shape to recognise. Deliberately no worked example here, because naming a live theory in a classroom hands it an audience. If a pupil offers one, take the shape and not the topic: does anything count as evidence against it?');

-- RSHE-S-OSA-3 also requires that some social media accounts are fake, and
-- that people say things in more extreme ways online than they would face to
-- face. The module taught AI made content and not either of those.
select schools.append_slide_text(
  'ks3-12-misinfo-deepfakes', 10, 'Content can be manufactured', 'body',
  ' And it is not only the content that can be manufactured. Accounts can be too, run by someone who is nobody they claim to be, or by no person at all.');

-- ── ks3-11, the two secondary clauses about where you are standing ────────
-- RSHE-S-OSA-1: the same expectations of behaviour apply in all contexts,
-- including online. Taught in full at KS1 and KS2 and said once at secondary,
-- about images. RSHE-S-OSA-2 also requires the difference between public and
-- private online spaces. This module's group chat slide is exactly the place:
-- it already teaches that a 120 member chat is a public place in a private
-- costume, which IS the distinction, without ever using the words.
select schools.append_slide_text(
  'ks3-11-social-workarounds', 19, 'A group chat with strangers in it', 'body',
  ' That is the difference between a private space and a public one, and online the two look identical from the inside. A private space is one where you could name everyone. Everything else is public, whatever the app calls it. And what you say in either is held to the same standard as what you say out loud in a corridor: being behind a screen changes who can see you, never what is decent.');

select schools.append_slide_text(
  'ks3-11-social-workarounds', 19, 'A group chat with strangers in it', 'script',
  ' The added lines give the room two words worth having: private means you could name everyone, public is everything else. Then the standard, said once and not laboured, because this class has been hearing it since Year 1: the screen changes the audience, not the rules.');

-- ── ks3-10, the second half of what comparing does ────────────────────────
-- RSHE-S-WO-2 names over reliance on online relationships, including those
-- formed through social media. The module taught comparing against connecting
-- brilliantly and never asked what happens when the online version is the only
-- version. ks3-22 covers over reliance on an AI, which is a different thing.
select schools.append_slide_text(
  'ks3-10-mood-and-screens', 5, 'Researcher words for today', 'script',
  ' One extra thing to draw out while connecting is on the screen: connecting online is real connecting, and it is thinner than the in person kind. A friendship that only ever happens through a feed has no walking home, no sitting in silence, no being there when it is boring. Ask the room which of their connections would survive the app closing. That question is the whole point and it does not need a slide.');

drop function if exists schools.append_slide_text(text, int, text, text, text);

commit;
