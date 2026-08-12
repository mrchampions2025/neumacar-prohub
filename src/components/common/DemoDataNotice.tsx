import { Info } from "lucide-react";

/** Aviso explícito de que el contenido mostrado es de demostración. */
export function DemoDataNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-gold" />
      <span>
        {children ?? (
          <>
            <strong className="text-foreground">Datos de demostración.</strong> Este contenido es de
            ejemplo para visualizar la interfaz y se sustituirá por datos reales al conectar la base
            de datos.
          </>
        )}
      </span>
    </p>
  );
}
