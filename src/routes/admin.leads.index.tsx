import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/leads/")({
  component: AdminLeads,
});

function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

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
    if (!selectedLead) return;
    setSavingNotes(true);
    const updatedData = {
      ...selectedLead.data,
      adminNotes: adminNotes
    };

    const { error } = await supabase
      .from("leads")
      .update({ data: updatedData })
      .eq("id", selectedLead.id);

    if (error) {
      toast.error("Error al guardar el comentario");
    } else {
      toast.success("Comentario interno guardado");
      setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, data: updatedData } : l));
      setSelectedLead({ ...selectedLead, data: updatedData });
    }
    setSavingNotes(false);
  };

  const filteredLeads = leads.filter(l => 
    !searchTerm || 
    (l.reference && l.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase">Tasaciones de Vehículos</h1>
          <p className="text-sm text-muted-foreground">
            Revisa solicitudes de "Compramos tu coche"
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por Referencia o Nombre..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/30 uppercase text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Referencia</th>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Cargando tasaciones...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-muted/10">
                    <td className="p-4 text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {l.reference && (
                        <div className="font-semibold text-primary">{l.reference}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.phone}</div>
                    </td>
                    <td className="p-4">
                      <select
                        value={l.status || "nuevo"}
                        onChange={(e) => handleStatusChange(l.id, e.target.value)}
                        className={`rounded-full px-2 py-1 text-xs font-medium border-0 cursor-pointer ${
                          l.status === "nuevo"
                            ? "bg-primary/10 text-primary"
                            : l.status === "contactado"
                              ? "bg-blue-500/10 text-blue-500"
                              : l.status === "convertido"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="contactado">Contactado</option>
                        <option value="negociacion">En Negociación</option>
                        <option value="convertido">Convertido (Ganado)</option>
                        <option value="perdido">Perdido</option>
                      </select>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2 items-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="font-bold text-xs"
                        onClick={() => {
                          setSelectedLead(l);
                          setAdminNotes(l.data?.adminNotes || "");
                        }}
                      >
                        VER
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                        onClick={() => handleDelete(l.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wider font-display text-primary">
              Detalles de Tasación {selectedLead?.reference ? `- ${selectedLead.reference}` : ''}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Cliente</h4>
                  <p className="font-medium text-base">{selectedLead.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedLead.email || 'Sin email'}</p>
                  <p className="text-sm font-semibold mt-1">{selectedLead.phone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Información</h4>
                  <p className="font-medium capitalize">{selectedLead.type.replace("_", " ")}</p>
                  <p className="text-sm text-muted-foreground">Estado: <span className="capitalize">{selectedLead.status}</span></p>
                </div>
              </div>

              {selectedLead.data && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Datos del Vehículo</h4>
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
                          <span className="text-muted-foreground capitalize mr-2">{labelMap[key] || key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedLead.data?.equipment && Array.isArray(selectedLead.data.equipment) && selectedLead.data.equipment.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Equipamiento Extra</h4>
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
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Fotografías Adjuntas</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedLead.data.images.map((img: string, i: number) => (
                      <div key={i} className="rounded-md overflow-hidden border border-border bg-black">
                        <img src={img} alt={`Foto ${i + 1}`} className="w-full h-auto object-contain max-h-64 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Comentarios Internos (Admin)</h4>
                <div className="flex flex-col gap-2">
                  <Textarea 
                    placeholder="Añade una valoración aproximada o comentarios para el recepcionista..."
                    className="min-h-[100px]"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotes} disabled={savingNotes} size="sm">
                      {savingNotes ? "Guardando..." : "Guardar Comentario"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
