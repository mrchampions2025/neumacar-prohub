import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Phone, Mail, Car, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const Route = createFileRoute("/admin/citas/")({
  component: AdminCitas,
});

function AdminCitas() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("type", "cita")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching appointments:", error);
      } else {
        setAppointments(data || []);
      }
      setLoading(false);
    }
    fetchAppointments();
  }, []);

  // Filter appointments for the selected date
  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : null;
  const filteredAppointments = useMemo(() => {
    if (!selectedDateStr) return [];
    return appointments.filter((app) => {
      // app.data.date contains the date string 'YYYY-MM-DD'
      return app.data && app.data.date === selectedDateStr;
    });
  }, [appointments, selectedDateStr]);

  // All dates that have appointments
  const datesWithAppointments = useMemo(() => {
    const dates = new Set<string>();
    appointments.forEach((app) => {
      if (app.data && app.data.date) {
        dates.add(app.data.date);
      }
    });
    return Array.from(dates).map((d) => new Date(d));
  }, [appointments]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setAppointments(
        appointments.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase">Gestión de Citas</h1>
        <p className="text-sm text-muted-foreground">Revisa y gestiona las citas del taller</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
        <div className="surface-card w-fit rounded-xl border border-border p-4 shadow-sm h-fit">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={es}
            className="rounded-md"
            modifiers={{ booked: datesWithAppointments }}
            modifiersStyles={{
              booked: { fontWeight: "bold", textDecoration: "underline", color: "var(--primary)" },
            }}
          />
        </div>

        <div className="surface-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="mb-6 font-display text-lg font-semibold uppercase flex items-center gap-2">
            <CalendarClock className="size-5" />
            Citas del {date ? format(date, "d 'de' MMMM, yyyy", { locale: es }) : "..."}
          </h2>

          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando citas...</p>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarClock className="mx-auto size-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">No hay citas programadas para este día.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((app) => (
                <div key={app.id} className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-lg bg-primary/10 text-primary px-3 py-1 rounded-md">
                        {app.data.time || "Sin hora"}
                      </span>
                      <span className="font-semibold text-lg">{app.name}</span>
                      <Badge variant={app.status === "nuevo" ? "default" : "outline"}>
                        {app.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Phone className="size-3.5"/> {app.phone}</span>
                      {app.email && <span className="flex items-center gap-1.5"><Mail className="size-3.5"/> {app.email}</span>}
                      <span className="flex items-center gap-1.5"><Car className="size-3.5"/> {app.data.brand} {app.data.model} ({app.data.plate})</span>
                    </div>

                    {app.message && (
                      <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm italic">
                        "{app.message}"
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 sm:flex-col">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-xs"
                    >
                      <option value="nuevo">Pendiente</option>
                      <option value="contactado">Contactado</option>
                      <option value="convertido">Confirmada</option>
                      <option value="perdido">Cancelada</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
