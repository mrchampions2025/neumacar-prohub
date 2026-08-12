import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Error al iniciar sesión", { description: error.message });
      setLoading(false);
    } else {
      toast.success("Sesión iniciada correctamente");
      navigate({ to: "/admin" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="surface-card w-full max-w-md rounded-xl p-8 shadow-sm">
        <div className="mx-auto mb-6 w-fit rounded-full bg-primary/10 p-4">
          <KeyRound className="size-8 text-primary" />
        </div>
        <h1 className="text-center font-display text-2xl font-bold uppercase text-foreground">
          Acceso Administrador
        </h1>
        <p className="mb-8 mt-2 text-center text-sm text-muted-foreground">
          Introduce tus credenciales para acceder al panel de control.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="email">
              Correo Electrónico
            </label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@neumacarmotors.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="password">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" variant="hero" className="mt-4 w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Entrar al Panel"}
          </Button>
        </form>
      </div>
    </div>
  );
}
