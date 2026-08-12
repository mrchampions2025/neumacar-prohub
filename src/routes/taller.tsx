import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2 } from "lucide-react";

import heroTaller from "@/assets/hero-taller.jpg";
import neumaticos from "@/assets/neumaticos.jpg";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TyreSearchForm } from "@/components/forms/TyreSearchForm";
import { Button } from "@/components/ui/button";
import { whyUs, workflow } from "@/data/content";
import { site } from "@/config/site";

export const Route = createFileRoute("/taller")({
  head: () => ({
    meta: [
      { title: "El taller — Instalaciones y forma de trabajar | Neumacar Motors" },
      {
        name: "description",
        content:
          "Conoce el taller de Neumacar Motors: equipos de diagnosis multimarca, personal cualificado, presupuestos previos y garantía en cada reparación.",
      },
      { property: "og:title", content: "El taller — Neumacar Motors" },
      {
        property: "og:description",
        content: "Instalaciones, equipo técnico y método de trabajo de Neumacar Motors.",
      },
    ],
  }),
  component: WorkshopPage,
});

function WorkshopPage() {
  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden border-b border-border">
        <img
          src={heroTaller}
          alt="Taller de Neumacar Motors"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-page relative py-20">
          <p className="eyebrow">El taller</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold uppercase leading-[1.05] md:text-5xl">
            Técnica, criterio y <span className="text-primary">transparencia</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            {site.name} es un taller multimarca donde cada vehículo se diagnostica antes de
            repararse. Explicamos qué falla, por qué y cuánto cuesta.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="Por qué elegirnos" title="Lo que nos diferencia" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((w) => (
              <div key={w.title} className="surface-card rounded-lg p-6">
                <CheckCircle2 className="size-5 text-primary" />
                <h3 className="mt-4 font-display text-base font-bold uppercase">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-y border-border bg-surface">
        <div className="container-page">
          <SectionHeading eyebrow="Método" title="Nuestro proceso de trabajo" align="center" />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((w) => (
              <li key={w.step} className="surface-card rounded-lg p-5">
                <span className="font-display text-3xl font-bold text-primary/60">
                  {String(w.step).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-base font-bold uppercase">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/cita">
                <CalendarClock /> Reservar cita
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Neumáticos"
              title="Encuentra tu medida"
              description="Trabajamos las principales marcas para turismo, SUV y furgoneta, con montaje, equilibrado y gestión de residuos incluidos."
            />
            <div className="mt-6 overflow-hidden rounded-lg border border-border">
              <img
                src={neumaticos}
                alt="Neumáticos disponibles en el taller"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
          <TyreSearchForm />
        </div>
      </section>
    </PublicLayout>
  );
}
