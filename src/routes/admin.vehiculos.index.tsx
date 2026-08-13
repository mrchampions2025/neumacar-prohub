import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { StockVehicle } from "@/data/vehicles";

export const Route = createFileRoute("/admin/vehiculos/")({
  component: AdminVehiculos,
});

function AdminVehiculos() {
  const [vehicles, setVehicles] = useState<StockVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("stock_vehicles")
      .select("*")
      .order("brand", { ascending: true });

    if (error) {
      toast.error("Error al cargar vehículos");
    } else {
      setVehicles(data as unknown as StockVehicle[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este vehículo?")) return;

    const { error } = await supabase.from("stock_vehicles").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Vehículo eliminado");
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-slate-800">Vehículos</h1>
          <p className="text-sm text-slate-500">
            Gestiona el inventario de coches de ocasión
          </p>
        </div>
        <Button asChild variant="hero">
          <Link to="/admin/vehiculos/nuevo">
            <Plus className="mr-2 size-4" /> Añadir Vehículo
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase text-slate-500">
              <tr>
                <th className="p-4 font-medium">Vehículo</th>
                <th className="p-4 font-medium">Precio</th>
                <th className="p-4 font-medium">Año/Km</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Cargando vehículos...
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No hay vehículos en el inventario.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">
                        {v.brand} {v.model}
                      </div>
                      <div className="text-xs text-slate-500">{v.version}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{v.price} €</td>
                    <td className="p-4 text-slate-800">
                      {v.year} <br />
                      <span className="text-xs text-slate-500">{v.mileage} km</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          v.status === "publicado"
                            ? "bg-blue-100 text-blue-700"
                            : v.status === "vendido"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Editar (Próximamente)" className="text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(v.id)}
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
    </div>
  );
}
