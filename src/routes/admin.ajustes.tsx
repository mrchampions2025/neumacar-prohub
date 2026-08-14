import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Settings2, Info } from "lucide-react";

export const Route = createFileRoute("/admin/ajustes")({
  component: AdminAjustes,
});

function AdminAjustes() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    finance_tin: "7.9",
    contact_phone: "+34 600 000 000",
    contact_email: "info@neumacarmotors.com",
    contact_address: "Sevilla",
  });

  // Intentamos cargar los ajustes. Si no existe la tabla, capturamos el error silenciosamente.
  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase.from("site_settings").select("*");
        if (error) {
          console.warn("La tabla site_settings podría no existir aún.", error);
        } else if (data && data.length > 0) {
          const config = data.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
          setSettings((prev) => ({ ...prev, ...config }));
        }
      } catch (err) {
        // Ignorar
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Convertir el objeto settings a formato key-value para la tabla
    const rows = Object.entries(settings).map(([key, value]) => ({ key, value }));

    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });

    if (error) {
      toast.error("Error al guardar ajustes", { description: "Asegúrate de haber ejecutado el script SQL en Supabase." });
    } else {
      toast.success("Ajustes guardados correctamente");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
            Ajustes Generales <Settings2 className="size-6 text-red-500" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configura las variables globales de la web pública.
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading || saving} variant="hero" className="gap-2">
          <Save className="size-4" />
          {saving ? "Guardando..." : "Guardar Ajustes"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel-dark p-6 rounded-2xl border border-zinc-800/80">
          <h2 className="text-xl font-display font-bold text-white uppercase mb-4">Financiación</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                TIN por defecto (%)
              </label>
              <Input
                name="finance_tin"
                value={settings.finance_tin}
                onChange={handleChange}
                placeholder="Ej: 7.9"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
              <p className="text-xs text-zinc-500 mt-1">Se usará en la calculadora de la ficha del vehículo.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel-dark p-6 rounded-2xl border border-zinc-800/80">
          <h2 className="text-xl font-display font-bold text-white uppercase mb-4">Datos de Contacto</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                Teléfono / WhatsApp
              </label>
              <Input
                name="contact_phone"
                value={settings.contact_phone}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                Correo Electrónico
              </label>
              <Input
                name="contact_email"
                value={settings.contact_email}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
                Dirección Física
              </label>
              <Input
                name="contact_address"
                value={settings.contact_address}
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-red-200">
        <h3 className="flex items-center gap-2 font-bold uppercase text-red-400 mb-2">
          <Info className="size-5" /> Importante: Configuración inicial
        </h3>
        <p className="text-sm opacity-90 mb-4">
          Para que estos ajustes funcionen, necesitas ejecutar este comando en el editor SQL de tu panel de Supabase:
        </p>
        <pre className="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-zinc-300 border border-zinc-900 overflow-x-auto">
{`create table public.site_settings (
  key text primary key,
  value text not null
);
alter table public.site_settings enable row level security;
create policy "Public Access" on public.site_settings for select using (true);
create policy "Admin Access" on public.site_settings for all using (true);`}
        </pre>
      </div>
    </div>
  );
}
