/**
 * Central business configuration.
 * TODO (Lovable Cloud): move editable values to a `settings` table so the admin
 * can change them without a deploy.
 */
export const site = {
  name: "Neumacar Motors",
  legalName: "Neumacar Motors",
  tagline: "Taller mecánico · Neumáticos · Vehículos de ocasión",
  claim: "Cristo Vive",
  phone: "+34 600 000 000",
  phoneHref: "tel:+34600000000",
  whatsapp: "34600000000",
  email: "info@neumacarmotors.com",
  address: "Polígono Industrial, Nave 1 — España",
  schedule: [
    { days: "Lunes a Viernes", hours: "09:00 – 14:00 · 16:00 – 19:00" },
    { days: "Sábado", hours: "09:00 – 13:30" },
    { days: "Domingo", hours: "Cerrado" },
  ],
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
