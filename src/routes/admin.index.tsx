import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Car, Users, CalendarClock, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    vehicles: 0,
    leads: 0,
    appointments: 0,
  });

  useEffect(() => {
    async function loadStats() {
      // Intentamos cargar estadísticas reales
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

      setStats({
        vehicles: vCount || 0,
        leads: lCount || 0,
        appointments: aCount || 0,
      });
    }

    loadStats();
  }, []);

  const cards = [
    { title: "Vehículos en Stock", value: stats.vehicles, icon: Car, color: "text-blue-500" },
    { title: "Total de Leads", value: stats.leads, icon: Users, color: "text-primary" },
    {
      title: "Citas Solicitadas",
      value: stats.appointments,
      icon: CalendarClock,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase text-slate-800">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-slate-200 rounded-xl p-6 shadow-sm border border-slate-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <card.icon className={`size-5 ${card.color}`} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-4xl font-bold text-slate-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-300 bg-slate-200 p-8 text-center text-slate-600 shadow-sm">
        <TrendingUp className="mx-auto mb-4 size-8 text-slate-300" />
        <h3 className="font-display text-lg font-semibold uppercase text-slate-800">
          Bienvenido al Panel de Administración
        </h3>
        <p className="mt-2 text-sm">
          Utiliza el menú lateral para gestionar los vehículos a la venta y revisar las solicitudes
          de los clientes.
        </p>
      </div>
    </div>
  );
}
