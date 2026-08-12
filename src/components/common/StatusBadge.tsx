import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-primary/15 text-primary border-primary/30",
};

const map: Record<string, { label: string; tone: Tone }> = {
  // Vehículos en stock
  borrador: { label: "Borrador", tone: "neutral" },
  publicado: { label: "Disponible", tone: "success" },
  reservado: { label: "Reservado", tone: "warning" },
  vendido: { label: "Vendido", tone: "danger" },
  retirado: { label: "Retirado", tone: "neutral" },
  // Citas
  pendiente: { label: "Pendiente", tone: "warning" },
  confirmada: { label: "Confirmada", tone: "success" },
  en_taller: { label: "En taller", tone: "info" },
  finalizada: { label: "Finalizada", tone: "success" },
  cancelada: { label: "Cancelada", tone: "danger" },
  no_presentado: { label: "No presentado", tone: "danger" },
  // Presupuestos
  enviado: { label: "Enviado", tone: "info" },
  aceptado: { label: "Aceptado", tone: "success" },
  rechazado: { label: "Rechazado", tone: "danger" },
  expirado: { label: "Expirado", tone: "neutral" },
  // Valoraciones / compra
  recibida: { label: "Recibida", tone: "info" },
  en_revision: { label: "En revisión", tone: "warning" },
  pendiente_inspeccion: { label: "Pendiente de inspección", tone: "warning" },
  oferta_realizada: { label: "Oferta realizada", tone: "info" },
  aceptada: { label: "Aceptada", tone: "success" },
  rechazada: { label: "Rechazada", tone: "danger" },
  comprada: { label: "Comprada", tone: "success" },
  // Leads
  nuevo: { label: "Nuevo", tone: "info" },
  contactado: { label: "Contactado", tone: "warning" },
  negociacion: { label: "En negociación", tone: "warning" },
  convertido: { label: "Convertido", tone: "success" },
  perdido: { label: "Perdido", tone: "danger" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const entry = map[status] ?? { label: status, tone: "neutral" as Tone };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        toneClass[entry.tone],
        className,
      )}
    >
      {entry.label}
    </span>
  );
}
