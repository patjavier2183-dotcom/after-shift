# AFTER SHIFT V33 — publicación real de contenido VIP con archivo privado y catálogo
Fecha: 2026-10-09

## Lo que realmente se implementó
- Base Supabase: tablas `public.vip_posts` (metadatos visibles a usuarios autenticados) y `public.vip_assets` (ubicación del archivo SOLO visible al creador). Ambas tienen RLS y permisos de inserción/lectura/borrado restringidos según el rol y la propiedad. Migración: `after_shift_v33_private_vip_offers`.
- Bucket privado `vip-media` con máximo 50 MB y MIME JPG/PNG/WebP/MP4/WebM. Las políticas de Storage solo permiten SUBIR, LEER y BORRAR al creador dueño de su carpeta.
- En Creator Studio, bloque **«Mis publicaciones VIP»** → **«+ NUEVO CONTENIDO VIP»**. Formulario con título, descripción, foto/video y precio de 5 a 5.000 monedas. Guarda el archivo privado, su metadata en la base y permite revisar la propia foto/video mediante una URL firmada de 180 segundos. También permite eliminar sus publicaciones VIP.
- En perfiles REALES de creadores registrados, la sección Contenido muestra las publicaciones VIP publicadas, título, descripción y precio. **Nunca publica la foto/video privado** a suscriptores ni a usuarios no suscritos.
- Solo si aparece una suscripción existente con estado activo (según el perfil) o el mismo creador es dueño, se habilita el botón **«SIMULAR COMPRA VIP»**. La compra ficticia NO descuenta monedas, no crea pagos ni concede acceso al archivo. El estado «comprado» se borra al cerrar el perfil.
- ES/EN/PT. Se conserva diseño V22 y la apariencia y funciones de los paquetes de monedas V31/V32.
- **Precio VIP**: 30 monedas = US$3 nominales en nuestro ejemplo, sin tarifa adicional de recarga al momento de consumo, reparto futuro 80% creador y 20% plataforma (antes de costos).
- Texto obligatorio: «Solo para ver en AFTER SHIFT · No descargable»; el bloqueo de descarga es una condición comercial y no puede garantizar que nadie capture pantalla o extraiga contenidos con dispositivos externos.

## Flujo de prueba
1. Abrir AFTER SHIFT V33, ingresar con una cuenta REAL de creador (p.ej. @pat), Mi cuenta → Creator Studio.
2. Ir a «Mis publicaciones VIP» y pulsar «+ NUEVO CONTENIDO VIP».
3. Escribir título, descripción, precio 30 monedas y subir foto JPG/WebP de menos de 8 MB o video MP4/WebM menor de 50 MB.
4. «PUBLICAR VIP» → debe mostrarse la ficha guardada en Creator Studio. «VER MI ARCHIVO» permite comprobar imagen/video solo como creador.
5. Cerrar Creator Studio, abrir el perfil real de ese creador; debe verse el VIP con candado y precio, **sin mostrar imagen/video a los espectadores**.
6. Una cuenta suscrita de prueba podrá pulsar «SIMULAR COMPRA VIP» (estado temporal); no se cobra nada ni desbloquea el archivo. Usuario no suscrito ve el botón bloqueado.
7. Volver al Studio y borrar el VIP de prueba si ya no se necesita.

## Pendiente imprescindible antes de compras reales
- Billetera persistente servidor, pagos reales aprobados para contenido adulto y prepagos, movimientos atómicos, IVA/tributación, reembolsos y conciliación.
- Control servidor RLS por par (usuario creador / suscriptor activo) más compra verificada por post y método seguro de emisión de media streaming o URLs cortas (con controles antifuga razonables; DRM opcional).
- Privacidad, edad 18+, verificación de creadores y consentimiento, moderación y remoción, términos y reclamaciones.
- El catálogo VIP es persistente y privado a nivel de archivos; la autorización de consumo NO está implementada y NO debe afirmarse que el suscriptor tiene acceso al media VIP hasta implementar la compra y el backend.
