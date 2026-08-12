import { createFileRoute, Link } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Preguntas frecuentes — Neumacar Motors" },
      {
        name: "description",
        content:
          "Dudas sobre citas, presupuestos, garantías, neumáticos, ITV, financiación y compra de vehículos en Neumacar Motors.",
      },
      { property: "og:title", content: "Preguntas frecuentes — Neumacar Motors" },
      { property: "og:description", content: "Respuestas a las dudas más habituales de nuestros clientes." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PublicLayout>
      <div className="container-page section-y max-w-3xl">
        <SectionHeading
          as="h1"
          eyebrow="Ayuda"
          title="Preguntas frecuentes"
          description="Si no encuentras tu respuesta, escríbenos y te la resolvemos personalmente."
        />
        <Accordion type="single" collapsible className="mt-10 w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="hero" size="lg">
            <Link to="/contacto">Contactar</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/presupuesto">Pedir presupuesto</Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
