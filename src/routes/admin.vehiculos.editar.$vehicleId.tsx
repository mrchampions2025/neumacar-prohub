import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload, X, Sparkles, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { CAR_BRANDS, getModelsForBrand } from "@/data/cars";
import { autoFillVehicleSpecs } from "@/services/vehicleSpecsService";

export const Route = createFileRoute("/admin/vehiculos/editar/$vehicleId")({
  component: AdminEditarVehiculo,
});

function AdminEditarVehiculo() {
  const { vehicleId } = Route.useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
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
    status: "publicado",
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

  useEffect(() => {
    async function loadVehicle() {
      setFetching(true);
      const { data, error } = await supabase
        .from("stock_vehicles")
        .select("*")
        .eq("id", vehicleId)
        .maybeSingle();

      if (error || !data) {
        toast.error("Error al cargar los datos del vehículo");
        navigate({ to: "/admin/vehiculos" });
        return;
      }

      const vData: any = data;
      const isKnownBrand = CAR_BRANDS.includes(vData.brand);

      setFormData({
        brand: isKnownBrand ? vData.brand : "Otro",
        customBrand: isKnownBrand ? "" : vData.brand,
        model: vData.model || "",
        version: vData.version || "",
        year: vData.year || new Date().getFullYear(),
        price: vData.price || 0,
        mileage: vData.mileage || 0,
        status: vData.status || "publicado",
        power: vData.power ? vData.power.toString() : "",
        displacement: vData.displacement ? vData.displacement.toString() : "",
        doors: vData.doors || 5,
        seats: vData.seats || 5,
        fuel: vData.fuel || vData.fuel_type || "Gasolina",
        transmission: vData.transmission || "Manual",
        bodyType: vData.body_type || vData.bodyType || "Compacto",
        color: vData.color || "",
        description: vData.description || "",
        equipment: Array.isArray(vData.equipment)
          ? vData.equipment.join("\n")
          : vData.equipment || "",
      });

      setImages(vData.images || vData.image_urls || []);
      setFetching(false);
    }

    loadVehicle();
  }, [vehicleId, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

      const { error } = await supabase.storage.from("vehicle-images").upload(filePath, file);

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

    const equipmentArray = formData.equipment
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const { error } = await supabase
      .from("stock_vehicles")
      .update({
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
        images: images,
        description: formData.description,
        equipment: equipmentArray,
      })
      .eq("id", vehicleId);

    if (error) {
      toast.error("Error al actualizar el vehículo", { description: error.message });
      setLoading(false);
    } else {
      toast.success("Vehículo actualizado correctamente");
      navigate({ to: "/admin/vehiculos" });
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-red-500" />
          <p className="text-sm">Cargando ficha del vehículo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12 animate-fade-in-up">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
        <Button asChild variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
          <Link to="/admin/vehiculos">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Editar Vehículo — {formData.brand} {formData.model}
          </h1>
          <p className="text-sm text-zinc-400">Modifica precios, fotos, equipamiento o datos técnicos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FOTOS */}
        <div className="glass-panel-dark rounded-2xl border border-zinc-800 p-6 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-bold uppercase text-white">Fotografías del Vehículo</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((url, i) => (
              <div
                key={i}
                className="relative h-28 w-36 overflow-hidden rounded-xl border border-zinc-800 group"
              >
                <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-red-600/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}

            <label className="flex h-28 w-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-red-500/40 bg-zinc-900/60 hover:bg-zinc-800 transition-colors">
              <Upload className="mb-1 size-5 text-red-500" />
              <span className="text-xs font-semibold text-red-400">
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
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* DATOS PRINCIPALES */}
          <div className="glass-panel-dark rounded-2xl border border-zinc-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold uppercase text-white">Datos Principales</h2>
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
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Marca *
                </label>
                <select
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value, model: "" })}
                  className="flex h-10 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="">Selecciona la marca</option>
                  {CAR_BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {formData.brand === "Otro" && (
                  <Input
                    className="mt-2 text-xs bg-zinc-900 border-zinc-700 text-white"
                    placeholder="Especifica la marca"
                    value={formData.customBrand}
                    onChange={(e) => setFormData({ ...formData, customBrand: e.target.value })}
                    required
                  />
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Modelo *
                </label>
                {formData.brand === "Otro" ? (
                  <Input
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Escribe el modelo exacto"
                    className="text-xs bg-zinc-900 border-zinc-700 text-white"
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
                      className="flex h-10 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="">
                        {formData.brand ? "Selecciona el modelo" : "Elige una marca primero"}
                      </option>
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
                        className="mt-2 text-xs bg-zinc-900 border-zinc-700 text-white"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                Versión
              </label>
              <Input
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="Ej: Hybrid+ Standard 143 kW"
                className="text-xs bg-zinc-900 border-zinc-700 text-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Año (opcional)
                </label>
                <Input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Ej: 2021"
                  className="text-xs bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Kilómetros *
                </label>
                <Input
                  name="mileage"
                  type="number"
                  required
                  value={formData.mileage}
                  onChange={handleChange}
                  className="text-xs bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Precio (€) *
                </label>
                <Input
                  name="price"
                  type="number"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="text-xs bg-zinc-900 border-zinc-700 text-white font-bold"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="publicado">Publicado</option>
                  <option value="borrador">Borrador</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Combustible
                </label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Eléctrico">Eléctrico</option>
                  <option value="GLP">GLP</option>
                </select>
              </div>
            </div>
          </div>

          {/* ESPECIFICACIONES TÉCNICAS */}
          <div className="glass-panel-dark rounded-2xl border border-zinc-800 p-6 shadow-sm space-y-4">
            <h2 className="font-display text-lg font-bold uppercase text-white">Especificaciones Técnicas</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Transmisión
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Tipo de Carrocería
                </label>
                <Input
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  placeholder="Ej: Compacto, SUV, Sedán"
                  className="text-xs bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Potencia (CV - opcional)
                </label>
                <Input
                  name="power"
                  type="number"
                  value={formData.power}
                  onChange={handleChange}
                  placeholder="Ej: 195 (opcional)"
                  className="text-xs bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Cilindrada (cc)
                </label>
                <Input
                  name="displacement"
                  type="number"
                  value={formData.displacement}
                  onChange={handleChange}
                  placeholder="Ej: 1498"
                  className="text-xs bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Puertas
                </label>
                <Input
                  name="doors"
                  type="number"
                  value={formData.doors}
                  onChange={handleChange}
                  className="text-xs bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Plazas
                </label>
                <Input
                  name="seats"
                  type="number"
                  value={formData.seats}
                  onChange={handleChange}
                  className="text-xs bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                  Color
                </label>
                <Input
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ej: Blanco"
                  className="text-xs bg-zinc-900 border-zinc-700 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIPCIÓN Y EQUIPAMIENTO */}
        <div className="glass-panel-dark rounded-2xl border border-zinc-800 p-6 shadow-sm space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
              Descripción Comercial
            </label>
            <Textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción atractiva del vehículo..."
              className="text-xs bg-zinc-900 border-zinc-700 text-white leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase text-zinc-400">
                Equipamiento de Serie (Formato con punto medio ·)
              </label>
              <span className="text-[10px] text-zinc-500">Un elemento por línea</span>
            </div>
            <Textarea
              name="equipment"
              rows={10}
              value={formData.equipment}
              onChange={handleChange}
              placeholder={`· Sistema de propulsión híbrido (195 CV)\n· Pantalla táctil de 10,25"\n· Apple CarPlay y Android Auto\n· Cámara traserá con sensores`}
              className="text-xs bg-zinc-900 border-zinc-700 text-white font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
          <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <Link to="/admin/vehiculos">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={loading || uploading}
            className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-900/30 font-semibold gap-2 border border-red-500/30"
          >
            <Save className="size-4" />
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
