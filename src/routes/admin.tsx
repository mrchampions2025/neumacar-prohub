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
    <div className="flex min-h-screen flex-col md:flex-row bg-[#f8fafc]">
      {/* Sidebar - Deep Navy Theme */}
      <aside className="w-full bg-[#0f172a] text-slate-300 p-4 md:w-64 md:shrink-0 md:p-6 flex flex-col shadow-xl z-10">
        <div className="mb-8 font-display text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <LayoutDashboard className="size-4 text-white" />
          </div>
          ProHub
        </div>
        
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Navegación
        </div>
        
        <nav className="flex flex-col gap-1">
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-800 hover:text-white transition-all text-slate-300">
            <Link to="/admin" className="[&.active]:bg-gradient-to-r [&.active]:from-blue-600/20 [&.active]:to-indigo-600/20 [&.active]:text-blue-400 [&.active]:border-l-2 [&.active]:border-blue-500 rounded-none rounded-r-md">
              <LayoutDashboard className="mr-3 size-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-800 hover:text-white transition-all text-slate-300">
            <Link
              to="/admin/vehiculos"
              className="[&.active]:bg-gradient-to-r [&.active]:from-blue-600/20 [&.active]:to-indigo-600/20 [&.active]:text-blue-400 [&.active]:border-l-2 [&.active]:border-blue-500 rounded-none rounded-r-md"
            >
              <Car className="mr-3 size-4" />
              Vehículos
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-800 hover:text-white transition-all text-slate-300">
            <Link to="/admin/citas" className="[&.active]:bg-gradient-to-r [&.active]:from-blue-600/20 [&.active]:to-indigo-600/20 [&.active]:text-blue-400 [&.active]:border-l-2 [&.active]:border-blue-500 rounded-none rounded-r-md">
              <CalendarClock className="mr-3 size-4" />
              Citas
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-800 hover:text-white transition-all text-slate-300">
            <Link to="/admin/presupuestos" className="[&.active]:bg-gradient-to-r [&.active]:from-blue-600/20 [&.active]:to-indigo-600/20 [&.active]:text-blue-400 [&.active]:border-l-2 [&.active]:border-blue-500 rounded-none rounded-r-md">
              <Users className="mr-3 size-4" />
              Presupuestos
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-800 hover:text-white transition-all text-slate-300">
            <Link to="/admin/leads" className="[&.active]:bg-gradient-to-r [&.active]:from-blue-600/20 [&.active]:to-indigo-600/20 [&.active]:text-blue-400 [&.active]:border-l-2 [&.active]:border-blue-500 rounded-none rounded-r-md">
              <Car className="mr-3 size-4" />
              Tasaciones
            </Link>
          </Button>
        </nav>

        <div className="mt-auto pt-8">
          <div className="bg-slate-800/50 p-4 rounded-xl mb-4 border border-slate-700/50">
            <div className="text-sm font-semibold text-white mb-1">Neumacar Motors</div>
            <div className="text-xs text-slate-400">Admin privileges</div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 size-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-200/50 to-transparent -z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
