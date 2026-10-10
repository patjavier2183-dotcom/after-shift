# 5:30 — YOUR WAY: estado técnico y ruta de lanzamiento
Fecha de corte: 2026-10-10. Rama exclusiva `five30-desarrollo`.
**NO EDITAR `main`, Railway AFTER SHIFT ni Supabase `heqjyafaxjzisddmgvob`.**

## Marca y aspecto
- Portada exacta aprobada por el usuario: `assets/five30-approved-cover.webp`, mostrada con hotspots accesibles en `five30-approved-cover.css/js`. No recrear, retocar ni sustituir la foto, arco y numerales.
- Frontend dev: https://five30-yourway.netlify.app/ (revisar publicación y pruebas en navegador, no verificada remotamente aún).
- Se actualizaron textos visibles a 5:30 en JS sin cambiar las referencias de cuenta de prueba `@aftershift` ni las claves internas. No confundir sustitución visual con migración de usuarios.
- En móvil hay que comprobar de forma manual que las zonas táctiles y la imagen de referencia resulten usables.

## Bases de datos
- Producción AFTER SHIFT, NO TOCAR: `heqjyafaxjzisddmgvob` con perfiles y publicaciones de prueba existentes.
- Desarrollo 5:30: `hldhehpyecdkngwvxcoz`. No tiene usuarios, contenidos ni pagos reales.
- Migrations dev: `five30_initial_creator_schema`, `restrict_signup_trigger_execution`, `five30_restore_private_vip_and_profile_guards`, `five30_server_only_payment_foundation`.
- `vip_posts` + `vip_assets`: creado en dev con RLS; los ficheros se guardan en bucket privado `vip-media` de 50 MB. Solo creador propietario puede leer su archivo VIP; visitantes ven metadatos.
- Perfil: guard contra autoascenso a admin y contra precio comercial editado desde navegador. Puede evolucionar `user -> creator`.
- Cuatro tablas privadas de preparación contable `five30_payment_orders`, `five30_payment_events`, `five30_paid_entitlements`, `five30_creator_payouts`; solo servidor, SIN webhooks ni credenciales ni otorgamiento automático de acceso. Las notas INFO del asesor de Supabase `RLS enabled no policy` son intencionales para tablas inaccesibles al cliente.
- **IMPORTANTE**: el resto de permisos V0 sobre `subscriptions` todavía permite suscripciones directas de prueba solo para creadores de precio 0; **cerrar ese mecanismo antes de habilitar cualquier pago real**.

## Estado comprobado por repositorio
- Cuentas, autenticación, perfiles, seguimiento, panel creador y publicaciones: código existe; requiere pruebas manuales completas en dev nuevo.
- Catálogo VIP privado: código V33 y migración nueva listos para pruebas; botones de compra VIP siguen siendo **simulación**, NO revelan archivos.
- Suscripción: simulador V23; NO cargo bancario ni renovación real. RPC del test de AFTER SHIFT NO replicada en dev.
- Monedas, regalos: simulador en memoria sin saldos persistentes. NO dinero real.
- Live: vista previa de cámara/escena demo. NO streaming a espectadores.
- Pricing: borradores en interfaz, **no** se consideran tarifa definitiva de servidor.
- Cambio visual a 5:30: aplicado a la rama de desarrollo; no implica migración de cuentas originales.

## Acuerdo comercial preliminar
- 80% creador / 20% plataforma sobre suscripción, a precisar impuestos, comisiones y retenciones.
- Comisiones de pasarela asumidas por 5:30 desde su parte del 20% solo si el contrato lo permite.
- Objetivo de liquidación semanal de fondos **efectivamente disponibles**; aún no hay proveedor que liquide ni verificación KYC.
- Plataforma de contenido general y contenido sexual explícito **exclusivamente de adultos**; exige acreditación edad/identidad y consentimiento de participantes, mecanismos de denuncia, moderación, derechos de autor y retiro, políticas, privacidad y asesoría legal antes de comercializar.

## Bloqueos externos para cobro
1. Confirmación **por escrito** del adquirente/procesador: Flow Chile exige preaprobación para sitio de suscripciones adultas y streaming. Solicitar también alcance de marketplace con múltiples creadores, streaming, monedas prepagas, reembolsos, reservas y payout. Fuente https://www.flow.cl/terminos.php. E-mail oficial: compliance-flow@flow.cl.
2. Alternativa CCBill: compatible con industria adulta, pero confirmar elegibilidad de comerciante radicado en Chile y transferencias a Chile: https://ccbill.com/industries/adult-business.
3. Forma jurídica y cuenta bancaria/tributaria **separadas de MOVE**; SpA unipersonal es intención, no entidad constituida.
4. Pasarela autorizada + claves **sandbox** cargadas como secretos en servidor, nunca front-end o GitHub.
5. Backend transaccional en Edge Function o Railway que valide precios servidor, identidad y pago contra proveedor, callback idempotente, vencimientos y revocaciones y emita permiso comprobable en RLS.
6. Política 18+, KYC de creadores y participantes, consentimiento, moderación, reportes, remociones, Terms/Privacy y condiciones de devolución. Revisar normativas según países destino.
7. Cobro/streaming/monedas en vivo deben liberarse por etapas; no es necesario prometer LIVE para lanzar una versión centrada en suscripciones.

## Pruebas obligatorias antes de lanzamiento
- Crear usuario A y B en 5:30 dev, validar confirmación de correo, login, recuperación contraseña, cierre y perfil público.
- Usuario A pasa a creador, sube avatar, portada, post público, post de suscriptor y VIP imagen/video. Ver si se resuelven permisos y medios.
- B sigue a A; sin suscripción no puede ver material privado por enlace directo. Usuario distinto de A no puede crear/modificar sus VIP.
- Operación demo sin dinero claramente rotulada; no dar por comprado VIP por clic ni liberar medios.
- Sandbox cuando exista pasarela: aprobado, rechazado, webhook duplicado/falso, renovación, cancelación, vencimiento, reembolso, disputa, cargo diferente al monto del servidor, compra por cuenta equivocada, moneda y términos.
- Verificar sitio en Android, escritorio y despliegue Netlify tras cada cambio. No afirmar que está publicado si no se comprobó.

## Prioridad
Primero preaprobación Flow/CCBill y QA de registros/perfiles/VIP. Después cobro recurrente real y reparto, con cierre de altas gratuitas. Monedas y LIVE **fase posterior**, solo con compliance y costos viables.
