import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
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

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar leads");
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
    if (!window.confirm("¿Seguro que deseas eliminar este lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Lead eliminado");
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase">Clientes y Leads</h1>
        <p className="text-sm text-muted-foreground">
          Revisa solicitudes de presupuestos, citas y valoraciones
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/30 uppercase text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Cargando leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No hay solicitudes de clientes todavía.
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-muted/10">
                    <td className="p-4 text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="font-medium capitalize">{l.type.replace("_", " ")}</span>
                      {l.reference && (
                        <div className="text-xs text-muted-foreground">Ref: {l.reference}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.phone}</div>
                      {l.email && <div className="text-xs text-muted-foreground">{l.email}</div>}
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
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:bg-muted"
                        onClick={() => setSelectedLead(l)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wider font-display text-primary">
              Detalles de la Solicitud
            </DialogTitle>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Cliente</h4>
                  <p className="font-medium">{selectedLead.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedLead.email || 'Sin email'}</p>
                  <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tipo y Estado</h4>
                  <p className="font-medium capitalize">{selectedLead.type.replace("_", " ")}</p>
                  <p className="text-sm text-muted-foreground">Estado actual: <span className="capitalize">{selectedLead.status}</span></p>
                  <p className="text-sm text-muted-foreground">Referencia: {selectedLead.reference}</p>
                </div>
              </div>

              {selectedLead.data && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Datos del Vehículo / Formulario</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {Object.entries(selectedLead.data).map(([key, value]) => {
                      if (key === 'images' || key === 'consent' || typeof value === 'object' || !value) return null;
                      return (
                        <div key={key}>
                          <span className="text-muted-foreground capitalize mr-2">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {selectedLead.message && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Mensaje / Notas</h4>
                  <p className="text-sm bg-muted/30 p-3 rounded-md">{selectedLead.message}</p>
                </div>
              )}

              {selectedLead.data?.images && Array.isArray(selectedLead.data.images) && selectedLead.data.images.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Fotografías Adjuntas</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedLead.data.images.map((img: string, i: number) => (
                      <a href={img} target="_blank" rel="noopener noreferrer" key={i} className="block aspect-square rounded-md overflow-hidden border border-border hover:opacity-80 transition-opacity">
                        <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
