import { createFileRoute } from "@tanstack/react-router";
import { LocalSeoPage } from "@/components/seo/LocalSeoPage";
import { LOCAL_SEO_LANDINGS } from "@/data/localSeoLandingData";

export const Route = createFileRoute("/taller-mecanico-sevilla")({
  component: TallerMecanicoSevillaPage,
});

function TallerMecanicoSevillaPage() {
  const config = LOCAL_SEO_LANDINGS["taller-mecanico-sevilla"];
  return <LocalSeoPage config={config} />;
}
