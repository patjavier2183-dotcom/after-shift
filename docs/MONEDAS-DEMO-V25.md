# AFTER SHIFT — MONEDAS V25: laboratorio sin dinero real

Fecha 2026-10-09. **Prototipo visual y matemático; NO monedero ni pagos reales.**

## Alcance publicado
- Nuevo acceso «🪙 Monedas · prueba» en «Mi cuenta».
- Recarga ficticia de 50, 100 o 200 monedas con denominación ilustrativa de US$0,10 cada una.
- Tarifa hipotética explícita del 5% al recargar y comisión ilustrativa del 20% del valor usado. El comprador no es cobrado y el creador no recibe fondos.
- Gastos ficticios: regalos de LIVE (corazón, estrella, diamante, corona), propina y una compra individual de publicación DEMO.
- El botón de video DEMO no desbloquea ninguna foto, video o publicación real. No hay streaming real.
- Saldo y movimientos solo en variables de memoria del diálogo, se reinician al cerrarlo. No se guardan en localStorage, Supabase ni bases de datos.
- Disponible en español, inglés y portugués brasileño, con el selector de la app.

## Economía ilustrativa

100 monedas = US$10 de valor nominal. Tarifa de recarga 5% = US$0,50. **Total hipotético comprador US$10,50**.
Cuando el comprador usa 100 monedas:
- Creador: 80% de US$10 = US$8.
- Comisión AFTER SHIFT por gastos: 20% de US$10 = US$2.
- Tarifa de recarga AFTER SHIFT = US$0,50.
- Margen bruto conceptual plataforma US$2,50 antes de pasarela, costos de streaming, impuestos, reembolsos o saldos no usados.
- El reparto 80/20 se calcula sobre el valor de monedas consumidas, no sobre US$10,50 abonados; hay dos cargos distintos y divulgados.

Si el comprador deja saldo sin usar, no debe contabilizarse automáticamente como beneficio neto. El modelo puede tener implicancias de dinero electrónico, saldo prepago, derechos del consumidor y contabilidad según jurisdicción. **No activar sin asesoría jurídica y autorización contractual del PSP para contenidos adultos y billeteras/saldos prepagos**.

## Requisitos para producción (no implementados)

1. Pasarela de pago que autorice contenido adulto, plataformas multiparte y fondos de clientes / monedas, con políticas de devolución, contracargo y divisas.
2. Análisis legal en Chile y países objetivo de bienes digitales prepagos, bonos virtuales, reembolsos, transferibilidad y posible regulación de monederos; los saldos deben ser de uso cerrado y no retirables por usuarios si el proveedor lo permite.
3. Verificación segura de edad/identidad de creadores y participantes en contenidos, consentimiento verificable, moderación de transmisiones en vivo, reporte y eliminación.
4. Libro mayor **en servidor**, no en JS del navegador: débitos y créditos atómicos; concurrencia y doble gasto; webhook de pagos con idempotencia; reconciliación; reservas; expiraciones y reembolsos; trazabilidad de ingresos por creador y por compra; protección contra fraude.
5. Seguridad y privacidad, RLS para lecturas y APIs servidor con autorización; nunca usar un saldo basado en localStorage para conceder acceso ni revelar contenido privado.
6. Determinar claramente cuándo se reconoce el ingreso; no confundir saldo no gastado ni bruto cobrado con utilidad ganada.
7. Una política de denominación, visibilidad de tasas y moneda en todos los idiomas; evitar presentar monedas virtuales como inversión o dinero convertible.
8. Costeo de streaming real, moderación y regulación de contenidos antes de autorizar un LIVE.

## No modificar al introducir el demo
- La lógica de suscripciones y acceso de prueba @pat / @aftershift.
- RLS y buckets privados de Supabase.
- Creator Studio y publicaciones aprobadas en V22/V24.
- La identidad de marca, que sigue provisional.

**Siguiente validación manual:** iniciar sesión, abrir Mi cuenta → Monedas · prueba; recargar 100, regalar corazón 5, enviar propina 20 y comprar publicación demo 30; comprobar saldo 45 y resumen; cerrar y volver a abrir para confirmar saldo 0; repetir EN/PT; comprobar que no se abran publicaciones privadas.
