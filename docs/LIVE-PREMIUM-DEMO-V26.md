# AFTER SHIFT V26 — LIVE PREMIUM de pago · simulador

**Fecha:** 2026-10-09. **El LIVE real aún NO existe.** Documento y código de prueba que preservan las funciones V22-V25.

## Implementado en V26
- En el perfil de cada **creador real** hay un bloque discreto «LIVE PREMIUM · PRUEBA» antes de publicaciones.
- El botón abre una ventana separada «Entrada y regalos», con textos ES/EN/PT y diseño adaptable al teléfono.
- Se comprueba desde la UI del perfil si el visitante tiene **suscripción activa**. El creador propietario puede inspeccionar el demo sin suscribirse. Cuentas no suscritas pueden accionar «Simular suscripción» **solamente dentro de la ventana** y sin realizar ninguna operación en Supabase. Esta excepción existe exclusivamente para probar, no para producción.
- La entrada de US$5 es ficticia y obligatoria para acceder a la **escena DEMO** (pantalla estática, no video real).
- Una vez simulada la entrada, se habilita recarga de monedas ficticias en el laboratorio: 50, 100, 200 monedas.
- Regalos de corazones, estrellas, diamantes y coronas, con operaciones de prueba y totales ilustrativos.
- 1 moneda = US$0,10; tarifa de recarga hipotética de 5%; reparto propuesto 80% creador / 20% plataforma sobre entrada y regalos gastados. Se informa por separado el valor de moneda sin gastar.
- El saldo del LIVE es independiente del «Monedas · prueba» V25 y **se elimina al cerrar**. Ninguno son monederos reales.
- No se activan permisos, pagos, suscripciones, contenidos ni transmisión. **No se toca ninguna base de datos.**
- Los regalos son voluntarios una vez que se ingresó a la escena DEMO, pero la entrada siempre es necesaria.

## Prueba paso a paso
1. Inicia sesión; abre el perfil de un creador real, por ejemplo @pat.
2. Pulsa «PROBAR LIVE PREMIUM».
3. Si no tienes una suscripción activa, pulsa «Simular suscripción (sin crearla)». No se crea ninguna.
4. Simula una entrada de US$5 y verifica que aparezca «ESCENA DEMO · NO ES UN LIVE REAL».
5. Recarga 100 monedas ficticias (total ficticio US$10,50); envía un corazón (5) y una estrella (10); saldo esperado **85 monedas**.
6. Comprueba el reparto de la entrada (US$4 creador / US$1 plataforma), regalos (US$1,20 creador / US$0,30 plataforma) y tarifa (US$0,50 plataforma). Total bruto creador **US$5,20**, plataforma **US$1,80**; US$8,50 nominal sin utilizar.
7. Cierra y vuelve a abrir: ticket no comprado, sin saldo. Cambia de idioma a inglés y portugués para revisar textos.
8. Confirma que ninguna acción da acceso real a publicaciones privadas.

## Restricciones para pasar a cobros reales
- Requiere **suscripción efectiva, entrada pagada verificada por servidor y autorización vinculada a usuario/creador/evento**, nunca un botón de simulación.
- Configurar precio por creador, fecha y hora reales de evento, notificaciones y caducidad.
- Validación de mayoría de edad y consentimiento, moderación de contenido en vivo, reportes, protección de datos y reglas de cumplimiento.
- Pasarela autorizada para contenido adulto, entrada a LIVE, regalo digital y balances/prepago; no activar «tarifas de monedas» reales sin investigación legal.
- Servicio de streaming con acceso privado, marcas de agua y protección razonable contra descarga o regrabación conforme a `docs/REQUISITO-ANTIDESCARGAS.md`.
- Mantener un ledger de dinero real en backend con idempotencia, conciliación y control de fraude.
- El costo de transmisión puede superar la comisión por evento; definir precios según capacidad y tráfico.

Los archivos `payment-lab.js`, `pricing.js`, `wallet-lab.js`, políticas RLS, credenciales y permisos existentes no se modifican en esta versión.
