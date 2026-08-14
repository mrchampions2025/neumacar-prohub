import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LayoutDashboard, Car, Users, LogOut, CalendarClock, ExternalLink, ShieldCheck, FileSpreadsheet, Menu, X, Settings2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      if (!session && window.location.pathname !== "/admin/login") {
        navigate({ to: "/admin/login" });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && window.location.pathname !== "/admin/login") {
        navigate({ to: "/admin/login" });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-10 animate-spin text-red-600" />
          <p className="text-sm font-medium tracking-wide text-zinc-400">Cargando Panel Neumacar...</p>
        </div>
      </div>
    );
  }

  if (window.location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (!session) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/vehiculos", label: "Gestión Vehículos", icon: Car },
    { to: "/admin/citas", label: "Citas Taller", icon: CalendarClock },
    { to: "/admin/presupuestos", label: "Presupuestos", icon: FileSpreadsheet },
    { to: "/admin/leads", label: "Tasaciones y Solicitudes", icon: Users },
    { to: "/admin/ajustes", label: "Ajustes Generales", icon: Settings2 },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-950 text-zinc-100 selection:bg-red-500/30">
      {/* Mobile Top Header */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wider text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-900/30">
            <Car className="size-4 text-white" />
          </div>
          <span>Neumacar <span className="text-red-500">Motors</span></span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-300 hover:text-white hover:bg-zinc-800"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 md:shrink-0 bg-zinc-950/95 border-r border-zinc-800/80 flex flex-col z-40 transition-all duration-300 ${
          mobileNavOpen ? "block" : "hidden md:flex"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 hidden md:flex items-center px-6 border-b border-zinc-800/80 font-display text-xl font-bold tracking-wider text-white gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/40 border border-red-500/30">
            <Car className="size-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold leading-tight">NEUMACAR</span>
            <span className="text-xs font-semibold tracking-widest text-red-500 uppercase">Control Hub</span>
          </div>
        </div>

        {/* System Status Pill */}
        <div className="px-6 py-3 border-b border-zinc-900/80 bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistema en Línea
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">v2.4</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5 p-4 flex-1">
          <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase px-3 mb-1">Menú Principal</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-all duration-200 border border-transparent [&.active]:bg-gradient-to-r [&.active]:from-red-950/40 [&.active]:to-zinc-900/60 [&.active]:text-white [&.active]:border-red-600/40 [&.active]:shadow-md [&.active]:border-l-4 [&.active]:border-l-red-600"
              >
                <Icon className="size-4 text-zinc-400 group-hover:text-white transition-colors" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-zinc-900">
            <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase px-3 mb-1.5">Accesos Rápidos</p>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="size-3.5 text-zinc-500 group-hover:text-red-400" />
                Ver Web Pública
              </span>
              <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">↗</span>
            </a>
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-500 font-bold text-sm shadow-inner">
              <ShieldCheck className="size-5 text-red-500" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">Administrador</div>
              <div className="text-[11px] text-zinc-400 truncate">admin@neumacar.es</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center text-xs font-medium text-zinc-300 bg-zinc-900 border-zinc-700/80 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 shadow-sm gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-3.5" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950">
        {/* Top Header Bar */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <span className="text-zinc-500">Panel</span>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-semibold capitalize">
              {window.location.pathname.replace("/admin", "") || "Dashboard"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white gap-1.5"
            >
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink className="size-3" />
                Ir a la Web
              </a>
            </Button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto animate-fade-in-up">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

