import { createFileRoute } from "@tanstack/react-router";
import { VehiclesList } from "@/components/vehicles/VehiclesList";
import { fetchPublishedVehicles } from "@/data/vehicles";

export const Route = createFileRoute("/coches-segunda-mano-sevilla/")({
  head: () => ({
    meta: [
      { title: "Coches de segunda mano en Sevilla | Neumacar Motors" },
      {
        name: "description",
        content:
          "Stock de coches de segunda mano y vehículos de ocasión revisados en Sevilla. Coches, SUV y furgonetas con garantía, historial verificado y financiación disponible.",
      },
      { property: "og:title", content: "Coches de segunda mano en Sevilla | Neumacar Motors" },
      {
        property: "og:description",
        content: "Coches de segunda mano y ocasión revisados en Sevilla con garantía y financiación sujeta a aprobación.",
      },
    ],
  }),
  loader: async () => {
    const vehicles = await fetchPublishedVehicles();
    return { vehicles };
  },
  component: CochesSegundaManoPage,
});

function CochesSegundaManoPage() {
  const { vehicles } = Route.useLoaderData();

  return (
    <VehiclesList 
      vehicles={vehicles}
      title="Coches de segunda mano y ocasión en Sevilla"
      eyebrow="Nuestro Stock"
    />
  );
}
