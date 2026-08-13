import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Phone, Car, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const Route = createFileRoute("/admin/citas/")({
  component: AdminCitas,
});

function AdminCitas() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("type", "cita")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error al cargar las citas");
      } else {
        setAppointments(data || []);
      }
      setLoading(false);
    }
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setAppointments(
        appointments.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
      );
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent({ ...selectedEvent, status: newStatus });
      }
      toast.success("Estado actualizado");
    } else {
      toast.error("Error al actualizar");
    }
  };

  const events = useMemo(() => {
    return appointments.map((app) => {
      const dateStr = app.data?.date; // "YYYY-MM-DD"
      let timeStr = app.data?.time; // "HH:mm"
      
      if (!dateStr) return null;
      if (!timeStr || timeStr === "A concretar") timeStr = "09:00"; // fallback

      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const start = new Date(year, month - 1, day, hours, minutes);
      const end = new Date(start.getTime() + 45 * 60000); // Add 45 minutes

      return {
        id: app.id,
        title: `${app.name} - ${app.data?.brand} ${app.data?.model}`,
        start,
        end,
        resource: app,
      };
    }).filter(Boolean);
  }, [appointments]);

  const eventStyleGetter = (event: any) => {
    const status = event.resource.status;
    let backgroundColor = "#f97316"; // orange for nuevo/pendiente
    
    if (status === "convertido") backgroundColor = "#22c55e"; // green
    if (status === "perdido") backgroundColor = "#ef4444"; // red
    if (status === "contactado") backgroundColor = "#3b82f6"; // blue
    
    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        color: "#ffffff",
        border: "none",
        display: "block",
        fontWeight: "bold",
        padding: "2px 5px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
      }
    };
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
  };

  return (
    <div className="space-y-6 pb-12 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-slate-800">Gestión de Citas</h1>
          <p className="text-sm text-slate-500">Calendario avanzado de taller</p>
        </div>
        <Button variant="hero">
          <Plus className="mr-2 size-4" />
          Nueva cita
        </Button>
      </div>

      <div className="flex-grow bg-slate-200 rounded-xl border border-slate-300 shadow-sm p-4 overflow-hidden min-h-[700px] text-slate-800">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-500">Cargando calendario...</div>
        ) : (
          <>
            <style dangerouslySetInnerHTML={{__html: `
              .rbc-calendar { font-family: inherit; }
              .rbc-header { padding: 8px; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0 !important; }
              .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #f1f5f9; }
              .rbc-day-bg { border-left: 1px solid #e2e8f0 !important; }
              .rbc-month-row { border-top: 1px solid #e2e8f0 !important; }
              .rbc-off-range-bg { background-color: #f8fafc; }
              .rbc-today { background-color: #f1f5f9; }
              .rbc-event { padding: 2px 4px; font-size: 0.75rem; font-weight: 500; }
              .rbc-toolbar button { color: #475569; border-color: #cbd5e1; }
              .rbc-toolbar button:active, .rbc-toolbar button.rbc-active { background-color: #1da1f2; color: white; border-color: #1da1f2; box-shadow: none; }
              .rbc-toolbar button:hover:not(.rbc-active) { background-color: #f1f5f9; }
              .rbc-time-content { border-top: 1px solid #e2e8f0; }
              .rbc-timeslot-group { border-bottom: 1px solid #e2e8f0; }
              .rbc-time-view .rbc-day-slot .rbc-time-slot { border-top: 1px solid #f1f5f9; }
              .rbc-time-header-content { border-left: 1px solid #e2e8f0; }
              .rbc-time-content > * + * > * { border-left: 1px solid #e2e8f0; }
              .rbc-label { color: #64748b; padding: 0 4px; }
            `}} />
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              defaultView={Views.WEEK}
              culture="es"
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              min={new Date(0, 0, 0, 8, 0, 0)} // Start at 8am
              max={new Date(0, 0, 0, 20, 0, 0)} // End at 8pm
              messages={{
                next: "Sig",
                previous: "Ant",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día"
              }}
            />
          </>
        )}
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={(o) => !o && setSelectedEvent(null)}>
        <DialogContent className="bg-slate-200 text-slate-800 border-slate-300">
          <DialogHeader>
            <DialogTitle>Detalle de la Cita</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <Badge variant={selectedEvent.status === "nuevo" ? "default" : "outline"} className="capitalize">
                  {selectedEvent.status}
                </Badge>
                <span className="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="size-3" />
                  {selectedEvent.data?.date} a las {selectedEvent.data?.time}
                </span>
              </div>
              
              <div className="grid gap-2 text-sm bg-slate-300 p-4 rounded-md border border-slate-400">
                <div className="flex gap-2">
                  <span className="font-semibold w-24 text-slate-500">Cliente:</span>
                  <span>{selectedEvent.name}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold w-24 text-slate-500">Teléfono:</span>
                  <span className="flex items-center gap-1"><Phone className="size-3" /> {selectedEvent.phone}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold w-24 text-slate-500">Vehículo:</span>
                  <span className="flex items-center gap-1"><Car className="size-3" /> {selectedEvent.data?.brand} {selectedEvent.data?.model} ({selectedEvent.data?.plate})</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold w-24 text-slate-500">Servicio:</span>
                  <span className="capitalize">{selectedEvent.data?.service}</span>
                </div>
              </div>

              {selectedEvent.message && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Comentarios</h4>
                  <p className="text-sm p-3 border border-slate-300 rounded-md bg-slate-100">
                    {selectedEvent.message}
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cambiar Estado</label>
                <select
                  value={selectedEvent.status}
                  onChange={(e) => updateStatus(selectedEvent.id, e.target.value)}
                  className="h-10 rounded-md border border-slate-300 bg-slate-100 px-3 text-sm"
                >
                  <option value="nuevo">Pendiente</option>
                  <option value="contactado">Contactado</option>
                  <option value="convertido">Confirmada (Ganada)</option>
                  <option value="perdido">Cancelada (Perdida)</option>
                </select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
