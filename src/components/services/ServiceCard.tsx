import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/data/services";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = (Icons[service.icon as keyof typeof Icons] ?? Icons.Wrench) as Icons.LucideIcon;

  return (
    <article className="surface-card group flex flex-col rounded-lg p-6 transition-colors hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-primary/12 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-6" />
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {service.category}
        </span>
      </div>

      <h3 className="mt-5 font-display text-xl font-bold uppercase leading-tight">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{service.short}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        {service.priceFrom !== null && (
          <span className="font-semibold text-gold-gradient">
            Desde {formatPrice(service.priceFrom)}
          </span>
        )}
        <span className="text-muted-foreground">{service.duration}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/servicios/$slug" params={{ slug: service.slug }}>
            Más información
          </Link>
        </Button>
        <Button asChild variant="hero" size="sm">
          <Link to="/presupuesto" search={{ servicio: service.slug }}>
            Solicitar presupuesto
          </Link>
        </Button>
      </div>
    </article>
  );
}
