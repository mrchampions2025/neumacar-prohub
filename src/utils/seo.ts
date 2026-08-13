export function generateVehicleSlug(vehicle: any): string {
  if (!vehicle) return "";
  
  const brand = (vehicle.brand || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const model = (vehicle.model || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  // Format: audi-a3-ocasion-sevilla-872
  return `${brand}-${model}-ocasion-sevilla-${vehicle.id}`;
}

export function parseVehicleIdFromSlug(slug: string): string | null {
  if (!slug) return null;
  // Slugs look like: brand-model-ocasion-sevilla-[id]
  // The ID is the last part of the hyphen-separated string
  const parts = slug.split("-");
  const id = parts[parts.length - 1];
  return id || null;
}

export function generateVehicleSEO(vehicle: any) {
  const brand = vehicle.brand || "";
  const model = vehicle.model || "";
  const year = vehicle.year || "";
  const fuel = vehicle.fuel || "";
  const mileage = vehicle.mileage ? vehicle.mileage.toLocaleString("es-ES") : "";

  const title = `${brand} ${model} segunda mano Sevilla | Neumacar Motors`;
  const h1 = `${brand} ${model} ${year} segunda mano en Sevilla`;
  const description = `${brand} ${model} de segunda mano en Sevilla. ${year} · ${mileage} km · ${fuel}. Equipamiento completo, revisado y garantizado. Financiación disponible en Neumacar Motors.`;

  return { title, h1, description };
}

export function generateBrandSEO(brandSlug: string) {
  // Convert 'mercedes-benz' to 'Mercedes Benz'
  const brand = brandSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${brand} de segunda mano en Sevilla | Neumacar Motors`,
    h1: `${brand} segunda mano en Sevilla`,
    description: `Descubre nuestro stock de ${brand} de segunda mano y ocasión en Sevilla. Vehículos revisados, con garantía y financiación a tu medida en Neumacar Motors.`,
    brand,
  };
}
