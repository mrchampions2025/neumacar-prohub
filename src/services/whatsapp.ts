import { site, whatsappLink } from "@/config/site";

/**
 * Capa WhatsApp. Sólo enlaces `wa.me` (click-to-chat) — abren la app del usuario.
 * La WhatsApp Business API NO está integrada: no se envía ningún mensaje desde
 * el servidor. Punto de integración futuro: `sendTemplateMessage`.
 */
export const whatsapp = {
  link: whatsappLink,
  general: () => whatsappLink(`Hola ${site.name}, me gustaría más información.`),
  service: (service: string) =>
    whatsappLink(`Hola ${site.name}, quiero un presupuesto para: ${service}.`),
  vehicle: (vehicle: string) =>
    whatsappLink(`Hola ${site.name}, estoy interesado en el vehículo: ${vehicle}.`),
  appointment: () => whatsappLink(`Hola ${site.name}, quiero reservar una cita en el taller.`),
  sellCar: () => whatsappLink(`Hola ${site.name}, quiero vender mi coche.`),
};

/** No implementado: requiere WhatsApp Business API configurada. */
export async function sendTemplateMessage(): Promise<never> {
  throw new Error("WhatsApp Business API no configurada.");
}
