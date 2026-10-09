# AFTER SHIFT · Regla obligatoria: contenido solo para visualizar, no descargable

**Fecha:** 2026-10-09  
**Estado:** requisito comercial y técnico del producto, obligatorio para cualquier futura función de compra individual, propinas vinculadas a medios, suscripciones y transmisiones grabadas.  
**Alcance de esta actualización:** documentación del requisito. No habilita cobros reales ni altera el código de las suscripciones o los permisos existentes.

## Decisión del producto

Cuando una persona compra una publicación, un video o cualquier contenido digital protegido dentro de AFTER SHIFT, está **comprando una autorización para visualizarlo en la plataforma**, bajo condiciones visibles al pagar. **No compra el archivo original ni obtiene derecho a descargarlo, extraerlo, copiarlo, redistribuirlo o revenderlo.** El acceso corresponde únicamente a su cuenta y a la duración indicada antes de comprar.

- No ofrecer botón «Descargar», enlace directo permanente, adjunto de correo o archivo descargable para compras individuales, suscripciones, acceso temporal ni reproducciones de LIVE.
- El creador conserva el control y los derechos sobre su contenido según el contrato de publicación; la compra individual no significa cesión de derechos.
- La pantalla de compra indicará claramente «Solo para ver en AFTER SHIFT · No descargable» en español, inglés y portugués, además de la duración del acceso.
- No permitir que un usuario reenvíe automáticamente el acceso comprado a otro usuario. Regalar acceso, si se implementa, necesitará un flujo explícito y verificable.
- El comprador podrá ver cuántas veces se puede reproducir y durante cuánto tiempo, si existe un límite. No prometer acceso permanente sin poder garantizarlo operativa y contractualmente.
- No presumir que la tarifa de compra individual incluye propiedad ni descargas.

## Protección técnica recomendada antes de vender contenido individual

1. **Servidor y autorización por reproducción:** autenticar comprador, comprobar derechos efectivos y estado actual de pago/reembolso, suspensiones y edad antes de entregar medios; la validación no debe depender de un botón o una variable en JavaScript.
2. **Almacenamiento privado y permisos RLS:** los originales nunca deberán quedar expuestos en un bucket público ni en enlaces permanentes.
3. **Reproducción en streaming controlado:** preferir segmentos de video y acceso temporal mediante un servicio de video autorizado por sesión, con revocación y controles de concurrencia. Evitar entregar un MP4 original por URL pública.
4. **DRM si es viable y compatible con teléfonos:** evaluar Widevine, FairPlay o solución equivalente si el presupuesto y plataforma lo justifican. DRM tampoco garantiza protección total.
5. **Marcas de agua visibles y/o forenses** personalizadas con identificador no sensible para disuadir redistribución; nunca mostrar correo personal ni RUT en el video.
6. **Sin opción de descarga en interfaz:** usar `controlsList="nodownload noremoteplayback"` y `disablePictureInPicture` como disuasivos si el navegador los respeta, pero no tratarlo como seguridad suficiente.
7. **Registro de sesiones y abuso** con privacidad y protección de datos; limitar compartición de cuentas sin bloquear injustamente accesibilidad ni uso legítimo de múltiples dispositivos.
8. **Retiro rápido y denuncias** de contenido pirateado, así como mecanismos para solicitar eliminación y revocación.
9. **Pruebas reales de seguridad** en Android/iOS y navegadores de escritorio, confirmando ausencia de enlaces de descarga involuntarios, permisos por usuario y expiraciones.

### Límite técnico que debe declararse honestamente

**No es posible garantizar al 100% que una persona no copie o grabe contenido que se reproduce en su dispositivo.** Hasta con DRM puede existir grabación externa de la pantalla o cámara. Debemos ofrecer barreras razonables sin prometer «imposible de descargar o grabar».

## Situación actual de AFTER SHIFT V25

- **Actualmente NO existe compra individual real:** en `wallet-lab.js` solo hay una compra ficticia de publicación DEMO que no concede acceso a ningún medio real ni guarda saldo.
- Los videos privados actuales se guardan en el bucket privado `post-media`, con autorización RLS y URL firmada de cinco minutos obtenida por `secureMediaUrl()` en `app.js`.
- El reproductor de `app.js` ya usa `controlsList="nodownload nofullscreen noremoteplayback"` y `disablePictureInPicture`; la marca de agua protege visualmente la vista de suscriptor.
- **Limitación pendiente:** un MP4 accesible mediante URL firmada puede guardarse mediante herramientas del navegador mientras la URL sea válida. Por tanto, la implementación actual es **disuasoria, no una solución antidescarga robusta para ventas reales**.
- No activar venta individual real de video hasta incorporar una solución de streaming más robusta, condiciones claras de licencia y pasarela legalmente aprobada.

## Reglas de aceptación para implementación futura

- [ ] Español: «Solo para ver en AFTER SHIFT · No descargable».
- [ ] Inglés: «Watch on AFTER SHIFT only · No downloads».
- [ ] Portugués (Brasil): «Apenas para assistir no AFTER SHIFT · Sem downloads».
- [ ] Los medios comprados se reproducen **dentro de la app**, nunca se entrega el archivo original o enlace permanente.
- [ ] Un usuario sin derecho de acceso no puede obtener el video ni por ruta directa ni por API.
- [ ] Si expira el acceso o se revoca un pago, la reproducción nueva es denegada, además de controlar sesiones en curso en la medida técnica posible.
- [ ] El pago solo se confirma por servidor/webhook del procesador aprobado, no por simulador ni monedas ficticias.
- [ ] Prueba de protección de medios en Android, iOS y escritorio; documentar límites residuales de captura de pantalla.
- [ ] Diseño V22, selector ES/EN/PT, publicaciones y simulaciones previamente aprobadas no se rompen.

**Nota de producto:** esta protección cubre también fotos exclusivas, contenido adquirido con monedas y cualquier video o grabación de un LIVE comercializado posteriormente.
