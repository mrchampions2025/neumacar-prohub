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
          <h1 className="font-display text-2xl font-bold uppercase">Vehículos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el inventario de coches de ocasión
          </p>
        </div>
        <Button asChild variant="hero">
          <Link to="/admin/vehiculos/nuevo">
            <Plus className="mr-2 size-4" /> Añadir Vehículo
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/30 uppercase text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Vehículo</th>
                <th className="p-4 font-medium">Precio</th>
                <th className="p-4 font-medium">Año/Km</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Cargando vehículos...
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No hay vehículos en el inventario.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-muted/10">
                    <td className="p-4">
                      <div className="font-medium text-foreground">
                        {v.brand} {v.model}
                      </div>
                      <div className="text-xs text-muted-foreground">{v.version}</div>
                    </td>
                    <td className="p-4 font-medium">{v.price} €</td>
                    <td className="p-4">
                      {v.year} <br />
                      <span className="text-xs text-muted-foreground">{v.mileage} km</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          v.status === "publicado"
                            ? "bg-primary/10 text-primary"
                            : v.status === "vendido"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/10 text-warning"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Editar (Próximamente)">
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
