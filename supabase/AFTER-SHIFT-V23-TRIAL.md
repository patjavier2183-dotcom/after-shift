# AFTER SHIFT V23 · Prueba de suscripción real sin cobros

Estado: código conectado al simulador exclusivamente para la cuenta autenticada `@aftershift` visitando `@pat`. Base de datos: migración `after_shift_v23_controlled_trial_rpc_and_expiry` ya aplicada al proyecto de pruebas.

- La aprobación del pago es **ficticia** y no verifica una transacción monetaria.
- Solo la pareja previamente registrada en `v0_test_access_registry` puede solicitar por RPC una autorización de prueba de dos horas. La función verifica identidad JWT, nombres de cuentas, precio activo cero y registro administrativo.
- Las altas desde los navegadores para otros usuarios permanecen cerradas (RLS).
- Una suscripción de prueba marcada activa desaparece para el usuario al pasar su `expires_at`: la política restrictiva de lectura usa una función segura que comprueba el tiempo del servidor. El pago ficticio de 1/3/6/12 meses no cambia la duración real de la prueba.
- `Simular vencimiento` llama al servidor para cancelar esta autorización. `Cancelar renovación` solo desactiva el ciclo ficticio; no cancela antes de tiempo el acceso actual.
- La página de perfil se actualiza al cerrar el laboratorio si cambió el acceso.
- Sin cobros, sin pasarela, sin permisos para terceros y sin cambios visuales de V22.

Prueba manual en móvil: entrar con `@aftershift`, buscar `@pat`, abrir `VER SUSCRIPCIÓN` > `PROBAR PAGOS (SIMULACIÓN)`, iniciar pago ficticio y aprobar. Cerrar laboratorio, abrir «Foto» y «Playa», y después cancelar desde `SUSCRITO ✓`. Repetir el mismo ciclo. Comprobar bloqueo final.

No confundir con producción: se debe reemplazar el mecanismo de prueba por un webhook de pasarela que compruebe los pagos reales en el servidor antes de comercializar suscripciones.
