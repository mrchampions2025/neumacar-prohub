import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Eye, Printer, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "@/components/ui/logo";

export const Route = createFileRoute("/admin/presupuestos/")({
  component: AdminPresupuestos,
});

function AdminPresupuestos() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isBuildingQuote, setIsBuildingQuote] = useState(false);

  // Quote State
  const [quoteItems, setQuoteItems] = useState<Array<{ qty: number; concept: string; price: number; discount: number }>>([
    { qty: 1, concept: "", price: 0, discount: 0 }
  ]);
  const [quoteMileage, setQuoteMileage] = useState("");
  const [quoteObs, setQuoteObs] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientCif, setClientCif] = useState("");
  const [vehicleVin, setVehicleVin] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("type", "presupuesto")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar presupuestos");
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
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este presupuesto?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Presupuesto eliminado");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selectedLead && selectedLead.id === id) setSelectedLead(null);
    }
  };

  const handleStartQuote = () => {
    setIsBuildingQuote(true);
    // Preset values from lead
    setQuoteItems([{ qty: 1, concept: selectedLead.data?.service || "", price: 0, discount: 0 }]);
  };

  // Quote Math
  const totalBase = quoteItems.reduce((acc, item) => acc + (item.qty * item.price * (1 - item.discount / 100)), 0);
  const iva = totalBase * 0.21;
  const grandTotal = totalBase + iva;

  const handlePrint = () => {
    window.print();
  };

  const saveQuoteToSupabase = async () => {
    const quoteData = {
      items: quoteItems,
      mileage: quoteMileage,
      obs: quoteObs,
      clientAddress,
      clientCif,
      vehicleVin,
      totalBase,
      iva,
      grandTotal,
      generatedAt: new Date().toISOString()
    };
    
    const updatedLeadData = {
      ...selectedLead.data,
      generated_quote: quoteData
    };

    const { error } = await supabase.from("leads").update({ data: updatedLeadData, status: "realizado" }).eq("id", selectedLead.id);
    if (error) {
      toast.error("Error al guardar el presupuesto");
    } else {
      toast.success("Presupuesto guardado y marcado como realizado");
      setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: "realizado", data: updatedLeadData } : l));
      setSelectedLead({ ...selectedLead, status: "realizado", data: updatedLeadData });
    }
  };

  if (isBuildingQuote && selectedLead) {
    const quoteNumber = `PRE${new Date().getFullYear()}${(selectedLead.id as string).substring(0, 4).toUpperCase()}`;
    const dateStr = new Date().toLocaleDateString('es-ES');
    
    return (
      <div className="bg-white min-h-screen -m-4 md:-m-8 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6 print:space-y-0">
          
          {/* Controls - Hidden in print */}
          <div className="flex items-center justify-between print:hidden mb-8 bg-muted/30 p-4 rounded-xl border border-border">
            <Button variant="ghost" onClick={() => setIsBuildingQuote(false)}>
              <ArrowLeft className="mr-2 size-4" />
              Volver
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveQuoteToSupabase}>
                Guardar en sistema
              </Button>
              <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Printer className="mr-2 size-4" />
                Imprimir / PDF
              </Button>
            </div>
          </div>

          {/* Printable Quote Container */}
          <div className="bg-white text-black p-0 md:p-8 rounded-lg shadow-sm print:shadow-none print:p-0 text-sm font-sans">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div className="w-48">
                <Logo />
              </div>
              <div className="text-right">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="font-semibold text-red-600 uppercase">Fecha Emisión</div>
                  <div className="font-semibold text-red-600 uppercase">Presupuesto</div>
                  <div className="font-bold border-b border-gray-300 pb-1">{dateStr}</div>
                  <div className="font-bold border-b border-gray-300 pb-1">{quoteNumber}</div>
                </div>
                <div className="mt-4 text-xs font-bold text-red-600">DOCUMENTO SIN VALIDEZ FISCAL</div>
                <div className="text-xs text-gray-500">Nº Registro Industrial: 41-044372</div>
                <div className="text-xs">Email: <span className="font-semibold">NEUMACARMOTORS95@GMAIL.COM</span></div>
              </div>
            </div>

            {/* Entities */}
            <div className="flex gap-8 mb-8">
              <div className="flex-1 border border-gray-300 rounded-lg p-4">
                <h3 className="font-bold mb-2">NEUMACAR MOTORS S.L.</h3>
                <p>Mecanica General y Neumaticos</p>
                <p>B24919698</p>
                <p>Provincia: SEVILLA</p>
                <p>PGIND AUTOPISTA CALLE B, NUM 23</p>
                <p>CP / Localidad: 41020 SEVILLA</p>
                <p>Teléfono: 637075820</p>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-500 font-semibold mb-2">Datos del Cliente</h3>
                <div className="border border-gray-300 rounded-lg p-4 h-[calc(100%-28px)]">
                  <div className="font-bold mb-1 uppercase">{selectedLead.name}</div>
                  <div className="mb-1">
                    <Input 
                      placeholder="Dirección..." 
                      className="h-7 border-0 bg-gray-50 px-2 rounded-sm w-full print:bg-transparent print:p-0 print:h-auto focus-visible:ring-0" 
                      value={clientAddress} 
                      onChange={e => setClientAddress(e.target.value)} 
                    />
                  </div>
                  <p>SEVILLA</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span>CIF / DNI:</span>
                    <Input 
                      placeholder="55775411C" 
                      className="h-7 border-0 bg-gray-50 px-2 rounded-sm flex-1 print:bg-transparent print:p-0 print:h-auto focus-visible:ring-0" 
                      value={clientCif} 
                      onChange={e => setClientCif(e.target.value)} 
                    />
                  </div>
                  <p>Teléfono: {selectedLead.phone}</p>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex border border-gray-300 rounded-lg mb-8 divide-x divide-gray-300">
              <div className="flex-1 p-2">
                <div className="text-gray-500 text-xs mb-1">Matricula</div>
                <div className="font-semibold uppercase">{selectedLead.data?.plate || "-"}</div>
              </div>
              <div className="flex-1 p-2">
                <div className="text-gray-500 text-xs mb-1">Marca</div>
                <div className="font-semibold uppercase">{selectedLead.data?.brand || "-"}</div>
              </div>
              <div className="flex-1 p-2">
                <div className="text-gray-500 text-xs mb-1">Modelo</div>
                <div className="font-semibold uppercase">{selectedLead.data?.model || "-"}</div>
              </div>
              <div className="flex-1 p-2">
                <div className="text-gray-500 text-xs mb-1">Bastidor</div>
                <Input 
                  placeholder="Escribe el bastidor..." 
                  className="h-6 border-0 bg-gray-50 px-1 rounded-sm w-full font-semibold uppercase print:bg-transparent print:p-0 print:h-auto focus-visible:ring-0" 
                  value={vehicleVin} 
                  onChange={e => setVehicleVin(e.target.value)} 
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8 min-h-[200px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-y-2 border-gray-300">
                    <th className="py-2 px-1 w-20">Cantidad</th>
                    <th className="py-2 px-1">Concepto</th>
                    <th className="py-2 px-1 w-24 text-right">Precio</th>
                    <th className="py-2 px-1 w-20 text-center">% Desc.</th>
                    <th className="py-2 px-1 w-28 text-right">Total</th>
                    <th className="py-2 px-1 w-10 print:hidden"></th>
                  </tr>
                </thead>
                <tbody>
                  {quoteItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2 px-1">
                        <Input type="number" className="h-8 print:border-0 print:bg-transparent print:p-0 focus-visible:ring-0" value={item.qty} onChange={(e) => {
                          const newItems = [...quoteItems];
                          newItems[idx].qty = Number(e.target.value);
                          setQuoteItems(newItems);
                        }} />
                      </td>
                      <td className="py-2 px-1">
                        <Input className="h-8 print:border-0 print:bg-transparent print:p-0 focus-visible:ring-0 uppercase font-semibold" value={item.concept} onChange={(e) => {
                          const newItems = [...quoteItems];
                          newItems[idx].concept = e.target.value;
                          setQuoteItems(newItems);
                        }} />
                      </td>
                      <td className="py-2 px-1">
                        <Input type="number" step="0.01" className="h-8 text-right print:border-0 print:bg-transparent print:p-0 focus-visible:ring-0" value={item.price} onChange={(e) => {
                          const newItems = [...quoteItems];
                          newItems[idx].price = Number(e.target.value);
                          setQuoteItems(newItems);
                        }} />
                      </td>
                      <td className="py-2 px-1">
                        <Input type="number" className="h-8 text-center print:border-0 print:bg-transparent print:p-0 focus-visible:ring-0" value={item.discount} onChange={(e) => {
                          const newItems = [...quoteItems];
                          newItems[idx].discount = Number(e.target.value);
                          setQuoteItems(newItems);
                        }} />
                      </td>
                      <td className="py-2 px-1 text-right font-bold">
                        {(item.qty * item.price * (1 - item.discount / 100)).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-2 px-1 print:hidden">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => {
                          setQuoteItems(quoteItems.filter((_, i) => i !== idx));
                        }}>
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 print:hidden">
                <Button variant="outline" size="sm" onClick={() => setQuoteItems([...quoteItems, { qty: 1, concept: "", price: 0, discount: 0 }])}>
                  <Plus className="size-3 mr-1" /> Añadir línea
                </Button>
              </div>
            </div>

            {/* Totals Box */}
            <div className="flex border border-gray-300 rounded-lg mb-8 divide-x divide-gray-300">
               <div className="flex-1 p-2">
                <div className="text-gray-500 text-xs mb-1">Descuento</div>
                <div className="font-semibold">0,00</div>
              </div>
              <div className="flex-1 p-2">
                <div className="text-gray-500 text-xs mb-1">Retención %</div>
                <div className="font-semibold">00,00</div>
              </div>
              <div className="flex-1 p-2">
                <div className="text-gray-500 text-xs mb-1">Franquicia</div>
                <div className="font-semibold"></div>
              </div>
              <div className="flex-1 p-2">
                <div className="text-gray-500 text-xs mb-1">Base imponible</div>
                <div className="font-bold text-lg">{totalBase.toFixed(2).replace('.', ',')}</div>
              </div>
              <div className="flex-1 p-2">
                <div className="text-gray-500 text-xs mb-1">IVA 21%</div>
                <div className="font-bold text-lg">{iva.toFixed(2).replace('.', ',')}</div>
              </div>
              <div className="flex-1 p-2 bg-gray-50">
                <div className="text-gray-500 text-xs mb-1">Importe Total</div>
                <div className="font-bold text-xl">{grandTotal.toFixed(2).replace('.', ',')}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-8 mb-8">
              <div className="flex-[2]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">Kilómetros a la salida del taller:</span>
                  <Input 
                    className="h-8 border-b border-t-0 border-x-0 rounded-none w-32 px-1 print:border-0 print:p-0 focus-visible:ring-0" 
                    value={quoteMileage}
                    onChange={e => setQuoteMileage(e.target.value)}
                  />
                </div>
                <div className="text-lg mb-2">Observaciones:</div>
                <div className="border border-gray-300 rounded-lg p-2 min-h-[60px]">
                  <textarea 
                    className="w-full resize-none border-0 bg-transparent p-0 focus-visible:ring-0 uppercase text-xs font-semibold"
                    rows={2}
                    placeholder="MARCA: MITSUBISHI OUTLANDER..."
                    value={quoteObs}
                    onChange={e => setQuoteObs(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 text-center text-sm font-semibold pt-4">
                <div className="mb-16">Firma y Sello Taller</div>
                {/* Stamp area */}
                <div className="opacity-0 print:opacity-100 italic text-blue-800 border-2 border-blue-800 inline-block px-4 py-2 rounded-lg transform -rotate-6">
                  NEUMACAR MOTOR'S
                  <div className="text-xs">B24919698</div>
                </div>
              </div>
              <div className="flex-1 text-center text-sm font-semibold pt-4">
                Conforme Cliente
              </div>
            </div>

            <div className="text-[10px] text-gray-400 text-justify leading-tight">
              Condiciones generales: La empresa no se responsabiliza de los objetos personales dejados en el interior del vehículo, salvo en caso de negligencia imputable al taller. En caso de impago, el vehículo podrá permanecer retenido hasta el abono íntegro de la factura. Transcurridos 10 días hábiles desde la finalización de la reparación sin que el vehículo haya sido retirado, podrán devengarse gastos de estancia conforme a las tarifas vigentes. El taller podrá ejercer las acciones legales que correspondan para el cobro de la deuda. Los datos personales serán tratados conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD), exclusivamente para la prestación del servicio y el cumplimiento de las obligaciones legales. Las reparaciones reflejadas en la presente factura, incluidos los gastos de mano de obra, contarán con una garantía de tres meses o 2.000 kilómetros recorridos, a partir de la fecha de entrega del vehículo, lo que antes ocurra. La garantía de las piezas sustituidas será la otorgada por el fabricante o garante de dichas piezas.
            </div>

          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden;
              }
              .print\\:hidden {
                display: none !important;
              }
              .print\\:opacity-100 {
                opacity: 1 !important;
              }
              .print\\:border-0 {
                border: none !important;
              }
              .print\\:bg-transparent {
                background: transparent !important;
              }
              .print\\:p-0 {
                padding: 0 !important;
              }
              .print\\:shadow-none {
                box-shadow: none !important;
              }
              .print\\:h-auto {
                height: auto !important;
              }
              .max-w-5xl {
                visibility: visible;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 10mm;
              }
              .max-w-5xl * {
                visibility: visible;
              }
            }
          `}} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase">Solicitudes de Presupuestos</h1>
        <p className="text-sm text-muted-foreground">
          Revisa y genera presupuestos
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/30 uppercase text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Servicio</th>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Cargando presupuestos...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No hay solicitudes de presupuestos todavía.
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-muted/10">
                    <td className="p-4 text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="font-medium capitalize">{l.data?.service || "General"}</span>
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
                              : l.status === "realizado"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="contactado">Contactado</option>
                        <option value="realizado">Realizado / En revisión</option>
                        <option value="perdido">Rechazado</option>
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

      <Dialog open={!!selectedLead && !isBuildingQuote} onOpenChange={(open) => !open && setSelectedLead(null)}>
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

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedLead(null)}>
                  Cerrar
                </Button>
                <Button variant="hero" onClick={handleStartQuote}>
                  <Plus className="mr-2 size-4" />
                  Realizar Presupuesto
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
