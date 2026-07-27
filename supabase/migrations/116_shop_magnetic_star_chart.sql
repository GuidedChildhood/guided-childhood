-- Guided Childhood — Migration 116
-- The magnetic star chart, added to the keepsake shop.
--
-- The physical end of the star chart builder: the same chart a family types and
-- prints in the app, made as a proper magnetic board for the fridge, with gold
-- star magnets for every job done and the five Planet Friends as magnets to
-- earn and bring home. One star is five minutes, exactly like the app.
--
-- Seeded inactive, so it shows honestly as coming soon rather than on sale. The
-- stars and the Friends are small magnets, which is a toy in law and a real
-- swallowing risk, so the board goes through proper safety testing before we
-- sell one, the same rule the charms and the plush already follow. Turning it
-- on is a flag flip once the samples pass, not another migration.
--
-- Adds a new product kind, chart, to the check constraint. The catalogue type in
-- lib/shop/catalogue.ts is widened to match, and the shop card treats it like
-- the sets that show the whole family so the Planet Friends appear on it.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

alter table public.products drop constraint if exists products_kind_check;

alter table public.products
  add constraint products_kind_check
  check (kind in ('passport', 'stickers', 'charm', 'charm_set', 'bracelet', 'plush', 'chart'));

insert into public.products (key, name, blurb, price_pence, kind, character_key, min_earned, personalised, sort, active) values
  ('star_chart_magnetic', 'The magnetic star chart', 'The star chart made real. A magnetic board for the fridge, gold star magnets for every job done, and the five Planet Friends as magnets to earn and bring home. One star is five minutes, just like the app.', 1600, 'chart', null, 0, false, 25, false)
on conflict (key) do update set
  name = excluded.name,
  blurb = excluded.blurb,
  price_pence = excluded.price_pence,
  kind = excluded.kind,
  character_key = excluded.character_key,
  min_earned = excluded.min_earned,
  personalised = excluded.personalised,
  sort = excluded.sort;
