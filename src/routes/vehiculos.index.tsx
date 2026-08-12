import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DemoDataNotice } from "@/components/common/DemoDataNotice";
import { EmptyState } from "@/components/common/states";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import {
  VehicleFilters,
  emptyFilters,
  type VehicleFilterState,
} from "@/components/vehicles/VehicleFilters";
import { Button } from "@/components/ui/button";
import { stockVehicles } from "@/data/vehicles";

export const Route = createFileRoute("/vehiculos/")({
  head: () => ({
    meta: [
      { title: "Vehículos de ocasión — Neumacar Motors" },
      {
        name: "description",
        content:
          "Stock de vehículos de ocasión revisados: coches, SUV y furgonetas con garantía, historial verificado y financiación disponible.",
      },
      { property: "og:title", content: "Vehículos de ocasión — Neumacar Motors" },
      {
        property: "og:description",
        content: "Coches de ocasión revisados con garantía y financiación sujeta a aprobación.",
      },
    ],
  }),
  component: VehiclesPage,
});

function VehiclesPage() {
  const [filters, setFilters] = useState<VehicleFilterState>(emptyFilters);

  const results = useMemo(() => {
    const list = stockVehicles.filter((v) => {
      if (v.status !== "publicado" && v.status !== "reservado") return false;
      if (filters.brand !== "all" && v.brand !== filters.brand) return false;
      if (filters.fuel !== "all" && v.fuel !== filters.fuel) return false;
      if (filters.transmission !== "all" && v.transmission !== filters.transmission) return false;
      if (filters.bodyType !== "all" && v.bodyType !== filters.bodyType) return false;
      if (filters.minPrice && v.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && v.price > Number(filters.maxPrice)) return false;
      if (filters.maxMileage && v.mileage > Number(filters.maxMileage)) return false;
      if (filters.minYear && v.year < Number(filters.minYear)) return false;
      return true;
    });

    switch (filters.sort) {
      case "precio_asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "precio_desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "km_asc":
        return [...list].sort((a, b) => a.mileage - b.mileage);
      case "year_desc":
        return [...list].sort((a, b) => b.year - a.year);
      default:
        return list;
    }
  }, [filters]);

  return (
    <PublicLayout>
      <div className="container-page section-y">
        <SectionHeading
          as="h1"
          eyebrow="Ocasión"
          title="Vehículos disponibles"
          description="Todos nuestros vehículos se entregan revisados y con la garantía legal correspondiente. La financiación es orientativa y queda sujeta a aprobación de la entidad."
        />
        <DemoDataNotice>
          Stock de demostración. Al conectar la base de datos, el inventario real se gestionará desde
          el panel de administración.
        </DemoDataNotice>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <VehicleFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters(emptyFilters)}
          />

          <div>
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "vehículo" : "vehículos"} encontrados
            </p>
            {results.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="Sin resultados"
                  description="No hay vehículos que coincidan con los filtros seleccionados."
                  action={
                    <Button variant="hero" onClick={() => setFilters(emptyFilters)}>
                      Quitar filtros
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
