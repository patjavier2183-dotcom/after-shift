# AFTER SHIFT — LIVE PREMIUM: modalidad única aprobada
Fecha: 2026-10-09 · Alcance: definición de producto (NO funcionalidad implementada)

## Decisión

**Solo habrá un tipo de LIVE en AFTER SHIFT: LIVE PREMIUM DE PAGO.** No desarrollar modalidades «LIVE gratuito» ni «LIVE incluido en la suscripción».

### Acceso a cada transmisión
- Para comprar una entrada se debe tener una **suscripción activa al creador del LIVE**.
- La suscripción mensual **no incluye acceso al LIVE**. Cada transmisión requiere **un pago adicional** por entrada, con precio fijado por el creador y comunicado antes del pago.
- Solo el suscriptor que haya pagado la entrada de esa transmisión tendrá acceso, sujeto a requisitos de edad, cumplimiento y autorización de acceso verificable en servidor.
- La entrada cubre exclusivamente ese LIVE. No cubre otras transmisiones, retransmisiones ni grabaciones, salvo que se informe una condición distinta al comprar.
- Debe constar en las condiciones de suscripción y en la pantalla previa de compra: **«Los LIVE no están incluidos en tu suscripción. Cada evento se paga por separado».**
- En inglés: «LIVE streams are not included in your subscription. Each event requires a separate ticket».
- En portugués brasileño: «As transmissões AO VIVO não estão incluídas na sua assinatura. Cada evento exige ingresso pago».
- No presentar un video como descargable: compra de entrada autoriza exclusivamente visualización en streaming dentro de AFTER SHIFT; respeta también `docs/REQUISITO-ANTIDESCARGAS.md`.

### Regalos opcionales en LIVE
- Después de comprar la entrada, espectadores pueden enviar corazones, estrellas, diamantes y otros regalos virtuales usando monedas prepagas **solo si el monedero real es autorizado e implementado**.
- Los regalos son adicionales y **voluntarios**, nunca un segundo requisito para entrar o continuar viendo el LIVE ya pagado.
- El creador recibe el porcentaje acordado y AFTER SHIFT la comisión establecida para la operación. Regalos y entradas generan líneas de transacción diferenciadas.
- Política vigente en negociación: reparto estándar ilustrativo 80% creador / 20% AFTER SHIFT antes de costos; eventuales tarifas de recarga deberán mostrarse por separado y ser compatibles con la ley y el proveedor.

### Ejemplo ilustrativo, no proyección
10 entradas por US$5 = US$50. Regalos por US$30. Bruto = US$80. Creador 80% = US$64; AFTER SHIFT 20% = US$16, **antes de pasarela, transmisión, impuestos, reembolsos y reservas**.

### Requisitos de implementación
1. Suscripción activa + entrada pagada válida **por el mismo usuario, creador y evento**.
2. El comprador no puede entrar si se revocó el acceso o expiró, con excepciones de reembolso sujetas a políticas claras.
3. Pagos confirmados exclusivamente por servidor y webhook; no monedas DEMO ni laboratorio V23.
4. Streaming privado de acceso temporal con protección razonable, moderación en tiempo real, verificación de mayoría de edad/identidad y consentimiento según legislación, reglas de seguridad y reporte.
5. Determinar coste operativo por hora y número de espectadores antes de aprobar precios mínimos.
6. Mensajería y precios localizados a ES/EN/PT; respetar la experiencia móvil y el diseño aprobado.
7. No ofrecer botones de descarga, enlaces directos permanentes ni copias descargables de transmisiones.
8. La UI debe mostrar claramente «Entrada de LIVE PREMIUM», precio fijado por creador, y el hecho de que la mensualidad no cubre la entrada.

## Situación actual
Solo está documentado este requisito. **No hay transmisiones LIVE reales ni venta real de entradas.** La billetera V25 solo simula monedas y regalos. No cambiar `app.js`, `payment-lab.js`, RLS ni los permisos de publicaciones existentes al registrar este acuerdo.
