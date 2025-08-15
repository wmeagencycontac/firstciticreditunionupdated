import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { isSupabaseConfigured } from "@/lib/supabase";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // If Supabase is not configured, allow access for development
  if (!isSupabaseConfigured) {
    console.warn(
      "Development mode: Supabase not configured, bypassing authentication",
    );
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
