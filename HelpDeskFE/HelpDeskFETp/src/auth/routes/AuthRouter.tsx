import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage"; 

export const AuthRouter = () => {
    return (
        <Routes>
            {/* Si entran a cualquier ruta rara dentro de /auth, los manda al login */}
            <Route path="*" element={<Navigate to="login" replace />} />
            
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
};