import { createFileRoute } from "@tanstack/react-router";
import { LocalSeoPage } from "@/components/seo/LocalSeoPage";
import { LOCAL_SEO_LANDINGS } from "@/data/localSeoLandingData";

export const Route = createFileRoute("/cambio-aceite-sevilla")({
  component: CambioAceiteSevillaPage,
});

function CambioAceiteSevillaPage() {
  const config = LOCAL_SEO_LANDINGS["cambio-aceite-sevilla"];
  return <LocalSeoPage config={config} />;
}
