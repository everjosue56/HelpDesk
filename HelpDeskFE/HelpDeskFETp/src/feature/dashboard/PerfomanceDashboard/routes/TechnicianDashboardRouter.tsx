import { Navigate, Route, Routes } from "react-router-dom";
import { TechnicianDashboardPage } from "../pages/TechnicianDashboardPage";

export const TechnicialDashboardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<TechnicianDashboardPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};  