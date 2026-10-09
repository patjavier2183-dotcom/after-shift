# AFTER SHIFT — Plan de pagos reales V24
**Estado: preparación técnica, sin cobros habilitados.**
**Fecha:** 2026-10-09
**Sistema publicado estable:** AFTER SHIFT V23. No reemplazar ni reinterpretar el diseño aprobado de V22.
**No aplicado a producción:** este documento no cambia clientes, cuentas, importes ni permisos.

## Alcance comercial confirmado (2026-10-09)

AFTER SHIFT será una plataforma de creadores de contenido **general y contenido para adultos**, incluyendo fotografías, videos, material erótico y sexual explícito de adultos. Los accesos comerciales deberán limitarse a personas de 18 años o más y a contenidos legales y consentidos.

**No** se incorporarán materiales con menores, representaciones de abuso sexual infantil, sexualidad no consentida, explotación, tráfico sexual, contenidos íntimos sin consentimiento, falsificaciones sexuales no consentidas ni actividades ilegales. Requerimientos operativos antes de liberar: validación de edad/identidad de todos los participantes (no solo de la cuenta creadora), documentación de consentimiento, moderación y revisión de contenido, canal de denuncias, retiro expedito, política de derechos de autor, auditoría y cumplimiento legal local e internacional.

### Revisión de proveedores frente a este alcance

- **Flow Chile**: los términos en su ANEXO I (versión vigente del sitio consultado) clasifican las **suscripciones a sitios web de contenido adulto y streaming** dentro de actividades **restringidas sujetas a pre-aprobación**, no como rechazo automático de toda actividad adulta. Debemos enviar URL, contacto y descripción fiel del negocio a `compliance-flow@flow.cl`, confirmar aprobación **por escrito**, alcance marketplace/múltiples creadores y mecanismos de pagos a terceros. Flow puede aplicar costos especiales adicionales. **No activar ningún cobro antes del visto bueno.** Fuente: https://www.flow.cl/terminos.php
- **CCBill**: especialista en contenido adulto, fan sites y suscripciones. Falta confirmar por escrito aceptación de entidad domiciliada en Chile, abonos a una cuenta chilena, comisión, reservas y capacidad de pagar/repartir a múltiples creadores. Fuente: https://ccbill.com/industries/adult-business
- **Segpay**: acepta contenido adulto pero sus FAQ dicen aceptar **comerciantes radicados en EE. UU., Reino Unido y Europa**; no asumir incorporación comercial directa de Chile. Fuente: https://segpay.com/csfaq/
- **Visa**: exige proceso verificable de consentimiento y mayoría de edad de personas que aparezcan en contenido adulto y canal de reporte y respuesta. Fuente: https://corporate.visa.com/en/about-visa/visa-network-integrity.html

**Próximo hito, pendiente de aprobación externa**: enviar consulta de preaprobación a Flow y verificar CCBill como alternativa; no integrar credenciales productivas hasta recibir respuesta positiva y los términos del modelo marketplace.

## Modelo de ingresos y pagos a creadores acordado (2026-10-09)

**Decisión comercial preliminar aprobada por el usuario:**

- Cada suscripción cobrada se repartirá **80% para el creador** y **20% para AFTER SHIFT**, calculado inicialmente sobre el precio cobrado al suscriptor. Definir contractualmente los impuestos y ajustes aplicables antes de publicar precios finales.
- **AFTER SHIFT asume la comisión de procesamiento** de la pasarela con cargo a su participación del 20%, sujeto al precio y autorización comercial efectiva del proveedor. La tarifa pública ilustrativa de Flow **2,89% + IVA** no es una cotización aprobada para este negocio adulto, que podría recibir cargos o reservas distintos.
- **Liquidación semanal a los creadores** de ganancias **disponibles**: solo pagos efectivamente confirmados y fondos liberados por el proveedor, excluyendo montos en disputa, reembolsados, retenidos, impagos o pendientes de conciliación. No comprometer una fecha u hora específicas de pago sin definir el proveedor y plazos bancarios.
- El panel del creador deberá distinguir **ingresos generados, pendientes de liberación, disponibles para cobrar y ya transferidos**, así como descuentos o reservas y el detalle de cada liquidación.
- El reparto y la transferencia efectiva requieren verificar con la pasarela **si admite el modelo de marketplace y pago a múltiples creadores**, titulares legales y requisitos KYC/AML. No dar por hecho que AFTER SHIFT puede custodiar o distribuir fondos ajenos sin revisar las obligaciones aplicables.
- Los cobros, renovaciones y pagos semanales **aún no están activados**. La web publicada continúa con simulaciones de pago V23.

## Preguntas comerciales restantes, antes de programar un proveedor

1. Tipo de contenido: **resuelto**. Admitirá contenido general y sexual explícito de adultos, solo legal y consentido. Aún se requiere aprobación expresa del proveedor.
2. ¿AFTER SHIFT cobrará en nombre propio, o cada creador debe recibir su proporción automáticamente (marketplace, múltiples destinatarios)?
3. ¿Moneda del cobro: CLP, USD o ambas? En Creator Studio hoy hay precios locales de ejemplo en US$, no publicados ni validados por servidor.
4. Quién es el titular legal del comercio y a qué cuenta bancaria se abonará; condiciones de reembolsos, contracargos y cumplimiento KYC para creadores.
5. Comisión **80/20 acordada como propuesta inicial** y comisión de pasarela asumida por AFTER SHIFT; pendientes el tratamiento de IVA, impuestos, documentación tributaria, posibles contracargos y reservas.

