# Capa de servicios

Punto único de integración con el backend y servicios externos.

- `leads.ts` — envío de todos los formularios (citas, presupuestos, valoraciones, contacto,
  pruebas de vehículo, financiación). Hoy **no persiste**: devuelve un estado
  `pending_backend`. Al activar Lovable Cloud, sustituir el cuerpo de `submitLead`
  por un `createServerFn` que inserte en la tabla `leads` (+ tabla específica).
- `whatsapp.ts` — sólo construye enlaces `wa.me`. La WhatsApp Business API **no**
  está integrada; no se simula ningún envío.
- `email.ts` — contratos de las plantillas de email. Sin proveedor SMTP configurado.
- `calendar.ts` — contrato de sincronización con Google Calendar. Sin integración.

Ninguno de estos módulos simula una integración inexistente.
