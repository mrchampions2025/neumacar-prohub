import { createFileRoute } from "@tanstack/react-router";
import { VehiclesList } from "@/components/vehicles/VehiclesList";
import { fetchPublishedVehicles } from "@/data/vehicles";

export const Route = createFileRoute("/coches-baratos-sevilla")({
  head: () => ({
    meta: [
      { title: "Coches baratos en Sevilla | Neumacar Motors" },
      {
        name: "description",
        content:
          "Encuentra coches baratos y económicos de segunda mano en Sevilla. Vehículos a buen precio totalmente revisados y garantizados.",
      },
    ],
  }),
  loader: async () => {
    const vehicles = await fetchPublishedVehicles();
    return { vehicles };
  },
  component: CochesBaratosPage,
});

function CochesBaratosPage() {
  const { vehicles } = Route.useLoaderData();

  return (
    <VehiclesList 
      vehicles={vehicles}
      defaultFilters={{ maxPrice: "10000" }}
      title="Coches Baratos en Sevilla"
      eyebrow="Oportunidades"
    />
  );
}
