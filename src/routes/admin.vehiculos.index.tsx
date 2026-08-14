import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Car, LayoutGrid, List, Gauge, Calendar, Tag, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { StockVehicle } from "@/data/vehicles";
import { generateVehicleSlug } from "@/utils/seo";

export const Route = createFileRoute("/admin/vehiculos/")({
  component: AdminVehiculos,
});

function AdminVehiculos() {
  const [vehicles, setVehicles] = useState<StockVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

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
      toast.success("Vehículo eliminado correctamente");
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const query = search.toLowerCase();
    const matchesSearch =
      v.brand.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query) ||
      (v.version && v.version.toLowerCase().includes(query));
    
    const matchesStatus = statusFilter === "todos" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
            Inventario de Vehículos <Car className="size-6 text-red-500" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Gestión centralizada del stock de turismos, suv y furgonetas de ocasión.
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-900/30 font-semibold gap-2 border border-red-500/30 shrink-0"
        >
          <Link to="/admin/vehiculos/nuevo">
            <Plus className="size-4" /> Añadir Vehículo
          </Link>
        </Button>
      </div>

      {/* Control Bar */}
      <div className="glass-panel-dark rounded-2xl p-4 border border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs">
            {["todos", "publicado", "borrador", "vendido"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                  statusFilter === st
                    ? "bg-red-600 text-white shadow-md shadow-red-950"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "table" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Vista de Tabla"
            >
              <List className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Vista de Cuadrícula"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="glass-panel-dark rounded-2xl p-12 text-center text-zinc-400 border border-zinc-800">
          <p className="animate-pulse">Cargando inventario de vehículos...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="glass-panel-dark rounded-2xl p-12 text-center text-zinc-400 border border-zinc-800 space-y-3">
          <Car className="size-10 mx-auto text-zinc-600" />
          <h3 className="text-white font-bold text-lg uppercase font-display">No se encontraron vehículos</h3>
          <p className="text-xs text-zinc-500">Prueba con otra búsqueda o añade un vehículo al inventario.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="glass-panel-dark rounded-2xl border border-zinc-800/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="p-4 font-semibold">Vehículo</th>
                  <th className="p-4 font-semibold">Precio</th>
                  <th className="p-4 font-semibold">Año / Kilometraje</th>
                  <th className="p-4 font-semibold">Combustible / Cambio</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredVehicles.map((v) => {
                  const imageUrl = v.images?.[0] || (v as any).image_urls?.[0];
                  const fuelName = v.fuel || (v as any).fuel_type || "Desconocido";

                  return (
                    <tr key={v.id} className="transition-colors hover:bg-zinc-900/50 group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center text-zinc-600">
                            {imageUrl ? (
                              <img src={imageUrl} alt={v.brand} className="w-full h-full object-cover" />
                            ) : (
                              <Car className="size-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-red-400 transition-colors">
                              {v.brand} {v.model}
                            </div>
                            <div className="text-[11px] text-zinc-400 truncate max-w-xs">{v.version || "Versión Estándar"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-base text-white font-display">
                          {v.price.toLocaleString("es-ES")} €
                        </span>
                      </td>
                      <td className="p-4 text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3 text-zinc-500" />
                          <span>{v.year}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                          <Gauge className="size-3 text-zinc-500" />
                          <span>{v.mileage.toLocaleString("es-ES")} km</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-300">
                        <div className="capitalize">{fuelName}</div>
                        <div className="text-[11px] text-zinc-500 capitalize">{v.transmission}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
                            v.status === "publicado"
                              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                              : v.status === "vendido"
                                ? "bg-red-950/60 text-red-400 border-red-800/60"
                                : "bg-amber-950/60 text-amber-400 border-amber-800/60"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              v.status === "publicado"
                                ? "bg-emerald-400"
                                : v.status === "vendido"
                                  ? "bg-red-400"
                                  : "bg-amber-400"
                            }`}
                          ></span>
                          <span className="capitalize">{v.status}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5 items-center">
                          <a
                            href={`/coches/${generateVehicleSlug(v)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Ver en la Web"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="text-amber-400 hover:bg-amber-950/40 hover:text-amber-300"
                            title="Editar Vehículo"
                          >
                            <Link to="/admin/vehiculos/editar/$vehicleId" params={{ vehicleId: v.id }}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:bg-red-950/40 hover:text-red-300"
                            onClick={() => handleDelete(v.id)}
                            title="Eliminar Vehículo"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((v) => {
            const imageUrl = v.images?.[0] || (v as any).image_urls?.[0];
            const fuelName = v.fuel || (v as any).fuel_type || "Desconocido";

            return (
              <div
                key={v.id}
                className="glass-panel-dark rounded-2xl overflow-hidden border border-zinc-800 hover-card-lift flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 bg-zinc-900 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={`${v.brand} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Car className="size-12" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border backdrop-blur-md ${
                          v.status === "publicado"
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-600/50"
                            : v.status === "vendido"
                              ? "bg-red-950/80 text-red-300 border-red-600/50"
                              : "bg-amber-950/80 text-amber-300 border-amber-600/50"
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-zinc-950/90 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-800">
                      <span className="font-display font-extrabold text-white text-base">
                        {v.price.toLocaleString("es-ES")} €
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-red-400 transition-colors uppercase">
                        {v.brand} {v.model}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">{v.version || "Sin versión especificada"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Calendar className="size-3.5 text-red-500" />
                        <span>{v.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Gauge className="size-3.5 text-red-500" />
                        <span>{v.mileage.toLocaleString("es-ES")} km</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400 capitalize">
                        <Tag className="size-3.5 text-red-500" />
                        <span>{fuelName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400 capitalize">
                        <Car className="size-3.5 text-red-500" />
                        <span>{v.transmission}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between">
                  <a
                    href={`/coches/${generateVehicleSlug(v)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    Ver Ficha Web <ExternalLink className="size-3" />
                  </a>
                  <div className="flex items-center gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-amber-400 hover:bg-amber-950/40 hover:text-amber-300 text-xs gap-1"
                    >
                      <Link to="/admin/vehiculos/editar/$vehicleId" params={{ vehicleId: v.id }}>
                        <Pencil className="size-3.5" /> Editar
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-red-950/40 hover:text-red-300 text-xs gap-1"
                      onClick={() => handleDelete(v.id)}
                    >
                      <Trash2 className="size-3.5" /> Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
