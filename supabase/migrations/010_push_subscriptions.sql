-- Push notification subscriptions
create table if not exists push_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  endpoint      text not null unique,
  p256dh        text not null,
  auth          text not null,
  stage         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table push_subscriptions enable row level security;

create policy "Users manage own subscriptions"
  on push_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role can read all (for sending notifications)
create policy "Service role reads all"
  on push_subscriptions
  for select
  using (auth.role() = 'service_role');

create index on push_subscriptions(user_id);
