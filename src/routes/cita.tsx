import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Phone, MessageCircle } from "lucide-react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { whatsapp } from "@/services/whatsapp";

export const Route = createFileRoute("/cita")({
  validateSearch: (search: Record<string, unknown>): { servicio?: string } =>
    typeof search["servicio"] === "string" ? { servicio: search["servicio"] } : {},

  head: () => ({
    meta: [
      { title: "Reservar cita en el taller — Neumacar Motors" },
      {
        name: "description",
        content:
          "Reserva tu cita en Neumacar Motors: elige servicio, día y hora. Confirmamos la disponibilidad por teléfono o WhatsApp.",
      },
      { property: "og:title", content: "Reservar cita — Neumacar Motors" },
      {
        property: "og:description",
        content: "Solicita cita para mecánica, neumáticos, diagnosis o Pre-ITV.",
      },
    ],
  }),
  component: AppointmentPage,
});

function AppointmentPage() {
  const { servicio } = Route.useSearch();

  return (
    <PublicLayout>
      <div className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Cita previa"
              title="Reserva tu cita en el taller"
              description="Indícanos el servicio y cuándo te viene bien. Revisamos la disponibilidad real de taller y te confirmamos la cita."
            />
            <div className="mt-8">
              <AppointmentForm {...(servicio ? { defaultService: servicio } : {})} />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card rounded-lg p-6">
              <CalendarClock className="size-5 text-primary" />
              <h2 className="mt-3 font-display text-lg font-bold uppercase">Horario</h2>
              <dl className="mt-4 space-y-2 text-sm">
                {site.schedule.map((s) => (
                  <div key={s.days} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{s.days}</dt>
                    <dd className="text-right font-medium">{s.hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">
                La franja solicitada es una preferencia: la cita queda confirmada cuando nuestro
                equipo la valida.
              </p>
            </div>

            <div className="surface-card rounded-lg p-6">
              <h2 className="font-display text-lg font-bold uppercase">¿Prefieres hablar?</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Button asChild variant="chrome" size="lg">
                  <a href={site.phoneHref}>
                    <Phone /> {site.phone}
                  </a>
                </Button>
                <Button asChild variant="whatsapp" size="lg">
                  <a href={whatsapp.appointment()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
