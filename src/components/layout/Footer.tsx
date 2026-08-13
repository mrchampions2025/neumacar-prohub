import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Music2, Phone, Mail, MapPin, Clock } from "lucide-react";

import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/logo-neumacar.png"
              alt="Neumacar Motors"
              className="h-10 w-auto object-contain"
            />
            <span className="font-display text-lg font-bold uppercase tracking-wide text-chrome">
              Neumacar <span className="text-primary">Motors</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{site.tagline}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gold-gradient">{site.claim}</p>
          <div className="mt-5 flex gap-3">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <Facebook className="size-4" />
            </a>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <Music2 className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-foreground">
            Servicios
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {[
              { to: "/taller", label: "Taller" },
              { to: "/servicios", label: "Servicios" },
              { to: "/neumaticos", label: "Neumáticos" },
              { to: "/vehiculos", label: "Vehículos de ocasión" },
              { to: "/vender-mi-coche", label: "Comprar mi coche" },
              { to: "/presupuesto", label: "Presupuesto" },
              { to: "/cita", label: "Reservar cita" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-foreground">
            Contacto
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2 hover:text-primary">
                <Phone className="size-4 shrink-0 text-primary" /> {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 hover:text-primary"
              >
                <Mail className="size-4 shrink-0 text-primary" /> {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {site.address}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm uppercase tracking-[0.2em] text-foreground">
            Horario
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {site.schedule.map((s) => (
              <li key={s.days} className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <span className="block text-foreground">{s.days}</span>
                  {s.hours}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. Todos los derechos reservados.
          </p>
          <nav className="flex flex-wrap gap-4" aria-label="Enlaces legales">
            <Link to="/aviso-legal" className="hover:text-primary">
              Aviso legal
            </Link>
            <Link to="/privacidad" className="hover:text-primary">
              Privacidad
            </Link>
            <Link to="/cookies" className="hover:text-primary">
              Cookies
            </Link>
            <Link to="/faq" className="hover:text-primary">
              FAQ
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
