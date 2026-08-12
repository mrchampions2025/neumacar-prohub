import { Link } from "@tanstack/react-router";
import { Phone, MessageCircle, CalendarClock } from "lucide-react";

import { site } from "@/config/site";
import { whatsapp } from "@/services/whatsapp";

/** CTA fija en móvil: llamar, WhatsApp y reservar cita. */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      <a
        href={site.phoneHref}
        className="flex flex-col items-center gap-1 py-2.5 text-xs font-medium text-foreground"
      >
        <Phone className="size-5 text-primary" />
        Llamar
      </a>
      <a
        href={whatsapp.general()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 border-x border-border py-2.5 text-xs font-medium text-foreground"
      >
        <MessageCircle className="size-5 text-success" />
        WhatsApp
      </a>
      <Link
        to="/cita"
        className="flex flex-col items-center gap-1 bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        <CalendarClock className="size-5" />
        Cita
      </Link>
    </div>
  );
}
