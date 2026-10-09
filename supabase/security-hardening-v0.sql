-- AFTER SHIFT / incremental security hardening for the EXISTING Supabase project
-- Not applied automatically by committing this file.
-- Safe for the current zero-dollar V0 subscriptions. A paid subscription must
-- be granted exclusively by trusted server code following payment verification.
-- Always inspect live policies before executing.
begin;

-- 1. Private original media: signed links require authenticated and authorized access.
update storage.buckets set public=false where id='post-media';
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

-- 2. Test-only self-subscription. A subscriber cannot self-issue a paid entitlement.
drop policy if exists "subscription own insert" on public.subscriptions;
drop policy if exists "subscription demo only insert" on public.subscriptions;
create policy "subscription demo only insert"
on public.subscriptions for insert to authenticated
with check (
  auth.uid()=subscriber_id
  and status='active'
  and exists (
    select 1 from public.profiles p
    where p.id=creator_id
      and p.role='creator'
      and p.subscription_price=0
  )
);
drop policy if exists "subscription own update" on public.subscriptions;

commit;

-- Diagnostic only. Check one row with public=false and absence of public-read policy.
select id,name,public from storage.buckets where id='post-media';
select schemaname,tablename,policyname,cmd,roles,qual,with_check
from pg_policies
where (schemaname='storage' and tablename='objects')
   or (schemaname='public' and tablename='subscriptions')
order by schemaname,tablename,policyname;
