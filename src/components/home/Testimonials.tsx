import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";

const testimonials = [
  {
    id: 1,
    name: "Carlos Martínez",
    role: "Comprador de MG4",
    content: "Trato inmejorable. Fui buscando un eléctrico y me asesoraron sin ningún tipo de presión. El coche me lo entregaron impecable y con todo el papeleo listo en 2 días.",
    rating: 5,
    initial: "C",
  },
  {
    id: 2,
    name: "Laura Gómez",
    role: "Tasación de vehículo",
    content: "Vendí mi antiguo Seat León con ellos y la tasación fue justa desde el primer momento. Nada de regateos absurdos de última hora. Muy profesionales.",
    rating: 5,
    initial: "L",
  },
  {
    id: 3,
    name: "David Ruiz",
    role: "Cliente de Taller",
    content: "Llevo mi coche a sus instalaciones para las revisiones y siempre me explican exactamente lo que van a hacer antes de darme el presupuesto. Confianza total.",
    rating: 5,
    initial: "D",
  },
];

export function Testimonials() {
  return (
    <section className="bg-zinc-950 py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Reseñas Reales"
          title="Lo que dicen nuestros clientes"
          description="La satisfacción de nuestros clientes es nuestro mejor aval. Descubre por qué eligen Neumacar Prohub para la compra, venta o mantenimiento de su vehículo."
          align="center"
          className="text-white"
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-lg backdrop-blur-sm transition-all hover:border-zinc-700"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-zinc-800" />
              <div>
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "fill-red-500 text-red-500" : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-zinc-300 leading-relaxed relative z-10 italic">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/20 text-lg font-bold text-red-500 ring-1 ring-red-500/50">
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-display font-bold text-white">{testimonial.name}</h4>
                  <p className="text-xs text-zinc-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
