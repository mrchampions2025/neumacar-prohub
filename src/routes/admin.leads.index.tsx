import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Route = createFileRoute("/admin/leads/")({
  component: AdminLeads,
});

function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Experto");
  const [savingNotes, setSavingNotes] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("type", "vender_vehiculo")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar tasaciones");
    } else {
      setLeads(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const hasImages = selectedLead?.data?.images && Array.isArray(selectedLead.data.images) && selectedLead.data.images.length > 0;
  const totalImages = hasImages ? selectedLead.data.images.length : 0;

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (expandedImageIndex !== null && totalImages > 0) {
      setExpandedImageIndex((prev) => (prev! > 0 ? prev! - 1 : totalImages - 1));
    }
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (expandedImageIndex !== null && totalImages > 0) {
      setExpandedImageIndex((prev) => (prev! < totalImages - 1 ? prev! + 1 : 0));
    }
  };

  useEffect(() => {
    if (expandedImageIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevImage();
      else if (e.key === "ArrowRight") handleNextImage();
      else if (e.key === "Escape") setExpandedImageIndex(null);
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedImageIndex, totalImages]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast.error("Error al actualizar");
    } else {
      toast.success("Estado actualizado");
      setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tasación?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Tasación eliminada");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead || !adminNotes.trim()) return;
    setSavingNotes(true);
    
    const newNote = {
      role: noteAuthor,
      text: adminNotes,
      date: new Date().toISOString()
    };
    
    const currentNotes = Array.isArray(selectedLead.data?.adminNotes) 
      ? selectedLead.data.adminNotes 
      : (selectedLead.data?.adminNotes ? [{ role: "Admin", text: selectedLead.data.adminNotes, date: new Date().toISOString() }] : []);
      
    const updatedNotes = [...currentNotes, newNote];

    const updatedData = {
      ...selectedLead.data,
      adminNotes: updatedNotes
    };

    const { error } = await supabase
      .from("leads")
      .update({ data: updatedData })
      .eq("id", selectedLead.id);

    if (error) {
      toast.error("Error al guardar el comentario");
    } else {
      toast.success("Comentario guardado");
      setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, data: updatedData } : l));
      setSelectedLead({ ...selectedLead, data: updatedData });
      setAdminNotes("");
    }
    setSavingNotes(false);
  };

  const filteredLeads = leads.filter(l => 
    !searchTerm || 
    (l.reference && l.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
            Tasaciones & Leads <Search className="size-6 text-red-500" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Gestión de solicitudes del servicio "Compramos tu coche" y tasaciones online.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por Referencia o Nombre..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel-dark rounded-2xl border border-zinc-800/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold">Referencia</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    <span className="animate-pulse">Cargando tasaciones...</span>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">
                    No se encontraron solicitudes de tasación.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-zinc-900/50 group">
                    <td className="p-4 text-zinc-400">
                      {new Date(l.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td className="p-4">
                      {l.reference ? (
                        <div className="font-mono font-bold text-red-400">{l.reference}</div>
                      ) : (
                        <span className="text-zinc-600">Sin Ref</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white group-hover:text-red-400 transition-colors">
                        {l.name}
                      </div>
                      <div className="text-[11px] text-zinc-400">{l.phone}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={l.status || "nuevo"}
                        onChange={(e) => handleStatusChange(l.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold border cursor-pointer focus:outline-none transition-all ${
                          l.status === "nuevo"
                            ? "bg-blue-950/80 text-blue-300 border-blue-800"
                            : l.status === "contactado"
                              ? "bg-indigo-950/80 text-indigo-300 border-indigo-800"
                              : l.status === "convertido"
                                ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                                : l.status === "negociacion"
                                  ? "bg-amber-950/80 text-amber-300 border-amber-800"
                                  : "bg-zinc-900 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="contactado">Contactado</option>
                        <option value="negociacion">En Negociación</option>
                        <option value="convertido">Convertido (Ganado)</option>
                        <option value="perdido">Perdido</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 h-8"
                          onClick={() => {
                            setSelectedLead(l);
                            setAdminNotes("");
                          }}
                        >
                          Ver Detalle
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:bg-red-950/40 hover:text-red-300 h-8 w-8"
                          onClick={() => handleDelete(l.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950 text-white border-zinc-800 rounded-2xl shadow-2xl">

          <DialogHeader>
            <DialogTitle className="uppercase tracking-wider font-display text-[#1da1f2]">
              Detalles de Tasación {selectedLead?.reference ? `- ${selectedLead.reference}` : ''}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-300 p-4 rounded-lg border border-slate-400">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Cliente</h4>
                  <p className="font-medium text-base">{selectedLead.name}</p>
                  <p className="text-sm text-slate-500">{selectedLead.email || 'Sin email'}</p>
                  <p className="text-sm font-semibold mt-1">{selectedLead.phone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Información</h4>
                  <p className="font-medium capitalize">{selectedLead.type.replace("_", " ")}</p>
                  <p className="text-sm text-slate-500">Estado: <span className="capitalize">{selectedLead.status}</span></p>
                </div>
              </div>

              {selectedLead.data && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Datos del Vehículo</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {Object.entries(selectedLead.data).map(([key, value]) => {
                      if (key === 'images' || key === 'consent' || key === 'adminNotes' || typeof value === 'object' || !value) return null;
                      
                      const labelMap: Record<string, string> = {
                        brand: "Marca", model: "Modelo", version: "Versión", year: "Año",
                        plate: "Matrícula", mileage: "Kilómetros", fuel: "Combustible",
                        transmission: "Cambio", power: "Potencia (CV)", bodyType: "Carrocería",
                        conditionGeneral: "Estado Gen.", conditionBody: "Carrocería",
                        conditionInterior: "Interior", conditionMechanical: "Mecánica",
                        conditionTyres: "Neumáticos", maintenanceHistory: "Historial Maint.",
                        owners: "Propietarios", itv: "ITV", accidents: "Accidentes",
                        knownIssues: "Averías Conocidas"
                      };

                      return (
                        <div key={key} className="border-b border-border pb-1">
                          <span className="text-slate-500 capitalize mr-2">{labelMap[key] || key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedLead.data?.equipment && Array.isArray(selectedLead.data.equipment) && selectedLead.data.equipment.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Equipamiento Extra</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.data.equipment.map((eq: string) => (
                      <span key={eq} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedLead.data?.images && Array.isArray(selectedLead.data.images) && selectedLead.data.images.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Fotografías Adjuntas</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedLead.data.images.map((img: string, i: number) => (
                      <div 
                        key={i} 
                        className="rounded-md overflow-hidden border border-border bg-black cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setExpandedImageIndex(i)}
                      >
                        <img src={img} alt={`Foto ${i + 1}`} className="w-full h-24 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-4 mt-6">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Comentarios Internos</h4>
                
                {selectedLead.data?.adminNotes && Array.isArray(selectedLead.data.adminNotes) && (
                  <div className="space-y-3 mb-6">
                    {selectedLead.data.adminNotes.map((note: any, i: number) => (
                      <div key={i} className="bg-slate-300 p-3 rounded-md text-sm border border-slate-400">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-[#1da1f2]">{note.role || 'Admin'}</span>
                          <span className="text-xs text-slate-500">
                            {note.date ? new Date(note.date).toLocaleString() : ''}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Autor:</span>
                    <select 
                      className="text-sm border-0 bg-slate-200 rounded-md px-2 py-1"
                      value={noteAuthor}
                      onChange={(e) => setNoteAuthor(e.target.value)}
                    >
                      <option value="Experto">Experto</option>
                      <option value="Cliente">Cliente</option>
                      <option value="Admin">Administrador</option>
                    </select>
                  </div>
                  <Textarea 
                    placeholder="Escribe un nuevo comentario..."
                    className="min-h-[80px] bg-slate-100 border-slate-300 text-slate-800"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                  <div className="flex justify-end mt-1">
                    <Button onClick={handleSaveNotes} disabled={savingNotes || !adminNotes.trim()} size="sm">
                      {savingNotes ? "Guardando..." : "Añadir Comentario"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Lightbox para Imágenes */}
      {selectedLead?.data?.images && (
        <DialogPrimitive.Root open={expandedImageIndex !== null} onOpenChange={(open) => !open && setExpandedImageIndex(null)}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content 
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 outline-none"
              onClick={() => setExpandedImageIndex(null)}
            >
              <button 
                className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-50 cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setExpandedImageIndex(null); }}
              >
                <X className="size-8" />
              </button>

              {totalImages > 1 && (
                <>
                  <button 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-50 bg-black/50 rounded-full cursor-pointer"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="size-10" />
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-50 bg-black/50 rounded-full cursor-pointer"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="size-10" />
                  </button>
                </>
              )}
              
              {expandedImageIndex !== null && (
                <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <img 
                    src={selectedLead.data.images[expandedImageIndex]} 
                    alt={`Ampliación ${expandedImageIndex + 1}`} 
                    className="max-w-full max-h-[85vh] object-contain rounded-md select-none" 
                  />
                  {totalImages > 1 && (
                    <div className="mt-4 text-white text-sm">
                      Imagen {expandedImageIndex + 1} de {totalImages}
                    </div>
                  )}
                </div>
              )}
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}
    </div>
  );
}
