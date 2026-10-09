-- AFTER SHIFT V0 | 2026-10-09 | Run manually in the EXISTING Supabase project.
-- NOT auto-applied by committing to GitHub. Review security-audit-v0.sql first.
-- FREE tests (creator price = 0) continue. No real payment support.
-- Creates restrictive security gates that apply even if permissive policies remain.
BEGIN;

DO $$
BEGIN
 IF to_regclass('public.profiles') IS NULL
    OR to_regclass('public.subscriptions') IS NULL
    OR to_regclass('public.posts') IS NULL
    OR to_regclass('public.post_content') IS NULL
    OR to_regclass('storage.objects') IS NULL
    OR NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id='post-media')
 THEN RAISE EXCEPTION 'AFTER SHIFT expected tables/bucket missing: transaction not applied';
 END IF;
END $$;

-- Bucket remains private; signing a URL requires a SELECT policy permitting access.
UPDATE storage.buckets SET public=false WHERE id='post-media';
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "v0 media authorized read" ON storage.objects;
CREATE POLICY "v0 media authorized read"
 ON storage.objects FOR SELECT TO authenticated
 USING (
   bucket_id='post-media' AND auth.uid() IS NOT NULL
   AND EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.creator_id::text=(storage.foldername(name))[1]
      AND p.id::text=split_part(storage.filename(name),'.',1)
      AND (
       p.creator_id=auth.uid() OR p.access='public'
       OR EXISTS (
        SELECT 1 FROM public.subscriptions s
        WHERE s.creator_id=p.creator_id AND s.subscriber_id=auth.uid() AND s.status='active'
       )
      )
   )
 );
DROP POLICY IF EXISTS "v0 media hard gate" ON storage.objects;
CREATE POLICY "v0 media hard gate"
 ON storage.objects AS RESTRICTIVE FOR SELECT TO public
 USING (
  bucket_id<>'post-media'
  OR (
   auth.uid() IS NOT NULL
   AND EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.creator_id::text=(storage.foldername(name))[1]
      AND p.id::text=split_part(storage.filename(name),'.',1)
      AND (
       p.creator_id=auth.uid() OR p.access='public'
       OR EXISTS (
        SELECT 1 FROM public.subscriptions s
        WHERE s.creator_id=p.creator_id AND s.subscriber_id=auth.uid() AND s.status='active'
       )
      )
   )
  )
 );

-- No authenticated client can create a paid entitlement, impersonate a subscriber,
-- reactivate a cancelled subscription, or delete someone else's subscription.
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "v0 subscriptions own read grant" ON public.subscriptions;
CREATE POLICY "v0 subscriptions own read grant"
 ON public.subscriptions FOR SELECT TO authenticated
 USING (subscriber_id=auth.uid());
DROP POLICY IF EXISTS "v0 subscriptions read hard gate" ON public.subscriptions;
CREATE POLICY "v0 subscriptions read hard gate"
 ON public.subscriptions AS RESTRICTIVE FOR SELECT TO public
 USING (subscriber_id=auth.uid());

DROP POLICY IF EXISTS "v0 free subscription grant" ON public.subscriptions;
CREATE POLICY "v0 free subscription grant"
 ON public.subscriptions FOR INSERT TO authenticated
 WITH CHECK (
  subscriber_id=auth.uid() AND status='active'
  AND EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.id=creator_id AND p.role='creator' AND p.subscription_price=0)
 );
DROP POLICY IF EXISTS "v0 subscription insert hard gate" ON public.subscriptions;
CREATE POLICY "v0 subscription insert hard gate"
 ON public.subscriptions AS RESTRICTIVE FOR INSERT TO public
 WITH CHECK (
  subscriber_id=auth.uid() AND status='active'
  AND EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.id=creator_id AND p.role='creator' AND p.subscription_price=0)
 );

DROP POLICY IF EXISTS "v0 own subscription cancellation" ON public.subscriptions;
CREATE POLICY "v0 own subscription cancellation"
 ON public.subscriptions FOR DELETE TO authenticated
 USING (subscriber_id=auth.uid());
DROP POLICY IF EXISTS "v0 subscription delete hard gate" ON public.subscriptions;
CREATE POLICY "v0 subscription delete hard gate"
 ON public.subscriptions AS RESTRICTIVE FOR DELETE TO public
 USING (subscriber_id=auth.uid());

DROP POLICY IF EXISTS "v0 subscription update hard gate" ON public.subscriptions;
CREATE POLICY "v0 subscription update hard gate"
 ON public.subscriptions AS RESTRICTIVE FOR UPDATE TO public
 USING (false) WITH CHECK (false);

-- Safeguard admin role and price at the database layer. Current user->creator
-- conversion stays allowed. Changing subscription price requires trusted backend.
CREATE OR REPLACE FUNCTION public.v0_guard_profile_write()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path=''
AS $guard$
BEGIN
 IF auth.role()='authenticated' THEN
  IF TG_OP='INSERT' THEN
   IF NEW.role IS DISTINCT FROM 'user'
      OR NEW.subscription_price IS DISTINCT FROM 0::numeric THEN
    RAISE EXCEPTION 'New account cannot grant role or price';
   END IF;
  ELSIF TG_OP='UPDATE' THEN
   IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Cannot change profile owner';
   END IF;
   IF NEW.subscription_price IS DISTINCT FROM OLD.subscription_price THEN
    RAISE EXCEPTION 'Changing price requires trusted backend';
   END IF;
   IF NEW.role IS DISTINCT FROM OLD.role
      AND NOT (OLD.role='user' AND NEW.role='creator') THEN
    RAISE EXCEPTION 'Unauthorized profile role change';
   END IF;
  END IF;
 END IF;
 RETURN NEW;
END;
$guard$;
DROP TRIGGER IF EXISTS v0_guard_profile_write ON public.profiles;
CREATE TRIGGER v0_guard_profile_write
 BEFORE INSERT OR UPDATE ON public.profiles
 FOR EACH ROW EXECUTE FUNCTION public.v0_guard_profile_write();
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Only an existing creator can insert a post.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "v0 creator publish hard gate" ON public.posts;
CREATE POLICY "v0 creator publish hard gate"
 ON public.posts AS RESTRICTIVE FOR INSERT TO public
 WITH CHECK (
  creator_id=auth.uid()
  AND EXISTS(SELECT 1 FROM public.profiles p
             WHERE p.id=creator_id AND p.role='creator')
 );

-- Private post text follows the same access restrictions as media files.
ALTER TABLE public.post_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "v0 creator reads own text" ON public.post_content;
CREATE POLICY "v0 creator reads own text"
 ON public.post_content FOR SELECT TO authenticated
 USING (EXISTS(SELECT 1 FROM public.posts p WHERE p.id=post_id AND p.creator_id=auth.uid()));
DROP POLICY IF EXISTS "v0 post content hard gate" ON public.post_content;
CREATE POLICY "v0 post content hard gate"
 ON public.post_content AS RESTRICTIVE FOR SELECT TO public
 USING (
  EXISTS (
   SELECT 1 FROM public.posts p
   WHERE p.id=post_id
   AND (
     p.creator_id=auth.uid() OR p.access='public'
     OR EXISTS (SELECT 1 FROM public.subscriptions s
                WHERE s.creator_id=p.creator_id AND s.subscriber_id=auth.uid()
                  AND s.status='active')
   )
  )
 );

COMMIT;

-- This migration deliberately does NOT delete previously active subscriptions.
-- Existing subscriptions to creators priced above zero MUST be audited before payments.
-- Existing signed URLs may remain valid until their short expiration (currently 5m).
