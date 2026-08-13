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

import { supabase } from "@/integrations/supabase/client";

/**
 * Punto único de envío de formularios.
 * Guarda la solicitud en la tabla `leads` de Supabase.
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  const reference = `${payload.type.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;

  const { error } = await supabase.from("leads").insert([
    {
      type: payload.type,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      message: payload.message,
      data: payload.data as any,
      reference: reference,
      status: "nuevo",
    },
  ]);

  if (error) {
    console.error("[leads] Error al guardar en Supabase:", error);
    // Si hay un error, podemos seguir mostrando pending_backend o manejarlo distinto,
    // pero idealmente deberíamos devolver pending_backend para que no pete la app,
    // o un nuevo estado de error. De momento devolvemos pending_backend por compatibilidad.
    return { status: "pending_backend", reference };
  }

  return { status: "ok", reference };
}
