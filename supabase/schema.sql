-- AFTER SHIFT V0
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  role text not null default 'user' check (role in ('user','creator','admin')),
  bio text default '',
  subscription_price numeric(10,2) default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, creator_id),
  check (follower_id <> creator_id)
);

create table if not exists public.subscriptions (
  subscriber_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active','cancelled')),
  created_at timestamptz not null default now(),
  primary key (subscriber_id, creator_id),
  check (subscriber_id <> creator_id)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null,
  body text not null default '',
  access text not null default 'public' check (access in ('public','subscriber')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.follows enable row level security;
alter table public.subscriptions enable row level security;
alter table public.posts enable row level security;

create policy "profiles readable" on public.profiles for select using (true);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create policy "follows readable" on public.follows for select using (true);
create policy "follow own" on public.follows for insert with check (auth.uid() = follower_id);
create policy "unfollow own" on public.follows for delete using (auth.uid() = follower_id);

create policy "subscriptions own read" on public.subscriptions for select using (auth.uid() = subscriber_id);
create policy "subscription own insert" on public.subscriptions for insert with check (auth.uid() = subscriber_id);
create policy "subscription own update" on public.subscriptions for update using (auth.uid() = subscriber_id);

create policy "posts visible" on public.posts
for select using (
  access = 'public'
  or exists (
    select 1 from public.subscriptions s
    where s.subscriber_id = auth.uid()
      and s.creator_id = public.posts.creator_id
      and s.status = 'active'
  )
);

create policy "posts creator insert" on public.posts
for insert with check (
  auth.uid() = creator_id
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
