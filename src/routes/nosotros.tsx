import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, ShieldCheck, Wrench } from "lucide-react";
import heroTaller from "@/assets/hero-taller.jpg";

export const Route = createFileRoute("/nosotros")({
  component: Nosotros,
});

function Nosotros() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent z-10" />
          <img
            src={heroTaller}
            alt="Concesionario Neumacar"
            className="h-full w-full object-cover opacity-40"
          />
        </div>
        <div className="container-page relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="mb-4 inline-block rounded-full bg-red-600/10 px-3 py-1 text-xs font-semibold tracking-wider text-red-500 ring-1 ring-red-600/20">
              MÁS DE 20 AÑOS DE EXPERIENCIA
            </span>
            <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
              Pasión por el motor, <br />
              <span className="text-red-600">Compromiso</span> contigo.
            </h1>
            <p className="mt-6 text-lg text-zinc-300 leading-relaxed max-w-2xl">
              En Neumacar Motor's no solo vendemos coches; seleccionamos minuciosamente cada vehículo para garantizar que te lleves calidad, seguridad y tranquilidad. Somos tu concesionario de confianza en Sevilla.
            </p>
          </div>
        </div>
      </section>

      {/* Valores / Por qué elegirnos */}
      <section className="bg-surface py-20 lg:py-28 border-y border-border">
        <div className="container-page">
          <SectionHeading
            eyebrow="Nuestros Valores"
            title="¿Por qué elegir Neumacar?"
            description="Nos esforzamos por ofrecer una experiencia de compra transparente y profesional, acompañándote en cada paso del proceso."
            align="center"
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Garantía Total",
                description: "Todos nuestros vehículos incluyen garantía propia de 1 año con cobertura a nivel nacional."
              },
              {
                icon: Wrench,
                title: "Revisión Exhaustiva",
                description: "Revisamos más de 100 puntos críticos en nuestro propio taller antes de poner cualquier coche a la venta."
              },
              {
                icon: CheckCircle2,
                title: "Transparencia",
                description: "Kilometraje certificado y ausencia de golpes estructurales por escrito en todos nuestros contratos."
              },
              {
                icon: MapPin,
                title: "Trato Local y Cercano",
                description: "Ubicados en Sevilla, con un equipo dispuesto a asesorarte sin compromiso ni presiones."
              }
            ].map((feature, i) => (
              <div key={i} className="surface-card rounded-2xl p-6 transition-all hover:shadow-lg hover:border-red-500/30">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500 ring-1 ring-red-600/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Taller e Instalaciones */}
      <section className="bg-zinc-950 py-20 lg:py-28">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 relative aspect-square overflow-hidden rounded-3xl lg:aspect-auto lg:h-[600px] border border-border">
              <img
                src="https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&q=80&w=1200"
                alt="Nuestro taller y equipo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <SectionHeading
                eyebrow="Instalaciones"
                title="Taller Propio y Servicio Integral"
              />
              <p className="text-muted-foreground leading-relaxed">
                La diferencia de comprar en Neumacar Motor's es que no dependemos de terceros para poner a punto nuestros vehículos. Contamos con instalaciones de taller propias equipadas con la última tecnología de diagnosis.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Esto nos permite tener un control absoluto sobre el estado mecánico de cada coche que entra en nuestra exposición. Si un vehículo no supera nuestros estrictos estándares de calidad, simplemente no lo vendemos.
              </p>
              <ul className="space-y-3 text-muted-foreground font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500" /> Diagnosis avanzada multimarca
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500" /> Pre-entrega minuciosa
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-red-500" /> Servicio post-venta rápido y eficaz
                </li>
              </ul>
              <div className="pt-4">
                <Button variant="hero" asChild>
                  <Link to="/taller">Conoce nuestros servicios de taller</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-zinc-950 py-20 text-center">
        <div className="container-page max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold uppercase text-white mb-6">
            ¿Listo para encontrar tu próximo coche?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Visítanos en nuestras instalaciones o explora nuestro stock online. Si no encuentras lo que buscas, nosotros te lo conseguimos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/coches-segunda-mano-sevilla">Ver Stock de Vehículos</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-zinc-700 text-white hover:bg-zinc-800" asChild>
              <Link to="/contacto">Contactar con nosotros</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
