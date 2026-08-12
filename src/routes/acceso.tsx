import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, ShieldCheck } from "lucide-react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/acceso")({
  head: () => ({
    meta: [
      { title: "Área de cliente — Neumacar Motors" },
      {
        name: "description",
        content:
          "Área de cliente de Neumacar Motors: consulta el estado de tus citas, presupuestos y solicitudes de valoración.",
      },
      { property: "og:title", content: "Área de cliente — Neumacar Motors" },
      { property: "og:description", content: "Consulta el estado de tus citas y solicitudes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccessPage,
});

function AccessPage() {
  return (
    <PublicLayout>
      <div className="container-page section-y max-w-xl">
        <div className="surface-card rounded-lg p-8 text-center">
          <div className="mx-auto w-fit rounded-full bg-primary/15 p-4">
            <KeyRound className="size-6 text-primary" />
          </div>
          <h1 className="mt-5 text-2xl font-bold uppercase">Área de cliente</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            El acceso de clientes todavía no está activo. Cuando conectemos la base de datos y el
            sistema de cuentas, podrás iniciar sesión aquí para consultar el estado de tus citas,
            presupuestos y solicitudes de valoración, así como el historial de tu vehículo.
          </p>
          <div className="mt-6 flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-left text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-warning" />
            <span>
              <strong className="text-foreground">Pendiente de activación.</strong> No introduzcas
              datos de acceso: aún no existe autenticación real y ningún formulario de login estaría
              protegido.
            </span>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/contacto">Contactar con el taller</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
