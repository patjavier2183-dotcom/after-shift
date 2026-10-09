# AFTER SHIFT V32: contenido VIP individual para suscriptores · demo
Fecha 2026-10-09.

## Propósito
Sustituir el botón ambiguo «Publicación DEMO · 30 monedas» por «🔒 Contenido VIP · 30 monedas» y representar la regla comercial aprobada de AFTER SHIFT:
- Suscripción mensual a un creador para disfrutar el catálogo **incluido en su mensualidad**.
- Contenido VIP (video, foto o galería) **claramente separado**, con precio adicional en monedas, solo para suscriptores activos.
- LIVE PREMIUM: entrada adicional por evento para suscriptores, más regalos voluntarios.
- Compra de acceso para **ver dentro de AFTER SHIFT, sin ofrecer descarga**. Evitar promesas de imposibilidad absoluta de capturas de pantalla.

## Flujo V32 · sin backend
- En «Mi cuenta → Comprar monedas» se mantienen intactos los regalos valorizados y el saldo flexible V31.
- Se incluye una tarjeta **Contenido VIP · solo suscriptores**, con precio nominal demostrativo 30 monedas / US$3 y aviso «Solo para ver dentro de AFTER SHIFT · No descargable».
- **Simular suscripción activa** cambia solamente el estado en memoria de esta tarjeta. **No consulta el backend ni cambia la suscripción de la cuenta**. Si no se activa, intentar comprar VIP no gasta monedas y muestra la razón.
- Con suscripción ficticia y 30 monedas libres (ej. paquete de 50 que trae 30 monedas libres), el usuario puede simular la compra una única vez. Se descuentan 30 monedas libres (equivalentes a US$3), se asignan US$2,40/US$0,60 de manera ilustrativa y aparece **Adquirido en DEMO · no es acceso real**.
- La compra DEMO no abre fotos/videos, no modifica permisos de archivo ni la tabla de suscripciones. Reset/cierre descarta compras y simulación.
- Etiquetas traducidas ES/EN/PT.
- Regalos y monedas de V31, LIVE V28, Creator Studio, RLS y la autorización real de medios no fueron modificados.

## Pendiente antes de liberar ventas reales
- Un tipo de publicación VIP creada por el creador con precio en monedas y clara distinción de publicaciones incluidas vs VIP.
- Un sistema de inventario y pagos/registro transaccional persistente en servidor con RLS, autorización verdadera sobre **suscripción activa pagada al creador específico + compra de esa publicación**.
- Reproducción privada de contenido VIP con comprobación de permisos de servidor y sin botones de descarga, control de acceso al medio; capturas y extracción técnica no se previenen perfectamente solo con HTML.
- Pasarela que autorice contenido para adultos y moneda virtual; atención de saldos, reembolsos, identidad/edad y moderación.

## Pruebas
1. Comprar un paquete ficticio de 50: 30 monedas flexibles y 2 corazones+1 estrella; en tarjeta VIP, intentar sin simular suscripción: debe bloquearse sin descontar.
2. «Simular suscripción activa» y luego «Contenido VIP · 30 monedas»: descuentan 30 monedas libres y se muestra aviso, **sin acceder a archivos**.
3. Intentar segunda vez: botón deshabilitado; cerrar/reabrir restaura la DEMO.
4. Comprobar envío de corazones/regalos y cámara LIVE por separado.
