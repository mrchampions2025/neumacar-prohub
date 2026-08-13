import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/vehiculos/nuevo")({
  component: AdminNuevoVehiculo,
});

function AdminNuevoVehiculo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    version: "",
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    status: "borrador",
    power: "",
    displacement: "",
    doors: 5,
    seats: 5,
    fuel: "Gasolina",
    transmission: "Manual",
    bodyType: "Compacto",
    color: "",
    description: "",
    equipment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (!file) continue;
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error, data } = await supabase.storage.from("vehicle-images").upload(filePath, file);

      if (error) {
        toast.error(`Error al subir ${file.name}`);
        console.error(error);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("vehicle-images")
          .getPublicUrl(filePath);

        newImages.push(publicUrlData.publicUrl);
      }
    }

    setImages([...images, ...newImages]);
    setUploading(false);
    toast.success("Imágenes subidas");
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const id =
      `${formData.brand.toLowerCase()}-${formData.model.toLowerCase()}-${Date.now()}`.replace(
        /\s+/g,
        "-",
      );

    // Convert equipment string to array
    const equipmentArray = formData.equipment
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const { error } = await supabase.from("stock_vehicles").insert([
      {
        id,
        brand: formData.brand,
        model: formData.model,
        version: formData.version,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        status: formData.status,
        fuel: formData.fuel,
        transmission: formData.transmission,
        power: Number(formData.power) || 0,
        displacement: Number(formData.displacement) || 0,
        doors: Number(formData.doors),
        seats: Number(formData.seats),
        color: formData.color,
        body_type: formData.bodyType,
        env_label: "C", // Simplificado
        images: images,
        description: formData.description,
        equipment: equipmentArray,
        condition: {
          general: "Bueno",
          itv: "En vigor",
          maintenance: "Al día",
          tyres: "Buen estado",
          brakes: "Buen estado",
          history: "Desconocido",
        },
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
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/admin/vehiculos">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold uppercase">Añadir Vehículo</h1>
          <p className="text-sm text-muted-foreground">Completa la ficha técnica y sube fotos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FOTOS */}
        <div className="surface-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-semibold uppercase">Fotografías</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((url, i) => (
              <div
                key={i}
                className="relative h-24 w-32 overflow-hidden rounded-md border border-border"
              >
                <img src={url} alt={`Preview ${i}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/80"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}

            <label className="flex h-24 w-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors">
              <Upload className="mb-1 size-5 text-primary" />
              <span className="text-xs text-primary">
                {uploading ? "Subiendo..." : "Añadir fotos"}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Nota: Debes haber creado el bucket "vehicle-images" en Supabase primero.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* DATOS PRINCIPALES */}
          <div className="surface-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h2 className="font-display text-lg font-semibold uppercase">Datos Principales</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Marca *
                </label>
                <Input
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ej: BMW"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Modelo *
                </label>
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
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                Versión
              </label>
              <Input
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="Ej: 118i Sport 140 CV"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Año *
                </label>
                <Input
                  name="year"
                  type="number"
                  required
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Kilómetros *
                </label>
                <Input
                  name="mileage"
                  type="number"
                  required
                  value={formData.mileage}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Precio (€) *
                </label>
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
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                Estado
              </label>
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
          </div>

          {/* FICHA TÉCNICA */}
          <div className="surface-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h2 className="font-display text-lg font-semibold uppercase">Ficha Técnica</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Combustible
                </label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="GLP">GLP</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Cambio
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Carrocería
                </label>
                <select
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Compacto">Compacto</option>
                  <option value="Sedán">Sedán</option>
                  <option value="SUV">SUV</option>
                  <option value="Familiar">Familiar</option>
                  <option value="Coupé">Coupé</option>
                  <option value="Monovolumen">Monovolumen</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Color
                </label>
                <Input
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ej: Blanco"
                />
              </div>
            </div>

            <div className="grid gap-4 grid-cols-4">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Potencia (CV)
                </label>
                <Input
                  name="power"
                  type="number"
                  value={formData.power}
                  onChange={handleChange}
                  placeholder="150"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Motor (cc)
                </label>
                <Input
                  name="displacement"
                  type="number"
                  value={formData.displacement}
                  onChange={handleChange}
                  placeholder="1998"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Puertas
                </label>
                <Input name="doors" type="number" value={formData.doors} onChange={handleChange} />
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Plazas
                </label>
                <Input name="seats" type="number" value={formData.seats} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* TEXTOS */}
        <div className="surface-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-semibold uppercase">
            Descripción y Equipamiento
          </h2>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
              Descripción pública
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el estado del vehículo, mantenimientos recientes, etc."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
              Equipamiento destacado (uno por línea)
            </label>
            <Textarea
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              placeholder="Navegador GPS&#10;Faros LED&#10;Sensores de aparcamiento"
              className="min-h-[120px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/admin/vehiculos" })}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="hero" disabled={loading || uploading} size="lg">
            <Save className="mr-2 size-5" />
            {loading ? "Guardando..." : "Guardar Vehículo en Inventario"}
          </Button>
        </div>
      </form>
    </div>
  );
}
