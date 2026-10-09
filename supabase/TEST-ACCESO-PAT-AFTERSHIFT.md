# AFTER SHIFT · Prueba real de las publicaciones de @pat

**Estado:** scripts preparados en GitHub; **NO ejecutados** en la base de Supabase.
**Diseño:** la versión 22 de la web se mantiene tal cual. No necesita actualizar la interfaz.
**Cobros reales:** ninguno. La simulación de pago sigue totalmente separada.

## Por qué el pago simulado no abrió los cuatro contenidos

El navegador solo desbloquea una galería ficticia. Los archivos cargados en Creator Studio están en Storage privado. La página comprueba si \`subscriptions\` tiene una fila \`active\` del suscriptor hacia el creador, y Supabase debe autorizar la lectura. No hay pago de producción.

## Orden seguro

1. Abrir el **proyecto Supabase utilizado por AFTER SHIFT** y entrar al SQL Editor. Antes de tocar datos, hacer copia de seguridad.
2. Ejecutar \`supabase/security-audit-v0.sql\` y comprobar qué protecciones ya existen.
3. Si falta alguna, revisar y ejecutar \`supabase/v0-access-hardening-20261009.sql\`. Volver a ejecutar la auditoría. Las cinco verificaciones de seguridad deben aparecer en \`true\`.
4. Ejecutar \`supabase/test-access-pat-aftershift-grant-v0.sql\` **como administrador**. Esta transacción aborta si faltan medidas de seguridad, si las cuentas no coinciden o si @pat tiene un precio activo distinto de cero.
5. Cerrar la sesión de @pat e ingresar como **@aftershift**. Buscar **@pat**, abrir su perfil y comprobar que aparecen las publicaciones cargadas (por ejemplo, Foto y Playa); reproducirlas. No introducir tarjetas ni realizar compras.
6. Al terminar ejecutar \`supabase/test-access-pat-aftershift-revoke-v0.sql\` como administrador, volver al perfil @pat desde @aftershift, actualizar la página, y comprobar que vuelven los candados.

La autorización administrativa de prueba no tiene un vencimiento automático. **Es obligatorio revocarla al terminar.** Los enlaces multimedia firmados que ya se generaron pueden continuar funcionando hasta cinco minutos; esperar ese plazo y volver a verificar el bloqueo.

## Seguridad

El script de autorización bloquea también las inserciones directas de suscripciones gratuitas por parte del navegador, sin afectar al acceso de quienes ya estaban autorizados. Registra la prueba en una tabla administrativa cerrada a los navegadores y solo el script de revocación puede distinguirla de otros permisos. No permite activar pagos ni cambia otros perfiles.

Si no tienes Supabase conectado a ChatGPT, se requiere ejecutar el SQL desde su panel. El código de GitHub por sí solo **no puede cambiar la base de datos**.

## Resultado esperado

- Cuenta @pat (creador): puede administrar sus publicaciones.
- Cuenta @aftershift antes del permiso: ve los candados y no obtiene URLs firmadas para archivos privados.
- Cuenta @aftershift después del permiso administrativo: ve y reproduce los cuatro archivos existentes, si siguen cargados correctamente.
- Cuenta @aftershift después de la revocación y la expiración de URLs anteriores: vuelve a ver los candados.

Las pruebas reales deben confirmar cada estado; una captura del simulador **no** demuestra que se haya autorizado Storage.
