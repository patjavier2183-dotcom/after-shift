# AFTER SHIFT V29 — orden de botones de «Mi cuenta»
Fecha: 2026-10-09

## Cambio visual pedido tras prueba en Android
- Primera fila: **Creator Studio** a la izquierda y **Cerrar sesión** a la derecha, ambos presentados como botones claramente pulsables.
- Segunda fila: **🪙 Monedas de prueba** como control secundario más pequeño y discreto. El texto se traduce con el selector ES/EN/PT.
- El botón «Cerrar sesión» ya no parece texto suelto; tiene borde, fondo y zona táctil de al menos 47 px de alto.
- Se conserva la jerarquía de color, tipografía y fondos aprobados; diseño responsivo con columnas iguales, sin necesidad de desplazamiento horizontal.
- Se mantuvieron exactamente los IDs y controladores originales: `creatorBtn`, `logoutBtn`, `coinLabTrigger`.

## Sin cambios funcionales
No se modificó el código de autenticación, cierre de sesión, suscripciones, publicaciones, monedas, cámara, LIVE, RLS ni pagos. El cambio es estrictamente de marcado y CSS, más las etiquetas del botón de monedas para tres idiomas.

## Prueba manual
1. Abrir AFTER SHIFT con teléfono Android e iniciar sesión.
2. Pulsar «Mi cuenta» y verificar primera fila Creator Studio | Cerrar sesión, segunda fila Monedas de prueba.
3. Abrir «Monedas de prueba» y comprobar que sigue funcionando la demo.
4. Abrir Creator Studio y comprobar que sigue funcionando.
5. Cambiar ES → EN → PT y revisar los nombres y tamaños.
6. Pulsar «Cerrar sesión» y confirmar que la sesión realmente termina; volver a iniciar sesión.
