import { createFileRoute } from "@tanstack/react-router";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { whatsapp } from "@/services/whatsapp";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto y ubicación — Neumacar Motors" },
      {
        name: "description",
        content:
          "Teléfono, WhatsApp, email y horario de Neumacar Motors. Escríbenos y te respondemos lo antes posible.",
      },
      { property: "og:title", content: "Contacto — Neumacar Motors" },
      { property: "og:description", content: "Cómo localizarnos: teléfono, WhatsApp, email y horario." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PublicLayout>
      <div className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Contacto"
              title="Hablemos de tu vehículo"
              description="Rellena el formulario o escríbenos directamente por WhatsApp. Te atendemos en horario de taller."
            />
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="surface-card rounded-lg p-6">
              <h2 className="font-display text-lg font-bold uppercase">Datos de contacto</h2>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  <a href={site.phoneHref} className="hover:text-primary">
                    {site.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                  <a href={`mailto:${site.email}`} className="hover:text-primary">
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{site.address}</span>
                </li>
              </ul>
              <Button asChild variant="whatsapp" size="lg" className="mt-6 w-full">
                <a href={whatsapp.general()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle /> Escribir por WhatsApp
                </a>
              </Button>
            </div>

            <div className="surface-card rounded-lg p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase">
                <Clock3 className="size-4 text-primary" /> Horario
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                {site.schedule.map((s) => (
                  <div key={s.days} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{s.days}</dt>
                    <dd className="text-right font-medium">{s.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="surface-card rounded-lg p-6">
              <h2 className="font-display text-lg font-bold uppercase">Cómo llegar</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                El mapa interactivo se activará cuando confirmes la dirección exacta del taller.
                Mientras tanto, puedes llamarnos y te indicamos la ruta.
              </p>
              <div className="mt-4 flex aspect-video items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                Mapa pendiente de dirección definitiva
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
