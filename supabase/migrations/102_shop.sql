-- Guided Childhood — Migration 102
-- The keepsake shop. Phase 1 of the merch plan in plans/merch-and-keepsakes-research.md.
--
-- Three tables and nothing clever: a catalogue, an order, and the lines on it.
--
-- The one rule that makes this ours rather than generic tat lives here as a
-- column: min_earned. A charm can only be bought once the child has actually
-- earned that Planet Friend in the app, so the merch stops being merch and
-- becomes proof. The gate is re checked server side at checkout, because a
-- number on a row a browser can read is a label, not a lock.
--
-- It is a count rather than a yes or no because the interesting cases are not
-- yes or no. The Cosmo charm wants all five Friends home, the set of six wants
-- the same, the bracelet wants at least one so it has something on it, and the
-- passport and stickers want nothing at all. One integer says all of that.
--
-- Prices live in the database, never in the client. The checkout route reads
-- price_pence from here and ignores whatever the basket claims, so a doctored
-- request buys nothing at the wrong price.
--
-- Only the two lines that need no toy safety testing ship active: the sticker
-- sheet (paper) and the personalised passport (a book). The charms, the
-- bracelet and the plush are seeded inactive so the shop can show them honestly
-- as coming soon, and Phase 2 is a flag flip rather than another migration.
--
-- Character art is NOT duplicated here. Rows carry character_key and the app
-- resolves the picture from lib/content/stage-characters, so re pointing the art
-- in one file still moves every surface including this one.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

create table if not exists public.products (
  key            text        primary key,
  name           text        not null,
  blurb          text        not null default '',
  price_pence    int         not null check (price_pence >= 0),
  kind           text        not null check (kind in ('passport', 'stickers', 'charm', 'charm_set', 'bracelet', 'plush')),
  character_key  text,
  min_earned     int         not null default 0 check (min_earned between 0 and 5),
  personalised   boolean     not null default false,
  image_url      text,
  sort           int         not null default 0,
  active         boolean     not null default false,
  created_at     timestamptz not null default now()
);

create index if not exists idx_products_active on public.products (active, sort);

create table if not exists public.orders (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  child_id          uuid        references public.children(id) on delete set null,
  status            text        not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled')),
  stripe_session_id text        unique,
  total_pence       int         not null default 0,
  currency          text        not null default 'gbp',
  email             text,
  shipping_json     jsonb,
  created_at        timestamptz not null default now(),
  paid_at           timestamptz,
  fulfilled_at      timestamptz
);

create index if not exists idx_orders_user    on public.orders (user_id, created_at desc);
create index if not exists idx_orders_status  on public.orders (status, created_at desc);

create table if not exists public.order_items (
  id               uuid        primary key default gen_random_uuid(),
  order_id         uuid        not null references public.orders(id) on delete cascade,
  product_key      text        not null references public.products(key),
  qty              int         not null default 1 check (qty between 1 and 20),
  unit_price_pence int         not null check (unit_price_pence >= 0),
  personalisation  jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items (order_id);

alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "products_read"      on public.products;
drop policy if exists "orders_own_read"    on public.orders;
drop policy if exists "order_items_own_read" on public.order_items;

-- The catalogue is public: it is a shop window. Inactive rows are readable too
-- so the coming soon lines can be shown honestly rather than hidden.
create policy "products_read" on public.products
  for select using (true);

-- An order is read only to the family it belongs to. Every write happens on the
-- server with the service key, after the price and the earned gate have been
-- re checked, so nothing a browser sends can create or alter an order.
create policy "orders_own_read" on public.orders
  for select using (auth.uid() = user_id);

create policy "order_items_own_read" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );

-- The catalogue. Upsert on key so re running this migration corrects a price or
-- a blurb rather than failing, and so Phase 2 can flip active in place.

insert into public.products (key, name, blurb, price_pence, kind, character_key, min_earned, personalised, sort, active) values
  ('passport_printed', 'The printed passport', 'A keepsake quality A6 booklet of their real digital passport. Their name on the cover, every stage they have actually stamped printed inside. Made to order, so no two are the same.', 1400, 'passport', null, 0, true, 10, true),
  ('sticker_sheet', 'Planet Friends sticker sheet', 'DiGi and all five Planet Friends, plus the five stage stamps, on one glossy sheet. For the fridge, the folder, the back of the bedroom door.', 400, 'stickers', null, 0, false, 20, true),
  ('charm_pebble', 'Pebble charm', 'Pebble as a chunky charm for shoes, a bag or a keyring. Earned in the app first.', 500, 'charm', 'pebble', 1, false, 30, false),
  ('charm_bloop', 'Bloop charm', 'Bloop as a chunky charm for shoes, a bag or a keyring. Earned in the app first.', 500, 'charm', 'bloop', 2, false, 31, false),
  ('charm_orbit', 'Orbit charm', 'Orbit as a chunky charm for shoes, a bag or a keyring. Earned in the app first.', 500, 'charm', 'orbit', 3, false, 32, false),
  ('charm_nova', 'Nova charm', 'Nova as a chunky charm for shoes, a bag or a keyring. Earned in the app first.', 500, 'charm', 'nova', 4, false, 33, false),
  ('charm_cosmo', 'Cosmo charm', 'Cosmo as a chunky charm for shoes, a bag or a keyring. Earned in the app first.', 500, 'charm', 'cosmo', 5, false, 34, false),
  ('charm_digi', 'DiGi charm', 'DiGi, the guide who is there from the very first day. No earning needed, DiGi is always with them.', 500, 'charm', 'digi', 0, false, 35, false),
  ('charm_set_six', 'The whole family, set of six', 'All five Planet Friends plus DiGi, boxed as a set, at a saving on buying them one at a time.', 2200, 'charm_set', null, 5, false, 40, false),
  ('charm_bracelet', 'The charm bracelet', 'The band, plus the Friends they have earned. Add the next one the day it comes home.', 1600, 'bracelet', null, 1, false, 50, false),
  ('plush_pebble', 'Pebble plush', 'Super soft, marshmallow round, embroidered face. Made in a campaign run, so it only happens when enough families want one.', 2800, 'plush', 'pebble', 1, false, 60, false)
on conflict (key) do update set
  name = excluded.name,
  blurb = excluded.blurb,
  price_pence = excluded.price_pence,
  kind = excluded.kind,
  character_key = excluded.character_key,
  min_earned = excluded.min_earned,
  personalised = excluded.personalised,
  sort = excluded.sort;
