-- AFTER SHIFT | Bloquear nuevas suscripciones de prueba en la base de datos.
-- EJECUCIÓN MANUAL en Supabase SQL Editor. Guardar este archivo en GitHub NO lo ejecuta.
-- Se aplica SOLO después de la autorización del propietario de suspender el acceso gratis.
-- Cambios: (1) clientes no pueden insertar/actualizar suscripciones,
-- (2) se cancelan las suscripciones activas SIN PAGOS a creadores aún a US$0.
-- No se eliminan cuentas, publicaciones, archivos ni historiales de suscripción.
-- Las URLs firmadas ya emitidas pueden seguir activas hasta expirar (~5 minutos).
-- Cuando exista cobro real, el backend de pagos verificará y asignará el acceso
-- usando un rol de servidor autorizado; NO se reactiva INSERT desde el navegador.

BEGIN;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "after_shift_trial_insert_closed" ON public.subscriptions;
CREATE POLICY "after_shift_trial_insert_closed"
  ON public.subscriptions AS RESTRICTIVE
  FOR INSERT TO public
  WITH CHECK (false);

DROP POLICY IF EXISTS "after_shift_client_update_closed" ON public.subscriptions;
CREATE POLICY "after_shift_client_update_closed"
  ON public.subscriptions AS RESTRICTIVE
  FOR UPDATE TO public
  USING (false)
  WITH CHECK (false);

UPDATE public.subscriptions AS s
SET status = 'cancelled'
FROM public.profiles AS p
WHERE s.creator_id = p.id
  AND s.status = 'active'
  AND COALESCE(p.subscription_price, 0) = 0;

COMMIT;

-- Verificación tras ejecutar. Debe dar true, true y 0 en las tres primeras.
-- Si quedan suscripciones activas con precio > 0, revisar antes de abrir pagos.
SELECT
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscriptions'
      AND policyname = 'after_shift_trial_insert_closed'
      AND permissive = 'RESTRICTIVE'
      AND cmd = 'INSERT'
  ) AS bloquea_altas,
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscriptions'
      AND policyname = 'after_shift_client_update_closed'
      AND permissive = 'RESTRICTIVE'
      AND cmd = 'UPDATE'
  ) AS bloquea_reactivacion,
  (
    SELECT count(*) FROM public.subscriptions s
    JOIN public.profiles p ON p.id = s.creator_id
    WHERE s.status = 'active'
      AND COALESCE(p.subscription_price, 0) = 0
  ) AS pruebas_gratis_activas,
  (
    SELECT count(*) FROM public.subscriptions s
    JOIN public.profiles p ON p.id = s.creator_id
    WHERE s.status = 'active'
      AND COALESCE(p.subscription_price, 0) > 0
  ) AS otras_suscripciones_activas;
