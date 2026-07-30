-- One service a week, inside the weekly digest.
--
-- A family buys the whole thing and meets about a fifth of it. The passport,
-- the shop, the printables, the school curriculum view: all built, all sitting
-- behind a tab nobody opened. The digest already arrives every week and is
-- already read, so it carries one service at a time rather than a separate
-- email nobody asked for.
--
-- This table is the memory of what each parent has already been shown, so the
-- rotation moves forward and never repeats itself at them.

create table if not exists spotlight_shown (
  user_id uuid not null references auth.users(id) on delete cascade,
  spotlight_key text not null,
  shown_at timestamptz not null default now(),
  primary key (user_id, spotlight_key)
);

-- The only question ever asked of it: what has this parent already had.
create index if not exists spotlight_shown_user_idx on spotlight_shown (user_id);

comment on table spotlight_shown is
  'One row per parent per spotlight. The primary key is the rule: a parent never sees the same one twice.';

-- Nobody reads their own row. The digest runs as the service role and the
-- parent sees the result in an email, so RLS on with no policy is right.
alter table spotlight_shown enable row level security;
