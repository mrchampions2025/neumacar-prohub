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

export type SubmitResult = { status: "ok"; reference: string };

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
    throw new Error(error.message);
  }

  return { status: "ok", reference };
}

/**
 * Obtiene el número de citas registradas para una fecha concreta usando la vista daily_appointment_counts
 */
export async function fetchDailyAppointmentCount(date: string): Promise<number> {
  const { data, error } = await supabase
    .from("daily_appointment_counts")
    .select("count")
    .eq("date", date)
    .single();

  if (error || !data) {
    // Si la vista no existe o hay error, asumimos 0 (o podríamos lanzar error, pero mejor fallback suave)
    return 0;
  }
  
  return data.count;
}
