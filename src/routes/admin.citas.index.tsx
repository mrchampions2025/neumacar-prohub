import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Phone, Car, Plus, Sparkles, User, Wrench, FileText, CheckCircle, XCircle } from "lucide-react";
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
  const [statusFilter, setStatusFilter] = useState<string>("todos");

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
      toast.success("Estado de cita actualizado");
    } else {
      toast.error("Error al actualizar estado");
    }
  };

  const [viewMode, setViewMode] = useState<"agenda" | "itv">("agenda");
  
  const handleSendWhatsAppReminder = (event: any) => {
    const cleanPhone = (event.phone || "").replace(/[^0-9]/g, "");
    const dateStr = event.data?.date || "fecha acordada";
    const timeStr = event.data?.time || "";
    const vehicle = `${event.data?.brand || ""} ${event.data?.model || ""}`.trim() || "tu vehículo";
    
    const message = `Hola ${event.name}, te recordamos tu cita en NeumaCar Motors el próximo ${dateStr} a las ${timeStr} para la revisión de ${vehicle}. Si necesitas modificar tu cita, llámanos al 954 000 000. ¡Te esperamos!`;
    const url = `https://wa.me/34${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    toast.success("Recordatorio de cita listo para enviar por WhatsApp");
  };

  const handleSendItvReminder = (name: string, phone: string, vehicle: string, plate: string) => {
    const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
    const message = `Hola ${name}, te recordamos desde NeumaCar Motors que la ITV de tu ${vehicle} con matrícula ${plate} le corresponde revisión este mes. Evita sanciones y reserva tu Pre-ITV gratuita con nosotros.`;
    const url = `https://wa.me/34${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    toast.success("Recordatorio ITV listo para enviar por WhatsApp");
  };

  const filteredAppointments = useMemo(() => {
    if (statusFilter === "todos") return appointments;
    return appointments.filter((app) => app.status === statusFilter);
  }, [appointments, statusFilter]);

  const events = useMemo(() => {
    return filteredAppointments.map((app) => {
      const dateStr = app.data?.date; // "YYYY-MM-DD"
      let timeStr = app.data?.time; // "HH:mm"
      
      if (!dateStr) return null;
      if (!timeStr || timeStr === "A concretar") timeStr = "09:00";

      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const start = new Date(year, month - 1, day, hours, minutes);
      const end = new Date(start.getTime() + 45 * 60000);

      return {
        id: app.id,
        title: `${app.name} - ${app.data?.brand || ''} ${app.data?.model || ''}`,
        start,
        end,
        resource: app,
      };
    }).filter(Boolean);
  }, [filteredAppointments]);

  const eventStyleGetter = (event: any) => {
    const status = event.resource.status;
    let backgroundColor = "rgba(234, 88, 12, 0.9)"; // amber/orange
    let borderColor = "#f97316";

    if (status === "convertido" || status === "confirmada") {
      backgroundColor = "rgba(16, 185, 129, 0.9)"; // emerald
      borderColor = "#10b981";
    } else if (status === "perdido" || status === "cancelada") {
      backgroundColor = "rgba(239, 68, 68, 0.9)"; // red
      borderColor = "#ef4444";
    } else if (status === "contactado") {
      backgroundColor = "rgba(59, 130, 246, 0.9)"; // blue
      borderColor = "#3b82f6";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "8px",
        color: "#ffffff",
        borderLeft: `4px solid ${borderColor}`,
        fontWeight: "600",
        fontSize: "0.75rem",
        padding: "4px 8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
      }
    };
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
            Agenda & Gestor ITV <CalendarIcon className="size-6 text-red-500" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Calendario interactivo de servicios, avisos de recordatorio por WhatsApp y control de vencimiento ITV.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => setViewMode("agenda")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "agenda"
                ? "bg-red-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Agenda Citas
          </button>
          <button
            onClick={() => setViewMode("itv")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === "itv"
                ? "bg-red-600 text-white shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Recordatorios ITV
          </button>
        </div>
      </div>

      {viewMode === "itv" ? (
        <div className="glass-panel-dark rounded-2xl border border-zinc-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wrench className="size-5 text-red-500" /> Control de Vencimientos ITV
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Genera avisos de fidelización automáticos para clientes cuya ITV vence este mes o el próximo.
              </p>
            </div>
            <Badge className="bg-red-950 text-red-400 border border-red-800 px-3 py-1 text-xs self-start">
              Fidelización Activa
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="border-b border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-900/50">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Vehículo / Matrícula</th>
                  <th className="p-3">Mes ITV</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acción WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {[
                  { name: "Juan Manuel Gómez", phone: "612345678", vehicle: "Seat León 1.6 TDI", plate: "1234ABC", month: "Agosto 2026", status: "Pendiente" },
                  { name: "María del Carmen Ruiz", phone: "623456789", vehicle: "Volkswagen Golf VII", plate: "5678DEF", month: "Agosto 2026", status: "Pendiente" },
                  { name: "Antonio Fernández", phone: "634567890", vehicle: "Audi A4 Avant", plate: "9101GHI", month: "Septiembre 2026", status: "Avisado" },
                  { name: "Laura Sánchez", phone: "645678901", vehicle: "Peugeot 3008", plate: "1122JKL", month: "Septiembre 2026", status: "Pendiente" },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 font-semibold text-white">{item.name}</td>
                    <td className="p-3 text-zinc-400 font-mono">{item.phone}</td>
                    <td className="p-3 text-white">
                      {item.vehicle} <span className="font-mono text-xs text-red-400 ml-1">({item.plate})</span>
                    </td>
                    <td className="p-3 font-medium text-amber-400">{item.month}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'Avisado' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSendItvReminder(item.name, item.phone, item.vehicle, item.plate)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 px-3"
                      >
                        <Phone className="mr-1.5 size-3.5" /> Enviar Recordatorio
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="glass-panel-dark rounded-2xl p-4 border border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:inline">
              Filtrar Citas por Estado:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: "todos", label: "Todas" },
                { id: "nuevo", label: "Pendientes" },
                { id: "contactado", label: "Contactadas" },
                { id: "convertido", label: "Confirmadas" },
                { id: "perdido", label: "Canceladas" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                    statusFilter === tab.id
                      ? "bg-red-600 text-white shadow-md shadow-red-950"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Area */}
          <div className="glass-panel-dark rounded-2xl border border-zinc-800/80 shadow-2xl p-4 overflow-hidden min-h-[650px] text-zinc-200">
            {loading ? (
              <div className="h-[600px] flex items-center justify-center text-zinc-500">
                <span className="animate-pulse">Cargando agenda del taller...</span>
              </div>
            ) : (
              <>
                <style dangerouslySetInnerHTML={{__html: `
                  .rbc-calendar { font-family: inherit; color: #e4e4e7; }
                  .rbc-header { padding: 10px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; color: #a1a1aa; border-bottom: 1px solid #27272a !important; background: rgba(24, 24, 27, 0.8); }
                  .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border: 1px solid #27272a; border-radius: 12px; overflow: hidden; background: #09090b; }
                  .rbc-day-bg { border-left: 1px solid #27272a !important; }
                  .rbc-month-row { border-top: 1px solid #27272a !important; }
                  .rbc-off-range-bg { background-color: #09090b; opacity: 0.4; }
                  .rbc-today { background-color: rgba(225, 29, 72, 0.08); }
                  .rbc-event { padding: 3px 6px; font-size: 0.75rem; }
                  .rbc-toolbar button { color: #a1a1aa; border-color: #27272a; background: #18181b; font-size: 0.75rem; border-radius: 8px; margin-right: 4px; }
                  .rbc-toolbar button:active, .rbc-toolbar button.rbc-active { background-color: #dc2626 !important; color: white !important; border-color: #dc2626 !important; font-weight: bold; }
                  .rbc-toolbar button:hover:not(.rbc-active) { background-color: #27272a; color: white; }
                  .rbc-time-content { border-top: 1px solid #27272a; }
                  .rbc-timeslot-group { border-bottom: 1px solid #27272a; }
                  .rbc-time-view .rbc-day-slot .rbc-time-slot { border-top: 1px solid #18181b; }
                  .rbc-time-header-content { border-left: 1px solid #27272a; }
                  .rbc-time-content > * + * > * { border-left: 1px solid #27272a; }
                  .rbc-label { color: #71717a; font-size: 0.75rem; }
                  .rbc-toolbar-label { font-weight: bold; font-family: var(--font-display); font-size: 1.1rem; text-transform: uppercase; color: #fff; }
                `}} />
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  views={[Views.MONTH, Views.WEEK, Views.DAY]}
                  defaultView={Views.WEEK}
                  culture="es"
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={handleSelectEvent}
                  min={new Date(0, 0, 0, 8, 0, 0)}
                  max={new Date(0, 0, 0, 20, 0, 0)}
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
        </>
      )}

      {/* Appointment Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(o) => !o && setSelectedEvent(null)}>
        <DialogContent className="bg-zinc-950 text-white border-zinc-800 max-w-md rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl uppercase flex items-center gap-2">
              <Wrench className="size-5 text-red-500" /> Detalle de la Cita
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedEvent.status === "convertido"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : selectedEvent.status === "perdido"
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}
                >
                  {selectedEvent.status}
                </span>
                <span className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
                  <Clock className="size-3.5 text-red-400" />
                  {selectedEvent.data?.date} a las {selectedEvent.data?.time}
                </span>
              </div>
              
              <div className="grid gap-3 text-xs bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
                <div className="flex items-center gap-2 text-zinc-300">
                  <User className="size-4 text-zinc-500 shrink-0" />
                  <span className="font-semibold text-zinc-400 w-20">Cliente:</span>
                  <span className="font-bold text-white">{selectedEvent.name}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Phone className="size-4 text-zinc-500 shrink-0" />
                  <span className="font-semibold text-zinc-400 w-20">Teléfono:</span>
                  <a href={`tel:${selectedEvent.phone}`} className="text-red-400 hover:underline">
                    {selectedEvent.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Car className="size-4 text-zinc-500 shrink-0" />
                  <span className="font-semibold text-zinc-400 w-20">Vehículo:</span>
                  <span className="text-zinc-200">
                    {selectedEvent.data?.brand} {selectedEvent.data?.model} ({selectedEvent.data?.plate || "Sin matrícula"})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Wrench className="size-4 text-zinc-500 shrink-0" />
                  <span className="font-semibold text-zinc-400 w-20">Servicio:</span>
                  <span className="capitalize text-zinc-200">{selectedEvent.data?.service || "Mantenimiento general"}</span>
                </div>
              </div>

              {selectedEvent.message && (
                <div>
                  <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <FileText className="size-3 text-zinc-500" /> Comentarios del Cliente
                  </h4>
                  <p className="text-xs p-3 border border-zinc-800 rounded-xl bg-zinc-900/80 text-zinc-300 leading-relaxed">
                    {selectedEvent.message}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-zinc-800 space-y-3">
                <Button 
                  type="button" 
                  onClick={() => handleSendWhatsAppReminder(selectedEvent)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-10 rounded-xl"
                >
                  <Phone className="mr-2 size-4" /> Recordatorio 24h por WhatsApp
                </Button>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Actualizar Estado de la Cita</label>
                  <select
                    value={selectedEvent.status}
                    onChange={(e) => updateStatus(selectedEvent.id, e.target.value)}
                    className="w-full h-10 rounded-xl border border-zinc-700 bg-zinc-900 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="nuevo">Pendiente / Nuevo</option>
                    <option value="contactado">Contactado</option>
                    <option value="convertido">Confirmada (Ganada)</option>
                    <option value="perdido">Cancelada (Perdida)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

