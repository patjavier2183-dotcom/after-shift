# AFTER SHIFT V31: regalos valorizados incluidos en cada paquete (DEMO)
Fecha: 2026-10-09. Sin pagos reales ni permiso de acceso al contenido.

Cada paquete divide su valor NOMINAL entre regalos recibidos y monedas libres, sin duplicación:
| Paquete | Regalos incluidos | Valor de regalos | Monedas libres | Valor nominal | Total con tarifa 5% SIMULADA |
|---|---|---:|---:|---:|---:|
| 50 monedas | ❤️ ×2, ⭐ ×1 | US$2 | 30 (US$3) | US$5 | US$5,25 |
| 100 monedas | ❤️ ×2, ⭐ ×2, 💎 ×1 | US$8 | 20 (US$2) | US$10 | US$10,50 |
| 200 monedas | ❤️ ×2, ⭐ ×2, 💎 ×1, 👑 ×1 | US$18 | 20 (US$2) | US$20 | US$21 |

Valor unitario: corazón 5 monedas/US$0,50; estrella 10/US$1; diamante 50/US$5; corona 100/US$10. Tarifa y catálogo sujetos a futura aprobación comercial.

En «Mi cuenta → Comprar monedas» cada paquete presenta la composición detallada y su valor por tipo de regalo. Después de SIMULAR COMPRA, los regalos quedan en el inventario temporal; se asignan al creador **solo cuando se envían**, con distribución ilustrativa 80% creador / 20% plataforma, y se descuenta un ejemplar del inventario. Si ya no quedan regalos de ese tipo, el usuario puede enviar otro usando suficientes monedas libres. Las propinas y publicaciones DEMO gastan monedas libres. El saldo pendiente suma regalos no enviados y monedas sin gastar. La tarifa ficticia se contabiliza separadamente; no hay ingresos ni cobros reales.

Se conservó la API `topup/redeem` del simulador de LIVE (todavía aislado) sin cambios de comportamiento. Los nuevos paquetes con inventario corresponden a la pantalla Comprar monedas. No hay saldo persistente, sincronización entre dispositivos ni acceso desbloqueado. Nada cambia en Supabase, cámara, suscripciones o permisos. Borrar/cerrar la ventana reinicia el inventario.

Prueba: comprar 100 → inventario 2 ❤️, 2 ⭐, 1 💎 y 20 monedas libres; enviar 💎 (inventario sin diamante, monedas libres siguen 20), enviar ⭐, luego propina de 20 → quedan 2 ❤️ + 1 ⭐ (valor US$2), creador US$6,40 y plataforma US$1,60 por consumos ficticios; la tarifa simulada añade US$0,50 de ingreso bruto hipotético a la plataforma.

Antes de pagos reales: autorización del proveedor para monedas y contenidos adultos, condiciones transparentes, edad/consentimiento, reembolsos, conciliación y ledger servidor sin doble gasto, y protección de contenido sin descarga directa.
