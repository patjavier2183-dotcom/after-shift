# AFTER SHIFT V27 · Creator LIVE Manager (laboratorio)
Fecha: 2026-10-09

## Alcance implementado
- En Creator Studio del creador registrado se incorporó **LIVE PREMIUM · creador**, un pequeño recuadro que no modifica el diseño base V22.
- Se abre el formulario para **nombre, descripción, fecha/hora y precio por entrada** (US$1–US$500).
- **Solo el borrador** de configuración queda en el localStorage del navegador, bajo un identificador específico del creador autenticado. No se guarda en Supabase, no se anuncia a otros navegadores ni se crea ninguna venta.
- «Iniciar prueba» / «Finalizar prueba» cambian únicamente el estado del diálogo **y no transmiten audio ni video**.
- «+1 entrada ficticia» y «+ Regalo ficticio US$1» incrementan contadores DE DEMOSTRACIÓN, que se reinician al cerrar.
- Muestra entradas DEMO, regalos DEMO, bruto ficticio y reparto ilustrativo 80% creador / 20% AFTER SHIFT, antes de costos. **Nunca se presenta como ganancia efectivamente cobrada.**
- En el simulador de LIVE PREMIUM V26, **el mismo navegador** puede leer el borrador para mostrar el nombre del evento y el precio configurado. Si el borrador no existe, mantiene el precio de ejemplo US$5. No se sincroniza con cuentas remotas ni habilita acceso verdadero.
- ES/EN/PT con selector original.
- No se modifican las publicaciones, suscripciones, sus permisos, RLS, Supabase, pasarelas ni almacenamiento de medios.

## Prueba guiada
1. Abrir AFTER SHIFT y entrar con cuenta de creador @pat; Mi cuenta → Creator Studio → CONFIGURAR LIVE.
2. Nombrar el LIVE, elegir día/hora futura, poner precio ejemplo US$7, guardar borrador.
3. Comprobar que aparece el título y US$7 en el recuadro del Studio.
4. Reabrir para revisar persistencia local. «Iniciar prueba», añadir 2 entradas ficticias y un regalo ficticio; total bruto = US$15, creador US$12, AFTER SHIFT US$3.
5. «Finalizar prueba». Cerrar. Reabrir: contadores ficticios en cero, configuración conservada.
6. Abrir el perfil de @pat desde **el mismo navegador** y seleccionar PROBAR LIVE PREMIUM. Debe verse el nombre y precio de US$7; simular la entrada, sin pagos reales ni accesos reales.
7. Repetir interfaz en ES/EN/PT. En otro navegador, la configuración no se mostrará por ser un borrador local.

## Antes de producción real
- Un servicio servidor debe registrar eventos, validar propiedad del creador, agenda y disponibilidad, acceso para suscriptores, ventas reales, registros de regalos, reembolsos y ledgers auditables.
- La implementación de streaming necesita transmisión real con moderación, controles de edad/identidad/consentimiento y autorización de entrada pagada por evento.
- La billetera deberá cumplir las reglas del procesador/regulación para saldos prepagos.
- Prohibir descargas de videos, sin prometer imposibilidad absoluta de captura: seguir docs/REQUISITO-ANTIDESCARGAS.md.
- Preservar diseño V22 y módulos V23–V26.
