import { useMemo, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EmptyState } from "@/components/common/states";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import {
  VehicleFilters,
  emptyFilters,
  type VehicleFilterState,
} from "@/components/vehicles/VehicleFilters";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/supabase";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

interface VehiclesListProps {
  vehicles: any[]; // Using any to avoid complex TS types right now, but should ideally be Vehicle[]
  defaultFilters?: Partial<VehicleFilterState>;
  title?: string;
  description?: string;
  eyebrow?: string;
}

export function VehiclesList({
  vehicles,
  defaultFilters = {},
  title = "Vehículos disponibles",
  description = "Todos nuestros vehículos se entregan revisados y con la garantía legal correspondiente. La financiación es orientativa y queda sujeta a aprobación de la entidad.",
  eyebrow = "Ocasión",
}: VehiclesListProps) {
  const [filters, setFilters] = useState<VehicleFilterState>({
    ...emptyFilters,
    ...defaultFilters,
  });

  const results = useMemo(() => {
    const list = vehicles.filter((v) => {
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
  }, [vehicles, filters]);

  return (
    <PublicLayout>
      <div className="container-page section-y">
        <SectionHeading
          as="h1"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <VehicleFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ ...emptyFilters, ...defaultFilters })}
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
                    <Button variant="hero" onClick={() => setFilters({ ...emptyFilters, ...defaultFilters })}>
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
