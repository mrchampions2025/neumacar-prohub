import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { SectionHeading } from "@/components/common/SectionHeading";

/**
 * Envoltorio de páginas legales. Los textos son plantillas orientativas y deben
 * ser revisados por un profesional antes de publicar el sitio.
 */
export function LegalPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page section-y max-w-3xl">
      <SectionHeading as="h1" title={title} {...(eyebrow ? { eyebrow } : {})} />
      <div className="legal-prose mt-10">{children}</div>
    </div>
  );
}

export function LegalNotice() {
  return (
    <div className="not-prose mb-8 flex items-start gap-3 rounded-md border border-warning/40 bg-warning/10 p-4 text-sm text-muted-foreground">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
      <span>
        <strong className="text-foreground">Texto pendiente de validación jurídica.</strong> Este
        contenido es una plantilla orientativa: debe completarse con los datos registrales de la
        empresa y ser revisado por un profesional antes de publicarse.
      </span>
    </div>
  );
}
