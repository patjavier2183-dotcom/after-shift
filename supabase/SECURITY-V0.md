# AFTER SHIFT - Seguridad V0 (2026-10-09)

**Estado:** esta revisión se guardó en GitHub. NO se ha ejecutado en Supabase.

## Objetivo
Evitar que cualquier cuenta pueda activarse suscripciones de pago, cambiar su rol a administrador, manipular precios o consultar material privado por reglas demasiado amplias.

## Aplicar
1. Entra al proyecto Supabase \`heqjyafaxjzisddmgvob\`, SQL Editor.
2. Ejecuta \`supabase/security-audit-v0.sql\`. Este archivo solo consulta, no cambia nada. Revisa que la base sea la correcta.
3. Haz una copia de seguridad o snapshot.
4. Revisa y ejecuta \`supabase/v0-access-hardening-20261009.sql\`. Es una transacción; en caso de error revierte todos los cambios de esa ejecución.
5. Vuelve a ejecutar la auditoría. Las 5 verificaciones deben aparecer como true.
6. Desde dos cuentas diferentes comprueba: (a) creador publica; (b) usuario no suscrito no accede a originales; (c) suscriptor de prueba con precio US$0.00 ve material; (d) al cancelar se niega la emisión de nuevos enlaces.

**Importante:** no hay pagos reales. No se borran ni cambian suscripciones anteriores. Antes de activar cobros hay que revisar las antiguas suscripciones a creadores con precio mayor a cero, implementar validación de pago en servidor, verificación de edad/identidad y moderación. Los enlaces privados firmados pueden continuar funcionando hasta caducar (5 minutos en la V0). No publicar el sitio como plataforma de pago todavía.
