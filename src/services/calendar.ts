export interface CalendarEvent {
  title: string;
  start: string;
  durationMinutes: number;
  notes?: string;
}

/**
 * Contrato de sincronización con Google Calendar. Sin integración configurada:
 * las citas no se sincronizan y no se simula que sí.
 */
export async function syncAppointment(_event: CalendarEvent): Promise<never> {
  throw new Error("Google Calendar no conectado.");
}
