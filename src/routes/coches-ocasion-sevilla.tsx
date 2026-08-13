import { createFileRoute } from "@tanstack/react-router";
import { VehiclesList } from "@/components/vehicles/VehiclesList";
import { fetchPublishedVehicles } from "@/data/vehicles";

export const Route = createFileRoute("/coches-ocasion-sevilla")({
  head: () => ({
    meta: [
      { title: "Coches de ocasión en Sevilla | Neumacar Motors" },
      {
        name: "description",
        content:
          "Encuentra los mejores coches de ocasión en Sevilla. Vehículos 100% revisados, con la mejor garantía y financiación a tu medida.",
      },
    ],
  }),
  loader: async () => {
    const vehicles = await fetchPublishedVehicles();
    return { vehicles };
  },
  component: CochesOcasionPage,
});

function CochesOcasionPage() {
  const { vehicles } = Route.useLoaderData();

  return (
    <VehiclesList 
      vehicles={vehicles}
      title="Coches de ocasión en Sevilla"
      eyebrow="Ocasión Garantizada"
    />
  );
}
