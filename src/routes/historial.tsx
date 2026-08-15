import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Car, Calendar, ShieldCheck, Printer, FileText, Wrench, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchVehicleHistory, type VehicleHistoryRecord } from "@/services/history";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/historial")({
  component: VehicleHistoryPage,
});

function VehicleHistoryPage() {
  const [plateSearch, setPlateSearch] = useState("");
  const [activePlate, setActivePlate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<VehicleHistoryRecord[]>([]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!plateSearch.trim()) {
      toast.error("Por favor, introduce una matrícula válida");
      return;
    }

    setLoading(true);
    const clean = plateSearch.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const records = await fetchVehicleHistory(clean);
    setHistory(records);
    setActivePlate(clean);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera del Portal */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-4" />
            <span>Libro Digital de Mantenimiento NeumaCar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Consulta el Historial de tu Vehículo
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Introduce la matrícula de tu coche para consultar el registro digital de revisiones, kilómetros e intervenciones realizadas en nuestro taller.
          </p>
        </div>

        {/* Buscador de Matrícula */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ej. 1234 ABC"
                value={plateSearch}
                onChange={(e) => setPlateSearch(e.target.value)}
                className="pl-11 h-12 text-lg uppercase tracking-wider bg-background font-semibold"
              />
            </div>
            <Button type="submit" size="xl" variant="hero" disabled={loading} className="h-12 px-6">
              {loading ? "Buscando..." : (
                <>
                  <Search className="mr-2 size-5" /> Consultar
                </>
              )}
            </Button>
          </form>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Matrículas de demostración:</span>
            <div className="flex gap-2 font-mono">
              <button 
                type="button"
                onClick={() => { setPlateSearch("1234ABC"); handleSearch(); }}
                className="underline hover:text-white"
              >
                1234ABC
              </button>
              <span>•</span>
              <button 
                type="button"
                onClick={() => { setPlateSearch("5678DEF"); handleSearch(); }}
                className="underline hover:text-white"
              >
                5678DEF
              </button>
            </div>
          </div>
        </div>

        {/* Resultado del Historial */}
        {activePlate && (
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Car className="size-6 text-primary" /> Matrícula: <span className="font-mono text-primary">{activePlate}</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Se han encontrado {history.length} registro(s) verificado(s) en NeumaCar Motors.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handlePrint} className="self-start sm:self-auto print:hidden">
                <Printer className="mr-2 size-4" /> Imprimir Historial PDF
              </Button>
            </div>

            {/* Cronología / Timeline */}
            <div className="relative border-l-2 border-primary/40 ml-4 pl-6 space-y-8">
              {history.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Punto del Timeline */}
                  <div className="absolute -left-[31px] top-1.5 size-4 rounded-full bg-primary ring-4 ring-background" />

                  <div className="rounded-xl border border-border bg-card p-6 shadow-md transition-all hover:border-primary/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Wrench className="size-4 text-primary shrink-0" /> {item.serviceTitle}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono text-zinc-300">
                          <Calendar className="size-3.5" /> {item.date}
                        </span>
                        <span>•</span>
                        <span className="font-mono font-semibold text-primary">{item.mileage.toLocaleString()} km</span>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-300 mb-4">{item.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-border/50 pt-3">
                      {item.invoiceRef && (
                        <span className="text-muted-foreground flex items-center gap-1 font-mono">
                          <FileText className="size-3.5" /> Ref. Factura: {item.invoiceRef}
                        </span>
                      )}
                      {item.cost !== undefined && item.cost > 0 && (
                        <span className="font-semibold text-white">Importe: {item.cost}€ IVA incl.</span>
                      )}
                      <span className="inline-flex items-center gap-1 text-green-400 font-medium">
                        <ShieldCheck className="size-3.5" /> Sello Digital Verificado
                      </span>
                    </div>

                    {item.mechanicNotes && (
                      <div className="mt-3 bg-zinc-900/80 rounded-md p-3 text-xs text-zinc-400 border border-zinc-800">
                        <span className="font-semibold text-zinc-200 block mb-1">Notas de la inspección:</span>
                        {item.mechanicNotes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
    </PublicLayout>
  );
}
