import { createFileRoute } from "@tanstack/react-router";
import { LocalSeoPage } from "@/components/seo/LocalSeoPage";
import { LOCAL_SEO_LANDINGS } from "@/data/localSeoLandingData";

export const Route = createFileRoute("/taller-multimarca-sevilla")({
  component: TallerMultimarcaSevillaPage,
});

function TallerMultimarcaSevillaPage() {
  const config = LOCAL_SEO_LANDINGS["taller-multimarca-sevilla"];
  return <LocalSeoPage config={config} />;
}
