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
    <div className="flex min-h-screen flex-col md:flex-row bg-[#f4f7f6]">
      {/* Sidebar - MediaCP Light Theme */}
      <aside className="w-full bg-white border-r border-slate-200 p-0 md:w-64 md:shrink-0 flex flex-col z-10 shadow-[2px_0_15px_-3px_rgba(0,0,0,0.05)]">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 font-display text-xl font-bold text-slate-800 tracking-tight gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1da1f2] flex items-center justify-center shadow-md shadow-[#1da1f2]/30">
            <LayoutDashboard className="size-4 text-white" />
          </div>
          <span className="text-[#1da1f2]">Pro</span>Hub
        </div>
        
        <nav className="flex flex-col gap-1 p-4">
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-50 hover:text-slate-900 transition-all text-slate-600 font-medium">
            <Link to="/admin" className="[&.active]:bg-[#1da1f2] [&.active]:text-white [&.active]:shadow-md [&.active]:shadow-[#1da1f2]/30 rounded-md">
              <LayoutDashboard className="mr-3 size-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-50 hover:text-slate-900 transition-all text-slate-600 font-medium">
            <Link
              to="/admin/vehiculos"
              className="[&.active]:bg-[#1da1f2] [&.active]:text-white [&.active]:shadow-md [&.active]:shadow-[#1da1f2]/30 rounded-md"
            >
              <Car className="mr-3 size-4" />
              Vehículos
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-50 hover:text-slate-900 transition-all text-slate-600 font-medium">
            <Link to="/admin/citas" className="[&.active]:bg-[#1da1f2] [&.active]:text-white [&.active]:shadow-md [&.active]:shadow-[#1da1f2]/30 rounded-md">
              <CalendarClock className="mr-3 size-4" />
              Citas
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-50 hover:text-slate-900 transition-all text-slate-600 font-medium">
            <Link to="/admin/presupuestos" className="[&.active]:bg-[#1da1f2] [&.active]:text-white [&.active]:shadow-md [&.active]:shadow-[#1da1f2]/30 rounded-md">
              <Users className="mr-3 size-4" />
              Presupuestos
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start hover:bg-slate-50 hover:text-slate-900 transition-all text-slate-600 font-medium">
            <Link to="/admin/leads" className="[&.active]:bg-[#1da1f2] [&.active]:text-white [&.active]:shadow-md [&.active]:shadow-[#1da1f2]/30 rounded-md">
              <Car className="mr-3 size-4" />
              Tasaciones
            </Link>
          </Button>
        </nav>

        <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              NM
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">Administrator</div>
              <div className="text-xs text-slate-500">Neumacar Motors</div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-slate-600 bg-white border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 size-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
