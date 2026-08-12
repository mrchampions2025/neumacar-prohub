import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPage, LegalNotice } from "@/components/legal/LegalPage";
import { site } from "@/config/site";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({
    meta: [
      { title: "Aviso legal — Neumacar Motors" },
      {
        name: "description",
        content:
          "Aviso legal y condiciones de uso del sitio web de Neumacar Motors: titularidad, propiedad intelectual y responsabilidad.",
      },
      { property: "og:title", content: "Aviso legal — Neumacar Motors" },
      { property: "og:description", content: "Titularidad y condiciones de uso del sitio web." },
    ],
  }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
  return (
    <PublicLayout>
      <LegalPage title="Aviso legal" eyebrow="Legal">
        <LegalNotice />

        <h2>1. Titularidad del sitio</h2>
        <p>
          Este sitio web es titularidad de {site.legalName}, con domicilio en {site.address} y correo
          electrónico de contacto {site.email}. Los datos registrales y el NIF deben completarse antes
          de la publicación definitiva del sitio.
        </p>

        <h2>2. Objeto</h2>
        <p>
          El sitio ofrece información sobre los servicios de taller mecánico, venta y montaje de
          neumáticos y compraventa de vehículos, así como formularios para solicitar cita,
          presupuesto, información y valoración de vehículos.
        </p>

        <h2>3. Condiciones de uso</h2>
        <p>
          El usuario se compromete a utilizar el sitio de forma diligente y a facilitar información
          veraz en los formularios. El uso indebido, la introducción de datos falsos o cualquier
          conducta que perjudique el funcionamiento del sitio quedan prohibidos.
        </p>

        <h2>4. Propiedad intelectual</h2>
        <p>
          Los contenidos, marcas, logotipos y elementos gráficos del sitio están protegidos por la
          normativa de propiedad intelectual e industrial. No se permite su reproducción o
          explotación sin autorización expresa del titular.
        </p>

        <h2>5. Precios e información publicada</h2>
        <p>
          Los precios indicados como &laquo;desde&raquo; son orientativos y no constituyen oferta
          vinculante: el importe final se establece en el presupuesto emitido tras revisar el
          vehículo. Las simulaciones de financiación son estimaciones sin valor contractual y quedan
          sujetas a la aprobación de la entidad financiera.
        </p>

        <h2>6. Responsabilidad</h2>
        <p>
          El titular no responde de los daños derivados de interrupciones del servicio, errores u
          omisiones en los contenidos, ni del uso que el usuario haga de la información publicada.
        </p>

        <h2>7. Legislación aplicable</h2>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para cualquier controversia
          serán competentes los juzgados y tribunales que correspondan según la normativa aplicable.
        </p>
      </LegalPage>
    </PublicLayout>
  );
}
