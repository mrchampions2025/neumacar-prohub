import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LayoutDashboard, Car, Users, LogOut, CalendarClock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar la sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // Si no hay sesión y no estamos en la página de login, redirigir
      if (!session && window.location.pathname !== "/admin/login") {
        navigate({ to: "/admin/login" });
      }
    });

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && window.location.pathname !== "/admin/login") {
        navigate({ to: "/admin/login" });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si estamos en login, solo renderizamos el contenido (el formulario)
  if (window.location.pathname === "/admin/login") {
    return <Outlet />;
  }

  // Si no hay sesión, no deberíamos llegar aquí (el useEffect redirige), pero por seguridad:
  if (!session) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20 md:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-r border-border bg-background p-4 md:w-64 md:shrink-0 md:p-6">
        <div className="mb-8 font-display text-xl font-bold uppercase text-primary">
          Panel Admin
        </div>
        <nav className="flex flex-col gap-2">
          <Button asChild variant="ghost" className="justify-start">
            <Link to="/admin" className="[&.active]:bg-primary/10 [&.active]:text-primary">
              <LayoutDashboard className="mr-2 size-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link
              to="/admin/vehiculos"
              className="[&.active]:bg-primary/10 [&.active]:text-primary"
            >
              <Car className="mr-2 size-4" />
              Vehículos
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link to="/admin/citas" className="[&.active]:bg-primary/10 [&.active]:text-primary">
              <CalendarClock className="mr-2 size-4" />
              Citas
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link to="/admin/leads" className="[&.active]:bg-primary/10 [&.active]:text-primary">
              <Users className="mr-2 size-4" />
              Otros Leads
            </Link>
          </Button>
        </nav>

        <div className="mt-auto pt-8">
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 size-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
