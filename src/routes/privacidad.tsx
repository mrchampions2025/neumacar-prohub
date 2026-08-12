import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPage, LegalNotice } from "@/components/legal/LegalPage";
import { site } from "@/config/site";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad — Neumacar Motors" },
      {
        name: "description",
        content:
          "Información sobre el tratamiento de datos personales en Neumacar Motors: finalidad, base jurídica, conservación y derechos del interesado.",
      },
      { property: "og:title", content: "Política de privacidad — Neumacar Motors" },
      { property: "og:description", content: "Cómo tratamos tus datos personales." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicLayout>
      <LegalPage title="Política de privacidad" eyebrow="Legal">
        <LegalNotice />

        <h2>1. Responsable del tratamiento</h2>
        <p>
          {site.legalName}, con domicilio en {site.address}. Correo electrónico de contacto:{" "}
          {site.email}. Teléfono: {site.phone}. Los datos identificativos completos (denominación
          social, NIF y domicilio fiscal) deben completarse antes de la publicación del sitio.
        </p>

        <h2>2. Datos que tratamos</h2>
        <p>
          Tratamos los datos que nos facilitas a través de los formularios del sitio: nombre y
          apellidos, teléfono, correo electrónico, código postal, datos del vehículo (marca, modelo,
          matrícula, kilometraje, estado) y el contenido de tu mensaje. También podemos tratar datos
          derivados de la prestación del servicio de taller, como el historial de reparaciones.
        </p>

        <h2>3. Finalidad</h2>
        <ul>
          <li>Gestionar solicitudes de cita, presupuesto e información.</li>
          <li>Valorar vehículos y tramitar operaciones de compraventa.</li>
          <li>Prestar el servicio de taller y emitir la documentación asociada.</li>
          <li>Atender consultas y mantener el contacto necesario con el cliente.</li>
        </ul>

        <h2>4. Base jurídica</h2>
        <p>
          El consentimiento del interesado para las solicitudes de información y valoración; la
          ejecución de un contrato o precontrato para citas, reparaciones y compraventa; y el
          cumplimiento de obligaciones legales en materia fiscal, contable y de trazabilidad de
          reparaciones.
        </p>

        <h2>5. Conservación</h2>
        <p>
          Conservamos los datos durante el tiempo necesario para atender la solicitud y, cuando
          exista relación contractual, durante los plazos de prescripción legal aplicables
          (mercantil, fiscal y de garantía). Después se suprimen o se bloquean.
        </p>

        <h2>6. Destinatarios</h2>
        <p>
          No cedemos datos a terceros salvo obligación legal. Podemos comunicar datos a proveedores
          de servicios necesarios para la actividad (gestoría, entidades financieras en operaciones
          de financiación, servicios de mensajería o proveedores tecnológicos), siempre bajo
          contrato de encargo de tratamiento.
        </p>

        <h2>7. Derechos</h2>
        <p>
          Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del
          tratamiento y portabilidad escribiendo a {site.email}, acreditando tu identidad. También
          puedes presentar una reclamación ante la Agencia Española de Protección de Datos.
        </p>

        <h2>8. Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger la información.
          Mientras el sistema de gestión de datos no esté conectado, las solicitudes enviadas desde
          este sitio no se almacenan de forma permanente.
        </p>
      </LegalPage>
    </PublicLayout>
  );
}
