import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  Car,
  CheckCircle2,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

import heroTaller from "@/assets/hero-taller.jpg";
import compramos from "@/assets/compramos-coche.jpg";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DemoDataNotice } from "@/components/common/DemoDataNotice";
import { ServiceCard } from "@/components/services/ServiceCard";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { featuredServices } from "@/data/services";
import { stockVehicles } from "@/data/vehicles";
import { trustPoints, workflow, demoTestimonials, faqs } from "@/data/content";
import { site } from "@/config/site";
import { whatsapp } from "@/services/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neumacar Motors — Taller mecánico, neumáticos y vehículos de ocasión" },
      {
        name: "description",
        content:
          "Taller mecánico multimarca, venta y montaje de neumáticos, compra y venta de vehículos de ocasión. Presupuestos transparentes y cita online.",
      },
      { property: "og:title", content: "Neumacar Motors — Taller, neumáticos y vehículos" },
      {
        property: "og:description",
        content:
          "Mecánica general, neumáticos, diagnosis y vehículos de ocasión revisados. Pide cita o presupuesto sin compromiso.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = featuredServices().slice(0, 6);
  const vehicles = stockVehicles.filter((v) => v.status === "publicado").slice(0, 3);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden">
        <img
          src={heroTaller}
          alt="Interior del taller mecánico de Neumacar Motors"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-page relative py-20">
          <p className="eyebrow">{site.tagline}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold uppercase leading-[1.05] md:text-6xl">
            Tu coche en manos de <span className="text-chrome">profesionales</span> de la{" "}
            <span className="text-primary">automoción</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Mecánica general, neumáticos, diagnosis electrónica y vehículos de ocasión revisados.
            Presupuesto por escrito antes de intervenir. Siempre.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/cita">
                <CalendarClock /> Reservar cita
              </Link>
            </Button>
            <Button asChild variant="chrome" size="xl">
              <Link to="/presupuesto">Pedir presupuesto</Link>
            </Button>
            <Button asChild variant="whatsapp" size="xl">
              <a href={whatsapp.general()} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> WhatsApp
              </a>
            </Button>
          </div>
          <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { k: "Multimarca", v: "Todas las marcas" },
              { k: "Diagnosis", v: "Equipos actuales" },
              { k: "Garantía", v: "En cada reparación" },
              { k: "Ocasión", v: "Vehículos revisados" },
            ].map((i) => (
              <div key={i.k}>
                <dt className="font-display text-sm uppercase tracking-wider text-primary">{i.k}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{i.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CONFIANZA */}
      <section className="border-y border-border bg-surface py-10">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {trustPoints.map((t) => (
            <div key={t.title} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <h3 className="font-display text-sm font-bold uppercase">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Servicios"
            title="Todo lo que tu vehículo necesita"
            description="Desde el mantenimiento periódico hasta la reparación mecánica y electrónica más compleja."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/servicios">
                Ver todos los servicios <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* VEHÍCULOS */}
      <section className="section-y border-y border-border bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="Ocasión"
            title="Vehículos seleccionados"
            description="Cada unidad pasa una revisión mecánica antes de publicarse. Financiación sujeta a aprobación."
          />
          <DemoDataNotice>
            El stock mostrado es de demostración hasta conectar la base de datos de vehículos.
          </DemoDataNotice>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="hero" size="lg">
              <Link to="/vehiculos">
                <Car /> Ver todo el stock
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* COMPRAMOS TU COCHE */}
      <section className="section-y">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-border">
            <img
              src={compramos}
              alt="Tasación de un vehículo en Neumacar Motors"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Compramos tu coche"
              title="Vende tu vehículo sin complicaciones"
              description="Rellena la valoración, revisamos la información y te hacemos una oferta de compra sin compromiso. Nos ocupamos del papeleo y de la transferencia."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Valoración realizada por nuestro equipo, no automática",
                "Inspección presencial antes de la oferta final",
                "Gestión completa de transferencia y trámites",
                "Pago tras aceptar la oferta y firmar el contrato",
              ].map((i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /> {i}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/vender-mi-coche">Valorar mi coche</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={site.phoneHref}>
                  <Phone /> {site.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="section-y border-y border-border bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="Cómo trabajamos"
            title="Un proceso claro de principio a fin"
            align="center"
          />
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
        </div>
      </section>

      {/* OPINIONES */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="Opiniones" title="Lo que dicen nuestros clientes" />
          <DemoDataNotice>
            Reseñas de demostración. Antes de publicar, se sustituirán por reseñas reales verificadas.
          </DemoDataNotice>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {demoTestimonials.map((t) => (
              <figure key={t.name} className="surface-card rounded-lg p-5">
                <div className="flex gap-0.5" aria-label={`${t.rating} de 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < t.rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`}
                    />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm text-muted-foreground">{t.text}</blockquote>
                <figcaption className="mt-4 font-display text-sm uppercase">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y border-t border-border bg-surface">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus dudas" />
          <Accordion type="single" collapsible className="w-full">
            {faqs.slice(0, 7).map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </PublicLayout>
  );
}
