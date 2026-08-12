import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceCard } from "@/components/services/ServiceCard";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

export const Route = createFileRoute("/servicios/")({
  head: () => ({
    meta: [
      { title: "Servicios de taller y neumáticos — Neumacar Motors" },
      {
        name: "description",
        content:
          "Mecánica general, neumáticos, diagnosis electrónica, mantenimiento, Pre-ITV, frenos y aire acondicionado. Presupuesto sin compromiso.",
      },
      { property: "og:title", content: "Servicios — Neumacar Motors" },
      {
        property: "og:description",
        content: "Catálogo completo de servicios de taller mecánico y neumáticos.",
      },
    ],
  }),
  component: ServicesPage,
});

const CATEGORIES = ["Todos", "Mecánica", "Neumáticos", "Diagnóstico", "Mantenimiento", "Confort", "Inspección"] as const;

function ServicesPage() {
  const [category, setCategory] = useState<string>("Todos");
  const list = services.filter(
    (s) => s.active && (category === "Todos" || s.category === category),
  );

  return (
    <PublicLayout>
      <div className="container-page section-y">
        <SectionHeading
          as="h1"
          eyebrow="Servicios"
          title="Servicios de taller y neumáticos"
          description="Trabajamos con equipos de diagnosis multimarca y recambio original o equivalente homologado. Cada intervención se presupuesta antes de ejecutarse."
        />

        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              variant={category === c ? "hero" : "outline"}
              size="sm"
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No hay servicios en esta categoría"
              description="Prueba a seleccionar otra categoría."
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
