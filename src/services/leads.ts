export type LeadType =
  | "contacto"
  | "presupuesto"
  | "cita"
  | "comprar_vehiculo"
  | "vender_vehiculo"
  | "prueba_vehiculo"
  | "financiacion"
  | "neumaticos";

export type LeadStatus = "nuevo" | "contactado" | "negociacion" | "convertido" | "perdido";

export interface LeadPayload {
  type: LeadType;
  name: string;
  phone: string;
  email?: string | undefined;
  message?: string | undefined;
  /** Datos específicos del formulario (vehículo, servicio, fechas, etc.) */
  data?: Record<string, unknown> | undefined;
}

export type SubmitResult =
  { status: "pending_backend"; reference: string } | { status: "ok"; reference: string };

/**
 * Punto único de envío de formularios.
 *
 * ESTADO ACTUAL: no hay base de datos conectada, por lo que la solicitud NO se
 * persiste. Se devuelve `pending_backend` y la interfaz lo comunica al usuario
 * de forma honesta (sin simular un envío real).
 *
 * INTEGRACIÓN (Lovable Cloud): reemplazar el cuerpo por una llamada a un
 * `createServerFn` que inserte en `leads` y en la tabla específica del tipo,
 * y devolver `{ status: "ok", reference }`.
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  const reference = `${payload.type.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;
  // Latencia simulada únicamente para poder mostrar estados de carga en la UI.
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (import.meta.env.DEV) {
    console.info("[leads] pendiente de backend", { reference, payload });
  }
  return { status: "pending_backend", reference };
}
