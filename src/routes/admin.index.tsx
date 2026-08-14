import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Car, Users, CalendarClock, TrendingUp, PlusCircle, ArrowUpRight, ShieldAlert, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    vehicles: 0,
    leads: 0,
    appointments: 0,
    quotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const { count: vCount } = await supabase
          .from("stock_vehicles")
          .select("*", { count: "exact", head: true });

        const { count: lCount } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true });

        const { count: aCount } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("type", "cita");

        const { count: qCount } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("type", "presupuesto");

        setStats({
          vehicles: vCount || 0,
          leads: lCount || 0,
          appointments: aCount || 0,
          quotes: qCount || 0,
        });
      } catch (err) {
        console.error("Error cargando estadísticas del dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    {
      title: "Stock de Vehículos",
      value: stats.vehicles,
      icon: Car,
      color: "from-blue-600 to-indigo-600",
      glowColor: "shadow-blue-900/30",
      textColor: "text-blue-400",
      trend: "+ Activos",
      link: "/admin/vehiculos",
    },
    {
      title: "Citas en Taller",
      value: stats.appointments,
      icon: CalendarClock,
      color: "from-amber-500 to-orange-600",
      glowColor: "shadow-amber-900/30",
      textColor: "text-amber-400",
      trend: "Pendientes hoy",
      link: "/admin/citas",
    },
    {
      title: "Tasaciones y Solicitudes",
      value: stats.leads,
      icon: Users,
      color: "from-red-600 to-rose-700",
      glowColor: "shadow-red-900/30",
      textColor: "text-red-400",
      trend: "Total recibidas",
      link: "/admin/leads",
    },
    {
      title: "Presupuestos Solicitados",
      value: stats.quotes,
      icon: TrendingUp,
      color: "from-emerald-600 to-teal-700",
      glowColor: "shadow-emerald-900/30",
      textColor: "text-emerald-400",
      trend: "En revisión",
      link: "/admin/presupuestos",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
            Dashboard General <Sparkles className="size-5 text-red-500" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Resumen operativo y control en tiempo real de Neumacar Motors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-900/30 font-semibold gap-2 border border-red-500/30"
          >
            <Link to="/admin/vehiculos/nuevo">
              <PlusCircle className="size-4" />
              Nuevo Vehículo
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="glass-panel-dark rounded-2xl p-6 hover-card-lift block relative overflow-hidden group border border-zinc-800/90"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {card.title}
                </span>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md ${card.glowColor}`}
                >
                  <Icon className="size-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-4xl font-extrabold text-white tracking-tight font-display">
                  {loading ? "..." : card.value}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-900/80 border border-zinc-800 ${card.textColor}`}>
                  {card.trend}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                <span>Gestionar en panel</span>
                <ArrowUpRight className="size-3.5 text-zinc-500 group-hover:text-red-400 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Panels */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Module Shortcut 1: Stock Management */}
        <div className="glass-panel-dark rounded-2xl p-6 border border-zinc-800/80 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Car className="size-4" /> Catálogo
            </div>
            <h3 className="font-display text-xl font-bold text-white uppercase">Gestión de Stock</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Publica, modifica precios, sube imágenes e inspecciona el inventario activo de turismos y furgonetas.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="mt-6 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white justify-between">
            <Link to="/admin/vehiculos">
              <span>Ir a Vehículos</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Module Shortcut 2: Appointments */}
        <div className="glass-panel-dark rounded-2xl p-6 border border-zinc-800/80 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <CalendarClock className="size-4" /> Taller
            </div>
            <h3 className="font-display text-xl font-bold text-white uppercase">Citas de Servicio</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Revisa reservas para cambios de neumáticos, mantenimientos periódicos y revisiones mecánicas.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="mt-6 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white justify-between">
            <Link to="/admin/citas">
              <span>Ver Citas Agendadas</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        {/* Module Shortcut 3: Appraisal & Leads */}
        <div className="glass-panel-dark rounded-2xl p-6 border border-zinc-800/80 flex flex-col justify-between hover:border-zinc-700 transition-all">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="size-4" /> Clientes
            </div>
            <h3 className="font-display text-xl font-bold text-white uppercase">Tasaciones y Solicitudes</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Consulta solicitudes de tasación online, pruebas de vehículos y mensajes de clientes.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="mt-6 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white justify-between">
            <Link to="/admin/leads">
              <span>Revisar Solicitudes</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Operational Status Info Box */}
      <div className="glass-panel-dark rounded-2xl border border-zinc-800/80 p-6 md:p-8 text-zinc-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner text-red-500">
              <CheckCircle2 className="size-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold uppercase text-white tracking-wide">
                Panel Neumacar Operativo al 100%
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                Todas las integraciones con Supabase Database, solicitudes de clientes, agenda de taller y motor de sitemap están sincronizadas.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 shrink-0">
            <Clock className="size-3.5 text-emerald-400" />
            Actualizado en tiempo real
          </div>
        </div>
      </div>
    </div>
  );
}

