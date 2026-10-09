-- AFTER SHIFT V0 · Revocación de la prueba @aftershift -> @pat
-- EJECUTAR SOLO EN Supabase SQL Editor, con permisos de administrador.
-- Elimina únicamente el permiso creado por la prueba anterior.
-- No elimina publicaciones ni cuentas; mantiene políticas de seguridad.
BEGIN;
DO $v0_revoke$
DECLARE
  v_creator uuid;
  v_subscriber uuid;
  v_count integer;
BEGIN
  SELECT id INTO v_creator FROM public.profiles WHERE username='pat';
  SELECT id INTO v_subscriber FROM public.profiles WHERE username='aftershift';
  IF v_creator IS NULL OR v_subscriber IS NULL THEN
    RAISE EXCEPTION 'No encontramos @pat y @aftershift; no se elimina ninguna suscripción.';
  END IF;

  IF to_regclass('public.v0_test_access_registry') IS NULL THEN
    RAISE EXCEPTION 'No existe el registro de la prueba. No eliminamos suscripciones que no fueron creadas por esta prueba.';
  END IF;
  IF NOT EXISTS(
    SELECT 1 FROM public.v0_test_access_registry
    WHERE creator_id=v_creator AND subscriber_id=v_subscriber
  ) THEN
    RAISE EXCEPTION 'No consta autorización de prueba entre las dos cuentas. No se elimina nada.';
  END IF;

  DELETE FROM public.subscriptions
    WHERE creator_id=v_creator AND subscriber_id=v_subscriber
    AND status='active';
  GET DIAGNOSTICS v_count=ROW_COUNT;
  IF v_count<>1 THEN
    RAISE EXCEPTION 'La suscripción no estaba activa. Revisa su estado antes de continuar.';
  END IF;
  DELETE FROM public.v0_test_access_registry
    WHERE creator_id=v_creator AND subscriber_id=v_subscriber;
  RAISE NOTICE 'Prueba revocada. @aftershift debe volver a ver candados.';
END $v0_revoke$;
COMMIT;

SELECT count(*) AS suscripciones_activas_de_la_prueba
FROM public.subscriptions s
JOIN public.profiles a ON a.id=s.subscriber_id
JOIN public.profiles p ON p.id=s.creator_id
WHERE a.username='aftershift' AND p.username='pat' AND s.status='active';
