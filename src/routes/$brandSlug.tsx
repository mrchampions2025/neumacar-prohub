import { createFileRoute, notFound } from "@tanstack/react-router";
import { VehiclesList } from "@/components/vehicles/VehiclesList";
import { fetchPublishedVehicles } from "@/data/vehicles";
import { generateBrandSEO } from "@/utils/seo";
import { CAR_BRANDS } from "@/data/cars";

export const Route = createFileRoute("/$brandSlug")({
  loader: async ({ params }) => {
    // Only process if it ends with -segunda-mano-sevilla
    if (!params.brandSlug.endsWith("-segunda-mano-sevilla")) {
      throw notFound();
    }
    
    // Extract the brand slug (e.g. "audi" from "audi-segunda-mano-sevilla")
    const brandSlug = params.brandSlug.replace("-segunda-mano-sevilla", "");
    const normalizedBrand = brandSlug.toLowerCase();
    
    // Check if valid brand
    const isValid = CAR_BRANDS.some(b => b.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedBrand);
    if (!isValid) throw notFound();

    const seo = generateBrandSEO(brandSlug);
    const vehicles = await fetchPublishedVehicles();
    
    // Find the original brand name case from our list to filter
    const realBrand = CAR_BRANDS.find(b => b.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedBrand);

    return { vehicles, seo, realBrand };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Marca no encontrada" }, { name: "robots", content: "noindex" }] };
    }
    const { seo } = loaderData;
    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
      ],
    };
  },
  component: BrandOcasionPage,
});

function BrandOcasionPage() {
  const { vehicles, seo, realBrand } = Route.useLoaderData();

  return (
    <VehiclesList 
      vehicles={vehicles}
      defaultFilters={{ brand: realBrand || "all" }}
      title={seo.h1}
      eyebrow="Marcas"
    />
  );
}
