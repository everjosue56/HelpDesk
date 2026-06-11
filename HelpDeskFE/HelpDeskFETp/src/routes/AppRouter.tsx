import { Routes, Route, Navigate } from "react-router-dom";
import { AuthRouter } from "../auth/routes/AuthRouter"; 
import { DashBoardRouter } from "@/dashboard/routes/DashboardRouter";
import { useAuth } from "@/context/AuthContext";
import { OrganizationsRouter } from "@/administrative/organizations/routes/OrganizationsRouter";

export const AppRouter = () => {
 const { isAuthenticated, isLoading } = useAuth();

  // Mientras el contexto lee el LocalStorage, mostramos una pantalla de carga limpia
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-neutral-50 font-sans">
        <p className="text-sm font-medium text-neutral-500 animate-pulse">Cargando sistema...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Si está autenticado, la raíz lo manda al Dashboard. Si no, al Login */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth/login"} replace />} />
      
      {/* Rutas Públicas (Login) */}
      <Route path="/auth/*" element={!isAuthenticated ? <AuthRouter /> : <Navigate to="/dashboard" replace />} />

      {/* Rutas Protegidas (Dashboard) */}
      <Route path="/dashboard/*" element={isAuthenticated ? <DashBoardRouter /> : <Navigate to="/auth/login" replace />} />
      <Route path="*" element={<h2>404 - Not Found</h2>} />
    </Routes>
  );
};