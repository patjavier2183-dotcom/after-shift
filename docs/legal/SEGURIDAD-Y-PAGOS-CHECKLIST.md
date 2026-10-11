# 5:30 — Seguridad, Privacidad y Pagos: implementación pendiente
**Inventario para ingeniería; marcar solo después de pruebas verificadas.** 10-10-2026.

## Ya existente, no equivale a producción segura
- Código de login, perfiles, publicaciones y suscripciones de prueba.
- Base original de AFTER SHIFT reutilizada por 5:30; no confundir rama Git con respaldo completo de base de datos.
- En entorno de desarrollo independiente se prepararon tablas de pagos de acceso solo servidor; NO se han migrado ni validado en la base original.
- Portada aprobada no debe modificarse.

## Bloqueantes antes de cobros
- [ ] Respaldo recuperable de producción (base, autenticación y medios), prueba de restauración.
- [ ] Inventario de RLS, buckets y permisos del backend ORIGINAL, y corregir cualquier acceso indebido.
- [ ] Cerrar toda activación de suscripciones desde cliente sin pago verificado; separar accesos de prueba.
- [ ] Obtener autorización escrita de procesador para adultos, marketplace, pagos recurrentes y payouts.
- [ ] Obtener claves sandbox y guardarlas en secretos de servidor; jamás en JS público o Git.
- [ ] Crear órdenes desde backend, con precios/moneda fijados por servidor.
- [ ] Validar firma y estado del webhook; idempotencia; no confiar en URL de éxito del navegador.
- [ ] Registrar eventos, conciliación, renovaciones, expiración, cancelación, devoluciones y contracargos.
- [ ] Dar/revocar acceso en servidor con RLS y caducidad, sin permitir escritura directa de entitlements desde cliente.
- [ ] Definir cálculo 80/20 neto/bruto, comisiones, impuestos, reservas y liquidaciones.
- [ ] Verificar edad e identidad de creadores, participantes y espectadores según el marco aplicable.
- [ ] Implementar reportes, moderación, retirada urgente y auditoría de decisiones.
- [ ] Publicar términos, privacidad y política de creadores revisados, con operador y contacto reales.
- [ ] Registrar aceptación de versiones de políticas; ofrecer canal para derechos de datos y reclamos.
- [ ] Revisión de seguridad, límites de carga, protección de secretos, logs y plan de incidentes.
- [ ] Probar pago exitoso/fallido, repetido, webhook falso, reversa, disputa y cuenta incorrecta en sandbox.

## Datos necesarios para cerrar borradores legales
Razón social o nombre legal, RUT, domicilio comercial, correo de soporte y privacidad, países objetivo, procesador aprobado, política de devolución y retención, cookies reales y contacto de moderación. Revisar con asesoría jurídica chilena y mercados de destino antes de publicar.

## Constitución
No es necesario constituir una sociedad para programar o probar sin cobrar. Para comercializar deben resolverse formalización tributaria, operador responsable, contratos y condiciones de pasarela. Evaluar SpA unipersonal separada de MOVE; no afirmar que sea obligación universal.
