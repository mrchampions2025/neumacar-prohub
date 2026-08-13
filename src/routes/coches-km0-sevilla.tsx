import { createFileRoute } from "@tanstack/react-router";
import { VehiclesList } from "@/components/vehicles/VehiclesList";
import { fetchPublishedVehicles } from "@/data/vehicles";

export const Route = createFileRoute("/coches-km0-sevilla")({
  head: () => ({
    meta: [
      { title: "Coches KM0 en Sevilla | Neumacar Motors" },
      {
        name: "description",
        content:
          "Encuentra los mejores coches KM0 y seminuevos en Sevilla. Vehículos prácticamente nuevos con un gran descuento respecto a concesionario oficial.",
      },
    ],
  }),
  loader: async () => {
    const vehicles = await fetchPublishedVehicles();
    return { vehicles };
  },
  component: CochesKM0Page,
});

function CochesKM0Page() {
  const { vehicles } = Route.useLoaderData();

  return (
    <VehiclesList 
      vehicles={vehicles}
      defaultFilters={{ maxMileage: "20000" }}
      title="Coches KM0 y Seminuevos en Sevilla"
      eyebrow="Casi Nuevos"
    />
  );
}
