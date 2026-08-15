import { createFileRoute } from "@tanstack/react-router";
import { LocalSeoPage } from "@/components/seo/LocalSeoPage";
import { LOCAL_SEO_LANDINGS } from "@/data/localSeoLandingData";

export const Route = createFileRoute("/aire-acondicionado-sevilla")({
  component: AireAcondicionadoSevillaPage,
});

function AireAcondicionadoSevillaPage() {
  const config = LOCAL_SEO_LANDINGS["aire-acondicionado-sevilla"];
  return <LocalSeoPage config={config} />;
}
