-- AFTER SHIFT V0 · Prueba segura de acceso @aftershift -> @pat (SIN COBRO)
-- EJECUTAR SOLAMENTE COMO ADMINISTRADOR en Supabase SQL Editor, proyecto existente.
-- Paso previo: ejecutar/validar supabase/v0-access-hardening-20261009.sql
-- REQUIERE que la cuenta de @pat tenga precio ACTIVO US$0,00 (no el borrador).
-- Esta transacción NO es un pago ni se conecta al simulador del navegador.
-- IMPORTANTE: no expira automáticamente; ejecutar test-access-pat-aftershift-revoke-v0.sql
-- al terminar. Se admite únicamente un permiso de prueba trazable y explícito.
BEGIN;

DO $v0_grant$
DECLARE
  v_creator uuid;
  v_subscriber uuid;
  v_price numeric;
  v_role text;
  v_private_count integer;
  v_policy_count integer;
  v_bucket_public boolean;
BEGIN
  -- Fail closed unless all primary security controls were installed beforehand.
  SELECT count(*) INTO v_policy_count
    FROM pg_policies WHERE permissive='RESTRICTIVE' AND
     (schemaname,tablename,policyname) IN (
      ('storage','objects','v0 media hard gate'),
      ('public','post_content','v0 post content hard gate'),
      ('public','subscriptions','v0 subscription insert hard gate'),
      ('public','subscriptions','v0 subscription update hard gate')
     );
  IF v_policy_count <> 4 OR NOT EXISTS(
      SELECT 1 FROM pg_trigger
      WHERE tgname='v0_guard_profile_write' AND NOT tgisinternal
    ) THEN
    RAISE EXCEPTION 'Faltan controles de seguridad V0. Ejecuta y verifica la migración de acceso antes de conceder permisos.';
  END IF;

  SELECT public INTO v_bucket_public
    FROM storage.buckets WHERE id='post-media';
  IF v_bucket_public IS DISTINCT FROM false THEN
    RAISE EXCEPTION 'El bucket post-media debe existir y ser privado.';
  END IF;

  SELECT id,role,subscription_price INTO v_creator,v_role,v_price
    FROM public.profiles WHERE username='pat';
  SELECT id INTO v_subscriber
    FROM public.profiles WHERE username='aftershift';

  IF v_creator IS NULL OR v_subscriber IS NULL OR v_creator=v_subscriber THEN
    RAISE EXCEPTION 'No se encuentran las cuentas @pat y @aftershift como perfiles independientes.';
  END IF;
  IF v_role<>'creator' OR v_price IS DISTINCT FROM 0::numeric THEN
    RAISE EXCEPTION '@pat debe ser creador con precio activo de prueba US$0,00; no se habilitan permisos de pago.';
  END IF;
  SELECT count(*) INTO v_private_count FROM public.posts
    WHERE creator_id=v_creator AND access='subscriber';
  IF v_private_count=0 THEN
    RAISE EXCEPTION '@pat no tiene publicaciones exclusivas para esta prueba.';
  END IF;

  -- Block ALL client-side subscription creation, including free-priced creators.
  -- Future access must be granted by trusted backend or operator, NEVER fake checkout.
  DROP POLICY IF EXISTS "v0 subscription insert hard gate" ON public.subscriptions;
  CREATE POLICY "v0 subscription insert hard gate"
    ON public.subscriptions AS RESTRICTIVE FOR INSERT TO public
    WITH CHECK (false);

  -- A second protective gate makes direct browser inserts impossible even
  -- when another older permissive policy remains installed.
  DROP POLICY IF EXISTS "v0 no direct subscription inserts" ON public.subscriptions;
  CREATE POLICY "v0 no direct subscription inserts"
    ON public.subscriptions AS RESTRICTIVE FOR INSERT TO public
    WITH CHECK (false);

  IF EXISTS(
    SELECT 1 FROM public.subscriptions
    WHERE subscriber_id=v_subscriber AND creator_id=v_creator
  ) THEN
    RAISE EXCEPTION 'Ya existe una suscripción entre estas dos cuentas. No sobrescribimos permisos existentes.';
  END IF;

  CREATE TABLE IF NOT EXISTS public.v0_test_access_registry(
    subscriber_id uuid NOT NULL,
    creator_id uuid NOT NULL,
    granted_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(subscriber_id,creator_id)
  );
  ALTER TABLE public.v0_test_access_registry ENABLE ROW LEVEL SECURITY;
  REVOKE ALL ON TABLE public.v0_test_access_registry FROM PUBLIC, anon, authenticated;
  -- No RLS policies: browser cannot read/modify this administrative record.

  INSERT INTO public.subscriptions(subscriber_id,creator_id,status)
    VALUES(v_subscriber,v_creator,'active');
  INSERT INTO public.v0_test_access_registry(subscriber_id,creator_id)
    VALUES(v_subscriber,v_creator);

  RAISE NOTICE 'ACCESO DEMO CREADO: @aftershift -> @pat; % publicaciones exclusivas. Sin cobros.',v_private_count;
END $v0_grant$;
COMMIT;

-- Verificación: una fila "active" y numero de publicaciones visible.
SELECT
  s.status AS estado,
  subscriber.username AS suscriptor,
  creator.username AS creador,
  (SELECT count(*) FROM public.posts p
    WHERE p.creator_id=creator.id AND p.access='subscriber') AS publicaciones_exclusivas,
  (SELECT granted_at FROM public.v0_test_access_registry r
    WHERE r.subscriber_id=s.subscriber_id AND r.creator_id=s.creator_id) AS momento_autorizacion
FROM public.subscriptions s
JOIN public.profiles subscriber ON subscriber.id=s.subscriber_id
JOIN public.profiles creator ON creator.id=s.creator_id
WHERE subscriber.username='aftershift' AND creator.username='pat';
