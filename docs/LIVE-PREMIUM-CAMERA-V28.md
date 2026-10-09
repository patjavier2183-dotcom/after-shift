# AFTER SHIFT V28 — corrección de prueba de cámara
Fecha: 2026-10-09.

Motivo: el botón «Iniciar prueba» de V27 solamente incrementaba estado ficticio y no activaba ninguna cámara, como señaló el usuario al probar desde Android.

## Qué hace V28
- «Vista previa» se renombra **«Resumen del LIVE»** para dejar de confundir el borrador con una previsualización de video.
- «Iniciar prueba con cámara» solicita permiso de cámara del navegador HTTPS, abre **video real de la cámara frontal únicamente dentro de la ventana del creador**, y muestra una advertencia «Solo vista local · Nadie más puede verte · No se graba».
- Permiso denegado o navegador sin `mediaDevices.getUserMedia` → aviso visible en ES/EN/PT y NO se muestra un estado falso de cámara encendida.
- «Finalizar prueba», guardar borrador o cerrar la ventana → `MediaStreamTrack.stop()`, limpieza del `srcObject` y cierre de vista de cámara. Si se cierra mientras se aguarda permiso, cuando se resuelva la solicitud se detienen las pistas y no se activa la vista.
- El estado de la demo y sus contadores ficticios solo comienzan cuando se obtiene acceso efectivo a la cámara.
- El micrófono no se solicita ni se transmite; `audio:false`. No se genera grabación.
- Los contadores de entradas y regalos continúan siendo SIMULACIONES locales. No hay transmisión entre dispositivos, pago real o acceso a contenido privado.
- Creator Studio, la marca, el diseño general, suscripciones y Supabase no cambian.

## Validación manual
1. Abrir AFTER SHIFT V28 con Chrome en un celular Android, iniciar sesión como creador, Creator Studio → CONFIGURAR LIVE.
2. Guardar un borrador y presionar «Iniciar prueba con cámara».
3. Android pedirá permiso; concederlo. Debe aparecer imagen de la cámara frontal bajo «Tu cámara en directo (solo para ti)».
4. Asegurar que los contadores de entradas y regalos son simulados y que **ninguna otra cuenta puede ver la cámara**.
5. Presionar «Finalizar prueba»; verificar que se apaga cámara y desaparece el video.
6. Volver a probar y cerrar la ventana con ×; verificar que se apaga la cámara.
7. Denegar permiso en el navegador; debe aparecer error comprensible sin falsa transmisión.
8. Comprobar textos ES/EN/PT.

## Requisitos pendientes para un LIVE real
Servicio de WebRTC/streaming, emisión y visualización entre cuentas, permisos del servidor vinculados a suscripción + entrada pagada por evento, moderación, verificación de adultos y consentimiento, control de audio y tratamiento de capturas/grabaciones, autorización de procesador para contenido adulto. No prometer que una imagen reproducida no puede capturarse por medios externos.
