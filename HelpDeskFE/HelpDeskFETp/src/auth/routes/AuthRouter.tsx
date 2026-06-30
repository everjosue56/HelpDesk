import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";

export const AuthRouter = () => {
    return (
        <Routes>
            {/* Si entran a cualquier ruta rara dentro de /auth, los manda al login */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="*" element={<Navigate to="login" replace />} />

        </Routes>
    );
};