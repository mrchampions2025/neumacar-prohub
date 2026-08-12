import { Link } from "@tanstack/react-router";
import { Fuel, Gauge, Calendar, Cog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatKm, formatPrice, monthlyQuota } from "@/lib/format";
import { vehicleTitle, type StockVehicle } from "@/data/vehicles";

export function VehicleCard({ vehicle }: { vehicle: StockVehicle }) {
  const quota = Math.round(monthlyQuota(vehicle.price * 0.8, 84));

  return (
    <article className="surface-card group flex flex-col overflow-hidden rounded-lg transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <img
          src={vehicle.images[0]}
          alt={vehicleTitle(vehicle)}
          width={1200}
          height={800}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {vehicle.isNew && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-primary-foreground">
              Nuevo
            </span>
          )}
          {vehicle.isOffer && (
            <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gold-foreground">
              Oferta
            </span>
          )}
        </div>
        {vehicle.status !== "publicado" && (
          <div className="absolute right-3 top-3">
            <StatusBadge status={vehicle.status} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold uppercase leading-tight">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{vehicle.version}</p>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0 text-primary" />
            <dd>{vehicle.year}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="size-4 shrink-0 text-primary" />
            <dd>{formatKm(vehicle.mileage)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="size-4 shrink-0 text-primary" />
            <dd>{vehicle.fuel}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Cog className="size-4 shrink-0 text-primary" />
            <dd>
              {vehicle.transmission} · {vehicle.power} CV
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="font-display text-2xl font-bold text-foreground">
              {formatPrice(vehicle.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              Financiado desde {formatPrice(quota)}/mes*
            </p>
          </div>
        </div>

        <Button asChild variant="hero" className="mt-4 w-full">
          <Link to="/vehiculos/$vehicleId" params={{ vehicleId: vehicle.id }}>
            Ver vehículo
          </Link>
        </Button>
      </div>
    </article>
  );
}
