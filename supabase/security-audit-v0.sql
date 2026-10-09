-- AFTER SHIFT | READ-ONLY audit. Execute in Supabase SQL Editor.
-- Database changes: NONE.
SELECT id,name,public,file_size_limit,allowed_mime_types
FROM storage.buckets WHERE id IN ('post-media','creator-media') ORDER BY id;

SELECT n.nspname AS schema_name,c.relname AS table_name,c.relrowsecurity AS rls_enabled
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE c.relkind='r'
 AND ((n.nspname='public' AND c.relname IN
      ('profiles','posts','post_content','subscriptions'))
      OR (n.nspname='storage' AND c.relname='objects'))
ORDER BY 1,2;

SELECT schemaname,tablename,policyname,permissive,roles,cmd,qual,with_check
FROM pg_policies
WHERE (schemaname='storage' AND tablename='objects')
   OR (schemaname='public' AND tablename IN
      ('profiles','posts','post_content','subscriptions'))
ORDER BY 1,2,6,3;

-- After the V0 migration, every column must be TRUE.
SELECT
 EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='storage'
  AND tablename='objects' AND policyname='v0 media hard gate'
  AND permissive='RESTRICTIVE') AS media_gate,
 EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public'
  AND tablename='subscriptions' AND policyname='v0 subscription insert hard gate'
  AND permissive='RESTRICTIVE') AS unpaid_access_gate,
 EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public'
  AND tablename='subscriptions' AND policyname='v0 subscription update hard gate'
  AND permissive='RESTRICTIVE') AS subscription_status_gate,
 EXISTS(SELECT 1 FROM pg_trigger WHERE tgname='v0_guard_profile_write'
  AND NOT tgisinternal) AS role_price_trigger,
 EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public'
  AND tablename='post_content' AND policyname='v0 post content hard gate'
  AND permissive='RESTRICTIVE') AS private_text_gate;

-- Review previous entitlements that have non-zero prices WITHOUT listing subscribers.
SELECT p.username AS creator_username,p.subscription_price,
 count(*) AS active_subscriptions_to_review
FROM public.subscriptions s JOIN public.profiles p ON p.id=s.creator_id
WHERE s.status='active' AND p.subscription_price>0
GROUP BY p.username,p.subscription_price
ORDER BY active_subscriptions_to_review DESC,p.username;
