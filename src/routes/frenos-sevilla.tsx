import { createFileRoute } from "@tanstack/react-router";
import { LocalSeoPage } from "@/components/seo/LocalSeoPage";
import { LOCAL_SEO_LANDINGS } from "@/data/localSeoLandingData";

export const Route = createFileRoute("/frenos-sevilla")({
  component: FrenosSevillaPage,
});

function FrenosSevillaPage() {
  const config = LOCAL_SEO_LANDINGS["frenos-sevilla"];
  return <LocalSeoPage config={config} />;
}
