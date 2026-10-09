# AFTER SHIFT — Plan de pagos reales V24
**Estado: preparación técnica, sin cobros habilitados.**
**Fecha:** 2026-10-09
**Sistema publicado estable:** AFTER SHIFT V23. No reemplazar ni reinterpretar el diseño aprobado de V22.
**No aplicado a producción:** este documento no cambia clientes, cuentas, importes ni permisos.

## Decisión comercial pendiente, antes de programar un proveedor

1. ¿La plataforma admitirá contenido sexual explícito de adultos o solo contenido no sexual? Solicitar confirmación escrita del proveedor respecto al modelo real de negocio.
2. ¿AFTER SHIFT cobrará en nombre propio, o cada creador debe recibir su proporción automáticamente (marketplace, múltiples destinatarios)?
3. ¿Moneda del cobro: CLP, USD o ambas? En Creator Studio hoy hay precios locales de ejemplo en US$, no publicados ni validados por servidor.
4. Quién es el titular legal del comercio y a qué cuenta bancaria se abonará; condiciones de reembolsos, contracargos y cumplimiento KYC para creadores.
5. Acordar comisión de AFTER SHIFT y el tratamiento del IVA y la documentación tributaria.

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
