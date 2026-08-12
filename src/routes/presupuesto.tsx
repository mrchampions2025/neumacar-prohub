import { createFileRoute } from "@tanstack/react-router";
import { FileText, MessageCircle, Phone } from "lucide-react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { whatsapp } from "@/services/whatsapp";

export const Route = createFileRoute("/presupuesto")({
  validateSearch: (search: Record<string, unknown>): { servicio?: string } =>
    typeof search["servicio"] === "string" ? { servicio: search["servicio"] } : {},

  head: () => ({
    meta: [
      { title: "Pedir presupuesto de reparación — Neumacar Motors" },
      {
        name: "description",
        content:
          "Solicita presupuesto sin compromiso para tu reparación, mantenimiento o cambio de neumáticos. Respuesta por escrito y sin sorpresas.",
      },
      { property: "og:title", content: "Presupuesto sin compromiso — Neumacar Motors" },
      {
        property: "og:description",
        content: "Cuéntanos qué necesita tu vehículo y te preparamos un presupuesto detallado.",
      },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  const { servicio } = Route.useSearch();

  return (
    <PublicLayout>
      <div className="container-page section-y">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="Presupuesto"
              title="Pide tu presupuesto sin compromiso"
              description="Cuanta más información nos des sobre el vehículo y el síntoma, más ajustado será el presupuesto. Nunca intervenimos sin tu autorización."
            />
            <div className="mt-8">
              <QuoteForm {...(servicio ? { defaultService: servicio } : {})} />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card rounded-lg p-6">
              <FileText className="size-5 text-primary" />
              <h2 className="mt-3 font-display text-lg font-bold uppercase">Cómo funciona</h2>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>1. Recibimos tu solicitud y la revisamos.</li>
                <li>2. Te contactamos para aclarar dudas o citar el vehículo.</li>
                <li>3. Elaboramos el presupuesto con mano de obra y recambios.</li>
                <li>4. Sólo reparamos cuando lo autorizas.</li>
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">
                El presupuesto es gratuito. Si requiere diagnosis electrónica, se indica antes y se
                descuenta si autorizas la reparación.
              </p>
            </div>

            <div className="surface-card rounded-lg p-6">
              <h2 className="font-display text-lg font-bold uppercase">Contacto directo</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Button asChild variant="chrome" size="lg">
                  <a href={site.phoneHref}>
                    <Phone /> {site.phone}
                  </a>
                </Button>
                <Button asChild variant="whatsapp" size="lg">
                  <a href={whatsapp.general()} target="_blank" rel="noopener noreferrer">
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
