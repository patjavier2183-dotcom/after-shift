# AFTER SHIFT V30 · Comprar monedas (demostración de paquetes)

Fecha: 2026-10-09.

## Modificación aprobada
- En «Mi cuenta», botón **🪙 Comprar monedas**, en vez de «Monedas de prueba», en ES/EN/PT.
- Al tocarlo se abre primero la vista de **paquetes de monedas** con su cantidad, precio total ilustrativo y la acción **«SIMULAR COMPRA»**.
- Paquetes visibles:
  - 50 monedas, nominal US$5, tarifa de muestra 5% (US$0,25), total US$5,25.
  - 100 monedas, nominal US$10, tarifa de muestra 5% (US$0,50), total US$10,50.
  - 200 monedas, nominal US$20, tarifa de muestra 5% (US$1), total US$21.
- Los tres precios son **simulados, no están aprobados comercialmente** y no activan una pasarela.
- Dentro de la ventana, aviso destacado de **MODO PRUEBA SIN DINERO REAL**. Toda selección modifica solamente el saldo ficticio temporal que se borra al cerrar.
- Bajo los paquetes se muestran saldo, regalos LIVE, propinas, publicaciones DEMO, reparto y movimientos.
- El título distingue expresamente la pantalla de **«Comprar paquetes de monedas»** del laboratorio original.
- Los controles y etiquetas son ES, EN y PT y mantienen apariencia adaptada al móvil.

## No modificado
- Sin nuevas compras reales, cargos, tarjeta, billetera regulada ni proveedores de pago.
- No se tocaron backend, Supabase, RLS, cámara, transmisiones LIVE, autorizaciones de acceso, Creator Studio o suscripciones.
- Botones Creator Studio y Cerrar sesión mantienen su posición y funciones.
- Monedas ficticias no habilitan videos ni contenido descargable.

## Prueba
1. Entrar a Mi cuenta → «Comprar monedas».
2. Deben aparecer arriba tres paquetes con US$5,25 / US$10,50 / US$21,00.
3. Pulsar «SIMULAR COMPRA» sobre 100 monedas. Saldo ficticio debe subir a 100.
4. Enviar corazón (5 monedas), propina (20) y compra DEMO (30). Quedan 45 monedas.
5. Cerrar y abrir: saldo 0.
6. Comprobar traducciones ES/EN/PT y que cerrar sesión sigue funcionando.
