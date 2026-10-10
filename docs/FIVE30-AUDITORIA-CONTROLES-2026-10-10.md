# 5:30 — Auditoría de controles (10-10-2026)

Entorno: solo rama `five30-desarrollo`. AFTER SHIFT producción `main` intacto.

## Corregido en esta ronda
- `approvedMobileLanguage` y `approvedDesktopLanguage`: selector ES / EN / PT visible; llama a la capa de traducciones de la aplicación y conserva el valor en el selector original.
- Botones móviles INGRESAR y CREAR CUENTA visibles; abren inmediatamente los formularios originales vía `window.Five30Auth` sin simular autenticación.
- Botones del encabezado: CREADORES, EXPLORAR, SUSCRIPCIONES y BUSCAR. Al tocar SUSCRIPCIONES sin sesión, abre acceso; con sesión, usa panel original.
- Hotspots de escritorio visibles y traducidos para español/portugués (sin cambiar la imagen del logotipo ni del héroe); el modo EN mantiene los píxeles de la portada de referencia.
- CTA EXPLORE CREATORS y SEE HOW IT WORKS conectados, con sección `#howItWorks` dedicada.
- Búsqueda envía `input` al filtro `#creatorSearch` existente; Enter envía, Escape cierra.
- Estado sesión: actualiza «MI CUENTA»; desaparece CREAR CUENTA móvil y queda botón de ingreso a cuenta; se evita doble llamado.
- Adaptación móvil: se amplía un recorte del archivo original, conservando los numerales exactos y mostrando en el borde derecho a la modelo desde el mismo archivo.
- Modal de autenticación con rol dialog, aria-modal, mensaje aria-live y cierre por Escape.
- Versiones cache bust `five30-approved-cover.css/js?v=4` y `app.js?v=20261010-five30-buttons-v2`.

## Comprobaciones de código
- 15 botones con `id` de `index.html` referenciados por controladores existentes.
- Prueba aislada por eventos de `five30-approved-cover.js`: 12/12 afirmaciones correctas (inicio de sesión, registro, cuenta, suscripciones con y sin sesión, búsqueda, ES/EN/PT, lista creadores, ABOUT, cómo funciona, comportamiento de cuenta y CTA).
- Ambas fuentes JS (`app.js` y `five30-approved-cover.js`) pasan el parseo sintáctico ECMAScript.
- Se confirmó que HEAD GitHub de `five30-desarrollo` y `main` son diferentes; no se modificó `main`.

## NO verificado todavía
- El despliegue de Netlify no se pudo abrir desde la herramienta de lectura externa; hace falta comprobar en navegador de usuario, idealmente Android y escritorio.
- La base de datos 5:30 nueva está vacía y falta prueba de alta real con confirmación por correo; dos cuentas para verificar perfiles, recuperación, logout, creación y contenido VIP privado.
- Monedas, pagos, compras VIP y LIVE siguen siendo demos o prototipos; NO representar como funcionalidades de cobro real.
- Flujo de prueba específico: abrir https://five30-yourway.netlify.app/ desde pestaña privada, comprobar header, idioma ES/EN/PT, ingresar, crear cuenta, contraseña visible/oculta, olvidar contraseña, buscar, explorar, suscripciones sin sesión, ¿Cómo funciona?, móvil/PC. Revisar consola y feedback de Supabase si un paso falla.