## Proveedores candidatos verificados por documentación

### Flow (Chile)
- API documenta `subscriptions`, `plans`, `customer`, `merchant` y sandbox.
- Tarifa pública desde 2,89% + IVA con abono al tercer día hábil (ver vigencia al contratar).
- `merchantId` está reservado a comercio integrador. **No asumir** que una cuenta normal distribuye dinero automáticamente a creadores: requiere habilitación/contrato comercial.
- El anexo de actividades prohibidas/restringidas incluye mención al contenido adulto. Exigir autorización expresa para nuestro catálogo, sin asumir aceptación ni rechazo genérico.
- Fuentes: https://developers.flow.cl/api ; https://web.flow.cl/es-cl/tarifas/ ; https://www.flow.cl/terminos.php

### Mercado Pago Chile
- `/preapproval` y `/preapproval_plan` para suscripciones.
- `Split 1:1` marketplace está documentado para Chile con Checkout Pro/API, pero **no asumir que funciona junto con `preapproval`** sin confirmación oficial; los docs de Split solo indican Checkout Pro/API/Bricks.
- Cada vendedor requiere autorización OAuth y políticas KYC; validar el rubro concreto antes de implementar.
- Fuentes: https://www.mercadopago.cl/developers/es/docs/subscriptions/overview ; https://www.mercadopago.cl/developers/es/docs/split-payments/split-1-1/overview ; https://www.mercadopago.cl/developers/es/docs/split-payments/split-1-1/integration-configuration/create-configuration

## Arquitectura técnica obligatoria

```
Suscriptor autenticado
       |
       v
AFTER SHIFT web (precio visible y botón "Suscribirme")
       |  POST con JWT: creador y plan, SIN elegir importe arbitrario
       v
API segura Supabase Edge Function (o backend Railway)
       |  validar identidad, precio servidor, divisa y elegibilidad
       |  crear intento PENDIENTE con ID opaco, idempotencia
       v
Pasarela (sandbox -> producción solo tras aprobación comercial)
       |  página de pago hospedada por pasarela; credenciales SOLO servidor
       v
Notificación de pago -> backend con firma/token
       |  CONSULTA SERVER-TO-SERVER estado real a la pasarela
       |  coteja ID orden, monto, divisa, vendedor, estado, pago único
       v
Registro financiero + derecho de acceso con fecha de vencimiento
       |
       v
RLS de Supabase -> Storage privado -> URL firmada breve
```

Requisitos: nunca aceptar `paid=true` o `status=approved` mandados por navegador como prueba; no generar URLs privadas sin autorización RLS; validar webhook y contra-consultar pago. Retries idempotentes, transacciones atómicas, registro de eventos, reconciliación diaria, expiración automática.

### Entidades nuevas, solo diseño (NO crear todavía)

- `payment_orders`: UUID propio, subscriber_id, creator_id, plan_id, amount_minor (entero), currency, provider, external_order_id, status `pending/paid/failed/refunded/disputed`, timestamp de pago y vencimiento.
- `payment_events`: IDs únicos de proveedor, recibidos/validados/procesados, `UNIQUE(provider,event_id)`.
- `paid_entitlements`: subscriber_id, creator_id, paid_until, cancellation_at, provider_ref; permisos solo otorgados por servidor confiable tras pago confirmado.
- `creator_payouts`: participaciones, comisiones, comisión pasarela, balance, conciliación y transferencias.
- `creator_payment_accounts`: datos mínimos y referencias del procesador; **no guardar datos de tarjetas, tokens secretos en tablas públicas ni en JavaScript**.

Evitar usar directamente `subscriptions` como contabilidad; hoy es una tabla de permisos para V23 y tiene políticas restrictivas de prueba. Definir transición explícita que preserve el acceso a quienes pagaron y no mezcle el `v0_test_access_registry` con suscripciones de producción.

## Reglas del ciclo de vida

1. `pending`: candado puesto, aunque el usuario haya regresado del checkout.
2. `paid` verificado: `paid_until` definido desde la fecha de servicio, abrir archivos del creador autorizado.
3. Cancelar renovación: detener **futuros cargos**, mantener acceso hasta `paid_until`; no borrar permisos antes de tiempo.
4. Vencimiento, pago rechazado final, reembolso o disputa: bloquear de acuerdo con política comercial.
5. Reintento de webhook: no crear doble pago, ni prolongar dos veces el acceso.
6. No conceder acceso a otro creador, otra cuenta o por editar el precio en el cliente.
7. En producción, el webhook de prueba `v0_trial_access` nunca debe poder activar permisos de clientes no autorizados.

## Plan de validación antes de habilitar cobros

- Sandbox: pago aprobado/rechazado, callback duplicado, callback falso, ID o monto alterado, renovación, cancelación, vencimiento, reembolso y reversa.
- Dos cuentas separadas, distintos creadores, intento entre cuentas, media sin suscripción, enlace firmado expirado.
- Reportes conciliados de pagos y repartos, confirmación comercial escrita del proveedor.
- Secretos en variables del servidor; feature flag `REAL_PAYMENTS_ENABLED=false` hasta pasar todas las pruebas.

## Próxima acción

Recoger definición de tipo de contenido y modelo de distribución de ingresos. Contactar Flow y/o Mercado Pago para autorización comercial; abrir cuenta y obtener **solo credenciales sandbox**, cargándolas como secretos en Railway/Supabase (nunca en chat o GitHub). Recién entonces iniciar implementación técnica contra el proveedor elegido.
