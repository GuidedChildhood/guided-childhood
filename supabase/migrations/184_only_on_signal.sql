-- Guided Childhood — Migration 184
-- Some scripts are never a guess.
--
-- Justin, 11 August 2026, on his recommended card: a shaper family, on the free
-- plan, was being handed "They have told you they are gay, bi or trans" as their
-- recommended next script, while the same account's open concerns were morning
-- screen time, ending screen time and gaming.
--
-- ── How it happened ──────────────────────────────────────────────────────────
--
-- The free pool at that stage is FIVE scripts, and three of them are the
-- heaviest in the library: self harming, a low mood that will not lift, and a
-- child coming out. Two of the five had been used. The family's real signals
-- pointed at categories that hold no free script at all, so every survivor
-- scored zero, and the day rotation picked between the last two like a coin.
--
-- ── What this column is for ──────────────────────────────────────────────────
--
-- A script that ASSERTS something about a child, that they are self harming,
-- that they have come out, that they are being bullied, that somebody has died,
-- is not a suggestion. Put in front of a parent who has said nothing of the
-- kind, it is the app telling them something about their child, and no amount
-- of rotation makes that acceptable.
--
-- ── Why the bar is never, rather than "only with a signal" ───────────────────
--
-- The first version of this rule let a marked script through when its own
-- category was carrying a score. Run against the real account it was written
-- for, it let the coming out script straight back in: that family had an open
-- concern called "evening neediness", and both of them file under mood and
-- confidence.
--
-- Our signals are CATEGORIES, eight shelves wide, and every script marked here
-- is a specific event. No quantity of "mood and confidence" is evidence that a
-- child has come out, and no quantity of "staying safe" is evidence that a
-- child is being bullied. So these are never recommended at all.
--
-- Nothing else changes. Marked scripts stay in the library, in the category
-- browse, in search, and in Right Now, where the parent is the one describing
-- the situation. Every route that starts with the parent is untouched. The only
-- route closed is the one where we speak first.
--
-- If scripts ever carry the concern slugs they answer, rather than a category,
-- this can be relaxed to an exact match. Until then the honest bar is never.
--
-- ── What is marked, and what is deliberately not ─────────────────────────────
--
-- Marked: anything whose title states a thing has happened to this child.
-- Not marked: "Puberty and the mood swings" and "Vapes, alcohol and the first
-- offers". Both are universal at their stage and preventative in tone, and a
-- parent meeting either unprompted reads it as the app being useful early
-- rather than as the app having decided something.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

alter table public.scripts
  add column if not exists only_on_signal boolean not null default false;

comment on column public.scripts.only_on_signal is
  'True when this script asserts something about a child (self harm, coming out, bereavement, being bullied, image abuse). The recommender never offers it unprompted. Browsing, category filters, search and Right Now are unaffected.';

update public.scripts set only_on_signal = true where sort_order in (
  3111,  -- Being bullied at school
  3113,  -- Someone they love has died
  405,   -- Recognising grooming warning signs
  501,   -- They are being bullied online
  504,   -- They are the one doing the bullying
  507,   -- The bully is a friend in real life
  1402,  -- Their feed has started showing them self harm
  3205,  -- Someone has died
  311,   -- Sexting or pressure to share images
  410,   -- Revenge porn and image based abuse
  3300,  -- They are self harming
  3303   -- They have told you they are gay, bi or trans
);
