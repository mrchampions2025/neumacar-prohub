export type EmailTemplate =
  | "cita_confirmada"
  | "solicitud_recibida"
  | "presupuesto"
  | "oferta_compra"
  | "compra_confirmada"
  | "info_vehiculo"
  | "recuperar_password";

/**
 * Contrato de envío de email. No hay proveedor configurado: no se envía nada y
 * no se simula. Integración futura: server function + proveedor transaccional.
 */
export async function sendEmail(_template: EmailTemplate, _to: string): Promise<never> {
  throw new Error("Proveedor de email no configurado.");
}
