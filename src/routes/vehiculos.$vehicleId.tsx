import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Fuel, Gauge, MessageCircle, Settings2, Calendar } from "lucide-react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { FinanceCalculator } from "@/components/vehicles/FinanceCalculator";
import { TestDriveDialog } from "@/components/forms/TestDriveDialog";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchVehicleById, vehicleTitle } from "@/data/vehicles";
import { whatsapp } from "@/services/whatsapp";

export const Route = createFileRoute("/vehiculos/$vehicleId")({
  loader: async ({ params }) => {
    const vehicle = await fetchVehicleById(params.vehicleId);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Vehículo no disponible — Neumacar Motors" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { vehicle } = loaderData;
    const title = vehicleTitle(vehicle);
    const description = `${title} · ${vehicle.year} · ${vehicle.mileage.toLocaleString("es-ES")} km · ${vehicle.fuel}. Vehículo de ocasión revisado en Neumacar Motors.`;
    return {
      meta: [
        { title: `${title} — Neumacar Motors` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} — Neumacar Motors` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: VehicleDetail,
  notFoundComponent: VehicleNotFound,
});

function VehicleNotFound() {
  return (
    <PublicLayout>
      <div className="container-page section-y">
        <EmptyState
          title="Vehículo no encontrado"
          description="Este vehículo ya no está disponible o ha sido vendido."
          action={
            <Button asChild variant="hero">
              <Link to="/vehiculos">Ver stock disponible</Link>
            </Button>
          }
        />
      </div>
    </PublicLayout>
  );
}

const euro = (n: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

function VehicleDetail() {
  const { vehicle } = Route.useLoaderData();
  const title = vehicleTitle(vehicle);

  const specs = [
    { label: "Año", value: String(vehicle.year), icon: Calendar },
    { label: "Kilómetros", value: `${vehicle.mileage.toLocaleString("es-ES")} km`, icon: Gauge },
    { label: "Combustible", value: vehicle.fuel, icon: Fuel },
    { label: "Cambio", value: vehicle.transmission, icon: Settings2 },
  ];

  const details = [
    ["Potencia", `${vehicle.power} CV`],
    ["Cilindrada", `${vehicle.displacement} cc`],
    ["Puertas", String(vehicle.doors)],
    ["Plazas", String(vehicle.seats)],
    ["Color", vehicle.color],
    ["Carrocería", vehicle.bodyType],
    ["Etiqueta ambiental", vehicle.envLabel],
  ];

  return (
    <PublicLayout>
      <div className="container-page section-y">
        <Link
          to="/vehiculos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Volver al stock
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <VehicleGallery images={vehicle.images} title={title} />

            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                {vehicle.status === "reservado" && <Badge variant="secondary">Reservado</Badge>}
                {vehicle.isOffer && <Badge>Oferta</Badge>}
                <Badge variant="outline">Etiqueta {vehicle.envLabel}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold uppercase leading-tight md:text-4xl">
                {title}
              </h1>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {specs.map((s) => (
                  <div key={s.label} className="surface-card rounded-md p-4">
                    <s.icon className="size-4 text-primary" />
                    <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="font-display text-sm font-bold">{s.value}</p>
                  </div>
                ))}
              </div>

              <h2 className="mt-10 font-display text-xl font-bold uppercase">Descripción</h2>
              <p className="mt-3 text-sm text-muted-foreground">{vehicle.description}</p>

              <h2 className="mt-10 font-display text-xl font-bold uppercase">Ficha técnica</h2>
              <dl className="mt-4 divide-y divide-border rounded-lg border border-border">
                {details.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>

              <h2 className="mt-10 font-display text-xl font-bold uppercase">Equipamiento</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {vehicle.equipment.map((e) => (
                  <li key={e} className="text-sm text-muted-foreground">
                    · {e}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-xl font-bold uppercase">
                Estado del vehículo
              </h2>
              <dl className="mt-4 divide-y divide-border rounded-lg border border-border">
                {[
                  ["Estado general", vehicle.condition.general],
                  ["ITV", vehicle.condition.itv],
                  ["Mantenimiento", vehicle.condition.maintenance],
                  ["Neumáticos", vehicle.condition.tyres],
                  ["Frenos", vehicle.condition.brakes],
                  ["Historial", vehicle.condition.history],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card rounded-lg p-6">
              <p className="text-sm text-muted-foreground">Precio al contado</p>
              <p className="font-display text-4xl font-bold text-primary">{euro(vehicle.price)}</p>
              {vehicle.financePrice && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {euro(vehicle.financePrice)} financiado
                </p>
              )}
              <Separator className="my-5" />
              <div className="flex flex-col gap-3">
                <TestDriveDialog
                  intent="prueba"
                  vehicleTitle={title}
                  trigger={
                    <Button variant="hero" size="lg">
                      Solicitar prueba
                    </Button>
                  }
                />
                <TestDriveDialog
                  intent="reserva"
                  vehicleTitle={title}
                  trigger={
                    <Button variant="chrome" size="lg" disabled={vehicle.status === "reservado"}>
                      {vehicle.status === "reservado" ? "Vehículo reservado" : "Reservar vehículo"}
                    </Button>
                  }
                />
                <Button asChild variant="whatsapp" size="lg">
                  <a href={whatsapp.vehicle(title)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> Consultar por WhatsApp
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Precio con impuestos incluidos. Gastos de gestión y transferencia no incluidos salvo
                indicación expresa.
              </p>
            </div>

            <FinanceCalculator price={vehicle.price} />
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
