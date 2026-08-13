import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X, CalendarClock, MessageCircle } from "lucide-react";

import logo from "@/assets/logo-neumacar.png.asset.json";
import { site } from "@/config/site";
import { whatsapp } from "@/services/whatsapp";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/taller", label: "Taller" },
  { to: "/servicios", label: "Servicios" },
  { to: "/vehiculos", label: "Vehículos" },
  { to: "/vender-mi-coche", label: "Compramos tu coche" },
  { to: "/presupuesto", label: "Presupuesto" },
  { to: "/cita", label: "Cita" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/95 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-background/90 to-transparent"
      }`}
    >
      <div className="container-page grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:h-20 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={site.name}>
          <img
            src={logo.url}
            alt={`${site.name} logo`}
            width={48}
            height={48}
            className="h-9 w-auto shrink-0 md:h-12"
          />
          <span className="min-w-0 leading-none">
            <span className="block truncate font-display text-lg font-bold uppercase tracking-wide text-chrome md:text-xl">
              Neumacar <span className="text-primary">Motors</span>
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
              TALLER · NEUMÁTICOS · VEHICULOS DE&nbsp; OCASIÓN
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.phoneHref}
            className="flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            <Phone className="size-4 text-primary" />
            {site.phone}
          </a>
          <Button asChild variant="hero" size="lg">
            <Link to="/cita">Reservar cita</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild variant="ghost" size="icon" aria-label="Llamar">
            <a href={site.phoneHref}>
              <Phone />
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menú">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm border-border bg-surface p-0">
              <div className="flex items-center justify-between border-b border-border p-4">
                <SheetTitle className="font-display text-base uppercase tracking-widest">
                  Menú
                </SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <X />
                </Button>
              </div>
              <nav className="flex flex-col p-2" aria-label="Navegación móvil">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "text-primary" }}
                    className="rounded-md px-4 py-3 text-base font-medium text-foreground/90 hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/contacto"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-4 py-3 text-base font-medium text-foreground/90 hover:bg-accent"
                >
                  Contacto
                </Link>
                <Link
                  to="/acceso"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-4 py-3 text-base font-medium text-foreground/90 hover:bg-accent"
                >
                  Área cliente
                </Link>
              </nav>
              <div className="space-y-2 border-t border-border p-4">
                <Button asChild variant="hero" size="lg" className="w-full">
                  <Link to="/cita" onClick={() => setOpen(false)}>
                    <CalendarClock /> Reservar cita
                  </Link>
                </Button>
                <Button asChild variant="whatsapp" size="lg" className="w-full">
                  <a href={whatsapp.general()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href={site.phoneHref}>
                    <Phone /> {site.phone}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
