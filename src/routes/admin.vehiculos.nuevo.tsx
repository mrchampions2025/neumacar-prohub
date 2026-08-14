import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { CAR_BRANDS, getModelsForBrand } from "@/data/cars";
import { autoFillVehicleSpecs } from "@/services/vehicleSpecsService";

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
    customBrand: "",
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
    conditionGeneral: "Bueno",
    conditionItv: "En vigor",
    conditionMaintenance: "Al día",
    conditionTyres: "Buen estado",
    conditionBrakes: "Buen estado",
    conditionHistory: "Desconocido",
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
    
    const finalBrand = formData.brand === "Otro" ? formData.customBrand : formData.brand;

    const id =
      `${finalBrand.toLowerCase()}-${formData.model.toLowerCase()}-${Date.now()}`.replace(
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
        brand: finalBrand,
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
          general: formData.conditionGeneral || "Bueno",
          itv: formData.conditionItv || "En vigor",
          maintenance: formData.conditionMaintenance || "Al día",
          tyres: formData.conditionTyres || "Buen estado",
          brakes: formData.conditionBrakes || "Buen estado",
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
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold uppercase">Datos Principales</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs bg-zinc-900 border-red-500/40 text-red-400 hover:bg-red-950/40 hover:text-red-300 gap-1.5 shadow-sm"
                onClick={() => {
                  const b = formData.brand === "Otro" ? formData.customBrand : formData.brand;
                  if (!b || !formData.model) {
                    toast.error("Selecciona una Marca y Modelo primero");
                    return;
                  }
                  const specs = autoFillVehicleSpecs(b, formData.model, Number(formData.year), formData.version);
                  setFormData((prev) => ({
                    ...prev,
                    fuel: specs.fuel,
                    transmission: specs.transmission,
                    power: specs.power.toString(),
                    displacement: specs.displacement.toString(),
                    doors: specs.doors,
                    seats: specs.seats,
                    bodyType: specs.bodyType,
                    description: prev.description || specs.description,
                    equipment: specs.equipment.join("\n"),
                  }));
                  toast.success("Especificaciones y equipamiento autorrellenados");
                }}
              >
                <Sparkles className="size-3.5" />
                Autorellenar Ficha
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Marca *
                </label>
                <select
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value, model: "" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecciona la marca</option>
                  {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {formData.brand === "Otro" && (
                  <Input
                    className="mt-2"
                    placeholder="Especifica la marca"
                    value={formData.customBrand}
                    onChange={(e) => setFormData({ ...formData, customBrand: e.target.value })}
                    required
                  />
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                  Modelo *
                </label>
                {formData.brand === "Otro" ? (
                  <Input
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Escribe el modelo exacto"
                  />
                ) : (
                  <div className="space-y-2">
                    <select
                      name="model"
                      required
                      value={getModelsForBrand(formData.brand).includes(formData.model) ? formData.model : formData.model ? "Otro" : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({ ...prev, model: val }));
                      }}
                      disabled={!formData.brand}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                    >
                      <option value="">{formData.brand ? "Selecciona el modelo" : "Elige una marca primero"}</option>
                      {getModelsForBrand(formData.brand).map((m) => (
                        <option key={m} value={m}>
                          {m === "Otro" ? "Añadir otro..." : m}
                        </option>
                      ))}
                    </select>

                    {(formData.model === "Otro" ||
                      (!getModelsForBrand(formData.brand).includes(formData.model) &&
                        formData.model !== "")) && (
                      <Input
                        name="model"
                        value={formData.model === "Otro" ? "" : formData.model}
                        onChange={handleChange}
                        placeholder="Escribe el modelo exacto del vehículo"
                        className="mt-2"
                      />
                    )}
                  </div>
                )}
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
                  Año (opcional)
                </label>
                <Input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Ej: 2021"
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
                  Potencia (CV - opcional)
                </label>
                <Input
                  name="power"
                  type="number"
                  value={formData.power}
                  onChange={handleChange}
                  placeholder="Ej: 150 (opcional)"
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

        {/* ESTADO Y MANTENIMIENTO DEL VEHÍCULO */}
        <div className="surface-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold uppercase">
              Estado y Revisión del Vehículo
            </h2>
            <span className="text-xs text-muted-foreground">Prevalores por defecto modificables</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                Estado general
              </label>
              <select
                name="conditionGeneral"
                value={formData.conditionGeneral}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Impecable">Impecable</option>
                <option value="Excelente">Excelente</option>
                <option value="Muy Bueno">Muy Bueno</option>
                <option value="Bueno">Bueno</option>
                <option value="Aceptable">Aceptable</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                ITV
              </label>
              <select
                name="conditionItv"
                value={formData.conditionItv}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="En vigor">En vigor</option>
                <option value="Recién pasada">Recién pasada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Caducada">Caducada</option>
                <option value="No aplicable">No aplicable</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                Mantenimiento
              </label>
              <select
                name="conditionMaintenance"
                value={formData.conditionMaintenance}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Al día">Al día</option>
                <option value="Recién realizado">Recién realizado</option>
                <option value="Libro oficial">Libro oficial</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                Neumáticos
              </label>
              <select
                name="conditionTyres"
                value={formData.conditionTyres}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Nuevos">Nuevos</option>
                <option value="Buen estado">Buen estado</option>
                <option value="Medio uso">Medio uso</option>
                <option value="Para cambiar">Para cambiar</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase text-muted-foreground">
                Frenos
              </label>
              <select
                name="conditionBrakes"
                value={formData.conditionBrakes}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Nuevos">Nuevos</option>
                <option value="Buen estado">Buen estado</option>
                <option value="Revisados">Revisados</option>
                <option value="Para cambiar">Para cambiar</option>
              </select>
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
