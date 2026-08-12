import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, FileSignature, HandCoins, Search } from "lucide-react";

import compramos from "@/assets/compramos-coche.jpg";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ValuationWizard } from "@/components/forms/ValuationWizard";

export const Route = createFileRoute("/vender-mi-coche")({
  head: () => ({
    meta: [
      { title: "Compramos tu coche — Valoración sin compromiso | Neumacar Motors" },
      {
        name: "description",
        content:
          "Vende tu coche a Neumacar Motors: solicita la valoración, te hacemos una oferta tras inspeccionar el vehículo y gestionamos todo el papeleo.",
      },
      { property: "og:title", content: "Compramos tu coche — Neumacar Motors" },
      {
        property: "og:description",
        content: "Valoración realizada por nuestro equipo y gestión completa de la transferencia.",
      },
    ],
  }),
  component: SellCarPage,
});

const STEPS = [
  { icon: Search, title: "Solicitas la valoración", text: "Completa el formulario con los datos y el estado real de tu vehículo." },
  { icon: BadgeCheck, title: "Inspeccionamos el coche", text: "Concertamos una revisión presencial para confirmar el estado." },
  { icon: HandCoins, title: "Recibes nuestra oferta", text: "Oferta de compra en firme, sin compromiso de aceptación." },
  { icon: FileSignature, title: "Cerramos la operación", text: "Contrato, pago y gestión de la transferencia a nuestro cargo." },
];

function SellCarPage() {
  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden border-b border-border">
        <img src={compramos} alt="Valoración de vehículo" className="absolute inset-0 size-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-page relative py-20">
          <p className="eyebrow">Compramos tu coche</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold uppercase leading-[1.05] md:text-5xl">
            Vende tu vehículo <span className="text-primary">sin complicaciones</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Sin anuncios, sin visitas de desconocidos y sin trámites. Nosotros valoramos, compramos y
            gestionamos la transferencia.
          </p>
        </div>
      </section>

      <section className="section-y border-b border-border bg-surface">
        <div className="container-page">
          <SectionHeading eyebrow="Proceso" title="Cuatro pasos, cero sorpresas" align="center" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="surface-card rounded-lg p-6">
                <s.icon className="size-6 text-primary" />
                <span className="mt-4 block font-display text-xs uppercase tracking-widest text-muted-foreground">
                  Paso {i + 1}
                </span>
                <h3 className="mt-1 font-display text-base font-bold uppercase">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm text-muted-foreground">
            <strong className="text-foreground">Importante:</strong> no ofrecemos valoraciones
            automáticas ni precios estimados por algoritmo. La oferta la realiza nuestro equipo tras
            revisar la información y el vehículo.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page max-w-4xl">
          <SectionHeading
            eyebrow="Valoración"
            title="Cuéntanos cómo es tu coche"
            description="Cinco pasos rápidos. Cuanta más información aportes, más precisa será nuestra oferta."
          />
          <div className="mt-8">
            <ValuationWizard />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
