import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

export const Route = createFileRoute("/admin/vehiculos/nuevo")({
  component: AdminNuevoVehiculo,
});

function AdminNuevoVehiculo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    version: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    status: "borrador",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const id =
      `${formData.brand.toLowerCase()}-${formData.model.toLowerCase()}-${Date.now()}`.replace(
        /\s+/g,
        "-",
      );

    const { error } = await supabase.from("stock_vehicles").insert([
      {
        id,
        ...formData,
        // Algunos campos obligatorios con valores por defecto para que funcione rápido el ejemplo
        fuel: "Gasolina",
        transmission: "Manual",
        power: 100,
        displacement: 1000,
        doors: 5,
        seats: 5,
        color: "Blanco",
        body_type: "Compacto",
        env_label: "C",
        images: [],
        description: "",
        equipment: [],
        condition: { general: "Bueno" },
      },
    ]);

    if (error) {
      toast.error("Error al guardar el vehículo", { description: error.message });
      setLoading(false);
    } else {
      toast.success("Vehículo añadido correctamente");
      navigate({ to: "/admin/vehiculos" });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/admin/vehiculos">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold uppercase">Añadir Vehículo</h1>
          <p className="text-sm text-muted-foreground">Crea un nuevo coche para el stock</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="surface-card rounded-xl border border-border p-6 shadow-sm space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Marca *</label>
            <Input
              name="brand"
              required
              value={formData.brand}
              onChange={handleChange}
              placeholder="Ej: BMW"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Modelo *</label>
            <Input
              name="model"
              required
              value={formData.model}
              onChange={handleChange}
              placeholder="Ej: Serie 1"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Versión</label>
          <Input
            name="version"
            value={formData.version}
            onChange={handleChange}
            placeholder="Ej: 118i Sport 140 CV"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Año *</label>
            <Input
              name="year"
              type="number"
              required
              value={formData.year}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Kilómetros *</label>
            <Input
              name="mileage"
              type="number"
              required
              value={formData.mileage}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Precio (€) *</label>
            <Input
              name="price"
              type="number"
              required
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="borrador">Borrador (No visible)</option>
            <option value="publicado">Publicado (Visible en web)</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>

        <div className="pt-4 border-t border-border mt-6">
          <Button type="submit" variant="hero" disabled={loading} className="w-full">
            <Save className="mr-2 size-4" />
            {loading ? "Guardando..." : "Guardar Vehículo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
