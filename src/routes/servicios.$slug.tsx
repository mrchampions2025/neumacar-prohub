import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, CheckCircle2, Clock3, MessageCircle } from "lucide-react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/common/states";
import { getService } from "@/data/services";
import { whatsapp } from "@/services/whatsapp";

export const Route = createFileRoute("/servicios/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Servicio no disponible — Neumacar Motors" }, { name: "robots", content: "noindex" }],
      };
    }
    const { service } = loaderData;
    return {
      meta: [
        { title: `${service.name} — Neumacar Motors` },
        { name: "description", content: service.short },
        { property: "og:title", content: `${service.name} — Neumacar Motors` },
        { property: "og:description", content: service.short },
      ],
    };
  },
  component: ServiceDetail,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <PublicLayout>
      <div className="container-page section-y">
        <EmptyState
          title="Servicio no encontrado"
          description="El servicio que buscas no existe o ya no está disponible."
          action={
            <Button asChild variant="hero">
              <Link to="/servicios">Ver todos los servicios</Link>
            </Button>
          }
        />
      </div>
    </PublicLayout>
  );
}

function ServiceDetail() {
  const { service } = Route.useLoaderData();

  return (
    <PublicLayout>
      <div className="container-page section-y">
        <Link
          to="/servicios"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Servicios
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Badge variant="outline">{service.category}</Badge>
            <h1 className="mt-4 text-3xl font-bold uppercase leading-tight md:text-4xl">
              {service.name}
            </h1>
            <p className="mt-4 text-base text-muted-foreground">{service.description}</p>

            <h2 className="mt-10 font-display text-xl font-bold uppercase">Qué incluye</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.includes.map((i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {i}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-xl font-bold uppercase">Cuándo lo necesitas</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.when.map((i) => (
                <li key={i} className="surface-card rounded-md p-4 text-sm text-muted-foreground">
                  {i}
                </li>
              ))}
            </ul>

            {service.faqs.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-xl font-bold uppercase">
                  Preguntas frecuentes
                </h2>
                <Accordion type="single" collapsible className="mt-4 w-full">
                  {service.faqs.map((f) => (
                    <AccordionItem key={f.q} value={f.q}>
                      <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card rounded-lg p-6">
              <p className="text-sm text-muted-foreground">Desde</p>
              <p className="font-display text-3xl font-bold text-primary">
                {service.priceFrom ? `${service.priceFrom} €` : "A consultar"}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="size-4" /> {service.duration}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Precio orientativo. El importe final se confirma en el presupuesto tras revisar el
                vehículo.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild variant="hero" size="lg">
                  <Link to="/cita" search={{ servicio: service.slug }}>
                    <CalendarClock /> Reservar cita
                  </Link>
                </Button>
                <Button asChild variant="chrome" size="lg">
                  <Link to="/presupuesto" search={{ servicio: service.slug }}>
                    Pedir presupuesto
                  </Link>
                </Button>
                <Button asChild variant="whatsapp" size="lg">
                  <a
                    href={whatsapp.service(service.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
