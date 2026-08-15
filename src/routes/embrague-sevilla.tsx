import { createFileRoute } from "@tanstack/react-router";
import { LocalSeoPage } from "@/components/seo/LocalSeoPage";
import { LOCAL_SEO_LANDINGS } from "@/data/localSeoLandingData";

export const Route = createFileRoute("/embrague-sevilla")({
  component: EmbragueSevillaPage,
});

function EmbragueSevillaPage() {
  const config = LOCAL_SEO_LANDINGS["embrague-sevilla"];
  return <LocalSeoPage config={config} />;
}
