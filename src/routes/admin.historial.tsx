import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Search, Plus, Trash2, Calendar, Wrench, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getAllVehicleHistories, deleteVehicleHistoryRecord, addVehicleHistoryRecord, type VehicleHistoryRecord } from "@/services/history";

export const Route = createFileRoute("/admin/historial")({
  component: AdminHistorial,
});

function AdminHistorial() {
  const [records, setRecords] = useState<VehicleHistoryRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<VehicleHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    plate: "",
    date: new Date().toISOString().split("T")[0],
    mileage: "",
    serviceTitle: "",
    description: "",
    cost: "",
    invoiceRef: "",
    mechanicNotes: "",
  });

  const loadData = async () => {
    setLoading(true);
    const data = await getAllVehicleHistories();
    setRecords(data);
    setFilteredRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRecords(records);
    } else {
      const q = searchTerm.toLowerCase();
      setFilteredRecords(
        records.filter(
          (r) => 
            r.plate.toLowerCase().includes(q) || 
            r.serviceTitle.toLowerCase().includes(q) ||
            (r.invoiceRef && r.invoiceRef.toLowerCase().includes(q))
        )
      );
    }
  }, [searchTerm, records]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.plate || !newRecord.serviceTitle || !newRecord.mileage) {
      toast.error("Por favor completa matrícula, título y kilómetros.");
      return;
    }
    
    setLoading(true);
    const success = await addVehicleHistoryRecord({
      plate: newRecord.plate,
      date: newRecord.date,
      mileage: Number(newRecord.mileage),
      serviceTitle: newRecord.serviceTitle,
      description: newRecord.description,
      cost: newRecord.cost ? Number(newRecord.cost) : undefined,
      invoiceRef: newRecord.invoiceRef,
      mechanicNotes: newRecord.mechanicNotes,
    });
    
    if (success) {
      toast.success("Registro añadido al historial correctamente.");
      setIsModalOpen(false);
      setNewRecord({
        plate: "",
        date: new Date().toISOString().split("T")[0],
        mileage: "",
        serviceTitle: "",
        description: "",
        cost: "",
        invoiceRef: "",
        mechanicNotes: "",
      });
      loadData();
    } else {
      toast.error("Error al guardar el registro.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, plate: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar este registro del historial de ${plate}?`)) return;
    
    const success = await deleteVehicleHistoryRecord(id, plate);
    if (success) {
      toast.success("Registro eliminado.");
      setRecords(records.filter(r => r.id !== id));
    } else {
      toast.error("Error al eliminar.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <BookOpen className="size-6 text-red-500" />
            Gestor de Historial Digital
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Administra los libros de mantenimiento digital por matrícula.
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="gap-2 shrink-0">
              <Plus className="size-4" /> Añadir Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-display uppercase tracking-wide border-b border-zinc-800 pb-4">
                Nuevo Registro en Historial
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Matrícula *</label>
                  <Input 
                    required 
                    placeholder="Ej. 1234ABC" 
                    className="uppercase bg-zinc-900 border-zinc-800"
                    value={newRecord.plate}
                    onChange={(e) => setNewRecord({...newRecord, plate: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Fecha *</label>
                  <Input 
                    type="date" 
                    required 
                    className="bg-zinc-900 border-zinc-800"
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Kilómetros *</label>
                  <Input 
                    type="number" 
                    required 
                    placeholder="Ej. 75000" 
                    className="bg-zinc-900 border-zinc-800"
                    value={newRecord.mileage}
                    onChange={(e) => setNewRecord({...newRecord, mileage: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Importe (€)</label>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="Opcional" 
                    className="bg-zinc-900 border-zinc-800"
                    value={newRecord.cost}
                    onChange={(e) => setNewRecord({...newRecord, cost: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase">Servicio / Título *</label>
                <Input 
                  required 
                  placeholder="Ej. Mantenimiento General B" 
                  className="bg-zinc-900 border-zinc-800"
                  value={newRecord.serviceTitle}
                  onChange={(e) => setNewRecord({...newRecord, serviceTitle: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase">Resumen / Descripción del Trabajo</label>
                <Textarea 
                  placeholder="Ej. Cambio de aceite, filtro de aire y pastillas delanteras..." 
                  className="min-h-[80px] bg-zinc-900 border-zinc-800"
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Notas del Mecánico</label>
                  <Textarea 
                    placeholder="Observaciones internas o recomendaciones futuras..." 
                    className="min-h-[80px] bg-zinc-900 border-zinc-800"
                    value={newRecord.mechanicNotes}
                    onChange={(e) => setNewRecord({...newRecord, mechanicNotes: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Ref. Factura</label>
                  <Input 
                    placeholder="Ej. INV-2025-001" 
                    className="bg-zinc-900 border-zinc-800"
                    value={newRecord.invoiceRef}
                    onChange={(e) => setNewRecord({...newRecord, invoiceRef: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="hero" disabled={loading}>Guardar Registro</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input 
            placeholder="Buscar por matrícula o servicio..." 
            className="pl-9 bg-zinc-950 border-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Cargando registros...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
            No se encontraron registros de mantenimiento.
          </div>
        ) : (
          filteredRecords.map((item) => (
            <div key={item.id} className="group relative bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/40 transition-colors">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary/10 text-primary font-mono font-bold px-3 py-1 rounded text-sm tracking-widest border border-primary/20">
                      {item.plate}
                    </span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Wrench className="size-4 text-primary shrink-0" /> {item.serviceTitle}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-zinc-300 mb-4 pl-1">{item.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" /> {item.date}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono font-semibold text-zinc-300">
                      {item.mileage.toLocaleString()} km
                    </span>
                    {item.cost !== undefined && item.cost > 0 && (
                      <span className="font-semibold text-white">Importe: {item.cost}€</span>
                    )}
                    {item.invoiceRef && (
                      <span className="flex items-center gap-1.5 font-mono">
                        <FileText className="size-3.5" /> Ref: {item.invoiceRef}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-green-400 font-medium ml-auto">
                      <ShieldCheck className="size-3.5" /> Certificado
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="icon" className="border-red-900 text-red-500 hover:bg-red-950 hover:text-red-400" onClick={() => handleDelete(item.id, item.plate)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
