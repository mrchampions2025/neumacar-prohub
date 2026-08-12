import type { ReactNode } from "react";
import { Loader2, Inbox, CheckCircle2, Clock3 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ label = "Cargando…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground"
    >
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card overflow-hidden rounded-lg">
          <Skeleton className="aspect-[3/2] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center justify-center rounded-lg px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
        {icon ?? <Inbox className="size-6" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/**
 * Confirmación honesta de envío: hoy no existe backend conectado, por lo que se
 * indica que la solicitud queda pendiente de registro real.
 */
export function SubmittedState({
  title,
  description,
  reference,
  pendingBackend = true,
  action,
}: {
  title: string;
  description: string;
  reference?: string;
  pendingBackend?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card rounded-lg p-8 text-center">
      <div className="mx-auto mb-4 w-fit rounded-full bg-primary/15 p-4">
        <CheckCircle2 className="size-7 text-primary" />
      </div>
      <h2 className="text-2xl font-bold uppercase">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">{description}</p>
      {reference && (
        <p className="mt-4 font-mono text-sm text-gold-gradient">Referencia: {reference}</p>
      )}
      {pendingBackend && (
        <p className="mx-auto mt-6 flex max-w-lg items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-left text-xs text-muted-foreground">
          <Clock3 className="mt-0.5 size-4 shrink-0 text-warning" />
          <span>
            <strong className="text-foreground">Pendiente de conexión de base de datos.</strong> La
            plataforma todavía no tiene backend activo, por lo que esta solicitud no queda
            registrada ni se ha enviado ningún email o WhatsApp. Para contactar ahora mismo, usa el
            teléfono o WhatsApp.
          </span>
        </p>
      )}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
