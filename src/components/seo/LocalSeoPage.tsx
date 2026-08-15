import { Link } from "@tanstack/react-router";
import { 
  Wrench, ScanSearch, FileText, ShieldCheck, Clock, Droplet, 
  CheckCircle2, RotateCcw, Eye, Cog, Disc, Car, ShieldAlert, 
  Activity, Droplets, Snowflake, Search, Wind, Cpu, CheckSquare, 
  Smile, MapPin, Phone, Star, ArrowRight, Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteForm } from "@/components/forms/QuoteForm";
import type { LocalSeoLandingConfig } from "@/data/localSeoLandingData";

const iconMap: Record<string, any> = {
  Wrench, ScanSearch, FileText, ShieldCheck, Clock, Droplet,
  CheckCircle2, RotateCcw, Eye, Cog, Disc, Car, ShieldAlert,
  Activity, Droplets, Snowflake, Search, Wind, Cpu, CheckSquare, Smile
};

export function LocalSeoPage({ config }: { config: LocalSeoLandingConfig }) {
  // Schema.org JSON-LD local business structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": `NeumaCar Motors - ${config.title}`,
    "image": config.heroImage,
    "telephone": "+34954000000",
    "email": "info@neumacarmotors.es",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Principal Sevilla, 45",
      "addressLocality": "Sevilla",
      "postalCode": "41001",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 37.3890924,
      "longitude": -5.9844589
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:30",
        "closes": "20:00"
      }
    ],
    "priceRange": "€€",
    "description": config.metaDescription
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card to-background py-16 md:py-24">
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <MapPin className="size-3.5" />
                <span>{config.badge}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
                {config.heroHeadline}
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg md:text-xl">
                {config.heroSubheadline}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button asChild size="xl" variant="hero" className="shadow-lg shadow-red-500/20">
                  <a href="#solicitar-presupuesto">
                    Solicitar Presupuesto Gratis <ArrowRight className="ml-2 size-5" />
                  </a>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <Link to="/cita" search={{ service: config.serviceId }}>
                    Pedir Cita Online
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-muted-foreground border-t border-border/50">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5 Reseñas Google en Sevilla</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="size-4 text-green-500" />
                  <span>Desde {config.priceFrom}€ IVA incl.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="size-4 text-green-500" />
                  <span>Garantía por escrito</span>
                </div>
              </div>
            </div>

            {/* Imagen Principal de Hero */}
            <div className="relative lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
                <img 
                  src={config.heroImage} 
                  alt={config.title}
                  className="h-full w-full object-cover min-h-[320px] max-h-[460px] transition-transform duration-500 hover:scale-105" 
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl border border-border bg-card/95 p-4 backdrop-blur shadow-xl hidden sm:block">
                <p className="text-xs text-muted-foreground">Servicio disponible en:</p>
                <p className="text-sm font-bold text-white">Sevilla Capital y Aljarafe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características y Ventajas del Servicio */}
      <section className="py-16 bg-card/40 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              ¿Por qué elegir NeumaCar Motors en Sevilla?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Transparencia total, repuestos homologados de calidad original y los mejores tiempos de respuesta.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {config.features.map((feat, i) => {
              const IconComp = iconMap[feat.icon] || Wrench;
              return (
                <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                    <IconComp className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cobertura por Barrios en Sevilla */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-border bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <MapPin className="size-5 text-primary" /> Cobertura y Atención Local en Sevilla
                </h3>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Atendemos conductores de todos los distritos y municipios de Sevilla:
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {config.neighborhoods.map((barrio, idx) => (
                    <span key={idx} className="rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                      {barrio}
                    </span>
                  ))}
                </div>
              </div>
              <Button asChild variant="hero">
                <Link to="/contacto">Ver Ubicación en Mapa</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Presupuesto Integrado */}
      <section id="solicitar-presupuesto" className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Presupuesto Online en Sevilla</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Solicita tu Presupuesto Personalizado
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Completa tus datos y los de tu vehículo. Te respondemos con presupuesto cerrado en menos de 2 horas lectivas.
              </p>
            </div>
            
            <QuoteForm defaultService={config.serviceId} />
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes (FAQs SEO) */}
      {config.faqs && config.faqs.length > 0 && (
        <section className="py-16 bg-card/30 border-t border-border">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Preguntas Frecuentes ({config.title})
            </h2>
            <div className="space-y-4">
              {config.faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-5">
                  <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
