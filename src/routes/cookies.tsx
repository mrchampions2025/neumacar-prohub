import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPage, LegalNotice } from "@/components/legal/LegalPage";
import { site } from "@/config/site";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies — Neumacar Motors" },
      {
        name: "description",
        content:
          "Información sobre el uso de cookies en el sitio web de Neumacar Motors y cómo gestionarlas desde tu navegador.",
      },
      { property: "og:title", content: "Política de cookies — Neumacar Motors" },
      { property: "og:description", content: "Uso de cookies y gestión de preferencias." },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <PublicLayout>
      <LegalPage title="Política de cookies" eyebrow="Legal">
        <LegalNotice />

        <h2>1. Qué son las cookies</h2>
        <p>
          Las cookies son pequeños archivos que se descargan en tu dispositivo al visitar una página
          web y permiten almacenar y recuperar información sobre la navegación.
        </p>

        <h2>2. Cookies utilizadas actualmente</h2>
        <p>
          En su estado actual, este sitio no utiliza cookies de analítica, publicidad ni seguimiento
          de terceros. Únicamente podrían emplearse cookies técnicas estrictamente necesarias para
          el funcionamiento de la navegación, que están exentas de consentimiento.
        </p>

        <h2>3. Cookies previstas</h2>
        <p>
          Cuando se activen funcionalidades adicionales (analítica de visitas, mapas incrustados,
          área de cliente con sesión o herramientas de marketing), esta política se actualizará con
          el detalle de cada cookie —titular, finalidad y duración— y se implantará un banner de
          consentimiento previo que permita aceptar, rechazar y configurar cada categoría.
        </p>

        <h2>4. Cómo gestionar las cookies</h2>
        <p>
          Puedes configurar, bloquear o eliminar las cookies desde las opciones de privacidad de tu
          navegador (Chrome, Firefox, Safari, Edge). Bloquear las cookies técnicas puede afectar al
          funcionamiento de algunas partes del sitio.
        </p>

        <h2>5. Contacto</h2>
        <p>Para cualquier duda sobre esta política puedes escribirnos a {site.email}.</p>
      </LegalPage>
    </PublicLayout>
  );
}
