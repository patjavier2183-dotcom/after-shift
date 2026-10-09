-- WARNING: This is the initialization template, not a live database migration.
-- Use a reviewed migration for production. Never re-enable public access to post-media.
-- AFTER SHIFT V0
create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade,username text unique not null,display_name text not null,role text not null default 'user' check (role in ('user','creator','admin')),bio text default '',subscription_price numeric(10,2) default 0,created_at timestamptz not null default now());
create table if not exists public.follows (follower_id uuid not null references public.profiles(id) on delete cascade,creator_id uuid not null references public.profiles(id) on delete cascade,created_at timestamptz not null default now(),primary key (follower_id, creator_id),check (follower_id <> creator_id));
create table if not exists public.subscriptions (subscriber_id uuid not null references public.profiles(id) on delete cascade,creator_id uuid not null references public.profiles(id) on delete cascade,status text not null default 'active' check (status in ('active','cancelled')),created_at timestamptz not null default now(),primary key (subscriber_id, creator_id),check (subscriber_id <> creator_id));
create table if not exists public.posts (id uuid primary key default gen_random_uuid(),creator_id uuid not null,title text not null default '',preview text not null default '',access text not null default 'public' check (access in ('public','subscriber')),created_at timestamptz not null default now(),image_url text,media_type text not null default 'none',media_url text);
create table if not exists public.post_content (post_id uuid primary key references public.posts(id) on delete cascade,body text not null default '');
alter table public.profiles enable row level security; alter table public.follows enable row level security; alter table public.subscriptions enable row level security; alter table public.posts enable row level security; alter table public.post_content enable row level security;
create policy "profiles readable" on public.profiles for select using (true);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);
create policy "follows readable" on public.follows for select using (true);
create policy "follow own" on public.follows for insert with check (auth.uid() = follower_id);
create policy "unfollow own" on public.follows for delete using (auth.uid() = follower_id);
create policy "subscriptions own read" on public.subscriptions for select using (auth.uid() = subscriber_id);
-- Demo-only: clients may self-subscribe solely to creators whose price is ZERO.
-- Paid access must be granted by trusted server code after independently verified payment.
create policy "subscription own insert" on public.subscriptions for insert
to authenticated
with check (
  auth.uid() = subscriber_id
  and status = 'active'
  and exists (
    select 1 from public.profiles p
    where p.id = creator_id
      and p.subscription_price = 0
      and p.role = 'creator'
  )
);
-- No direct subscription status changes by clients: leave UPDATE without a policy.
drop policy if exists "subscription own delete" on public.subscriptions;
create policy "subscription own delete" on public.subscriptions for delete using (auth.uid() = subscriber_id);
create policy "posts readable" on public.posts for select using (true);
create policy "posts creator insert" on public.posts for insert with check (auth.uid() = creator_id);
drop policy if exists "posts creator delete" on public.posts;
create policy "posts creator delete" on public.posts for delete using (auth.uid() = creator_id);
create policy "post content visible" on public.post_content for select using (exists (select 1 from public.posts p where p.id = public.post_content.post_id and (p.access = 'public' or exists (select 1 from public.subscriptions s where s.subscriber_id = auth.uid() and s.creator_id = p.creator_id and s.status = 'active'))));
create policy "post content creator insert" on public.post_content for insert with check (exists (select 1 from public.posts p where p.id = public.post_content.post_id and p.creator_id = auth.uid()));
drop policy if exists "post content creator delete" on public.post_content;
create policy "post content creator delete" on public.post_content for delete using (exists (select 1 from public.posts p where p.id = public.post_content.post_id and p.creator_id = auth.uid()));
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, username, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))) on conflict (id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
-- Media storage for V0 testing
insert into storage.buckets (id,name,public) values ('post-media','post-media',false) on conflict (id) do update set public=false;
drop policy if exists "post media public read" on storage.objects;
drop policy if exists "post media protected read" on storage.objects;
create policy "post media protected read"
on storage.objects for select to authenticated
using (
 bucket_id='post-media'
 and exists (
  select 1 from public.posts p
  where p.creator_id::text=(storage.foldername(name))[1]
    and p.id::text=split_part(storage.filename(name),'.',1)
    and (
      p.creator_id=auth.uid()
      or p.access='public'
      or exists (
        select 1 from public.subscriptions s
        where s.creator_id=p.creator_id
          and s.subscriber_id=auth.uid()
          and s.status='active'
      )
    )
 )
);
drop policy if exists "post media creator upload" on storage.objects; create policy "post media creator upload" on storage.objects for insert to authenticated with check (bucket_id='post-media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "post media creator delete" on storage.objects; create policy "post media creator delete" on storage.objects for delete to authenticated using (bucket_id='post-media' and (storage.foldername(name))[1] = auth.uid()::text);


-- Creator profile images
alter table public.profiles add column if not exists avatar_url text default '';
alter table public.profiles add column if not exists cover_url text default '';
insert into storage.buckets (id,name,public) values ('creator-media','creator-media',true) on conflict (id) do update set public=true;
drop policy if exists "creator media public read" on storage.objects;
create policy "creator media public read" on storage.objects for select using (bucket_id='creator-media');
drop policy if exists "creator media upload" on storage.objects;
create policy "creator media upload" on storage.objects for insert to authenticated with check (bucket_id='creator-media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "creator media update" on storage.objects;
create policy "creator media update" on storage.objects for update to authenticated using (bucket_id='creator-media' and (storage.foldername(name))[1] = auth.uid()::text);
